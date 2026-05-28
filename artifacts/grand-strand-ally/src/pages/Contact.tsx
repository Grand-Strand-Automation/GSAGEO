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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold italic mb-5 leading-[1.05]">
            Understand what you're paying for and where your IT can be simplified.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            If you are unsure whether your current tools overlap, whether your support model makes sense, or whether your compliance-related controls are as clean as they should be, we can help you sort it out.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-14 bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            No pressure
          </span>
          <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-3">
            A no-pressure review of your current stack
          </h2>
          <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
            The first conversation is meant to give you clarity. We can talk through your current support setup, Microsoft 365 environment, overlapping vendors or tools, onboarding and offboarding process, cost concerns, and compliance-minded priorities.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">

            {/* Sidebar */}
            <div className="space-y-7">

              {/* Contact info */}
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

              {/* What to expect */}
              <div className="bg-white rounded-xl border border-[#D7E1EA] p-5">
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
                      <CheckCircle2 size={14} className="text-[#1F5E95] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reassurance */}
              <div className="bg-white rounded-xl border border-[#D7E1EA] p-5">
                <p className="text-sm font-bold text-[#0E2F54] mb-2">
                  You do not need to have everything figured out first.
                </p>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">
                  Many businesses reach out because they know something feels messy, expensive, or harder to manage than it should be. That is enough to start. We can help you review the current environment, identify what matters, and talk through the best next step.
                </p>
              </div>

              {/* Service area note */}
              <p className="text-xs text-[#4B5B6B] leading-relaxed">
                Grand Strand Ally works with small and medium businesses across the Grand Strand and Myrtle Beach area.
              </p>

            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D7E1EA] p-8 shadow-sm">
              <h2 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
                Tell us what you want us to review
              </h2>
              <p className="text-sm text-[#4B5B6B] mb-7 leading-relaxed">
                Fill out the form below and we'll follow up within one business day.
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Final mini CTA */}
      <section className="py-16 bg-[#0A2440] text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold italic text-white mb-3">
            Start with clarity.
          </h2>
          <p className="text-white/65 text-[15px] leading-relaxed mb-7">
            Book a free cost analysis and get a better view of your current IT spend, support model, and opportunities to simplify.
          </p>
          <a
            href="mailto:hello@gsally.com"
            className="inline-flex items-center justify-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg transition-colors"
          >
            Book a Free Cost Analysis →
          </a>
        </div>
      </section>

    </div>
  );
}
