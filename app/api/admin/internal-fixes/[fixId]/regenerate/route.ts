import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminApiUser } from "@/lib/auth/require-admin-api";
import { mapFindingToFixTypes, resolveGenerationMode } from "@/lib/internal-fixes/mapping";
import { regenerateSingleInternalFixDraft } from "@/lib/internal-fixes/generator";
import { buildInternalFixContext } from "@/lib/internal-fixes/persist";
import type { StructuredFinding } from "@/lib/audit/report-builder";
import type { InternalFixType } from "@/lib/internal-fixes/types";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ fixId: string }> },
) {
  const user = await requireAdminApiUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { fixId } = await params;

  try {
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("geo_internal_fixes")
      .select("*")
      .eq("id", fixId)
      .single();

    if (!existing) {
      return NextResponse.json({ ok: false, error: "Fix not found" }, { status: 404 });
    }

    const { data: submission } = await supabase
      .from("geo_submissions")
      .select("company_name, website_url, primary_service, service_area")
      .eq("id", existing.submission_id)
      .single();

    const { data: result } = await supabase
      .from("geo_audit_results")
      .select("findings_json")
      .eq("audit_job_id", existing.audit_job_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const findingsJson = result?.findings_json as Record<string, unknown> | null;
    const structuredFindings = (findingsJson?.structuredFindings as StructuredFinding[]) ?? [];
    const finding =
      structuredFindings.find((f) => f.label === existing.related_finding_label) ??
      structuredFindings[0];

    if (!finding || !submission) {
      return NextResponse.json({ ok: false, error: "Source finding not found" }, { status: 404 });
    }

    const ctx = buildInternalFixContext({
      companyName: submission.company_name,
      websiteUrl: submission.website_url,
      primaryService: submission.primary_service,
      serviceArea: submission.service_area,
      sitemapUrls: (findingsJson?.sitemapUrls as string[]) ?? [submission.website_url],
    });

    const fixType = existing.type as InternalFixType;
    const mode = resolveGenerationMode(finding);
    const draft = regenerateSingleInternalFixDraft(
      fixType,
      { finding, fixTypes: mapFindingToFixTypes(finding), mode },
      ctx,
    );

    const { data: updated, error } = await supabase
      .from("geo_internal_fixes")
      .update({
        title: draft.title,
        issue_summary: draft.issue_summary,
        why_it_matters: draft.why_it_matters,
        affected_urls: draft.affected_urls,
        generated_content: draft.generated_content,
        generated_html: draft.generated_html,
        generated_json: draft.generated_json,
        implementation_notes: draft.implementation_notes,
        implementation_effort: draft.implementation_effort,
        priority: draft.priority,
        confidence: draft.confidence,
        status: "generated",
        created_by_system: true,
      })
      .eq("id", fixId)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, fix: updated });
  } catch (err) {
    console.error("[internal-fix regenerate]", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Regeneration failed" },
      { status: 500 },
    );
  }
}
