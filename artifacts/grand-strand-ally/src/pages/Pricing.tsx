import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function Pricing() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#0E2F54] text-white pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">
            Clear, predictable pricing.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-xl mx-auto">
            Month-to-month agreements. No vendor lock-in. We quote clear scopes before any work starts — so you never get a surprise bill.
          </p>
        </div>
      </section>

      {/* How pricing works */}
      <section className="py-16 md:py-20 bg-[#F7F5F1] border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <SectionHeading
            label="How it works"
            title="Pricing that makes sense."
            description="Straightforward monthly support plans and scoped project pricing based on your team size, devices, locations, and service needs. No mystery charges, no bloated bundles."
            centered
          />
        </div>
      </section>

      {/* Support Models */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            label="Support models"
            title="Right-sized for your business."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
            {content.pricingModels.map((model, i) => (
              <div
                key={i}
                className="bg-[#F7F5F1] rounded-2xl p-7 border border-[#D7E1EA] flex flex-col"
                data-testid={`pricing-model-${i}`}
              >
                <h3 className="text-lg font-heading font-bold text-[#0E2F54] mb-3">{model.name}</h3>
                <p className="text-sm text-[#4B5B6B] mb-6 flex-grow leading-relaxed">{model.description}</p>
                <div className="bg-white rounded-xl border border-[#D7E1EA] px-4 py-3 text-xs font-medium text-[#4B5B6B] text-center mb-5">
                  Pricing varies by team size & needs — contact us for a quote.
                </div>
                <Button
                  asChild
                  className="w-full bg-[#0E2F54] hover:bg-[#0A2440] text-white text-sm h-10 rounded-md font-semibold"
                  data-testid={`pricing-cta-${i}`}
                >
                  <Link href="/contact">Request a Quote</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What affects pricing + What's included */}
      <section className="py-20 md:py-28 bg-[#DCEAF7]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <SectionHeading
                label="Factors"
                title="What affects your price?"
              />
              <ul className="space-y-3">
                {[
                  "Number of active users / employees",
                  "Number of devices (computers, servers)",
                  "Physical office locations",
                  "Microsoft 365 licensing needs",
                  "Security or compliance requirements",
                  "Ongoing support vs. scoped project work",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="text-[#1F5E95] shrink-0 mt-0.5" size={16} />
                    <span className="text-[#0E2F54] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-[#D7E1EA] shadow-sm">
              <h3 className="text-lg font-heading font-bold text-[#0E2F54] mb-2">What's always included</h3>
              <p className="text-sm text-[#4B5B6B] mb-6 leading-relaxed">Every monthly support plan includes the core tools to keep your business safe and productive.</p>
              <ul className="space-y-3">
                {[
                  "Proactive monitoring & updates",
                  "Endpoint security (antivirus / EDR)",
                  "Remote help desk support",
                  "Monthly check-ins & reporting",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#4B5B6B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            label="FAQ"
            title="Pricing questions."
            centered
          />
          <div className="max-w-2xl mx-auto mt-10">
            <FAQ />
          </div>
        </div>
      </section>

      <CTABand
        title="Ready to get a clear number for your business?"
        buttons={[
          { label: "Contact Us for Pricing", href: "/contact", primary: true },
          { label: "See Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
