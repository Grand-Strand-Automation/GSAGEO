import type { RoadmapBucket } from "@/lib/results/report-view-model";
import { effortLabel } from "@/lib/results/score-utils";

export function RoadmapSection({ roadmap }: { roadmap: RoadmapBucket[] }) {
  return (
    <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
      {roadmap.map((bucket, index) => (
        <div
          key={bucket.title}
          className="rounded-2xl border border-brand-border bg-white shadow-card-md overflow-hidden flex flex-col"
        >
          <div
            className={`px-5 py-4 border-b border-brand-border ${
              index === 0
                ? "bg-brand-navy text-white"
                : index === 1
                  ? "bg-brand-blue-light"
                  : "bg-brand-cream"
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-80">Roadmap</p>
            <h3 className="font-heading font-bold text-lg mt-1">{bucket.title}</h3>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                index === 0 ? "text-white/70" : "text-brand-muted"
              }`}
            >
              {bucket.subtitle}
            </p>
          </div>
          <ul className="p-5 space-y-4 flex-1">
            {bucket.items.length === 0 ? (
              <li className="text-sm text-brand-muted">No major items in this tier for this audit.</li>
            ) : (
              bucket.items.map((item) => (
                <li key={item.title} className="rounded-xl border border-brand-border bg-brand-cream/40 p-4">
                  <p className="font-heading font-bold text-brand-navy text-sm">{item.title}</p>
                  <p className="text-sm text-brand-muted mt-2 leading-relaxed">{item.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wide text-brand-subtle">
                    <span>Impact: {item.impact}</span>
                    <span>·</span>
                    <span>{effortLabel(String(item.effort))}</span>
                  </div>
                  {item.pages.length > 0 ? (
                    <p className="mt-2 text-xs text-brand-subtle">Pages: {item.pages.join(", ")}</p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
