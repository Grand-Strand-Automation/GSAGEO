import type { ScoreCategory } from "@/lib/results/report-view-model";
import { ScoreMeter } from "./ScoreBadge";

export function ScorecardGrid({
  categories,
  strongest,
  weakest,
}: {
  categories: ScoreCategory[];
  strongest: ScoreCategory | null;
  weakest: ScoreCategory | null;
}) {
  return (
    <div className="space-y-6">
      {(strongest || weakest) && (
        <div className="grid md:grid-cols-2 gap-4">
          {strongest ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 mb-1">
                Strongest area
              </p>
              <p className="font-heading font-bold text-brand-navy">{strongest.label}</p>
              <p className="text-sm text-emerald-800 mt-1">
                {strongest.score}/100 · {strongest.interpretation}
              </p>
            </div>
          ) : null}
          {weakest ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 mb-1">
                Needs the most attention
              </p>
              <p className="font-heading font-bold text-brand-navy">{weakest.label}</p>
              <p className="text-sm text-amber-800 mt-1">
                {weakest.score}/100 · {weakest.interpretation}
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <ScoreMeter
            key={cat.key}
            score={cat.score}
            label={cat.label}
            grade={cat.grade}
            interpretation={cat.interpretation}
          />
        ))}
      </div>
    </div>
  );
}
