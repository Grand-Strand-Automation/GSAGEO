"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ZoomIn } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ASSESSMENT_PREVIEW } from "@/lib/content/landing";

function SamplePreviewImage({
  src,
  alt,
  label,
  onExpand,
}: {
  src: string;
  alt: string;
  label: string;
  onExpand: () => void;
}) {
  return (
    <figure className="group">
      <button
        type="button"
        onClick={onExpand}
        className="relative block w-full rounded-xl border border-brand-border bg-brand-cream/50 overflow-hidden shadow-card text-left transition-shadow hover:shadow-card-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2"
        aria-label={`Enlarge ${label}`}
      >
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-brand-navy/80 text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <ZoomIn size={12} />
          Enlarge
        </div>
        <Image
          src={src}
          alt={alt}
          width={1024}
          height={592}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </button>
      <figcaption className="mt-3 text-center text-sm font-semibold text-brand-navy">
        {label}
      </figcaption>
    </figure>
  );
}

export function SampleOutputPreview() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox]);

  const activeShot =
    activeIndex !== null ? ASSESSMENT_PREVIEW.screenshots[activeIndex] : null;

  return (
    <section id="sample-output" className="section-pad bg-brand-cream scroll-mt-20">
      <div className="container px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-10 md:mb-12 max-w-3xl mx-auto">
          <span className="eyebrow-pill-gold-blue mb-6">
            {ASSESSMENT_PREVIEW.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy leading-[1.12]">
            {ASSESSMENT_PREVIEW.title}
          </h2>
          <p className="mt-4 text-base md:text-lg text-brand-muted leading-relaxed">
            {ASSESSMENT_PREVIEW.description}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-border bg-white shadow-card-md overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-brand-gold via-brand-sky to-brand-blue" />
          <div className="p-5 md:p-8 lg:p-10">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {ASSESSMENT_PREVIEW.screenshots.map((shot, index) => (
                <SamplePreviewImage
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  label={shot.label}
                  onExpand={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <p className="mt-8 text-center text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl mx-auto">
              {ASSESSMENT_PREVIEW.disclaimer}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-brand-border bg-white p-6 md:p-8 shadow-card text-center max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-brand-navy">
            {ASSESSMENT_PREVIEW.cta.heading}
          </h3>
          <p className="mt-3 text-sm md:text-[15px] text-brand-muted leading-relaxed">
            {ASSESSMENT_PREVIEW.cta.body}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <ButtonLink href={ASSESSMENT_PREVIEW.cta.href} variant="gold" size="md">
              {ASSESSMENT_PREVIEW.cta.label} →
            </ButtonLink>
            <Link
              href={ASSESSMENT_PREVIEW.cta.secondaryHref}
              className="text-sm font-semibold text-brand-blue hover:underline underline-offset-4"
            >
              {ASSESSMENT_PREVIEW.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      {activeShot ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-brand-navy/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeShot.label}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full bg-white/10 text-white p-2 hover:bg-white/20 transition-colors"
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-auto rounded-xl border border-white/15 bg-white shadow-card-md"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeShot.src}
              alt={activeShot.alt}
              width={1024}
              height={592}
              className="w-full h-auto"
              sizes="90vw"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
