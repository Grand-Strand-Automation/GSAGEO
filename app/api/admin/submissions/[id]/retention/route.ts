import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthorized } from "@/lib/auth/admin";
import { trackConversionEvent } from "@/lib/analytics/events";

type AdminRetentionAction =
  | "mark_retained"
  | "mark_churned"
  | "mark_winback_attempted"
  | "payment_failed"
  | "payment_recovered";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !(await isAdminAuthorized(user.email))) return null;
  return user;
}

async function logEvent({
  submissionId,
  action,
}: {
  submissionId: string;
  action: string;
}) {
  const supabase = createAdminClient();
  const eventName =
    action === "mark_retained"
      ? "plan_reactivated"
      : action === "mark_churned"
        ? "cancellation_completed"
        : action === "mark_winback_attempted"
          ? "winback_email_sent"
          : action === "payment_failed"
            ? "payment_failed"
            : "payment_recovered";

  await supabase.from("geo_subscription_events").insert({
    submission_id: submissionId,
    event_name: eventName,
    initiated_by: "admin",
    metadata_json: { admin_action: action },
  });

  trackConversionEvent(eventName, { submissionId, initiatedBy: "admin" });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: submissionId } = await params;
  const body = (await request.json().catch(() => ({}))) as { action?: AdminRetentionAction };
  const action = body.action;
  const now = new Date().toISOString();

  const patch =
    action === "mark_retained"
      ? {
          subscription_status: "active",
          cancel_at_period_end: false,
          canceled_at: null,
          health_status: "green",
          churn_risk_level: "low",
          winback_eligible: false,
          save_offer_accepted: true,
          retention_last_event_at: now,
          last_contacted_at: now,
        }
      : action === "mark_churned"
        ? {
            subscription_status: "canceled",
            canceled_at: now,
            cancel_at_period_end: false,
            health_status: "red",
            churn_risk_level: "high",
            winback_eligible: true,
            retention_last_event_at: now,
            last_contacted_at: now,
          }
        : action === "mark_winback_attempted"
          ? {
              winback_eligible: false,
              retention_last_event_at: now,
              last_contacted_at: now,
            }
          : action === "payment_failed"
            ? {
                subscription_status: "past_due",
                payment_issue_status: "failed",
                health_status: "yellow",
                churn_risk_level: "medium",
                retention_last_event_at: now,
              }
            : action === "payment_recovered"
              ? {
                  subscription_status: "active",
                  payment_issue_status: null,
                  health_status: "green",
                  churn_risk_level: "low",
                  retention_last_event_at: now,
                }
              : null;

  if (!patch || !action) {
    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("geo_submissions")
    .update(patch)
    .eq("id", submissionId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  await logEvent({ submissionId, action });
  return NextResponse.json({ ok: true, message: "Retention status updated." });
}
