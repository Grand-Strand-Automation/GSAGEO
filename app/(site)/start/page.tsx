import { Suspense } from "react";
import type { Metadata } from "next";
import { StartRedesignForm } from "@/components/mockup/StartRedesignForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Start Your $99 Homepage Refresh | Grand Strand Ally",
  description:
    "Request a $99 homepage refresh for your homepage and 2–3 key sub pages — or ask about a full website redesign. Clear scope, simple onboarding.",
  path: "/start",
});

export default function StartPage() {
  return (
    <Suspense fallback={<div className="section-pad text-center text-brand-muted">Loading…</div>}>
      <StartRedesignForm />
    </Suspense>
  );
}
