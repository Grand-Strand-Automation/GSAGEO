import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Services", href: siteConfig.links.services },
    { label: "Pricing", href: siteConfig.links.pricing },
    { label: "Contact", href: siteConfig.links.contact },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-border shadow-sm py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Logo className={cn(isScrolled ? "text-primary" : "text-white")} />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  isScrolled ? "text-muted-foreground" : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90 text-white font-semibold">
            <Link href={siteConfig.links.contact}>Book a Free IT Review</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} className={cn(!isScrolled && "text-white")} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-primary py-2 px-4 hover:bg-secondary rounded-md"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full mt-2 bg-accent text-white">
            <Link href={siteConfig.links.contact}>Book a Free IT Review</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
