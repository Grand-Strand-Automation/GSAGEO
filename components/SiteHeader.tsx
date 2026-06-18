import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0E2F54]/95 backdrop-blur border-b border-white/10">
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-white text-sm tracking-tight">
          Grand Strand Ally
          <span className="text-white/50 font-medium ml-2 hidden sm:inline">· GEO</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/#pricing" className="text-white/70 hover:text-white transition-colors hidden sm:inline">
            Pricing
          </Link>
          <Link
            href="/audit"
            className="bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Request Audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
