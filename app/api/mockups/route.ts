import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mockupRequestSchema } from "@/lib/validation/mockup";
import {
  attachScreenshotToConcept,
  createMockupAccessToken,
  generateMockupConcept,
} from "@/lib/mockup/generator";
import { captureHomepageScreenshot } from "@/lib/mockup/screenshot";

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

    const [{ concept: baseConcept, signals, generation }, shot] = await Promise.all([
      generateMockupConcept(input),
      captureHomepageScreenshot(input.website_url),
    ]);

    // Drop challenge-page screenshots when the site was blocked
    const screenshotUrl =
      signals.blockedReason || !shot.ok ? null : shot.imageUrl;
    const screenshotStatus = screenshotUrl ? "ready" : "unavailable";
    const concept = attachScreenshotToConcept(baseConcept, screenshotUrl);
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
        signals_json: { ...signals, generation },
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
