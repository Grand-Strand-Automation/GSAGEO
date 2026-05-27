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
          "text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-1.5",
          centered && "justify-center",
          light ? "text-white/50" : "text-[#1F5E95]"
        )}>
          <span className={cn(light ? "text-white/40" : "text-[#1F5E95]")}>●</span>
          {label}
        </span>
      )}
      <h2 className={cn(
        "text-3xl md:text-4xl font-heading font-bold max-w-3xl leading-tight",
        light ? "text-white" : "text-[#0E2F54]"
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "text-base md:text-lg max-w-2xl leading-relaxed",
          light ? "text-white/70" : "text-[#4B5B6B]"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
