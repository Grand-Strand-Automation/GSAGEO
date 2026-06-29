import { Helmet } from "react-helmet-async";
import { content } from "@/lib/content";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Headset, Cloud, Wifi, Shield, Database, Zap, Sparkles, ArrowRight, LucideIcon } from "lucide-react";
import { GEO_ASSESSMENT_URL } from "@/components/GeoCTABlock";

const iconMap: Record<string, LucideIcon> = {
  headset: Headset,
  cloud: Cloud,
  wifi: Wifi,
  shield: Shield,
  database: Database,
  zap: Zap,
};

const SERVICE_HREFS: Record<string, string> = {
  "managed-it": "/managed-it-support-myrtle-beach",
  "microsoft-365": "/microsoft-365-support",
  "network-wifi": "/network-wifi-management-myrtle-beach",
  "cybersecurity": "/cybersecurity-compliance-support",
  "backup-recovery": "/backup-recovery-support",
  "workflow-automation": "/onboarding-offboarding-automation",
};

export default function Services() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Services | Grand Strand Ally — AI Visibility, IT Support &amp; Compliance, Myrtle Beach SC</title>
        <meta name="description" content="AI Visibility Assessments, managed IT support, Microsoft 365 administration, cybersecurity, backup, and compliance-minded services for small and medium businesses in the Grand Strand. Month-to-month, no long-term contracts." />
        <link rel="canonical" href="https://gsally.com/services" />
        <meta property="og:title" content="Services | Grand Strand Ally — AI Visibility, IT Support &amp; Compliance" />
        <meta property="og:description" content="We help service businesses strengthen website clarity, AI visibility, and operational structure. Practical services for the Grand Strand area." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gsally.com/services" />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services | Grand Strand Ally — AI Visibility, IT Support &amp; Compliance" />
        <meta name="twitter:description" content="AI Visibility Assessments, managed IT support, Microsoft 365, cybersecurity, and compliance-minded services for small and medium businesses in the Grand Strand." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://gsally.com/services" }
              ]
            },
            {
              "@type": "WebPage",
              "url": "https://gsally.com/services",
              "name": "Services — Grand Strand Ally",
              "isPartOf": { "@id": "https://gsally.com/#website" },
              "provider": { "@id": "https://gsally.com/#organization" }
            }
          ]
        })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────── */}
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
            Services
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            Services that support clearer visibility, stronger structure, and more practical operations.
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-8">
            We help service businesses strengthen how clearly they are understood — by customers, by search systems, and increasingly by AI-driven answer engines. That includes AI visibility assessments, clearer service structure, stronger trust content, and the practical systems support needed to keep operations clean and manageable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={GEO_ASSESSMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-geo-cta="services-hero"
              className="btn-geo h-12 px-7 text-[15px]"
            >
              Start Your Assessment <ArrowRight size={15} aria-hidden="true" />
            </a>
            <Button asChild variant="outline" className="border-white/25 text-white hover:bg-white/8 hover:text-white h-12 px-7 text-[15px] bg-transparent rounded-lg">
              <Link href="/contact#contact-form">Schedule a Free Cost Analysis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Short intro ──────────────────────────────────────────── */}
      <section className="py-10 md:py-14 bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-[#0E2F54] mb-3">
            Support that starts with clarity — not hype, not complexity, and not a generic bundle of services.
          </h2>
          <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
            We begin by identifying what is unclear, what is underperforming, and what needs to be strengthened across visibility, structure, support, and day-to-day operations.
          </p>
        </div>
      </section>

      {/* ── Service offerings ────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">

          {/* GEO / AI Visibility — featured signature offer */}
          <div className="bg-[#0E2F54] text-white rounded-2xl p-7 md:p-10 mb-6 shadow-sm" data-testid="service-card-geo">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-[#C09030]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-[#E8C870]" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8C870]">Signature offer</span>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-3 leading-snug">
                  AI Visibility / GEO Assessment
                </h3>
                <p className="text-white/65 text-[15px] leading-relaxed mb-6">
                  A practical review of how clearly your website is positioned for ChatGPT, Google AI Overviews, and answer-driven search. We look at service-page clarity, FAQ coverage, trust signals, internal linking, and structural gaps that affect how AI systems understand your business.
                </p>
                <a
                  href={GEO_ASSESSMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-geo-cta="services-featured-card"
                  className="btn-geo h-11 px-6 text-[14px]"
                >
                  Start Your Assessment <ArrowRight size={14} aria-hidden="true" />
                </a>
                <p className="text-xs text-white/35 mt-3">No hype. Clear next steps.</p>
              </div>
              <div className="md:w-52 shrink-0 flex flex-col gap-2.5">
                {[
                  "Service page clarity review",
                  "FAQ and trust content gaps",
                  "Internal linking and content structure",
                  "Practical next-step recommendations",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-white/75 font-medium bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5"
                  >
                    <CheckCircle2 size={13} className="text-[#60B8F0] flex-shrink-0" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supporting IT / operational services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.services.map((svc) => {
              const Icon = iconMap[svc.icon] || Zap;
              return (
                <div
                  key={svc.id}
                  className="bg-white border border-[#D7E1EA] rounded-xl p-6 shadow-sm"
                  data-testid={`service-card-${svc.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#DCEAF7] rounded-xl flex items-center justify-center flex-shrink-0 text-[#1F5E95]">
                      <Icon size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-1.5 leading-snug">{svc.name}</h3>
                      <p className="text-sm text-[#4B5B6B] mb-4 leading-relaxed">{svc.shortDescription}</p>
                      <ul className="space-y-1.5">
                        {svc.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-center gap-2 text-[13px] text-[#4B5B6B]">
                            <CheckCircle2 size={12} className="text-[#1F5E95] flex-shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      {SERVICE_HREFS[svc.id] && (
                        <Link
                          href={SERVICE_HREFS[svc.id]}
                          aria-label={`Learn more about ${svc.name}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] mt-4 transition-colors"
                        >
                          Learn more <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Outcomes ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />
                Outcomes
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                What businesses gain.
              </h2>
              <p className="text-sm text-white/55 leading-relaxed">
                After a review and engagement, most businesses leave with a clearer picture of what is working, what is under-structured, and what needs to improve first — across visibility, service clarity, internal systems, and ongoing support.
              </p>
            </div>
            <ul className="space-y-3 pt-2 md:pt-12">
              {[
                "Clearer service and website structure",
                "Better visibility into what is weak or underdeveloped",
                "Fewer overlapping tools and cleaner vendor ownership",
                "Stronger trust signals and process clarity",
                "More practical next steps across systems and site content",
                "Better support for compliance-conscious operations",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/75 font-medium">
                  <CheckCircle2 size={14} className="text-[#60B8F0] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── GEO cross-sell ───────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white border border-[#D7E1EA] rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C09030] inline-block" />
                  GEO / AI Visibility
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-3 leading-tight">
                  Need better visibility, not just better infrastructure?
                </h2>
                <p className="text-[#4B5B6B] text-[15px] leading-relaxed mb-7">
                  If your business depends on trust, search visibility, and inbound leads, your website may need more than operational support. Our AI Visibility assessment helps identify whether your service pages, FAQs, trust signals, and content structure are strong enough to support AI-driven discovery.
                </p>
                <a
                  href={GEO_ASSESSMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-geo-cta="services-cross-sell"
                  className="btn-geo h-12 px-7 text-[15px]"
                >
                  Start Your Assessment <ArrowRight size={15} aria-hidden="true" />
                </a>
                <p className="text-xs text-[#9AAEBB] mt-3">No hype. Clear next steps.</p>
              </div>
              <div className="md:w-56 shrink-0 flex flex-col gap-3 md:pt-14">
                {[
                  "AI visibility review",
                  "Content and structure gap analysis",
                  "Practical next-step recommendations",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#0E2F54] font-medium bg-[#F7F5F1] border border-[#D7E1EA] rounded-lg px-4 py-3"
                  >
                    <CheckCircle2 size={14} className="text-[#1F5E95] flex-shrink-0" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related reading ──────────────────────────────────────── */}
      <section className="py-14 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              Guides &amp; resources
            </span>
            <h2 className="text-2xl font-heading font-bold text-[#0E2F54]">
              Common questions before getting started.
            </h2>
            <p className="text-sm text-[#4B5B6B] mt-2 leading-relaxed max-w-xl">
              Some businesses come to us for systems clarity. Others need a better understanding of how their website appears in AI-driven search. We help identify what is weak, what is unclear, and what to prioritize first.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "How much should a small business spend on IT support?",
                href: "/how-much-should-a-small-business-spend-on-it-support",
                desc: "Benchmarks by company size and risk profile — with signals for both over- and underspending.",
              },
              {
                title: "How to find overlapping IT tools and vendors",
                href: "/how-to-find-overlapping-it-tools-and-vendors",
                desc: "A four-step process for mapping your vendor stack and finding where you are paying twice for the same capability.",
              },
              {
                title: "What an IT cost analysis should include",
                href: "/what-an-it-cost-analysis-should-include",
                desc: "The five areas a useful analysis covers — and five red flags that signal a sales pitch instead.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white border border-[#D7E1EA] hover:border-[#1F5E95] rounded-xl p-5 transition-colors"
              >
                <p className="text-[15px] font-heading font-bold text-[#0E2F54] group-hover:text-[#1F5E95] mb-2 leading-snug transition-colors">
                  {item.title}
                </p>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <CTABand
        title="Not sure where to start?"
        subtitle="If your main concern is website clarity and AI visibility, start with the GEO assessment. If you need operational support, tool consolidation, or IT cost clarity, the free cost analysis is the right first step."
        buttons={[
          { label: "Start Your Assessment", href: GEO_ASSESSMENT_URL, geo: true, external: true },
          { label: "Schedule a Free Cost Analysis", href: "/contact#contact-form", primary: false },
        ]}
      />
    </div>
  );
}
