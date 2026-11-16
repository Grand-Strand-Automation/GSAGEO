import Link from "next/link";
import { siteConfig } from "@/lib/brand/site";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  /** Show “AI Visibility · GEO” under the brand name */
  variant?: "geo" | "location";
  /** Invert for light backgrounds */
  onDark?: boolean;
};

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-ink",
        className,
      )}
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 14.5L7.5 9.5L11 12.5L17 5.5"
          stroke="#5EEAD4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 5.5H17V9.5"
          stroke="#5EEAD4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function BrandLogo({
  href = "/",
  className,
  variant = "geo",
  onDark = false,
}: BrandLogoProps) {
  const subline = variant === "geo" ? "AI Visibility · GEO" : siteConfig.serviceArea;

  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-3 flex-shrink-0", className)}
    >
      <LogoMark />
      <div className="flex flex-col leading-none min-w-0">
        <span
          className={cn(
            "font-heading font-semibold text-[15px] tracking-tight whitespace-nowrap transition-colors",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {siteConfig.name}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] font-medium tracking-[0.04em] whitespace-nowrap mt-1",
            onDark ? "text-on-dark" : "text-muted",
          )}
        >
          {subline}
        </span>
      </div>
    </Link>
  );
}
