import { Link } from "wouter";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#0A2440] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-14">

          <div className="col-span-2 md:col-span-1 space-y-4">
            <Logo />
            <p className="text-sm text-white/60 max-w-xs leading-relaxed pt-1">
              {siteConfig.description}
            </p>
            <div className="space-y-2 pt-2 text-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-3">
                {siteConfig.serviceArea}
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-white/60 hover:text-white transition-colors"
              >
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/-/g, "")}`}
                className="block text-white/60 hover:text-white transition-colors"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">Services</h3>
            <ul className="space-y-3">
              {[
                "Managed IT Support",
                "Microsoft 365",
                "Network & Wi-Fi",
                "Cybersecurity",
                "Backup & Recovery",
                "Workflow Automation",
              ].map((svc) => (
                <li key={svc}>
                  <Link
                    href={siteConfig.links.services}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {svc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href={siteConfig.links.home} className="text-sm text-white/60 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.services} className="text-sm text-white/60 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.pricing} className="text-sm text-white/60 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.contact} className="text-sm text-white/60 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href={siteConfig.links.privacy} className="text-sm text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.terms} className="text-sm text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <div className="mt-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-3">Get Started</h3>
              <Link
                href={siteConfig.links.contact}
                className="inline-block text-sm font-semibold text-[#60B8F0] hover:text-white transition-colors"
              >
                Book a free IT review →
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/35">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/35">IT support for Grand Strand businesses</p>
        </div>
      </div>
    </footer>
  );
}
