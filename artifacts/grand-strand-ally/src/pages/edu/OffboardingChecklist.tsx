import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/small-business-offboarding-checklist";
const TITLE = "Small Business Employee Offboarding Checklist for IT";
const DESC =
  "A complete IT offboarding checklist for small businesses: disable accounts, transfer ownership, reclaim licenses, recover hardware, and audit access — each step timed correctly to protect security and reduce cost.";

type CheckItem = { item: string; why?: string };

const BEFORE_LAST_DAY: CheckItem[] = [
  { item: "Notify your information technology contact or managed service provider of the departure date", why: "Gives time to prepare account disabling and device retrieval without rushing" },
  { item: "Identify all accounts associated with the employee — email, line-of-business software, cloud tools, and any admin roles", why: "Admin roles are often overlooked and can remain active for months" },
  { item: "Determine who will take ownership of the employee's email, files, and projects", why: "Establishes accountability before the account is disabled" },
  { item: "Schedule device recovery — laptop, phone, and any other company-owned equipment", why: "Uncollected hardware often disappears, along with company data on it" },
  { item: "Review whether the employee has access to any third-party systems not managed by your primary vendor (bank portals, insurance platforms, vendor logins)", why: "These are commonly missed and can remain active indefinitely" },
];

const DAY_OF: CheckItem[] = [
  { item: "Disable the Microsoft 365 account — block sign-in before or at the moment of departure", why: "Sign-in should be blocked on the last day, not after. A credential can be used at any time until it is disabled" },
  { item: "Revoke active sessions and tokens to force sign-out on all devices", why: "Blocking sign-in does not immediately terminate existing sessions" },
  { item: "Set up an out-of-office reply forwarding to the account owner before disabling outbound email", why: "Contacts attempting to reach the departed employee need a working alternative" },
  { item: "Collect company-owned hardware — laptop, phone, access badges, keys", why: "Delay in hardware recovery increases the risk of data being removed or the device being used to access company accounts" },
  { item: "Remove or change any shared credentials the employee had access to", why: "Shared passwords are commonly left unchanged because it is assumed someone else will do it" },
];

const WITHIN_24H: CheckItem[] = [
  { item: "Convert the Microsoft 365 mailbox to a shared mailbox so email remains accessible without a paid license", why: "Keeps the mailbox accessible to the manager or backup contact for no additional monthly cost" },
  { item: "Transfer OneDrive files to the designated owner or move to a SharePoint library", why: "OneDrive files are tied to the user account and become inaccessible if the account is deleted without transfer" },
  { item: "Remove the user from Microsoft 365 distribution lists, shared calendars, and Teams channels", why: "Departed employees remaining in active groups is a common audit finding" },
  { item: "Remove the user from any shared password or credential management systems", why: "Password manager membership is frequently not updated on departure" },
  { item: "Disable or reassign any multi-factor authentication methods associated with the account", why: "Active multi-factor authentication credentials on a disabled account are still a potential attack vector if the account is re-enabled" },
];

const WITHIN_ONE_WEEK: CheckItem[] = [
  { item: "Reclaim the Microsoft 365 license — remove the assigned license from the disabled account", why: "Microsoft charges for assigned licenses even on disabled accounts. A business with 30 users will typically find 2–4 licenses assigned to former employees" },
  { item: "Remove the user from any external systems: project management tools, marketing platforms, financial software, CRM, and similar", why: "External systems are the most common offboarding gap. They are not managed by your information technology vendor and must be handled separately" },
  { item: "Audit admin roles — verify the departed employee is removed from any elevated permissions in Microsoft 365, network equipment, and cloud platforms", why: "Admin access that remains after departure is a direct security risk" },
  { item: "Wipe and re-image company devices before reassigning or disposing of them", why: "Repurposing a device without wiping it risks exposing previous account data" },
  { item: "Document the offboarding in a written record — who, when, and what was completed", why: "Documentation is required for compliance in regulated industries and useful for internal accountability in all environments" },
];

const WITHIN_ONE_MONTH: CheckItem[] = [
  { item: "Verify the former employee's account is no longer reflected on vendor invoices and billing statements", why: "Some vendors continue billing for removed users unless explicitly notified — verify the reduction appeared" },
  { item: "Review whether any business-critical processes were dependent on the departed employee's personal account", why: "Automated emails, scheduled reports, and integrations often run under individual accounts and break silently on departure" },
  { item: "Confirm backup jobs and monitoring tasks do not reference the departed employee's device or account", why: "Backup jobs targeting removed devices generate errors and may be silently failing" },
  { item: "Update your employee and access inventory if one is maintained", why: "Keeps the inventory current for the next offboarding" },
];

const M365_STEPS: CheckItem[] = [
  { item: "Block sign-in in the Microsoft 365 admin center under Users → Active Users → Block sign-in" },
  { item: "Revoke all active sessions under the user's account properties" },
  { item: "Set an out-of-office reply and configure mail forwarding before converting the mailbox" },
  { item: "Convert the mailbox to a shared mailbox — this removes the license requirement while keeping email accessible" },
  { item: "Transfer OneDrive files using the OneDrive admin center before deleting the account" },
  { item: "Remove the user from all distribution groups, shared mailboxes, and Teams teams" },
  { item: "Remove all assigned licenses from the user before deletion to reclaim them" },
  { item: "If the user was a global admin, verify no admin roles remain assigned before disabling" },
  { item: "Delete or retain the account in accordance with your data retention policy — do not delete immediately if retention is required" },
];

