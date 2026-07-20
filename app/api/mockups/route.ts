import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mockupRequestSchema } from "@/lib/validation/mockup";
import {
  attachScreenshotToConcept,
  createMockupAccessToken,
  generateMockupConcept,
  markConceptSiteBlocked,
} from "@/lib/mockup/generator";
import { hasUsableSiteContent, withBlockedReason } from "@/lib/mockup/extract-site";
import { captureHomepageScreenshot } from "@/lib/mockup/screenshot";
import {
  generateConceptFieldsWithOpenAi,
  isOpenAiConfigured,
  logOpenAiEnvDiagnostics,
  mergeLlmFieldsIntoConcept,
} from "@/lib/mockup/openai-concept";

export const runtime = "nodejs";
/** Allow enough time for site extract + OpenAI (+ optional retry) + screenshot on Vercel. */
export const maxDuration = 60;

const CHALLENGE_REASON =
  "Site blocked automated access (security / bot protection). Concept will use your business details instead.";

export async function POST(request: Request) {
  const requestStarted = Date.now();

  try {
    // Confirm env once per cold start / request path (no secrets logged)
    logOpenAiEnvDiagnostics();

    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const parsed = mockupRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const input = parsed.data;

    // Run concept generation and screenshot in parallel to stay within Vercel limits
    const [conceptResult, shot] = await Promise.all([
      generateMockupConcept(input),
      captureHomepageScreenshot(input.website_url),
    ]);

    let { concept, signals, generation } = conceptResult;

    const challengeDetected =
      Boolean(signals.blockedReason) ||
      shot.isChallengePage ||
      (!hasUsableSiteContent(signals) && shot.isChallengePage);

    // If Microlink saw a challenge but HTML path didn't mark blocked, fix signals + regenerate AI copy
    if (challengeDetected && !signals.blockedReason) {
      console.info("[mockups]", "challenge detected via screenshot — regenerating with blocked brief");
      signals = withBlockedReason(signals, CHALLENGE_REASON);
      concept = markConceptSiteBlocked(concept, CHALLENGE_REASON);

      if (isOpenAiConfigured()) {
        const llm = await generateConceptFieldsWithOpenAi(input, signals);
        if (llm.ok) {
          concept = mergeLlmFieldsIntoConcept(concept, llm.fields, { usedOpenAi: true });
          generation = {
            source: "openai",
            openAiConfigured: true,
            model: llm.model,
            attempts: llm.attempts,
          };
        } else {
          console.error("[mockups]", "blocked-site OpenAI regenerate failed", {
            error: llm.error,
            errorCode: llm.errorCode,
          });
          generation = {
            source: generation.source,
            openAiConfigured: true,
            openAiError: llm.error,
            openAiErrorCode: llm.errorCode,
            model: generation.model,
            attempts: llm.attempts,
          };
        }
      }
    } else if (signals.blockedReason) {
      concept = markConceptSiteBlocked(concept, signals.blockedReason);
    }

    const allowScreenshot =
      shot.ok &&
      Boolean(shot.imageUrl) &&
      !shot.isChallengePage &&
      !signals.blockedReason &&
      hasUsableSiteContent(signals);

    const screenshotUrl = allowScreenshot ? shot.imageUrl : null;
    const screenshotStatus = screenshotUrl ? "ready" : "unavailable";
    concept = attachScreenshotToConcept(concept, screenshotUrl);

    const { token, tokenHash } = createMockupAccessToken();

    const generationMeta = {
      ...generation,
      elapsedMs: Date.now() - requestStarted,
    };

    console.info("[mockups]", "complete", {
      source: generationMeta.source,
      openAiConfigured: generationMeta.openAiConfigured,
      openAiErrorCode: generationMeta.openAiErrorCode ?? null,
      model: generationMeta.model ?? null,
      screenshot: screenshotStatus,
      elapsedMs: generationMeta.elapsedMs,
      blocked: Boolean(signals.blockedReason),
    });

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("geo_mockup_leads")
      .insert({
        website_url: input.website_url,
        business_name: input.business_name.trim(),
        business_category: input.business_category,
        preferred_style: input.preferred_style,
        homepage_goal: input.homepage_goal,
        notes: input.notes?.trim() || null,
        email: input.email?.trim() || null,
        lead_source: "homepage_mockup",
        concept_json: concept,
        signals_json: {
          ...signals,
          generation: generationMeta,
          screenshotChallenge: shot.isChallengePage,
        },
        access_token_hash: tokenHash,
        status: "previewed",
        screenshot_url: screenshotUrl,
        screenshot_status: screenshotStatus,
      })
      .select("id")
      .single();

    // Safe client-facing generation summary (no raw API errors with payloads)
    const clientGeneration = {
      source: generationMeta.source,
      openAiConfigured: generationMeta.openAiConfigured,
      model: generationMeta.model ?? null,
      usedFallback: generationMeta.source === "rules",
      fallbackReason:
        generationMeta.source === "rules"
          ? generationMeta.openAiErrorCode ??
            (generationMeta.openAiConfigured ? "openai_failed" : "missing_key")
          : null,
    };

    if (error || !data) {
      console.error("[mockups] Insert failed:", error);
      return NextResponse.json({
        ok: true,
        mockupId: null,
        token,
        concept,
        screenshotUrl,
        generation: clientGeneration,
        persisted: false,
        warning: "Preview generated but could not be saved for follow-up yet.",
      });
    }

    return NextResponse.json({
      ok: true,
      mockupId: data.id,
      token,
      concept,
      screenshotUrl,
      generation: clientGeneration,
      persisted: true,
    });
  } catch (err) {
    console.error("[mockups] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
