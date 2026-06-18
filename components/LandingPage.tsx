import Link from "next/link";
import { CheckCircle2, Minus } from "lucide-react";
import { CTABand } from "@/components/CTABand";
import { FaqItem } from "@/components/FaqItem";
import { HeroOverlay } from "@/components/HeroOverlay";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBar } from "@/components/TrustBar";
import { ButtonLink } from "@/components/ui/Button";
import {
  DELIVERABLES,
  FAQ_ITEMS,
  GOOD_FIT,
  NOT_FIT,
  PRICING_CUSTOM_NOTE,
  PRICING_HEADLINE,
  PRICING_HELPER,
  PRICING_INTRO,
  PRICING_REASSURANCE,
  TIERS,
  WHATS_INCLUDED,
} from "@/lib/content/landing";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-brand-hero text-white pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <HeroOverlay />
        <div className="container px-4 md:px-6 max-w-4xl relative z-10">
          <div className="eyebrow-pill mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sky inline-block" />
            GEO / AI Visibility
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-6 leading-[1.05] max-w-3xl">
            Show up in AI-generated answers, not just search results.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mb-8">
            Customers are increasingly finding service providers through AI-powered answer engines.
            Generative Engine Optimization helps your business become the kind of source those engines reference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <ButtonLink href="/audit">Request a GEO Audit →</ButtonLink>
            <ButtonLink href="#whats-included" variant="secondary">
              See What&apos;s Included
            </ButtonLink>
          </div>
          <p className="text-xs text-white/35 font-medium">
            Practical review · No-pressure approach · Grand Strand–based
          </p>
        </div>
      </section>

      <TrustBar
        items={[
          "No hype, no jargon",
          "Clear deliverables at every tier",
          "Based in the Grand Strand since 2015",
        ]}
      />

      <section className="section-pad bg-white">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading
            label="Understanding GEO"
            title="What is Generative Engine Optimization?"
          />
          <div className="space-y-5 text-brand-muted text-base md:text-lg leading-relaxed -mt-4">
            <p>
              When someone asks ChatGPT, Perplexity, or Google&apos;s AI Overview to recommend a service
              provider, the answer is generated from content those systems have indexed. Businesses that
              appear tend to have sites that are clearly structured, well-documented, and content-rich.
            </p>
            <p>
              GEO is the practice of improving how your business is understood, cited, and surfaced by AI
              search systems. Unlike traditional SEO, GEO focuses on content clarity, entity recognition,
              structured data, and the page types that help AI systems represent your business accurately.
            </p>
            <p>
              This is methodical work: auditing your site, identifying gaps, and building the content and
              structure that makes your business easier to understand — for both AI systems and the people
              asking them questions.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container px-4 md:px-6 max-w-4xl">
          <SectionHeading title="A good fit — and not a good fit." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="card-brand p-7 md:p-8 shadow-card">
              <h3 className="text-sm font-bold text-brand-navy uppercase tracking-[0.12em] mb-5">
                Good fit
              </h3>
              <ul className="space-y-3.5">
                {GOOD_FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-brand-muted leading-relaxed">
                    <CheckCircle2 size={16} className="text-brand-blue flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-brand p-7 md:p-8 shadow-card">
              <h3 className="text-sm font-bold text-brand-muted uppercase tracking-[0.12em] mb-5">
                Not a fit
              </h3>
              <ul className="space-y-3.5">
                {NOT_FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-brand-muted leading-relaxed">
                    <Minus size={16} className="text-brand-subtle flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="whats-included" className="section-pad bg-white scroll-mt-20">
        <div className="container px-4 md:px-6">
          <SectionHeading
            label="What's Included"
            title="Everything covered in a GEO engagement."
            description="Every audit covers these nine areas. The depth of implementation depends on the engagement tier."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHATS_INCLUDED.map(({ title, desc }) => (
              <div key={title} className="card-brand-hover p-6 md:p-7">
                <div className="w-9 h-9 rounded-lg bg-brand-blue-light flex items-center justify-center mb-4">
                  <span className="w-2 h-2 rounded-full bg-brand-blue" />
                </div>
                <h3 className="font-heading font-bold text-[15px] text-brand-navy mb-2">{title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading label="Deliverables" title="What you receive." />
          <ul className="space-y-4 -mt-2">
            {DELIVERABLES.map((item) => (
              <li key={item} className="flex gap-3 text-brand-muted text-base leading-relaxed">
                <CheckCircle2 size={18} className="text-brand-blue flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/audit" size="md">
              Request a GEO Audit →
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="pricing" className="section-pad bg-brand-cream scroll-mt-20">
        <div className="container px-4 md:px-6">
          <SectionHeading
            label="Plans for SMBs"
            title={PRICING_HEADLINE}
            description={PRICING_INTRO}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={
                  tier.primary
                    ? "rounded-xl border border-brand-blue/30 bg-brand-navy text-white p-7 md:p-8 flex flex-col shadow-card-md ring-1 ring-brand-sky/20"
                    : "card-brand p-7 md:p-8 flex flex-col shadow-card"
                }
              >
                <span
                  className={
                    tier.primary
                      ? "inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3 w-fit bg-brand-sky/15 text-brand-sky"
                      : "inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3 w-fit bg-brand-blue-light text-brand-blue"
                  }
                >
                  {tier.badge}
                </span>
                <h3
                  className={`font-heading font-bold text-lg mb-1 ${tier.primary ? "text-white" : "text-brand-navy"}`}
                >
                  {tier.name}
                </h3>
                <div
                  className={`text-2xl font-heading font-extrabold mb-1 ${tier.primary ? "text-white" : "text-brand-navy"}`}
                >
                  {tier.price}
                </div>
                <p
                  className={`text-xs font-medium mb-4 ${tier.primary ? "text-white/55" : "text-brand-subtle"}`}
                >
                  {tier.period}
                </p>
                <p
                  className={`text-sm leading-relaxed mb-6 flex-grow ${tier.primary ? "text-white/65" : "text-brand-muted"}`}
                >
                  {tier.desc}
                </p>
                <ul className="space-y-2.5 mb-8">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className={`flex gap-2 text-sm leading-relaxed ${tier.primary ? "text-white/80" : "text-brand-muted"}`}
                    >
                      <CheckCircle2
                        size={14}
                        className={`flex-shrink-0 mt-0.5 ${tier.primary ? "text-brand-sky" : "text-brand-blue"}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/audit?tier=${tier.tier}`}
                  variant={tier.primary ? "primary" : "secondaryLight"}
                  size="md"
                  className="w-full mt-auto"
                >
                  {tier.cta} →
                </ButtonLink>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-brand-border bg-white rounded-xl border border-brand-border shadow-sm">
            {PRICING_REASSURANCE.map((label) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2.5 py-4 sm:px-6 text-sm text-brand-muted font-medium text-center"
              >
                <CheckCircle2 size={14} className="text-brand-blue flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-sm text-brand-muted leading-relaxed">{PRICING_HELPER}</p>
            <p className="text-sm text-brand-muted">
              {PRICING_CUSTOM_NOTE}{" "}
              <Link href="/audit?tier=custom" className="text-brand-blue hover:underline font-medium">
                Request a custom GEO engagement.
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="section-pad bg-white scroll-mt-20">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading label="FAQ" title="Common questions about GEO." />
          <div className="card-brand px-6 md:px-8 shadow-card">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Ready to see where your business stands?"
        subtitle="We review your site, score it across eight GEO-readiness categories, and give you a clear plan for what to improve first."
        buttons={[
          { label: "Request a GEO Audit", href: "/audit", primary: true },
          { label: "View Pricing", href: "/#pricing", primary: false },
        ]}
      />
    </div>
  );
}
