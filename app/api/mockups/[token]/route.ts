import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashMockupToken, type MockupConcept } from "@/lib/mockup/generator";

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { token } = await params;
    if (!token || token.length < 16) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const tokenHash = hashMockupToken(token);

    let { data, error } = await supabase
      .from("geo_mockup_leads")
      .select(
        "id, website_url, business_name, business_category, preferred_style, homepage_goal, notes, concept_json, signals_json, screenshot_url, screenshot_status, created_at, result_viewed_at",
      )
      .eq("access_token_hash", tokenHash)
      .maybeSingle();

    // Older DBs without migration 009 — retry without screenshot columns
    if (error?.code === "PGRST204") {
      console.warn("[mockups/token] Schema missing screenshot columns; retrying lean select");
      ({ data, error } = await supabase
        .from("geo_mockup_leads")
        .select(
          "id, website_url, business_name, business_category, preferred_style, homepage_goal, notes, concept_json, signals_json, created_at, result_viewed_at",
        )
        .eq("access_token_hash", tokenHash)
        .maybeSingle());
    }

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Mockup not found" }, { status: 404 });
    }

    if (!data.result_viewed_at) {
      await supabase
        .from("geo_mockup_leads")
        .update({ result_viewed_at: new Date().toISOString() })
        .eq("id", data.id);
    }

    const concept = data.concept_json as MockupConcept;
    const row = data as typeof data & {
      screenshot_url?: string | null;
      screenshot_status?: string | null;
    };
    // Prefer DB screenshot columns if concept snapshot is missing (older rows / partial saves)
    if (row.screenshot_url && concept?.currentSnapshot) {
      concept.currentSnapshot = {
        ...concept.currentSnapshot,
        screenshotUrl: row.screenshot_url,
        screenshotStatus: (row.screenshot_status as "ready" | "unavailable" | "pending") || "ready",
      };
    }

    return NextResponse.json({
      ok: true,
      mockup: {
        id: data.id,
        website_url: data.website_url,
        business_name: data.business_name,
        business_category: data.business_category,
        preferred_style: data.preferred_style,
        homepage_goal: data.homepage_goal,
        notes: data.notes,
        created_at: data.created_at,
        screenshot_url: row.screenshot_url ?? concept?.currentSnapshot?.screenshotUrl ?? null,
        screenshot_status:
          row.screenshot_status ?? concept?.currentSnapshot?.screenshotStatus ?? null,
        signals: data.signals_json,
        concept,
      },
    });
  } catch (err) {
    console.error("[mockups/token] GET error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { token } = await params;
    const body = await request.json().catch(() => ({}));
    const action = typeof body.action === "string" ? body.action : "";
    const selectedPlan =
      typeof body.selected_plan === "string" ? body.selected_plan : null;

    if (!token || token.length < 16) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const tokenHash = hashMockupToken(token);

    const { data, error } = await supabase
      .from("geo_mockup_leads")
      .select("id")
      .eq("access_token_hash", tokenHash)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Mockup not found" }, { status: 404 });
    }

    if (action === "subscription_cta") {
      await supabase
        .from("geo_mockup_leads")
        .update({
          subscription_cta_clicked_at: new Date().toISOString(),
          selected_plan_intent: selectedPlan,
          status: "cta_clicked",
        })
        .eq("id", data.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[mockups/token] POST error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
