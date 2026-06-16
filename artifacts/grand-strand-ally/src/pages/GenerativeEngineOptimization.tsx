import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle2,
  Minus,
  Globe,
  Bot,
  FileSearch,
  FileText,
  Building2,
  Code2,
  Link2,
  Lightbulb,
  Map,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CANONICAL = "https://gsally.com/generative-engine-optimization";
const TITLE = "GEO / AI Visibility — Generative Engine Optimization | Grand Strand Ally";
const DESC =
  "Find out how your business appears in AI-generated search and answer engines. Our GEO audit reviews your site's structure, content, and technical readiness — and gives you a clear, prioritized plan for improvement.";

const GOOD_FIT = [
  "Service businesses that rely on inbound trust and referrals",
  "Local B2B companies not appearing in AI-generated search responses",
  "Companies with weak, thin, or disorganized service page content",
  "Teams that have invested in traditional SEO but not content quality or depth",
  "Businesses in compliance-aware or trust-dependent industries",
  "Organizations with no structured FAQ, process, or educational content",
  "Companies that want to understand their AI visibility baseline before investing further",
];

const NOT_FIT = [
  "Businesses looking for guaranteed rankings or quick-turnaround results",
  "Companies still early in defining their product or service offering",
  "Organizations with a recently launched placeholder site and no content to improve",
  "Teams unwilling to add or revise content over time",
];

const WHATS_INCLUDED = [
  {
    icon: BarChart3,
    title: "GEO Audit and Scorecard",
    desc: "A structured review of your site across eight GEO-readiness categories, each scored and graded so you know exactly where you stand.",
  },
  {
    icon: Bot,
    title: "AI Visibility Query Mapping",
    desc: "An analysis of the kinds of queries where your business should appear — and an assessment of whether your current content supports that.",
  },
  {
    icon: Globe,
    title: "Technical Crawlability and Indexing",
    desc: "Checks for sitemap presence, robots.txt configuration, canonical tags, indexability signals, and other technical factors affecting AI access.",
  },
  {
    icon: FileSearch,
    title: "Service Page and Content Gap Analysis",
    desc: "A review of your current service pages against what a well-structured, GEO-ready site should have — with specific recommendations for missing or underdeveloped pages.",
  },
  {
    icon: Building2,
    title: "Entity and Business Profile Consistency",
    desc: "A review of how consistently your business name, location, services, and contact information appear across your site and connected profiles.",
  },
  {
    icon: Code2,
    title: "Structured Data and Schema Review",
    desc: "An assessment of whether your pages use structured data markup and whether it accurately represents your business, services, and content.",
  },
  {
    icon: Link2,
    title: "Internal Linking and Page Architecture",
    desc: "A review of how your pages connect and whether your site structure helps AI systems understand the relationships between your content.",
  },
  {
    icon: Lightbulb,
    title: "Content Recommendations",
    desc: "Specific recommendations for new pages, FAQ content, comparison pages, checklists, case studies, and other content types that improve AI discoverability.",
  },
  {
    icon: Map,
    title: "Reporting and Roadmap",
    desc: "A clear, prioritized action plan with findings, recommendations, and a suggested implementation path — so you know what to work on first.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discover",
    desc: "We start by reviewing your goals, your industry, your primary services, and who you are trying to reach. This context shapes every part of the audit that follows.",
  },
  {
    num: "02",
    title: "Audit",
    desc: "We crawl your site, run technical checks, analyze your content structure, and assess GEO readiness across eight categories. Every finding is documented with specific evidence.",
  },
  {
    num: "03",
    title: "Prioritize",
    desc: "We rank every finding by its likely impact on AI visibility. Not everything matters equally. You receive a clear list of what to address first and why.",
  },
  {
    num: "04",
    title: "Implement",
    desc: "We fix the highest-priority technical issues and build out recommended content — new service pages, FAQ entries, structured data, and supporting pages from the audit.",
  },
  {
    num: "05",
    title: "Improve",
    desc: "For ongoing engagements, we track changes over time, monitor for new AI visibility opportunities, and continue building and refining content each month.",
  },
];

const DELIVERABLES = [
  "GEO scorecard across eight categories with a letter grade for each",
  "Prioritized action plan: top five technical fixes and top five content opportunities",
  "Content map showing recommended pages, topics, and content types",
  "Technical recommendations for site structure, schema markup, and crawlability",
  "Implementation roadmap with suggested tier and sequencing",
  "Optional: monthly GEO optimization for ongoing improvement",
];

