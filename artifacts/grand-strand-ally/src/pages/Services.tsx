import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { SectionHeading } from "@/components/SectionHeading";
import { Headset, Cloud, Wifi, Shield, Database, Zap, CheckCircle2, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "managed-it": Headset,
  "microsoft-365": Cloud,
  "network-wifi": Wifi,
  cybersecurity: Shield,
  "backup-recovery": Database,
  "workflow-automation": Zap,
};

const serviceBenefits: Record<string, string[]> = {
  "managed-it": ["Proactive monitoring & alerting", "Fast help desk response", "Regular maintenance & updates", "Security built-in by default"],
  "microsoft-365": ["License procurement & setup", "Email, Teams & SharePoint config", "User training & adoption support", "Ongoing license management"],
  "network-wifi": ["Wired & wireless design", "Secure remote access (VPN)", "Network performance monitoring", "Vendor coordination"],
  cybersecurity: ["Endpoint detection & response", "Multi-factor authentication", "Email security & filtering", "Staff security awareness"],
  "backup-recovery": ["Automated daily backups", "Tested recovery procedures", "Cloud & local redundancy", "Business continuity planning"],
  "workflow-automation": ["New hire account setup", "Departure cleanup & offboarding", "Microsoft 365 workflow automation", "Repetitive task reduction"],
};

export default function Services() {
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
            What we offer
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold italic mb-5 leading-[1.05]">
            Services built for business.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            Practical, reliable IT that keeps your team working. No unnecessary complexity, no jargon — just support that works.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-6 max-w-5xl mx-auto">
            {content.services.map((svc) => {
              const Icon = iconMap[svc.id] || Zap;
              const benefits = serviceBenefits[svc.id] || [];
              return (
                <div
                  key={svc.id}
                  className="flex flex-col md:flex-row gap-7 items-start bg-[#F7F5F1] p-7 md:p-10 rounded-2xl border border-[#D7E1EA]"
                  data-testid={`service-detail-${svc.id}`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-[#D7E1EA] flex items-center justify-center shrink-0 text-[#1F5E95]">
                    <Icon size={23} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-[#0E2F54] mb-3">{svc.name}</h3>
                    <p className="text-[#4B5B6B] leading-relaxed mb-6 text-base">
                      {svc.fullDescription}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-[#0E2F54] font-medium">
                          <CheckCircle2 size={15} className="text-[#1F5E95] flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
            {[
              { stat: "1 Partner", desc: "One accountable IT contact for all your needs — no more vendor runaround." },
              { stat: "Same Day", desc: "Most support requests addressed the same business day they come in." },
              { stat: "No Lock-in", desc: "Month-to-month agreements. Stay because the service is good, not because you're stuck." },
            ].map((item, i) => (
              <div key={i} className="p-6">
                <div className="text-2xl font-heading font-bold text-white mb-2">{item.stat}</div>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Ready for IT support that actually supports you?"
        subtitle="Book a free review and we'll assess your setup, no strings attached."
        buttons={[
          { label: "Book a Free IT Review", href: "/contact", primary: true },
          { label: "See Pricing", href: "/pricing", primary: false },
        ]}
      />
    </div>
  );
}
