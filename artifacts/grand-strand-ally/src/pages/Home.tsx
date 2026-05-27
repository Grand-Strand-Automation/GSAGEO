import { Link } from "wouter";
import { CheckCircle2, MapPin, DollarSign, CalendarOff } from "lucide-react";
import { content } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <section className="bg-primary text-white pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold max-w-4xl leading-tight mb-6 tracking-tight">
            {content.hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mb-10 leading-relaxed font-light">
            {content.hero.subtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white border-none h-14 px-8 text-lg w-full sm:w-auto">
              <Link href="/contact">{content.hero.primaryButton}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-lg w-full sm:w-auto bg-white/5 backdrop-blur-sm">
              <Link href="/services">{content.hero.secondaryButton}</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm md:text-base text-white/70 font-medium">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-accent" />
              <span>Local to the Grand Strand</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-accent" />
              <span>Clear monthly pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarOff size={18} className="text-accent" />
              <span>No long-term contracts</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problems */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            label="The Challenge" 
            title="IT shouldn't be this hard." 
            centered 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            {content.problems.map((prob, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X size={24} />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-3">{prob.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{prob.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Services */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            label="What we do" 
            title="Everything you need to keep your business running." 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
            {content.services.map((svc) => (
              <ServiceCard 
                key={svc.id} 
                name={svc.name} 
                description={svc.shortDescription} 
                icon={svc.icon} 
                href="/services" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who We Help */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                label="Who we help" 
                title="Built for local businesses that want to focus on their work, not their tech." 
                description="We partner with professional offices, legal firms, financial services, and growing teams across the Grand Strand who need reliable, secure IT without the enterprise price tag."
              />
              <ul className="space-y-4 mt-8">
                {[
                  "Small to medium businesses (5-100 employees)",
                  "Professional offices needing compliance & security",
                  "Businesses without a dedicated in-house IT team",
                  "Companies tired of unresponsive IT vendors"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent shrink-0 mt-1" size={20} />
                    <span className="text-primary font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-border h-full min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern office collaborative space" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. How We Work */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            label="Our Process" 
            title="How we work together." 
            centered 
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-border -z-10"></div>
            {[
              { title: "Review", desc: "We audit your current setup to find risks and friction." },
              { title: "Fix", desc: "We resolve the biggest, most urgent issues first." },
              { title: "Standardize", desc: "We implement secure, reliable foundations." },
              { title: "Automate", desc: "We automate repetitive admin tasks to save time." }
            ].map((step, i) => (
              <div key={i} className="text-center relative bg-white px-2">
                <div className="w-16 h-16 bg-white border-2 border-border text-primary font-heading font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  {i + 1}
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16 max-w-2xl mx-auto p-6 bg-background rounded-xl border border-border">
            <p className="text-muted-foreground font-medium">We believe in practical solutions: no forced platform replacements, no unnecessary complexity, no long-term lock-in.</p>
          </div>
        </div>
      </section>

      {/* 6. Why Grand Strand Ally */}
      <section className="py-20 md:py-28 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent mb-4 block">
            Why choose us
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-16">
            A different kind of IT partner.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.whyUs.map((reason, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-left hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-xl font-heading font-bold mb-3">{reason.title}</h3>
                <p className="text-white/70 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Pricing Philosophy */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading 
              label="Pricing" 
              title="Transparent pricing, no surprises." 
              centered 
              description="Straightforward monthly support plans and scoped project pricing based on your team size, devices, locations, and service needs. No mystery charges, no bloated bundles, no lock-in."
            />
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white mt-8 h-14 px-8 text-lg">
              <Link href="/pricing">Request Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            label="FAQ" 
            title="Common questions." 
            centered 
          />
          <div className="max-w-3xl mx-auto mt-12">
            <FAQ />
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <CTABand 
        title="Get IT support that's easier to understand and easier to trust." 
        buttons={[
          { label: "Book a Free IT Review", href: "/contact", primary: true },
          { label: "Request Pricing", href: "/pricing", primary: false }
        ]}
      />
    </div>
  );
}

function X({size, className}: {size?: number, className?: string}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
