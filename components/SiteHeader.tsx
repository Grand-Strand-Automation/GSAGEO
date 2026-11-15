"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ButtonLink } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "How it works", href: "/#how" },
  { label: "What's included", href: "/#included" },
  { label: "Sample report", href: "/sample-report" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="container-site flex h-16 items-center gap-4">
        <BrandLogo onDark={false} />

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-body transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink href="/audit" size="sm" variant="primary" className="ml-1 whitespace-nowrap min-h-11">
            Free assessment
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="ml-auto rounded-control p-2 text-ink lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-5 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-control px-3 py-3 text-sm font-medium text-body hover:bg-surface-alt hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-3">
              <ButtonLink
                href="/audit"
                variant="primary"
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Free assessment
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
