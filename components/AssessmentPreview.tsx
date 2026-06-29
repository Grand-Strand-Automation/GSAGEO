import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { SAMPLE_OUTPUT_PREVIEW } from "@/lib/content/landing";
import { PREVIEW_STATUS_STYLES } from "@/lib/brand/preview-status";
import { cn } from "@/lib/utils";

export function AssessmentPreview() {
  const { label, title, description, samples, nextBestAction, insight, categoriesReviewed, cta } =
    SAMPLE_OUTPUT_PREVIEW;

  return (
    <section id="assessment-preview" className="section-pad bg-brand-cream scroll-mt-20">
      <div className="container px-4 md:px-6 max-w-5xl">
        <SectionHeading label={label} title={title} description={description} centered />

        <div className="rounded-2xl border border-brand-border bg-white shadow-card-md overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-brand-blue via-brand-sky to-brand-blue" />
          <div className="p-6 md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-subtle mb-5">
              Simplified preview · Illustrative example only
            </p>

            {categoriesReviewed.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categoriesReviewed.map((category) => (
                  <span
                    key={category}
                    className="text-[11px] font-semibold text-brand-muted bg-brand-cream border border-brand-border rounded-full px-3 py-1"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {samples.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-brand-border bg-brand-cream/40 p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-heading font-bold text-[15px] text-brand-navy">{item.title}</h3>
                    <span
                      className={cn(
                        "shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border",
                        PREVIEW_STATUS_STYLES[item.status],
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">{item.summary}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue-light/50 p-5 md:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-2">
                  {nextBestAction.title}
                </p>
                <p className="text-sm md:text-[15px] text-brand-navy leading-relaxed">
                  {nextBestAction.copy}
                </p>
              </div>

              <div className="rounded-xl border border-brand-border bg-brand-cream/60 p-5 md:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-muted mb-2">
                  {insight.title}
                </p>
                <p className="text-sm text-brand-muted leading-relaxed">{insight.copy}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <ButtonLink href={cta.href} size="md">
            {cta.label} →
          </ButtonLink>
          <p className="text-sm text-brand-muted leading-relaxed max-w-xl mx-auto">{cta.support}</p>
        </div>
      </div>
    </section>
  );
}
