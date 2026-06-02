import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/how-much-should-a-small-business-spend-on-it-support";
const TITLE = "How Much Should a Small Business Spend on IT Support?";
const DESC =
  "Most small businesses spend $100–$200 per user per month on managed IT support. Here is what that number covers, what drives it higher or lower, and how to tell if your current spend is aligned with what you are actually getting.";

const COST_TABLE = [
  { category: "Managed support (helpdesk, monitoring, patching)", low: "$50", high: "$100", notes: "Per user per month" },
  { category: "Microsoft 365 Business Basic or Standard", low: "$6", high: "$22", notes: "Per user per month, direct from Microsoft" },
  { category: "Email security (filtering, anti-phishing)", low: "$3", high: "$10", notes: "Per user per month" },
  { category: "Endpoint security (managed detection and response)", low: "$5", high: "$15", notes: "Per device per month" },
  { category: "Backup and recovery (cloud + local)", low: "$10", high: "$30", notes: "Per device or server per month" },
  { category: "Network and firewall management", low: "$50", high: "$200", notes: "Per location per month" },
  { category: "Identity and access management", low: "$3", high: "$12", notes: "Per user per month" },
];

const DRIVES_HIGHER = [
  "Multiple physical locations requiring on-site support or separate network equipment",
  "Regulated industries such as healthcare, financial services, or legal that require documented compliance controls",
  "Specialized line-of-business software requiring support and integration maintenance",
  "Older hardware or infrastructure requiring more active monitoring and maintenance",
  "Frequent onboarding and offboarding of employees requiring consistent process management",
  "After-hours or weekend support requirements",
];

const DRIVES_LOWER = [
  "A well-consolidated vendor stack with minimal overlap",
  "A single-location environment with modern, standardized hardware",
  "Fully cloud-based operations with little or no on-premises infrastructure",
  "A team that handles basic first-level troubleshooting internally",
  "A stable workforce with low onboarding and offboarding volume",
  "Clear documentation of systems and configurations that reduces diagnostic time",
];

const MISALIGNMENT_HIGH = [
  "You are paying multiple vendors for overlapping security or backup capabilities",
  "You have Microsoft 365 licenses assigned to former employees or unused accounts",
  "You are paying for a support contract that rarely gets used and has undefined scope",
  "You are paying hourly rates for reactive fixes that a managed model would cover at lower cost",
  "You have software subscriptions that no one on your team actively uses",
];

const MISALIGNMENT_LOW = [
  "No one knows the answer to basic questions — what is backed up, who has admin access, where files live",
  "Employee onboarding and offboarding is informal with no documented process",
  "Security incidents, ransomware events, or credential compromises have occurred",
  "Your support vendor responds slowly or provides vague answers about what is covered",
  "No regular review of who has access to what systems",
];

