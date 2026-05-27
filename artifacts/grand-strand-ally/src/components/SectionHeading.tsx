import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({
  label,
  title,
  description,
  centered = false,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-12",
        centered && "text-center items-center",
        className
      )}
      {...props}
    >
      {label && (
        <span className="text-sm font-bold uppercase tracking-wider text-accent">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary max-w-3xl">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
