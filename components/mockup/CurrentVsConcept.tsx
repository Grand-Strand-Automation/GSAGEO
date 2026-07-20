"use client";

import { useState } from "react";
import { CheckCircle2, ImageOff } from "lucide-react";
import type { CurrentSnapshot, MockupConcept } from "@/lib/mockup/generator";
import { HomepageMockupPreview } from "@/components/mockup/HomepageMockupPreview";

function BrowserChrome({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-cream/40 p-3 md:p-4 shadow-card-md h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 pb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] font-medium text-brand-muted truncate">{label}</span>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function CurrentSiteSummary({ snapshot }: { snapshot: CurrentSnapshot }) {
  return (
    <div className="rounded-xl border border-brand-border bg-white p-5 md:p-6 h-full">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-lg bg-brand-cream p-2 text-brand-muted">
          <ImageOff size={18} />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-1">
            Current site summary
          </p>
          <p className="text-xs text-brand-muted leading-relaxed">
            A live screenshot wasn&apos;t available, so here&apos;s what we could read from your
            homepage.
          </p>
        </div>
      </div>

      {snapshot.headline ? (
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted mb-1">
            Detected headline
          </p>
          <p className="font-heading font-bold text-brand-navy text-base leading-snug">
            {snapshot.headline}
          </p>
        </div>
      ) : (
        <p className="text-sm text-brand-muted mb-4">No clear homepage headline was detected.</p>
      )}

      {snapshot.subheadline && (
        <p className="text-sm text-brand-muted leading-relaxed mb-4">{snapshot.subheadline}</p>
      )}

      {snapshot.primaryCta && (
        <p className="text-sm mb-4">
          <span className="text-brand-muted">Current CTA: </span>
          <span className="font-semibold text-brand-navy">{snapshot.primaryCta}</span>
        </p>
      )}

      {snapshot.services.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted mb-2">
            Services found
          </p>
          <ul className="space-y-2">
            {snapshot.services.slice(0, 4).map((service) => (
              <li key={service.title} className="flex gap-2 text-sm text-brand-muted">
                <CheckCircle2 size={14} className="text-brand-blue shrink-0 mt-0.5" />
                <span>
                  <span className="font-medium text-brand-navy">{service.title}</span>
                  {service.desc && !service.desc.startsWith("Presented more") ? (
                    <span className="block text-xs mt-0.5 line-clamp-2">{service.desc}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {snapshot.phone && (
        <p className="text-xs text-brand-muted">Phone detected: {snapshot.phone}</p>
      )}
    </div>
  );
}

function CurrentHomepagePane({
  snapshot,
  websiteUrl,
}: {
  snapshot: CurrentSnapshot;
  websiteUrl?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(snapshot.screenshotUrl) && !imgFailed;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-muted">
            Your current homepage
          </p>
          <p className="text-sm font-heading font-bold text-brand-navy mt-0.5">
            What visitors see today
          </p>
        </div>
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-blue hover:underline truncate max-w-[40%]"
          >
            Open site
          </a>
        )}
      </div>

      <BrowserChrome label={websiteUrl ? websiteUrl.replace(/^https?:\/\//, "") : "current site"}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={snapshot.screenshotUrl!}
            alt="Screenshot of your current homepage"
            className="w-full rounded-xl border border-black/5 bg-white object-cover object-top max-h-[520px]"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <CurrentSiteSummary snapshot={snapshot} />
        )}
      </BrowserChrome>
    </div>
  );
}

export function CurrentVsConcept({
  concept,
  websiteUrl,
}: {
  concept: MockupConcept;
  websiteUrl?: string;
}) {
  const snapshot = concept.currentSnapshot ?? {
    screenshotUrl: null,
    screenshotStatus: "unavailable" as const,
    headline: concept.sourceSignals.detectedHeadline,
    subheadline: null,
    primaryCta: null,
    services: [],
    phone: concept.phone,
    navItems: [],
    fetchQuality: concept.sourceSignals.fetchQuality ?? "failed",
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue mb-2">
          Side-by-side preview
        </p>
        <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-navy">
          Current site vs sample redesign concept
        </h2>
        <p className="text-sm text-brand-muted mt-2 leading-relaxed">
          Clearer headline, stronger CTA placement, and an easier-to-scan service layout — built
          from your site&apos;s real content where available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        <CurrentHomepagePane snapshot={snapshot} websiteUrl={websiteUrl} />
        <div className="flex flex-col h-full">
          <div className="mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue">
              Sample redesign concept
            </p>
            <p className="text-sm font-heading font-bold text-brand-navy mt-0.5">
              A clearer homepage direction
            </p>
          </div>
          <HomepageMockupPreview concept={concept} framed={false} />
        </div>
      </div>
    </div>
  );
}
