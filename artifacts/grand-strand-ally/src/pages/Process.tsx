import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Search, Layers, ShieldCheck, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { CTABand } from "@/components/CTABand";
import { GeoCTABlock } from "@/components/GeoCTABlock";

const STEPS = [
  {
    number: "01",
    label: "Review",
    icon: Search,
    headline: "Understand what is actually in place.",
    summary: "We begin every engagement by mapping your current environment — not by proposing solutions. This step is about building an accurate picture before making any recommendations.",
    details: [
      "Inventory of all active vendors, subscriptions, and monthly costs",
      "Review of Microsoft 365 licensing, user accounts, and admin configuration",
      "Assessment of current support model, coverage, and ownership",
      "Identification of security tools in use and their scope",
      "Review of backup and recovery setup and documentation",
      "Understanding of onboarding and offboarding processes currently in place",
    ],
    outcome: "A clear map of your current environment — costs, tools, vendors, gaps, and coverage — that most businesses do not have when we start.",
    duration: "Typically completed in the first 1–2 meetings.",
  },
  {
    number: "02",
    label: "Identify",
    icon: Layers,
    headline: "Find what can be simplified, consolidated, or improved.",
    summary: "With a clear picture of your current environment, we analyze it for overlap, inefficiency, and risk. This is where most of the value from the cost analysis comes from.",
    details: [
      "Identify overlapping tools — especially in security, backup, and user management",
      "Spot Microsoft 365 licensing that is over-provisioned or misaligned",
      "Find former employee accounts, unused licenses, or unmanaged access",
      "Surface compliance and control gaps — particularly around access management and multi-factor authentication",
      "Identify vendor relationships that can be consolidated without losing capability",
      "Quantify estimated monthly and annual savings opportunities",
    ],
    outcome: "A prioritized list of specific findings — not generic recommendations — with estimated cost and risk impact for each item.",
    duration: "Usually takes 3–5 business days after the Review step.",
  },
  {
    number: "03",
    label: "Strengthen",
    icon: ShieldCheck,
    headline: "Build a more consistent, more controlled foundation.",
    summary: "This is where we act on the highest-priority findings — tightening controls, cleaning up administration, and building the processes that support long-term operational consistency.",
    details: [
      "Standardize and document the onboarding and offboarding process",
      "Clean up Microsoft 365 — licensing alignment, user and group cleanup, admin role review",
      "Implement or verify multi-factor authentication coverage across all users",
      "Consolidate overlapping security or backup tools where appropriate",
      "Establish clear ownership for support, backup, and access management",
      "Document current configuration so it is not lost when team members change",
    ],
    outcome: "A more consistent environment with clear ownership, documented processes, and fewer compliance gaps — without unnecessary replacement of tools that are working.",
    duration: "Timeline varies by scope. Most foundational improvements complete within 30–60 days.",
  },
  {
    number: "04",
    label: "Improve",
    icon: TrendingUp,
    headline: "Keep improving over time — practically, not perpetually.",
    summary: "Ongoing support is not a maintenance contract that keeps things static. It is a continuing process of identifying new opportunities, responding to changes in your business, and building on the foundation established in the first three steps.",
    details: [
      "Regular review of costs and vendor relationships for new consolidation opportunities",
      "Ongoing Microsoft 365 administration — new users, license changes, policy updates",
      "Quarterly review of access management and user accounts",
      "Support for new hires and departing employees through documented workflows",
      "Adjustment of support scope as your team or requirements change",
      "Proactive identification of risks before they become incidents",
    ],
    outcome: "A support relationship that stays accountable and useful over time — not one that grows in cost and complexity without clear value being added.",
    duration: "Month-to-month with clear scope. Scope reviewed and adjusted as your business evolves.",
  },
];

const WHAT_THIS_IS_NOT = [
  "Not a discovery process designed to justify a full platform migration",
  "Not a process that requires replacing tools before value is demonstrated",
  "Not a multi-month onboarding with a large upfront fee",
  "Not a process that ends with a vague roadmap and no actionable next steps",
  "Not a compliance audit or formal security assessment",
  "Not a sales funnel for proprietary software or preferred vendor relationships",
];

