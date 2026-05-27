import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary text-white pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6">
            Clear, predictable pricing.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Month-to-month agreements. No vendor lock-in. We quote clear scopes before any work starts so you never get a surprise bill.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            label="Support Models" 
            title="Right-sized for your business." 
            centered 
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
            {content.pricingModels.map((model, i) => (
              <div key={i} className="bg-background rounded-3xl p-8 border border-border flex flex-col h-full">
                <h3 className="text-2xl font-heading font-bold text-primary mb-4">{model.name}</h3>
                <p className="text-muted-foreground mb-8 flex-grow">{model.description}</p>
                <div className="bg-white p-4 rounded-xl border border-border text-sm font-medium text-primary text-center mb-8 shadow-sm">
                  Pricing based on your team size and needs — contact us for a quote.
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white h-12">
                  <Link href="/contact">Request a Quote</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                title="What affects pricing?" 
              />
              <ul className="space-y-4">
                {[
                  "Number of active users / employees",
                  "Number of devices (computers, servers)",
                  "Physical office locations",
                  "Microsoft 365 licensing needs",
                  "Specific compliance or security requirements"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent shrink-0 mt-1" size={20} />
                    <span className="text-primary font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-border shadow-md">
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">What's always included</h3>
              <p className="text-muted-foreground mb-6">Every monthly support plan includes the foundational tools to keep you safe and productive.</p>
              <ul className="space-y-3">
                {[
                  "Proactive monitoring & updates",
                  "Endpoint security (Antivirus/EDR)",
                  "Remote help desk support",
                  "Monthly strategic check-ins"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            label="FAQ" 
            title="Pricing Questions" 
            centered 
          />
          <div className="max-w-3xl mx-auto mt-12">
            <FAQ />
          </div>
        </div>
      </section>

      <CTABand 
        title="Ready to get a clear number?" 
        buttons={[
          { label: "Contact Us for Pricing", href: "/contact", primary: true }
        ]}
      />
    </div>
  );
}
