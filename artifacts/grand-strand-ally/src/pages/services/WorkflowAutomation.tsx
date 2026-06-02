import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/employee-onboarding-offboarding-it";
const TITLE = "Employee Onboarding and Offboarding IT Services — Myrtle Beach and the Grand Strand";
const DESC =
  "Standardized employee onboarding and offboarding workflows for small businesses across the Grand Strand. Consistent access provisioning, license management, and documented processes that run the same way every time.";

const ONBOARDING_COVERS = [
  "Account creation and license assignment in Microsoft 365 — with the correct tier and access level from day one",
  "Group and distribution list membership — ensuring new employees are part of the right teams and communication channels",
  "Application access provisioning — coordinating access to line-of-business tools based on role",
  "Equipment setup documentation — standardized configuration that does not depend on a single person's memory",
  "Welcome and orientation materials — shared documentation so the first day goes smoothly without improvising",
];

const OFFBOARDING_COVERS = [
  "Account disabling on the last day — with a defined sequence that prevents data loss before access is removed",
  "Mailbox conversion and file transfer — moving email and documents to the appropriate owner before the account is deleted",
  "License reclamation — removing and reassigning licenses so billing stops for departed employees",
  "Hardware and access recovery — collecting equipment, revoking credentials, and removing from physical access systems",
  "External system removal — identifying and removing accounts in third-party tools, vendor portals, and cloud applications",
  "Thirty-day follow-up — a review step that catches license billing, broken automations, and any missed access items",
];

const WHY_CONSISTENCY_MATTERS = [
  { title: "Inconsistent onboarding creates access gaps", desc: "When new employees receive different access depending on who set them up, some get too much and some get too little. Both create risk." },
  { title: "Missed offboarding wastes money", desc: "Microsoft 365 charges per assigned license regardless of whether the account is active. A business with modest annual turnover and no offboarding process may be paying for a significant number of former employees." },
  { title: "Undocumented processes create key-person risk", desc: "If the person who handles onboarding leaves, the process leaves with them. Documented workflows run consistently regardless of who executes them." },
  { title: "Compliance reviews require documented controls", desc: "Regulated industries and many insurance policies require evidence of access control procedures. Ad hoc processes do not satisfy this requirement." },
];

export default function WorkflowAutomation() {
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
              "name": "Workflow Automation and User Onboarding and Offboarding",
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
                { "@type": "ListItem", "position": 3, "name": "Employee Onboarding and Offboarding", "item": CANONICAL },
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
            Employee Onboarding and Offboarding Information Technology Services in the Grand Strand
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Documented, repeatable user lifecycle workflows that run the same way every time — reducing security risk, license waste, and dependence on institutional memory.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Inconsistent onboarding creates access gaps, and missed offboarding steps leave active accounts and unused licenses behind. The goal is a <strong className="text-white">documented, repeatable process that runs the same way every time</strong> — not one that depends on someone remembering all the steps. Most small businesses discover their process gaps only after an incident or an unexpected invoice.
            </p>
          </div>

          <article className="space-y-12">

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What onboarding covers</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                A consistent onboarding process ensures every new employee starts with the right access, the right tools, and a documented baseline — regardless of who handles the setup.
              </p>
              <ul className="space-y-2.5">
                {ONBOARDING_COVERS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What offboarding covers</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                Offboarding is a timed sequence, not a single event. Steps taken in the wrong order — or skipped entirely — result in data loss, active credentials, or ongoing billing for departed employees.
              </p>
              <ul className="space-y-2.5">
                {OFFBOARDING_COVERS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Why consistency matters more than thoroughness</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WHY_CONSISTENCY_MATTERS.map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                    <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{item.title}</h3>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Who this works well for</h2>
              <ul className="space-y-2.5">
                {[
                  "Businesses with regular employee turnover that have never formalized their onboarding or offboarding process",
                  "Businesses that have had a security incident or credential compromise linked to a former employee account",
                  "Businesses paying for licenses that should have been reclaimed after employee departures",
                  "Businesses using Microsoft 365 that want to automate account creation and license assignment",
                  "Businesses preparing for a compliance review that requires documented access control procedures",
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
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
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
