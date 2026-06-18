import Link from "next/link";
import { CheckCircle2, Minus } from "lucide-react";
import { CTABand } from "@/components/CTABand";
import { FaqItem } from "@/components/FaqItem";
import {
  DELIVERABLES,
  FAQ_ITEMS,
  GOOD_FIT,
  NOT_FIT,
  TIERS,
  WHATS_INCLUDED,
} from "@/lib/content/landing";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-[#0E2F54] text-white pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container px-4 md:px-6 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            GEO / AI Visibility
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-6 leading-[1.05] max-w-3xl">
            Show up in AI-generated answers, not just search results.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mb-8">
            Customers are increasingly finding service providers through AI-powered answer engines. Generative Engine Optimization helps your business become the kind of source those engines reference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="/audit"
              className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-sm rounded-lg inline-flex items-center justify-center"
            >
              Request a GEO Audit →
            </Link>
            <a
              href="#whats-included"
              className="border border-white/25 text-white hover:bg-white/8 font-semibold h-12 px-7 text-sm rounded-lg inline-flex items-center justify-center"
            >
              See What&apos;s Included
            </a>
          </div>
          <p className="text-xs text-white/35 font-medium">
            Practical review · No-pressure approach · Grand Strand–based
          </p>
        </div>
      </section>

      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#D7E1EA]">
            {["No hype, no jargon", "Clear deliverables at every tier", "Based in the Grand Strand since 2015"].map(
              (label) => (
                <div key={label} className="flex items-center justify-center gap-2.5 py-4 sm:px-8 text-sm text-[#4B5B6B] font-medium">
                  <CheckCircle2 size={14} className="text-[#1F5E95] flex-shrink-0" />
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <section className="py-20 md:py-28 bg-white">
        <div className="container px-4 md:px-6 max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] mb-4 block">
            Understanding GEO
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-6">
            What is Generative Engine Optimization?
          </h2>
          <div className="space-y-5 text-[#4B5B6B] text-base md:text-lg leading-relaxed">
            <p>
              When someone asks ChatGPT, Perplexity, or Google&apos;s AI Overview to recommend a service provider, the answer is generated from content those systems have indexed. Businesses that appear tend to have sites that are clearly structured, well-documented, and content-rich.
            </p>
            <p>
              GEO is the practice of improving how your business is understood, cited, and surfaced by AI search systems. Unlike traditional SEO, GEO focuses on content clarity, entity recognition, structured data, and the page types that help AI systems represent your business accurately.
            </p>
            <p>
              This is methodical work: auditing your site, identifying gaps, and building the content and structure that makes your business easier to understand — for both AI systems and the people asking them questions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-10">
            A good fit — and not a good fit.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-[#D7E1EA] p-7">
              <h3 className="text-sm font-bold text-[#0E2F54] uppercase tracking-[0.12em] mb-5">Good fit</h3>
              <ul className="space-y-3.5">
                {GOOD_FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={16} className="text-[#1F5E95] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-[#D7E1EA] p-7">
              <h3 className="text-sm font-bold text-[#4B5B6B] uppercase tracking-[0.12em] mb-5">Not a fit</h3>
              <ul className="space-y-3.5">
                {NOT_FIT.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-[#4B5B6B]">
                    <Minus size={16} className="text-[#9AAEBB] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="whats-included" className="py-20 md:py-28 bg-white scroll-mt-20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-12">
            Everything covered in a GEO engagement.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHATS_INCLUDED.map(({ title, desc }) => (
              <div key={title} className="bg-[#F7F5F1] rounded-xl border border-[#D7E1EA] p-6">
                <h3 className="font-heading font-bold text-[15px] text-[#0E2F54] mb-2">{title}</h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-8">What you receive.</h2>
          <ul className="space-y-4">
            {DELIVERABLES.map((item) => (
              <li key={item} className="flex gap-3 text-[#4B5B6B]">
                <CheckCircle2 size={18} className="text-[#1F5E95] flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-28 bg-[#F7F5F1] scroll-mt-20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-12">
            Choose your level of support.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-7 flex flex-col ${
                  tier.primary ? "bg-[#0E2F54] border-transparent text-white" : "bg-white border-[#D7E1EA]"
                }`}
              >
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3 w-fit ${
                    tier.primary ? "bg-white/10 text-white/80" : "bg-[#E8EFF6] text-[#1F5E95]"
                  }`}
                >
                  {tier.badge}
                </span>
                <h3 className={`font-heading font-bold text-lg mb-1 ${tier.primary ? "text-white" : "text-[#0E2F54]"}`}>
                  {tier.name}
                </h3>
                <div className={`text-2xl font-heading font-extrabold mb-4 ${tier.primary ? "text-white" : "text-[#0E2F54]"}`}>
                  {tier.price}
                </div>
                <p className={`text-sm leading-relaxed mb-6 flex-grow ${tier.primary ? "text-white/65" : "text-[#4B5B6B]"}`}>
                  {tier.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {tier.includes.slice(0, 6).map((item) => (
                    <li key={item} className={`text-sm ${tier.primary ? "text-white/80" : "text-[#4B5B6B]"}`}>
                      · {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/audit?tier=${tier.tier}`}
                  className={
                    tier.primary
                      ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-11 text-sm rounded-lg text-center leading-[2.75rem]"
                      : "bg-[#F7F5F1] hover:bg-[#EAE8E4] text-[#0E2F54] border border-[#D7E1EA] font-semibold h-11 text-sm rounded-lg text-center leading-[2.75rem]"
                  }
                >
                  {tier.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-10">
            Common questions about GEO.
          </h2>
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
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
