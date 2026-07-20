"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/brand/site";

const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "What's Included", href: "/#whats-included" },
  { label: "$99 Refresh", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 flex items-center h-16 gap-4">
        <BrandLogo />

        <nav className="hidden md:flex items-center gap-5 ml-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={siteConfig.mainSiteUrl}
            className="text-sm font-medium text-white/55 hover:text-white transition-colors whitespace-nowrap"
            target="_blank"
            rel="noopener noreferrer"
          >
            Main site
          </a>
          <ButtonLink href="/#mockup" size="sm" variant="gold" className="ml-1 whitespace-nowrap">
            Preview My Homepage
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 -mr-1 text-white/80 hover:text-white rounded-md transition-colors ml-auto"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10 px-4 pt-3 pb-5 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-white/80 hover:text-white py-3 px-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={siteConfig.mainSiteUrl}
            className="text-sm font-medium text-white/55 hover:text-white py-3 px-3 rounded-lg hover:bg-white/5 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Main site
          </a>
          <div className="pt-3 mt-2 border-t border-white/10">
            <ButtonLink href="/#mockup" variant="gold" className="w-full" onClick={() => setMobileOpen(false)}>
              Preview My Homepage
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
