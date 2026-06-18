import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/lib/brand/site";

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-14">
          <div className="md:col-span-5 space-y-4">
            <BrandLogo variant="geo" />
            <p className="text-sm text-white/55 max-w-md leading-relaxed pt-1">
              Practical Generative Engine Optimization for service businesses — structured audits,
              clear deliverables, and a no-pressure approach from the Grand Strand.
            </p>
            <div className="space-y-2 pt-2 text-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
                {siteConfig.serviceArea}
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-white/60 hover:text-white transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">
              GEO
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Overview", href: "/" },
                { label: "Request an Audit", href: "/audit" },
                { label: "Pricing", href: "/#pricing" },
                { label: "FAQ", href: "/#faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">
              Grand Strand Ally
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Main website", href: siteConfig.mainSiteUrl, external: true },
                { label: "All services", href: `${siteConfig.mainSiteUrl}/services`, external: true },
                { label: "Contact", href: `${siteConfig.mainSiteUrl}/contact`, external: true },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/audit"
                className="inline-block text-sm font-semibold text-brand-sky hover:text-white transition-colors"
              >
                Request a GEO Audit →
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/35">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/30 text-center sm:text-right">
            Practical review · Clear deliverables · Grand Strand–based
          </p>
        </div>
      </div>
    </footer>
  );
}
