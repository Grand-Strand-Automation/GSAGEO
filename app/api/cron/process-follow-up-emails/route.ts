import { NextResponse } from "next/server";
import { processFollowUpCadence } from "@/lib/follow-up/processor";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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
