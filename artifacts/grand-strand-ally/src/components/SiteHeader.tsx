import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Services", href: siteConfig.links.services },
    { label: "Pricing", href: siteConfig.links.pricing },
    { label: "Contact", href: siteConfig.links.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E2F54] border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-14">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Button
            asChild
            size="sm"
            className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold text-sm px-4 h-9 rounded-md border-0"
          >
            <Link href={siteConfig.links.contact} data-testid="nav-cta-button">
              Book a Free IT Review
            </Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-white/80 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A2440] border-t border-white/10 py-4 px-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 py-2.5 px-3 hover:bg-white/5 rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Button asChild className="w-full bg-[#1F5E95] hover:bg-[#1a5080] text-white text-sm">
              <Link href={siteConfig.links.contact}>Book a Free IT Review</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
