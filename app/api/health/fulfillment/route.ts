import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isEmailConfigured } from "@/lib/email/config";

export const dynamic = "force-dynamic";

/**
 * Public readiness probe for subscription automation (no secrets).
 */
export async function GET() {
  const checks: Record<string, { ok: boolean; detail: string }> = {};

  checks.cronSecret = process.env.CRON_SECRET?.trim()
    ? { ok: true, detail: "CRON_SECRET configured" }
    : {
        ok: false,
        detail: "CRON_SECRET missing — period and fulfillment crons cannot run",
      };

  checks.email = isEmailConfigured()
    ? { ok: true, detail: "Resend configured for monthly summaries" }
    : {
        ok: false,
        detail: "RESEND_API_KEY missing — monthly emails will be skipped",
      };

  checks.appUrl = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim()
    ? { ok: true, detail: "APP_URL configured for email/report links" }
    : {
        ok: false,
        detail: "APP_URL missing — monthly email links may use the default domain",
      };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("geo_fulfillment_cycles").select("id").limit(1);
    if (error) {
      checks.fulfillmentTable = {
        ok: false,
        detail:
          error.code === "42P01" || error.message?.includes("does not exist")
            ? "geo_fulfillment_cycles missing — run supabase/migrations/008_subscription_fulfillment.sql"
            : `Fulfillment table probe failed: ${error.message}`,
      };
    } else {
      checks.fulfillmentTable = { ok: true, detail: "geo_fulfillment_cycles reachable" };
    }

    const { count: awaitingOps } = await supabase
      .from("geo_fulfillment_cycles")
      .select("id", { count: "exact", head: true })
      .eq("status", "awaiting_ops");

    const { count: failed } = await supabase
      .from("geo_fulfillment_cycles")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed");

    checks.opsBacklog = {
      ok: true,
      detail: `awaiting_ops=${awaitingOps ?? 0} · failed=${failed ?? 0}`,
    };
  } catch (err) {
    checks.fulfillmentTable = {
      ok: false,
      detail: err instanceof Error ? err.message : "Fulfillment probe failed",
    };
  }

  const ok = Object.values(checks).every((c) => c.ok);
  return NextResponse.json(
    {
      ok,
      checks,
      message: ok
        ? "Subscription automation ready"
        : "Subscription automation needs configuration — see checks",
    },
    { status: ok ? 200 : 503 },
  );
}
