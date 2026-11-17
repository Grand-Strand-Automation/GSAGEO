import { createAdminClient } from "@/lib/supabase/admin";
import { AUDIT_VERSION } from "@/lib/audit/types";
import { processAuditJob } from "@/lib/audit/processor";
import {
  getSubscriptionPlan,
  isSubscriptionPlanKey,
  type SubscriptionPlanKey,
} from "@/lib/subscriptions/config";
import { nextBillingAtIso } from "@/lib/subscriptions/period";
import { sendMonthlyFulfillmentEmail } from "@/lib/subscriptions/emails";

export type FulfillmentCycleStatus =
  | "queued"
  | "processing"
  | "awaiting_ops"
  | "delivered"
  | "failed"
  | "skipped";

export type GeoFulfillmentCycle = {
  id: string;
  submission_id: string;
  plan: string;
  cycle_number: number;
  period_start: string;
  period_end: string;
  status: FulfillmentCycleStatus;
  audit_job_id: string | null;
  overall_score: number | null;
  summary_email_sent_at: string | null;
  ops_completed_at: string | null;
  ops_completed_by: string | null;
  error_message: string | null;
  metadata_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  delivered_at: string | null;
};

/** Monitor is fully automated; Growth/Managed need ops follow-through after the snapshot. */
export function requiresOpsFollowThrough(plan: string): boolean {
  return plan === "growth" || plan === "managed";
}

export function normalizeSubscriptionPlan(
  value: string | null | undefined,
): SubscriptionPlanKey {
  return isSubscriptionPlanKey(value) ? value : "growth";
}

export async function startSubscriptionFulfillment(input: {
  submissionId: string;
  plan?: string | null;
  initiatedBy?: string;
}): Promise<{ cycle: GeoFulfillmentCycle; nextBillingAt: string }> {
  const supabase = createAdminClient();
  const plan = normalizeSubscriptionPlan(input.plan);
  const now = new Date();
  const periodStart = now.toISOString();
  const periodEnd = nextBillingAtIso(now, 1);

  const { data: existingOpen } = await supabase
    .from("geo_fulfillment_cycles")
    .select("id")
    .eq("submission_id", input.submissionId)
    .in("status", ["queued", "processing", "awaiting_ops"])
    .limit(1)
    .maybeSingle();

  if (existingOpen) {
    await supabase
      .from("geo_submissions")
      .update({
        current_plan: plan,
        subscription_status: "active",
        next_billing_at: periodEnd,
        cancel_at_period_end: false,
        canceled_at: null,
      })
      .eq("id", input.submissionId);

    const { data: cycle } = await supabase
      .from("geo_fulfillment_cycles")
      .select("*")
      .eq("id", existingOpen.id)
      .single();

    return {
      cycle: cycle as GeoFulfillmentCycle,
      nextBillingAt: periodEnd,
    };
  }

  const { count } = await supabase
    .from("geo_fulfillment_cycles")
    .select("id", { count: "exact", head: true })
    .eq("submission_id", input.submissionId);

  const cycleNumber = (count ?? 0) + 1;

  await supabase
    .from("geo_submissions")
    .update({
      current_plan: plan,
      subscription_status: "active",
      next_billing_at: periodEnd,
      cancel_at_period_end: false,
      canceled_at: null,
      health_status: "green",
      churn_risk_level: "low",
      retention_last_event_at: now.toISOString(),
    })
    .eq("id", input.submissionId);

  const { data: cycle, error } = await supabase
    .from("geo_fulfillment_cycles")
    .insert({
      submission_id: input.submissionId,
      plan,
      cycle_number: cycleNumber,
      period_start: periodStart,
      period_end: periodEnd,
      status: "queued",
      metadata_json: {
        kickoff: cycleNumber === 1,
        source: "subscription_start",
      },
    })
    .select("*")
    .single();

  if (error || !cycle) {
    throw new Error(`Failed to create fulfillment cycle: ${error?.message ?? "unknown"}`);
  }

  await supabase.from("geo_subscription_events").insert({
    submission_id: input.submissionId,
    event_name: cycleNumber === 1 ? "subscription_started" : "fulfillment_cycle_queued",
    new_plan: plan,
    initiated_by: input.initiatedBy ?? "system",
    effective_at: periodStart,
    metadata_json: {
      fulfillment_cycle_id: cycle.id,
      next_billing_at: periodEnd,
      cycle_number: cycleNumber,
    },
  });

  return { cycle: cycle as GeoFulfillmentCycle, nextBillingAt: periodEnd };
}

