import { NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/cron/auth";
import { processQueuedJobs } from "@/lib/audit/processor";

/**
 * Vercel Cron backup endpoint for stuck queued audit jobs.
 * Requires Authorization: Bearer CRON_SECRET (set in Vercel env + redeploy).
 */
export async function GET(request: Request) {
  const authError = verifyCronRequest(request);
  if (authError) return authError;

  const processed = await processQueuedJobs(5);
  return NextResponse.json({ ok: true, processed });
}
