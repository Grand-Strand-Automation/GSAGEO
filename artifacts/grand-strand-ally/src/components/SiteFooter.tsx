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
            <p className="text-sm text-white/55 max-w-xs leading-relaxed pt-1">
              Practical information technology support, cost clarity, and compliance-minded systems for small and medium businesses across the Grand Strand.
            </p>
            <div className="space-y-2 pt-2 text-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-3">
                {siteConfig.serviceArea}
              </p>
              <a href={`tel:${siteConfig.phone.replace(/-/g, "")}`} className="block text-white/60 hover:text-white transition-colors font-medium">
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="block text-white/55 hover:text-white transition-colors">
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">Services</h3>
            <ul className="space-y-3">
              {[
                "Managed Information Technology Support",
                "Microsoft 365 Setup and Support",
                "Network and Wi-Fi Management",
                "Cybersecurity and Compliance",
                "Backup and Recovery",
                "Workflow Automation",
              ].map((svc) => (
                <li key={svc}>
                  <Link href={siteConfig.links.services} className="text-sm text-white/55 hover:text-white transition-colors">
                    {svc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Services", href: siteConfig.links.services },
                { label: "Pricing", href: siteConfig.links.pricing },
                { label: "Our Process", href: "/process" },
                { label: "Cost Analysis", href: siteConfig.links.costAnalysis },
                { label: "Contact", href: siteConfig.links.contact },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-sm text-white/55 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/process" className="text-sm text-white/55 hover:text-white transition-colors">
                  How We Work
                </Link>
              </li>
              <li>
                <Link href="/cost-analysis" className="text-sm text-white/55 hover:text-white transition-colors">
                  Free Cost Analysis Tool
                </Link>
              </li>
              <li>
                <Link href="/free-it-cost-analysis" className="text-sm text-white/55 hover:text-white transition-colors">
                  Free Cost Analysis Overview
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-sm text-white/55 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-3">Articles</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/how-much-should-a-small-business-spend-on-it-support" className="text-sm text-white/55 hover:text-white transition-colors">
                    IT Support Cost Guide
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-find-overlapping-it-tools-and-vendors" className="text-sm text-white/55 hover:text-white transition-colors">
                    Finding Tool Overlap
                  </Link>
                </li>
                <li>
                  <Link href="/small-business-offboarding-checklist" className="text-sm text-white/55 hover:text-white transition-colors">
                    Offboarding Checklist
                  </Link>
                </li>
                <li>
                  <Link href="/what-an-it-cost-analysis-should-include" className="text-sm text-white/55 hover:text-white transition-colors">
                    Cost Analysis Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-3">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href={siteConfig.links.privacy} className="text-sm text-white/55 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={siteConfig.links.terms} className="text-sm text-white/55 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-3">Get Started</h3>
              <Link
                href={siteConfig.links.contact}
                className="inline-block text-sm font-semibold text-[#60B8F0] hover:text-white transition-colors"
              >
                Schedule a Free Cost Analysis →
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/35">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/30">Cost clarity · Practical support · Compliance-minded systems</p>
        </div>
      </div>
    </footer>
  );
}
