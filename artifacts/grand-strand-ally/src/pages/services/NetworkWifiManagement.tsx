import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { CTABand } from "@/components/CTABand";

const CANONICAL = "https://gsally.com/network-wifi-management-myrtle-beach";
const TITLE = "Network and Wi-Fi Management for Small Businesses — Myrtle Beach, SC";
const DESC =
  "Reliable, documented network and Wi-Fi management for small businesses in Myrtle Beach and the Grand Strand. Stronger baseline security, simpler ownership, and a clear record of what is connected and why.";

const WHAT_IT_COVERS = [
  "Network inventory and documentation — a current record of every device, connection, and configuration in your environment",
  "Firewall configuration and monitoring — basic security controls, rules, and ongoing oversight",
  "Wi-Fi management — coverage, performance, and access controls across your locations",
  "Guest network segmentation — separating guest and business traffic to reduce exposure",
  "Switch and routing management — VLAN configuration and network segmentation for operational clarity",
  "Internet service provider coordination — acting as the point of contact for connectivity issues and service changes",
  "Remote monitoring and alerting — proactive identification of network issues before they affect operations",
];

const WHY_DOCS_MATTER = [
  { title: "Faster troubleshooting", desc: "When something stops working, a current network diagram and documented configuration reduces diagnostic time significantly." },
  { title: "Containable security incidents", desc: "Without knowing what is connected where, isolating a compromised device or segment is slow and uncertain." },
  { title: "Informed equipment decisions", desc: "Replacing or upgrading network equipment without knowing current state leads to unnecessary purchases and compatibility issues." },
  { title: "Cleaner vendor transitions", desc: "If a provider relationship changes, documented infrastructure means nothing critical is locked in someone else's head." },
];

const FAQ_ITEMS = [
  {
    q: "What does managed network service actually include?",
    a: "Network inventory and documentation, firewall configuration and monitoring, Wi-Fi management, guest network segmentation, VLAN and switch management, internet service provider coordination, and remote monitoring with alerting. The specific scope is agreed in writing before the engagement begins.",
  },
  {
    q: "Do you manage both the firewall and the Wi-Fi, or just one?",
    a: "Both. Firewall and Wi-Fi management are closely related — a properly segmented network requires both to be configured consistently. Managing one without visibility into the other creates gaps that are easy to miss.",
  },
  {
    q: "How do you handle multi-location businesses?",
    a: "Each location is inventoried and documented separately, then reviewed for consistency. Multi-location environments often have configuration drift — different equipment, different settings, different levels of documentation — that is identified and addressed as part of initial setup.",
  },
  {
    q: "What if our current network was set up by a previous provider and nothing is documented?",
    a: "That is the most common starting point. The first phase of the engagement is always a discovery and documentation pass — building a current network diagram, inventorying active equipment, and establishing a baseline before any changes are made.",
  },
  {
    q: "Is this included in a managed IT support engagement, or is it a separate service?",
    a: "Network management can be included as part of a broader managed support engagement or structured as a standalone service. For businesses that have a support provider but no one actively managing network infrastructure, it is available on its own.",
  },
];

export default function NetworkWifiManagement() {
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
              "name": "Network and Wi-Fi Management",
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
                { "@type": "ListItem", "position": 3, "name": "Network and Wi-Fi Management", "item": CANONICAL },
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
            <span className="text-white/35">Network and Wi-Fi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-5 leading-[1.08]">
            Network and Wi-Fi Management for Small Businesses in the Grand Strand
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Reliable connectivity, documented infrastructure, and a secure baseline — without the complexity of an enterprise network stack.
          </p>
        </div>
      </section>

      <div className="bg-[#F7F5F1] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <div className="bg-[#0E2F54] text-white rounded-2xl px-7 py-6 mb-10 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">In brief</p>
            <p className="text-[15px] leading-relaxed text-white/90">
              Network problems are often invisible until something breaks. Most small businesses do not have a current network diagram, a documented list of active equipment, or a clear owner for each device. <strong className="text-white">Managed network service makes the environment visible, keeps it running reliably, and establishes a security baseline that supports business continuity.</strong>
            </p>
          </div>

          <article className="space-y-12">

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">What network and Wi-Fi management covers</h2>
              <p className="text-[#4B5B6B] leading-relaxed mb-5 text-[15px]">
                Network infrastructure is the foundation everything else depends on. Email, cloud applications, security tools, and communication platforms all require a stable, properly configured network. Managed network service establishes and maintains that foundation.
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
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-5">Why network documentation matters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WHY_DOCS_MATTER.map((item, i) => (
                  <div key={i} className="bg-white border border-[#D7E1EA] rounded-xl p-5">
                    <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5">{item.title}</h3>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-[#0E2F54] mb-4">Who this works well for</h2>
              <ul className="space-y-2.5">
                {[
                  "Businesses with unreliable connectivity or recurring network issues with no clear cause",
                  "Businesses that have grown their network equipment organically without documentation",
                  "Businesses with guest Wi-Fi access that has not been properly segmented from internal systems",
                  "Businesses approaching a compliance review that requires documented network controls",
                  "Businesses with multiple locations where network configurations differ and are not centrally managed",
                  "Any business whose current provider cannot produce a current network diagram on request",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-[#D7E1EA] rounded-xl px-5 py-3.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
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
                Grand Strand Ally provides network and Wi-Fi management to small and medium businesses throughout the Myrtle Beach area, including Conway, North Myrtle Beach, Surfside Beach, Murrells Inlet, Pawleys Island, Little River, and Socastee. On-site visits are available across Horry and Georgetown counties when equipment configuration or troubleshooting requires hands-on access.
              </p>
            </section>

            <section className="border-t border-[#D7E1EA] pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-4">Related reading</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "How much should a small business spend on IT support?", href: "/how-much-should-a-small-business-spend-on-it-support" },
                  { label: "How to find overlapping IT tools and vendors", href: "/how-to-find-overlapping-it-tools-and-vendors" },
                  { label: "What an IT cost analysis should include", href: "/what-an-it-cost-analysis-should-include" },
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
        title="Not sure what your current network actually looks like?"
        subtitle="The free cost analysis includes a review of your network environment — what is documented, what is not, and where the most practical improvements are."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact#contact-form", primary: true },
          { label: "View All Services", href: "/services", primary: false },
        ]}
      />
    </div>
  );
}
