import { createAdminClient } from "@/lib/supabase/admin";
import {
  enqueueNextFulfillmentCycle,
  normalizeSubscriptionPlan,
} from "@/lib/subscriptions/fulfillment";
import { isBillingPeriodDue, nextBillingAtIso } from "@/lib/subscriptions/period";

/**
 * Applies due billing-period transitions:
 * - scheduled cancels → canceled (no new fulfillment cycle)
 * - active subscribers → bump next_billing_at, apply next_plan, enqueue next cycle
 */
export async function applyDueBillingPeriods(limit = 25): Promise<{
  canceled: number;
  renewed: number;
  cyclesEnqueued: number;
}> {
  const supabase = createAdminClient();
  const now = new Date();

  const { data: due } = await supabase
    .from("geo_submissions")
    .select(
      "id, current_plan, previous_plan, next_plan, subscription_status, next_billing_at, cancel_at_period_end",
    )
    .in("subscription_status", ["active", "scheduled_cancel"])
    .not("next_billing_at", "is", null)
    .lte("next_billing_at", now.toISOString())
    .order("next_billing_at", { ascending: true })
    .limit(limit);

  if (!due?.length) return { canceled: 0, renewed: 0, cyclesEnqueued: 0 };

  let canceled = 0;
  let renewed = 0;
  let cyclesEnqueued = 0;

  for (const row of due) {
    if (!isBillingPeriodDue(row.next_billing_at, now)) continue;

    const periodStart = new Date(row.next_billing_at as string);
    const periodEndIso = nextBillingAtIso(periodStart, 1);

    if (row.cancel_at_period_end || row.subscription_status === "scheduled_cancel") {
      await supabase
        .from("geo_submissions")
        .update({
          subscription_status: "canceled",
          canceled_at: now.toISOString(),
          cancel_at_period_end: false,
          next_billing_at: null,
          next_plan: null,
          retention_last_event_at: now.toISOString(),
          churn_risk_level: "high",
          health_status: "red",
        })
        .eq("id", row.id);

      await supabase.from("geo_subscription_events").insert({
        submission_id: row.id,
        event_name: "cancellation_completed",
        old_plan: row.current_plan,
        initiated_by: "system",
        effective_at: now.toISOString(),
        metadata_json: { source: "billing_period_apply" },
      });

      canceled += 1;
      continue;
    }

    const previousPlan = row.current_plan;
    const nextPlan = normalizeSubscriptionPlan(row.next_plan ?? row.current_plan);
    const planChanged = Boolean(row.next_plan && row.next_plan !== row.current_plan);

    await supabase
      .from("geo_submissions")
      .update({
        previous_plan: planChanged ? previousPlan : row.previous_plan ?? previousPlan,
        current_plan: nextPlan,
        next_plan: null,
        next_billing_at: periodEndIso,
        subscription_status: "active",
        retention_last_event_at: now.toISOString(),
      })
      .eq("id", row.id);

    if (planChanged) {
      await supabase.from("geo_subscription_events").insert({
        submission_id: row.id,
        event_name: "downgrade_completed",
        old_plan: previousPlan,
        new_plan: nextPlan,
        initiated_by: "system",
        effective_at: now.toISOString(),
        metadata_json: { source: "billing_period_apply" },
      });
    }

    const cycle = await enqueueNextFulfillmentCycle({
      submissionId: row.id,
      plan: nextPlan,
      periodStart,
      periodEnd: new Date(periodEndIso),
    });

    if (cycle) cyclesEnqueued += 1;
    renewed += 1;

    await supabase.from("geo_subscription_events").insert({
      submission_id: row.id,
      event_name: "billing_period_renewed",
      old_plan: previousPlan,
      new_plan: nextPlan,
      initiated_by: "system",
      effective_at: now.toISOString(),
      metadata_json: {
        next_billing_at: periodEndIso,
        fulfillment_cycle_id: cycle?.id ?? null,
      },
    });
  }

  return { canceled, renewed, cyclesEnqueued };
}
