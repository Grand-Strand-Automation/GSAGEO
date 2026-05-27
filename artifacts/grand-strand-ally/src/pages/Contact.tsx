import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="bg-primary text-white pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6">
            Let's talk about your IT.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Serving businesses in the {siteConfig.serviceArea}. Fill out the form below and we'll be in touch within 1 business day.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">Get in Touch</h3>
                <p className="text-muted-foreground">No commitment required, just a conversation to see if we're a good fit.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Email</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-muted-foreground hover:text-accent transition-colors">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Phone</p>
                    <a href={`tel:${siteConfig.phone.replace(/-/g, "")}`} className="text-muted-foreground hover:text-accent transition-colors">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Service Area</p>
                    <p className="text-muted-foreground">{siteConfig.serviceArea}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Response Time</p>
                    <p className="text-muted-foreground">Within 1 business day</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
