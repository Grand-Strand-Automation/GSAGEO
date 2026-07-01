import { createAdminClient } from "@/lib/supabase/admin";
import { hashResultsToken } from "@/lib/results/tokens";
import { trackConversionEvent } from "@/lib/analytics/events";
import type { GeoSubmission, GeoSubscriptionEvent } from "@/lib/types/database";
import {
  CANCELLATION_REASONS,
  PAUSE_SUPPORT,
  SAVE_OFFERS,
  getDowngradePath,
  getPrimaryDowngradeTarget,
  getSaveOfferForReason,
  getSubscriptionPlan,
  isSubscriptionPlanKey,
  type CancellationReason,
  type SaveOfferType,
  type SubscriptionEventName,
  type SubscriptionPlanKey,
} from "@/lib/subscriptions/config";
import { calculateHealthStatus } from "@/lib/subscriptions/health";
import {
  sendCancellationScheduledEmail,
  sendDowngradeConfirmationEmail,
  sendRetentionHelpEmail,
} from "@/lib/subscriptions/emails";

export type SubscriptionRetentionState = {
  submissionId: string;
  companyName: string;
  email: string;
  currentPlan: SubscriptionPlanKey;
  previousPlan: SubscriptionPlanKey | null;
  nextPlan: SubscriptionPlanKey | null;
  subscriptionStatus: string;
  nextBillingAt: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  cancellationReason: CancellationReason | null;
  cancellationReasonDetail: string | null;
  downgradeReason: string | null;
  pauseUntil: string | null;
  saveOfferShown: SaveOfferType | null;
  saveOfferAccepted: boolean | null;
  healthStatus: string;
  churnRiskLevel: string;
  paymentIssueStatus: string | null;
  lastReportViewedAt: string | null;
  lastSummaryViewedAt: string | null;
  lastEngagementAt: string | null;
  winbackEligible: boolean;
  billingProvider: string | null;
  billingCustomerId: string | null;
  billingSubscriptionId: string | null;
  primaryDowngradeTarget: SubscriptionPlanKey | null;
  saveOffer:
    | {
        reason: CancellationReason;
        primary: (typeof SAVE_OFFERS)[SaveOfferType];
        secondary: (typeof SAVE_OFFERS)[SaveOfferType];
      }
    | null;
};

type RetentionActionResult = {
  ok: true;
  message: string;
  state: SubscriptionRetentionState;
} | {
  ok: false;
  error: string;
  status: number;
};

function normalizeReason(reason: string | null | undefined): CancellationReason {
  return CANCELLATION_REASONS.some((item) => item.key === reason)
    ? (reason as CancellationReason)
    : "other";
}

function normalizeOfferType(value: string | null | undefined): SaveOfferType | null {
  return value && value in SAVE_OFFERS ? (value as SaveOfferType) : null;
}

function normalizePlan(value: string | null | undefined): SubscriptionPlanKey {
  return isSubscriptionPlanKey(value) ? value : "growth";
}