const TIERS = [
  {
    name: "GEO Quick Audit",
    price: "Starting at $750",
    period: "One-time review",
    desc: "For businesses that want a clear baseline before committing to broader work.",
    includes: [
      "Full site audit across eight GEO categories",
      "GEO scorecard with letter grades",
      "Findings summary with specific evidence",
      "Prioritized list of top fixes and content gaps",
      "Suggested implementation tier",
    ],
    excludes: "Does not include implementation, content creation, or structural changes.",
    cta: "Request This Audit",
    primary: true,
  },
  {
    name: "GEO Foundation Build",
    price: "Starting at $2,500",
    period: "One-time project",
    desc: "For businesses ready to close the most critical gaps and build the right structure.",
    includes: [
      "Everything in the Quick Audit",
      "Top technical fixes implemented",
      "Content map for your service area",
      "3–5 new or restructured pages built",
      "Structured data setup where applicable",
    ],
    excludes: null,
    cta: "Request a Foundation Build",
    primary: false,
  },
  {
    name: "GEO Monthly Growth",
    price: "Starting at $750/month",
    period: "Ongoing engagement · 3-month minimum",
    desc: "For businesses that want to improve AI visibility continuously over time.",
    includes: [
      "Monthly site review and progress report",
      "Continued content development",
      "Structured data monitoring and updates",
      "New page builds as opportunities emerge",
      "Ongoing technical maintenance",
    ],
    excludes: null,
    cta: "Discuss Monthly Scope",
    primary: false,
  },
];

const FAQ_ITEMS = [
  {
    q: "What is Generative Engine Optimization?",
    a: "Generative Engine Optimization (GEO) is the practice of improving how your business is understood, cited, and surfaced by AI-powered search systems — such as ChatGPT, Perplexity, Google's AI Overview, and similar tools. Unlike traditional SEO, which focuses on keyword rankings and backlinks, GEO focuses on content clarity, entity recognition, structured data, and the page types that AI systems use to generate trustworthy answers.",
  },
  {
    q: "How is GEO different from SEO?",
    a: "Traditional SEO is primarily about ranking in a list of links. GEO is about being cited or referenced inside an AI-generated answer. The signals that matter are different: entity consistency, content depth, structured data, page architecture, and the presence of specific page types (like FAQs, process pages, and case studies) that AI systems use to verify and summarize your offering. A well-optimized SEO site is not automatically GEO-ready.",
  },
  {
    q: "We already invest in SEO — does GEO add anything?",
    a: "Usually, yes. Most SEO work focuses on keywords, metadata, and backlinks. GEO work focuses on content structure, entity clarity, page types, and schema markup — areas that are frequently underdeveloped even on sites with strong traditional SEO. If your site lacks structured service pages, an FAQ, a documented process, or case studies, you are likely underperforming in AI search regardless of your keyword rankings.",
  },
  {
    q: "What does the audit actually look at?",
    a: "The audit covers eight areas: crawlability and indexing, technical readiness (title tags, meta descriptions, canonical tags, structured data), entity clarity (business name, location, contact visibility), service page depth, trust and proof content (testimonials, case studies), answer-engine coverage (FAQ, process, comparison pages), internal structure, and conversion readiness. Each area is scored and graded. Every finding is documented with evidence from your actual site.",
  },
  {
    q: "Do you fix the issues you find?",
    a: "That depends on the engagement tier. The Quick Audit documents findings and provides a prioritized action plan — you can implement the recommendations yourself or hire us to do it. The Foundation Build and Monthly Growth tiers include hands-on implementation work.",
  },
  {
    q: "Do you write the content too?",
    a: "Yes, for Foundation Build and Monthly Growth engagements. We write new service pages, FAQ content, process documentation, case studies, and other page types identified in the audit. All content is written to match your business voice and reviewed by you before it goes live.",
  },
  {
    q: "Can this help a local service business?",
    a: "Yes. Local service businesses are often underserved by AI search. If someone asks an AI system to recommend a plumber, IT provider, accountant, or attorney in a specific city, the businesses that appear tend to have clear service descriptions, visible location information, reviews or testimonials, and structured contact details. If any of those elements are missing or inconsistent, GEO work directly addresses that.",
  },
  {
    q: "Do I need to rebuild my whole website?",
    a: "Not typically. Most GEO work involves adding or improving content on an existing site — new pages, better metadata, structured data, FAQ sections, and updated service descriptions. We work within your current CMS and site structure wherever possible. Rebuilding is only recommended in cases where the underlying architecture is genuinely preventing crawlers from accessing your content.",
  },
  {
    q: "How long does a GEO audit take?",
    a: "The automated component of the audit runs within minutes of form submission. The full written report — with findings documented, graded, and prioritized — is typically delivered within two to three business days. Larger sites with more complex content structures may take an additional day.",
  },
  {
    q: "Can this be an ongoing monthly service?",
    a: "Yes. GEO is not a one-time fix. AI systems update frequently, new query patterns emerge, and adding content over time steadily improves your visibility. The Monthly Growth tier is designed for businesses that want continuous improvement rather than a single audit snapshot.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#D7E1EA] py-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-start justify-between w-full text-left font-heading font-bold text-[15px] text-[#0E2F54] hover:text-[#1F5E95] py-4 gap-4 transition-colors"
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 mt-0.5 text-[#1F5E95] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="text-[#4B5B6B] text-base leading-relaxed pb-5 pr-8">
          {a}
        </div>
      )}
    </div>
  );
}

