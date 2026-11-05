import type { CustomerScoreRow } from "@/lib/results/customer-report-view-model";
import { gradeToneClassesForGrade } from "@/lib/results/score-utils";
import { cn } from "@/lib/utils";

export function CustomerSimpleScorecard({ rows }: { rows: CustomerScoreRow[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
      {rows.map((row) => {
        const colors = gradeToneClassesForGrade(row.grade);
        return (
          <div
            key={row.key}
            className="rounded-2xl border border-brand-border bg-white p-4 md:p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-heading font-semibold text-brand-navy text-sm leading-snug">
                  {row.label}
                </p>
                <p className={cn("text-xs mt-1 font-medium", colors.text)}>{row.statusLabel}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={cn("text-lg font-heading font-extrabold", colors.text)}>{row.score}</p>
                <p className={cn("text-[10px] uppercase tracking-wide font-semibold", colors.text)}>
                  /100 · {row.grade}
                </p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-brand-cream overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", colors.bar)}
                style={{ width: `${Math.max(4, row.score)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
