import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/backup-recovery-support";
const TITLE = "Backup and Recovery Support for Small Businesses — Grand Strand Ally";
const DESC =
  "Automated, tested backup and recovery for small businesses in the Grand Strand. Documented procedures, redundant copies, and verified recovery — not just a backup job that runs and is never checked.";

const WHO_FOR = [
  "Businesses with on-premises servers that have never tested whether their backup actually restores",
  "Businesses relying entirely on Microsoft 365 for data protection without understanding its limitations",
  "Businesses approaching a compliance review with data retention or recovery time requirements",
  "Any business that has experienced data loss and does not want it to happen again",
  "Businesses with business continuity requirements tied to insurance, contracts, or client expectations",
];

const PROBLEMS = [
  "There is a backup in place but no one has tested whether it actually restores",
  "Microsoft 365 is treated as the only backup, and its limitations are unknown",
  "Files are on a local server with a backup drive that is also stored on-site",
  "There is no documented recovery process — only a backup tool that runs and sends no alerts",
  "No one knows what the recovery time would be if a server failed today",
  "A compliance review or insurance application requires documented backup and recovery procedures that do not exist",
];

const INCLUDED = [
  "Backup scope assessment — identifying what needs protection: workstations, servers, cloud services, line-of-business applications",
  "Cloud and local redundancy configuration — copies in separate physical locations",
  "Backup scheduling and retention configuration appropriate to your business needs",
  "Recovery testing — actually restoring from backup on a defined schedule to verify it works",
  "Recovery time and recovery point documentation",
  "Written backup policy and business continuity procedures",
  "Ongoing monitoring and alert response as part of managed support",
];

const OUTCOMES = [
  { title: "Verified recovery capability", desc: "Recovery has been tested and confirmed — not assumed. The backup works because it has been proven to work." },
  { title: "No single point of failure", desc: "Copies exist in separate physical locations. A local event cannot destroy the only backup." },
  { title: "Documented recovery procedures", desc: "A written process for recovery exists before an incident — not improvised under pressure when something fails." },
  { title: "Insurance and compliance ready", desc: "Backup policy documentation satisfies the requirements of most cyber insurance applications and compliance reviews." },
];

const FAQ_ITEMS = [
  {
    q: "Doesn't Microsoft 365 already back up our data?",
    a: "Microsoft 365 retains deleted items for a limited period and provides file version history — but it is not a complete backup for all recovery scenarios. Point-in-time restore beyond Microsoft's default retention windows, recovery from accidental bulk deletion, and backup of mailboxes beyond the recycle bin period often require supplemental backup. Most businesses discover this limitation only after a loss event.",
  },
  {
    q: "How often should backup recovery be tested?",
    a: "At minimum quarterly — more frequently for environments with active data changes or strict recovery time requirements. Testing recovery is the only way to confirm backups are usable. A backup job that completes without errors does not guarantee a successful restore.",
  },
  {
    q: "What is the difference between recovery time objective and recovery point objective?",
    a: "Recovery time objective is how long it takes to restore operations after a failure. Recovery point objective is how much data loss is acceptable — meaning how far back the most recent restorable copy goes. Both need to be defined and documented before an incident occurs, not estimated under pressure during one.",
  },
  {
    q: "What about backup for cloud applications beyond Microsoft 365?",
    a: "Other cloud applications — line-of-business software, customer relationship management tools, accounting systems — have their own backup policies that vary by vendor. Part of the backup scope assessment is identifying which applications need supplemental protection beyond what the vendor provides by default.",
  },
  {
    q: "We already have a backup tool in place. Can you work with it?",
    a: "Yes. The starting point is always a review of what exists — verifying that the configuration is correct, that retention matches your needs, and that recovery has actually been tested. Many businesses have backup running but have never confirmed it works.",
  },
];

export default function BackupRecoverySupportPage() {
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
              "serviceType": "Backup and Recovery",
              "name": "Backup and Recovery Support",
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
                { "@type": "ListItem", "position": 3, "name": "Backup and Recovery", "item": CANONICAL },
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
            <span className="text-white/35">Backup and Recovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Backup and Recovery Support for Small Businesses
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Tested, documented backup and recovery — not just a job that runs and is assumed to work until something goes wrong.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Most small businesses have some form of backup in place but few have tested whether it restores. A proper implementation covers what is backed up, how often, where copies are stored, how long they are retained, and — most importantly — <strong className="text-white">what the recovery process looks like when something fails and how long it takes.</strong>
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
                  { label: "Cybersecurity and compliance support", href: "/cybersecurity-compliance-support" },
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
        title="Not sure what is actually backed up — or whether it would restore?"
        subtitle="The free cost analysis includes a review of your current backup coverage and identifies gaps before they become a problem."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