export default function HowMuchItSupport() {
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
            How Much Should a Small Business Spend on Information Technology Support?
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Practical benchmarks, cost categories, and how to tell if your current spend is aligned with what you are actually getting.
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
              Most small businesses with 10–50 employees spend between <strong className="text-white">$100 and $200 per user per month</strong> on managed information technology support — when that figure includes helpdesk, security, backup, and Microsoft 365 administration. Businesses with compliance requirements, multiple locations, or older infrastructure typically fall in the $150–$250 range. If your current spending is significantly above or below these ranges, it is worth reviewing what is and is not included.
            </p>
          </div>

          <article className="space-y-12">

            {/* What that covers */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What does that number typically cover?</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                The $100–$200 per user range assumes a full managed service model — meaning you pay a predictable monthly rate and the vendor handles monitoring, helpdesk, security, backup, and Microsoft 365 administration. It is not a break-fix model where you pay hourly for reactive work.
              </p>
              <div className="bg-white rounded-xl border border-[#D7E1EA] overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-[#0E2F54]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">Typical cost categories and ranges</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F7F5F1] border-b border-[#D7E1EA]">
                        <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#4B5B6B]">Category</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#4B5B6B] whitespace-nowrap">Low</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#4B5B6B] whitespace-nowrap">High</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#4B5B6B]">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COST_TABLE.map((row, i) => (
                        <tr key={i} className="border-b border-[#D7E1EA] last:border-b-0">
                          <td className="px-5 py-3.5 text-[#0E2F54] font-medium leading-snug">{row.category}</td>
                          <td className="px-4 py-3.5 text-[#4B5B6B] whitespace-nowrap">{row.low}</td>
                          <td className="px-4 py-3.5 text-[#4B5B6B] whitespace-nowrap">{row.high}</td>
                          <td className="px-4 py-3.5 text-[#4B5B6B] text-xs">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-[#4B5B6B]/70 mt-2 leading-relaxed">
                Ranges reflect typical managed service pricing in the US as of 2025. Actual pricing varies by vendor, region, and scope. A managed service provider may bundle several of these categories into a single per-user rate.
              </p>
            </section>

            {/* Drives higher */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What drives costs higher?</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Several factors consistently push information technology support costs above the baseline range. None of them are necessarily wrong — some reflect genuine complexity — but all of them are worth understanding explicitly.
              </p>
              <ul className="space-y-2.5">
                {DRIVES_HIGHER.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">↑</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Drives lower */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What drives costs lower?</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Environments that are well-organized, consolidated, and cloud-native typically cost less to support. These are also environments where it is easier to get real value from a managed service relationship.
              </p>
              <ul className="space-y-2.5">
                {DRIVES_LOWER.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Misalignment */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Signs your spending may be misaligned</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                The goal is not to spend the minimum possible — it is to have a clear connection between what you spend and the protection, reliability, and operational support you are getting in return. These are signs that connection may be broken.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                    <p className="text-[12px] font-bold uppercase tracking-wide text-[#4B5B6B]">Possibly overspending if...</p>
                  </div>
                  <ul className="space-y-2">
                    {MISALIGNMENT_HIGH.map((item, i) => (
                      <li key={i} className="text-sm text-[#4B5B6B] leading-relaxed flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-2 shrink-0 inline-block" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={13} className="text-red-500 shrink-0" />
                    <p className="text-[12px] font-bold uppercase tracking-wide text-[#4B5B6B]">Possibly underspending if...</p>
                  </div>
                  <ul className="space-y-2">
                    {MISALIGNMENT_LOW.map((item, i) => (
                      <li key={i} className="text-sm text-[#4B5B6B] leading-relaxed flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-400 mt-2 shrink-0 inline-block" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* How to get a clearer picture */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">How to get a clearer picture of what you are spending</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Most small businesses do not have a single place where all information technology costs are tracked. Monthly spend is distributed across credit card charges, vendor invoices, and internal payroll — making it difficult to see the full picture without actively assembling it.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                A useful exercise is to list every vendor, subscription, and tool your business pays for and assign it to one of five categories: support, security, backup, identity and access, and cloud software. From there, look for categories where you are paying more than one vendor for similar capabilities. That overlap is usually the fastest source of cost reduction.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                For a more structured approach, see our guides on{" "}
                <Link href="/how-to-find-overlapping-it-tools-and-vendors" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium underline underline-offset-2">
                  how to find overlapping information technology tools and vendors
                </Link>{" "}
                and{" "}
                <Link href="/what-an-it-cost-analysis-should-include" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium underline underline-offset-2">
                  what an information technology cost analysis should include
                </Link>
                .
              </p>
            </section>

            {/* Internal links */}
            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "Small business offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "Managed IT support in Myrtle Beach", href: "/managed-it-support-myrtle-beach" },
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
        title="Not sure if your current spend is in the right range?"
        subtitle="The free Grand Strand Ally cost analysis walks through your current vendors and costs category by category and identifies where the typical savings opportunities are."
        buttons={[
          { label: "Start the Free Cost Analysis", href: "/cost-analysis", primary: true },
          { label: "Schedule a Conversation", href: "/contact#contact-form", primary: false },
        ]}
      />
    </div>
  );
}
