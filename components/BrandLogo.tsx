import Link from "next/link";
import { GeoAbbr } from "@/components/GeoAbbr";
import { siteConfig } from "@/lib/brand/site";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  /** Show AI Visibility + GEO under the brand name */
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
  return (
    <Link
      href={href}
      className={cn("group flex min-w-0 flex-shrink-0 items-center gap-3", className)}
    >
      <LogoMark />
      <div className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "whitespace-nowrap font-heading text-[15px] font-semibold tracking-tight transition-colors",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {siteConfig.name}
        </span>
        {variant === "geo" ? (
          <span
            className={cn(
              "mt-1 whitespace-nowrap font-mono text-[10px] font-medium tracking-[0.04em]",
              onDark ? "text-on-dark" : "text-muted",
            )}
          >
            {siteConfig.tagline} · <GeoAbbr />
          </span>
        ) : (
          <span
            className={cn(
              "mt-1 whitespace-nowrap font-mono text-[10px] font-medium tracking-[0.04em]",
              onDark ? "text-on-dark" : "text-muted",
            )}
          >
            {siteConfig.serviceArea}
          </span>
        )}
      </div>
    </Link>
  );
}
