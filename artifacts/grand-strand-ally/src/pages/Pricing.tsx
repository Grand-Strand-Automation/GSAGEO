import { Helmet } from "react-helmet-async";
import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Search, ArrowRight } from "lucide-react";

export default function Pricing() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Pricing and Support Models | Grand Strand Ally — Myrtle Beach, SC</title>
        <meta name="description" content="Month-to-month information technology support with clear scope and no long-term contracts. Start with a free cost analysis to understand your current environment before committing to anything." />
        <link rel="canonical" href="https://gsally.com/pricing" />
        <meta property="og:title" content="Pricing and Support Models | Grand Strand Ally — Myrtle Beach, SC" />
        <meta property="og:description" content="Clear, month-to-month information technology pricing for small and medium businesses in the Grand Strand. No long-term contracts. Scope defined before work starts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gsally.com/pricing" />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pricing | Grand Strand Ally — Month-to-Month IT Support, Myrtle Beach" />
        <meta name="twitter:description" content="Month-to-month IT support with clear scope and no long-term contracts. Grand Strand Ally — Myrtle Beach, SC." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://gsally.com/pricing" }
              ]
            },
            {
              "@type": "WebPage",
              "url": "https://gsally.com/pricing",
              "name": "Pricing and Support Models — Grand Strand Ally",
              "isPartOf": { "@id": "https://gsally.com/#website" },
              "provider": { "@id": "https://gsally.com/#organization" }
            }
          ]
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
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            Start with a clearer view of your current environment.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-8">
            Grand Strand Ally helps businesses gain visibility into their information technology spend before recommending new services. We review the current environment, identify redundancy, and build a support model based on actual needs.
          </p>
          <Button asChild className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg border-0">
            <Link href="/contact#contact-form">Schedule a Free Cost Analysis →</Link>
          </Button>
        </div>
      </section>

      {/* Trust strip */}
      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#D7E1EA]">
            {[
              "No long-term contracts",
              "Scope defined before work starts",
              "Clear, predictable pricing",
              "Month-to-month agreements",
            ].map((label) => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-4 sm:px-8 text-sm text-[#4B5B6B] font-medium">
                <CheckCircle2 size={14} className="text-[#1F5E95] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy + Cost analysis items */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Our approach
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-4 leading-snug">
                Clear pricing starts with clear visibility
              </h2>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px] mb-7">
                Many businesses are paying for support, security, subscriptions, and Microsoft 365 licensing without a full picture of where costs overlap or where vendors are duplicating work. Our process starts by understanding what is already in place.
              </p>

              <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-3">How pricing works</h3>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px] mb-7">
                Our pricing is built around straightforward monthly support, scoped project work when needed, and a clear understanding of what is included — no mystery invoices, no bloated bundles, no long-term lock-in before value is proven.
              </p>

              <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-3">What affects monthly cost</h3>
              <ul className="space-y-2">
                {[
                  "Number of users and devices",
                  "Number of locations",
                  "Microsoft 365 scope",
                  "Security and compliance requirements",
                  "Onboarding and offboarding needs",
                  "Backup and recovery expectations",
                  "Ongoing support versus project work",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-[#4B5B6B]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Free cost analysis
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-6 leading-snug">
                What a cost analysis looks at
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Current vendors and subscriptions",
                  "Software and licensing",
                  "Microsoft 365 licensing",
                  "Overlapping security tools",
                  "Support coverage and ownership",
                  "Onboarding and offboarding controls",
                  "Backup and recovery coverage",
                  "Compliance-related considerations",
                  "Opportunities to simplify or consolidate",
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
                    <Search size={14} className="text-[#1F5E95] flex-shrink-0" />
                    <span className="text-sm text-[#0E2F54] font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="mt-5 w-full bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-12 text-sm rounded-lg">
                <Link href="/contact#contact-form">Schedule a Free Cost Analysis →</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Support models */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Support models
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54]">
              Sample support models
            </h2>
            <p className="text-[#4B5B6B] text-[15px] mt-3 max-w-lg mx-auto leading-relaxed">
              Custom quoted based on your environment. We do not publish flat-rate pricing because every business is different — and we will not pad a quote to cover what you do not need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                name: "Essential Support",
                copy: "A fit for smaller teams that need dependable support, Microsoft 365 help, and cleaner day-to-day issue ownership without unnecessary complexity.",
                highlight: false,
              },
              {
                name: "Growth Support",
                copy: "A fit for growing businesses that need broader support coverage, stronger security controls, better onboarding and offboarding processes, and more operational consistency.",
                highlight: true,
              },
              {
                name: "Custom Support",
                copy: "A fit for businesses with multiple locations, more complex environments, stronger compliance expectations, or a need to combine support, cleanup, and process improvement.",
                highlight: false,
              },
            ].map((model, i) => (
              <div
                key={i}
                className={`rounded-2xl p-7 border flex flex-col ${
                  model.highlight
                    ? "bg-[#0E2F54] border-[#0E2F54] text-white shadow-lg"
                    : "bg-[#F7F5F1] border-[#D7E1EA]"
                }`}
                data-testid={`pricing-model-${i}`}
              >
                {model.highlight && (
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#60B8F0] mb-3">
                    Most popular
                  </div>
                )}
                <h3 className={`text-lg font-heading font-bold mb-3 ${model.highlight ? "text-white" : "text-[#0E2F54]"}`}>
                  {model.name}
                </h3>
                <p className={`text-sm leading-relaxed flex-grow mb-6 ${model.highlight ? "text-white/70" : "text-[#4B5B6B]"}`}>
                  {model.copy}
                </p>
                <div className={`rounded-xl border px-4 py-2.5 text-xs font-medium text-center mb-5 ${
                  model.highlight ? "bg-white/10 border-white/15 text-white/55" : "bg-white border-[#D7E1EA] text-[#4B5B6B]"
                }`}>
                  Custom quote — based on your environment
                </div>
                <Button asChild className={`w-full h-10 text-sm rounded-lg font-semibold border-0 ${
                  model.highlight ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white" : "bg-[#0E2F54] hover:bg-[#0A2440] text-white"
                }`}>
                  <Link href="/contact#contact-form">Request a Quote</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 md:py-20 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                After the analysis
              </span>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4 leading-snug">
                What the conversation includes
              </h2>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px] mb-5">
                If we move forward after a cost analysis, we define scope clearly, explain what is included, identify what is optional, and show where simplification or consolidation can create meaningful improvements.
              </p>
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors"
              >
                Start the conversation <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {[
                { step: "01", label: "Review your current environment", desc: "We map your tools, vendors, subscriptions, and support model." },
                { step: "02", label: "Identify overlap and gaps", desc: "We surface where costs overlap, where compliance controls are inconsistent, and where support ownership is unclear." },
                { step: "03", label: "Present findings clearly", desc: "You receive a plain-language summary of what we found and what we would recommend." },
                { step: "04", label: "Scope a plan if it makes sense", desc: "If there is a fit, we propose a clear monthly plan with defined scope — no pressure, no lock-in." },
              ].map((item) => (
                <div key={item.step} className="bg-white border border-[#D7E1EA] rounded-xl p-4 flex items-start gap-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#DCEAF7] text-[#1F5E95] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="text-sm font-heading font-bold text-[#0E2F54] mb-0.5">{item.label}</div>
                    <div className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Common questions
            </span>
            <h2 className="text-3xl font-heading font-bold text-[#0E2F54]">Pricing questions.</h2>
          </div>
          <div className="divide-y divide-[#D7E1EA] border border-[#D7E1EA] rounded-2xl overflow-hidden shadow-sm">
            {[
              {
                q: "Do you publish fixed pricing?",
                a: "We use structured pricing models, but final pricing depends on team size, devices, locations, Microsoft 365 scope, support expectations, and compliance-related requirements.",
              },
              {
                q: "Do you require long-term contracts?",
                a: "No. We focus on monthly service and clear scope rather than long-term lock-in.",
              },
              {
                q: "Can cost savings come from removing tools?",
                a: "Yes. In many cases, savings come from reducing duplicate software, simplifying vendors, improving licensing, and standardizing how support is delivered.",
              },
              {
                q: "Will you recommend replacing everything?",
                a: "No. We usually start by reviewing what already exists and improving what makes sense before recommending major changes.",
              },
            ].map((item, i) => (
              <div key={i} className="px-6 py-5 bg-white hover:bg-[#FAFAFA] transition-colors">
                <p className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{item.q}</p>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Before adding more tools, understand what you already have."
        subtitle="A free cost analysis helps identify overlap, clarify support needs, and surface practical opportunities to simplify and improve."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact#contact-form", primary: true },
          { label: "See Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
