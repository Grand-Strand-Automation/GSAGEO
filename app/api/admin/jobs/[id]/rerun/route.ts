import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AUDIT_VERSION } from "@/lib/audit/crawl-checks";
import { processAuditJob } from "@/lib/audit/processor";
import { after } from "next/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !(await isAdminAuthorized(user.email))) return null;
  return user;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: oldJobId } = await params;
  const supabase = createAdminClient();

  const { data: oldJob } = await supabase
    .from("geo_audit_jobs")
    .select("submission_id")
    .eq("id", oldJobId)
    .single();

  if (!oldJob) {
    return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });
  }

  const { data: newJob, error } = await supabase
    .from("geo_audit_jobs")
    .insert({
      submission_id: oldJob.submission_id,
      status: "queued",
      audit_version: AUDIT_VERSION,
    })
    .select("id")
    .single();

  if (error || !newJob) {
    return NextResponse.json({ ok: false, error: "Failed to queue job" }, { status: 500 });
  }

  after(async () => {
    await processAuditJob(newJob.id);
  });

  return NextResponse.json({ ok: true, jobId: newJob.id });
}
