import { HeroOverlay } from "@/components/HeroOverlay";
import { ButtonLink } from "@/components/ui/Button";

type Button = { label: string; href: string; primary?: boolean };

export function CTABand({
  title,
  subtitle,
  buttons,
}: {
  title: string;
  subtitle: string;
  buttons: Button[];
}) {
  return (
    <section className="relative overflow-hidden bg-brand-hero text-white py-16 md:py-20">
      <HeroOverlay />
      <div className="container px-4 md:px-6 text-center max-w-2xl relative z-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">{title}</h2>
        <p className="text-white/65 mb-8 leading-relaxed">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {buttons.map((btn) => (
            <ButtonLink
              key={btn.href}
              href={btn.href}
              variant={btn.primary ? "primary" : "secondary"}
              size="md"
            >
              {btn.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
