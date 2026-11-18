"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaqItem } from "@/components/FaqItem";
import { GeoAbbr } from "@/components/GeoAbbr";
import { IncludedIcon, IconCheck } from "@/components/icons/StrokeIcons";
import { StatusChip } from "@/components/ui/StatusChip";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ButtonLink } from "@/components/ui/Button";
import {
  ABOUT_BLOCK,
  ENGINES,
  FAQ_ITEMS,
  GOOD_FIT,
  HOME_HERO,
  HOW_IT_WORKS,
  NOT_FIT,
  SAMPLE_ENGINE_ROWS,
  SAMPLE_TEASER_SCORES,
  TESTIMONIALS,
  TIERS,
  WHATS_INCLUDED,
  WHY_IT_MATTERS,
} from "@/lib/content/landing";
import { GEO_DEFINITION, GEO_EXAMPLE, SEO_VS_GEO } from "@/lib/content/geo-explain";
import { scoreBarClass } from "@/lib/ui/score-status";
import { cn } from "@/lib/utils";

function HeroUrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = url.trim();
    if (!value) return;
    router.push(`/audit?url=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div className="flex-1">
        <label htmlFor="hero-website" className="sr-only">
          Your website address
        </label>
        <input
          id="hero-website"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourbusiness.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field h-[52px]"
        />
      </div>
      <button type="submit" className="btn-primary whitespace-nowrap">
        {HOME_HERO.primaryCta}
      </button>
    </form>
  );
}

function ExampleOutputCard() {
  return (
    <div className="card-surface p-6 shadow-card-md md:p-7">
      <p className="eyebrow mb-2">{HOME_HERO.exampleLabel}</p>
      <p className="mb-4 font-mono text-xs text-muted">{HOME_HERO.sampleDomain}</p>
      <div className="mb-5 flex justify-center">
        <ScoreRing score={HOME_HERO.sampleScore} label="AI Visibility Score" size={128} />
      </div>
      <p className="mb-5 text-sm leading-relaxed text-body">{HOME_HERO.sampleSummary}</p>
      <ul className="mb-5 space-y-2.5">
        {SAMPLE_ENGINE_ROWS.map((row) => (
          <li
            key={row.engine}
            className="flex items-center justify-between gap-3 border-t border-border pt-2.5 text-sm"
          >
            <span className="font-medium text-ink">{row.engine}</span>
            <StatusChip tone={row.tone} label={row.status} />
          </li>
        ))}
      </ul>
      <Link
        href="/sample-report"
        className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
      >
        Explore the full sample report →
      </Link>
    </div>
  );
}

function ProofSection() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="section-pad bg-surface">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="card-surface p-7">
              <blockquote className="body-lg text-ink">&ldquo;{item.quote}&rdquo;</blockquote>
              <p className="mt-4 text-sm font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-muted">{item.role}</p>
              <div className="mt-6 border-t border-border pt-5">
                <p className="font-heading text-lg font-semibold text-ink">{item.resultTitle}</p>
                <p className="mt-2 text-sm text-body">{item.resultBody}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <section className="section-pad bg-surface-alt">
        <div className="container-site">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="eyebrow mb-5">{HOME_HERO.eyebrow}</p>
              <h1 className="heading-1 mb-5">{HOME_HERO.headline}</h1>
              <p className="body-lg mb-8 max-w-xl">{HOME_HERO.subheadline}</p>
              <HeroUrlForm />
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {HOME_HERO.checkRow.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <IconCheck className="text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <ExampleOutputCard />
          </div>
        </div>
      </section>

      {/* 2. Engines strip */}
      <section className="border-y border-border bg-surface py-6">
        <div className="container-site flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
          <p className="text-sm font-medium text-muted">Platforms monitored</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {ENGINES.map((engine) => (
              <span key={engine} className="font-mono text-sm font-semibold text-ink">
                {engine}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What is GEO */}
      <section className="section-pad bg-surface" aria-labelledby="what-is-geo">
        <div className="container-site">
          <p className="eyebrow mb-4">Plain English</p>
          <h2 id="what-is-geo" className="heading-2 mb-5 max-w-3xl">
            What is <GeoAbbr />?
          </h2>
          <p className="body-lg mb-10 max-w-3xl">{GEO_DEFINITION}</p>
          <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {SEO_VS_GEO.map((col) => (
              <div key={col.label} className="rounded-card border border-border bg-surface-alt p-6">
                <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-accent">
                  {col.label}
                </p>
                <h3 className="heading-3 mb-2 text-lg">{col.title}</h3>
                <p className="text-sm leading-relaxed text-body">{col.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-card border border-accent/20 bg-accent-tint p-6 md:p-7">
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-accent">
              Example
            </p>
            <p className="text-base leading-relaxed text-ink md:text-lg">{GEO_EXAMPLE}</p>
          </div>
        </div>
      </section>

      {/* 4. Why it matters */}
      <section className="section-pad bg-surface-alt">
        <div className="container-site">
          <p className="eyebrow mb-4">{WHY_IT_MATTERS.eyebrow}</p>
          <h2 className="heading-2 mb-12 max-w-3xl">{WHY_IT_MATTERS.title}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {WHY_IT_MATTERS.items.map((item) => (
              <div key={item.num} className="border-t-2 border-ink pt-6">
                <p className="mb-3 font-mono text-sm font-semibold text-muted">{item.num}</p>
                <h3 className="heading-3 mb-3">{item.title}</h3>
                <p className="body-md">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section id="how" className="section-pad bg-ink text-white">
        <div className="container-site">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow-on-dark mb-4">{HOW_IT_WORKS.eyebrow}</p>
              <h2 className="heading-2 text-white">{HOW_IT_WORKS.title}</h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-on-dark lg:text-right">
              {HOW_IT_WORKS.side}
            </p>
          </div>
          <div className="grid grid-cols-1 overflow-hidden rounded-card border border-dark-raised-border md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.steps.map((step, i) => (
              <div
                key={step.title}
                className={cn(
                  "bg-dark-raised p-6",
                  i > 0 && "border-t border-dark-raised-border md:border-t-0 md:border-l",
                  i === 2 && "md:border-t lg:border-t-0",
                )}
              >
                <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-accent-on-dark">
                  {step.label}
                </p>
                <h3 className="mb-2 font-heading text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-on-dark">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-control border border-dark-raised-border px-5 py-4 text-sm text-on-dark">
            <span className="font-semibold text-white">Every month you get: </span>
            {HOW_IT_WORKS.monthlyBar.join(" · ")}
          </div>
        </div>
      </section>

      {/* 6. What's included */}
      <section id="included" className="section-pad bg-surface">
        <div className="container-site">
          <h2 className="heading-2 mb-12 max-w-3xl">
            What we look at, and work on, every month
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHATS_INCLUDED.map((item) => (
              <div key={item.title} className="card-surface p-6">
                <div className="mb-4 text-accent">
                  <IncludedIcon name={item.icon} />
                </div>
                <h3 className="heading-3 mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Sample report teaser */}
      <section className="section-pad bg-surface-alt">
        <div className="container-site">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="heading-2 mb-6">
                See exactly what you&apos;ll get before you share a thing.
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/sample-report" variant="ink">
                  Open sample report
                </ButtonLink>
                <ButtonLink href="/audit" variant="secondaryLight">
                  Get mine free
                </ButtonLink>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SAMPLE_TEASER_SCORES.map((item) => (
                <div key={item.name} className="card-surface p-4">
                  <p className="mb-2 text-xs font-medium text-muted">{item.name}</p>
                  <p className="mb-2 font-mono text-xl font-semibold text-ink">{item.score}</p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border">
                    <div
                      className={cn("h-full rounded-full", scoreBarClass(item.score))}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Fit */}
      <section className="section-pad bg-surface">
        <div className="container-site">
          <h2 className="heading-2 mb-10">Honest about who this is for</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-card border border-accent/20 bg-accent-tint p-7 md:p-8">
              <h3 className="mb-5 font-heading text-lg font-semibold text-ink">
                A good fit if you&apos;re…
              </h3>
              <ul className="space-y-3.5">
                {GOOD_FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-body">
                    <IconCheck className="mt-0.5 flex-shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-border bg-surface-alt p-7 md:p-8">
              <h3 className="mb-5 font-heading text-lg font-semibold text-ink">
                Probably not a fit if you…
              </h3>
              <ul className="space-y-3.5">
                {NOT_FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-body">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing */}
      <section id="pricing" className="section-pad bg-surface-alt">
        <div className="container-site">
          <div className="mb-12 max-w-2xl">
            <h2 className="heading-2 mb-4">Monthly plans. No long contracts.</h2>
            <p className="body-lg">
              Every plan starts with the free assessment. Month-to-month, cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.tier}
                className={cn(
                  "relative flex flex-col rounded-card border p-7",
                  tier.primary
                    ? "order-first border-dark-raised-border bg-ink text-white shadow-card-md md:order-none md:scale-[1.02]"
                    : "border-border bg-surface",
                )}
              >
                {tier.primary && (
                  <span className="absolute -top-3 left-6 rounded-md bg-highlight px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-ink">
                    Recommended
                  </span>
                )}
                <h3
                  className={cn(
                    "mb-2 font-heading text-xl font-semibold",
                    tier.primary ? "text-white" : "text-ink",
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    "mb-6 font-heading text-2xl font-semibold",
                    tier.primary ? "text-white" : "text-ink",
                  )}
                >
                  {tier.price}
                </p>
                <ul className="mb-8 flex-1 space-y-2.5">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "flex gap-2 text-sm leading-relaxed",
                        tier.primary ? "text-on-dark" : "text-body",
                      )}
                    >
                      <IconCheck
                        className={cn(
                          "mt-0.5 flex-shrink-0",
                          tier.primary ? "text-accent-on-dark" : "text-accent",
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/audit?tier=${tier.tier}`}
                  variant={tier.primary ? "primary" : "secondaryLight"}
                  size="md"
                  className="mt-auto w-full"
                >
                  {tier.cta}
                </ButtonLink>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-card border border-dashed border-border bg-surface px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-sm text-body">
              Multiple locations or a bigger footprint? We&apos;ll scope a custom engagement.
            </p>
            <Link
              href="/audit?tier=custom"
              className="whitespace-nowrap text-sm font-semibold text-accent hover:text-accent-hover"
            >
              Request a custom plan →
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Proof (placeholder — empty by default) */}
      <ProofSection />

      {/* 11. Who's behind this */}
      <section className="section-pad bg-surface" aria-labelledby="about-heading">
        <div className="container-site max-w-3xl">
          <p className="eyebrow mb-4">Who&apos;s behind this</p>
          <h2 id="about-heading" className="heading-2 mb-6">
            Local help for Grand Strand service businesses
          </h2>
          <div className="card-surface flex flex-col gap-5 p-6 sm:flex-row sm:items-start md:p-8">
            <div
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-card bg-surface-alt font-heading text-2xl font-semibold text-accent"
              aria-hidden={!ABOUT_BLOCK.photoSrc}
            >
              {ABOUT_BLOCK.photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ABOUT_BLOCK.photoSrc}
                  alt=""
                  className="h-full w-full rounded-card object-cover"
                />
              ) : (
                ABOUT_BLOCK.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
              )}
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-ink">{ABOUT_BLOCK.name}</p>
              <p className="text-sm text-muted">
                {ABOUT_BLOCK.role} · {ABOUT_BLOCK.since}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-body md:text-base">{ABOUT_BLOCK.body}</p>
              {ABOUT_BLOCK.linkedinUrl ? (
                <a
                  href={ABOUT_BLOCK.linkedinUrl}
                  className="mt-4 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LinkedIn →
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section id="faq" className="section-pad bg-surface-alt">
        <div className="container-site max-w-3xl">
          <h2 className="heading-2 mb-10">Questions, answered</h2>
          <div className="card-surface px-6 md:px-8">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* 13. Final CTA */}
      <section className="section-pad bg-accent text-white">
        <div className="container-site max-w-3xl text-center">
          <h2 className="heading-2 mb-4 text-white">
            Find out how AI sees your business, free.
          </h2>
          <p className="mb-8 text-base leading-relaxed text-white/90 md:text-lg">
            Takes about two minutes to request. Results usually arrive within minutes.
          </p>
          <ButtonLink href="/audit" variant="white">
            Start my free assessment
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
