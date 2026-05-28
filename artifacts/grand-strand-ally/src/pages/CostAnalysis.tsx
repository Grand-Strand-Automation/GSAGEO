import { Link } from "wouter";
import { DollarSign, Search, ShieldCheck } from "lucide-react";
import { CalculatorShell } from "@/components/cost-analysis/CalculatorShell";

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
      "We score your environment for duplicate tools, process gaps, and control weaknesses that commonly lead to waste.",
  },
  {
    step: "3",
    icon: ShieldCheck,
    title: "Get a full review and book a free cost analysis",
    description:
      "Review your results and book a no-obligation conversation with a Grand Strand Ally consultant for a real look at your environment.",
  },
];

export default function CostAnalysis() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-[#0E2F54] text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block" />
            Free Tool
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight mb-5">
            Find out what your information technology stack may really be costing you.
          </h1>
          <p className="text-white/60 text-[15px] md:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Grand Strand Ally helps businesses estimate current information technology costs, identify overlapping tools and vendor sprawl, and uncover opportunities to simplify support and improve compliance-minded operations.
          </p>

          {/* Trust points */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/50">
            {[
              "No obligation",
              "No long-term contracts",
              "Built for small and medium businesses",
              "Compliance-minded review",
            ].map((point) => (
              <span key={point} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#60B8F0] inline-block" />
                {point}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <a
              href="#calculator"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
                window.scrollBy({ top: -88 });
              }}
              className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-8 text-[15px] rounded-lg transition-colors"
            >
              Start Free Cost Analysis →
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-14 md:py-16 bg-[#F7F5F1]">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="bg-white rounded-xl border border-[#D7E1EA] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#DCEAF7] text-[#1F5E95] flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#4B5B6B]">
                    Step {step}
                  </span>
                </div>
                <h3 className="text-sm font-heading font-bold text-[#0E2F54] mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-[#4B5B6B] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#0E2F54] mb-2">
              Start your free cost analysis.
            </h2>
            <p className="text-sm text-[#4B5B6B]">
              Takes about 5 minutes. No login required.
            </p>
          </div>

          <CalculatorShell />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-12 bg-[#0A2440] text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-xl">
          <h2 className="text-2xl font-heading font-bold text-white mb-3">
            Ready to talk through your results?
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Book a no-obligation conversation with a Grand Strand Ally consultant. We will review your environment and walk you through practical next steps.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-11 px-7 text-sm rounded-lg transition-colors"
          >
            Book a Free Cost Analysis →
          </Link>
        </div>
      </section>
    </div>
  );
}
