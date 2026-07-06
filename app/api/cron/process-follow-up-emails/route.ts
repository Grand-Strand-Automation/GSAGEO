import { NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/cron/auth";
import { processFollowUpCadence } from "@/lib/follow-up/processor";

export async function GET(request: Request) {
  const authError = verifyCronRequest(request);
  if (authError) return authError;

  try {
    const sent = await processFollowUpCadence(25);
    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error("[cron/follow-up] Failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Follow-up cron failed" },
      { status: 500 },
    );
  }
}
