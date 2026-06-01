import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { CTABand } from "@/components/CTABand";
import { siteConfig } from "@/lib/site";

const PILLARS = [
  {
    title: "Information Technology Cost Clarity",
    body: "Most small and medium businesses do not have a clear picture of what they are spending on information technology each month. Costs accumulate across support contracts, software subscriptions, Microsoft 365 licensing, security tools, and backup services — often without a single person who has full visibility. We start every engagement by building that picture.",
  },
  {
    title: "Vendor Simplification",
    body: "Environments with five or more vendors managing overlapping responsibilities are common in small and medium businesses. Support, email security, endpoint protection, and backup tools frequently duplicate each other in ways that add cost without meaningfully improving outcomes. We look for that overlap and help eliminate it.",
  },
  {
    title: "Microsoft 365 Administration",
    body: "Microsoft 365 is the operational foundation for most small and medium businesses — email, calendar, file storage, user management, and increasingly security and compliance controls. When it is misconfigured, under-licensed, or poorly administered, it creates risk and waste. We help businesses right-size licensing, clean up administration, and get more value from what they are already paying for.",
  },
  {
    title: "Compliance-Minded Support",
    body: "Compliance does not require a formal audit program to be meaningful. Businesses that handle sensitive data, operate in regulated industries, or work with partners who have security expectations benefit from practical controls — documented onboarding and offboarding, consistent access management, tested backups, and multi-factor authentication. We help build those controls without unnecessary complexity.",
  },
];

const WHO_WE_HELP = [
  "Small and medium businesses with 5 to 100 employees",
  "Teams that feel their information technology costs have grown without clear justification",
  "Organizations using Microsoft 365 that want cleaner administration",
  "Businesses with multiple vendors managing overlapping responsibilities",
  "Teams that want stronger onboarding and offboarding controls",
  "Compliance-conscious organizations that need practical, documented processes",
  "Companies that want month-to-month support with no long-term lock-in",
];