function stateFromSubmission(submission: GeoSubmission): SubscriptionRetentionState {
  const currentPlan = normalizePlan(submission.current_plan ?? submission.selected_plan);
  const nextPlan = isSubscriptionPlanKey(submission.next_plan) ? submission.next_plan : null;
  const previousPlan = isSubscriptionPlanKey(submission.previous_plan) ? submission.previous_plan : null;
  const cancellationReason = normalizeReason(submission.cancellation_reason);
  const saveOfferShown = normalizeOfferType(submission.save_offer_shown);
  const saveOffer = submission.cancellation_reason
    ? {
        reason: cancellationReason,
        ...getSaveOfferForReason(cancellationReason),
      }
    : null;

  return {
    submissionId: submission.id,
    companyName: submission.company_name,
    email: submission.work_email,
    currentPlan,
    previousPlan,
    nextPlan,
    subscriptionStatus: submission.subscription_status ?? "lead",
    nextBillingAt: submission.next_billing_at ?? null,
    cancelAtPeriodEnd: Boolean(submission.cancel_at_period_end),
    canceledAt: submission.canceled_at ?? null,
    cancellationReason: submission.cancellation_reason ? cancellationReason : null,
    cancellationReasonDetail: submission.cancellation_reason_detail ?? null,
    downgradeReason: submission.downgrade_reason ?? null,
    pauseUntil: submission.pause_until ?? null,
    saveOfferShown,
    saveOfferAccepted: submission.save_offer_accepted ?? null,
    healthStatus: submission.health_status ?? "green",
    churnRiskLevel: submission.churn_risk_level ?? "low",
    paymentIssueStatus: submission.payment_issue_status ?? null,
    lastReportViewedAt: submission.last_report_viewed_at ?? null,
    lastSummaryViewedAt: submission.last_summary_viewed_at ?? null,
    lastEngagementAt: submission.last_engagement_at ?? null,
    winbackEligible: Boolean(submission.winback_eligible),
    billingProvider: submission.billing_provider ?? null,
    billingCustomerId: submission.billing_customer_id ?? null,
    billingSubscriptionId: submission.billing_subscription_id ?? null,
    primaryDowngradeTarget: getPrimaryDowngradeTarget(currentPlan),
    saveOffer,
  };
}

async function resolveSubmissionByToken(rawToken: string): Promise<GeoSubmission | null> {
  const supabase = createAdminClient();
  const tokenHash = hashResultsToken(rawToken);

  const { data: tokenRow } = await supabase
    .from("geo_result_access_tokens")
    .select("submission_id, revoked_at, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!tokenRow || tokenRow.revoked_at) return null;
  if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) return null;

  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", tokenRow.submission_id)
    .maybeSingle();

  return (submission as GeoSubmission | null) ?? null;
}

async function logSubscriptionEvent({
  submissionId,
  eventName,
  oldPlan,
  newPlan,
  cancellationReason,
  saveOfferType,
  initiatedBy = "user",
  effectiveAt,
  metadata,
}: {
  submissionId: string;
  eventName: SubscriptionEventName;
  oldPlan?: string | null;
  newPlan?: string | null;
  cancellationReason?: string | null;
  saveOfferType?: string | null;
  initiatedBy?: "user" | "admin" | "system";
  effectiveAt?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createAdminClient();
  await supabase.from("geo_subscription_events").insert({
    submission_id: submissionId,
    event_name: eventName,
    old_plan: oldPlan ?? null,
    new_plan: newPlan ?? null,
    cancellation_reason: cancellationReason ?? null,
    save_offer_type: saveOfferType ?? null,
    initiated_by: initiatedBy,
    effective_at: effectiveAt ?? null,
    metadata_json: metadata ?? {},
  });

  trackConversionEvent(eventName, {
    submissionId,
    oldPlan: oldPlan ?? null,
    newPlan: newPlan ?? null,
    cancellationReason: cancellationReason ?? null,
    saveOfferType: saveOfferType ?? null,
  });
}

async function updateSubmissionRetention(
  submissionId: string,
  patch: Partial<GeoSubmission>,
): Promise<GeoSubmission | null> {
  const supabase = createAdminClient();
  const withHealthBase = {
    ...patch,
    retention_last_event_at: new Date().toISOString(),
    last_engagement_at: new Date().toISOString(),
  };
  const health = calculateHealthStatus(withHealthBase);

  const { data } = await supabase
    .from("geo_submissions")
    .update({
      ...withHealthBase,
      health_status: health.healthStatus,
      churn_risk_level: health.churnRiskLevel,
    })
    .eq("id", submissionId)
    .select("*")
    .single();

  return (data as GeoSubmission | null) ?? null;
}

export async function getSubscriptionRetentionStateByToken(
  rawToken: string,
): Promise<SubscriptionRetentionState | null> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return null;
  return stateFromSubmission(submission);
}

export async function getSubscriptionEventsForSubmission(
  submissionId: string,
  limit = 12,
): Promise<GeoSubscriptionEvent[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("geo_subscription_events")
    .select("*")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as GeoSubscriptionEvent[];
}

