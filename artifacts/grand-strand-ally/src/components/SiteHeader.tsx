import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/site";

const SERVICE_LINKS = [
  { label: "Managed IT Support", href: siteConfig.links.managedItSupport },
  { label: "Microsoft 365 Support", href: siteConfig.links.microsoft365SupportPage },
  { label: "Network and Wi-Fi", href: siteConfig.links.networkWifiManagement },
  { label: "IT Cost Analysis", href: siteConfig.links.itCostAnalysis },
  { label: "Cybersecurity and Compliance", href: siteConfig.links.cybersecurityCompliancePage },
  { label: "Backup and Recovery", href: siteConfig.links.backupRecoverySupportPage },
  { label: "Onboarding and Offboarding", href: siteConfig.links.onboardingOffboardingAutomation },
  { label: "GEO / AI Visibility", href: siteConfig.links.geo },
];

const RESOURCE_LINKS = [
  { label: "IT Support Cost Guide", href: "/how-much-should-a-small-business-spend-on-it-support" },
  { label: "Finding Tool Overlap", href: "/how-to-find-overlapping-it-tools-and-vendors" },
  { label: "Offboarding Checklist", href: "/small-business-offboarding-checklist" },
  { label: "Cost Analysis Guide", href: "/what-an-it-cost-analysis-should-include" },
];

const SERVICE_ROOTS = [
  "/managed-it", "/microsoft-365", "/network-wifi", "/it-cost", "/cybersecurity",
  "/backup", "/onboarding", "/services", "/generative-engine-optimization", "/geo-audit",
];

export function SiteHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const isServicesActive = SERVICE_ROOTS.some((r) => location.startsWith(r));

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setMobileResourcesOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const desktopLinkClass = (href: string) =>
    `text-sm font-medium transition-colors whitespace-nowrap ${
      isActive(href) ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const mobileLinkClass = (href: string) =>
    `block text-sm font-medium py-3 px-3 rounded-lg transition-colors ${
      isActive(href)
        ? "text-white bg-white/[0.08]"
        : "text-white/80 hover:text-white hover:bg-white/5"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E2F54] border-b border-white/10">
      <div className="container mx-auto px-4 xl:px-6 flex items-center h-16 gap-4">

        <div className="flex-none">
          <Logo />
        </div>

        {/* ── Desktop nav (xl+) ─────────────────────────────── */}
        <nav className="hidden xl:flex items-center gap-3 ml-auto flex-none">

          {/* Services dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                isServicesActive ? "text-white" : "text-white/70 hover:text-white"
              }`}
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
                  <span className="text-white/40 font-normal normal-case tracking-normal text-sm" aria-hidden="true">→</span>
                </Link>
                <div className="border-t border-white/10 mt-1 pt-1">
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2.5 text-sm hover:bg-white/5 transition-colors rounded-lg mx-1 ${
                        isActive(link.href) ? "text-white" : "text-white/65 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-1 pt-1 px-1">
                  <Link
                    href="/free-it-cost-analysis"
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold hover:bg-white/5 rounded-lg transition-colors ${
                      isActive("/free-it-cost-analysis") ? "text-white" : "text-[#60B8F0] hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block shrink-0" />
                    Free IT Cost Analysis
                  </Link>
                </div>
              </div>
            )}
          </div>

          {[
            { label: "About", href: "/about" },
            { label: "Process", href: "/process" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "FAQ", href: "/faq" },
            { label: "Contact", href: siteConfig.links.contact },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={desktopLinkClass(link.href)}
              data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}

          <Button
            asChild
            size="sm"
            className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold text-sm px-4 h-9 rounded-lg border-0 whitespace-nowrap ml-1"
          >
            <Link href={siteConfig.links.contactForm} data-testid="nav-cta-button">
              Schedule a Free Cost Analysis
            </Link>
          </Button>
        </nav>

        {/* ── Hamburger (below xl) ───────────────────────────── */}
        <button
          className="xl:hidden p-2 -mr-1 text-white/80 hover:text-white rounded-md transition-colors ml-auto"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile / tablet menu ───────────────────────────── */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A2440] border-t border-white/10 px-4 pt-3 pb-5 flex flex-col gap-0.5 max-h-[calc(100vh-64px)] overflow-y-auto">

          <Link href="/" className={mobileLinkClass("/")}>Home</Link>
          <Link href="/about" className={mobileLinkClass("/about")}>About</Link>

          {/* Services accordion */}
          <button
            className={`flex items-center justify-between w-full text-sm font-medium py-3 px-3 rounded-lg transition-colors ${
              mobileServicesOpen || isServicesActive
                ? "text-white bg-white/[0.08]"
                : "text-white/80 hover:text-white hover:bg-white/5"
            }`}
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
                  className={`text-sm py-2 px-3 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "text-white font-medium bg-white/5"
                      : "text-white/65 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/free-it-cost-analysis"
                className={`flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${
                  isActive("/free-it-cost-analysis")
                    ? "text-white bg-white/5"
                    : "text-[#60B8F0] hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block shrink-0" />
                Free IT Cost Analysis
              </Link>
            </div>
          )}

          <Link href="/process" className={mobileLinkClass("/process")}>Process</Link>
          <Link href="/case-studies" className={mobileLinkClass("/case-studies")}>Case Studies</Link>
          <Link href="/faq" className={mobileLinkClass("/faq")}>FAQ</Link>
          <Link href={siteConfig.links.contact} className={mobileLinkClass(siteConfig.links.contact)}>Contact</Link>

          {/* Resources accordion */}
          <div className="border-t border-white/10 mt-2 pt-2">
            <button
              className={`flex items-center justify-between w-full text-sm font-medium py-3 px-3 rounded-lg transition-colors ${
                mobileResourcesOpen
                  ? "text-white/80 bg-white/5"
                  : "text-white/55 hover:text-white/80 hover:bg-white/5"
              }`}
              onClick={() => setMobileResourcesOpen((o) => !o)}
            >
              Resources
              <ChevronDown
                size={14}
                className={`transition-transform duration-150 ${mobileResourcesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileResourcesOpen && (
              <div className="pl-3 flex flex-col gap-0.5 mb-1">
                {RESOURCE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm py-2 px-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "text-white font-medium bg-white/5"
                        : "text-white/55 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 mt-2">
            <Button asChild className="w-full bg-[#1F5E95] hover:bg-[#1a5080] text-white text-sm h-11 rounded-lg font-semibold">
              <Link href={siteConfig.links.contactForm}>Schedule a Free Cost Analysis</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
