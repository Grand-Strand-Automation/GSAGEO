import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  label,
  title,
  description,
  centered = false,
  light = false,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-10",
        centered && "text-center items-center",
        className
      )}
      {...props}
    >
      {label && (
        <span className={cn(
          "text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5",
          centered && "justify-center",
          light ? "text-white/55" : "text-[#1F5E95]"
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full inline-block flex-shrink-0",
            light ? "bg-white/40" : "bg-[#1F5E95]"
          )} />
          {label}
        </span>
      )}
      <h2 className={cn(
        "text-3xl md:text-4xl font-heading font-bold max-w-3xl leading-[1.15]",
        light ? "text-white" : "text-[#0E2F54]"
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "text-base md:text-lg max-w-2xl leading-relaxed",
          light ? "text-white/65" : "text-[#4B5B6B]"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
