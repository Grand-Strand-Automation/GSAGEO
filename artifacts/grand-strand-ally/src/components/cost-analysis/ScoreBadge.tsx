import type { OverlapLevel, ComplianceLevel } from "@/lib/cost-analysis-types";

type BadgeVariant = OverlapLevel | ComplianceLevel;

interface ScoreBadgeProps {
  label: BadgeVariant;
}

const styles: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-red-50 text-red-700 border-red-200",
  "Strong baseline": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs review": "bg-amber-50 text-amber-700 border-amber-200",
  "Priority gap": "bg-red-50 text-red-700 border-red-200",
};

const dots: Record<string, string> = {
  Low: "bg-emerald-500",
  Moderate: "bg-amber-500",
  High: "bg-red-500",
  "Strong baseline": "bg-emerald-500",
  "Needs review": "bg-amber-500",
  "Priority gap": "bg-red-500",
};

export function ScoreBadge({ label }: ScoreBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
        styles[label] ?? "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dots[label] ?? "bg-gray-500"}`} />
      {label}
    </span>
  );
}
