import { Suspense } from "react";
import { ThankYouContent } from "@/components/results/ThankYouContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-[80vh] bg-brand-cream items-center justify-center pt-20 pb-16 px-4">
          <p className="text-brand-muted">Loading…</p>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