const GAP_SIGNS = [
  "Former employees can still log in to company accounts days or weeks after departure",
  "Your Microsoft 365 license count does not decrease after employees leave",
  "You are not sure who currently has administrator access to your Microsoft 365 tenant",
  "OneDrive files from a departed employee became inaccessible because no transfer was done",
  "You have received emails from vendors addressed to employees who left more than six months ago",
  "A departing employee's email was still active when their replacement joined",
];

export default function OffboardingChecklist() {
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
            Small Business Employee Offboarding Checklist
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            A complete information technology offboarding checklist — organized by timing — covering account disabling, license reclamation, file transfer, hardware recovery, and access audits.
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
              A complete offboarding process covers five timing windows: <strong className="text-white">before the last day</strong> (notify, plan, assign ownership), <strong className="text-white">day of departure</strong> (block access, collect hardware, change shared credentials), <strong className="text-white">within 24 hours</strong> (convert mailbox, transfer files, remove from groups), <strong className="text-white">within one week</strong> (reclaim licenses, remove from external systems, audit admin roles), and <strong className="text-white">within one month</strong> (verify billing, check for broken automations). Most small businesses skip the license reclamation and external system steps.
            </p>
          </div>

          <article className="space-y-10">

            {/* Why it matters */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Why offboarding is both a security issue and a cost issue</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-[#D7E1EA] rounded-xl p-5 border-l-4 border-l-red-400">
                  <h3 className="text-sm font-bold text-[#0E2F54] mb-2">Security risk</h3>
                  <p className="text-sm text-[#4B5B6B] leading-relaxed">Active accounts belonging to former employees are one of the most common attack vectors in small business data breaches. Credential-based attacks do not require the former employee to act maliciously — credentials can be stolen and used by a third party if the account remains active.</p>
                </div>
                <div className="bg-white border border-[#D7E1EA] rounded-xl p-5 border-l-4 border-l-amber-400">
                  <h3 className="text-sm font-bold text-[#0E2F54] mb-2">Cost issue</h3>
                  <p className="text-sm text-[#4B5B6B] leading-relaxed">Microsoft 365 charges per assigned license regardless of whether the account is active. A business with 30 employees that has had 10% annual turnover for five years without reclaiming licenses may be paying for 15 former employees. At $12–$22 per user per month, that is $180–$330 per month in pure waste.</p>
                </div>
              </div>
            </section>

            {/* Checklist sections */}
            {[
              { title: "Before the last day", items: BEFORE_LAST_DAY, color: "border-l-blue-400" },
              { title: "Day of departure", items: DAY_OF, color: "border-l-red-400" },
              { title: "Within 24 hours", items: WITHIN_24H, color: "border-l-amber-400" },
              { title: "Within one week", items: WITHIN_ONE_WEEK, color: "border-l-emerald-400" },
              { title: "Within one month", items: WITHIN_ONE_MONTH, color: "border-l-[#60B8F0]" },
            ].map((phase) => (
              <section key={phase.title}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-heading font-bold text-[#0E2F54]">{phase.title}</h2>
                </div>
                <div className="space-y-2.5">
                  {phase.items.map((item, i) => (
                    <div key={i} className={`bg-white border border-[#D7E1EA] border-l-4 ${phase.color} rounded-xl px-5 py-4`}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={14} className="text-[#1F5E95] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[#0E2F54] leading-snug mb-1">{item.item}</p>
                          {item.why && <p className="text-xs text-[#4B5B6B] leading-relaxed"><span className="font-semibold">Why:</span> {item.why}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* M365 specifics */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Microsoft 365 offboarding steps in order</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                Because Microsoft 365 is the core platform for most small businesses, the sequence of steps matters. Deleting an account before transferring files, for example, permanently destroys OneDrive data. Follow this order:
              </p>
              <div className="space-y-2.5">
                {M365_STEPS.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5">
                    <span className="w-5 h-5 rounded-full bg-[#DCEAF7] text-[#1F5E95] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{step.item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Signs of gaps */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Signs your current offboarding process has gaps</h2>
              <div className="space-y-2.5">
                {GAP_SIGNS.map((sign, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5">
                    <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-[#4B5B6B]">{sign}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Building a repeatable process */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">How to build a repeatable offboarding process</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-4 text-[15px]">
                The goal is not a perfect checklist that covers every possible scenario — it is a consistent minimum that executes correctly every time without depending on one person's memory. The most effective approaches share three characteristics:
              </p>
              <div className="space-y-3">
                {[
                  { title: "A documented, time-stamped checklist", desc: "A written record of what was done, when, and by whom. Spreadsheet, shared document, or ticketing system — the medium matters less than the consistency." },
                  { title: "A named owner for each step", desc: "Ambiguity about who is responsible for a step is the most common reason steps are skipped. Each item on the checklist should have a clear owner: manager, information technology contact, or finance." },
                  { title: "A 30-day follow-up step", desc: "A single calendar item one month after departure that confirms licenses were reclaimed, external systems were updated, and no billing anomalies appeared. This step catches the items most likely to slip through during the departure itself." },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                    <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{item.title}</h3>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Internal links */}
            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
                  { label: "Onboarding and offboarding automation", href: "/onboarding-offboarding-automation" },
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
        title="Need help building a consistent offboarding process?"
        subtitle="Grand Strand Ally helps small businesses document and automate onboarding and offboarding inside Microsoft 365 — so the right steps happen every time without relying on memory."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "See Our Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
