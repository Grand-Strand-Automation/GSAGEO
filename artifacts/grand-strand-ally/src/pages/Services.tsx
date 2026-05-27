import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { SectionHeading } from "@/components/SectionHeading";
import { Headset, Cloud, Wifi, Shield, Database, Zap, CheckCircle2 } from "lucide-react";

const iconMap: Record<string, any> = {
  "managed-it": Headset,
  "microsoft-365": Cloud,
  "network-wifi": Wifi,
  "cybersecurity": Shield,
  "backup-recovery": Database,
  "workflow-automation": Zap
};

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary text-white pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6">
            Services built for business.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Practical, reliable IT solutions that keep your team working without interruption. No unnecessary complexity.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-16 max-w-5xl mx-auto">
            {content.services.map((svc) => {
              const Icon = iconMap[svc.id] || Zap;
              return (
                <div key={svc.id} className="flex flex-col md:flex-row gap-8 items-start bg-background p-8 md:p-12 rounded-3xl border border-border">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center shrink-0 text-accent">
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">{svc.name}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {svc.fullDescription}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Proactive issue resolution",
                        "Clear, plain-English support",
                        "Fast response times",
                        "Security built-in"
                      ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-primary font-medium">
                          <CheckCircle2 size={18} className="text-accent" />
                          <span>{benefit}</span>
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

      <CTABand 
        title="Ready for IT support that actually supports you?" 
        buttons={[
          { label: "Book a Free IT Review", href: "/contact", primary: true }
        ]}
      />
    </div>
  );
}
