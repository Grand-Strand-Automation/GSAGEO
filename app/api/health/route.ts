import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { classifySupabaseError } from "@/lib/supabase/errors";
import { isEmailConfigured, getFromAddress } from "@/lib/email/config";
import { getSiteUrl } from "@/lib/seo/site-url";

export const dynamic = "force-dynamic";

/**
 * Public readiness probe for core production dependencies.
 * Does not expose secret values.
 */
export async function GET() {
  const checks: Record<string, { ok: boolean; detail: string }> = {};

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    checks.database = {
      ok: false,
      detail: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    };
  } else {
    try {
      const supabase = createAdminClient();
      const { error } = await supabase.from("geo_submissions").select("id").limit(1);
      if (error) {
        const kind = classifySupabaseError(error);
        checks.database = {
          ok: false,
          detail:
            kind === "schema_missing"
              ? "geo_submissions table missing — run supabase/APPLY_ALL.sql"
              : `Database probe failed (${kind})`,
        };
      } else {
        checks.database = { ok: true, detail: "geo_submissions reachable" };
      }
    } catch (err) {
      checks.database = {
        ok: false,
        detail: err instanceof Error ? err.message : "Database probe failed",
      };
    }
  }

  const emailConfigured = isEmailConfigured();
  checks.email = emailConfigured
    ? {
        ok: true,
        detail: `Resend configured · from ${getFromAddress()}`,
      }
    : {
        ok: false,
        detail:
          "RESEND_API_KEY missing — confirmation and results emails will be skipped until set in Vercel",
      };

  checks.cron = process.env.CRON_SECRET?.trim()
    ? { ok: true, detail: "CRON_SECRET configured" }
    : {
        ok: false,
        detail:
          "CRON_SECRET missing — Vercel cron backup for audits/follow-up emails cannot run",
      };

  const siteUrl = getSiteUrl();
  checks.appUrl = {
    ok: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
    detail: process.env.NEXT_PUBLIC_APP_URL?.trim()
      ? `NEXT_PUBLIC_APP_URL=${siteUrl}`
      : `NEXT_PUBLIC_APP_URL unset — defaulting to ${siteUrl} (set this to https://gsageo.vercel.app for working email links)`,
  };

  const ok = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      ok,
      checks,
      message: ok
        ? "Core services ready"
        : "One or more production services need configuration — see checks",
    },
    { status: ok ? 200 : 503 },
  );
}
