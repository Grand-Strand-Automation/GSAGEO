import { cn } from "@/lib/utils";

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28", className)}>
      <div className="mb-6 md:mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue mb-2">
          {eyebrow}
        </p>
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm md:text-[15px] text-brand-muted leading-relaxed max-w-3xl">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
