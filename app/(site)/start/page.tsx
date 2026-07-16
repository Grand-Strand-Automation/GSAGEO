import { Suspense } from "react";
import type { Metadata } from "next";
import { StartRedesignForm } from "@/components/mockup/StartRedesignForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Start Monthly Redesign + Hosting | Grand Strand Ally",
  description:
    "Request monthly website redesign and hosting support. Month-to-month plans with hosting included — cancel anytime.",
  path: "/start",
});

export default function StartPage() {
  return (
    <Suspense fallback={<div className="section-pad text-center text-brand-muted">Loading…</div>}>
      <StartRedesignForm />
    </Suspense>
  );
}
