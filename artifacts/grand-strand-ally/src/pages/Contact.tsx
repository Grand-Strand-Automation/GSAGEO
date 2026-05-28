import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            Understand what you're paying for and where your IT can be simplified.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            If you are unsure whether your current tools overlap, whether your support model makes sense, or whether your compliance-related controls are as clean as they should be, we can help you sort it out.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#D7E1EA]">
            {[
              "No commitment required",
              "Response within 1 business day",
              "No pressure, no hard sell",
            ].map((label) => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-4 sm:px-8 text-sm text-[#4B5B6B] font-medium">
                <CheckCircle2 size={14} className="text-[#1F5E95] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12 md:py-14 bg-[#F7F5F1] border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-[#0E2F54] mb-3">
            A no-pressure review of your current stack
          </h2>
          <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
            The first conversation is meant to give you clarity. We can talk through your current support setup, Microsoft 365 environment, overlapping vendors or tools, onboarding and offboarding process, cost concerns, and compliance-minded priorities.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Contact info */}
              <div className="bg-white rounded-xl border border-[#D7E1EA] p-5 space-y-4 shadow-sm">
                {[
                  { Icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                  { Icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/-/g, "")}` },
                  { Icon: MapPin, label: "Service Area", value: siteConfig.serviceArea, href: null },
                  { Icon: Clock, label: "Response Time", value: "Within 1 business day", href: null },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#DCEAF7] flex items-center justify-center text-[#1F5E95] flex-shrink-0">
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#4B5B6B] mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-[#0E2F54] font-medium hover:text-[#1F5E95] transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm text-[#0E2F54] font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* What to expect */}
              <div className="bg-white rounded-xl border border-[#D7E1EA] p-5 shadow-sm">
                <p className="text-sm font-bold text-[#0E2F54] mb-3">What to expect</p>
                <ul className="space-y-2.5">
                  {[
                    "A practical conversation, not a hard sell",
                    "A review of current tools, support, and costs",
                    "Discussion of overlap, support gaps, and risk",
                    "Guidance on where simplification may help",
                    "Follow-up focused on fit, scope, and next steps",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5B6B]">
                      <CheckCircle2 size={13} className="text-[#1F5E95] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reassurance */}
              <div className="bg-white rounded-xl border border-[#D7E1EA] p-5 shadow-sm">
                <p className="text-sm font-bold text-[#0E2F54] mb-2">
                  You don't need to have everything figured out first.
                </p>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">
                  Many businesses reach out because something feels messy, expensive, or harder to manage than it should be. That is enough to start.
                </p>
              </div>

              <p className="text-xs text-[#4B5B6B] leading-relaxed px-1">
                Grand Strand Ally works with small and medium businesses across the Grand Strand and Myrtle Beach area.
              </p>

            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D7E1EA] p-7 md:p-8 shadow-sm">
              <h2 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
                Tell us what you want us to review
              </h2>
              <p className="text-sm text-[#4B5B6B] mb-7 leading-relaxed">
                Share what you're working with — tools, team size, concerns. We'll follow up within one business day.
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Service area note */}
      <section className="py-10 bg-[#0A2440] text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-xl">
          <p className="text-white/55 text-sm leading-relaxed mb-2">
            Grand Strand Ally serves small and medium businesses across the Grand Strand and Myrtle Beach area.
          </p>
          <p className="text-white/45 text-[13px]">
            Have a quick question before filling out the form?{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-[#60B8F0] hover:text-white transition-colors font-medium">
              Email us directly
            </a>
            {" "}or call{" "}
            <a href={`tel:${siteConfig.phone.replace(/-/g, "")}`} className="text-[#60B8F0] hover:text-white transition-colors font-medium">
              {siteConfig.phone}
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
