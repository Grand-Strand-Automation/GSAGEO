import { AuditForm } from "@/components/AuditForm";
import { normalizeAuditTier } from "@/lib/brand/plans";
import { AUDIT_METADATA } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = AUDIT_METADATA;

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
