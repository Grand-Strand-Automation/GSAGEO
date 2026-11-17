"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SUBSCRIPTION_PLANS, isSubscriptionPlanKey } from "@/lib/subscriptions/config";

type Cycle = {
  id: string;
  plan: string;
  cycle_number: number;
  status: string;
  period_start: string;
  period_end: string;
  overall_score: number | null;
  summary_email_sent_at: string | null;
  ops_completed_at: string | null;
  error_message: string | null;
  audit_job_id: string | null;
};

function planLabel(plan: string) {
  return isSubscriptionPlanKey(plan) ? SUBSCRIPTION_PLANS[plan].displayName : plan;
}

function statusClass(status: string) {
  switch (status) {
    case "delivered":
      return "text-emerald-700";
    case "awaiting_ops":
      return "text-amber-700";
    case "failed":
      return "text-red-700";
    case "processing":
    case "queued":
      return "text-brand-blue";
    default:
      return "text-brand-muted";
  }
}

export function FulfillmentPanel({
  submissionId,
  cycles,
}: {
  submissionId: string;
  cycles: Cycle[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function runAction(action: string, cycleId?: string) {
    setPending(action + (cycleId ?? ""));
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/submissions/${submissionId}/fulfillment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, cycleId }),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !json.ok) {
        setMessage(json.error ?? "Action failed");
      } else {
        setMessage(json.message ?? "Done");
        router.refresh();
      }
    } catch {
      setMessage("Network error");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="card-brand rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand-navy">
            Subscription fulfillment
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            Automated monthly snapshot + email. Growth/Managed stay in awaiting ops until you
            finish the hands-on work.
          </p>
        </div>
        <button
          type="button"
          disabled={Boolean(pending)}
          onClick={() => runAction("start_or_retry")}
          className="rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {pending === "start_or_retry" ? "Starting…" : "Start / run kickoff"}
        </button>
      </div>

      {message ? <p className="text-sm text-brand-navy">{message}</p> : null}

      {!cycles.length ? (
        <p className="text-sm text-brand-muted">
          No fulfillment cycles yet. Mark converted (or use Start / run kickoff) to begin.
        </p>
      ) : (
        <ul className="space-y-3">
          {cycles.map((cycle) => (
            <li
              key={cycle.id}
              className="rounded-xl border border-brand-border bg-brand-cream/40 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    Cycle #{cycle.cycle_number} · {planLabel(cycle.plan)}
                  </p>
                  <p className={`text-xs font-semibold uppercase ${statusClass(cycle.status)}`}>
                    {cycle.status.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="text-right text-xs text-brand-muted">
                  <p>
                    Period {new Date(cycle.period_start).toLocaleDateString()} –{" "}
                    {new Date(cycle.period_end).toLocaleDateString()}
                  </p>
                  <p>
                    Score {cycle.overall_score ?? "—"}
                    {cycle.summary_email_sent_at ? " · email sent" : ""}
                  </p>
                </div>
              </div>
              {cycle.error_message ? (
                <p className="mt-2 text-xs text-red-700">{cycle.error_message}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {cycle.status === "awaiting_ops" ? (
                  <button
                    type="button"
                    disabled={Boolean(pending)}
                    onClick={() => runAction("mark_ops_complete", cycle.id)}
                    className="rounded-lg border border-brand-navy px-3 py-1.5 text-xs font-semibold text-brand-navy disabled:opacity-50"
                  >
                    Mark ops complete
                  </button>
                ) : null}
                {cycle.status === "failed" ? (
                  <button
                    type="button"
                    disabled={Boolean(pending)}
                    onClick={() => runAction("retry_failed_cycle", cycle.id)}
                    className="rounded-lg border border-red-700 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                  >
                    Retry failed cycle
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
