import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "report-stat-card rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-card-md",
        className,
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-subtle mb-3">
        {label}
      </p>
      <p className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy leading-none">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-brand-muted leading-snug">{hint}</p> : null}
    </div>
  );
}
