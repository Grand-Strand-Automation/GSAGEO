import { Link } from "wouter";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#0A2440] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Logo className="text-white brightness-0 invert" />
            <p className="text-white/70 max-w-sm">
              {siteConfig.description}
            </p>
            <div className="pt-4 space-y-2 text-white/80 text-sm">
              <p>{siteConfig.serviceArea}</p>
              <p>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">
                  {siteConfig.email}
                </a>
              </p>
              <p>
                <a href={`tel:${siteConfig.phone.replace(/-/g, "")}`} className="hover:text-white transition-colors">
                  {siteConfig.phone}
                </a>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href={siteConfig.links.home} className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.services} className="text-white/70 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.pricing} className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.contact} className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href={siteConfig.links.privacy} className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.terms} className="text-white/70 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
