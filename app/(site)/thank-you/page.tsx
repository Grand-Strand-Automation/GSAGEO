import { Suspense } from "react";
import { ThankYouContent } from "@/components/results/ThankYouContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Confirmation for your private GEO audit request and results status link.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-[80vh] bg-brand-cream items-center justify-center pt-20 pb-16 px-4">
          <div className="card-brand rounded-2xl p-8 text-center shadow-card">
            <p className="text-sm font-semibold text-brand-navy">Preparing your confirmation…</p>
            <p className="text-sm text-brand-muted mt-2">
              We are setting up your private audit status link.
            </p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
