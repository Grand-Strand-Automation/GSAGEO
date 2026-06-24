import { createAdminClient } from "@/lib/supabase/admin";
import type { StructuredFinding } from "@/lib/audit/report-builder";
import { mapFindingsToFixes } from "./mapping";
import { generateInternalFixDrafts } from "./generator";
import type { InternalFixDraft, InternalFixContext } from "./types";

export async function persistInternalFixDrafts(
  submissionId: string,
  auditJobId: string,
  drafts: InternalFixDraft[],
  options?: { replaceExisting?: boolean },
): Promise<number> {
  if (!drafts.length) return 0;

  const supabase = createAdminClient();

  if (options?.replaceExisting) {
    await supabase
      .from("geo_internal_fixes")
      .delete()
      .eq("audit_job_id", auditJobId)
      .eq("created_by_system", true)
      .in("status", ["generated", "needs_review"]);
  }

  const rows = drafts.map((d) => ({
    submission_id: submissionId,
    audit_job_id: auditJobId,
    related_finding_label: d.related_finding_label,
    related_finding_category: d.related_finding_category,
    type: d.type,
    title: d.title,
    issue_summary: d.issue_summary,
    why_it_matters: d.why_it_matters,
    affected_urls: d.affected_urls,
    generated_content: d.generated_content,
    generated_html: d.generated_html,
    generated_json: d.generated_json,
    implementation_notes: d.implementation_notes,
    implementation_effort: d.implementation_effort,
    priority: d.priority,
    confidence: d.confidence,
    status: d.status,
    internal_only: true,
    customer_visible: false,
    created_by_system: true,
  }));

  const { error } = await supabase.from("geo_internal_fixes").insert(rows);
  if (error) throw new Error(`Failed to persist internal fixes: ${error.message}`);
  return rows.length;
}

export function buildInternalFixContext(input: {
  companyName: string;
  websiteUrl: string;
  primaryService?: string | null;
  serviceArea?: string | null;
  sitemapUrls?: string[];
}): InternalFixContext {
  return {
    companyName: input.companyName,
    websiteUrl: input.websiteUrl,
    primaryService: input.primaryService ?? null,
    serviceArea: input.serviceArea ?? null,
    sitemapUrls: input.sitemapUrls ?? [input.websiteUrl],
  };
}

export function generateInternalFixesFromFindings(
  findings: StructuredFinding[],
  ctx: InternalFixContext,
): InternalFixDraft[] {
  const mappings = mapFindingsToFixes(findings);
  return generateInternalFixDrafts(mappings, ctx);
}

export async function generateAndPersistInternalFixesForJob(
  submissionId: string,
  auditJobId: string,
  input: {
    companyName: string;
    websiteUrl: string;
    primaryService?: string | null;
    serviceArea?: string | null;
    structuredFindings: StructuredFinding[];
    sitemapUrls?: string[];
  },
  options?: { replaceExisting?: boolean },
): Promise<number> {
  const ctx = buildInternalFixContext(input);
  const drafts = generateInternalFixesFromFindings(input.structuredFindings, ctx);
  return persistInternalFixDrafts(submissionId, auditJobId, drafts, options);
}

export async function loadInternalFixesForJob(auditJobId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("geo_internal_fixes")
    .select("*")
    .eq("audit_job_id", auditJobId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function loadInternalFixById(fixId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("geo_internal_fixes")
    .select("*")
    .eq("id", fixId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export function buildInternalFixExportPacket(
  companyName: string,
  fixes: Array<{
    type: string;
    title: string;
    issue_summary: string;
    why_it_matters: string;
    affected_urls: string[];
    generated_content: unknown;
    implementation_notes: string | null;
    implementation_effort: string;
    priority: string;
    confidence: string;
    status: string;
    related_finding_label: string | null;
  }>,
) {
  return {
    exportedAt: new Date().toISOString(),
    companyName,
    label: "GSAGEO Internal Implementation Packet",
    internalOnly: true,
    fixCount: fixes.length,
    fixes: fixes.map((f) => ({
      type: f.type,
      title: f.title,
      finding: f.related_finding_label,
      issue: f.issue_summary,
      whyItMatters: f.why_it_matters,
      affectedUrls: f.affected_urls,
      priority: f.priority,
      effort: f.implementation_effort,
      confidence: f.confidence,
      status: f.status,
      implementationNotes: f.implementation_notes,
      content: f.generated_content,
    })),
  };
}