export default function About() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>About Grand Strand Ally | Information Technology Services — Myrtle Beach, SC</title>
        <meta
          name="description"
          content="Grand Strand Ally (gsally.com) provides information technology cost clarity, vendor simplification, Microsoft 365 support, and compliance-minded services for small and medium businesses across the Grand Strand and Myrtle Beach area."
        />
        <link rel="canonical" href="https://gsally.com/about" />
        <meta property="og:title" content="About Grand Strand Ally | IT Services — Myrtle Beach, SC" />
        <meta property="og:description" content="Grand Strand Ally helps small and medium businesses in the Myrtle Beach and Grand Strand area gain cost clarity, simplify vendors, and strengthen compliance-minded support." />
        <meta property="og:url" content="https://gsally.com/about" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Grand Strand Ally",
          "alternateName": ["GSally", "gsally.com"],
          "url": "https://gsally.com",
          "telephone": "+19732021455",
          "email": "shawn@gsally.com",
          "description": "Information technology cost clarity, vendor simplification, Microsoft 365 administration, and compliance-minded support for small and medium businesses in the Grand Strand and Myrtle Beach area.",
          "areaServed": { "@type": "Place", "name": "Grand Strand, Myrtle Beach, SC" },
          "sameAs": ["https://gsally.com"]
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
            <MapPin size={11} className="text-[#60B8F0]" />
            Myrtle Beach, SC · Grand Strand
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-5 leading-[1.05]">
            About Grand Strand Ally
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-6">
            Grand Strand Ally — operating at <a href="https://gsally.com" className="text-[#60B8F0] hover:text-white transition-colors font-medium">gsally.com</a> — provides practical information technology support for small and medium businesses across the Myrtle Beach and Grand Strand area of South Carolina.
          </p>
          <p className="text-base text-white/50 leading-relaxed max-w-xl mx-auto">
            We help businesses gain clearer visibility into information technology costs, simplify vendor structure, strengthen Microsoft 365 administration, and build compliance-minded support operations — without long-term contracts or unnecessary complexity.
          </p>
        </div>
      </section>

      {/* ── gsally.com brand connection ── */}
      <section className="py-12 bg-white border-b border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
            About the domain
          </p>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-[#0E2F54] mb-3">
            gsally.com is Grand Strand Ally.
          </h2>
          <p className="text-[#4B5B6B] leading-relaxed text-[15px]">
            The short domain <strong className="text-[#0E2F54]">gsally.com</strong> stands for <strong className="text-[#0E2F54]">Grand Strand Ally</strong> — a name chosen to reflect what we want to be for every client: a practical, local partner. "Grand Strand" refers to the stretch of South Carolina coastline from Little River through Georgetown County. "Ally" reflects the advisory, non-vendor relationship we try to bring to every engagement.
          </p>
        </div>
      </section>

      {/* ── Why we exist ── */}
      <section className="py-16 md:py-24 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Why we exist
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-5 leading-snug">
                Small and medium businesses deserve a clearer picture of what they are paying for.
              </h2>
              <div className="space-y-4 text-[15px] text-[#4B5B6B] leading-relaxed">
                <p>
                  Most small and medium businesses grow their information technology environments incrementally — one vendor at a time, one subscription at a time. By the time a business has 20 or 30 employees, they often have support contracts, security tools, backup services, and Microsoft 365 licensing managed by different vendors with limited coordination.
                </p>
                <p>
                  The result is cost that is hard to see, overlap that is hard to identify, and support that is hard to hold accountable. No single vendor has an incentive to simplify — each benefits from the complexity continuing.
                </p>
                <p>
                  Grand Strand Ally starts from a different position: we review the full environment first, identify what can be simplified, and only then recommend a support model based on actual needs. The cost analysis is free. The engagement comes later, only if there is a clear fit and clear value.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-[#D7E1EA] rounded-xl p-6 shadow-sm">
                <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-3">What we are not</h3>
                <ul className="space-y-2.5">
                  {[
                    "Not a break-fix shop that bills by the hour for reactive work",
                    "Not a vendor pushing a specific tool stack or platform",
                    "Not a reseller with quotas or commission incentives",
                    "Not a company that recommends replacing tools before understanding what you already have",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5B6B]">
                      <span className="w-4 h-4 rounded-full bg-[#F7F5F1] border border-[#D7E1EA] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-[#4B5B6B]">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-[#D7E1EA] rounded-xl p-6 shadow-sm">
                <h3 className="text-[15px] font-heading font-bold text-[#0E2F54] mb-3">What we are</h3>
                <ul className="space-y-2.5">
                  {[
                    "A local partner that reviews your environment before recommending changes",
                    "A team focused on practical improvements, not platform migrations",
                    "Month-to-month service with clear scope and no long-term lock-in",
                    "A compliance-minded approach that does not require a formal audit program",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5B6B]">
                      <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Four pillars ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
              What we focus on
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0E2F54] leading-tight">
              Four areas that matter most.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {PILLARS.map((pillar, i) => (
              <div key={i} className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl p-7 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#DCEAF7] flex items-center justify-center mb-4 text-[13px] font-bold text-[#1F5E95]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-[16px] font-heading font-bold text-[#0E2F54] mb-3 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors"
            >
              See all services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Who we help ── */}
      <section className="py-16 md:py-20 bg-[#F7F5F1]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                Who we help
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-5 leading-snug">
                Built for growing businesses that want more clarity.
              </h2>
              <p className="text-[15px] text-[#4B5B6B] leading-relaxed mb-5">
                Our typical client is a business with 5 to 100 employees that has been growing faster than its information technology environment has been managed. Tools and vendors have accumulated, costs are unclear, and no single person has full visibility into what is running, what it costs, or who is responsible for it.
              </p>
              <p className="text-[15px] text-[#4B5B6B] leading-relaxed">
                We serve businesses across the Grand Strand area — Myrtle Beach, Conway, North Myrtle Beach, Pawleys Island, Murrells Inlet, Little River, and surrounding communities.
              </p>
            </div>
            <div className="bg-white border border-[#D7E1EA] rounded-xl p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4B5B6B] mb-4">Common indicators we are a good fit</p>
              <ul className="space-y-3">
                {WHO_WE_HELP.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5B6B]">
                    <CheckCircle2 size={13} className="text-[#1F5E95] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service area ── */}
      <section className="py-14 bg-[#0A2440] text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/25 inline-block" />
                Service area
              </span>
              <h2 className="text-2xl font-heading font-bold text-white mb-3">
                Local to the Grand Strand.
              </h2>
              <p className="text-white/55 text-sm leading-relaxed">
                Grand Strand Ally is based in the Myrtle Beach area and serves small and medium businesses throughout Horry and Georgetown counties. Being local means we can meet in person, understand the regional business environment, and be accountable in ways that a remote or national provider cannot.
              </p>
            </div>
            <div className="md:w-56 shrink-0 bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35 mb-3">Areas served</p>
              <ul className="space-y-1.5 text-sm text-white/65">
                {["Myrtle Beach", "Conway", "North Myrtle Beach", "Surfside Beach", "Murrells Inlet", "Pawleys Island", "Little River", "Socastee", "Horry County", "Georgetown County"].map((area) => (
                  <li key={area} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#60B8F0] inline-block shrink-0" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Internal links ── */}
      <section className="py-12 bg-white border-t border-[#D7E1EA]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] mb-6 text-center">Learn more</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "See our four-step process", href: "/process", desc: "How we review your environment and build a support plan." },
              { label: "View all services", href: "/services", desc: "Managed support, Microsoft 365, cybersecurity, and more." },
              { label: "Frequently asked questions", href: "/faq", desc: "Common questions about cost analysis, pricing, and fit." },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-[#F7F5F1] border border-[#D7E1EA] hover:border-[#1F5E95] rounded-xl p-5 transition-colors"
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

      <CTABand
        title="Ready to get a clearer picture?"
        subtitle="Start with a free cost analysis — no obligation, no pressure. Just a structured look at your current environment."
        buttons={[
          { label: "Schedule a Free Cost Analysis", href: "/contact", primary: true },
          { label: "See How It Works", href: "/process", primary: false },
        ]}
      />
    </div>
  );
}
