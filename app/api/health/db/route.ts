import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { classifySupabaseError } from "@/lib/supabase/errors";

export const dynamic = "force-dynamic";

/**
 * Public readiness probe for submission persistence.
 * Does not expose secrets or raw database errors.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        ok: false,
        database: "not_configured",
        message:
          "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("geo_submissions").select("id").limit(1);

    if (error) {
      const kind = classifySupabaseError(error);
      const status = kind === "schema_missing" ? 503 : 500;
      return NextResponse.json(
        {
          ok: false,
          database: kind,
          message:
            kind === "schema_missing"
              ? "geo_submissions table is missing. Run supabase/migrations 001–007 in the Supabase SQL Editor."
              : kind === "permission_denied"
                ? "Service role cannot read geo_submissions. Confirm SUPABASE_SERVICE_ROLE_KEY is the service_role key."
                : kind === "invalid_credentials"
                  ? "Supabase rejected the API credentials. Recheck URL and service_role key in Vercel."
                  : "Database probe failed. Check Vercel logs and Supabase project status.",
        },
        { status },
      );
    }

    return NextResponse.json({
      ok: true,
      database: "ready",
      message: "geo_submissions is reachable.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    const kind = message.includes("Missing NEXT_PUBLIC_SUPABASE")
      ? "not_configured"
      : "unknown";

    return NextResponse.json(
      {
        ok: false,
        database: kind,
        message:
          kind === "not_configured"
            ? "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy."
            : "Database probe failed unexpectedly.",
      },
      { status: 503 },
    );
  }
}
