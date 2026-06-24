import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminApiUser } from "@/lib/auth/require-admin-api";
import {
  generateAndPersistInternalFixesForJob,
} from "@/lib/internal-fixes/persist";
import type { StructuredFinding } from "@/lib/audit/report-builder";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdminApiUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: submissionId } = await params;
  const body = await request.json().catch(() => ({}));
  const replaceExisting = Boolean(body.replaceExisting);

  try {
    const supabase = createAdminClient();
    const { data: submission } = await supabase
      .from("geo_submissions")
      .select("id, company_name, website_url, primary_service, service_area")
      .eq("id", submissionId)
      .single();

    if (!submission) {
      return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });
    }

    const { data: job } = await supabase
      .from("geo_audit_jobs")
      .select("id")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!job) {
      return NextResponse.json({ ok: false, error: "No audit job found" }, { status: 404 });
    }

    const { data: result } = await supabase
      .from("geo_audit_results")
      .select("findings_json")
      .eq("audit_job_id", job.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const findingsJson = result?.findings_json as Record<string, unknown> | null;
    const structuredFindings = (findingsJson?.structuredFindings as StructuredFinding[]) ?? [];
    const sitemapUrls = (findingsJson?.sitemapUrls as string[]) ?? [submission.website_url];

    const count = await generateAndPersistInternalFixesForJob(
      submission.id,
      job.id,
      {
        companyName: submission.company_name,
        websiteUrl: submission.website_url,
        primaryService: submission.primary_service,
        serviceArea: submission.service_area,
        structuredFindings,
        sitemapUrls,
      },
      { replaceExisting },
    );

    return NextResponse.json({ ok: true, generated: count });
  } catch (err) {
    console.error("[internal-fixes generate]", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 },
    );
  }
}
