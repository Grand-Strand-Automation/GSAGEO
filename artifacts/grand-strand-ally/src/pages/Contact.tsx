import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#0E2F54] text-white pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Get in touch
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">
            Let's talk about your IT.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-lg mx-auto">
            Serving businesses in the {siteConfig.serviceArea}. Fill out the form below and we'll get back to you within 1 business day.
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
                <h3 className="text-lg font-heading font-bold text-[#0E2F54] mb-1">Get in Touch</h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">No commitment required — just a conversation to see if we're a good fit.</p>
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

              {/* Reassurance note */}
              <div className="bg-white rounded-xl border border-[#D7E1EA] p-5 text-sm text-[#4B5B6B] leading-relaxed">
                <p className="font-semibold text-[#0E2F54] mb-1">No pressure, no obligation.</p>
                We'll review your message, ask a few questions, and give you an honest assessment of what would actually help your business.
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D7E1EA] p-8 shadow-sm">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
