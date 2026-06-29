import type { CustomerScoreRow } from "@/lib/results/customer-report-view-model";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, CircleDashed } from "lucide-react";

function statusIcon(status: CustomerScoreRow["status"]) {
  switch (status) {
    case "good":
      return <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />;
    case "needs_attention":
      return <AlertCircle size={18} className="text-amber-600 shrink-0" />;
    default:
      return <CircleDashed size={18} className="text-red-500 shrink-0" />;
  }
}

function statusClasses(status: CustomerScoreRow["status"]) {
  switch (status) {
    case "good":
      return "bg-emerald-50 border-emerald-200 text-emerald-800";
    case "needs_attention":
      return "bg-amber-50 border-amber-200 text-amber-800";
    default:
      return "bg-red-50 border-red-200 text-red-800";
  }
}

export function CustomerSimpleScorecard({ rows }: { rows: CustomerScoreRow[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
      {rows.map((row) => (
        <div
          key={row.key}
          className="rounded-2xl border border-brand-border bg-white p-4 md:p-5 shadow-card flex items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3 min-w-0">
            {statusIcon(row.status)}
            <p className="font-heading font-semibold text-brand-navy text-sm leading-snug">{row.label}</p>
          </div>
          <span
            className={cn(
              "shrink-0 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border",
              statusClasses(row.status),
            )}
          >
            {row.statusLabel}
          </span>
        </div>
      ))}
    </div>
  );
}