export async function recordPlanViewed(rawToken: string): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "plan_viewed",
    oldPlan: submission.current_plan ?? submission.selected_plan,
  });

  const updated = await updateSubmissionRetention(submission.id, {});
  return {
    ok: true,
    message: "Plan view recorded.",
    state: stateFromSubmission(updated ?? submission),
  };
}

export async function recordComparisonViewed(rawToken: string): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "comparison_table_viewed",
    oldPlan: submission.current_plan ?? submission.selected_plan,
  });

  const updated = await updateSubmissionRetention(submission.id, {});
  return {
    ok: true,
    message: "Comparison view recorded.",
    state: stateFromSubmission(updated ?? submission),
  };
}

export async function startCancellationFlow(rawToken: string): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  const plan = normalizePlan(submission.current_plan ?? submission.selected_plan);
  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "cancel_flow_started",
    oldPlan: plan,
  });

  const updated = await updateSubmissionRetention(submission.id, {
    health_status: "yellow",
  });

  return {
    ok: true,
    message: "Cancellation flow started.",
    state: stateFromSubmission(updated ?? submission),
  };
}

export async function selectCancellationReason({
  rawToken,
  reason,
  detail,
}: {
  rawToken: string;
  reason: string;
  detail?: string;
}): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  const normalizedReason = normalizeReason(reason);
  const offers = getSaveOfferForReason(normalizedReason);
  const plan = normalizePlan(submission.current_plan ?? submission.selected_plan);

  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "cancellation_reason_selected",
    oldPlan: plan,
    cancellationReason: normalizedReason,
  });
  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "save_offer_shown",
    oldPlan: plan,
    cancellationReason: normalizedReason,
    saveOfferType: offers.primary.type,
  });

  const updated = await updateSubmissionRetention(submission.id, {
    cancellation_reason: normalizedReason,
    cancellation_reason_detail: detail?.trim() || null,
    save_offer_shown: offers.primary.type,
    save_offer_accepted: false,
  });

  return {
    ok: true,
    message: "Reason saved.",
    state: stateFromSubmission(updated ?? submission),
  };
}

export async function acceptSaveOffer({
  rawToken,
  offerType,
}: {
  rawToken: string;
  offerType: string;
}): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  const normalizedOffer = normalizeOfferType(offerType);
  if (!normalizedOffer) return { ok: false, error: "Unknown save offer.", status: 400 };

  const offer = SAVE_OFFERS[normalizedOffer];
  const currentPlan = normalizePlan(submission.current_plan ?? submission.selected_plan);
  const reason = normalizeReason(submission.cancellation_reason);

  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "save_offer_accepted",
    oldPlan: currentPlan,
    newPlan: offer.targetPlan ?? null,
    cancellationReason: reason,
    saveOfferType: normalizedOffer,
  });

  if (offer.targetPlan) {
    return completeDowngrade({
      rawToken,
      targetPlan: offer.targetPlan,
      reason: `Accepted save offer: ${offer.label}`,
      saveOfferType: normalizedOffer,
    });
  }

  const updated = await updateSubmissionRetention(submission.id, {
    save_offer_shown: normalizedOffer,
    save_offer_accepted: true,
    cancel_at_period_end: false,
    cancellation_reason: reason,
  });

  await sendRetentionHelpEmail({
    submissionId: submission.id,
    to: submission.work_email,
    companyName: submission.company_name,
    token: rawToken,
    subject: "We will help with your subscription request",
    headline: "We will help with your subscription request",
    body: offer.description,
  });

  return {
    ok: true,
    message: "Thanks — we saved that request and will follow up.",
    state: stateFromSubmission(updated ?? submission),
  };
}

