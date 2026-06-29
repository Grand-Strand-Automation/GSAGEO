import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { SampleOutputPreview } from "@/components/landing/SampleOutputPreview";
import { CTABand } from "@/components/CTABand";
import { FaqItem } from "@/components/FaqItem";
import { HeroOverlay } from "@/components/HeroOverlay";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBar } from "@/components/TrustBar";
import { ButtonLink } from "@/components/ui/Button";
import {
  DELIVERABLES,
  DELIVERABLES_HEADING,
  DELIVERABLES_INTRO,
  DELIVERABLES_SUPPORT,
  FAQ_ITEMS,
  GOOD_FIT,
  HOME_HERO,
  MONTHLY_RHYTHM,
  NOT_FIT,
  PRICING_CUSTOM_NOTE,
  PRICING_DOWNGRADE_NOTE,
  PRICING_HEADLINE,
  PRICING_HELPER,
  PRICING_INTRO,
  PRICING_REASSURANCE,
  PRICING_SUBLINE,
  TIERS,
  WHATS_INCLUDED,
  WHATS_INCLUDED_INTRO,
  WHY_ONGOING,
} from "@/lib/content/landing";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-brand-hero text-white pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <HeroOverlay />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-12 items-start max-w-6xl">
            <div className="max-w-3xl">
              <div className="eyebrow-pill mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sky inline-block" />
                {HOME_HERO.eyebrow}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-heading font-extrabold mb-6 leading-[1.05]">
                {HOME_HERO.headline}
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mb-8">
                {HOME_HERO.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <ButtonLink href={HOME_HERO.primaryHref}>{HOME_HERO.primaryCta} →</ButtonLink>
                <ButtonLink href={HOME_HERO.secondaryHref} variant="secondary">
                  {HOME_HERO.secondaryCta}
                </ButtonLink>
              </div>
              <p className="text-sm text-white/50 font-medium">{HOME_HERO.supportLine}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm p-6 md:p-7 shadow-card-md lg:mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-sky mb-4">
                {HOME_HERO.reviewCardTitle}
              </p>
              <ul className="space-y-3">
                {HOME_HERO.reviewCardBullets.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/80 leading-relaxed">
                    <CheckCircle2 size={16} className="text-brand-sky shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <TrustBar
        items={[
          "Free assessment to start",
          "Month-to-month · cancel anytime",
          "Based in the Grand Strand since 2015",
        ]}
      />

      <section id="understanding-geo" className="section-pad bg-brand-cream scroll-mt-20">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading
            label="Understanding GEO"
            title="What is AI Visibility support?"
          />
          <div className="space-y-5 text-brand-muted text-base md:text-lg leading-relaxed -mt-4">
            <p>
              When someone asks ChatGPT, Perplexity, or Google&apos;s AI Overview to recommend a service
              provider, the answer is built from content those systems have indexed. Businesses that show up
              clearly tend to have websites that are easy to understand, well-organized, and trustworthy.
            </p>
            <p>
              GEO — Generative Engine Optimization — is about improving how clearly your business appears
              in those AI-driven answers. It is not a one-time report. It is ongoing work on clarity, trust,
              content, and structure so customers and search tools can understand what you do.
            </p>
            <p>
              We start with a free assessment so you know where you stand. If you want help improving over
              time, monthly support gives you practical next steps each month — without long contracts or
              technical overwhelm.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
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
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
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
                    <XCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="whats-included" className="section-pad bg-white scroll-mt-20">
        <div className="container px-4 md:px-6 max-w-4xl">
          <SectionHeading
            title="What's Included"
            description={WHATS_INCLUDED_INTRO}
            className="mb-8 md:mb-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {WHATS_INCLUDED.map(({ title, desc }) => (
              <div
                key={title}
                className="flex gap-3.5 rounded-xl border border-brand-border/80 bg-brand-cream/30 px-4 py-4 md:px-5 md:py-4"
              >
                <CheckCircle2 size={18} className="text-brand-blue shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-[15px] text-brand-navy leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm text-brand-muted leading-snug mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 md:mt-14 pt-12 md:pt-14 border-t border-brand-border">
            <SectionHeading
              title={DELIVERABLES_HEADING}
              description={DELIVERABLES_INTRO}
              className="mb-8 md:mb-10"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {DELIVERABLES.map(({ title, desc }) => (
                <div
                  key={title}
                  className="flex gap-3.5 rounded-xl border border-brand-border/80 bg-white px-4 py-4 md:px-5 md:py-4"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-[15px] text-brand-navy leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-brand-muted leading-snug mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 md:mt-8 text-sm text-brand-muted text-center leading-relaxed">
              {DELIVERABLES_SUPPORT}
            </p>
            <div className="mt-8 text-center">
              <ButtonLink href={HOME_HERO.primaryHref} size="md">
                {HOME_HERO.primaryCta} →
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-pad bg-brand-cream scroll-mt-20">
        <div className="container px-4 md:px-6 max-w-4xl">
          <SectionHeading
            label={MONTHLY_RHYTHM.label}
            title={MONTHLY_RHYTHM.title}
            description={MONTHLY_RHYTHM.intro}
            className="mb-10"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MONTHLY_RHYTHM.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-brand-border bg-white p-5 shadow-card"
              >
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-blue mb-2">
                  Step {index + 1}
                </p>
                <h3 className="font-heading font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container px-4 md:px-6 max-w-3xl text-center">
          <SectionHeading
            label={WHY_ONGOING.label}
            title={WHY_ONGOING.title}
            className="mb-6"
          />
          <div className="space-y-4 text-brand-muted text-base leading-relaxed -mt-2">
            {WHY_ONGOING.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-brand-navy">{WHY_ONGOING.support}</p>
        </div>
      </section>

      <SampleOutputPreview />

      <section id="pricing" className="section-pad bg-brand-cream scroll-mt-20">
        <div className="container px-4 md:px-6">
          <SectionHeading
            label="Monthly plans"
            title={PRICING_HEADLINE}
            description={PRICING_INTRO}
          />
          <p className="text-center text-sm font-semibold text-brand-navy -mt-4 mb-10">
            {PRICING_SUBLINE}
          </p>
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
            <p className="text-sm text-brand-muted leading-relaxed">{PRICING_DOWNGRADE_NOTE}</p>
            <p className="text-sm text-brand-muted">
              {PRICING_CUSTOM_NOTE}{" "}
              <Link href="/audit?tier=custom" className="text-brand-blue hover:underline font-medium">
                Request a custom engagement.
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="section-pad bg-white scroll-mt-20">
        <div className="container px-4 md:px-6 max-w-3xl">
          <SectionHeading label="FAQ" title="Common questions about monthly GEO support." />
          <div className="card-brand px-6 md:px-8 shadow-card">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Start with a free assessment — continue month-to-month if it makes sense"
        subtitle="See how clearly your business appears in AI search, get practical priorities, and choose ongoing support only when you are ready."
        buttons={[
          { label: "Start Your Free Assessment", href: "/audit", primary: true },
          { label: "See Monthly Plans", href: "/#pricing", primary: false },
        ]}
      />
    </div>
  );
}
