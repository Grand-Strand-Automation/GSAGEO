"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CurrentVsConcept } from "@/components/mockup/CurrentVsConcept";
import { HeroOverlay } from "@/components/HeroOverlay";
import { ButtonLink } from "@/components/ui/Button";
import type { MockupConcept } from "@/lib/mockup/generator";
import { MOCKUP_EXPECTATION } from "@/lib/content/landing";

type MockupPayload = {
  concept: MockupConcept;
  website_url?: string;
  business_name?: string;
  screenshot_url?: string | null;
};

export function MockupResultView({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<MockupPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = sessionStorage.getItem(`mockup:${token}`);
        if (cached) {
          const parsed = JSON.parse(cached) as MockupPayload;
          if (!cancelled && parsed?.concept) {
            setPayload(parsed);
            setLoading(false);
          }
        }

        const res = await fetch(`/api/mockups/${token}`);
        const json = await res.json();
        if (cancelled) return;

        if (res.ok && json.ok && json.mockup?.concept) {
          setPayload({
            concept: json.mockup.concept,
            website_url: json.mockup.website_url,
            business_name: json.mockup.business_name,
            screenshot_url: json.mockup.screenshot_url ?? null,
          });
          setError("");
        } else if (!cached) {
          setError("This preview could not be found or has expired.");
        }
      } catch {
        if (!cancelled) {
          const cached = sessionStorage.getItem(`mockup:${token}`);
          if (!cached) setError("Unable to load your preview right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const trackCta = async (plan: string) => {
    try {
      await fetch(`/api/mockups/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "subscription_cta", selected_plan: plan }),
      });
    } catch {
      /* non-blocking */
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-brand-muted">
          <Loader2 className="animate-spin" size={20} />
          Loading your homepage concept…
        </div>
      </div>
    );
  }

  if (error || !payload?.concept) {
    return (
      <div className="section-pad">
        <div className="container px-4 md:px-6 max-w-xl text-center">
          <h1 className="font-heading font-bold text-2xl text-brand-navy mb-3">
            Preview unavailable
          </h1>
          <p className="text-brand-muted mb-6">{error || "We could not load this mockup."}</p>
          <ButtonLink href="/#mockup">Create a new homepage mockup</ButtonLink>
        </div>
      </div>
    );
  }

  const { concept } = payload;
  const usedLive = concept.sourceSignals?.usedLiveSite;

  return (
    <div className="flex flex-col">
      <section className="bg-brand-hero text-white pt-28 pb-12 md:pt-32 md:pb-14 relative overflow-hidden">
        <HeroOverlay />
        <div className="container px-4 md:px-6 relative z-10 max-w-4xl">
          <div className="eyebrow-pill mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sky inline-block" />
            Sample homepage concept
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-heading font-extrabold mb-4 leading-[1.1]">
            Here&apos;s a sample homepage direction for {concept.businessName}
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mb-4">
            {concept.sourceSignals?.siteBlocked
              ? "We couldn&apos;t load the live site (security protection), so this concept was written from your business details — still a sample preview, not a finished website."
              : usedLive
                ? "Built from your current site content and preferences — a clearer, more modern homepage concept you can compare side by side."
                : "Based on your preferences, here is a concept for a clearer, more modern homepage. This is a preview mockup — not a finished website."}
          </p>
          <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{MOCKUP_EXPECTATION}</p>
        </div>
      </section>

      <section className="section-pad bg-brand-cream">
        <div className="container px-4 md:px-6 max-w-6xl">
          <CurrentVsConcept concept={concept} websiteUrl={payload.website_url} />

          <div className="mt-10 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div className="card-brand p-6 md:p-7 shadow-card">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-3">
                What improved in this concept
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {concept.improvementNotes.map((note) => (
                  <li key={note} className="flex gap-2.5 text-sm text-brand-muted leading-relaxed">
                    <CheckCircle2 size={15} className="text-brand-blue shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
              {(concept.sourceSignals?.usedRealServices ||
                concept.sourceSignals?.usedRealCta) && (
                <p className="mt-4 text-xs text-brand-muted leading-relaxed border-t border-brand-border pt-4">
                  This sample reuses language and services detected on your current site where
                  possible — so it feels like your business, not a generic template.
                </p>
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="card-brand p-6 shadow-card">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-2">
                  Your preferences
                </p>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-muted">Style</dt>
                    <dd className="font-medium text-brand-navy text-right">{concept.styleLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-muted">Goal</dt>
                    <dd className="font-medium text-brand-navy text-right">{concept.goalLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-muted">Category</dt>
                    <dd className="font-medium text-brand-navy text-right">
                      {concept.categoryLabel}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-brand-muted">Site signals</dt>
                    <dd className="font-medium text-brand-navy text-right capitalize">
                      {concept.sourceSignals?.fetchQuality ?? "n/a"}
                    </dd>
                  </div>
                </dl>
                {payload.website_url && (
                  <p className="mt-4 text-xs text-brand-muted break-all">
                    Source site: {payload.website_url}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-brand-blue/20 bg-brand-navy text-white p-6 shadow-card-md">
                <h2 className="font-heading font-bold text-lg mb-2">
                  Turn this mockup into your new website
                </h2>
                <p className="text-sm text-white/70 leading-relaxed mb-5">
                  We redesign, launch, host, and continue improving your site on a simple monthly
                  plan — without a big upfront project.
                </p>
                <div className="space-y-2.5">
                  <ButtonLink
                    href={`/start?tier=growth&mockup=${token}`}
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => trackCta("growth")}
                  >
                    Start My Monthly Redesign Plan →
                  </ButtonLink>
                  <ButtonLink
                    href={`/start?tier=growth&mockup=${token}`}
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => trackCta("growth")}
                  >
                    Launch This Direction
                  </ButtonLink>
                  <Link
                    href="/#pricing"
                    className="block text-center text-sm text-white/60 hover:text-white transition-colors pt-1"
                    onClick={() => trackCta("compare")}
                  >
                    Compare plans
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <p className="mt-8 text-center text-xs text-brand-muted max-w-2xl mx-auto leading-relaxed">
            {concept.disclaimer}
          </p>
        </div>
      </section>
    </div>
  );
}