export async function enqueueNextFulfillmentCycle(input: {
  submissionId: string;
  plan: SubscriptionPlanKey;
  periodStart: Date;
  periodEnd: Date;
}): Promise<GeoFulfillmentCycle | null> {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("geo_fulfillment_cycles")
    .select("id", { count: "exact", head: true })
    .eq("submission_id", input.submissionId);

  const cycleNumber = (count ?? 0) + 1;

  const { data: cycle, error } = await supabase
    .from("geo_fulfillment_cycles")
    .insert({
      submission_id: input.submissionId,
      plan: input.plan,
      cycle_number: cycleNumber,
      period_start: input.periodStart.toISOString(),
      period_end: input.periodEnd.toISOString(),
      status: "queued",
      metadata_json: { source: "billing_period_rollover" },
    })
    .select("*")
    .single();

  if (error) {
    // Unique violation = already enqueued for this cycle number
    if (error.code === "23505") return null;
    throw new Error(`Failed to enqueue fulfillment cycle: ${error.message}`);
  }

  return cycle as GeoFulfillmentCycle;
}

export async function processQueuedFulfillmentCycles(limit = 5): Promise<{
  claimed: number;
  auditsStarted: number;
}> {
  const supabase = createAdminClient();
  const { data: cycles } = await supabase
    .from("geo_fulfillment_cycles")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!cycles?.length) return { claimed: 0, auditsStarted: 0 };

  let claimed = 0;
  let auditsStarted = 0;

  for (const cycle of cycles) {
    const { data: locked } = await supabase
      .from("geo_fulfillment_cycles")
      .update({
        status: "processing",
        started_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", cycle.id)
      .eq("status", "queued")
      .select("*")
      .maybeSingle();

    if (!locked) continue;
    claimed += 1;

    try {
      let auditJobId = locked.audit_job_id as string | null;

      if (!auditJobId) {
        const { data: job, error: jobError } = await supabase
          .from("geo_audit_jobs")
          .insert({
            submission_id: locked.submission_id,
            status: "queued",
            audit_version: `${AUDIT_VERSION}-subscription`,
            review_required: false,
          })
          .select("id")
          .single();

        if (jobError || !job) {
          throw new Error(jobError?.message ?? "Failed to create subscription audit job");
        }

        auditJobId = job.id;
        await supabase
          .from("geo_fulfillment_cycles")
          .update({ audit_job_id: auditJobId })
          .eq("id", locked.id);
      }

      if (!auditJobId) {
        throw new Error("Fulfillment cycle is missing audit_job_id");
      }

      await processAuditJob(auditJobId);
      auditsStarted += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fulfillment processing failed";
      await supabase
        .from("geo_fulfillment_cycles")
        .update({
          status: "failed",
          error_message: message,
        })
        .eq("id", locked.id);
      console.error("[fulfillment] Cycle failed:", locked.id, err);
    }
  }

  return { claimed, auditsStarted };
}

export async function findFulfillmentCycleByAuditJob(
  auditJobId: string,
): Promise<GeoFulfillmentCycle | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("geo_fulfillment_cycles")
    .select("*")
    .eq("audit_job_id", auditJobId)
    .maybeSingle();
  return (data as GeoFulfillmentCycle | null) ?? null;
}

