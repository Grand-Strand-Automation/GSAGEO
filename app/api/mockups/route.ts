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
  mergeLlmFieldsIntoConcept,
} from "@/lib/mockup/openai-concept";

const CHALLENGE_REASON =
  "Site blocked automated access (security / bot protection). Concept will use your business details instead.";

export async function POST(request: Request) {
  try {
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

    // Screenshot after (or with) concept — use meta to detect Cloudflare walls
    let { concept, signals, generation } = await generateMockupConcept(input);
    const shot = await captureHomepageScreenshot(input.website_url);

    const challengeDetected =
      Boolean(signals.blockedReason) ||
      shot.isChallengePage ||
      (!hasUsableSiteContent(signals) && shot.isChallengePage);

    // If Microlink saw a challenge but HTML path didn't mark blocked, fix signals + regenerate AI copy
    if (challengeDetected && !signals.blockedReason) {
      signals = withBlockedReason(signals, CHALLENGE_REASON);
      concept = markConceptSiteBlocked(concept, CHALLENGE_REASON);

      if (isOpenAiConfigured()) {
        const llm = await generateConceptFieldsWithOpenAi(input, signals);
        if (llm.ok) {
          concept = mergeLlmFieldsIntoConcept(concept, llm.fields, { usedOpenAi: true });
          generation = { source: "openai", model: llm.model };
        } else {
          generation = {
            source: generation.source,
            openAiError: llm.error,
            model: generation.model,
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
          generation,
          screenshotChallenge: shot.isChallengePage,
        },
        access_token_hash: tokenHash,
        status: "previewed",
        screenshot_url: screenshotUrl,
        screenshot_status: screenshotStatus,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[mockups] Insert failed:", error);
      return NextResponse.json({
        ok: true,
        mockupId: null,
        token,
        concept,
        screenshotUrl,
        generation,
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
      generation,
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
