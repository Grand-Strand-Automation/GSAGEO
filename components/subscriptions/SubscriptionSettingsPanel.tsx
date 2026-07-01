"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import {
  CANCELLATION_REASONS,
  PAUSE_SUPPORT,
  SAVE_OFFERS,
  SUBSCRIPTION_PLANS,
  getSaveOfferForReason,
  type CancellationReason,
  type SaveOfferConfig,
  type SaveOfferType,
  type SubscriptionPlanKey,
} from "@/lib/subscriptions/config";
import { PlanComparisonTable } from "@/components/subscriptions/PlanComparisonTable";

type RetentionState = {
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
  billingProvider: string | null;
  billingSubscriptionId: string | null;
  primaryDowngradeTarget: SubscriptionPlanKey | null;
};

type FlowStep = "idle" | "reason" | "offer" | "confirm";

function formatDate(value: string | null): string {
  if (!value) return "Next billing date not synced yet";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-brand-border bg-brand-cream px-2.5 py-1 text-xs font-semibold text-brand-muted">
      {label.replace(/_/g, " ")}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}) {
  const classes =
    variant === "danger"
      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      : variant === "secondary"
        ? "border-brand-border bg-white text-brand-navy hover:border-brand-blue/40"
        : "border-brand-blue bg-brand-blue text-white hover:bg-brand-blue-hover";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-heading font-semibold transition-colors disabled:opacity-60 ${classes}`}
    >
      {children}
    </button>
  );
}

export function SubscriptionSettingsPanel({ token }: { token: string }) {
  const [state, setState] = useState<RetentionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>("idle");
  const [selectedReason, setSelectedReason] = useState<CancellationReason>("too_expensive_right_now");
  const [reasonDetail, setReasonDetail] = useState("");

  const currentPlan = state ? SUBSCRIPTION_PLANS[state.currentPlan] : SUBSCRIPTION_PLANS.growth;
  const downgradePlan = state?.primaryDowngradeTarget
    ? SUBSCRIPTION_PLANS[state.primaryDowngradeTarget]
    : null;
  const selectedOffer = useMemo(
    () => getSaveOfferForReason(selectedReason),
    [selectedReason],
  );
  const shownOffer = state?.saveOfferShown ? SAVE_OFFERS[state.saveOfferShown] : selectedOffer.primary;

  async function refresh() {
    setLoading(true);
    try {
      const resp = await fetch(`/api/results/${encodeURIComponent(token)}/subscription`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Could not load subscription settings.");
      setState(data.state);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not load subscription settings.");
    } finally {
      setLoading(false);
    }
  }

  async function runAction(
    action: string,
    payload: Record<string, string | null | undefined> = {},
  ) {
    setWorking(action);
    setMessage(null);
    try {
      const resp = await fetch(`/api/results/${encodeURIComponent(token)}/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Action failed.");
      setState(data.state);
      setMessage(data.message ?? "Updated.");
      return data.state as RetentionState;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed.");
      return null;
    } finally {
      setWorking(null);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (!loading && state) {
      void runAction("plan_viewed");
      void runAction("comparison_table_viewed");
    }
    // Fire once after initial state load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  async function startCancel() {
    await runAction("cancel_flow_started");
    setFlowStep("reason");
  }

  async function submitReason() {
    const next = await runAction("cancellation_reason_selected", {
      reason: selectedReason,
      detail: reasonDetail,
    });
    if (next) setFlowStep("offer");
  }

  async function acceptOffer(offer: SaveOfferConfig) {
    const next = await runAction("save_offer_accepted", { offerType: offer.type });
    if (next) setFlowStep("idle");
  }

  async function downgrade(targetPlan: SubscriptionPlanKey, reason: string) {
    const next = await runAction("downgrade_completed", { targetPlan, detail: reason });
    if (next) setFlowStep("idle");
  }

  async function completeCancel() {
    const next = await runAction("cancellation_completed");
    if (next) setFlowStep("idle");
  }

  if (loading) {
    return (
      <section id="subscription" className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <Loader2 size={16} className="animate-spin" />
          Loading subscription settings…
        </div>
      </section>
    );
  }

  if (!state) {
    return (
      <section id="subscription" className="rounded-3xl border border-red-200 bg-white p-6 shadow-card">
        <p className="text-sm text-red-700">{message ?? "Subscription settings are unavailable."}</p>
      </section>
    );
  }

  return (
    <section id="subscription" className="space-y-6">
      <div className="rounded-3xl border border-brand-border bg-white p-6 md:p-7 shadow-card-md">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
              Subscription settings
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy">
              You&apos;re on {currentPlan.displayName}.
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed mt-2 max-w-2xl">
              {currentPlan.monthlyPositioning} You can downgrade or cancel anytime. Changes are
              saved here and take effect on your next billing date when provider billing is synced.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={state.subscriptionStatus} />
            <StatusBadge label={`${state.healthStatus} health`} />
            <StatusBadge label={`${state.churnRiskLevel} risk`} />
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
          <div className="rounded-2xl border border-brand-border bg-brand-cream/50 p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-brand-subtle">Current plan</dt>
            <dd className="text-sm font-semibold text-brand-navy mt-1">{currentPlan.displayName}</dd>
          </div>
          <div className="rounded-2xl border border-brand-border bg-brand-cream/50 p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-brand-subtle">Next billing date</dt>
            <dd className="text-sm font-semibold text-brand-navy mt-1">{formatDate(state.nextBillingAt)}</dd>
          </div>
          <div className="rounded-2xl border border-brand-border bg-brand-cream/50 p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-brand-subtle">Scheduled change</dt>
            <dd className="text-sm font-semibold text-brand-navy mt-1">
              {state.nextPlan ? SUBSCRIPTION_PLANS[state.nextPlan].displayName : state.cancelAtPeriodEnd ? "Cancel at period end" : "None"}
            </dd>
          </div>
        </dl>

        {message ? (
          <div className="mt-5 rounded-2xl border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-muted">
            {message}
          </div>
        ) : null}
      </div>

      <PlanComparisonTable compact />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
            Need a lighter option?
          </p>
          <h3 className="font-heading font-bold text-xl text-brand-navy">
            {downgradePlan ? `Switch to ${downgradePlan.displayName}` : "Monitor or cancel anytime"}
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed mt-2">
            {downgradePlan
              ? downgradePlan.key === "monitor"
                ? "Need lighter support? Keep monthly visibility oversight with Monitor."
                : "Want to stay supported without the higher-touch plan? Switch to Growth."
              : "Too much right now? Monitor is already the lightest monthly plan, and cancellation stays available."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {downgradePlan ? (
              <ActionButton
                onClick={() => downgrade(downgradePlan.key, "Customer requested lighter plan")}
                disabled={Boolean(working)}
                variant="secondary"
              >
                {working === "downgrade_completed" ? <Loader2 size={16} className="animate-spin" /> : null}
                {downgradePlan.downgradeCtaLabel}
              </ActionButton>
            ) : null}
            <ActionButton onClick={() => runAction("pause_selected")} disabled={Boolean(working)} variant="secondary">
              {working === "pause_selected" ? <Loader2 size={16} className="animate-spin" /> : null}
              {PAUSE_SUPPORT.supported ? "Pause subscription" : "Ask about lighter options"}
            </ActionButton>
          </div>
          {!PAUSE_SUPPORT.supported ? (
            <p className="text-xs text-brand-subtle mt-4">{PAUSE_SUPPORT.message}</p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
            Billing details
          </p>
          <h3 className="font-heading font-bold text-xl text-brand-navy">Payment and provider status</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-brand-muted">Billing provider</dt>
              <dd className="font-semibold text-brand-navy">{state.billingProvider ?? "Not synced yet"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-brand-muted">Provider subscription</dt>
              <dd className="font-semibold text-brand-navy">{state.billingSubscriptionId ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-brand-muted">Payment issue</dt>
              <dd className="font-semibold text-brand-navy">{state.paymentIssueStatus ?? "None recorded"}</dd>
            </div>
          </dl>
          <a
            href={`mailto:shawn@gsally.com?subject=${encodeURIComponent("Billing help for GEO subscription")}`}
            className="mt-5 inline-flex rounded-xl border border-brand-border bg-brand-cream px-4 py-2.5 text-sm font-semibold text-brand-navy hover:border-brand-blue/40"
          >
            Update payment details / get billing help
          </a>
        </div>
      </div>

      <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
          Subscription actions
        </p>
        <h3 className="font-heading font-bold text-xl text-brand-navy">Cancel-anytime options</h3>
        <p className="text-sm text-brand-muted leading-relaxed mt-2 max-w-2xl">
          If monthly support no longer fits, you can cancel. We will show one relevant lighter option
          first, then you can continue cancellation without pressure.
        </p>

        {flowStep === "idle" ? (
          <div className="mt-5">
            <ActionButton onClick={startCancel} disabled={Boolean(working)} variant="danger">
              {working === "cancel_flow_started" ? <Loader2 size={16} className="animate-spin" /> : null}
              Start cancellation
            </ActionButton>
          </div>
        ) : null}

        {flowStep === "reason" ? (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-brand-navy" htmlFor="cancel_reason">
                What is the main reason?
              </label>
              <select
                id="cancel_reason"
                value={selectedReason}
                onChange={(event) => setSelectedReason(event.target.value as CancellationReason)}
                className="mt-2 h-11 w-full rounded-xl border border-brand-border bg-white px-3 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              >
                {CANCELLATION_REASONS.map((reason) => (
                  <option key={reason.key} value={reason.key}>
                    {reason.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-brand-subtle mt-2">
                {CANCELLATION_REASONS.find((reason) => reason.key === selectedReason)?.helper}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-navy" htmlFor="cancel_detail">
                Anything else we should know? <span className="text-brand-subtle">(optional)</span>
              </label>
              <textarea
                id="cancel_detail"
                value={reasonDetail}
                onChange={(event) => setReasonDetail(event.target.value)}
                className="mt-2 min-h-[92px] w-full rounded-xl border border-brand-border p-3 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={submitReason} disabled={Boolean(working)}>
                {working === "cancellation_reason_selected" ? <Loader2 size={16} className="animate-spin" /> : null}
                Continue
              </ActionButton>
              <ActionButton onClick={() => setFlowStep("idle")} disabled={Boolean(working)} variant="secondary">
                Keep my plan
              </ActionButton>
            </div>
          </div>
        ) : null}

        {flowStep === "offer" ? (
          <div className="mt-6 rounded-2xl border border-brand-border bg-brand-cream p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-brand-blue shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-brand-navy">{shownOffer.title}</p>
                <p className="text-sm text-brand-muted leading-relaxed mt-1">{shownOffer.description}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {shownOffer.type !== "clean_cancel" ? (
                <ActionButton onClick={() => acceptOffer(shownOffer)} disabled={Boolean(working)}>
                  {working === "save_offer_accepted" ? <Loader2 size={16} className="animate-spin" /> : null}
                  {shownOffer.ctaLabel}
                </ActionButton>
              ) : null}
              <ActionButton onClick={() => setFlowStep("confirm")} disabled={Boolean(working)} variant="secondary">
                Continue cancellation
              </ActionButton>
            </div>
          </div>
        ) : null}

        {flowStep === "confirm" ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-brand-navy">Confirm cancellation</p>
                <p className="text-sm text-brand-muted leading-relaxed mt-1">
                  Your subscription will be scheduled to end at the end of the current billing period.
                  Access and support continue until then. You can restart later.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <ActionButton onClick={completeCancel} disabled={Boolean(working)} variant="danger">
                {working === "cancellation_completed" ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm cancellation
              </ActionButton>
              <ActionButton onClick={() => setFlowStep("idle")} disabled={Boolean(working)} variant="secondary">
                Keep my plan
              </ActionButton>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
