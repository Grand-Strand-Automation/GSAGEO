import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/onboarding-offboarding-automation";
const TITLE = "Onboarding and Offboarding Automation for Small Businesses — Grand Strand Ally";
const DESC =
  "Standardized, documented employee onboarding and offboarding workflows for small businesses. Consistent access provisioning, timed offboarding sequences, and license management that runs the same way every time — not depending on whoever is available.";

const WHO_FOR = [
  "Businesses where onboarding depends on whoever is available that day rather than a defined process",
  "Businesses that have had security incidents traced to former employee credentials",
  "Businesses paying for Microsoft 365 licenses assigned to people who left months ago",
  "Human resources teams that want a reliable information technology handoff without managing the details",
  "Businesses preparing for a compliance review that requires documented access control procedures",
];

const PROBLEMS = [
  "A new employee starts on Monday and accounts are not ready until Wednesday or later",
  "Someone left three months ago and their email account is still active and receiving messages",
  "Microsoft 365 license count is higher than headcount because offboarding is informal",
  "A security incident was traced to the credentials of a former employee",
  "Three different people handle information technology for onboarding and each does it differently",
  "No one knows the full list of systems a departing employee had access to",
];

const ONBOARDING_INCLUDED = [
  "Account creation and license assignment — correct tier and access level from day one",
  "Group and distribution list membership — new employees in the right teams and channels automatically",
  "Application access provisioning — coordinated access to line-of-business tools by role",
  "Equipment setup documentation — standardized configuration that does not depend on memory",
  "Documented welcome checklist shared with the new employee and their manager",
];

const OFFBOARDING_INCLUDED = [
  "Timed account disabling sequence — defined order prevents data loss before access is removed",
  "Mailbox conversion and file transfer — email and documents moved to the appropriate owner",
  "License removal — billing stops for departed employees, not weeks or months later",
  "Hardware and external access recovery — equipment, credentials, and vendor portals",
  "Thirty-day follow-up — catches missed license billing, broken automations, and remaining access items",
];

const OUTCOMES = [
  { title: "Day-one access, every time", desc: "New employees have everything they need when they start — account, licenses, applications, and documentation." },
  { title: "No active credentials for former employees", desc: "The offboarding sequence removes access in a defined order. Nothing is left active because it was forgotten." },
  { title: "License count matches headcount", desc: "Offboarding triggers license removal. Former employees do not continue billing after they leave." },
  { title: "Process independent of any one person", desc: "Documented workflows run consistently regardless of who executes them — no institutional knowledge required." },
];

const FAQ_ITEMS = [
  {
    q: "How quickly can onboarding and offboarding workflows be set up?",
    a: "For Microsoft 365-based workflows, the core process is typically documented and implemented within the first two to three weeks of an engagement. More complex environments with multiple third-party systems follow the same scoped approach but take longer to map completely.",
  },
  {
    q: "What happens on an employee's last day?",
    a: "A defined sequence runs — not improvised. Key steps: mailbox conversion to shared mailbox with supervisor access, OneDrive file transfer to the appropriate owner, account disabling, license removal, hardware recovery, and external system removal. The sequence and timing are established before it is needed.",
  },
  {
    q: "What if we use systems outside of Microsoft 365?",
    a: "The offboarding process includes identifying which external systems each employee had access to — vendor portals, line-of-business applications, shared accounts, physical access systems. The inventory is built as part of the engagement so nothing is missed.",
  },
  {
    q: "How much of this can be automated?",
    a: "Microsoft 365 account creation, license assignment, and group membership can be structured as a documented, repeatable process — parts of which can be automated depending on your license tier. Full automation across all third-party systems is scoped case by case and depends on what those systems support.",
  },
  {
    q: "We have low turnover. Is this still worth doing?",
    a: "Yes. Low turnover means less practice with the process — which makes informal approaches riskier, not safer. A documented workflow takes more effort to build initially but requires almost no effort to run, regardless of how infrequently it is needed. The cost of an undocumented offboarding that goes wrong is significantly higher than the cost of building the process.",
  },
];

export default function OnboardingOffboardingAutomation() {
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
              "serviceType": "IT Onboarding and Offboarding",
              "name": "Onboarding and Offboarding Automation",
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
                { "@type": "ListItem", "position": 3, "name": "Onboarding and Offboarding", "item": CANONICAL },
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
            <span className="text-white/35">Onboarding and Offboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Onboarding and Offboarding Automation for Small Businesses
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Documented, repeatable user lifecycle workflows that run the same way every time — reducing security risk, license waste, and dependence on whoever happens to be available.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Inconsistent onboarding creates access gaps. Missed offboarding steps leave active accounts and unused licenses behind. The goal is a <strong className="text-white">documented, repeatable process that runs the same way every time</strong> — not one that depends on someone remembering all the steps or a vendor who may not be available.
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
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What is included — onboarding</h2>
              <ul className="space-y-2.5">
                {ONBOARDING_INCLUDED.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What is included — offboarding</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                Offboarding is a timed sequence, not a single action. Steps taken in the wrong order — or skipped — result in data loss, active credentials, or ongoing billing for departed employees.
              </p>
              <ul className="space-y-2.5">
                {OFFBOARDING_INCLUDED.map((item, i) => (
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
                Grand Strand Ally provides onboarding and offboarding automation for small businesses across the Grand Strand — Myrtle Beach, Conway, North Myrtle Beach, Surfside Beach, Murrells Inlet, Pawleys Island, Little River, and Socastee. Consistent processes that run the same way for every new hire or departure, with no steps depending on whoever happens to be available.
              </p>
            </section>

            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Small business employee offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
                  { label: "Microsoft 365 support", href: "/microsoft-365-support" },
                  { label: "Cybersecurity and compliance support", href: "/cybersecurity-compliance-support" },
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
        title="Want to see what a consistent onboarding and offboarding process looks like?"
        subtitle="The free cost analysis includes a review of your current user lifecycle process — identifying gaps in access control, license management, and documentation."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
