import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#0E2F54] text-white/60 text-sm py-10">
      <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Grand Strand Ally · GEO / AI Visibility</p>
        <div className="flex gap-6">
          <a href="https://gsally.com" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
            Main site
          </a>
          <a href="mailto:shawn@gsally.com" className="hover:text-white transition-colors">
            shawn@gsally.com
          </a>
        </div>
      </div>
    </footer>
  );
}
