import { Link } from "wouter";
import { Button } from "./ui/button";

export function CTABand({
  title,
  subtitle,
  buttons,
}: {
  title: string;
  subtitle?: string;
  buttons?: { label: string; href: string; primary?: boolean }[];
}) {
  return (
    <section className="py-24 md:py-32 bg-[#0E2F54] text-white text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold max-w-3xl mx-auto mb-4 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-white/65 max-w-xl mx-auto mb-8">{subtitle}</p>
        )}
        {buttons && buttons.length > 0 && (
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 ${subtitle ? "" : "mt-8"}`}>
            {buttons.map((btn, i) => (
              <Button
                key={i}
                asChild
                className={
                  btn.primary
                    ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 text-sm rounded-lg border-0 w-full sm:w-auto"
                    : "bg-transparent border border-white/25 text-white hover:bg-white/8 font-semibold h-12 px-7 text-sm rounded-lg w-full sm:w-auto"
                }
                data-testid={`cta-button-${i}`}
              >
                <Link href={btn.href}>{btn.label}{btn.primary ? " →" : ""}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
