import type { StructuredFinding } from "@/lib/audit/report-builder";
import { priorityLabel, statusBadgeClasses } from "@/lib/results/score-utils";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function FindingCard({
  finding,
  variant = "default",
}: {
  finding: StructuredFinding;
  variant?: "default" | "strength" | "caution";
}) {
  const borderClass =
    variant === "strength"
      ? "border-emerald-200"
      : variant === "caution"
        ? "border-amber-200"
        : "border-brand-border";

  return (
    <details className={cn("group rounded-2xl border bg-white shadow-card overflow-hidden", borderClass)}>
      <summary className="list-none cursor-pointer p-5 md:p-6 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brand-subtle">
                {finding.category}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                  statusBadgeClasses(finding.status),
                )}
              >
                {finding.status}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-cream text-brand-muted">
                {priorityLabel(finding.priority)}
              </span>
            </div>
            <h3 className="font-heading font-bold text-brand-navy text-base">{finding.label}</h3>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">{finding.summary}</p>
          </div>
          <ChevronDown
            size={18}
            className="shrink-0 text-brand-subtle transition-transform group-open:rotate-180 mt-1"
          />
        </div>
      </summary>
      <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-brand-border/70 bg-brand-cream/40">
        <div className="pt-4 space-y-4 text-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-1">
              Recommended action
            </p>
            <p className="text-brand-navy leading-relaxed">{finding.recommendation}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-brand-muted">
            <span>
              <strong className="text-brand-navy">Impact:</strong> {finding.impact}
            </span>
            <span>
              <strong className="text-brand-navy">Confidence:</strong> {finding.confidence}
            </span>
          </div>
          {finding.evidence_urls.length > 0 ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-2">
                Evidence reviewed
              </p>
              <ul className="space-y-1">
                {finding.evidence_urls.slice(0, 4).map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline break-all"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}

export function RecommendationCard({
  finding,
  rank,
}: {
  finding: StructuredFinding;
  rank: number;
}) {
  return (
    <article className="report-priority-card rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-card-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-blue" />
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-2">
        Priority {rank}
      </p>
      <h3 className="font-heading font-bold text-brand-navy text-lg">{finding.label}</h3>
      <p className="mt-2 text-sm text-brand-muted leading-relaxed">{finding.summary}</p>
      <p className="mt-4 text-sm text-brand-navy leading-relaxed">{finding.recommendation}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={cn(
            "text-[10px] font-semibold px-2.5 py-1 rounded-full border",
            statusBadgeClasses(finding.status),
          )}
        >
          {finding.status}
        </span>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-brand-blue-light text-brand-blue">
          {priorityLabel(finding.priority)}
        </span>
      </div>
    </article>
  );
}
