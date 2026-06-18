import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  description,
  centered = false,
  light = false,
  className,
}: {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-10 md:mb-12",
        centered && "text-center items-center",
        className,
      )}
    >
      {label && (
        <span
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5",
            centered && "justify-center",
            light ? "text-white/55" : "text-brand-blue",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full inline-block flex-shrink-0",
              light ? "bg-brand-sky/80" : "bg-brand-blue",
            )}
          />
          {label}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-heading font-bold max-w-3xl leading-[1.15]",
          light ? "text-white" : "text-brand-navy",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base md:text-lg max-w-2xl leading-relaxed",
            light ? "text-white/65" : "text-brand-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