export default function Process() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Our Four-Step Process | Grand Strand Ally — IT Support Myrtle Beach</title>
        <meta
          name="description"
          content="Grand Strand Ally follows a four-step process: Review your current environment, Identify opportunities, Strengthen controls and operations, then Improve over time. Learn how we work with small and medium businesses in the Grand Strand."
        />
        <link rel="canonical" href="https://gsally.com/process" />
        <meta property="og:title" content="Our Four-Step Process | Grand Strand Ally — Myrtle Beach IT Support" />
        <meta property="og:description" content="A four-step process built around clarity before commitment: Review, Identify, Strengthen, Improve. No forced tool replacements. No long-term lock-in." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gsally.com/process" />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Process | Grand Strand Ally — Review, Identify, Strengthen, Improve" />
        <meta name="twitter:description" content="A four-step process built around clarity before commitment. No forced tool replacements. No long-term lock-in." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "HowTo",
              "name": "Grand Strand Ally Information Technology Engagement Process",
              "description": "A four-step process for reviewing, improving, and supporting information technology environments for small and medium businesses.",
              "provider": { "@id": "https://gsally.com/#organization" },
              "step": STEPS.map((s) => ({
                "@type": "HowToStep",
                "name": s.label,
                "text": s.summary,
              })),
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Our Process", "item": "https://gsally.com/process" }
              ]
            }
          ]
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-[#0E2F54] text-white pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-7 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            How we work
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            A structured process built around clarity before commitment.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
            We follow four steps — Review, Identify, Strengthen, Improve — designed to give you an accurate picture of your environment before recommending anything. No forced migrations. No assumptions. No lock-in.
          </p>
        </div>
      </section>

      {/* ── Step overview strip ── */}
      <div className="bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#D7E1EA]">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.number} className="flex items-center gap-3 py-5 sm:px-8 sm:flex-col sm:text-center sm:gap-2">
                  <div className="w-8 h-8 bg-[#DCEAF7] rounded-lg flex items-center justify-center shrink-0 text-[#1F5E95]">
                    <Icon size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4B5B6B] block">{s.number}</span>
                    <span className="text-sm font-heading font-bold text-[#0E2F54]">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Detailed steps ── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 1;
              return (
                <div
                  key={step.number}
                  id={`step-${step.label.toLowerCase()}`}
                  className="bg-white border border-[#D7E1EA] rounded-2xl overflow-hidden shadow-sm"
                  style={{ scrollMarginTop: "88px" }}
                >
                  {/* Step header */}
                  <div className={`px-7 py-6 border-b border-[#D7E1EA] flex items-start gap-5 ${isEven ? "bg-[#F7F5F1]" : "bg-white"}`}>
                    <div className="w-12 h-12 bg-[#0E2F54] rounded-xl flex items-center justify-center shrink-0 text-white">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B]">Step {step.number}</span>
                        <span className="h-px w-6 bg-[#D7E1EA] inline-block" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F5E95]">{step.label}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-heading font-bold text-[#0E2F54] leading-snug">
                        {step.headline}
                      </h2>
                    </div>
                  </div>

                  {/* Step body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#D7E1EA]">
                    <div className="px-7 py-6">
                      <p className="text-[15px] text-[#4B5B6B] leading-relaxed mb-5">{step.summary}</p>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-3">What we do in this step</p>
                      <ul className="space-y-2">
                        {step.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-[#4B5B6B]">
                            <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-7 py-6 space-y-5">
                      <div className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1F5E95] mb-2">Outcome</p>
                        <p className="text-sm text-[#0E2F54] font-medium leading-relaxed">{step.outcome}</p>
                      </div>
                      <div className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-2">Typical timeline</p>
                        <p className="text-sm text-[#4B5B6B] leading-relaxed">{step.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What this is not ── */}
      <section className="py-16 md:py-20 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/25 inline-block" />
                Clarity of approach
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 leading-snug">
                What this process is not.
              </h2>
              <p className="text-white/55 text-sm leading-relaxed">
                Many engagements in the managed services space are structured to generate ongoing dependency and complexity. Ours is not. We want to be useful to you for a long time — but only because we are delivering clear value, not because the process requires it.
              </p>
            </div>
            <ul className="space-y-3 pt-2 md:pt-10">
              {WHAT_THIS_IS_NOT.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white/40">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Timeline expectations ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              What to expect
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54]">
              From first conversation to active support.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { week: "Week 1", label: "Initial conversation", desc: "30–60 min call to understand your environment, team, and priorities." },
              { week: "Week 1–2", label: "Review and findings", desc: "We assess current tools, costs, and gaps and compile a written summary." },
              { week: "Week 2", label: "Findings presentation", desc: "We walk through what we found and propose a specific support plan if there is a fit." },
              { week: "Week 3+", label: "Active support begins", desc: "If we move forward, scope is agreed in writing and work starts — month-to-month, no lock-in." },
            ].map((item) => (
              <div key={item.week} className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#1F5E95] mb-1.5">{item.week}</p>
                <p className="text-sm font-heading font-bold text-[#0E2F54] mb-2">{item.label}</p>
                <p className="text-xs text-[#4B5B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links ── */}
      <section className="py-10 bg-[#F7F5F1] border-t border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-5 text-center">Related pages</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "About Grand Strand Ally", href: "/about", desc: "Who we are, what we focus on, and who we help." },
              { label: "View our services", href: "/services", desc: "The specific service areas covered in each engagement." },
              { label: "Pricing and support models", href: "/pricing", desc: "How pricing is structured and what affects monthly cost." },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white border border-[#D7E1EA] hover:border-[#1F5E95] rounded-xl p-5 transition-colors"
              >
                <p className="text-sm font-heading font-bold text-[#0E2F54] group-hover:text-[#1F5E95] transition-colors mb-1 flex items-center gap-2">
                  {link.label} <ArrowRight size={13} />
                </p>
                <p className="text-xs text-[#4B5B6B] leading-snug">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GeoCTABlock
        headline="See How Your Website Looks to AI Search"
        body="While you review your IT environment, it is worth asking a parallel question: how clearly does your website explain what you do to AI-driven search tools? Our GEO assessment answers that."
        buttonText="Request an AI Visibility Assessment"
        supportText="Takes less than a day to complete."
        variant="dark"
        analyticsId="process-page"
      />

      <CTABand
        title="Ready to start the process?"
        subtitle="The first step is a free, no-obligation cost analysis. We review your current environment and share practical findings — no commitment required."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact#contact-form", primary: true },
          { label: "Read the FAQ", href: "/faq", primary: false },
        ]}
      />
    </div>
  );
}
