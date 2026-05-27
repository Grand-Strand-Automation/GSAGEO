import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
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
            Get in touch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold italic mb-5 leading-[1.05]">
            Understand what you're paying for — and where IT can be simpler.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            We'll review your current tools, vendors, and IT costs — no commitment required. Most conversations reveal at least one area where you can save money or reduce risk.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">

            {/* Contact info sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-bold text-[#0E2F54] mb-1">
                  Start with a conversation
                </h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">
                  We review your current IT stack, vendors, and spending — and give you an honest picture of what you have and what you're missing. No sales pressure.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { Icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                  { Icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/-/g, "")}` },
                  { Icon: MapPin, label: "Service Area", value: siteConfig.serviceArea, href: null },
                  { Icon: Clock, label: "Response Time", value: "Within 1 business day", href: null },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#DCEAF7] flex items-center justify-center text-[#1F5E95] flex-shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#4B5B6B] mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-[#0E2F54] font-medium hover:text-[#1F5E95] transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-[#0E2F54] font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#4B5B6B]">
                  What we can review
                </p>
                {[
                  "Current IT tools & subscriptions",
                  "Microsoft 365 licensing & setup",
                  "Overlapping or redundant vendors",
                  "Compliance & access control gaps",
                  "Support model & response quality",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-[#4B5B6B]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-[#D7E1EA] p-5 text-sm text-[#4B5B6B] leading-relaxed">
                <p className="font-semibold text-[#0E2F54] mb-1">No obligation, no pressure.</p>
                We'll look at what you have, tell you what we find, and let you decide if it's worth continuing. If it's not a fit, we'll tell you that too.
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D7E1EA] p-8 shadow-sm">
              <h2 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
                Book a Free Cost Analysis
              </h2>
              <p className="text-sm text-[#4B5B6B] mb-7 leading-relaxed">
                Tell us about your current tools, team size, and any IT concerns. We'll follow up within one business day.
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
