import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import {
  BENCHMARK_CTAS,
  BENCHMARK_PREVIEW_SAMPLES,
  BENCHMARK_SAMPLE_ACTION,
} from "@/lib/content/benchmark";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  Limited: "bg-amber-50 text-amber-800 border-amber-200",
  Moderate: "bg-brand-blue-light text-brand-blue border-brand-blue/20",
  Weak: "bg-red-50 text-red-700 border-red-200",
} as const;

export function BenchmarkPreview() {
  return (
    <section className="section-pad bg-brand-cream">
      <div className="container px-4 md:px-6 max-w-5xl">
        <SectionHeading
          label="Sample Output"
          title="What a Benchmark Result Might Look Like"
          description="Illustrative example only — your actual benchmark reflects your site’s real structure, content, and signals."
          centered
        />
        <div className="rounded-2xl border border-brand-border bg-white shadow-card-md overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-brand-blue via-brand-sky to-brand-blue" />
          <div className="p-6 md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-subtle mb-6">
              Sample benchmark snapshot · Demo layout
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {BENCHMARK_PREVIEW_SAMPLES.map((item) => (
                <div
                  key={item.category}
                  className="rounded-xl border border-brand-border bg-brand-cream/40 p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-heading font-bold text-[15px] text-brand-navy">{item.category}</h3>
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
            <div className="rounded-xl border border-brand-blue/20 bg-brand-blue-light/50 p-5 md:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-2">
                {BENCHMARK_SAMPLE_ACTION.title}
              </p>
              <p className="text-sm md:text-[15px] text-brand-navy leading-relaxed">
                {BENCHMARK_SAMPLE_ACTION.copy}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <ButtonLink href={BENCHMARK_CTAS.primaryAudit} size="md">
            Request Your AI Visibility Audit →
          </ButtonLink>
          <ButtonLink href={BENCHMARK_CTAS.requestSummary} variant="secondaryLight" size="md">
            Request Benchmark Summary
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
