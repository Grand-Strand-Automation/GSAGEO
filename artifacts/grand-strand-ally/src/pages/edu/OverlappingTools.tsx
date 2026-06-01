import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/how-to-find-overlapping-it-tools-and-vendors";
const TITLE = "How to Find Overlapping IT Tools and Vendors";
const DESC =
  "Start with a vendor inventory, then map capabilities by category. Most small businesses find 2–4 areas where they are paying for the same capability twice — security and backup are the most common. Here is a practical step-by-step guide.";

const CATEGORIES = [
  { name: "Managed support", examples: "Helpdesk, remote monitoring, patch management, device management" },
  { name: "Email and productivity", examples: "Microsoft 365, Google Workspace, email hosting" },
  { name: "Email security", examples: "Anti-spam, anti-phishing, email filtering, safe links" },
  { name: "Endpoint security", examples: "Antivirus, endpoint detection and response, managed detection and response" },
  { name: "Backup and recovery", examples: "Cloud backup, local backup appliance, image-based backup, file sync" },
  { name: "Network and firewall", examples: "Firewall management, Wi-Fi management, intrusion detection" },
  { name: "Identity and access", examples: "Multi-factor authentication, single sign-on, password management" },
  { name: "Cloud and line-of-business software", examples: "Any specialized tools, vertical software, automation tools" },
];

const OVERLAP_PATTERNS = [
  {
    title: "Security tool overlap",
    desc: "The most common. A managed service provider includes antivirus, and the business separately pays for an endpoint security tool from a different vendor. The tools may not conflict technically, but you are likely paying for redundant protection layers with no one responsible for reconciling alerts.",
  },
  {
    title: "Backup tool overlap",
    desc: "Businesses often have a backup appliance from one vendor, cloud backup from another, and Microsoft 365 data synced to OneDrive. All three serve overlapping purposes. Worse, no single vendor is accountable for the full picture — meaning gaps exist that no one is explicitly monitoring.",
  },
  {
    title: "Email security overlap",
    desc: "Microsoft 365 Business Premium includes Defender for Office 365, which provides filtering, safe links, and anti-phishing. Many businesses also pay a third-party email security vendor for similar capabilities. Depending on configuration, one layer is often redundant.",
  },
  {
    title: "Identity and access overlap",
    desc: "Microsoft 365 includes multi-factor authentication and conditional access at most license tiers. Businesses that also pay for a separate multi-factor authentication tool are often duplicating a capability they already own.",
  },
  {
    title: "Productivity suite overlap",
    desc: "Teams that use Microsoft 365 for email and SharePoint sometimes also pay for Google Workspace, a separate file sharing tool, or a standalone project management platform that replicates functionality already included in their Microsoft 365 subscription.",
  },
];

const QUESTIONS_BEFORE_CUTTING = [
  "Is this tool actively being used, or has it been replaced in practice by something else?",
  "Who is responsible for monitoring alerts or outputs from this tool? If no one, what value is it providing?",
  "Does this tool fulfill a contractual, regulatory, or insurance requirement?",
  "Is this tool managed by someone, or is it installed and forgotten?",
  "If we removed this tool, what specific capability would we lose — and is that capability available elsewhere in what we already pay for?",
];

const CONSOLIDATION_STEPS = [
  "Identify which of the two overlapping tools is better managed, better integrated, or better supported by your current vendor",
  "Confirm there is no contractual or compliance reason to keep both",
  "Request a formal off-boarding from the vendor you are removing — including data export and license cancellation confirmation",
  "Update your vendor inventory and verify the monthly cost reduction on the next billing cycle",
  "Document the change so it is not reversed when personnel changes occur",
];

