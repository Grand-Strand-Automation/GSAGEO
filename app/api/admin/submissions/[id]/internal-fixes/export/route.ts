import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminApiUser } from "@/lib/auth/require-admin-api";
import {
  buildInternalFixExportPacket,
  loadInternalFixesForJob,
} from "@/lib/internal-fixes/persist";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdminApiUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: submissionId } = await params;

  try {
    const supabase = createAdminClient();
    const { data: submission } = await supabase
      .from("geo_submissions")
      .select("company_name")
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
      return NextResponse.json({ ok: false, error: "No audit job" }, { status: 404 });
    }

    const fixes = await loadInternalFixesForJob(job.id);
    const packet = buildInternalFixExportPacket(submission.company_name, fixes);

    return new NextResponse(JSON.stringify(packet, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="internal-fixes-${submissionId.slice(0, 8)}.json"`,
      },
    });
  } catch (err) {
    console.error("[internal-fixes export]", err);
    return NextResponse.json({ ok: false, error: "Export failed" }, { status: 500 });
  }
}