export async function completeDowngrade({
  rawToken,
  targetPlan,
  reason,
  saveOfferType,
}: {
  rawToken: string;
  targetPlan: string;
  reason?: string;
  saveOfferType?: string;
}): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  if (!isSubscriptionPlanKey(targetPlan)) {
    return { ok: false, error: "Unknown target plan.", status: 400 };
  }

  const currentPlan = normalizePlan(submission.current_plan ?? submission.selected_plan);
  const path = getDowngradePath(currentPlan, targetPlan);
  if (!path) {
    return {
      ok: false,
      error: "That plan change is not available from your current plan.",
      status: 400,
    };
  }

  const effectiveAt = submission.next_billing_at ?? null;
  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "downgrade_flow_started",
    oldPlan: currentPlan,
    newPlan: targetPlan,
    saveOfferType: saveOfferType ?? null,
  });
  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "downgrade_completed",
    oldPlan: currentPlan,
    newPlan: targetPlan,
    cancellationReason: submission.cancellation_reason ?? null,
    saveOfferType: saveOfferType ?? null,
    effectiveAt,
    metadata: { reason: reason ?? null, timing: path.effectiveTiming },
  });

  const updated = await updateSubmissionRetention(submission.id, {
    previous_plan: currentPlan,
    next_plan: targetPlan,
    subscription_status: submission.subscription_status === "lead" ? "lead" : "active",
    cancel_at_period_end: false,
    downgrade_reason: reason?.trim() || submission.downgrade_reason || "Customer requested lighter plan",
    save_offer_accepted: saveOfferType ? true : submission.save_offer_accepted,
  });

  await sendDowngradeConfirmationEmail({
    submissionId: submission.id,
    to: submission.work_email,
    companyName: submission.company_name,
    token: rawToken,
    newPlan: targetPlan,
    effectiveDate: effectiveAt,
  });

  return {
    ok: true,
    message: path.confirmationCopy,
    state: stateFromSubmission(updated ?? submission),
  };
}

export async function completeCancellation(rawToken: string): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  const currentPlan = normalizePlan(submission.current_plan ?? submission.selected_plan);
  const effectiveAt = submission.next_billing_at ?? null;

  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "cancellation_completed",
    oldPlan: currentPlan,
    cancellationReason: submission.cancellation_reason ?? "other",
    saveOfferType: submission.save_offer_shown ?? null,
    effectiveAt,
  });

  const updated = await updateSubmissionRetention(submission.id, {
    subscription_status: "scheduled_cancel",
    cancel_at_period_end: true,
    canceled_at: new Date().toISOString(),
    winback_eligible: true,
    save_offer_accepted: submission.save_offer_accepted ?? false,
  });

  await sendCancellationScheduledEmail({
    submissionId: submission.id,
    to: submission.work_email,
    companyName: submission.company_name,
    token: rawToken,
    effectiveDate: effectiveAt,
  });

  return {
    ok: true,
    message:
      "Your subscription is scheduled to end at the end of the current billing period.",
    state: stateFromSubmission(updated ?? submission),
  };
}

export async function selectPause(rawToken: string): Promise<RetentionActionResult> {
  const submission = await resolveSubmissionByToken(rawToken);
  if (!submission) return { ok: false, error: "Subscription not found.", status: 404 };

  const currentPlan = normalizePlan(submission.current_plan ?? submission.selected_plan);
  await logSubscriptionEvent({
    submissionId: submission.id,
    eventName: "pause_selected",
    oldPlan: currentPlan,
    metadata: { supported: PAUSE_SUPPORT.supported },
  });

  if (!PAUSE_SUPPORT.supported) {
    const updated = await updateSubmissionRetention(submission.id, {
      save_offer_shown: PAUSE_SUPPORT.fallbackOffer,
      save_offer_accepted: false,
    });
    return {
      ok: true,
      message: PAUSE_SUPPORT.message,
      state: stateFromSubmission(updated ?? submission),
    };
  }

  const pauseUntil = new Date();
  pauseUntil.setDate(pauseUntil.getDate() + 30);
  const updated = await updateSubmissionRetention(submission.id, {
    subscription_status: "paused",
    pause_until: pauseUntil.toISOString(),
  });

  return {
    ok: true,
    message: "Your subscription pause has been saved.",
    state: stateFromSubmission(updated ?? submission),
  };
}
