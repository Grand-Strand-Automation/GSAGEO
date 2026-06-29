import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import {
  ASSESSMENT_PREVIEW,
  type AssessmentPreviewStatus,
} from "@/lib/content/landing";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AssessmentPreviewStatus, string> = {
  "Needs work": "bg-amber-50 text-amber-800 border-amber-200",
  Moderate: "bg-brand-blue-light text-brand-blue border-brand-blue/20",
  Weak: "bg-red-50 text-red-700 border-red-200",
  Strong: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export function SampleOutputPreview() {
  return (
    <section id="sample-output" className="section-pad bg-brand-cream scroll-mt-20">
      <div className="container px-4 md:px-6 max-w-5xl">
        <SectionHeading
          label={ASSESSMENT_PREVIEW.label}
          title={ASSESSMENT_PREVIEW.title}
          description={ASSESSMENT_PREVIEW.description}
          centered
        />

        <div className="rounded-2xl border border-brand-border bg-white shadow-card-md overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-brand-gold via-brand-sky to-brand-blue" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-subtle">
                {ASSESSMENT_PREVIEW.demoLabel}
              </p>
              <p className="text-xs text-brand-muted sm:text-right max-w-md">
                {ASSESSMENT_PREVIEW.demoNote}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {ASSESSMENT_PREVIEW.categoriesReviewed.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex text-[10px] font-semibold uppercase tracking-wide text-brand-muted bg-brand-cream border border-brand-border rounded-full px-2.5 py-1"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {ASSESSMENT_PREVIEW.reviewCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-brand-border bg-brand-cream/40 p-5 md:p-6 transition-colors hover:border-brand-blue/25"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-heading font-bold text-[15px] text-brand-navy leading-snug">
                      {item.title}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border",
                        STATUS_STYLES[item.status],
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">{item.summary}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-[1.4fr_1fr] gap-4">
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue-light/50 p-5 md:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-2">
                  {ASSESSMENT_PREVIEW.nextAction.title}
                </p>
                <p className="text-sm md:text-[15px] text-brand-navy leading-relaxed">
                  {ASSESSMENT_PREVIEW.nextAction.copy}
                </p>
              </div>
              <div className="rounded-xl border border-brand-border bg-white p-5 md:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-subtle mb-2">
                  {ASSESSMENT_PREVIEW.insight.title}
                </p>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {ASSESSMENT_PREVIEW.insight.copy}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-brand-border bg-white p-6 md:p-8 shadow-card text-center max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-brand-navy">
            {ASSESSMENT_PREVIEW.cta.heading}
          </h3>
          <p className="mt-3 text-sm md:text-[15px] text-brand-muted leading-relaxed">
            {ASSESSMENT_PREVIEW.cta.body}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <ButtonLink href={ASSESSMENT_PREVIEW.cta.href} variant="gold" size="md">
              {ASSESSMENT_PREVIEW.cta.label} →
            </ButtonLink>
            <Link
              href={ASSESSMENT_PREVIEW.cta.secondaryHref}
              className="text-sm font-semibold text-brand-blue hover:underline underline-offset-4"
            >
              {ASSESSMENT_PREVIEW.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
