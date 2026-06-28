import { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";

const DISMISS_KEY = "geo_ann_bar_v1";
export const GEO_ASSESSMENT_URL = "https://gsageo.vercel.app/";

export function GeoAnnouncementBar() {
  const [visible, setVisible] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) !== "1"; } catch { return true; }
  });
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateHeight() {
      const h = visible && barRef.current ? barRef.current.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty("--ann-h", `${h}px`);
    }
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (barRef.current) ro.observe(barRef.current);
    return () => ro.disconnect();
  }, [visible]);

  useEffect(() => {
    return () => { document.documentElement.style.setProperty("--ann-h", "0px"); };
  }, []);

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
    document.documentElement.style.setProperty("--ann-h", "0px");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[60] bg-[#1F5E95] text-white"
      role="banner"
      aria-label="GEO / AI Visibility announcement"
    >
      <div className="container mx-auto px-4 md:px-6 py-2 flex items-center gap-3">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 min-w-0">
          <p className="text-xs sm:text-sm font-medium leading-snug text-white/90 min-w-0">
            <span className="inline-flex items-center gap-1.5 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60B8F0] inline-block shrink-0" />
              <span className="font-bold text-white text-[11px] sm:text-xs uppercase tracking-[0.12em]">New</span>
            </span>
            Now offering dedicated AI Visibility assessments for service businesses
          </p>
          <a
            href={GEO_ASSESSMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-geo-cta="announcement-bar"
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 rounded-md px-3 py-1 text-xs sm:text-sm font-semibold text-white whitespace-nowrap transition-colors shrink-0"
          >
            See the Assessment <ArrowRight size={11} aria-hidden="true" />
          </a>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 text-white/45 hover:text-white p-1 rounded transition-colors"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
