import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Minus } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/managed-it-support-myrtle-beach";
const TITLE = "Managed IT Support — Myrtle Beach and the Grand Strand";
const DESC =
  "Month-to-month managed information technology support for small businesses in Myrtle Beach and the Grand Strand. Clear scope, predictable pricing, and a single point of contact — no long-term contracts required.";

const WHAT_IT_COVERS = [
  "Helpdesk and end-user support — troubleshooting software, hardware, and connectivity issues for your team",
  "Remote monitoring and maintenance — ongoing system health checks, alerts, and proactive issue resolution",
  "Patch management — keeping operating systems and software current across workstations and servers",
  "Vendor coordination — acting as the single point of contact for your technology vendors",
  "Documentation and asset inventory — maintaining an accurate record of your systems, software, and configurations",
  "Onboarding and offboarding support — integrating account management with user lifecycle workflows",
];

const OUTCOMES = [
  { title: "Predictable monthly cost", desc: "A defined monthly fee replaces unpredictable hourly bills and emergency call charges." },
  { title: "Faster issue resolution", desc: "Defined response ownership and documented systems mean issues are resolved with less back-and-forth." },
  { title: "Fewer vendors to manage", desc: "One point of contact handles coordination with your technology vendors on your behalf." },
  { title: "A documented environment", desc: "Your systems are inventoried and documented so decisions are based on current reality, not guesswork." },
];

const GOOD_FIT = [
  "5 to 75 employees with no dedicated internal information technology staff",
  "Currently relying on break-fix or reactive support with no defined monthly scope",
  "Paying multiple vendors for overlapping support and finding coordination difficult",
  "Need a consistent, reliable point of contact for technology issues",
  "Have experienced slow response times or unclear ownership under a previous support arrangement",
];

const NOT_FIT = [
  "Organizations with an internal information technology team already in place",
  "Businesses that only need occasional project-based help rather than ongoing support",
];

export default function ManagedITSupport() {
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
              "name": "Managed Information Technology Support",
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
                { "@type": "ListItem", "position": 3, "name": "Managed IT Support", "item": CANONICAL },
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
            <span className="text-white/35">Managed IT Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Managed Information Technology Support in Myrtle Beach and the Grand Strand
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Predictable monthly support with a defined scope, clear ownership, and a single point of contact — replacing reactive break-fix with a consistent service model.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Most small businesses need consistent, predictable information technology support — helpdesk coverage, monitoring, patching, and vendor coordination. Managed support replaces reactive, hourly break-fix with a defined monthly service model that covers most day-to-day technology needs at a <strong className="text-white">predictable cost</strong>. The scope is defined before work begins, and there are no long-term contracts.
            </p>
          </div>

          <article className="space-y-12">

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What managed support covers</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                A managed support engagement is a defined monthly service — not a retainer that bills hourly for anything that comes up. The scope is agreed in writing before the engagement starts and typically covers the following areas.
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
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">What you can expect</h2>
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
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">How managed support differs from break-fix</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Break-fix support means calling someone when something breaks and paying an hourly rate for that call. It is reactive by design — problems are addressed after they occur, and the cost is unpredictable. There is no incentive for the provider to prevent problems, because problems generate billable hours.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                Managed support changes that dynamic. Because the monthly cost is fixed regardless of how many issues arise, there is a shared interest in keeping systems stable. Monitoring, patching, and proactive maintenance reduce the frequency and severity of issues — which is better for both parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Who this works well for</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#DCEAF7] flex items-center justify-center">
                      <CheckCircle2 size={13} className="text-[#1F5E95]" />
                    </div>
                    <span className="text-sm font-bold text-[#0E2F54]">Likely a good fit</span>
                  </div>
                  <ul className="space-y-2.5">
                    {GOOD_FIT.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#4B5B6B]">
                        <CheckCircle2 size={12} className="text-[#1F5E95] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#F7F5F1] border border-[#D7E1EA] flex items-center justify-center">
                      <Minus size={13} className="text-[#4B5B6B]" />
                    </div>
                    <span className="text-sm font-bold text-[#0E2F54]">May not be the right fit</span>
                  </div>
                  <ul className="space-y-2.5">
                    {NOT_FIT.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#4B5B6B]">
                        <Minus size={12} className="text-[#4B5B6B] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
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
        title="Want a clear picture of what managed support would cost?"
        subtitle="The free Grand Strand Ally cost analysis reviews your current environment and identifies what a defined support scope would look like for your business — before any commitment is made."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
