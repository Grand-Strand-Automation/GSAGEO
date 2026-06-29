import { ArrowRight } from "lucide-react";

const GEO_BASE_URL = "https://gsageo.vercel.app";
export const geoAuditUrl = (tier = "monitor") => `${GEO_BASE_URL}/audit?tier=${tier}`;
export const GEO_ASSESSMENT_URL = geoAuditUrl();

interface GeoCTABlockProps {
  headline?: string;
  body?: string;
  buttonText?: string;
  supportText?: string;
  variant?: "light" | "dark";
  analyticsId?: string;
}

export function GeoCTABlock({
  headline = "See How Your Website Looks to AI Search",
  body = "Our GEO / AI Visibility assessment helps service businesses understand how clearly their site is positioned for AI-powered discovery — including ChatGPT, Google AI Overviews, and answer-driven search engines.",
  buttonText = "Start Your GEO Assessment",
  supportText = "No hype. Clear next steps.",
  variant = "light",
  analyticsId = "geo-cta-block",
}: GeoCTABlockProps) {
  const isDark = variant === "dark";

  return (
    <section className={`py-14 md:py-20 ${isDark ? "bg-[#0A2440]" : "bg-[#F7F5F1]"}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div
          className={`rounded-2xl border p-8 md:p-12 ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white border-[#D7E1EA] shadow-sm"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1 min-w-0">
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 mb-4 ${
                  isDark ? "text-white/40" : "text-[#4B5B6B]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${
                    isDark ? "bg-[#60B8F0]" : "bg-[#1F5E95]"
                  }`}
                />
                GEO / AI Visibility
              </span>
              <h2
                className={`text-2xl md:text-3xl font-heading font-bold mb-3 leading-tight ${
                  isDark ? "text-white" : "text-[#0E2F54]"
                }`}
              >
                {headline}
              </h2>
              <p
                className={`text-[15px] leading-relaxed ${
                  isDark ? "text-white/55" : "text-[#4B5B6B]"
                }`}
              >
                {body}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-center gap-3 shrink-0">
              <a
                href={GEO_ASSESSMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-geo-cta={analyticsId}
                className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold h-12 px-7 rounded-lg text-[15px] transition-colors whitespace-nowrap"
              >
                {buttonText} <ArrowRight size={15} aria-hidden="true" />
              </a>
              {supportText && (
                <p
                  className={`text-xs ${isDark ? "text-white/30" : "text-[#9AAEBB]"}`}
                >
                  {supportText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
