import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/microsoft-365-support";
const TITLE = "Microsoft 365 Support for Small Businesses — Grand Strand Ally";
const DESC =
  "Right-sized Microsoft 365 licensing, properly configured security features, and consistent user onboarding and offboarding. No unused tiers, no misconfigured admin consoles, no paying for tools Microsoft 365 already covers.";

const WHO_FOR = [
  "Businesses already on Microsoft 365 that have never had a formal admin review",
  "Teams that onboard and offboard employees without a documented process in Microsoft 365",
  "Businesses on Business Premium or E3 that are unsure which features are actually enabled",
  "Organizations that recently migrated from Google Workspace and have an inconsistent setup",
  "Businesses paying for third-party spam filters or backup tools that Microsoft 365 may already cover",
];

const PROBLEMS = [
  "Licenses are still assigned to accounts belonging to people who left months ago",
  "Email is on Microsoft 365 but security defaults and anti-phishing settings have never been touched",
  "Microsoft Teams was stood up quickly and no one is clear on who owns which channels or files",
  "Business Premium was purchased for the security features but none of them have been configured",
  "Phishing emails reach inboxes despite Microsoft 365 having built-in filtering that was never enabled",
  "Each new user is set up differently depending on who handles it — no consistent process exists",
];

const INCLUDED = [
  "License inventory and right-sizing — matching tier and seat count to actual usage",
  "Admin console security configuration — authentication policies, audit logging, security defaults",
  "Email security enablement — anti-spam, anti-phishing, SPF/DKIM/DMARC configuration",
  "Microsoft Teams governance — channel ownership, sharing controls, guest access review",
  "SharePoint and OneDrive review — external sharing settings, permissions audit",
  "Built-in security feature enablement based on your current license tier",
  "Onboarding workflow — consistent account creation, license assignment, group membership",
  "Offboarding workflow — timed sequence for departing employees with license reclaim",
  "Ongoing administration as part of managed support",
];

const OUTCOMES = [
  { title: "No licenses billed for former employees", desc: "License counts match current headcount after audit and a defined offboarding process prevents future drift." },
  { title: "Security features active, not just purchased", desc: "Conditional access, advanced threat protection, and endpoint management configured — not left at defaults." },
  { title: "Consistent user lifecycle", desc: "Every new hire starts with the same setup. Every departure follows the same timed sequence." },
  { title: "Reduced per-seat cost", desc: "Eliminating third-party tools that duplicate Microsoft 365 capabilities lowers total monthly spend." },
];

const FAQ_ITEMS = [
  {
    q: "We already have Microsoft 365 set up. Do we need to start over?",
    a: "No. The starting point is always a review of your existing environment — what is configured, what is not, and what is costing more than it should. Most businesses do not need to rebuild. They need to enable what is already there and clean up what has drifted.",
  },
  {
    q: "Does this cover Microsoft Teams and SharePoint or just email?",
    a: "It covers the full Microsoft 365 tenant — email, Teams, SharePoint, OneDrive, user accounts, licensing, and security features. The scope is shaped by which services your business actually uses.",
  },
  {
    q: "What license tier do we need?",
    a: "The review includes a determination of whether your current tier is right for your needs. Some businesses are overpaying for premium features they will never use. Others are on a basic tier and missing security features that should be active. Right-sizing goes in both directions.",
  },
  {
    q: "Can you set up automatic onboarding and offboarding in Microsoft 365?",
    a: "Within Microsoft 365, yes — account creation, license assignment, group membership, and mailbox configuration can be structured as documented, repeatable workflows. Integration with third-party HR systems is scoped case by case.",
  },
  {
    q: "How is ongoing Microsoft 365 administration handled after the initial setup?",
    a: "It is included as part of managed support — license management, user lifecycle, security review, and configuration maintenance are handled on an ongoing basis rather than as separate projects.",
  },
];

export default function Microsoft365SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
              "serviceType": "Microsoft 365 Administration",
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
            Microsoft 365 Support for Small and Medium Businesses
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Right-sized licensing, properly configured security features, and consistent user lifecycle management — without paying for capabilities that were never turned on.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Most small businesses are either over-licensed, under-configured, or both. A proper Microsoft 365 review identifies license waste, enables built-in security features that are not active by default, and creates consistent onboarding and offboarding processes. <strong className="text-white">The goal is a well-configured environment that does not cost more than it should.</strong>
            </p>
          </div>

          <article className="space-y-12">

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Who this is for</h2>
              <ul className="space-y-2.5">
                {WHO_FOR.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Problems this solves</h2>
              <div className="space-y-2.5">
                {PROBLEMS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] border-l-4 border-l-amber-400 rounded-xl px-5 py-3.5">
                    <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-[#4B5B6B]">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What is included</h2>
              <ul className="space-y-2.5">
                {INCLUDED.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Expected outcomes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OUTCOMES.map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                    <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{item.title}</h3>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Frequently asked questions</h2>
              <div className="divide-y divide-[#D7E1EA] border border-[#D7E1EA] rounded-2xl bg-white overflow-hidden">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i}>
                    <button
                      className="flex items-start justify-between w-full text-left gap-4 px-6 py-4"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-[15px] font-heading font-semibold text-[#0E2F54]">{item.q}</span>
                      <ChevronDown size={16} className={`text-[#1F5E95] shrink-0 mt-0.5 transition-transform duration-150 ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5">
                        <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-[#D7E1EA] pt-8">
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Serving the Grand Strand</h2>
              <p className="text-sm text-[#4B5B6B] leading-relaxed">
                Grand Strand Ally supports Microsoft 365 setup, licensing, and ongoing administration for businesses throughout the Grand Strand — Myrtle Beach, Conway, North Myrtle Beach, Surfside Beach, Murrells Inlet, Pawleys Island, Little River, and Socastee. If your business is in the area and uses Microsoft 365, we can review your current configuration and right-size your licensing without requiring a long-term commitment.
              </p>
            </section>

            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Small business employee offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "Onboarding and offboarding automation", href: "/onboarding-offboarding-automation" },
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
          { label: "Schedule a Free Cost Analysis", href: "/contact#contact-form", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
