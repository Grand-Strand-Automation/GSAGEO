import { Link } from "wouter";
import {
  CheckCircle2,
  ArrowRight,
  MapPin,
  DollarSign,
  ShieldCheck,
  Search,
  BarChart2,
  Layers,
  ClipboardList,
  Minus,
} from "lucide-react";
import { content } from "@/lib/content";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";

const clarityIcons = [BarChart2, Layers, ClipboardList];

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section className="bg-[#0E2F54] text-white pt-32 pb-0 md:pt-40 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center pb-16 md:pb-24">

          {/* Brand lockup */}
          <div className="flex flex-col items-center mb-9">
            <img
              src="/brand/logo-icon.png"
              alt="Grand Strand Ally"
              width={56}
              height={56}
              className="object-contain mb-3.5"
            />
            <p className="font-heading font-extrabold text-[17px] tracking-[0.08em] uppercase text-white mb-1.5 leading-none">
              Grand Strand Ally
            </p>
            <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-white/40 leading-none">
              Cost Clarity · Practical Support · Compliance-Minded Systems
            </p>
          </div>

          {/* Location badge */}
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 mb-8 bg-white/5">
            <MapPin size={11} className="text-[#60B8F0]" />
            Myrtle Beach, SC · Grand Strand
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold max-w-4xl leading-[1.08] mb-5 tracking-tight">
            {content.hero.headline}
          </h1>
          <p className="text-lg text-white/65 max-w-xl mb-9 leading-relaxed">
            {content.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <Button
              asChild
              className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg border-0"
              data-testid="hero-primary-cta"
            >
              <Link href="/contact">Schedule a Free Cost Analysis →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/25 text-white hover:bg-white/8 hover:text-white h-12 px-7 text-[15px] bg-transparent rounded-lg"
              data-testid="hero-secondary-cta"
            >
              <Link href="/services">See Services</Link>
            </Button>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative z-10 border-t border-white/10 bg-[#0A2440]/70">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {[
                { icon: MapPin, label: "Local to the Grand Strand" },
                { icon: DollarSign, label: "Clear monthly pricing" },
                { icon: ShieldCheck, label: "Compliance-minded support" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center justify-center gap-3 py-5 sm:px-10 text-sm text-white/70 font-medium">
                  <Icon size={15} className="text-[#60B8F0] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Where we help ────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Where we help
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] max-w-2xl mx-auto leading-tight">
              {content.problems.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {content.problems.cards.map((card, i) => {
              const Icon = clarityIcons[i];
              return (
                <div
                  key={i}
                  className="bg-white border border-[#D7E1EA] rounded-xl p-6 shadow-sm"
                  data-testid={`problem-card-${i}`}
                >
                  <div className="w-9 h-9 bg-[#DCEAF7] rounded-lg flex items-center justify-center mb-4">
                    <Icon size={16} className="text-[#1F5E95]" />
                  </div>
                  <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-2">{card.title}</h3>
                  <p className="text-sm text-[#4B5B6B] leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Three core service areas ─────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              How we help
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] leading-tight">
              Three core service areas.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {content.coreSystems.map((sys, i) => (
              <div
                key={sys.id}
                className="border border-[#D7E1EA] rounded-xl p-6 bg-[#F7F5F1] hover:shadow-sm transition-shadow"
                data-testid={`core-system-${sys.id}`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#DCEAF7] flex items-center justify-center mb-5 text-[13px] font-bold text-[#1F5E95]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-4 leading-snug">{sys.name}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5B6B] mb-1">Context</p>
                    <p className="text-[#4B5B6B] leading-snug">{sys.problem}</p>
                  </div>
                  <div className="border-t border-[#D7E1EA] pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F5E95] mb-1">Our approach</p>
                    <p className="text-[#0E2F54] leading-snug font-medium">{sys.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors"
            >
              See all services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Who we help ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Who we help
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] leading-tight">
              {content.whoWeHelp.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-[#D7E1EA] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#DCEAF7] flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-[#1F5E95]" />
                </div>
                <span className="text-sm font-bold text-[#0E2F54]">Likely a good fit</span>
              </div>
              <ul className="space-y-3">
                {content.whoWeHelp.goodFit.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-[#D7E1EA] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#F7F5F1] border border-[#D7E1EA] flex items-center justify-center">
                  <Minus size={14} className="text-[#4B5B6B]" />
                </div>
                <span className="text-sm font-bold text-[#0E2F54]">May not be the right fit</span>
              </div>
              <ul className="space-y-3">
                {content.whoWeHelp.probablyNot.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5B6B]">
                    <Minus size={13} className="text-[#4B5B6B] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. How we work ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Our process
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] leading-tight">
              {content.howWeWork.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-7 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-[#D7E1EA]" />
            {content.howWeWork.steps.map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-14 h-14 bg-white border-2 border-[#D7E1EA] text-[#1F5E95] font-heading font-bold text-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm relative z-10">
                  {item.step}
                </div>
                <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{item.title}</h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-xs text-[#4B5B6B] inline-block border border-[#D7E1EA] rounded-xl py-3 px-6 bg-[#F7F5F1] tracking-wide">
              No forced replacements &nbsp;·&nbsp; No unnecessary complexity &nbsp;·&nbsp; No long-term lock-in
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Why Grand Strand Ally ────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/25 inline-block" />
              Why Grand Strand Ally
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
              {content.whyUs.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {content.whyUs.cards.map((card, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] transition-colors"
                data-testid={`why-card-${i}`}
              >
                <h3 className="text-[15px] font-heading font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. What a cost analysis covers ──────────────────────── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Free cost analysis
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] leading-tight">
              What a cost analysis covers.
            </h2>
            <p className="text-[#4B5B6B] text-[15px] mt-3 max-w-lg mx-auto">
              A structured look at your current environment — not a sales pitch, not a commitment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {content.costAnalysisItems.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#D7E1EA] rounded-xl px-4 py-4 flex items-center gap-3 shadow-sm"
              >
                <Search size={14} className="text-[#1F5E95] flex-shrink-0" />
                <span className="text-sm text-[#0E2F54] font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild className="bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-12 px-7 text-[15px] rounded-lg">
              <Link href="/contact">Schedule a Free Cost Analysis →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 8. Free tool teaser ─────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-[#0E2F54] rounded-2xl px-8 py-10 md:px-12 md:py-12">
            <div className="flex flex-col md:flex-row md:items-start gap-10">
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
                  Free Tool
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3 leading-tight">
                  Get a clearer picture of your current information technology spend.
                </h2>
                <p className="text-white/55 text-sm leading-relaxed mb-6">
                  Estimate your costs, spot potential tool overlap, and identify where simplification may help — in about 5 minutes.
                </p>
                <ul className="space-y-2 mb-7">
                  {[
                    "Estimate monthly information technology costs",
                    "Identify potential tool overlap and vendor consolidation opportunities",
                    "Review compliance and control considerations",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-[#1F5E95] flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="text-sm text-white/70">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/cost-analysis#calculator"
                    className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-11 px-6 text-sm rounded-lg transition-colors whitespace-nowrap"
                  >
                    Start Free Cost Analysis →
                  </Link>
                  <Link
                    href="/cost-analysis#how-it-works"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium h-11 px-2 transition-colors"
                  >
                    Learn How It Works
                  </Link>
                </div>
              </div>

              <div className="md:w-48 shrink-0 flex flex-row md:flex-col gap-4 md:gap-5">
                {[
                  { value: "~5 min", label: "Takes about 5 minutes" },
                  { value: "Free", label: "No login required" },
                  { value: "0", label: "Obligation or commitment" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex-1 md:flex-none bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-white mb-0.5">{value}</p>
                    <p className="text-xs text-white/45 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Common questions
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] leading-tight">
              Frequently asked questions.
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ── 10. Final CTA ───────────────────────────────────────── */}
      <CTABand
        title={content.finalCta.headline}
        subtitle={content.finalCta.copy}
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "View Pricing", href: "/pricing", primary: false },
        ]}
      />

    </div>
  );
}
