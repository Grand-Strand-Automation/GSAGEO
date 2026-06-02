import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/cybersecurity-support-myrtle-beach";
const TITLE = "Cybersecurity and Compliance Support for Small Businesses — Myrtle Beach, SC";
const DESC =
  "Practical cybersecurity controls, access management, and compliance-minded configurations for small businesses in Myrtle Beach and the Grand Strand. Focused on the controls that reduce the most risk without an enterprise-level budget.";

const WHAT_IT_COVERS = [
  "Endpoint security — managed detection and response on workstations and laptops",
  "Email security — anti-phishing protection, spam filtering, and impersonation defense",
  "Identity and access management — controlling who has access to what systems and at what level",
  "Multi-factor authentication and conditional access — enforcing secure sign-in across accounts and applications",
  "Access reviews — periodic review of active accounts, admin privileges, and former employee access",
  "Compliance-minded configurations — audit logging, data handling controls, and documented security procedures",
  "Security awareness and incident response support — clear procedures for responding to credential compromise or ransomware",
];

const COMMON_GAPS = [
  { gap: "Former employees with active accounts", why: "Credential-based attacks do not require the former employee to act maliciously. Active accounts belonging to people who no longer work for the business are a common entry point." },
  { gap: "Admin rights assigned too broadly", why: "When too many people have administrative access, the impact of a compromised credential is significantly higher. Admin privileges should be scoped to what is actually needed." },
  { gap: "No multi-factor authentication on email", why: "Email accounts are the most targeted credential in small business attacks. Multi-factor authentication is one of the most effective single controls available and does not require expensive tooling." },
  { gap: "Microsoft 365 security features present but not configured", why: "Microsoft 365 Business Premium includes endpoint management, advanced threat protection, and identity controls. Most businesses on this tier have never enabled them." },
];

export default function CybersecuritySupport() {
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
              "name": "Cybersecurity and Compliance Support",
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
                { "@type": "ListItem", "position": 3, "name": "Cybersecurity Support", "item": CANONICAL },
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
            <span className="text-white/35">Cybersecurity Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Cybersecurity and Compliance Support for Small Businesses in the Grand Strand
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Practical security controls focused on the measures that reduce the most risk — without an enterprise-level stack or unnecessary complexity.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Small business cybersecurity does not require an enterprise-level security stack. Most risk reduction comes from a small number of practical controls — multi-factor authentication, endpoint protection, email filtering, and consistent access management. <strong className="text-white">These are achievable at a reasonable cost and are where most small business breaches could have been prevented.</strong>
            </p>
          </div>

          <article className="space-y-12">

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What cybersecurity and compliance support covers</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                Effective small business security is not about buying more tools — it is about configuring the right controls consistently and reviewing them regularly. The focus is on the areas where most real incidents occur.
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
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Common security gaps in small business environments</h2>
              <div className="space-y-3">
                {COMMON_GAPS.map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5 border-l-4 border-l-red-300">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                      <h3 className="text-sm font-heading font-bold text-[#0E2F54]">{item.gap}</h3>
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
                  "Businesses that have experienced a security incident, credential compromise, or ransomware event",
                  "Businesses preparing for a compliance review — healthcare, financial services, legal, or government contractors",
                  "Businesses with remote workers or multiple locations where access is harder to control",
                  "Any business that has had recent employee turnover without a documented offboarding process",
                  "Businesses using Microsoft 365 that have never reviewed their security configuration or enabled security defaults",
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
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
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
        title="Not sure where your security gaps are?"
        subtitle="The free cost analysis includes a review of your current security posture — access controls, endpoint coverage, email security, and the most common vulnerabilities for businesses your size."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
