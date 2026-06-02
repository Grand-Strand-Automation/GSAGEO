import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/it-cost-analysis";
const TITLE = "IT Cost Analysis for Small Businesses — Grand Strand Ally";
const DESC =
  "A structured review of your current information technology spend, vendor stack, and compliance posture — before any managed support engagement begins. No obligation, no estimates, no guesswork.";

const WHO_FOR = [
  "Businesses that have never mapped out their full information technology spend in one place",
  "Businesses where vendor invoices are spread across multiple cost centers, credit cards, or people",
  "Companies that have changed vendors, grown, or added tools and are unsure what is still billing",
  "Any business considering a managed support engagement who wants clarity before committing",
  "Businesses that suspect they are overpaying but cannot point to where",
];

const PROBLEMS = [
  "No one can answer 'what does information technology actually cost us per month?' with confidence",
  "Multiple overlapping tools are billing monthly and no one is sure which to keep",
  "A previous vendor's tools and subscriptions are still charging after the relationship ended",
  "License counts no longer match headcount — either overbought or underbought",
  "A compliance review or cyber insurance application is asking for documentation that does not exist",
  "Information technology spend is guessed at rather than tracked — decisions are made without a baseline",
];

const INCLUDED = [
  "Full vendor and tool inventory — what is installed, what is subscribed to, who is paying",
  "Current monthly spend calculation — fully loaded, per user and per device",
  "Overlap and redundancy identification — where tools duplicate each other's function",
  "Microsoft 365 license audit — right tier, right seat count, features actually enabled",
  "Compliance gap summary — access controls, backup coverage, documentation gaps",
  "Written summary of findings with prioritized recommendations",
  "No-commitment consultation to review findings and answer questions",
];

const OUTCOMES = [
  { title: "A clear total picture", desc: "All information technology costs in one place — vendor by vendor, tool by tool, per user per month." },
  { title: "Identified savings", desc: "Specific consolidation and right-sizing opportunities — not general advice, but named tools and amounts." },
  { title: "Documented gaps", desc: "Compliance and security gaps surfaced before a review or incident forces the issue." },
  { title: "An informed starting point", desc: "A baseline for any managed support engagement — or for managing information technology costs independently." },
];

const FAQ_ITEMS = [
  {
    q: "Is this the same as the free cost analysis tool on your website?",
    a: "The self-service tool gives you a starting estimate based on information you enter. The full cost analysis is a working session with a Grand Strand Ally team member — we review your actual invoices, vendor accounts, and Microsoft 365 admin console rather than estimates. The tool is a useful starting point. The analysis is the complete picture.",
  },
  {
    q: "How long does the cost analysis take?",
    a: "The initial information-gathering meeting takes 30 to 60 minutes. The full review and written summary are typically delivered within a few business days. The pace is driven by how quickly we can access the relevant vendor information together.",
  },
  {
    q: "Do we need to commit to any service after the analysis?",
    a: "No. The cost analysis is a standalone engagement with no commitment required. Some businesses use the findings to decide whether to hire a managed support provider — that could be Grand Strand Ally or someone else. The goal is to give you an accurate picture before any decision is made.",
  },
  {
    q: "What information do we need to provide?",
    a: "Current vendor invoices or subscription statements, a list of software your team uses day to day, and access to your Microsoft 365 admin console if applicable. We guide the process — you do not need to have everything organized before the first meeting.",
  },
  {
    q: "What does the cost analysis cost?",
    a: "The initial cost analysis is provided at no charge for businesses in the Myrtle Beach and Grand Strand area. There is no invoice and no obligation. The goal is to give you an accurate picture of your current environment before any service relationship begins.",
  },
];

export default function ITCostAnalysisPage() {
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
              "serviceType": "IT Cost Analysis",
              "name": "IT Cost Analysis",
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
                { "@type": "ListItem", "position": 3, "name": "IT Cost Analysis", "item": CANONICAL },
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
            <span className="text-white/35">IT Cost Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Information Technology Cost Analysis for Small Businesses
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            A structured, no-obligation review of your current vendor stack, monthly spend, and compliance posture — giving you a complete picture before any decisions are made.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Most small businesses do not have a single place where all information technology costs are tracked. Vendors bill separately, subscriptions accumulate, and license counts drift away from actual headcount. The cost analysis creates that single picture — <strong className="text-white">vendor by vendor, tool by tool, per user per month</strong> — and surfaces the overlaps and gaps before a review or incident forces the issue.
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
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "Try the free self-service cost tool", href: "/cost-analysis" },
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
        title="Ready to see the full picture of your current IT spend?"
        subtitle="Schedule a free cost analysis — a working session where we map your vendor stack, calculate your total monthly spend, and identify where the money is going."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "Try the Self-Service Tool", href: "/cost-analysis", primary: false },
        ]}
      />
    </div>
  );
}
