const SECTIONS = [
  { href: "#summary", label: "Summary" },
  { href: "#scorecard", label: "Scorecard" },
  { href: "#priorities", label: "Priorities" },
  { href: "#findings", label: "Findings" },
  { href: "#pages", label: "Pages" },
  { href: "#fix-previews", label: "Fix previews" },
  { href: "#roadmap", label: "Roadmap" },
];

export function ReportNav() {
  return (
    <nav
      aria-label="Report sections"
      className="hidden xl:block sticky top-24 self-start rounded-2xl border border-brand-border bg-white/90 backdrop-blur p-4 shadow-card-md w-52"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-subtle mb-3 px-2">
        Jump to
      </p>
      <ul className="space-y-1">
        {SECTIONS.map((section) => (
          <li key={section.href}>
            <a
              href={section.href}
              className="block rounded-lg px-2 py-2 text-sm text-brand-muted hover:text-brand-blue hover:bg-brand-blue-light/50 transition-colors"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ReportNavMobile() {
  return (
    <div className="xl:hidden -mx-1 mb-6 overflow-x-auto pb-1">
      <div className="flex gap-2 min-w-max px-1">
        {SECTIONS.map((section) => (
          <a
            key={section.href}
            href={section.href}
            className="inline-flex rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-muted hover:text-brand-blue hover:border-brand-blue/30"
          >
            {section.label}
          </a>
        ))}
      </div>
    </div>
  );
}