export async function finalizeFulfillmentCycleFromAudit(input: {
  auditJobId: string;
  overallScore?: number | null;
}): Promise<void> {
  const supabase = createAdminClient();
  const cycle = await findFulfillmentCycleByAuditJob(input.auditJobId);
  if (!cycle) return;
  if (["delivered", "awaiting_ops", "skipped"].includes(cycle.status)) return;

  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("id, work_email, company_name, full_name, results_token, current_plan")
    .eq("id", cycle.submission_id)
    .single();

  if (!submission) {
    await supabase
      .from("geo_fulfillment_cycles")
      .update({ status: "failed", error_message: "Submission missing for fulfillment cycle" })
      .eq("id", cycle.id);
    return;
  }

  const plan = normalizeSubscriptionPlan(cycle.plan || submission.current_plan);
  const planConfig = getSubscriptionPlan(plan);
  const needsOps = requiresOpsFollowThrough(plan);
  const now = new Date().toISOString();

  let emailSentAt: string | null = cycle.summary_email_sent_at;
  if (!emailSentAt && submission.work_email) {
    const emailResult = await sendMonthlyFulfillmentEmail({
      submissionId: submission.id,
      auditJobId: input.auditJobId,
      to: submission.work_email,
      companyName: submission.company_name,
      customerName: submission.full_name,
      plan,
      overallScore: input.overallScore ?? null,
      token: submission.results_token ?? undefined,
      needsOpsFollowThrough: needsOps,
    });

    if (emailResult.ok && !("skipped" in emailResult && emailResult.skipped)) {
      emailSentAt = now;
    } else if (emailResult.ok && "skipped" in emailResult && emailResult.skipped) {
      // Still advance fulfillment when Resend is not configured — ops can notify manually.
      emailSentAt = now;
    }
  }

  const nextStatus: FulfillmentCycleStatus = needsOps ? "awaiting_ops" : "delivered";

  await supabase
    .from("geo_fulfillment_cycles")
    .update({
      status: nextStatus,
      overall_score: input.overallScore ?? null,
      summary_email_sent_at: emailSentAt,
      delivered_at: nextStatus === "delivered" ? now : null,
      metadata_json: {
        ...(cycle.metadata_json ?? {}),
        plan_display_name: planConfig.displayName,
        support_level: planConfig.supportLevel,
        automated: !needsOps,
      },
    })
    .eq("id", cycle.id);

  await supabase
    .from("geo_submissions")
    .update({
      last_fulfillment_at: now,
      last_fulfillment_cycle_id: cycle.id,
      last_engagement_at: now,
      retention_last_event_at: now,
    })
    .eq("id", cycle.submission_id);

  await supabase.from("geo_subscription_events").insert({
    submission_id: cycle.submission_id,
    event_name: nextStatus === "delivered" ? "fulfillment_delivered" : "fulfillment_awaiting_ops",
    new_plan: plan,
    initiated_by: "system",
    effective_at: now,
    metadata_json: {
      fulfillment_cycle_id: cycle.id,
      audit_job_id: input.auditJobId,
      overall_score: input.overallScore ?? null,
    },
  });
}

export async function markFulfillmentOpsComplete(input: {
  cycleId: string;
  completedBy: string;
}): Promise<GeoFulfillmentCycle> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: cycle, error } = await supabase
    .from("geo_fulfillment_cycles")
    .update({
      status: "delivered",
      ops_completed_at: now,
      ops_completed_by: input.completedBy,
      delivered_at: now,
    })
    .eq("id", input.cycleId)
    .in("status", ["awaiting_ops", "processing", "failed"])
    .select("*")
    .maybeSingle();

  if (error || !cycle) {
    throw new Error(error?.message ?? "Fulfillment cycle not found or not completable");
  }

  await supabase.from("geo_subscription_events").insert({
    submission_id: cycle.submission_id,
    event_name: "fulfillment_delivered",
    new_plan: cycle.plan,
    initiated_by: "admin",
    effective_at: now,
    metadata_json: {
      fulfillment_cycle_id: cycle.id,
      ops_completed_by: input.completedBy,
    },
  });

  return cycle as GeoFulfillmentCycle;
}

export async function markFulfillmentCycleFailed(
  auditJobId: string,
  errorMessage: string,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("geo_fulfillment_cycles")
    .update({
      status: "failed",
      error_message: errorMessage,
    })
    .eq("audit_job_id", auditJobId)
    .in("status", ["queued", "processing"]);
}
