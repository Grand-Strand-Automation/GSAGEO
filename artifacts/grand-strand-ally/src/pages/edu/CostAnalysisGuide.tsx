import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/what-an-it-cost-analysis-should-include";
const TITLE = "What an IT Cost Analysis Should Include";
const DESC =
  "A real IT cost analysis should include a vendor inventory, spend breakdown by category, overlap assessment, Microsoft 365 licensing review, and compliance gap summary — not a quote for new services. Here is what to expect and what to watch out for.";

const ELEMENTS = [
  {
    num: "01",
    title: "A complete vendor and subscription inventory",
    desc: "The analysis should start by building a list of every vendor, contract, and subscription the business currently pays for — not just the ones managed by your current information technology provider. This includes credit card subscriptions, annual contracts, and vendor relationships managed directly by the business.",
    includes: [
      "All recurring information technology costs across all payment methods",
      "Vendor name, purpose, monthly or annual cost, and ownership",
      "Annual and multi-year contracts that may not appear on monthly statements",
      "Software subscriptions managed outside the information technology department",
    ],
    flag: "A cost analysis that starts with your current information technology provider's toolset and works outward from there is likely to miss vendor relationships that fall outside their visibility.",
  },
  {
    num: "02",
    title: "A spend breakdown by capability category",
    desc: "Once the vendor inventory exists, each item should be assigned to a capability category — support, security, backup, identity and access, Microsoft 365, and cloud software. The category view makes overlap visible and enables comparison against typical per-user costs for each area.",
    includes: [
      "Total monthly and annual spend by category",
      "Per-user cost for each category where applicable",
      "Comparison against typical market ranges for businesses of similar size",
      "Identification of categories where spend is significantly above or below typical ranges",
    ],
    flag: "A cost analysis that summarizes total spend without breaking it down by category cannot tell you where costs are misaligned or where overlap exists.",
  },
  {
    num: "03",
    title: "An assessment of tool overlap and redundancy",
    desc: "The overlap assessment examines each capability category for cases where multiple vendors are providing similar or identical capabilities. It should identify specific tools that are redundant, explain why the overlap is happening, and estimate the cost of that redundancy.",
    includes: [
      "Categories where more than one vendor provides similar capability",
      "Specific tools identified as potentially redundant with explanation",
      "Estimate of monthly cost that could be eliminated through consolidation",
      "Recommendation on which vendor to retain and why, where consolidation is appropriate",
    ],
    flag: "An overlap assessment that recommends replacing your entire tool stack with a new one is not an overlap assessment — it is a sales proposal. A genuine assessment starts from what you have and finds what can be simplified.",
  },
  {
    num: "04",
    title: "A Microsoft 365 licensing review",
    desc: "For businesses using Microsoft 365, the analysis should review license assignment, tier appropriateness, and configuration. Microsoft 365 is one of the most common sources of both overspend and underutilization in small business environments.",
    includes: [
      "Current license tier and count versus active user count",
      "Licenses assigned to disabled, departed, or inactive accounts",
      "Whether current license tier includes security and compliance features that are being purchased separately",
      "Basic assessment of whether security features included in the license are configured and active",
    ],
    flag: "A Microsoft 365 review that focuses only on licensing cost without examining configuration misses the most common Microsoft 365 issue: features that are licensed but not configured, creating the appearance of a need for additional tools.",
  },
  {
    num: "05",
    title: "A compliance and access control gap summary",
    desc: "Even in businesses without formal compliance programs, several control areas are worth reviewing: multi-factor authentication coverage, onboarding and offboarding documentation, admin role management, backup ownership, and access tracking. The analysis should summarize gaps in plain language with practical prioritization.",
    includes: [
      "Multi-factor authentication — is it enabled for all users, or only some?",
      "Onboarding and offboarding — are processes documented and consistently followed?",
      "Admin roles — who currently has elevated access, and is it reviewed regularly?",
      "Backup ownership — who is responsible for verifying backups are working?",
      "Access management — are access changes tracked when employees join, change roles, or leave?",
    ],
    flag: "A compliance summary that generates a long list of findings without prioritization is not useful. The most valuable findings are the ones with the highest impact-to-effort ratio — those are what should be addressed first.",
  },
];

const WHAT_YOU_RECEIVE = [
  "A written summary of findings, not just a verbal presentation",
  "Specific, named tools or vendors identified as sources of overlap or waste — not generic categories",
  "A prioritized list of recommendations ranked by impact and ease of implementation",
  "Estimated cost savings where consolidation is recommended, with supporting logic",
  "A proposed support scope if an ongoing engagement is appropriate — with line-by-line scope definition and monthly pricing",
  "No obligation to proceed — the analysis stands on its own as a useful document",
];

const RED_FLAGS = [
  {
    flag: "The analysis starts with a product pitch",
    why: "A genuine cost analysis is investigative. If the first meeting includes a feature comparison of the provider's tools before understanding your current environment, the analysis is structured to justify a sale, not to find the truth.",
  },
  {
    flag: "The analysis recommends replacing your entire tool stack",
    why: "Wholesale replacement is rarely the right answer for a small business that has functional systems. A provider who recommends starting over before understanding what you have is optimizing for their revenue, not your outcomes.",
  },
  {
    flag: "No written deliverable is produced",
    why: "Findings delivered verbally cannot be evaluated, compared, or acted on independently. A real analysis produces a written document you can keep, share with another party, or use as a reference regardless of whether you engage further.",
  },
  {
    flag: "Savings are claimed without supporting logic",
    why: "A claim that \"most businesses save 30%\" without a breakdown of where those savings come from is marketing language, not analysis. Specific savings estimates should trace back to specific identified items: named tool X costs $Y per month and duplicates capability Z already included in your Microsoft 365 subscription.",
  },
  {
    flag: "The process requires signing a contract before findings are shared",
    why: "Findings should be shared before any engagement begins. A provider that requires a contract as a condition of receiving the analysis output is not offering a free analysis — they are using the analysis as a sales mechanism.",
  },
];

