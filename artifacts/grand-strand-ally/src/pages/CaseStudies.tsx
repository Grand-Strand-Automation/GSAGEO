import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, ArrowRight, Tag } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/case-studies";
const TITLE = "Case Studies | Grand Strand Ally — Real Results for Grand Strand Businesses";
const DESC =
  "Proof summaries from Grand Strand Ally engagements: license reclamation, vendor consolidation, Microsoft 365 cleanup, and compliance improvements for small businesses across the Myrtle Beach area.";

interface CaseStudy {
  id: string;
  industry: string;
  size: string;
  location: string;
  headline: string;
  situation: string;
  findings: string[];
  actions: string[];
  outcomes: { label: string; value: string }[];
  tags: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "healthcare-practice",
    industry: "Healthcare Practice",
    size: "18 users · 2 locations",
    location: "Myrtle Beach area",
    headline: "Six unused Microsoft 365 licenses and an unreviewed admin account roster",
    situation:
      "A local medical practice had grown to 18 employees over four years, adding Microsoft 365 users as staff joined and rarely removing them when people left. The cost analysis revealed 6 licenses assigned to former employees, 7 accounts with global admin access, and a separate endpoint security subscription that duplicated capabilities included in their existing Microsoft 365 Business Premium licenses.",
    findings: [
      "6 Microsoft 365 licenses assigned to inactive or former employee accounts — $132/month in unused spend",
      "7 users with global admin access in the Microsoft 365 tenant; only 2 roles were operationally necessary",
      "A standalone endpoint security subscription ($74/month) duplicating Microsoft Defender, which was already active in their license tier",
    ],
    actions: [
      "Disabled and reclaimed all 6 inactive licenses following a documented review with the office manager",
      "Reduced global admin accounts from 7 to 2 and documented the remaining roles",
      "Configured Microsoft Defender for Endpoint using the existing Business Premium license and cancelled the redundant subscription",
      "Built a one-page offboarding checklist the office manager now uses for every departure",
    ],
    outcomes: [
      { label: "Monthly recurring savings", value: "$206" },
      { label: "Annual recurring savings", value: "$2,472" },
      { label: "Admin accounts removed", value: "5 of 7" },
      { label: "Documented processes", value: "Onboarding + offboarding" },
    ],
    tags: ["Microsoft 365", "License reclamation", "Access management", "Compliance"],
  },
  {
    id: "hospitality-management",
    industry: "Hospitality and Property Management",
    size: "25 users · 3 locations",
    location: "Grand Strand",
    headline: "Split support across two vendors, a backup gap, and no single point of accountability",
    situation:
      "A property management company with three locations had accumulated separate support vendors at each site. No single vendor had visibility across all three. A backup review found that one server at the second location had not been included in the backup job for over eight months — a gap that had gone unnoticed because no one was responsible for verifying backup coverage across all sites.",
    findings: [
      "Three separate vendor relationships providing overlapping support with no coordination",
      "A server at the second location excluded from the backup job for an estimated 8+ months",
      "No centralized Microsoft 365 administration — each location had been set up independently with inconsistent security settings",
    ],
    actions: [
      "Consolidated support to a single vendor relationship with visibility across all three locations",
      "Resolved the backup gap and implemented monthly backup verification reviews",
      "Standardized Microsoft 365 security settings and multi-factor authentication across all users at all locations",
      "Established a single admin account and documented configuration for each location's network",
    ],
    outcomes: [
      { label: "Monthly support savings", value: "~28%" },
      { label: "Backup gap resolved", value: "8+ months unprotected" },
      { label: "Vendor relationships", value: "3 → 1" },
      { label: "Users with MFA enabled", value: "0 → 25" },
    ],
    tags: ["Vendor consolidation", "Backup and recovery", "Microsoft 365", "Multi-factor authentication"],
  },
  {
    id: "construction-firm",
    industry: "Construction and Real Estate",
    size: "12 users · 1 location",
    location: "Conway / Myrtle Beach area",
    headline: "Paying for Microsoft 365 Business Premium while using it like a Basic subscription",
    situation:
      "A 12-person construction firm was licensed for Microsoft 365 Business Premium but had never had the security features configured. They were also paying a third-party vendor for multi-factor authentication and a separate antivirus subscription — both of which were redundant with capabilities included in Business Premium that were simply not turned on.",
    findings: [
      "Multi-factor authentication subscription ($38/month) duplicating Microsoft 365 built-in multi-factor authentication",
      "Antivirus software ($48/month) duplicating Microsoft Defender, which was active in Business Premium",
      "Microsoft 365 Conditional Access, Defender for Office 365, and Intune all licensed but unconfigured",
    ],
    actions: [
      "Configured multi-factor authentication using Microsoft 365's built-in capabilities and cancelled the standalone subscription",
      "Activated and configured Microsoft Defender on all endpoints and cancelled the third-party antivirus",
      "Configured Conditional Access policies to block sign-in from unrecognized devices",
      "Enrolled all company devices in Intune for centralized device management using the existing license",
    ],
    outcomes: [
      { label: "Monthly recurring savings", value: "$86" },
      { label: "Annual recurring savings", value: "$1,032" },
      { label: "Security tools activated", value: "3 (already paid for)" },
      { label: "Devices under management", value: "12 of 12" },
    ],
    tags: ["Microsoft 365", "Cost consolidation", "Security configuration", "Vendor simplification"],
  },
  {
    id: "professional-services",
    industry: "Professional Services",
    size: "32 users · 1 location",
    location: "Myrtle Beach area",
    headline: "Four former employees with active accounts and no documented offboarding process",
    situation:
      "A professional services firm with 32 employees had no formal information technology offboarding process. The cost analysis identified four former employees with active Microsoft 365 accounts, two of whom still had licenses assigned. Additionally, no documented onboarding process existed, meaning new hires received inconsistent access and setup depending on who handled their first day.",
    findings: [
      "4 former employee accounts still active in Microsoft 365; 2 still with assigned paid licenses ($44/month)",
      "No documented onboarding or offboarding process — setup was handled informally by whoever was available",
      "11 users without multi-factor authentication enabled despite a client data handling requirement",
    ],
    actions: [
      "Disabled all 4 former employee accounts following a review with the managing partner",
      "Reclaimed both assigned licenses and converted the mailboxes to shared mailboxes for reference access",
      "Built a documented onboarding and offboarding checklist in Microsoft 365 and trained the office coordinator on the process",
      "Enabled multi-factor authentication for all 32 users with a phased rollout over two weeks to minimize disruption",
    ],
    outcomes: [
      { label: "Monthly license savings", value: "$44 immediate" },
      { label: "Former accounts disabled", value: "4" },
      { label: "Users with MFA enabled", value: "0 → 32" },
      { label: "Documented processes", value: "Full onboarding + offboarding" },
    ],
    tags: ["Access management", "Microsoft 365", "Compliance", "Onboarding and offboarding"],
  },
];

function OutcomeCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0E2F54] rounded-xl px-4 py-3.5 text-center">
      <p className="text-white font-bold text-lg leading-tight">{value}</p>
      <p className="text-white/50 text-[11px] mt-0.5 leading-snug">{label}</p>
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <article
      id={cs.id}
      className="bg-white border border-[#D7E1EA] rounded-2xl overflow-hidden shadow-sm"
      style={{ scrollMarginTop: "88px" }}
    >
      {/* Header */}
      <div className="px-7 py-6 border-b border-[#D7E1EA] bg-[#F7F5F1]">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1F5E95] bg-[#DCEAF7] px-3 py-1 rounded-full">
            {cs.industry}
          </span>
          <span className="text-[11px] text-[#4B5B6B]">{cs.size}</span>
          <span className="text-[11px] text-[#4B5B6B]">·</span>
          <span className="text-[11px] text-[#4B5B6B]">{cs.location}</span>
        </div>
        <h2 className="text-xl font-heading font-bold text-[#0E2F54] leading-snug">{cs.headline}</h2>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#D7E1EA]">
        <div className="px-7 py-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-2">Situation</p>
            <p className="text-sm text-[#4B5B6B] leading-relaxed">{cs.situation}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-2.5">What the cost analysis found</p>
            <ul className="space-y-2">
              {cs.findings.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#4B5B6B]">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-7 py-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-2.5">What was done</p>
            <ul className="space-y-2">
              {cs.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#4B5B6B]">
                  <CheckCircle2 size={12} className="text-[#1F5E95] shrink-0 mt-0.5" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-2.5">Outcomes</p>
            <div className="grid grid-cols-2 gap-2">
              {cs.outcomes.map((o, i) => (
                <OutcomeCard key={i} label={o.label} value={o.value} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: tags */}
      <div className="px-7 py-4 border-t border-[#D7E1EA] flex flex-wrap gap-2">
        {cs.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4B5B6B] bg-[#F7F5F1] border border-[#D7E1EA] rounded-full px-3 py-1">
            <Tag size={9} />
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function CaseStudies() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Case Studies | Grand Strand Ally — Real Results" />
        <meta name="twitter:description" content={DESC} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ItemList",
              "name": "Grand Strand Ally Case Studies",
              "description": DESC,
              "url": CANONICAL,
              "itemListElement": CASE_STUDIES.map((cs, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": `${cs.industry}: ${cs.headline}`,
                "url": `${CANONICAL}#${cs.id}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Case Studies", "item": CANONICAL }
              ]
            }
          ]
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            Client results
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            Results from real engagements.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
            Proof summaries from Grand Strand Ally cost analyses and engagements. Every finding listed here came from a business's actual environment — identified through a structured review, not assumed.
          </p>
        </div>
      </section>

      {/* ── Disclaimer / framing ── */}
      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl py-5">
          <p className="text-sm text-[#4B5B6B] text-center leading-relaxed">
            All summaries are anonymized. Industry, size, and location are general. Specific savings figures reflect documented findings from individual engagements and should not be taken as a guarantee of comparable outcomes.{" "}
            <Link href="/what-an-it-cost-analysis-should-include" className="text-[#1F5E95] hover:text-[#0E2F54] font-medium transition-colors">
              Learn what a real cost analysis should include →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Case studies ── */}
      <section className="py-14 md:py-20 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl space-y-7">
          {CASE_STUDIES.map((cs) => (
            <CaseStudyCard key={cs.id} cs={cs} />
          ))}
        </div>
      </section>

      {/* ── Common themes ── */}
      <section className="py-14 md:py-18 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Patterns across engagements
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54]">
              The same issues appear in most small business environments.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                stat: "4 out of 4",
                label: "Had Microsoft 365 features paid for but not configured or actively used",
                href: "/services",
              },
              {
                stat: "3 out of 4",
                label: "Had at least one former employee account still active at the time of review",
                href: "/small-business-offboarding-checklist",
              },
              {
                stat: "3 out of 4",
                label: "Were paying for a tool or subscription that duplicated a capability in an existing one",
                href: "/how-to-find-overlapping-it-tools-and-vendors",
              },
              {
                stat: "4 out of 4",
                label: "Had no fully documented onboarding or offboarding process before the engagement",
                href: "/small-business-offboarding-checklist",
              },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="group bg-[#F7F5F1] hover:bg-[#DCEAF7]/40 border border-[#D7E1EA] hover:border-[#1F5E95] rounded-xl p-5 transition-colors">
                <p className="text-3xl font-heading font-extrabold text-[#0E2F54] mb-2">{item.stat}</p>
                <p className="text-sm text-[#4B5B6B] leading-relaxed group-hover:text-[#0E2F54] transition-colors">{item.label}</p>
                <p className="text-[11px] font-bold text-[#1F5E95] mt-3 flex items-center gap-1">Learn more <ArrowRight size={11} /></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── What comes next ── */}
      <section className="py-12 bg-[#F7F5F1] border-t border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="bg-white border border-[#D7E1EA] rounded-2xl p-7 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-3">More coming</p>
                <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-3 leading-snug">
                  These summaries will grow as more engagements complete.
                </h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">
                  Each summary represents a real cost analysis or active engagement. As more reviews complete, additional proof summaries will be added here — organized by industry, finding type, and outcome.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-3">Related reading</p>
                {[
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "Small business offboarding checklist", href: "/small-business-offboarding-checklist" },
                  { label: "See all services", href: "/services" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center gap-2 text-sm font-medium text-[#0E2F54] hover:text-[#1F5E95] transition-colors">
                    <ArrowRight size={12} className="text-[#1F5E95] shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        title="Find out what your environment looks like."
        subtitle="Every engagement on this page started with a free cost analysis. It takes about 30 minutes of your time and produces a written summary of findings — no commitment required."
        buttons={[
          { label: "Start the Free Cost Analysis", href: "/free-it-cost-analysis", primary: true },
          { label: "Schedule a Conversation", href: "/contact#contact-form", primary: false },
        ]}
      />
    </div>
  );
}
