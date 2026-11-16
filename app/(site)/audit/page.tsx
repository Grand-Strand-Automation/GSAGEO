import { AuditForm } from "@/components/AuditForm";
import { normalizeAuditTier } from "@/lib/brand/plans";
import { AUDIT_METADATA } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = AUDIT_METADATA;

export const dynamic = "force-dynamic";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; url?: string }>;
}) {
  const params = await searchParams;
  const initialPlan = normalizeAuditTier(params.tier);
  const initialUrl = typeof params.url === "string" ? params.url : "";

  return <AuditForm initialPlan={initialPlan} initialUrl={initialUrl} />;
}
