import { NextResponse } from "next/server";
import { processQueuedJobs } from "@/lib/audit/processor";

/**
 * Vercel Cron backup endpoint for stuck queued audit jobs.
 * Configure in vercel.json with CRON_SECRET header check.
 * TODO: Add Vercel Cron schedule in dashboard once deployed.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const processed = await processQueuedJobs(5);
  return NextResponse.json({ ok: true, processed });
}
