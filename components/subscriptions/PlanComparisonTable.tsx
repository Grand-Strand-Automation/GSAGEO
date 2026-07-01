import { CheckCircle2, MinusCircle } from "lucide-react";
import {
  PLAN_COMPARISON_ROWS,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanKey,
} from "@/lib/subscriptions/config";

const PLAN_ORDER: SubscriptionPlanKey[] = ["monitor", "growth", "managed"];

function ValuePill({ value, highlighted }: { value: string; highlighted: boolean }) {
  const positive = value === "Yes" || value === "Light" || value === "Higher-touch";
  const limited = value === "Limited";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        highlighted
          ? "bg-white/10 text-white"
          : positive
            ? "bg-emerald-50 text-emerald-700"
            : limited
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-50 text-gray-500"
      }`}
    >
      {positive ? <CheckCircle2 size={13} /> : <MinusCircle size={13} />}
      {value}
    </span>
  );
}

export function PlanComparisonTable({
  title = "Compare monthly plans",
  description = "A simple view of what changes as support gets more hands-on.",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white shadow-card overflow-hidden">
      <div className="p-6 md:p-7 border-b border-brand-border bg-brand-cream/60">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
          Plan comparison
        </p>
        <h3 className="font-heading font-extrabold text-2xl text-brand-navy">{title}</h3>
        <p className="text-sm text-brand-muted mt-2 max-w-2xl leading-relaxed">{description}</p>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-brand-subtle">
                Feature
              </th>
              {PLAN_ORDER.map((planKey) => {
                const plan = SUBSCRIPTION_PLANS[planKey];
                return (
                  <th
                    key={plan.key}
                    className={`px-5 py-4 text-left align-top ${
                      plan.isRecommended ? "bg-brand-navy text-white" : "text-brand-navy"
                    }`}
                  >
                    <div className="space-y-1">
                      {plan.isRecommended ? (
                        <span className="inline-flex rounded-full bg-brand-sky/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-sky">
                          Recommended
                        </span>
                      ) : null}
                      <p className="font-heading font-bold">{plan.displayName}</p>
                      {!compact ? (
                        <p className={`text-xs leading-relaxed ${plan.isRecommended ? "text-white/65" : "text-brand-muted"}`}>
                          {plan.monthlyPositioning}
                        </p>
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {PLAN_COMPARISON_ROWS.map((row) => (
              <tr key={row.key} className="border-b border-brand-border last:border-0">
                <td className="px-5 py-4 font-medium text-brand-navy">{row.label}</td>
                {PLAN_ORDER.map((planKey) => {
                  const highlighted = SUBSCRIPTION_PLANS[planKey].isRecommended;
                  return (
                    <td
                      key={planKey}
                      className={`px-5 py-4 ${highlighted ? "bg-brand-navy text-white" : ""}`}
                    >
                      <ValuePill value={row.values[planKey]} highlighted={highlighted} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-brand-border">
        {PLAN_ORDER.map((planKey) => {
          const plan = SUBSCRIPTION_PLANS[planKey];
          return (
            <div
              key={plan.key}
              className={`p-5 ${plan.isRecommended ? "bg-brand-navy text-white" : "bg-white"}`}
            >
              <div className="mb-4">
                {plan.isRecommended ? (
                  <span className="inline-flex rounded-full bg-brand-sky/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-sky mb-2">
                    Recommended
                  </span>
                ) : null}
                <h4 className={`font-heading font-bold ${plan.isRecommended ? "text-white" : "text-brand-navy"}`}>
                  {plan.displayName}
                </h4>
                <p className={`text-xs mt-1 ${plan.isRecommended ? "text-white/65" : "text-brand-muted"}`}>
                  {plan.monthlyPositioning}
                </p>
              </div>
              <dl className="space-y-3">
                {PLAN_COMPARISON_ROWS.map((row) => (
                  <div key={row.key} className="flex items-center justify-between gap-3">
                    <dt className={`text-sm ${plan.isRecommended ? "text-white/75" : "text-brand-muted"}`}>
                      {row.label}
                    </dt>
                    <dd>
                      <ValuePill value={row.values[planKey]} highlighted={plan.isRecommended} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
