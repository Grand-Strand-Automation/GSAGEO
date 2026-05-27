import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Search } from "lucide-react";

export default function Pricing() {
  return (
    <div className="flex flex-col">

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold italic mb-5 leading-[1.05]">
            Start with a clearer view of what you're already paying for.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
            Grand Strand Ally helps businesses simplify their IT spend before recommending new services. We review the current environment, identify duplication and waste, and build a support model based on actual needs.
          </p>
          <Button
            asChild
            className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg border-0"
          >
            <Link href="/contact">Book a Free Cost Analysis →</Link>
          </Button>
        </div>
      </section>

      {/* Pricing philosophy + What a cost analysis looks at */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Philosophy */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Our approach
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-4 leading-snug">
                Clear pricing starts with clear visibility
              </h2>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px] mb-8">
                Many businesses are paying for support, security, subscriptions, and Microsoft 365 licensing without a full picture of where costs overlap or where vendors are duplicating work. Our process starts by understanding what is already in place so recommendations are based on reality, not generic packages.
              </p>

              <h3 className="text-base font-heading font-bold text-[#0E2F54] mb-4">
                How pricing works
              </h3>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px] mb-8">
                Our pricing is built around straightforward monthly support, scoped project work when needed, and a clear understanding of what is included. We do not believe in mystery invoice culture, bloated bundles, or long-term lock-in before value is proven.
              </p>

              <h3 className="text-base font-heading font-bold text-[#0E2F54] mb-3">
                What affects monthly cost
              </h3>
              <ul className="space-y-2">
                {[
                  "Number of users",
                  "Number of devices",
                  "Number of locations",
                  "Microsoft 365 scope",
                  "Security and compliance needs",
                  "Onboarding/offboarding requirements",
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

            {/* What a cost analysis looks at */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Free cost analysis
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-6 leading-snug">
                What a cost analysis looks at
              </h2>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  "Current IT vendors",
                  "Current software and subscriptions",
                  "Microsoft 365 licensing",
                  "Overlapping security tools",
                  "Support model gaps",
                  "Onboarding and offboarding gaps",
                  "Backup and recovery coverage",
                  "Compliance-related weaknesses",
                  "Opportunities to simplify or consolidate",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#D7E1EA] rounded-xl px-4 py-3.5 flex items-center gap-3"
                  >
                    <Search size={14} className="text-[#1F5E95] flex-shrink-0" />
                    <span className="text-sm text-[#0E2F54] font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="mt-6 w-full bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-12 text-sm rounded-lg"
              >
                <Link href="/contact">Book a Free Cost Analysis →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support models */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Support models
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54]">
              Sample support models
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    ? "bg-[#0E2F54] border-[#0E2F54] text-white"
                    : "bg-[#F7F5F1] border-[#D7E1EA]"
                }`}
                data-testid={`pricing-model-${i}`}
              >
                {model.highlight && (
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#60B8F0] mb-3">
                    Most popular
                  </div>
                )}
                <h3
                  className={`text-lg font-heading font-bold mb-3 ${
                    model.highlight ? "text-white" : "text-[#0E2F54]"
                  }`}
                >
                  {model.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed flex-grow mb-6 ${
                    model.highlight ? "text-white/70" : "text-[#4B5B6B]"
                  }`}
                >
                  {model.copy}
                </p>
                <div
                  className={`rounded-xl border px-4 py-3 text-xs font-medium text-center mb-5 ${
                    model.highlight
                      ? "bg-white/10 border-white/15 text-white/60"
                      : "bg-white border-[#D7E1EA] text-[#4B5B6B]"
                  }`}
                >
                  Custom quote — based on your environment
                </div>
                <Button
                  asChild
                  className={`w-full h-10 text-sm rounded-lg font-semibold border-0 ${
                    model.highlight
                      ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white"
                      : "bg-[#0E2F54] hover:bg-[#0A2440] text-white"
                  }`}
                >
                  <Link href="/contact">Request a Quote</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included in the conversation */}
      <section className="py-16 bg-[#F7F5F1] border-t border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-xl font-heading font-bold text-[#0E2F54] mb-3">
            What's included in the conversation
          </h2>
          <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
            If we move forward after a cost analysis, we define scope clearly, explain what is included, identify what is optional, and show where simplification or consolidation can create savings.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-bold text-[#0E2F54]">
              Pricing questions.
            </h2>
          </div>
          <div className="divide-y divide-[#D7E1EA] border border-[#D7E1EA] rounded-2xl overflow-hidden">
            {[
              {
                q: "Do you publish fixed pricing?",
                a: "We use structured pricing models, but final pricing depends on team size, devices, locations, Microsoft 365 needs, support expectations, and compliance-related requirements.",
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
              <div key={i} className="px-6 py-5 bg-white">
                <p className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{item.q}</p>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Before you buy more tools, understand what you already have."
        subtitle="A free cost analysis helps uncover overlap, clarify support needs, and identify where better structure can reduce waste and improve compliance-minded operations."
        buttons={[
          { label: "Book a Free Cost Analysis", href: "/contact", primary: true },
          { label: "Request Pricing", href: "/pricing", primary: false },
        ]}
      />
    </div>
  );
}
