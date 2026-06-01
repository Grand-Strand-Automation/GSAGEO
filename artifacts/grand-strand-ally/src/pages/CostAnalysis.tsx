import { useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { DollarSign, Search, ShieldCheck } from "lucide-react";
import { CalculatorShell } from "@/components/cost-analysis/CalculatorShell";

const HEADER_OFFSET = 88;

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: DollarSign,
    title: "Enter your current tools and monthly costs",
    description:
      "Tell us what you are paying for across support, Microsoft 365, security, backup, and other recurring information technology tools.",
  },
  {
    step: "2",
    icon: Search,
    title: "See likely overlap, risk, and savings opportunities",
    description:
      "We score your environment for duplicate tools, process gaps, and control inconsistencies that commonly lead to unnecessary spend.",
  },
  {
    step: "3",
    icon: ShieldCheck,
    title: "Get a full review and schedule a free consultation",
    description:
      "Review your results and schedule a no-obligation conversation with a Grand Strand Ally consultant for a real look at your environment.",
  },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function CostAnalysis() {
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    const raf = requestAnimationFrame(() => {
      scrollToId(hash);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <Helmet>
        <title>Free Information Technology Cost Analysis Tool | Grand Strand Ally — Myrtle Beach, SC</title>
        <meta name="description" content="Estimate your current information technology spend, identify overlapping tools and vendor redundancy, and review compliance considerations — in about 5 minutes. Free tool from Grand Strand Ally for Grand Strand businesses." />
        <link rel="canonical" href="https://gsally.com/cost-analysis" />
        <meta property="og:title" content="Free IT Cost Analysis Tool | Grand Strand Ally — Myrtle Beach, SC" />
        <meta property="og:description" content="Estimate your current information technology spend and identify simplification opportunities. Free tool from Grand Strand Ally for Myrtle Beach and Grand Strand businesses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gsally.com/cost-analysis" />
        <meta property="og:site_name" content="Grand Strand Ally" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free IT Cost Analysis Tool | Grand Strand Ally — Myrtle Beach, SC" />
        <meta name="twitter:description" content="5-minute tool to estimate IT spend, find overlapping tools, and review compliance gaps. Free from Grand Strand Ally for Grand Strand businesses." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Grand Strand Ally Information Technology Cost Analysis Calculator",
              "url": "https://gsally.com/cost-analysis",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "provider": { "@id": "https://gsally.com/#organization" },
              "description": "A free five-step calculator that estimates monthly and annual information technology spend, identifies overlapping tools, and surfaces compliance and access control gaps for small and medium businesses."
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gsally.com" },
                { "@type": "ListItem", "position": 2, "name": "Cost Analysis Tool", "item": "https://gsally.com/cost-analysis" }
              ]
            }
          ]
        })}</script>
      </Helmet>

      <div>
        {/* ── Hero ── */}
        <section className="bg-[#0E2F54] text-white pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
              Free Tool
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight mb-5">
              Get a clearer picture of your current information technology spend.
            </h1>
            <p className="text-white/55 text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Grand Strand Ally helps businesses estimate current information technology costs,
              identify overlapping tools and vendor redundancy, and surface opportunities to simplify
              support and strengthen compliance-minded operations.
            </p>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/45 mb-10">
              {[
                "No obligation",
                "No long-term contracts",
                "Built for small and medium businesses",
                "Compliance-minded review",
              ].map((point) => (
                <span key={point} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#60B8F0] inline-block shrink-0" />
                  {point}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToId("calculator")}
              className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-8 text-[15px] rounded-lg transition-colors"
            >
              Start Free Cost Analysis →
            </button>
          </div>
        </section>

        {/* ── How it works ── */}
        <section
          id="how-it-works"
          className="py-14 md:py-16 bg-[#F7F5F1]"
          style={{ scrollMarginTop: `${HEADER_OFFSET}px` }}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5B6B] flex items-center justify-center gap-1.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F5E95] inline-block" />
                How it works
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54]">
                Three steps to a clearer picture.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
                <div
                  key={step}
                  className="bg-white rounded-xl border border-[#D7E1EA] p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#DCEAF7] text-[#1F5E95] flex items-center justify-center shrink-0">
                      <Icon size={15} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#4B5B6B]">
                      Step {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-bold text-[#0E2F54] mb-1.5 leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-[#4B5B6B] leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Calculator ── */}
        <section
          id="calculator"
          className="py-14 md:py-20 bg-white"
          style={{ scrollMarginTop: `${HEADER_OFFSET}px` }}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-2">
                Start your free cost analysis.
              </h2>
              <p className="text-sm text-[#4B5B6B]">Takes about 5 minutes. No login required.</p>
            </div>
            <CalculatorShell />
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-14 md:py-16 bg-[#0A2440] text-white">
          <div className="container mx-auto px-4 md:px-6 max-w-xl text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Prefer to talk it through directly?
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-sm mx-auto">
              Skip the calculator and schedule a free, no-obligation conversation. A Grand Strand Ally
              consultant will review your environment and walk you through practical next steps.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-11 px-8 text-sm rounded-lg transition-colors"
            >
              Schedule a Free Cost Analysis →
            </Link>
            <p className="text-white/30 text-xs mt-4">No long-term contracts. No obligation.</p>
          </div>
        </section>
      </div>
    </>
  );
}
