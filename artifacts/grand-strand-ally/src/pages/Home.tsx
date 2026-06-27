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
  Globe,
  FileSearch,
  Target,
} from "lucide-react";

import { content } from "@/lib/content";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const GEO_URL = "https://gsageo.vercel.app/";

const clarityIcons = [BarChart2, Layers, ClipboardList];

const CORE_SYSTEM_LINKS: Record<string, string> = {
  cost: "/it-cost-analysis",
  support: "/managed-it-support-myrtle-beach",
  compliance: "/cybersecurity-compliance-support",
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Grand Strand Ally | Information Technology Support &amp; Cost Analysis — Myrtle Beach, SC</title>
        <meta name="description" content="Grand Strand Ally helps small and medium businesses in the Myrtle Beach and Grand Strand area gain visibility into information technology costs, simplify vendor structure, and strengthen compliance-minded support. Month-to-month. No long-term contracts." />
        <link rel="canonical" href="https://gsally.com" />
        <meta property="og:title" content="Grand Strand Ally | Information Technology Support — Myrtle Beach, SC" />
        <meta property="og:description" content="Practical information technology support, cost analysis, and compliance-minded systems for small and medium businesses in the Myrtle Beach and Grand Strand area." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gsally.com" />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Grand Strand Ally | Information Technology Support — Myrtle Beach, SC" />
        <meta name="twitter:description" content="Gain clearer visibility into your information technology costs and support structure. Serving small and medium businesses across the Grand Strand." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://gsally.com/#webpage",
          "url": "https://gsally.com",
          "name": "Grand Strand Ally — Information Technology Support for the Grand Strand",
          "isPartOf": { "@id": "https://gsally.com/#website" },
          "about": { "@id": "https://gsally.com/#organization" },
          "description": "Managed information technology support, cost analysis, Microsoft 365 administration, and compliance-minded systems for small and medium businesses in the Myrtle Beach and Grand Strand area of South Carolina.",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" }]
          }
        })}</script>
      </Helmet>

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
            <a
              href={GEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-geo-cta="hero-primary-cta"
              className="inline-flex items-center justify-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg transition-colors"
            >
              Start Your GEO Assessment <ArrowRight size={15} aria-hidden="true" />
            </a>
            <Button
              asChild
              variant="outline"
              className="border-white/25 text-white hover:bg-white/8 hover:text-white h-12 px-7 text-[15px] bg-transparent rounded-lg"
              data-testid="hero-secondary-cta"
            >
              <Link href="/services">Explore IT &amp; Advisory Services</Link>
            </Button>
          </div>

          {/* GEO highlight card */}
          <a
            href={GEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-geo-cta="hero-card"
            className="mt-7 w-full max-w-xl group block bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.10] hover:border-white/[0.22] rounded-xl p-5 text-left transition-colors"
            aria-label="AI Visibility / GEO Assessment — opens in new tab"
          >
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-[#1F5E95]/50 border border-white/10 rounded-lg flex items-center justify-center shrink-0">
                <Globe size={16} className="text-[#60B8F0]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#60B8F0]">New</span>
                  <span className="text-white/25 text-xs" aria-hidden="true">·</span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.10em] text-white/40">GEO / AI Visibility</span>
                </div>
                <p className="text-[15px] font-heading font-bold text-white leading-snug mb-1 group-hover:text-[#60B8F0] transition-colors">
                  AI Visibility for local service businesses
                </p>
                <p className="text-sm text-white/50 leading-relaxed">
                  See how clearly your business is positioned for ChatGPT, Google AI Overviews, and answer-driven search.
                </p>
              </div>
              <ArrowRight size={15} className="text-white/25 group-hover:text-[#60B8F0] transition-colors shrink-0 mt-1" aria-hidden="true" />
            </div>
          </a>
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
                  {CORE_SYSTEM_LINKS[sys.id] && (
                    <div className="pt-1">
                      <Link href={CORE_SYSTEM_LINKS[sys.id]} aria-label={`Learn more about ${sys.name}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors">
                        Learn more <ArrowRight size={11} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
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
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                { label: "Managed IT Support", href: "/managed-it-support-myrtle-beach" },
                { label: "Microsoft 365 Support", href: "/microsoft-365-support" },
                { label: "IT Cost Analysis", href: "/it-cost-analysis" },
                { label: "Cybersecurity and Compliance", href: "/cybersecurity-compliance-support" },
                { label: "Backup and Recovery", href: "/backup-recovery-support" },
                { label: "Onboarding and Offboarding", href: "/onboarding-offboarding-automation" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium text-[#1F5E95] hover:text-[#0E2F54] border border-[#D7E1EA] hover:border-[#1F5E95] rounded-full px-4 py-1.5 bg-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GEO Feature Section ─────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#0E2F54] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center justify-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
              New offering
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight mb-4">
              Now Offering GEO / AI Visibility Assessments
            </h2>
            <p className="text-white/65 text-[15px] max-w-2xl mx-auto leading-relaxed">
              Traditional websites can still underperform in AI-driven search if their content is unclear, thin, weakly structured, or missing the page types answer engines rely on. Our GEO assessment helps service businesses understand how visible and understandable their site is for AI-powered discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
            {[
              {
                Icon: Globe,
                title: "AI Visibility Review",
                body: "See how clearly your business is positioned for AI-generated search and recommendation engines — ChatGPT, Google AI Overviews, and more.",
              },
              {
                Icon: FileSearch,
                title: "Content & Structure Gaps",
                body: "Identify weak service pages, missing FAQs, unclear positioning, and internal linking gaps that hurt how AI systems interpret your site.",
              },
              {
                Icon: Target,
                title: "Practical Next Steps",
                body: "Get a clearer picture of what to improve first — structured priorities rather than vague marketing advice.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-white/[0.05] border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] transition-colors"
              >
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center mb-5">
                  <Icon size={17} className="text-[#60B8F0]" aria-hidden="true" />
                </div>
                <h3 className="text-[15px] font-heading font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={GEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-geo-cta="homepage-geo-section"
              className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-8 rounded-lg text-[15px] transition-colors"
            >
              Request Your GEO Assessment <ArrowRight size={15} aria-hidden="true" />
            </a>
            <p className="text-sm text-white/30 mt-3">No hype. Clear next steps. Built for Myrtle Beach and Grand Strand service businesses.</p>
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
          <div className="text-center mt-10 space-y-4">
            <p className="text-xs text-[#4B5B6B] inline-block border border-[#D7E1EA] rounded-xl py-3 px-6 bg-[#F7F5F1] tracking-wide">
              No forced replacements &nbsp;·&nbsp; No unnecessary complexity &nbsp;·&nbsp; No long-term lock-in
            </p>
            <div>
              <Link href="/process" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors">
                Read more about how we work <ArrowRight size={13} />
              </Link>
            </div>
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
          <div className="text-center mt-8">
            <Link href="/about" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white transition-colors">
              Learn more about Grand Strand Ally <ArrowRight size={13} />
            </Link>
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
          <div className="text-center mt-8 space-y-3">
            <Button asChild className="bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-12 px-7 text-[15px] rounded-lg">
              <Link href="/contact#contact-form">Schedule a Free Cost Analysis →</Link>
            </Button>
            <div>
              <Link href="/free-it-cost-analysis" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1F5E95] hover:text-[#0E2F54] transition-colors">
                What does the free cost analysis include? <ArrowRight size={13} />
              </Link>
            </div>
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

      {/* ── 9. Guides & resources ───────────────────────────────── */}
      <section className="py-14 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Guides &amp; resources
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] leading-tight">
                Learn before you decide.
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/case-studies" className="text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors flex items-center gap-1">
                Case studies <ArrowRight size={13} />
              </Link>
              <Link href="/pricing" className="text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors flex items-center gap-1">
                Pricing <ArrowRight size={13} />
              </Link>
              <Link href="/free-it-cost-analysis" className="text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors flex items-center gap-1">
                Free analysis overview <ArrowRight size={13} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "How much should a small business spend on IT support?",
                href: "/how-much-should-a-small-business-spend-on-it-support",
                desc: "Benchmarks by company size and risk profile, with signals for both over- and underspending.",
              },
              {
                title: "How to find overlapping IT tools and vendors",
                href: "/how-to-find-overlapping-it-tools-and-vendors",
                desc: "A four-step process for mapping your vendor stack and finding where you are paying twice for the same capability.",
              },
              {
                title: "Small business employee offboarding checklist",
                href: "/small-business-offboarding-checklist",
                desc: "Organized by timing — covering account disabling, license reclamation, file transfer, and access audits.",
              },
              {
                title: "What an IT cost analysis should include",
                href: "/what-an-it-cost-analysis-should-include",
                desc: "The five areas a useful analysis covers, and five red flags that signal a sales pitch instead.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white border border-[#D7E1EA] hover:border-[#1F5E95] rounded-xl p-5 transition-colors"
              >
                <p className="text-[15px] font-heading font-bold text-[#0E2F54] group-hover:text-[#1F5E95] mb-2 leading-snug transition-colors">
                  {item.title}
                </p>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ──────────────────────────────────────────────── */}
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
          <div className="text-center mt-8">
            <Link href="/faq" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors">
              See all frequently asked questions <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. Final CTA ───────────────────────────────────────── */}
      <CTABand
        title={content.finalCta.headline}
        subtitle={content.finalCta.copy}
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact#contact-form", primary: true },
          { label: "View Pricing", href: "/pricing", primary: false },
        ]}
      />

    </div>
  );
}
