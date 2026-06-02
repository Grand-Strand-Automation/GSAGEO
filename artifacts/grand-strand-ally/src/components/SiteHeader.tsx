import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/site";

const SERVICE_LINKS = [
  { label: "Managed IT Support", href: siteConfig.links.managedItSupport },
  { label: "Microsoft 365 Support", href: siteConfig.links.microsoft365Support },
  { label: "Network and Wi-Fi Management", href: siteConfig.links.networkWifiManagement },
  { label: "Cybersecurity Support", href: siteConfig.links.cybersecuritySupport },
  { label: "Backup and Recovery", href: siteConfig.links.backupRecovery },
  { label: "Employee Onboarding and Offboarding", href: siteConfig.links.workflowAutomation },
];

export function SiteHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E2F54] border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 flex items-center h-16 gap-4">

        <div className="flex-none">
          <Logo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 ml-auto flex-none">

          {/* Services dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap"
              data-testid="nav-link-services"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Services
              <ChevronDown
                size={13}
                className={`transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2.5 w-64 bg-[#0A2440] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                <Link
                  href={siteConfig.links.services}
                  className="flex items-center justify-between px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#60B8F0] hover:text-white transition-colors"
                >
                  All Services
                  <span className="text-white/40 font-normal normal-case tracking-normal text-sm">→</span>
                </Link>
                <div className="border-t border-white/10 mt-1 pt-1">
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-white/65 hover:text-white hover:bg-white/5 transition-colors rounded-lg mx-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {[
            { label: "Pricing", href: siteConfig.links.pricing },
            { label: "Cost Analysis", href: siteConfig.links.costAnalysis },
            { label: "Contact", href: siteConfig.links.contact },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors whitespace-nowrap"
              data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}

          <Button
            asChild
            size="sm"
            className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold text-sm px-5 h-9 rounded-lg border-0 whitespace-nowrap ml-1"
          >
            <Link href={siteConfig.links.contact} data-testid="nav-cta-button">
              Schedule a Free Cost Analysis
            </Link>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-1 text-white/80 hover:text-white rounded-md transition-colors ml-auto"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A2440] border-t border-white/10 px-4 pt-3 pb-4 flex flex-col gap-1">

          {/* Services accordion */}
          <button
            className="flex items-center justify-between w-full text-sm font-medium text-white/80 py-3 px-3 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMobileServicesOpen((o) => !o)}
          >
            Services
            <ChevronDown
              size={14}
              className={`transition-transform duration-150 ${mobileServicesOpen ? "rotate-180" : ""}`}
            />
          </button>

          {mobileServicesOpen && (
            <div className="pl-3 flex flex-col gap-0.5 mb-1">
              <Link
                href={siteConfig.links.services}
                className="text-sm font-semibold text-[#60B8F0] py-2 px-3 hover:bg-white/5 rounded-lg transition-colors"
              >
                All Services →
              </Link>
              {SERVICE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/65 py-2 px-3 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {[
            { label: "Pricing", href: siteConfig.links.pricing },
            { label: "Cost Analysis", href: siteConfig.links.costAnalysis },
            { label: "Contact", href: siteConfig.links.contact },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 py-3 px-3 hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 mt-2">
            <Button asChild className="w-full bg-[#1F5E95] hover:bg-[#1a5080] text-white text-sm h-11 rounded-lg font-semibold">
              <Link href={siteConfig.links.contact}>Schedule a Free Cost Analysis</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
