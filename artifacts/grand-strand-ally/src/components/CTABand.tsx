import { Link } from "wouter";
import { Button } from "./ui/button";

export function CTABand({
  title,
  buttons,
}: {
  title: string;
  buttons?: { label: string; href: string; primary?: boolean }[];
}) {
  return (
    <section className="py-20 md:py-28 bg-[#0E2F54] text-white text-center">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold max-w-2xl mx-auto mb-8 leading-tight">
          {title}
        </h2>
        {buttons && buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {buttons.map((btn, i) => (
              <Button
                key={i}
                asChild
                className={
                  btn.primary
                    ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-11 px-6 text-sm rounded-md border-0"
                    : "bg-transparent border border-white/25 text-white hover:bg-white/8 font-semibold h-11 px-6 text-sm rounded-md"
                }
                data-testid={`cta-button-${i}`}
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
