"use client";

import type { MockupConcept } from "@/lib/mockup/generator";

export function HomepageMockupPreview({
  concept,
  framed = true,
}: {
  concept: MockupConcept;
  /** When false, omit outer browser chrome (parent provides it). */
  framed?: boolean;
}) {
  const { theme } = concept;
  const plan = concept.sectionPlan ?? ["hero", "services", "trust", "cta"];
  const showProcess = plan.includes("process") && (concept.processSteps?.length ?? 0) > 0;
  const showServiceArea = plan.includes("service_area") && Boolean(concept.serviceAreaLine);

  const inner = (
    <div
      className="rounded-xl overflow-hidden border border-black/5 shadow-sm"
      style={{ background: theme.background, color: theme.text }}
    >
      <header
        className="flex items-center justify-between gap-4 px-5 md:px-8 py-4 border-b"
        style={{ background: theme.surface, borderColor: `${theme.muted}22` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {concept.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={concept.logoUrl}
              alt=""
              className="h-7 w-7 rounded object-contain bg-white/80 shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          <div className="font-heading font-extrabold text-sm md:text-base tracking-tight truncate">
            {concept.businessName}
          </div>
        </div>
        <nav
          className="hidden sm:flex items-center gap-4 text-xs font-medium"
          style={{ color: theme.muted }}
        >
          {concept.navItems.slice(0, 4).map((item) => (
            <span key={item} className="truncate max-w-[7rem]">
              {item}
            </span>
          ))}
        </nav>
        <span
          className="text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-md shrink-0"
          style={{ background: theme.accent, color: theme.buttonText }}
        >
          {concept.primaryCta}
        </span>
      </header>

      <section
        className="px-5 md:px-10 py-10 md:py-14"
        style={{ background: theme.heroGradient, color: "#fff" }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 mb-4">
          {concept.heroEyebrow || concept.categoryLabel}
        </p>
        <h3 className="font-heading font-extrabold text-2xl md:text-3xl leading-[1.1] max-w-2xl mb-4">
          {concept.headline}
        </h3>
        <p className="text-sm md:text-base text-white/75 leading-relaxed max-w-xl mb-7">
          {concept.subheadline}
        </p>
        <div className="flex flex-wrap gap-3">
          <span
            className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold"
            style={{
              background: theme.accent === "#c45c26" ? theme.accent : "#fff",
              color: theme.accent === "#c45c26" ? "#fff" : theme.text,
            }}
          >
            {concept.primaryCta}
          </span>
          <span className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold border border-white/30 text-white/90">
            {concept.secondaryCta}
          </span>
        </div>
        <p className="mt-6 text-xs text-white/55">{concept.trustLine}</p>
      </section>

      <section className="px-5 md:px-10 py-8 md:py-10" style={{ background: theme.surface }}>
        <div className="flex flex-wrap gap-2 mb-6">
          {concept.proofPoints.map((point) => (
            <span
              key={point}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{ background: theme.accentSoft, color: theme.accent }}
            >
              {point}
            </span>
          ))}
        </div>
        <h4 className="font-heading font-bold text-lg mb-4">
          {concept.servicesHeading || "Our services"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {concept.services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl p-4 border"
              style={{ borderColor: `${theme.muted}22`, background: theme.background }}
            >
              <p className="font-heading font-bold text-sm mb-1.5">{service.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {showProcess && concept.processSteps ? (
        <section
          className="px-5 md:px-10 py-8 border-t"
          style={{ borderColor: `${theme.muted}18`, background: theme.background }}
        >
          <h4 className="font-heading font-bold text-lg mb-4">How it works</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {concept.processSteps.map((step, i) => (
              <div key={step.title} className="flex gap-3">
                <span
                  className="shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: theme.accentSoft, color: theme.accent }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-heading font-bold text-sm mb-1">{step.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showServiceArea ? (
        <section
          className="px-5 md:px-10 py-6 border-t text-center"
          style={{ borderColor: `${theme.muted}18`, background: theme.surface }}
        >
          <p className="text-sm font-medium" style={{ color: theme.text }}>
            {concept.serviceAreaLine}
          </p>
        </section>
      ) : null}

      <section
        className="px-5 md:px-10 py-8 border-t"
        style={{ borderColor: `${theme.muted}18`, background: theme.accentSoft }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-base mb-1">
              {concept.ctaBandHeadline || `Ready to work with ${concept.businessName}?`}
            </p>
            <p className="text-xs" style={{ color: theme.muted }}>
              {concept.ctaBandSub ||
                (concept.phone
                  ? `Call ${concept.phone} or reach out online.`
                  : "Reach out and we will help you take the next step.")}
            </p>
          </div>
          <span
            className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold w-fit"
            style={{ background: theme.accent, color: theme.buttonText }}
          >
            {concept.primaryCta}
          </span>
        </div>
      </section>

      <footer
        className="px-5 md:px-10 py-4 text-[11px] border-t"
        style={{
          color: theme.muted,
          borderColor: `${theme.muted}18`,
          background: theme.surface,
        }}
      >
        {concept.footerNote}
      </footer>
    </div>
  );

  const chrome = (
    <div className="rounded-2xl border border-brand-border bg-brand-cream/40 p-3 md:p-4 shadow-card-md">
      <div className="flex items-center gap-2 px-3 pb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] font-medium text-brand-muted truncate">
          {concept.businessName.toLowerCase().replace(/\s+/g, "")}.com — sample concept
        </span>
      </div>
      {inner}
    </div>
  );

  return framed ? chrome : chrome;
}
