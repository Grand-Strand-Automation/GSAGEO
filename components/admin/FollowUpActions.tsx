"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GeoSubmission } from "@/lib/types/database";
import { FOLLOW_UP_STATUS_LABELS, BRIDGE_OFFERS } from "@/lib/content/follow-up";

type Action =
  | "mark_booked"
  | "mark_converted"
  | "stop_follow_up"
  | "mark_not_a_fit"
  | "resend_confirmation"
  | "resend_report";

export function FollowUpActions({
  submissionId,
  submission,
  auditJobId,
}: {
  submissionId: string;
  submission: GeoSubmission;
  auditJobId: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<Action | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function runAction(action: Action) {
    setLoading(action);
    setMessage(null);
    try {
      const resp = await fetch(`/api/admin/submissions/${submissionId}/follow-up`, {
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

  const statusLabel =
    FOLLOW_UP_STATUS_LABELS[submission.follow_up_status ?? "submitted"] ??
    submission.follow_up_status ??
    "—";

  const offerLabel =
    submission.recommended_offer &&
    BRIDGE_OFFERS[submission.recommended_offer as keyof typeof BRIDGE_OFFERS]
      ? BRIDGE_OFFERS[submission.recommended_offer as keyof typeof BRIDGE_OFFERS].name
      : submission.recommended_offer ?? "—";

  return (
    <section className="bg-white rounded-xl border border-brand-border p-6">
      <h2 className="text-xs font-bold uppercase text-brand-blue mb-4">Follow-up journey</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Stage</dt>
          <dd className="text-brand-navy font-semibold mt-1">{statusLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Recommended offer</dt>
          <dd className="text-brand-navy mt-1">{offerLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Confirmation email</dt>
          <dd className="text-brand-muted mt-1">
            {submission.confirmation_email_sent_at
              ? new Date(submission.confirmation_email_sent_at).toLocaleString()
              : "Not sent"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Report email</dt>
          <dd className="text-brand-muted mt-1">
            {submission.report_email_sent_at
              ? new Date(submission.report_email_sent_at).toLocaleString()
              : "Not sent"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Last contact</dt>
          <dd className="text-brand-muted mt-1">
            {submission.last_contacted_at
              ? new Date(submission.last_contacted_at).toLocaleString()
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Review booked</dt>
          <dd className="text-brand-muted mt-1">
            {submission.booked_review_at
              ? new Date(submission.booked_review_at).toLocaleString()
              : "—"}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <ActionButton
          label="Mark booked"
          action="mark_booked"
          loading={loading}
          onClick={runAction}
        />
        <ActionButton
          label="Mark converted"
          action="mark_converted"
          loading={loading}
          onClick={runAction}
        />
        <ActionButton
          label="Stop follow-up"
          action="stop_follow_up"
          loading={loading}
          onClick={runAction}
        />
        <ActionButton
          label="Not a fit"
          action="mark_not_a_fit"
          loading={loading}
          onClick={runAction}
        />
        <ActionButton
          label="Resend confirmation"
          action="resend_confirmation"
          loading={loading}
          onClick={runAction}
          disabled={!auditJobId}
        />
        <ActionButton
          label="Resend report email"
          action="resend_report"
          loading={loading}
          onClick={runAction}
          disabled={!auditJobId}
        />
      </div>

      {message ? <p className="mt-4 text-sm text-brand-muted">{message}</p> : null}
    </section>
  );
}

function ActionButton({
  label,
  action,
  loading,
  onClick,
  disabled,
}: {
  label: string;
  action: Action;
  loading: Action | null;
  onClick: (action: Action) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading !== null}
      onClick={() => onClick(action)}
      className="text-xs font-semibold px-3 py-2 rounded-lg border border-brand-border bg-brand-cream hover:bg-white disabled:opacity-50 transition-colors"
    >
      {loading === action ? "Working…" : label}
    </button>
  );
}
