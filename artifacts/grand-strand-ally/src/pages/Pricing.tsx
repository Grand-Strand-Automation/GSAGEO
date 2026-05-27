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
            Clear, predictable pricing.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            Month-to-month agreements. No vendor lock-in. We quote clear scopes before any work starts — so you never get a surprise bill.
          </p>
        </div>
      </section>

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
                className={`rounded-2xl p-7 border flex flex-col ${
                  i === 1
                    ? "bg-[#0E2F54] border-[#0E2F54] text-white"
                    : "bg-[#F7F5F1] border-[#D7E1EA]"
                }`}
                data-testid={`pricing-model-${i}`}
              >
                {i === 1 && (
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#60B8F0] mb-4">
                    Most popular
                  </div>
                )}
                <h3 className={`text-lg font-heading font-bold mb-3 ${i === 1 ? "text-white" : "text-[#0E2F54]"}`}>
                  {model.name}
                </h3>
                <p className={`text-sm mb-6 flex-grow leading-relaxed ${i === 1 ? "text-white/70" : "text-[#4B5B6B]"}`}>
                  {model.description}
                </p>
                <div className={`rounded-xl border px-4 py-3 text-xs font-medium text-center mb-5 ${
                  i === 1
                    ? "bg-white/10 border-white/15 text-white/60"
                    : "bg-white border-[#D7E1EA] text-[#4B5B6B]"
                }`}>
                  Custom quote based on team size & needs
                </div>
                <Button
                  asChild
                  className={`w-full h-10 text-sm rounded-lg font-semibold ${
                    i === 1
                      ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white border-0"
                      : "bg-[#0E2F54] hover:bg-[#0A2440] text-white border-0"
                  }`}
                  data-testid={`pricing-cta-${i}`}
                >
                  <Link href="/contact">Request a Quote</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#F7F5F1]">
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
              <p className="text-sm text-[#4B5B6B] mb-6 leading-relaxed">
                Every monthly support plan includes the core tools to keep your business safe and productive.
              </p>
              <ul className="space-y-3">
                {[
                  "Proactive monitoring & updates",
                  "Endpoint security (antivirus / EDR)",
                  "Remote help desk support",
                  "Monthly check-ins & reporting",
                  "Microsoft 365 management",
                  "Documentation of your environment",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={15} className="text-[#1F5E95] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 w-full bg-[#0E2F54] hover:bg-[#0A2440] text-white h-11 text-sm font-semibold rounded-lg"
              >
                <Link href="/contact">Book a Free IT Review →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
        subtitle="Contact us and we'll put together a straightforward quote — no obligation."
        buttons={[
          { label: "Contact Us for Pricing", href: "/contact", primary: true },
          { label: "See Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
