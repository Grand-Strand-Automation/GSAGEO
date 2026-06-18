import { Suspense } from "react";
import { AuditForm } from "@/components/AuditForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a GEO Audit",
  robots: { index: false, follow: false },
};

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-[#4B5B6B]">Loading form…</div>}>
      <AuditForm />
    </Suspense>
  );
}
