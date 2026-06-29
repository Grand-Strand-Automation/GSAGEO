import { gradeToneClassesForGrade } from "@/lib/results/score-utils";
import { cn } from "@/lib/utils";

export function ScoreBadge({
  score,
  grade,
  size = "lg",
  className,
}: {
  score: number;
  grade: string;
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const colors = gradeToneClassesForGrade(grade);
  const dimension = size === "xl" ? 132 : size === "lg" ? 112 : 88;
  const stroke = size === "xl" ? 8 : 7;
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={dimension} height={dimension} className="-rotate-90" aria-hidden>
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={colors.trackStroke}
          strokeWidth={stroke}
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <span className={cn("text-2xl md:text-3xl font-heading font-extrabold leading-none", colors.text)}>
          {score}
        </span>
        <span className={cn("text-[11px] font-bold uppercase tracking-wide mt-1", colors.text)}>
          /100 · {grade}
        </span>
      </div>
    </div>
  );
}

export function ScoreMeter({
  score,
  label,
  grade,
  interpretation,
}: {
  score: number;
  label: string;
  grade: string;
  interpretation: string;
}) {
  const colors = gradeToneClassesForGrade(grade);

  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-heading font-bold text-brand-navy text-sm">{label}</p>
          <p className={cn("text-xs mt-1 font-medium", colors.text)}>{interpretation}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn("text-lg font-heading font-extrabold", colors.text)}>{score}</p>
          <p className={cn("text-[10px] uppercase tracking-wide font-semibold", colors.text)}>{grade}</p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-brand-cream overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", colors.bar)}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>
    </div>
  );
}
