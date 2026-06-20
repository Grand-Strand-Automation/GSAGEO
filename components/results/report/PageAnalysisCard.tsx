import type { PageAnalysisItem } from "@/lib/results/page-analysis";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

function signalLabel(value: string): { text: string; className: string } {
  switch (value) {
    case "strong":
    case "clear":
    case "present":
      return { text: value, className: "bg-emerald-50 text-emerald-800" };
    case "moderate":
    case "partial":
      return { text: value, className: "bg-amber-50 text-amber-800" };
    case "limited":
    case "weak":
      return { text: value, className: "bg-orange-50 text-orange-800" };
    default:
      return { text: "review", className: "bg-brand-cream text-brand-muted" };
  }
}

export function PageAnalysisCard({ page }: { page: PageAnalysisItem }) {
  const signals = [
    { label: "Content depth", value: page.contentDepth },
    { label: "CTA strength", value: page.ctaStrength },
    { label: "Trust signals", value: page.trustSignals },
    { label: "Linking", value: page.linkingQuality },
  ];

  return (
    <details className="group rounded-2xl border border-brand-border bg-white shadow-card overflow-hidden">
      <summary className="list-none cursor-pointer p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-blue-light text-brand-blue">
                {page.pageTypeLabel}
              </span>
            </div>
            <p className="font-heading font-bold text-brand-navy truncate">{page.path}</p>
            <p className="text-xs text-brand-muted mt-1 truncate">{page.url}</p>
          </div>
          <ExternalLink size={15} className="shrink-0 text-brand-subtle mt-1" />
        </div>
      </summary>
      <div className="px-5 pb-5 border-t border-brand-border/70 bg-brand-cream/30">
        <p className="pt-4 text-sm text-brand-muted leading-relaxed">{page.summary}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {signals.map((signal) => {
            const tone = signalLabel(signal.value);
            return (
              <div key={signal.label} className="rounded-lg border border-brand-border bg-white px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-brand-subtle">{signal.label}</p>
                <p className={cn("text-xs font-semibold mt-1 capitalize inline-flex px-2 py-0.5 rounded-full", tone.className)}>
                  {tone.text}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-brand-navy">
          <span className="font-semibold">Next step:</span> {page.recommendedNextStep}
        </p>
        <a
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-xs text-brand-blue hover:underline"
        >
          Open page <ExternalLink size={12} />
        </a>
      </div>
    </details>
  );
}
