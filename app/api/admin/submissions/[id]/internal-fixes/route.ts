import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminApiUser } from "@/lib/auth/require-admin-api";
import { loadInternalFixesForJob } from "@/lib/internal-fixes/persist";

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
    const { data: job } = await supabase
      .from("geo_audit_jobs")
      .select("id")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!job) {
      return NextResponse.json({ ok: true, fixes: [], jobId: null });
    }

    const fixes = await loadInternalFixesForJob(job.id);
    return NextResponse.json({ ok: true, fixes, jobId: job.id });
  } catch (err) {
    console.error("[internal-fixes list]", err);
    return NextResponse.json(
      { ok: false, error: "Could not load internal fixes." },
      { status: 500 },
    );
  }
}
