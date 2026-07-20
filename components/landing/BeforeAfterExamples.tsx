import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { BEFORE_AFTER } from "@/lib/content/landing";

export function BeforeAfterExamples() {
  return (
    <section id="examples" className="section-pad bg-white scroll-mt-20">
      <div className="container px-4 md:px-6 max-w-5xl">
        <SectionHeading
          label={BEFORE_AFTER.label}
          title={BEFORE_AFTER.title}
          description={BEFORE_AFTER.intro}
          className="mb-10"
        />

        <div className="grid gap-6 md:gap-8">
          {BEFORE_AFTER.examples.map((example) => (
            <article
              key={example.id}
              className="rounded-2xl border border-brand-border bg-brand-cream/40 overflow-hidden shadow-card"
            >
              <div className="px-5 md:px-7 pt-5 md:pt-6 pb-3 flex flex-wrap items-center gap-2 justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-1">
                    {example.label}
                  </p>
                  <h3 className="font-heading font-bold text-lg text-brand-navy">{example.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {example.changed.map((tag) => (
                    <li
                      key={tag}
                      className="text-[11px] font-semibold text-brand-navy/80 bg-white border border-brand-border rounded-full px-2.5 py-1"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-2 px-5 md:px-7 pb-6 md:pb-7">
                <div className="rounded-xl border border-brand-border/80 bg-white p-4 md:p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-muted mb-3">
                    {example.beforeLabel}
                  </p>
                  <ul className="space-y-2.5">
                    {example.beforePoints.map((point) => (
                      <li key={point} className="text-sm text-brand-muted leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden md:flex items-center justify-center px-1">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-white">
                    <ArrowRight size={16} />
                  </span>
                </div>

                <div className="mt-3 md:mt-0 rounded-xl border border-brand-blue/25 bg-white p-4 md:p-5 ring-1 ring-brand-sky/20">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-blue mb-3">
                    {example.afterLabel}
                  </p>
                  <ul className="space-y-2.5">
                    {example.afterPoints.map((point) => (
                      <li key={point} className="text-sm text-brand-navy leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-brand-muted leading-relaxed max-w-2xl mx-auto">
          {BEFORE_AFTER.disclaimer}
        </p>
      </div>
    </section>
  );
}
