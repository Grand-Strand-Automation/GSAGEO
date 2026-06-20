import type { GeoFixPreview } from "@/lib/types/database";
import { effortLabel, priorityLabel } from "@/lib/results/score-utils";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  faq: "FAQ preview",
  service_page: "Service page preview",
  cta: "CTA preview",
  internal_linking: "Internal linking preview",
  schema: "Schema preview",
  trust: "Trust content preview",
  messaging: "Messaging preview",
};

export function FixPreviewCard({ preview }: { preview: GeoFixPreview }) {
  const typeLabel = TYPE_LABELS[preview.type] ?? preview.type.replace(/_/g, " ");

  return (
    <article className="report-preview-card rounded-2xl border border-brand-border bg-white overflow-hidden shadow-card-md">
      <div className="bg-gradient-to-r from-brand-blue-light to-white px-5 md:px-6 py-4 border-b border-brand-border">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue">
          {typeLabel}
        </p>
        <h3 className="font-heading font-bold text-brand-navy text-lg mt-1">{preview.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white border border-brand-border text-brand-muted">
            {priorityLabel(preview.priority)}
          </span>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white border border-brand-border text-brand-muted">
            {effortLabel(preview.implementation_effort)}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-1">Issue</p>
          <p className="text-sm text-brand-muted leading-relaxed">{preview.issue_summary}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-1">
            Why it matters
          </p>
          <p className="text-sm text-brand-muted leading-relaxed">{preview.why_it_matters}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {preview.before_text ? (
            <div className="rounded-xl border border-brand-border bg-brand-cream/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-2">
                Before (example)
              </p>
              <p className="text-sm text-brand-muted italic leading-relaxed whitespace-pre-wrap">
                {preview.before_text}
              </p>
            </div>
          ) : null}
          <div
            className={cn(
              "rounded-xl border border-brand-blue/20 bg-brand-blue-light/40 p-4",
              !preview.before_text && "md:col-span-2",
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-blue mb-2">
              Example improvement
            </p>
            {preview.type === "schema" ? (
              <pre className="text-xs text-brand-navy whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                {preview.after_text}
              </pre>
            ) : preview.type === "faq" && preview.html_preview ? (
              <div
                className="prose prose-sm max-w-none text-brand-navy [&_summary]:cursor-pointer [&_details]:border-b [&_details]:border-brand-border [&_details]:py-2"
                dangerouslySetInnerHTML={{ __html: preview.html_preview }}
              />
            ) : (
              <p className="text-sm text-brand-navy leading-relaxed whitespace-pre-wrap">
                {preview.after_text}
              </p>
            )}
          </div>
        </div>

        {preview.evidence_urls?.length ? (
          <p className="text-xs text-brand-subtle">
            Related pages: {preview.evidence_urls.slice(0, 2).join(", ")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
