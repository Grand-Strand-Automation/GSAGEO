import Link from "next/link";

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
    <section className="py-16 md:py-20 bg-[#0E2F54] text-white">
      <div className="container px-4 md:px-6 text-center max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">{title}</h2>
        <p className="text-white/65 mb-8 leading-relaxed">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {buttons.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className={
                btn.primary
                  ? "bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 rounded-lg inline-flex items-center justify-center"
                  : "border border-white/25 text-white hover:bg-white/8 font-semibold h-12 px-7 rounded-lg inline-flex items-center justify-center"
              }
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
