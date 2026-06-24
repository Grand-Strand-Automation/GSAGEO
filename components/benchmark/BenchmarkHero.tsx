import { HeroOverlay } from "@/components/HeroOverlay";
import { ButtonLink } from "@/components/ui/Button";
import { BENCHMARK_CTAS, BENCHMARK_HERO } from "@/lib/content/benchmark";
import { MapPin, Sparkles, Target } from "lucide-react";

const chipIcons = [MapPin, Target, Sparkles] as const;

export function BenchmarkHero() {
  return (
    <section className="bg-brand-hero text-white pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
      <HeroOverlay />
      <div className="container px-4 md:px-6 max-w-4xl relative z-10">
        <div className="eyebrow-pill mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-sky inline-block" />
          {BENCHMARK_HERO.eyebrow}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-heading font-extrabold mb-6 leading-[1.05] max-w-3xl">
          {BENCHMARK_HERO.headline}
        </h1>
        <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mb-8">
          {BENCHMARK_HERO.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <ButtonLink href={BENCHMARK_CTAS.primaryAudit}>{BENCHMARK_HERO.primaryCta} →</ButtonLink>
          <ButtonLink href={BENCHMARK_CTAS.bookReview} variant="secondary">
            {BENCHMARK_HERO.secondaryCta}
          </ButtonLink>
        </div>
        <div className="flex flex-wrap gap-2.5 mb-8">
          {BENCHMARK_HERO.chips.map((chip, i) => {
            const Icon = chipIcons[i] ?? MapPin;
            return (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/80"
              >
                <Icon size={13} className="text-brand-sky shrink-0" />
                {chip}
              </span>
            );
          })}
        </div>
        <p className="text-sm text-white/50 leading-relaxed max-w-2xl border-t border-white/10 pt-6">
          {BENCHMARK_HERO.supportParagraph}
        </p>
      </div>
    </section>
  );
}
