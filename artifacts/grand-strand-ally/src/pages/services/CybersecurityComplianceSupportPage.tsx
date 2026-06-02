import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/cybersecurity-compliance-support";
const TITLE = "Cybersecurity and Compliance Support for Small Businesses — Grand Strand Ally";
const DESC =
  "Practical cybersecurity controls, access management, and compliance-minded configurations for small businesses in the Grand Strand. Focused on the measures that reduce the most risk — without an enterprise-level budget.";

const WHO_FOR = [
  "Businesses in or adjacent to regulated industries — healthcare, financial services, legal, government contracting",
  "Businesses that have experienced a breach, ransomware event, or credential compromise",
  "Businesses preparing for a compliance review or completing a cyber insurance application",
  "Any business with employee turnover that has not had a formal offboarding process",
  "Businesses with remote workers or multiple locations where access control is more difficult",
];

const PROBLEMS = [
  "Former employee accounts are still active — the credentials still work and no one has reviewed them",
  "Administrative access is assigned too broadly and no one is sure who has it or why",
  "Email accounts have no multi-factor authentication and phishing attempts succeed",
  "Microsoft 365 Business Premium is licensed but the security features were never configured",
  "Cyber insurance renewal required evidence of specific controls that do not currently exist in writing",
  "A ransomware or credential compromise incident occurred and there was no documented response plan",
];

const INCLUDED = [
  "Endpoint security deployment — managed detection and response on workstations and laptops",
  "Email security configuration — anti-phishing, impersonation protection, and spam filtering",
  "Identity and access management review — who has access to what systems and at what privilege level",
  "Multi-factor authentication and conditional access deployment",
  "Former employee account audit and remediation",
  "Periodic access reviews — who retains admin rights and whether that is still appropriate",
  "Compliance-minded configuration documentation — audit logs, data handling controls, access records",
  "Incident response procedure documentation — defined steps before an incident, not improvised during one",
];

const OUTCOMES = [
  { title: "Active accounts limited to current staff", desc: "Periodic access reviews and a defined offboarding process prevent former employee credentials from remaining active." },
  { title: "Multi-factor authentication enforced", desc: "All user accounts require a second factor for authentication — removing the most common entry point for credential-based attacks." },
  { title: "Security features configured, not just purchased", desc: "Endpoint protection, email security, and conditional access are active and reviewed — not sitting at default settings." },
  { title: "Documented controls for review", desc: "Written configuration records and procedures that satisfy insurance, compliance, and audit requirements." },
];

const FAQ_ITEMS = [
  {
    q: "Do we need enterprise-level security tools?",
    a: "No. Most small business security risk is addressed by a small set of practical controls — multi-factor authentication, endpoint protection, email filtering, and consistent access management. These are achievable at a reasonable cost. Overbuilding security with tools designed for large enterprises is a common and expensive mistake for small businesses.",
  },
  {
    q: "What does 'compliance-minded' mean in practice?",
    a: "It means your environment is configured and documented in a way that can be reviewed — by an auditor, an insurance provider, or a prospective client. Controls are in place and there is a written record confirming they are active. It does not mean certification under a specific framework unless that is a stated requirement.",
  },
  {
    q: "Can you help with cyber insurance requirements?",
    a: "Yes. Most cyber insurance applications now ask whether specific controls are in place — multi-factor authentication, endpoint protection, backup procedures, and incident response documentation. We configure and document those controls to match what your policy or application requires.",
  },
  {
    q: "What happens if there is a security incident while under a managed support agreement?",
    a: "Incident response procedures are established in advance — not improvised. The response sequence is documented before any incident occurs, and we assist with containment, access review, and communication as part of the engagement.",
  },
  {
    q: "How is this different from just purchasing antivirus software?",
    a: "Endpoint security is one component of a broader posture that includes access management, email security, and documented controls. Antivirus addresses a subset of the risk — primarily malware on a device. This service addresses the full access and security posture, including the human factors antivirus does not touch.",
  },
];

export default function CybersecurityComplianceSupportPage() {
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
              "serviceType": "Cybersecurity and Compliance Support",
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
                { "@type": "ListItem", "position": 3, "name": "Cybersecurity and Compliance", "item": CANONICAL },
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
            <span className="text-white/35">Cybersecurity and Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Cybersecurity and Compliance Support for Small Businesses
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Practical controls focused on the measures that reduce the most risk — without enterprise-level complexity or an enterprise-level budget.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Small business cybersecurity does not require an enterprise stack. Most risk reduction comes from a small number of practical controls — multi-factor authentication, endpoint protection, email filtering, and consistent access management. <strong className="text-white">These are achievable at a reasonable cost and address the situations where most small business breaches actually occur.</strong>
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
                  <div key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] border-l-4 border-l-red-300 rounded-xl px-5 py-3.5">
                    <AlertTriangle size={13} className="text-red-500 shrink-0 mt-0.5" />
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
                Grand Strand Ally provides cybersecurity and compliance support for small businesses across the Grand Strand, including Myrtle Beach, Conway, North Myrtle Beach, Surfside Beach, Murrells Inlet, Pawleys Island, Little River, and Socastee. The focus is on practical controls that reduce real risk — not enterprise-level complexity added for its own sake.
              </p>
            </section>

            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Small business employee offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
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
        title="Not sure where your security gaps are?"
        subtitle="The free cost analysis includes a review of your current security posture — access controls, endpoint coverage, email security, and the most common gaps for businesses your size."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact#contact-form", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
