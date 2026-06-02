import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/microsoft-365-support-myrtle-beach";
const TITLE = "Microsoft 365 Support for Small Businesses — Myrtle Beach, SC";
const DESC =
  "Right-sized Microsoft 365 licensing, cleaner admin controls, and consistent user lifecycle management for small businesses in Myrtle Beach and the Grand Strand. No unnecessary upgrades or unused features.";

const WHAT_IT_COVERS = [
  "License review and right-sizing — identifying unused, over-assigned, or incorrectly tiered licenses",
  "Admin console configuration — security defaults, audit logging, proper admin role assignment",
  "Email security setup — spam filtering, anti-phishing protection, and email authentication records",
  "Teams and SharePoint organization — channel structure, sharing settings, and file governance",
  "Built-in security feature enablement — Microsoft 365 includes security tools that require configuration to be active",
  "User onboarding workflows — consistent account creation, license assignment, and access provisioning",
  "User offboarding workflows — timed account disabling, license reclamation, file transfer, and access removal",
];

const OVERSPEND_PATTERNS = [
  { flag: "Licenses assigned to former employees", why: "Microsoft 365 charges per assigned license regardless of whether the account is active. Missed offboarding steps accumulate into real monthly cost." },
  { flag: "Premium license tier with features never enabled", why: "Microsoft 365 Business Premium includes security, compliance, and endpoint management features. Most small businesses on Premium have never configured them." },
  { flag: "Paying for third-party tools that Microsoft 365 already includes", why: "Spam filters, backup tools, and identity management products are often purchased separately when equivalent capability already exists in the license." },
  { flag: "Security defaults never enabled", why: "Microsoft 365 does not automatically enable all security features. Multi-factor authentication, conditional access, and advanced email protection require deliberate configuration." },
];

export default function Microsoft365Support() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{TITLE} | Grand Strand Ally</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "name": "Microsoft 365 Setup and Support",
              "description": DESC,
              "provider": { "@id": "https://gsally.com/#organization" },
              "areaServed": { "@type": "City", "name": "Myrtle Beach", "sameAs": "https://www.wikidata.org/wiki/Q498442" },
              "url": CANONICAL,
              "isPartOf": { "@id": "https://gsally.com/#website" },
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://gsally.com/services" },
                { "@type": "ListItem", "position": 3, "name": "Microsoft 365 Support", "item": CANONICAL },
              ],
            },
          ],
        })}</script>
      </Helmet>

      <section className="bg-[#0E2F54] text-white pt-28 pb-14 md:pt-36 md:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors">Grand Strand Ally</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white/80 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/35">Microsoft 365 Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Microsoft 365 Setup and Support for Small Businesses in the Grand Strand
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Right-sized licensing, properly configured security features, and consistent user lifecycle management — without paying for capabilities that are never enabled.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Most small businesses are either over-licensed, under-configured, or both. A proper Microsoft 365 review identifies license waste, enables built-in security features that are not turned on by default, and creates consistent user onboarding and offboarding processes. <strong className="text-white">The goal is a well-configured environment that does not cost more than it should.</strong>
            </p>
          </div>

          <article className="space-y-12">

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What Microsoft 365 support covers</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                Microsoft 365 is the core platform for most small businesses — email, file storage, collaboration, and an increasing amount of security infrastructure. Getting it right means more than just assigning licenses. It requires configuration, ongoing administration, and a consistent process for managing users as they join and leave.
              </p>
              <ul className="space-y-2.5">
                {WHAT_IT_COVERS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Common Microsoft 365 overspend and misconfiguration patterns</h2>
              <div className="space-y-3">
                {OVERSPEND_PATTERNS.map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5 border-l-4 border-l-amber-400">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <h3 className="text-sm font-heading font-bold text-[#0E2F54]">{item.flag}</h3>
                    </div>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed pl-5">{item.why}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Who this works well for</h2>
              <ul className="space-y-2.5">
                {[
                  "Businesses already using Microsoft 365 that have never had a formal admin review",
                  "Businesses paying for multiple overlapping tools — backup, spam filter, identity — when Microsoft 365 may already include them",
                  "Any business that has had employee turnover without a documented offboarding process",
                  "Businesses preparing for a compliance review that requires documented access controls and audit logs",
                  "Businesses that purchased a higher license tier and are unsure what features they are actually using",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Small business employee offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "View all services", href: "/services" },
                  { label: "Schedule a free cost analysis", href: "/free-it-cost-analysis" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="bg-white border border-[#D7E1EA] hover:border-[#1F5E95] rounded-xl px-5 py-3.5 text-sm font-medium text-[#0E2F54] hover:text-[#1F5E95] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#1F5E95] inline-block shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>

          </article>
        </div>
      </div>

      <CTABand
        title="Not sure if your Microsoft 365 environment is right-sized?"
        subtitle="The free cost analysis includes a review of your current Microsoft 365 licensing and configuration — identifying waste, gaps, and security features that should be enabled."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