export default function GenerativeEngineOptimization() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "name": "Generative Engine Optimization (GEO)",
              "url": CANONICAL,
              "description": DESC,
              "provider": { "@id": "https://gsally.com/#organization" },
              "areaServed": { "@type": "Place", "name": "Grand Strand, Myrtle Beach, SC" },
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://gsally.com/services" },
                { "@type": "ListItem", "position": 3, "name": "GEO / AI Visibility", "item": CANONICAL },
              ],
            },
            {
              "@type": "FAQPage",
              "mainEntity": FAQ_ITEMS.map(({ q, a }) => ({
                "@type": "Question",
                "name": q,
                "acceptedAnswer": { "@type": "Answer", "text": a },
              })),
            },
          ],
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-white/45 font-medium">
            <Link href="/" className="hover:text-white/70 transition-colors">Grand Strand Ally</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/70">GEO / AI Visibility</span>
          </nav>
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            GEO / AI Visibility
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-6 leading-[1.05] max-w-3xl">
            Show up in AI-generated answers, not just search results.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mb-8">
            Customers are increasingly finding service providers through AI-powered answer engines — not just a list of links. Generative Engine Optimization helps your business become the kind of source those engines reference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              asChild
              className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-sm rounded-lg border-0 w-full sm:w-auto"
            >
              <Link href="/geo-audit">Request a GEO Audit →</Link>
            </Button>
            <Button
              asChild
              className="bg-transparent border border-white/25 text-white hover:bg-white/8 font-semibold h-12 px-7 text-sm rounded-lg w-full sm:w-auto"
            >
              <a href="#whats-included">See What's Included</a>
            </Button>
          </div>
          <p className="text-xs text-white/35 font-medium">
            Practical review · No-pressure approach · Grand Strand–based
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#D7E1EA]">
            {[
              "No hype, no jargon",
              "Clear deliverables at every tier",
              "Based in the Grand Strand since 2015",
            ].map(label => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-4 sm:px-8 text-sm text-[#4B5B6B] font-medium">
                <CheckCircle2 size={14} className="text-[#1F5E95] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What is GEO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Understanding GEO
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-6 leading-[1.15]">
            What is Generative Engine Optimization?
          </h2>
          <div className="space-y-5 text-[#4B5B6B] text-base md:text-lg leading-relaxed">
            <p>
              When someone asks ChatGPT, Perplexity, or Google's AI Overview to recommend a service provider, the answer they receive is generated from content those systems have indexed and evaluated. Businesses that appear in those answers tend to have sites that are clearly structured, well-documented, and content-rich — not just well-ranked in traditional search.
            </p>
            <p>
              Generative Engine Optimization is the practice of improving how your business is understood, cited, and surfaced by AI search systems. Unlike traditional SEO, which focuses heavily on keywords and backlinks, GEO focuses on content clarity, entity recognition, structured data, and the page types that help AI systems accurately represent your business in generated responses.
            </p>
            <p>
              This is not a shortcut. It is methodical work: auditing your current site, identifying what is missing or unclear, and building out the content and structure that makes your business easier to understand and reference — for both AI systems and the people asking them questions.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Who This Is For
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-10 leading-[1.15]">
            A good fit — and not a good fit.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-[#D7E1EA] p-7">
              <h3 className="text-sm font-bold text-[#0E2F54] uppercase tracking-[0.12em] mb-5">Good fit</h3>
              <ul className="space-y-3.5">
                {GOOD_FIT.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-[#4B5B6B] leading-relaxed">
                    <CheckCircle2 size={16} className="text-[#1F5E95] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-[#D7E1EA] p-7">
              <h3 className="text-sm font-bold text-[#4B5B6B] uppercase tracking-[0.12em] mb-5">Not a fit</h3>
              <ul className="space-y-3.5">
                {NOT_FIT.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-[#4B5B6B] leading-relaxed">
                    <Minus size={16} className="text-[#9AAEBB] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section id="whats-included" className="py-20 md:py-28 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              What's Included
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-4 leading-[1.15]">
              Everything covered in a GEO engagement.
            </h2>
            <p className="text-[#4B5B6B] text-base md:text-lg leading-relaxed">
              Every audit covers these nine areas. The depth of implementation depends on the engagement tier.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHATS_INCLUDED.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#F7F5F1] rounded-xl border border-[#D7E1EA] p-6 hover:border-[#1F5E95] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#E8EFF6] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#1F5E95]" />
                </div>
                <h3 className="font-heading font-bold text-[15px] text-[#0E2F54] mb-2">{title}</h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#0E2F54] text-white relative overflow-hidden scroll-mt-20">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />
              How the Process Works
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-[1.15]">
              A structured, five-step engagement.
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed">
              Every engagement follows the same disciplined process — from initial discovery to ongoing improvement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/10 rounded-xl overflow-hidden">
            {PROCESS_STEPS.map(({ num, title, desc }) => (
              <div key={num} className="bg-[#0A2440] p-6 md:p-7">
                <div className="text-[11px] font-bold text-[#60B8F0] tracking-[0.2em] mb-3">{num}</div>
                <h3 className="font-heading font-bold text-base text-white mb-3">{title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Deliverables
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-8 leading-[1.15]">
            What you receive.
          </h2>
          <ul className="space-y-4">
            {DELIVERABLES.map(item => (
              <li key={item} className="flex gap-3 text-[#4B5B6B] text-base leading-relaxed">
                <CheckCircle2 size={18} className="text-[#1F5E95] flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button
              asChild
              className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-sm rounded-lg border-0"
            >
              <Link href="/geo-audit">Request a GEO Audit →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Pricing and Engagement Options
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-4 leading-[1.15]">
              Three ways to engage.
            </h2>
            <p className="text-[#4B5B6B] text-base md:text-lg leading-relaxed">
              Start with a quick audit to understand where you stand, or move directly into implementation. All pricing is quoted based on site size and scope after the intake form.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map(tier => (
              <div
                key={tier.name}
                className={`rounded-xl border p-7 flex flex-col ${
                  tier.primary
                    ? "bg-[#0E2F54] border-transparent text-white"
                    : "bg-white border-[#D7E1EA]"
                }`}
              >
                <div className="mb-6">
                  <h3 className={`font-heading font-bold text-lg mb-1 ${tier.primary ? "text-white" : "text-[#0E2F54]"}`}>
                    {tier.name}
                  </h3>
                  <div className={`text-2xl font-heading font-extrabold mb-0.5 ${tier.primary ? "text-white" : "text-[#0E2F54]"}`}>
                    {tier.price}
                  </div>
                  <div className={`text-xs font-medium mb-4 ${tier.primary ? "text-white/55" : "text-[#9AAEBB]"}`}>
                    {tier.period}
                  </div>
                  <p className={`text-sm leading-relaxed ${tier.primary ? "text-white/65" : "text-[#4B5B6B]"}`}>
                    {tier.desc}
                  </p>
                </div>
                <ul className="space-y-3 mb-6 flex-grow">
                  {tier.includes.map(item => (
                    <li key={item} className={`flex gap-2.5 text-sm leading-relaxed ${tier.primary ? "text-white/80" : "text-[#4B5B6B]"}`}>
                      <CheckCircle2 size={15} className={`flex-shrink-0 mt-0.5 ${tier.primary ? "text-[#60B8F0]" : "text-[#1F5E95]"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                {tier.excludes && (
                  <p className={`text-xs mb-5 leading-relaxed ${tier.primary ? "text-white/40" : "text-[#9AAEBB]"}`}>
                    Note: {tier.excludes}
                  </p>
                )}
                <Button
                  asChild
                  className={
                    tier.primary
                      ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-11 text-sm rounded-lg border-0 w-full"
                      : "bg-[#F7F5F1] hover:bg-[#EAE8E4] text-[#0E2F54] border border-[#D7E1EA] font-semibold h-11 text-sm rounded-lg w-full"
                  }
                >
                  <Link href="/geo-audit">{tier.cta} →</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E95] flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-10 leading-[1.15]">
            Common questions about GEO.
          </h2>
          <div>
            {FAQ_ITEMS.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Ready to see where your business stands?"
        subtitle="We review your site, score it across eight GEO-readiness categories, and give you a clear plan for what to improve first."
        buttons={[
          { label: "Request a GEO Audit", href: "/geo-audit", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
