import { Link } from "wouter";
import { CheckCircle2, MapPin, DollarSign, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
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
      <section className="bg-[#0E2F54] text-white pt-32 pb-0 md:pt-40 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center pb-20 md:pb-28">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-8 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            Grand Strand Ally
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-extrabold italic max-w-4xl leading-[1.05] mb-5 tracking-tight">
            {content.hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-4 leading-relaxed">
            {content.hero.subheadline}
          </p>
          <p className="text-base text-white/55 max-w-2xl mb-10 leading-relaxed">
            {content.hero.supportingCopy}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <Button
              asChild
              className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-[15px] rounded-lg border-0 w-full sm:w-auto"
              data-testid="hero-primary-cta"
            >
              <Link href="/contact">{content.hero.primaryButton} →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/25 text-white hover:bg-white/8 hover:text-white h-12 px-7 text-[15px] w-full sm:w-auto bg-transparent rounded-lg"
              data-testid="hero-secondary-cta"
            >
              <Link href="/services">{content.hero.secondaryButton}</Link>
            </Button>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative z-10 border-t border-white/10 bg-[#0A2440]/70 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {[
                { icon: MapPin, label: "Local to the Grand Strand" },
                { icon: DollarSign, label: "Clear monthly pricing" },
                { icon: ShieldCheck, label: "Compliance-minded IT support" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-center gap-3 py-5 sm:px-10 text-sm text-white/70 font-medium"
                >
                  <Icon size={16} className="text-[#60B8F0] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Problems ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#0E2F54]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-24">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />
                Why businesses call us
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold italic text-white mb-5 leading-tight">
                {content.problems.heading}
              </h2>
              <p className="text-[15px] text-white/60 leading-relaxed mb-7">
                {content.problems.intro}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white border border-white/20 hover:border-white/35 rounded-lg px-4 py-2.5 transition-all"
              >
                Book a free cost analysis <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {content.problems.cards.map((prob, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4 hover:bg-white/8 transition-colors duration-200"
                  data-testid={`problem-card-${i}`}
                >
                  <div className="w-9 h-9 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle size={17} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-heading font-bold text-white mb-1.5">{prob.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{prob.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Services ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            label="What we do"
            title={content.servicesIntro.heading}
            description={content.servicesIntro.copy}
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
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
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors"
            >
              See all services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Who We Help ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeading
                label="Who we help"
                title={content.whoWeHelp.heading}
                description={content.whoWeHelp.copy}
              />
              <ul className="space-y-3 mt-2">
                {content.whoWeHelp.bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="text-[#1F5E95] shrink-0 mt-0.5" size={17} />
                    <span className="text-[#0E2F54] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 bg-[#0E2F54] hover:bg-[#0A2440] text-white h-12 px-6 text-sm font-semibold rounded-lg"
              >
                <Link href="/contact">Book a free cost analysis →</Link>
              </Button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#D7E1EA] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"
                alt="Professional office environment"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── How We Work ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            label="Our process"
            title={content.howWeWork.heading}
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-7 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-[#D7E1EA]" />
            {content.howWeWork.steps.map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-14 h-14 bg-white border border-[#D7E1EA] text-[#1F5E95] font-heading font-bold text-base rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm relative z-10">
                  {item.step}
                </div>
                <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-2">{item.title}</h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 max-w-xl mx-auto">
            <p className="text-sm text-[#4B5B6B] border border-[#D7E1EA] rounded-xl py-4 px-6 bg-white">
              No forced replacements &nbsp;·&nbsp; No unnecessary complexity &nbsp;·&nbsp; No long-term lock-in
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Grand Strand Ally ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />
              Why choose us
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold italic text-white">
              {content.whyUs.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {content.whyUs.cards.map((reason, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/8 rounded-xl p-6 hover:bg-white/8 transition-colors duration-200"
                data-testid={`why-card-${i}`}
              >
                <h3 className="text-[15px] font-heading font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Philosophy ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeading
                label="Pricing"
                title={content.pricingPhilosophy.heading}
                description={content.pricingPhilosophy.copy}
              />
              <p className="text-sm text-[#4B5B6B] leading-relaxed mb-7 -mt-2">
                {content.pricingPhilosophy.supportingCopy}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold h-12 px-6 text-sm rounded-lg"
                  data-testid="pricing-cta-button"
                >
                  <Link href="/contact">Book a Free Cost Analysis →</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#D7E1EA] text-[#0E2F54] hover:bg-[#DCEAF7] h-12 px-6 text-sm rounded-lg font-semibold"
                >
                  <Link href="/pricing">Request Pricing</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Cost analysis before any commitment",
                  desc: "We review your current stack and spending before recommending a single change.",
                },
                {
                  label: "Eliminate what you don't need",
                  desc: "Duplicate tools, unused licenses, and overlapping vendors add up. We find them.",
                },
                {
                  label: "Flat monthly support pricing",
                  desc: "No mystery charges. What we scope is what you pay — month to month.",
                },
                {
                  label: "Compliance factored in from day one",
                  desc: "Access controls, documentation, and user lifecycle management are built into our standard process.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#D7E1EA] rounded-xl p-5 flex items-start gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-[#1F5E95] flex-shrink-0 mt-2" />
                  <div>
                    <div className="text-sm font-heading font-bold text-[#0E2F54] mb-0.5">{item.label}</div>
                    <div className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
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
        title={content.finalCta.headline}
        subtitle={content.finalCta.copy}
        buttons={[
          { label: "Book a Free Cost Analysis", href: "/contact", primary: true },
          { label: "Request Pricing", href: "/pricing", primary: false },
        ]}
      />
    </div>
  );
}
