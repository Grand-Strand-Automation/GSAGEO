import { NextResponse } from "next/server";
import { verifyCronRequest } from "@/lib/cron/auth";
import { applyDueBillingPeriods } from "@/lib/subscriptions/period-service";

/**
 * Daily billing-period transitions for active / scheduled-cancel subscribers.
 * Applies plan changes, cancels at period end, and enqueues the next fulfillment cycle.
 */
export async function GET(request: Request) {
  const authError = verifyCronRequest(request);
  if (authError) return authError;

  const result = await applyDueBillingPeriods(25);
  return NextResponse.json({ ok: true, ...result });
}