export default function CostAnalysisGuide() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{TITLE} | Grand Strand Ally</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "headline": TITLE,
              "description": DESC,
              "datePublished": "2026-06-01",
              "dateModified": "2026-06-01",
              "author": { "@id": "https://gsally.com/#organization" },
              "publisher": { "@id": "https://gsally.com/#organization" },
              "mainEntityOfPage": { "@type": "WebPage", "@id": CANONICAL },
              "isPartOf": { "@id": "https://gsally.com/#website" }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Resources", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 3, "name": TITLE, "item": CANONICAL }
              ]
            }
          ]
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-14 md:pt-36 md:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors">Grand Strand Ally</Link>
            <span>/</span>
            <span className="text-white/35">Resources</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            What an Information Technology Cost Analysis Should Include
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Five elements a real cost analysis should cover — and five red flags that suggest you are getting a sales pitch instead.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          {/* Direct answer */}
          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Short answer</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              A real information technology cost analysis should include: <strong className="text-white">(1) a complete vendor and subscription inventory</strong>, <strong className="text-white">(2) a spend breakdown by category</strong>, <strong className="text-white">(3) an overlap and redundancy assessment</strong>, <strong className="text-white">(4) a Microsoft 365 licensing review</strong>, and <strong className="text-white">(5) a compliance and access control gap summary</strong>. It should produce a written deliverable you keep regardless of whether you proceed with the provider. It should not begin with a product recommendation.
            </p>
          </div>

          <article className="space-y-12">

            {/* What it should NOT be */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What a cost analysis should not be</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                The term "cost analysis" is used loosely in the managed services industry. In many cases, what is offered as a cost analysis is a structured sales process — a discovery call designed to identify the gaps that the provider's product stack addresses.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                A genuine cost analysis is investigative and tool-agnostic. It starts from your current environment, builds an accurate picture of what you have, what it costs, and where the gaps are — and only then considers what changes would be beneficial. The provider's own tools may or may not be the right answer. That question should come at the end, not the beginning.
              </p>
            </section>

            {/* Five elements */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-6">Five elements a real cost analysis should cover</h2>
              <div className="space-y-5">
                {ELEMENTS.map((el) => (
                  <div key={el.num} className="bg-white border border-[#D7E1EA] rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-[#D7E1EA] bg-[#F7F5F1] flex items-start gap-4">
                      <span className="text-[12px] font-bold text-[#1F5E95] bg-[#DCEAF7] px-2.5 py-1 rounded-md shrink-0">{el.num}</span>
                      <h3 className="text-[16px] font-heading font-bold text-[#0E2F54] leading-snug">{el.title}</h3>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                      <p className="text-sm text-[#4B5B6B] leading-relaxed">{el.desc}</p>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-2.5">Should include:</p>
                        <ul className="space-y-1.5">
                          {el.includes.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-[#4B5B6B]">
                              <CheckCircle2 size={12} className="text-[#1F5E95] shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                        <p className="text-xs text-amber-800 leading-relaxed">
                          <span className="font-bold">Watch out:</span> {el.flag}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What you should receive */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What you should receive at the end</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Regardless of whether you proceed with the provider, a genuine cost analysis should produce a document you can use independently. At minimum, that document should include:
              </p>
              <ul className="space-y-2.5">
                {WHAT_YOU_RECEIVE.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Red flags */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Five red flags that suggest a sales pitch, not an analysis</h2>
              <div className="space-y-3">
                {RED_FLAGS.map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5 border-l-4 border-l-red-300">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                      <h3 className="text-sm font-heading font-bold text-[#0E2F54]">{item.flag}</h3>
                    </div>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed pl-5">{item.why}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How to use this */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">How to use this guide before engaging a provider</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Before scheduling a cost analysis with any provider, ask two questions: What will I receive at the end, and what does it cost? If the deliverable is vague or the analysis requires a contract before findings are shared, that is worth noting.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                You can also run a rough version of elements one and two yourself using our guide on{" "}
                <Link href="/how-to-find-overlapping-it-tools-and-vendors" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium underline underline-offset-2">
                  finding overlapping information technology tools and vendors
                </Link>{" "}
                and the benchmarks in our guide on{" "}
                <Link href="/how-much-should-a-small-business-spend-on-it-support" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium underline underline-offset-2">
                  how much small businesses typically spend on information technology support
                </Link>
                . That gives you a baseline before any external conversation begins.
              </p>
            </section>

            {/* Internal links */}
            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "Small business offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "IT cost analysis service", href: "/it-cost-analysis" },
                  { label: "View our services", href: "/services" },
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
        title="See what a real cost analysis looks like."
        subtitle="The Grand Strand Ally cost analysis covers all five elements described here — and produces a written summary you keep, with or without an ongoing engagement."
        buttons={[
          { label: "Start the Free Cost Analysis", href: "/cost-analysis", primary: true },
          { label: "See Our Process", href: "/process", primary: false },
        ]}
      />
    </div>
  );
}
