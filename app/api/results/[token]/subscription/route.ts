import { NextResponse } from "next/server";
import {
  CANCELLATION_REASONS,
  DOWNGRADE_PATHS,
  PAUSE_SUPPORT,
  PLAN_COMPARISON_ROWS,
  SAVE_OFFERS,
  SUBSCRIPTION_PLANS,
} from "@/lib/subscriptions/config";
import {
  acceptSaveOffer,
  completeCancellation,
  completeDowngrade,
  getSubscriptionRetentionStateByToken,
  recordComparisonViewed,
  recordPlanViewed,
  selectCancellationReason,
  selectPause,
  startCancellationFlow,
} from "@/lib/subscriptions/retention-service";

export const dynamic = "force-dynamic";

function configPayload() {
  return {
    plans: SUBSCRIPTION_PLANS,
    comparisonRows: PLAN_COMPARISON_ROWS,
    downgradePaths: DOWNGRADE_PATHS,
    cancellationReasons: CANCELLATION_REASONS,
    saveOffers: SAVE_OFFERS,
    pauseSupport: PAUSE_SUPPORT,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const state = await getSubscriptionRetentionStateByToken(token);
  if (!state) {
    return NextResponse.json({ ok: false, error: "Subscription not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, state, config: configPayload() });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    reason?: string;
    detail?: string;
    targetPlan?: string;
    offerType?: string;
  };

  const action = body.action ?? "";
  const result =
    action === "plan_viewed"
      ? await recordPlanViewed(token)
      : action === "comparison_table_viewed"
        ? await recordComparisonViewed(token)
        : action === "cancel_flow_started"
          ? await startCancellationFlow(token)
          : action === "cancellation_reason_selected"
            ? await selectCancellationReason({
                rawToken: token,
                reason: body.reason ?? "other",
                detail: body.detail,
              })
            : action === "save_offer_accepted"
              ? await acceptSaveOffer({
                  rawToken: token,
                  offerType: body.offerType ?? "",
                })
              : action === "downgrade_completed"
                ? await completeDowngrade({
                    rawToken: token,
                    targetPlan: body.targetPlan ?? "",
                    reason: body.detail,
                  })
                : action === "pause_selected"
                  ? await selectPause(token)
                  : action === "cancellation_completed"
                    ? await completeCancellation(token)
                    : { ok: false as const, error: "Unknown action.", status: 400 };

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, message: result.message, state: result.state });
}
