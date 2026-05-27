import { Link } from "wouter";
import { CheckCircle2, MapPin, DollarSign, CalendarOff, AlertCircle } from "lucide-react";
import { content } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-0 md:pt-36 relative overflow-hidden">
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center pb-16 md:pb-24">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-8 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            Grand Strand Ally
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold max-w-3xl leading-[1.1] mb-6 tracking-tight">
            {content.hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-white/65 max-w-xl mb-10 leading-relaxed">
            {content.hero.subtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full sm:w-auto">
            <Button
              asChild
              className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-11 px-6 text-sm rounded-md border-0 w-full sm:w-auto"
              data-testid="hero-primary-cta"
            >
              <Link href="/contact">{content.hero.primaryButton} →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/8 hover:text-white h-11 px-6 text-sm w-full sm:w-auto bg-transparent"
              data-testid="hero-secondary-cta"
            >
              <Link href="/services">{content.hero.secondaryButton}</Link>
            </Button>
          </div>

          <p className="text-xs text-white/40 mb-12">
            Built for Grand Strand businesses. Clear pricing. Local support.
          </p>
        </div>

        {/* Trust bullets — anchored at hero bottom */}
        <div className="relative z-10 border-t border-white/10 bg-[#0A2440]/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {[
                { icon: MapPin, label: "Local to the Grand Strand" },
                { icon: DollarSign, label: "Clear monthly pricing" },
                { icon: CalendarOff, label: "No long-term contracts" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 py-4 sm:py-5 px-8 text-sm text-white/70 font-medium"
                >
                  <Icon size={15} className="text-[#1F5E95] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Problems ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                label="Why businesses call us"
                title="IT shouldn't be this complicated."
                description="Most small businesses in the Grand Strand aren't failing because of bad luck — they're held back by tech problems that should have been fixed a long time ago."
              />
            </div>
            <div className="space-y-4">
              {content.problems.map((prob, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#D7E1EA] rounded-xl p-6 flex gap-4 hover:shadow-sm transition-shadow"
                  data-testid={`problem-card-${i}`}
                >
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle size={18} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#0E2F54] mb-1.5">{prob.title}</h3>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{prob.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Services ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            label="What we do"
            title="Everything your business needs to run reliably."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {content.services.map((svc) => (
              <ServiceCard
                key={svc.id}
                name={svc.name}
                description={svc.shortDescription}
                icon={svc.icon}
                href="/services"
                data-testid={`service-card-${svc.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Help ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#DCEAF7]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                label="Who we help"
                title="Built for businesses that want to focus on their work, not their tech."
                description="We partner with professional offices, legal and financial services firms, and growing teams across the Grand Strand who want reliable, secure IT without the enterprise overhead."
              />
              <ul className="space-y-3 mt-6">
                {[
                  "Small to medium businesses (5–100 employees)",
                  "Professional offices needing compliance & security",
                  "Growing teams without a dedicated IT person",
                  "Companies tired of unresponsive IT vendors",
                  "Businesses that want a single point of accountability",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="text-[#1F5E95] shrink-0 mt-0.5" size={17} />
                    <span className="text-[#0E2F54] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#D7E1EA] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"
                alt="Professional office environment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── How We Work ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            label="Our process"
            title="How we work together."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-7 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-[#D7E1EA]" />
            {[
              { step: "01", title: "Review", desc: "We audit your current setup — devices, accounts, network, and security — to find risks and friction." },
              { step: "02", title: "Fix", desc: "We resolve the most urgent issues first, so you see meaningful improvement quickly." },
              { step: "03", title: "Standardize", desc: "We build reliable, secure foundations using tools your team already uses where possible." },
              { step: "04", title: "Automate", desc: "We automate repetitive admin work — like user onboarding — so your team isn't doing it manually." },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-14 h-14 bg-white border border-[#D7E1EA] text-[#1F5E95] font-heading font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm relative z-10">
                  {item.step}
                </div>
                <h3 className="text-base font-heading font-bold text-[#0E2F54] mb-2">{item.title}</h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 max-w-xl mx-auto">
            <p className="text-sm text-[#4B5B6B] border border-[#D7E1EA] rounded-xl py-4 px-6 bg-[#F7F5F1]">
              No forced platform replacements &nbsp;·&nbsp; No unnecessary complexity &nbsp;·&nbsp; No long-term lock-in
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Grand Strand Ally ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />
              Why choose us
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              A different kind of IT partner.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.whyUs.map((reason, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/8 rounded-xl p-6 text-left hover:bg-white/8 transition-colors duration-200"
                data-testid={`why-card-${i}`}
              >
                <h3 className="text-base font-heading font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Philosophy ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeading
              label="Pricing"
              title="Straightforward pricing. No surprises."
              description="Monthly support plans and scoped project pricing based on your team size, devices, locations, and needs. No mystery charges, no bloated bundles, no lock-in."
              centered
            />
            <Button
              asChild
              className="bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-11 px-6 text-sm rounded-md mt-2"
              data-testid="pricing-cta-button"
            >
              <Link href="/pricing">Request Pricing →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            label="FAQ"
            title="Common questions."
            centered
          />
          <div className="max-w-2xl mx-auto mt-10">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <CTABand
        title="Get IT support that's easier to understand and easier to trust."
        buttons={[
          { label: "Book a Free IT Review", href: "/contact", primary: true },
          { label: "Request Pricing", href: "/pricing", primary: false },
        ]}
      />
    </div>
  );
}
