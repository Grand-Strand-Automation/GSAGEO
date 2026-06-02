import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/backup-and-recovery-myrtle-beach";
const TITLE = "Backup and Recovery Services for Small Businesses — Myrtle Beach, SC";
const DESC =
  "Automated, tested backup and recovery for small businesses in Myrtle Beach and the Grand Strand. Documented procedures, redundant copies, and verified recovery — not just a backup job that runs and is never checked.";

const WHAT_IT_COVERS = [
  "Backup scope assessment — identifying what needs protection: workstations, servers, cloud data, and line-of-business applications",
  "Backup configuration and scheduling — frequency, retention periods, and storage destinations appropriate to your business",
  "Cloud and local redundancy — maintaining copies in separate locations so a single failure does not destroy all backups",
  "Recovery testing and verification — actually restoring from backup on a schedule to confirm that recovery works",
  "Documentation — written record of what is backed up, where copies live, how long they are retained, and who owns the process",
  "Continuity planning — documented procedures for what happens when something fails and how quickly operations can resume",
];

const COMMON_GAPS = [
  { gap: "Assuming Microsoft 365 provides complete backup", why: "Microsoft 365 retains deleted items for limited periods and does not provide point-in-time restore for all scenarios. Many businesses discover this limitation only after a loss event." },
  { gap: "Backups configured but never tested", why: "A backup job that runs without errors does not guarantee a usable restore. Testing recovery is the only way to confirm that backups work as expected." },
  { gap: "Single-location backup with no offsite or cloud copy", why: "A backup stored only on-site is vulnerable to the same physical event — fire, flood, theft, hardware failure — that destroyed the original data." },
  { gap: "No documented recovery procedure", why: "Knowing that backups exist and knowing how to restore from them quickly under pressure are different things. A documented procedure prevents costly mistakes during an already stressful incident." },
];

export default function BackupRecovery() {
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
              "name": "Backup and Recovery",
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
            Backup and Recovery Services for Small Businesses in the Grand Strand
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Automated, tested backups with documented recovery procedures — not just a job that runs and is assumed to work until something goes wrong.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Most small businesses have some form of backup in place but few have tested whether it actually works. A proper backup implementation covers what is backed up, how often, where copies are stored, how long they are retained, and — most importantly — <strong className="text-white">what the recovery process looks like when something fails and how long it takes.</strong>
            </p>
          </div>

          <article className="space-y-12">

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What backup and recovery covers</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                Backup is not a single tool — it is a practice that includes identifying what needs protection, choosing appropriate technology, verifying that recovery works, and documenting the process so anyone can execute it. Each of these elements matters.
              </p>
              <ul className="space-y-2.5">
                {WHAT_IT_COVERS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Common backup gaps that only surface during a recovery event</h2>
              <div className="space-y-3">
                {COMMON_GAPS.map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5 border-l-4 border-l-amber-400">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <h3 className="text-sm font-heading font-bold text-[#0E2F54]">{item.gap}</h3>
                    </div>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed pl-5">{item.why}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Who this works well for</h2>
              <ul className="space-y-2.5">
                {[
                  "Businesses with no formal backup policy or no recent recovery test",
                  "Businesses relying solely on Microsoft 365 for data protection without understanding its limitations",
                  "Businesses with on-premises servers or line-of-business applications that are not backed up to a secondary location",
                  "Businesses with compliance requirements around data retention and recovery time objectives",
                  "Any business that has experienced data loss and wants to ensure it does not happen again",
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
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
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
        title="Not sure what is actually being backed up — or whether it would restore?"
        subtitle="The free cost analysis includes a review of your current backup coverage and identifies gaps before they become a problem."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
