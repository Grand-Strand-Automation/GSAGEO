import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, X, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/free-it-cost-analysis";
const TITLE = "Free IT Cost Analysis for Small Businesses | Grand Strand Ally";
const DESC =
  "A free, structured review of your current IT environment — what you are spending, where tools overlap, how Microsoft 365 is configured, and what compliance gaps exist. No commitment required. Written findings included.";

const WHAT_WE_REVIEW = [
  {
    num: "01",
    title: "Vendor and subscription inventory",
    desc: "Every information technology vendor, contract, and software subscription your business currently pays for — pulled from statements, invoices, and your existing documentation. Most businesses have not seen a complete list in one place.",
    icon: "📋",
  },
  {
    num: "02",
    title: "Spend breakdown by category",
    desc: "Your total monthly information technology spend organized by capability — support, security, backup, identity and access, Microsoft 365, and cloud software. Compared against typical per-user ranges for businesses of similar size.",
    icon: "📊",
  },
  {
    num: "03",
    title: "Tool overlap and redundancy",
    desc: "Categories where you are paying more than one vendor for similar capabilities. Security tools and backup tools are the most common overlap areas. Where overlap exists, we estimate the cost and identify which vendor to retain.",
    icon: "🔍",
  },
  {
    num: "04",
    title: "Microsoft 365 licensing and configuration",
    desc: "License tier versus active user count, licenses assigned to former employees, and an assessment of whether security features included in your current tier are configured or going unused. Misconfigured Microsoft 365 is one of the most common sources of both cost waste and security risk.",
    icon: "☁️",
  },
  {
    num: "05",
    title: "Compliance and access control gaps",
    desc: "Multi-factor authentication coverage, onboarding and offboarding documentation, admin role review, backup ownership clarity, and access change tracking. Reported in plain language with practical prioritization — not a formal audit.",
    icon: "🔒",
  },
];

const WHAT_YOU_RECEIVE = [
  {
    title: "A written summary of findings",
    desc: "Not a verbal presentation — a document you keep. Findings are specific: named vendors, specific accounts, identified gaps, and estimated cost or risk impact for each.",
  },
  {
    title: "A prioritized action list",
    desc: "Findings ranked by impact and effort. The items most worth addressing first are identified clearly, so you are not left with a long list and no sense of where to start.",
  },
  {
    title: "Estimated savings where they exist",
    desc: "Where consolidation opportunities are identified, the estimated monthly savings are calculated with supporting logic — not a generic percentage claim.",
  },
  {
    title: "A support proposal, if there is a fit",
    desc: "If the review suggests an ongoing engagement makes sense, a specific scope and monthly price will be proposed — in writing, with a clear description of what is and is not included. No commitment is required to receive this.",
  },
];

const NOT_REQUIRED = [
  {
    title: "No commitment to proceed",
    desc: "The written findings are yours to keep regardless of whether you engage further. There is no condition on receiving them.",
  },
  {
    title: "No existing IT vendor to fire",
    desc: "You do not need to make any changes before or during the analysis. Many businesses start the process while still working with an existing provider.",
  },
  {
    title: "No preparation or documentation to pull together",
    desc: "You do not need an inventory, a vendor list, or any prepared materials. Part of the value of the analysis is building that picture together.",
  },
  {
    title: "No IT background or technical knowledge",
    desc: "The first conversation is a structured discussion about your team, your costs, and your current challenges. No technical fluency required.",
  },
  {
    title: "No long-term contract to sign",
    desc: "If you proceed to an engagement, it is month-to-month with defined scope. You are not locking in for a year to receive the findings.",
  },
];

const STEPS = [
  {
    num: "01",
    label: "Fill out the contact form or use the calculator",
    desc: "Tell us your company name, team size, and the best way to reach you. You can also start with the cost analysis calculator to send us your initial numbers before the call.",
    links: [
      { label: "Schedule via contact form", href: "/contact" },
      { label: "Start the cost analysis calculator", href: "/cost-analysis" },
    ],
  },
  {
    num: "02",
    label: "30–60 minute initial conversation",
    desc: "We discuss your current environment, tools, vendors, team structure, and biggest pain points. This conversation is the foundation of the analysis — not a sales call. No pitch, no demo.",
    links: [],
  },
  {
    num: "03",
    label: "Receive written findings in about a week",
    desc: "We review your environment, compile findings, and present them in a second meeting — typically within five to ten business days. You receive the written summary at or before that meeting.",
    links: [],
  },
];

