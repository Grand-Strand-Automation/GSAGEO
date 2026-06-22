"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import Link from "next/link";

export function ThankYouContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("t") ?? "";

  const resultsHref = token ? `/results/${encodeURIComponent(token)}` : "";

  return (
    <div className="flex flex-col min-h-[80vh] bg-brand-cream items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-lg w-full text-center card-brand p-10 shadow-card-md">
        <div className="w-16 h-16 bg-brand-blue-light text-brand-blue rounded-full flex items-center justify-center mx-auto mb-7">
          <CheckCircle2 size={30} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mb-4">
          We received your request.
        </h1>
        <p className="text-brand-muted text-[15px] leading-relaxed mb-3 max-w-sm mx-auto">
          Your GEO audit request has been saved and the automated checks are starting. The private
          link below will show status first, then the report when it is ready.
        </p>
        {resultsHref ? (
          <div className="mt-8 p-4 bg-brand-cream rounded-xl border border-brand-border text-left">
            <p className="text-xs font-bold uppercase text-brand-blue tracking-wide mb-2">
              Your private results link
            </p>
            <p className="text-sm text-brand-muted mb-4">
              Bookmark this page or save the link somewhere secure. Only people with this link can
              view your audit status and results.
            </p>
            <Link
              href={resultsHref}
              className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm hover:underline"
            >
              View audit status <ExternalLink size={14} />
            </Link>
          </div>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          {resultsHref ? (
            <ButtonLink href={resultsHref} size="md">
              Check audit status →
            </ButtonLink>
          ) : null}
          <ButtonLink href="/" size="md" variant={resultsHref ? "secondaryLight" : "primary"}>
            Return to GEO Home
          </ButtonLink>
        </div>
        <p className="text-xs text-brand-subtle mt-6">
          Questions?{" "}
          <a href="mailto:shawn@gsally.com" className="text-brand-blue hover:underline">
            shawn@gsally.com
          </a>
        </p>
      </div>
    </div>
  );
}
