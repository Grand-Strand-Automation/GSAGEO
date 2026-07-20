import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createMockupAccessToken } from "@/lib/mockup/generator";
import {
  sendMockupRequestConfirmation,
  sendMockupRequestInternalNotice,
} from "@/lib/mockup/request-email";
import { mockupLeadRequestSchema } from "@/lib/validation/mockup-request";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Request-led mockup intake — stores a lead and emails follow-up.
 * Does NOT call OpenAI or generate a live preview.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const parsed = mockupLeadRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const { token, tokenHash } = createMockupAccessToken();

    const preferredStyle =
      input.preferred_style && input.preferred_style.length > 0
        ? input.preferred_style
        : "clean_modern";

    const conceptJson = {
      version: "request-only",
      requestOnly: true,
      interest: input.interest,
      improveGoal: input.improve_goal,
      phone: input.phone?.trim() || null,
    };

    const signalsJson = {
      generationMode: "request_only",
      openAiSkipped: true,
      reason: "live_generation_disabled",
      interest: input.interest,
      improve_goal: input.improve_goal,
      phone: input.phone?.trim() || null,
    };

    const supabase = createAdminClient();
    const baseRow = {
      website_url: input.website_url,
      business_name: input.business_name.trim(),
      business_category: input.business_category,
      preferred_style: preferredStyle,
      homepage_goal: input.improve_goal,
      notes: [
        input.notes?.trim() || null,
        `Interest: ${input.interest}`,
        input.phone?.trim() ? `Phone: ${input.phone.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      email: input.email,
      lead_source: "mockup_request",
      concept_json: conceptJson,
      signals_json: signalsJson,
      access_token_hash: tokenHash,
      status: "contacted" as const,
    };

    const { data, error } = await supabase
      .from("geo_mockup_leads")
      .insert(baseRow)
      .select("id")
      .single();

    if (error || !data) {
      console.error("[mockup-requests] Insert failed:", {
        code: error?.code,
        message: error?.message,
      });
      return NextResponse.json(
        { ok: false, error: "Unable to save your request. Please try again." },
        { status: 500 },
      );
    }

    console.info("[mockup-requests]", "saved", {
      id: data.id,
      interest: input.interest,
      category: input.business_category,
    });

    const [confirm, internal] = await Promise.all([
      sendMockupRequestConfirmation({
        to: input.email,
        businessName: input.business_name.trim(),
        interest: input.interest,
      }),
      sendMockupRequestInternalNotice(input),
    ]);

    if (!confirm.ok) {
      console.error("[mockup-requests] Confirmation email failed:", confirm.error);
    }
    if (!internal.ok) {
      console.error("[mockup-requests] Internal notice failed:", internal.error);
    }

    return NextResponse.json({
      ok: true,
      requestId: data.id,
      token,
      emailSent: confirm.ok && confirm.skipped === false,
      emailSkippedReason:
        confirm.ok && confirm.skipped ? confirm.reason : !confirm.ok ? "send_failed" : null,
    });
  } catch (err) {
    console.error("[mockup-requests] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
