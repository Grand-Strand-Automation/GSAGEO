import { Link } from "wouter";
import { Button } from "./ui/button";

export function CTABand({ title, buttons }: { title: string, buttons?: {label: string, href: string, primary?: boolean}[] }) {
  return (
    <section className="py-20 md:py-32 bg-primary text-white text-center">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold max-w-3xl mx-auto mb-10 leading-tight">
          {title}
        </h2>
        {buttons && buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {buttons.map((btn, i) => (
              <Button 
                key={i} 
                asChild 
                size="lg" 
                variant={btn.primary ? "default" : "outline"}
                className={btn.primary ? "bg-accent text-white hover:bg-accent/90 border-transparent h-14 px-8 text-lg" : "border-white text-primary hover:bg-white hover:text-primary bg-white h-14 px-8 text-lg"}
              >
                <Link href={btn.href}>{btn.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
