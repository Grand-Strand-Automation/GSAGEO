import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Headset, Cloud, Wifi, Shield, Database, Zap, CheckCircle2, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "managed-it": Headset,
  "microsoft-365": Cloud,
  "network-wifi": Wifi,
  cybersecurity: Shield,
  "backup-recovery": Database,
  "workflow-automation": Zap,
};

const serviceDetails: Record<string, { copy: string; outcomes: string[] }> = {
  "managed-it": {
    copy: "Get a single accountable support partner instead of a patchwork of vendors, unclear responsibilities, and reactive fixes. We help simplify day-to-day support, reduce unnecessary complexity, and make monthly service easier to understand.",
    outcomes: [
      "Clearer ownership of support issues",
      "More predictable monthly service",
      "Less vendor sprawl",
    ],
  },
  "microsoft-365": {
    copy: "We help businesses clean up licensing, tighten administration, improve onboarding and offboarding, and make Microsoft 365 easier to manage with cost control, user consistency, and compliance-minded administration in mind.",
    outcomes: [
      "Better license alignment",
      "Stronger admin controls",
      "Cleaner user lifecycle management",
    ],
  },
  "network-wifi": {
    copy: "We review messy or aging network setups, reduce unnecessary complexity, and help create a more reliable office environment that is easier to support, secure, and maintain.",
    outcomes: [
      "Better reliability",
      "Simpler network ownership",
      "Stronger baseline security",
    ],
  },
  cybersecurity: {
    copy: "We strengthen practical security controls like MFA, endpoint protection, access management, and user lifecycle controls while supporting cleaner documentation, stronger standards, and better alignment for compliance-conscious businesses.",
    outcomes: [
      "Better access control",
      "Stronger security baseline",
      "Improved compliance-minded operations",
    ],
  },
  "backup-recovery": {
    copy: "We help make sure backup tools are actually aligned to your environment, recovery expectations are realistic, and restore planning supports both business continuity and compliance expectations.",
    outcomes: [
      "More confidence in recovery",
      "Clearer backup ownership",
      "Better continuity planning",
    ],
  },
  "workflow-automation": {
    copy: "We automate repetitive administrative work where it makes sense while improving consistency, access control, mailbox handling, role-based setup, offboarding, and user-change documentation.",
    outcomes: [
      "Less repetitive admin work",
      "Cleaner onboarding/offboarding",
      "Stronger control and documentation",
    ],
  },
};

export default function Services() {
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
            What we offer
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            IT services built to reduce waste, simplify support, and improve control.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
            Grand Strand Ally helps businesses understand what they already have, reduce overlapping tools and vendor sprawl, strengthen compliance-minded operations, and build a cleaner, easier-to-manage technology environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg border-0"
            >
              <Link href="/contact">Book a Free Cost Analysis →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/25 text-white hover:bg-white/8 hover:text-white h-12 px-7 text-[15px] bg-transparent rounded-lg"
            >
              <Link href="/pricing">Request Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-20 bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Our approach
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-4">
            Support that starts with clarity
          </h2>
          <p className="text-[#4B5B6B] leading-relaxed text-base">
            We do not start by pushing a new stack just to sell more software. We start by understanding your current environment, your current costs, your support gaps, and the areas where better structure, cleaner tools, and stronger controls can make the biggest difference.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-5 max-w-5xl mx-auto">
            {content.services.map((svc) => {
              const Icon = iconMap[svc.id] || Zap;
              const detail = serviceDetails[svc.id];
              return (
                <div
                  key={svc.id}
                  className="flex flex-col md:flex-row gap-7 items-start bg-white p-7 md:p-10 rounded-2xl border border-[#D7E1EA] shadow-sm"
                  data-testid={`service-detail-${svc.id}`}
                >
                  <div className="w-12 h-12 bg-[#DCEAF7] rounded-xl flex items-center justify-center shrink-0 text-[#1F5E95]">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-3">{svc.name}</h3>
                    <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                      {detail.copy}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detail.outcomes.map((outcome, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1F5E95] bg-[#DCEAF7] rounded-lg px-3 py-1.5"
                        >
                          <CheckCircle2 size={13} className="flex-shrink-0" />
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What clients gain */}
      <section className="py-16 md:py-20 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />
                Outcomes
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                What clients gain
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                "Clearer understanding of current IT spend",
                "Fewer overlapping tools and subscriptions",
                "Simpler support model",
                "Cleaner Microsoft 365 administration",
                "Stronger onboarding and offboarding controls",
                "Better support for compliance-conscious operations",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/75 font-medium">
                  <CheckCircle2 size={15} className="text-[#60B8F0] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTABand
        title="Not sure which service comes first?"
        subtitle="Start with a free cost analysis. We'll review your current stack, identify overlap and friction, and help prioritize the next step."
        buttons={[
          { label: "Book a Free Cost Analysis", href: "/contact", primary: true },
        ]}
      />
    </div>
  );
}
