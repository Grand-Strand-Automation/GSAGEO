import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { CTABand } from "@/components/CTABand";
import { FaqItem } from "@/components/FaqItem";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBar } from "@/components/TrustBar";
import { ButtonLink } from "@/components/ui/Button";
import { BenchmarkHero } from "./BenchmarkHero";
import { BenchmarkPreview } from "./BenchmarkPreview";
import {
  BENCHMARK_AUDIENCE,
  BENCHMARK_CATEGORIES,
  BENCHMARK_COMMON_ISSUES,
  BENCHMARK_CTAS,
  BENCHMARK_DELIVERABLES,
  BENCHMARK_FAQ,
  BENCHMARK_FINAL_CTA,
  BENCHMARK_INTRO,
  BENCHMARK_LOCAL_CONTEXT,
  BENCHMARK_MID_CTA,
  BENCHMARK_NOT_FIT,
  BENCHMARK_PROCESS,
  BENCHMARK_STAT_STRIP,
  BENCHMARK_WHY,
} from "@/lib/content/benchmark";

export function BenchmarkPage() {
  return (
    <div className="flex flex-col">
      <BenchmarkHero />

      <TrustBar
        items={[
          "Myrtle Beach & Grand Strand focus",
          "Service-business benchmark framework",
          "Practical gaps — not ranking hype",
        ]}
      />

      <section className="section-pad bg-white">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading label={BENCHMARK_INTRO.label} title={BENCHMARK_INTRO.title} />
          <div className="space-y-5 text-brand-muted text-base md:text-lg leading-relaxed -mt-4">
            {BENCHMARK_INTRO.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container px-4 md:px-6">
          <SectionHeading label="Audience" title="Who This Is For" centered />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {BENCHMARK_AUDIENCE.map(({ title, copy }) => (
              <div key={title} className="card-brand-hover p-6 md:p-7 h-full">
                <div className="w-9 h-9 rounded-lg bg-brand-blue-light flex items-center justify-center mb-4">
                  <span className="w-2 h-2 rounded-full bg-brand-blue" />
                </div>
                <h3 className="font-heading font-bold text-[15px] text-brand-navy mb-2">{title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto mt-10 card-brand p-6 md:p-7 border-dashed">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-[0.12em] mb-3">
              {BENCHMARK_NOT_FIT.title}
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed flex gap-3">
              <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              {BENCHMARK_NOT_FIT.copy}
            </p>
          </div>
        </div>
      </section>

      <section id="what-we-measure" className="section-pad bg-white scroll-mt-20">
        <div className="container px-4 md:px-6">
          <SectionHeading
            label="Framework"
            title="What We Measure"
            description="Nine categories that shape whether AI systems can understand, summarize, and confidently represent your business."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {BENCHMARK_CATEGORIES.map(({ title, copy, why }) => (
              <div key={title} className="card-brand p-6 md:p-7 flex flex-col h-full shadow-card">
                <h3 className="font-heading font-bold text-[15px] text-brand-navy mb-3">{title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed mb-4 flex-grow">{copy}</p>
                <p className="text-xs text-brand-subtle leading-relaxed border-t border-brand-border pt-4">
                  <span className="font-bold uppercase tracking-wide text-brand-blue">Why it matters · </span>
                  {why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-navy text-white">
        <div className="container px-4 md:px-6 max-w-5xl">
          <SectionHeading
            label="Common Patterns"
            title="What We Commonly See on Local Service Websites"
            light
            centered
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {BENCHMARK_COMMON_ISSUES.map(({ title, copy }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5 md:p-6"
              >
                <h3 className="font-heading font-bold text-[15px] text-white mb-2">{title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading
            label={BENCHMARK_LOCAL_CONTEXT.label}
            title={BENCHMARK_LOCAL_CONTEXT.title}
          />
          <div className="space-y-5 text-brand-muted text-base md:text-lg leading-relaxed -mt-4 mb-10">
            {BENCHMARK_LOCAL_CONTEXT.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BENCHMARK_STAT_STRIP.map(({ label, value }) => (
              <div key={label} className="card-brand p-5 text-center shadow-card">
                <p className="text-2xl font-heading font-extrabold text-brand-navy mb-1">{value}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-subtle">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container px-4 md:px-6 max-w-4xl">
          <SectionHeading label="Process" title="How the Benchmark Works" centered />
          <div className="space-y-4 max-w-3xl mx-auto">
            {BENCHMARK_PROCESS.map(({ step, title, copy }) => (
              <div
                key={step}
                className="flex gap-5 md:gap-6 card-brand p-5 md:p-6 shadow-card items-start"
              >
                <span className="shrink-0 w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue font-heading font-extrabold text-sm flex items-center justify-center">
                  {step}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-[15px] text-brand-navy mb-1.5">{title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container px-4 md:px-6 max-w-4xl">
          <SectionHeading label="Deliverables" title="What You Get" centered />
          <div className="grid sm:grid-cols-2 gap-5">
            {BENCHMARK_DELIVERABLES.map(({ title, copy }) => (
              <div key={title} className="card-brand p-6 flex gap-4 shadow-card">
                <CheckCircle2 size={18} className="text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-bold text-[15px] text-brand-navy mb-2">{title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BenchmarkPreview />

      <section className="section-pad bg-white">
        <div className="container px-4 md:px-6 max-w-4xl">
          <SectionHeading label={BENCHMARK_WHY.label} title={BENCHMARK_WHY.title} />
          <div className="space-y-5 text-brand-muted text-base leading-relaxed -mt-4 mb-10 max-w-3xl">
            {BENCHMARK_WHY.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {BENCHMARK_WHY.pillars.map(({ title, copy }) => (
              <div key={title} className="card-brand-hover p-6">
                <h3 className="font-heading font-bold text-[15px] text-brand-navy mb-2">{title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container px-4 md:px-6 max-w-2xl text-center">
          <SectionHeading title={BENCHMARK_MID_CTA.title} description={BENCHMARK_MID_CTA.copy} centered />
          <div className="flex flex-col sm:flex-row gap-3 justify-center -mt-4">
            <ButtonLink href={BENCHMARK_CTAS.primaryAudit} size="md">
              Request Your AI Visibility Assessment →
            </ButtonLink>
            <ButtonLink href={BENCHMARK_CTAS.bookReview} variant="secondaryLight" size="md">
              Book a Benchmark Review
            </ButtonLink>
          </div>
          <p className="text-sm text-brand-subtle mt-6 max-w-lg mx-auto leading-relaxed">
            {BENCHMARK_MID_CTA.supportLine}
          </p>
          <p className="text-sm text-brand-muted mt-4">
            Want the summary first?{" "}
            <Link href={BENCHMARK_CTAS.requestSummary} className="text-brand-blue font-medium hover:underline">
              Request the benchmark overview
            </Link>
          </p>
        </div>
      </section>

      <section id="faq" className="section-pad bg-white scroll-mt-20">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading label="FAQ" title="Frequently Asked Questions" />
          <div className="card-brand px-6 md:px-8 shadow-card">
            {BENCHMARK_FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title={BENCHMARK_FINAL_CTA.title}
        subtitle={BENCHMARK_FINAL_CTA.copy}
        buttons={[
          { label: "Request Your AI Visibility Assessment", href: BENCHMARK_CTAS.primaryAudit, primary: true },
          { label: "Book a Benchmark Review", href: BENCHMARK_CTAS.bookReview, primary: false },
        ]}
      />
    </div>
  );
}
