import { NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/cron/auth";
import { processQueuedFulfillmentCycles } from "@/lib/subscriptions/fulfillment";

/**
 * Processes queued subscription fulfillment cycles:
 * creates a subscription refresh audit, runs it, emails the monthly summary.
 */
export async function GET(request: Request) {
  const authError = verifyCronRequest(request);
  if (authError) return authError;

  const result = await processQueuedFulfillmentCycles(5);
  return NextResponse.json({ ok: true, ...result });
}
