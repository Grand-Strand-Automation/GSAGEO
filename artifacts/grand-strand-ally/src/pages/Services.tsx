import { Helmet } from "react-helmet-async";
import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Headset, Cloud, Wifi, Shield, Database, Zap, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  headset: Headset,
  cloud: Cloud,
  wifi: Wifi,
  shield: Shield,
  database: Database,
  zap: Zap,
};

export default function Services() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Information Technology Services | Grand Strand Ally — Myrtle Beach, SC</title>
        <meta
          name="description"
          content="Managed support, Microsoft 365 administration, cybersecurity, backup, and compliance-minded services for small and medium businesses in the Grand Strand area. Month-to-month, no long-term contracts."
        />
        <link rel="canonical" href="https://gsally.com/services" />
        <meta property="og:title" content="Information Technology Services | Grand Strand Ally" />
        <meta property="og:description" content="Practical information technology services for small and medium businesses across the Grand Strand. Managed support, Microsoft 365, cybersecurity, and compliance-minded operations." />
        <meta property="og:url" content="https://gsally.com/services" />
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
            What we offer
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            Information technology services built to reduce complexity and improve control.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-8">
            We start by understanding your current environment, then simplify support, consolidate tools, and strengthen compliance-minded operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg border-0">
              <Link href="/contact">Schedule a Free Cost Analysis →</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/25 text-white hover:bg-white/8 hover:text-white h-12 px-7 text-[15px] bg-transparent rounded-lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Short intro */}
      <section className="py-10 md:py-14 bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-[#0E2F54] mb-3">
            Support that starts with clarity, not a new sales pitch.
          </h2>
          <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
            We review your current environment first — tools, costs, vendors, and gaps. Then we simplify what makes sense, strengthen what is weak, and automate what is repetitive.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {content.services.map((svc) => {
              const Icon = iconMap[svc.icon] || Zap;
              return (
                <div
                  key={svc.id}
                  className="bg-white border border-[#D7E1EA] rounded-xl p-6 shadow-sm"
                  data-testid={`service-card-${svc.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#DCEAF7] rounded-xl flex items-center justify-center flex-shrink-0 text-[#1F5E95]">
                      <Icon size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5 leading-snug">{svc.name}</h3>
                      <p className="text-sm text-[#4B5B6B] mb-4 leading-relaxed">{svc.shortDescription}</p>
                      <ul className="space-y-1.5">
                        {svc.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-center gap-2 text-[13px] text-[#4B5B6B]">
                            <CheckCircle2 size={12} className="text-[#1F5E95] flex-shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 md:py-20 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />
                Outcomes
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                What clients gain.
              </h2>
              <p className="text-sm text-white/55 leading-relaxed">
                After a cost analysis and engagement, most clients have a clearer view of what they are paying for, fewer overlapping tools, and stronger information technology processes.
              </p>
            </div>
            <ul className="space-y-3 pt-2 md:pt-12">
              {[
                "Clearer understanding of current information technology spend",
                "Fewer overlapping tools and subscriptions",
                "Simpler support model with clear ownership",
                "Cleaner Microsoft 365 administration",
                "Stronger onboarding and offboarding controls",
                "Better support for compliance-conscious operations",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/75 font-medium">
                  <CheckCircle2 size={14} className="text-[#60B8F0] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTABand
        title="Not sure which service comes first?"
        subtitle="Start with a free cost analysis. We review your current environment, identify overlap and friction, and help prioritize practical next steps."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
        ]}
      />
    </div>
  );
}