const FAQS = [
  {
    q: "How is this different from a regular sales call?",
    a: "A sales call is structured around demonstrating a product or service. A cost analysis is structured around building an accurate picture of your current environment — what you have, what it costs, where the gaps are. The difference is visible in the output: a sales call produces a proposal, a cost analysis produces a findings document. We produce both, but the findings document comes first, is specific to your environment, and is yours to keep regardless of what you decide.",
  },
  {
    q: "What if we already have a managed IT provider?",
    a: "That is fine and common. Many businesses start a cost analysis while still working with an existing provider. The analysis is not a pitch to fire your current vendor — it is a structured review of whether you are getting clear value for what you are paying. If you are, the analysis will reflect that. If there are gaps, you will have specific documentation to use in any conversation with your current provider or with us.",
  },
  {
    q: "How long does the full process take?",
    a: "The first conversation is typically 30 to 60 minutes. The written findings are usually delivered within five to ten business days after that. If you choose to proceed to an engagement, a scope proposal is delivered at the same time as the findings. Total time from first contact to written findings: one to two weeks depending on scheduling.",
  },
  {
    q: "Will I be pressured to sign up after the findings?",
    a: "No. The findings are delivered in a second meeting and you receive the written summary at that meeting — before any conversation about next steps. If an engagement makes sense, we will say so and propose specific scope and pricing. If it does not, we will say that too. Either way, the findings are yours.",
  },
  {
    q: "Is this only for businesses in the Myrtle Beach area?",
    a: "Grand Strand Ally is based in the Myrtle Beach area and primarily serves businesses in the Grand Strand — Myrtle Beach, Conway, North Myrtle Beach, Surfside Beach, Murrells Inlet, Pawleys Island, Little River, and surrounding communities. If you are outside the area and interested, reach out and we can discuss whether remote support is a fit.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#D7E1EA] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 px-6 text-left hover:bg-[#FAFAFA] transition-colors"
        aria-expanded={open}
      >
        <span className="text-[15px] font-heading font-semibold text-[#0E2F54] leading-snug pr-2">{q}</span>
        <span className="shrink-0 mt-0.5 text-[#4B5B6B]">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-[15px] text-[#4B5B6B] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FreeITCostAnalysis() {
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
        <meta name="twitter:title" content="Free IT Cost Analysis | Grand Strand Ally — Myrtle Beach, SC" />
        <meta name="twitter:description" content="Free structured review of your IT environment. Written findings. No commitment. Serving small businesses across the Grand Strand." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "name": "Free Information Technology Cost Analysis",
              "provider": { "@id": "https://gsally.com/#organization" },
              "description": DESC,
              "areaServed": { "@type": "Place", "name": "Grand Strand, Myrtle Beach, SC" },
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "url": CANONICAL,
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Free IT Cost Analysis", "item": CANONICAL }
              ]
            }
          ]
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Free · No commitment · Written findings
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            A free, structured look at what you are paying for.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-8">
            The Grand Strand Ally cost analysis reviews your current information technology environment — vendors, costs, Microsoft 365, security, backup, and compliance controls — and delivers written findings with no obligation to proceed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0E2F54] hover:bg-[#DCEAF7] font-bold text-sm h-12 px-8 rounded-lg transition-colors"
            >
              Schedule a Free Cost Analysis →
            </Link>
            <Link
              href="/cost-analysis"
              className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white font-semibold text-sm h-12 px-8 rounded-lg transition-colors bg-white/5"
            >
              Use the cost analysis calculator
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick proof bar ── */}
      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-[#D7E1EA]">
            {[
              { stat: "$206/mo", label: "Avg. savings identified in recent engagements" },
              { stat: "30–60 min", label: "Time required for the first conversation" },
              { stat: "~1 week", label: "From first call to written findings" },
              { stat: "$0", label: "Cost to receive the analysis and findings" },
            ].map((item) => (
              <div key={item.stat} className="flex items-center gap-3 py-5 sm:px-7 sm:flex-col sm:text-center sm:gap-1.5">
                <p className="text-xl font-heading font-bold text-[#0E2F54]">{item.stat}</p>
                <p className="text-xs text-[#4B5B6B] leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── What we review ── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Scope of the review
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] mb-3">
              Five areas every review covers.
            </h2>
            <p className="text-[#4B5B6B] max-w-xl mx-auto text-[15px] leading-relaxed">
              The cost analysis is consistent across every engagement. These five areas are always reviewed — adjusted for your specific environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WHAT_WE_REVIEW.map((item) => (
              <div key={item.num} className="bg-white border border-[#D7E1EA] rounded-2xl p-6 shadow-sm flex gap-4">
                <div className="w-10 h-10 bg-[#DCEAF7] rounded-xl flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-[#1F5E95]">{item.num}</span>
                    <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-[#0E2F54] border border-[#0E2F54] rounded-2xl p-6 flex gap-4 items-center">
              <div>
                <p className="text-white font-heading font-bold text-lg mb-2 leading-snug">
                  Want to see what we find in practice?
                </p>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  Read four real engagement summaries from businesses in the Grand Strand area.
                </p>
                <Link href="/case-studies" className="inline-flex items-center gap-2 text-[#60B8F0] hover:text-white font-semibold text-sm transition-colors">
                  View case studies <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you receive ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Deliverables
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-5 leading-snug">
                What you receive from the analysis.
              </h2>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px] mb-5">
                The output of the analysis is a written document, not a verbal summary. It is specific to your environment — not a generic assessment — and is yours to keep regardless of whether you proceed to an engagement.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                If you want to understand what a well-structured cost analysis looks like before scheduling, see our guide:{" "}
                <Link href="/what-an-it-cost-analysis-should-include" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium underline underline-offset-2">
                  what an information technology cost analysis should include
                </Link>
                .
              </p>
            </div>
            <div className="space-y-3">
              {WHAT_YOU_RECEIVE.map((item, i) => (
                <div key={i} className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-heading font-bold text-[#0E2F54] mb-1">{item.title}</p>
                      <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What is NOT required ── */}
      <section className="py-16 md:py-20 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              No strings
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] leading-tight">
              What is not required.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NOT_REQUIRED.map((item, i) => (
              <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                    <X size={9} className="text-red-500" />
                  </div>
                  <p className="text-sm font-heading font-bold text-[#0E2F54] leading-tight">{item.title}</p>
                </div>
                <p className="text-sm text-[#4B5B6B] leading-relaxed pl-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to start ── */}
      <section className="py-16 md:py-20 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/25 inline-block" />
              Getting started
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
              Three steps from now to written findings.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 block mb-3">{step.num}</span>
                <h3 className="text-base font-heading font-bold text-white mb-3 leading-snug">{step.label}</h3>
                <p className="text-sm text-white/55 leading-relaxed mb-4">{step.desc}</p>
                {step.links.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {step.links.map((link) => (
                      <Link key={link.href} href={link.href} className="flex items-center gap-2 text-sm font-semibold text-[#60B8F0] hover:text-white transition-colors">
                        <ArrowRight size={12} /> {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#DCEAF7] text-[#0E2F54] font-bold text-sm h-12 px-10 rounded-lg transition-colors"
            >
              Schedule a Free Cost Analysis →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-20 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Questions
            </span>
            <h2 className="text-2xl font-heading font-bold text-[#0E2F54]">Common questions about the process.</h2>
          </div>
          <div className="bg-white rounded-2xl border border-[#D7E1EA] overflow-hidden shadow-sm mb-6">
            {FAQS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <p className="text-center text-sm text-[#4B5B6B]">
            More questions?{" "}
            <Link href="/faq" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium transition-colors">
              See the full FAQ →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Internal links ── */}
      <section className="py-10 bg-white border-t border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-5 text-center">Related pages</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "See what we find in practice", href: "/case-studies", desc: "Four real engagement summaries from Grand Strand businesses." },
              { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include", desc: "What to expect and five red flags to watch for." },
              { label: "Our four-step process", href: "/process", desc: "Review, Identify, Strengthen, Improve — how the engagement works." },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-[#F7F5F1] border border-[#D7E1EA] hover:border-[#1F5E95] rounded-xl p-5 transition-colors"
              >
                <p className="text-sm font-heading font-bold text-[#0E2F54] group-hover:text-[#1F5E95] transition-colors mb-1 flex items-center gap-2">
                  {link.label} <ArrowRight size={12} />
                </p>
                <p className="text-xs text-[#4B5B6B] leading-snug">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Ready to get started?"
        subtitle="Fill out the contact form or use the calculator to send your initial numbers. We follow up within one business day."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "Use the Calculator First", href: "/cost-analysis", primary: false },
        ]}
      />
    </div>
  );
}
