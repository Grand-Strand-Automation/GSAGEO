import { Suspense } from "react";
import { ThankYouContent } from "@/components/results/ThankYouContent";
import { THANK_YOU_METADATA } from "@/lib/seo/metadata";

export const metadata = THANK_YOU_METADATA;

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-[80vh] bg-brand-cream items-center justify-center pt-20 pb-16 px-4">
          <div className="card-brand rounded-2xl p-8 text-center shadow-card">
            <p className="text-sm font-semibold text-brand-navy">Preparing your confirmation…</p>
            <p className="text-sm text-brand-muted mt-2">
              We are setting up your private assessment status link.
            </p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
