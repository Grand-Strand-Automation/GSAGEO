import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/brand/site";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  /** Show “GEO / AI Visibility” under the brand name instead of location */
  variant?: "geo" | "location";
  /** Invert for light backgrounds */
  onDark?: boolean;
};

export function BrandLogo({
  href = "/",
  className,
  variant = "geo",
  onDark = true,
}: BrandLogoProps) {
  const subline =
    variant === "geo" ? siteConfig.tagline : siteConfig.serviceArea;

  const content = (
    <>
      <Image
        src={siteConfig.logoIconSrc}
        alt={`${siteConfig.name} logo`}
        width={32}
        height={32}
        className="flex-shrink-0 object-contain"
        priority
      />
      <div className="flex flex-col leading-none min-w-0">
        <span
          className={cn(
            "font-heading font-bold text-[13px] tracking-[0.07em] uppercase whitespace-nowrap transition-colors",
            onDark ? "text-white group-hover:text-white/90" : "text-brand-navy group-hover:text-brand-blue",
          )}
        >
          {siteConfig.name}
        </span>
        <span
          className={cn(
            "font-heading font-semibold text-[9px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors mt-0.5",
            onDark ? "text-white/50 group-hover:text-white/40" : "text-brand-muted group-hover:text-brand-blue",
          )}
        >
          {subline}
        </span>
      </div>
    </>
  );

  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5 flex-shrink-0", className)}
    >
      {content}
    </Link>
  );
}
