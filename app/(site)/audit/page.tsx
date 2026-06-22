import { AuditForm } from "@/components/AuditForm";
import { normalizeAuditTier } from "@/lib/brand/plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a GEO Audit",
  description:
    "Request a practical GEO and AI visibility audit from Grand Strand Ally.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const params = await searchParams;
  const initialPlan = normalizeAuditTier(params.tier);

  return <AuditForm initialPlan={initialPlan} />;
}