export default function OverlappingTools() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{TITLE} | Grand Strand Ally</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={CANONICAL} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": TITLE,
          "description": DESC,
          "author": { "@type": "Organization", "name": "Grand Strand Ally", "url": "https://gsally.com" },
          "publisher": { "@type": "Organization", "name": "Grand Strand Ally", "url": "https://gsally.com" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": CANONICAL },
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
            How to Find Overlapping Information Technology Tools and Vendors
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            A practical four-step process for identifying where your business is paying for the same capability twice — and what to do about it.
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
              Build a vendor inventory first — every subscription, contract, and tool your business pays for. Then assign each one to a category: support, security, backup, identity, email, or cloud software. <strong className="text-white">Overlap is almost always visible at the category level.</strong> Most small businesses find two to four areas where they are paying for the same capability twice. Security tools and backup tools are the most common.
            </p>
          </div>

          <article className="space-y-12">

            {/* Why overlap happens */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Why overlap accumulates in small business environments</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Tool overlap is almost never the result of a deliberate decision. It accumulates gradually — a vendor adds a security tool to a support contract, a new employee brings in a tool they used at a previous job, a compliance conversation prompts a purchase without auditing what is already in place, or a Microsoft 365 upgrade adds capabilities that no one recognized as duplicating existing subscriptions.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                The problem is compounded by the fact that most small businesses do not have a single person with visibility into all active subscriptions and contracts. Finance sees invoices. The information technology contact manages tools. But no one maintains a complete picture that connects the two. This guide is designed to help you build that picture.
              </p>
            </section>

            {/* Step 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#0E2F54] rounded-lg flex items-center justify-center text-white text-[13px] font-bold shrink-0">1</div>
                <h2 className="text-2xl font-heading font-bold text-[#0E2F54]">Build your vendor and subscription inventory</h2>
              </div>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                The starting point is a complete list of every vendor or software subscription your business pays for — including annual and multi-year contracts that may not appear on monthly statements. Pull from three sources:
              </p>
              <ul className="space-y-2.5 mb-5">
                {[
                  "Credit card and bank statements for the past three months — look for recurring charges",
                  "Vendor invoices or email confirmations from your inbox",
                  "Your managed service provider's documentation, if they maintain an inventory",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                For each item, record the vendor name, what it claims to do, the monthly or annual cost, and who owns the relationship. Do not try to evaluate anything yet — just build the list.
              </p>
            </section>

            {/* Step 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#0E2F54] rounded-lg flex items-center justify-center text-white text-[13px] font-bold shrink-0">2</div>
                <h2 className="text-2xl font-heading font-bold text-[#0E2F54]">Map each tool to a capability category</h2>
              </div>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Once you have the list, assign every item to one of the categories below. A single vendor often covers multiple categories — that is fine, and sometimes appropriate. What you are looking for is categories where <em>multiple vendors</em> are listed.
              </p>
              <div className="bg-white rounded-xl border border-[#D7E1EA] overflow-hidden shadow-sm">
                {CATEGORIES.map((cat, i) => (
                  <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < CATEGORIES.length - 1 ? "border-b border-[#D7E1EA]" : ""}`}>
                    <div className="w-2 h-2 rounded-full bg-[#1F5E95] shrink-0 mt-1.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0E2F54] mb-0.5">{cat.name}</p>
                      <p className="text-xs text-[#4B5B6B]">{cat.examples}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 3: Common patterns */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#0E2F54] rounded-lg flex items-center justify-center text-white text-[13px] font-bold shrink-0">3</div>
                <h2 className="text-2xl font-heading font-bold text-[#0E2F54]">Recognize the most common overlap patterns</h2>
              </div>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                Once you have your category map, look for categories with more than one entry. Below are the five most common overlap patterns found in small business environments:
              </p>
              <div className="space-y-3">
                {OVERLAP_PATTERNS.map((pattern, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5 border-l-4 border-l-amber-300">
                    <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{pattern.title}</h3>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{pattern.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 4: Before cutting */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#0E2F54] rounded-lg flex items-center justify-center text-white text-[13px] font-bold shrink-0">4</div>
                <h2 className="text-2xl font-heading font-bold text-[#0E2F54]">Evaluate consolidation before making changes</h2>
              </div>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Not all overlap should be eliminated. Some redundancy is intentional — for example, a backup appliance and cloud backup together provide protection that either one alone does not. Before removing a tool, work through these questions:
              </p>
              <ul className="space-y-2.5 mb-6">
                {QUESTIONS_BEFORE_CUTTING.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <span className="text-[#1F5E95] font-bold shrink-0">Q{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ul>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                When the answers support consolidation, follow a clean process:
              </p>
              <ol className="space-y-2.5">
                {CONSOLIDATION_STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <span className="w-5 h-5 rounded-full bg-[#DCEAF7] text-[#1F5E95] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            {/* Note on Microsoft 365 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">A note on Microsoft 365 and hidden capabilities</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Microsoft 365 Business Premium — and to a lesser extent Business Standard — includes security, backup, identity, and compliance features that many businesses are paying for separately from other vendors. Before purchasing a standalone security or backup tool, it is worth reviewing what your current Microsoft 365 license tier already includes.
              </p>
              <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
                The challenge is that Microsoft 365 capabilities require configuration to be active — they do not turn themselves on. An environment where Microsoft 365 Business Premium is licensed but security features are not configured may appear to need additional security tools when the right answer is configuration, not an additional purchase.
              </p>
            </section>

            {/* Internal links */}
            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "Small business offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "Try the free cost analysis tool", href: "/cost-analysis" },
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
        title="Want someone to map your vendor stack for you?"
        subtitle="The free Grand Strand Ally cost analysis builds a full category map of your current tools and identifies the most common overlap patterns — in one structured conversation."
        buttons={[
          { label: "Start the Free Cost Analysis", href: "/cost-analysis", primary: true },
          { label: "Schedule a Conversation", href: "/contact", primary: false },
        ]}
      />
    </div>
  );
}
