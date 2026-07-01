"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GeoSubmission, GeoSubscriptionEvent } from "@/lib/types/database";
import {
  CANCELLATION_REASONS,
  SAVE_OFFERS,
  SUBSCRIPTION_PLANS,
  isSubscriptionPlanKey,
} from "@/lib/subscriptions/config";

type AdminAction =
  | "mark_retained"
  | "mark_churned"
  | "mark_winback_attempted"
  | "payment_failed"
  | "payment_recovered";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-brand-subtle">{label}</dt>
      <dd className="text-sm text-brand-navy mt-1">{value || "—"}</dd>
    </div>
  );
}

function planLabel(plan: string | null | undefined) {
  return isSubscriptionPlanKey(plan) ? SUBSCRIPTION_PLANS[plan].displayName : plan || "—";
}

function reasonLabel(reason: string | null | undefined) {
  return CANCELLATION_REASONS.find((item) => item.key === reason)?.label ?? reason ?? "—";
}

function offerLabel(offer: string | null | undefined) {
  return offer && offer in SAVE_OFFERS
    ? SAVE_OFFERS[offer as keyof typeof SAVE_OFFERS].label
    : offer ?? "—";
}

export function SubscriptionRetentionPanel({
  submission,
  events,
}: {
  submission: GeoSubmission;
  events: GeoSubscriptionEvent[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<AdminAction | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function runAction(action: AdminAction) {
    setLoading(action);
    setMessage(null);
    try {
      const resp = await fetch(`/api/admin/submissions/${submission.id}/retention`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Action failed");
      setMessage(data.message ?? "Updated.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="bg-white rounded-xl border border-brand-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xs font-bold uppercase text-brand-blue mb-2">Subscription retention</h2>
          <p className="text-sm text-brand-muted">
            Churn risk, plan changes, save offers, and cancellation metadata for this account.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-semibold text-brand-muted">
            {submission.health_status ?? "green"} health
          </span>
          <span className="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-semibold text-brand-muted">
            {submission.churn_risk_level ?? "low"} risk
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Field label="Current plan" value={planLabel(submission.current_plan ?? submission.selected_plan)} />
        <Field label="Previous plan" value={planLabel(submission.previous_plan)} />
        <Field label="Next plan" value={planLabel(submission.next_plan)} />
        <Field label="Subscription status" value={submission.subscription_status ?? "lead"} />
        <Field
          label="Next billing"
          value={submission.next_billing_at ? new Date(submission.next_billing_at).toLocaleString() : "—"}
        />
        <Field label="Cancel at period end" value={submission.cancel_at_period_end ? "Yes" : "No"} />
        <Field label="Cancellation reason" value={reasonLabel(submission.cancellation_reason)} />
        <Field label="Downgrade reason" value={submission.downgrade_reason ?? "—"} />
        <Field label="Save offer shown" value={offerLabel(submission.save_offer_shown)} />
        <Field
          label="Save offer accepted"
          value={
            submission.save_offer_accepted === null || submission.save_offer_accepted === undefined
              ? "—"
              : submission.save_offer_accepted
                ? "Yes"
                : "No"
          }
        />
        <Field label="Payment issue" value={submission.payment_issue_status ?? "None"} />
        <Field label="Winback eligible" value={submission.winback_eligible ? "Yes" : "No"} />
        <Field
          label="Last report view"
          value={submission.last_report_viewed_at ? new Date(submission.last_report_viewed_at).toLocaleString() : "—"}
        />
        <Field
          label="Last engagement"
          value={submission.last_engagement_at ? new Date(submission.last_engagement_at).toLocaleString() : "—"}
        />
        <Field
          label="Last retention event"
          value={submission.retention_last_event_at ? new Date(submission.retention_last_event_at).toLocaleString() : "—"}
        />
      </dl>

      <div className="flex flex-wrap gap-2 mb-6">
        <ActionButton action="mark_retained" loading={loading} onClick={runAction} label="Mark retained" />
        <ActionButton action="mark_churned" loading={loading} onClick={runAction} label="Mark churned" />
        <ActionButton action="mark_winback_attempted" loading={loading} onClick={runAction} label="Winback attempted" />
        <ActionButton action="payment_failed" loading={loading} onClick={runAction} label="Payment failed" />
        <ActionButton action="payment_recovered" loading={loading} onClick={runAction} label="Payment recovered" />
      </div>

      {message ? <p className="text-sm text-brand-muted mb-4">{message}</p> : null}

      <div className="rounded-xl border border-brand-border bg-brand-cream/60 p-4">
        <p className="text-xs font-bold uppercase text-brand-subtle mb-3">Recent retention events</p>
        {events.length ? (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="text-sm">
                <p className="font-semibold text-brand-navy">
                  {event.event_name.replace(/_/g, " ")}
                  {event.old_plan || event.new_plan ? (
                    <span className="font-normal text-brand-muted">
                      {" "}
                      ({planLabel(event.old_plan)} → {planLabel(event.new_plan)})
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-brand-subtle">
                  {new Date(event.created_at).toLocaleString()} · {event.initiated_by}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-brand-muted">No retention events recorded yet.</p>
        )}
      </div>
    </section>
  );
}

function ActionButton({
  action,
  loading,
  onClick,
  label,
}: {
  action: AdminAction;
  loading: AdminAction | null;
  onClick: (action: AdminAction) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={loading !== null}
      onClick={() => onClick(action)}
      className="text-xs font-semibold px-3 py-2 rounded-lg border border-brand-border bg-brand-cream hover:bg-white disabled:opacity-50 transition-colors"
    >
      {loading === action ? "Working…" : label}
    </button>
  );
}
