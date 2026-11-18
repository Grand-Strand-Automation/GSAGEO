import { cn } from "@/lib/utils";

type ScoreRingProps = {
  score: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  placeholder?: string;
};

/** Same thresholds as scoreTone: 0–39 bad, 40–69 warn, 70–100 good. */
function scoreColor(score: number) {
  if (score >= 70) return "#0F766E";
  if (score >= 40) return "#D97706";
  return "#B42318";
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  className,
  label,
  placeholder = "—",
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score == null ? 0 : Math.min(100, Math.max(0, score)) / 100;
  const offset = circumference * (1 - progress);
  const color = score == null ? "#B9C5CF" : scoreColor(score);

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#DCE3E9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {score == null ? (
          <span className="font-mono text-sm font-semibold text-muted text-center px-3 leading-snug">
            {placeholder}
          </span>
        ) : (
          <>
            <span className="font-mono text-3xl font-semibold text-ink leading-none">{score}</span>
            <span className="font-mono text-xs text-muted mt-1">/100</span>
          </>
        )}
      </div>
      {label ? <p className="mt-3 text-sm font-semibold text-ink text-center">{label}</p> : null}
    </div>
  );
}
