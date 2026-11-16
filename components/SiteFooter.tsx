import Link from "next/link";
import { siteConfig } from "@/lib/brand/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white pt-16 pb-8">
      <div className="container-site">
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="space-y-4 md:col-span-5">
            <p className="font-heading text-lg font-semibold text-white">{siteConfig.name}</p>
            <p className="max-w-md text-sm leading-relaxed text-on-dark">
              AI visibility support for service businesses. Free assessment first, then month-to-month.
            </p>
            <p className="pt-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent-on-dark">
              Grand Strand · Myrtle Beach, SC
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-on-dark">
              GEO
            </h3>
            <ul className="space-y-3">
              {[
                { label: "How it works", href: "/#how" },
                { label: "Sample report", href: "/sample-report" },
                { label: "Pricing", href: "/#pricing" },
                { label: "FAQ", href: "/#faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-on-dark transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-on-dark">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/audit" className="text-sm font-semibold text-accent-on-dark transition-colors hover:text-white">
                  Free assessment →
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm text-on-dark transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-dark-raised-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-on-dark/80">
            © 2026 {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-on-dark/70">
            Month-to-month · Cancel anytime · Grand Strand-based
          </p>
        </div>
      </div>
    </footer>
  );
}
