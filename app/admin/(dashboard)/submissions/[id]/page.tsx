import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { isSupabaseAdminConfigured, isSupabaseAuthConfigured } from "@/lib/auth/admin";
import { AddNoteForm } from "@/components/admin/AddNoteForm";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { JobActions } from "@/components/admin/JobActions";
import { ReportDistributionPanel } from "@/components/admin/ReportDistributionPanel";
import { InternalFixWorkspace } from "@/components/admin/InternalFixWorkspace";
import { loadInternalFixesForJob } from "@/lib/internal-fixes/persist";
import { formatPlanLabel } from "@/lib/brand/plans";
import { AuditReportView } from "@/components/results/AuditReportView";
import { isResultsVisible } from "@/lib/results/access";
import { loadPublishedReportBySubmissionId } from "@/lib/results/published-report";
import type { GeoAuditJob, GeoAuditResult, GeoFixPreview, GeoSubmission, GeoAdminNote, GeoInternalFix, ResultsBundle } from "@/lib/types/database";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-brand-subtle">{label}</dt>
      <dd className="text-sm text-brand-navy mt-1">{value || "—"}</dd>
    </div>
  );
}

function ConfigError({ message }: { message: string }) {
  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="container px-4 md:px-6 max-w-2xl">
        <Link href="/admin/submissions" className="text-sm text-brand-blue hover:underline">
          ← All submissions
        </Link>
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center mt-6">
          <h2 className="font-heading font-bold text-brand-navy mb-2">Submission unavailable</h2>
          <p className="text-sm text-brand-muted">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseAuthConfigured()) {
    return (
      <ConfigError message="Supabase auth environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy." />
    );
  }

  const { id } = await params;
  await requireAdminUser(`/admin/submissions/${encodeURIComponent(id)}`);

  if (!isSupabaseAdminConfigured()) {
    return (
      <ConfigError message="Database access is not configured. Set SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy." />
    );
  }

  let submission: GeoSubmission | null = null;
  let job: GeoAuditJob | null = null;
  let result: GeoAuditResult | null = null;
  let previews: GeoFixPreview[] = [];
  let internalFixes: GeoInternalFix[] = [];
  let notes: GeoAdminNote[] = [];

  try {
    const supabase = createAdminClient();

    const { data } = await supabase.from("geo_submissions").select("*").eq("id", id).single();
    if (!data) notFound();
    submission = data as GeoSubmission;

    const { data: jobs } = await supabase
      .from("geo_audit_jobs")
      .select("*")
      .eq("submission_id", id)
      .order("created_at", { ascending: false });

    job = (jobs?.[0] ?? null) as GeoAuditJob | null;

    if (job) {
      const { data: results } = await supabase
        .from("geo_audit_results")
        .select("*")
        .eq("audit_job_id", job.id)
        .order("created_at", { ascending: false })
        .limit(1);
      result = (results?.[0] ?? null) as GeoAuditResult | null;

      const { data: previewRows } = await supabase
        .from("geo_fix_previews")
        .select("*")
        .eq("audit_job_id", job.id)
        .order("created_at", { ascending: true });
      previews = (previewRows ?? []) as GeoFixPreview[];

      try {
        internalFixes = (await loadInternalFixesForJob(job.id)) as GeoInternalFix[];
      } catch {
        internalFixes = [];
      }
    }

    const { data: noteRows } = await supabase
      .from("geo_admin_notes")
      .select("*")
      .eq("submission_id", id)
      .order("created_at", { ascending: false });

    notes = (noteRows ?? []) as GeoAdminNote[];
  } catch {
    return (
      <ConfigError message="Could not load this submission. Verify Supabase migrations and service role access." />
    );
  }

  const sub = submission;
  let reportBundle: ResultsBundle | null = null;

  if (job && result) {
    if (isResultsVisible(job)) {
      const published = await loadPublishedReportBySubmissionId(id);
      reportBundle = published.ok ? published.bundle : null;
    } else {
      reportBundle = { submission: sub, job, result, previews };
    }
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/admin/submissions" className="text-sm text-brand-blue hover:underline">
                ← All submissions
              </Link>
              <h1 className="text-2xl font-heading font-bold text-brand-navy mt-2">{sub.company_name}</h1>
              <p className="text-sm text-brand-muted">{sub.work_email}</p>
            </div>
            <SignOutButton />
          </div>

          <div className="grid gap-6">
            <section className="bg-white rounded-xl border border-brand-border p-6">
              <h2 className="text-xs font-bold uppercase text-brand-blue mb-4">Overview</h2>
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Website" value={sub.website_url} />
                <Field label="Selected plan" value={formatPlanLabel(sub.selected_plan)} />
                <Field label="Status" value={sub.status} />
                <Field label="Submitted" value={new Date(sub.created_at).toLocaleString()} />
                <Field label="Phone" value={sub.phone} />
              </dl>
            </section>

            <section className="bg-white rounded-xl border border-brand-border p-6">
              <h2 className="text-xs font-bold uppercase text-brand-blue mb-4">Audit job</h2>
              {!job ? (
                <p className="text-sm text-brand-muted">No audit job found.</p>
              ) : (
                <>
                  <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <Field label="Job status" value={job.status} />
                    <Field label="Audit version" value={job.audit_version} />
                    <Field label="Published" value={job.published_at ? new Date(job.published_at).toLocaleString() : null} />
                    <Field label="Started" value={job.started_at ? new Date(job.started_at).toLocaleString() : null} />
                    <Field label="Completed" value={job.completed_at ? new Date(job.completed_at).toLocaleString() : null} />
                    <Field label="Failure reason" value={job.failure_reason} />
                  </dl>
                  <JobActions jobId={job.id} jobStatus={job.status} submissionId={sub.id} />
                  <p className="text-xs text-brand-subtle mt-3">
                    Customer receives a private results link on the thank-you page after submission.
                  </p>
                </>
              )}
            </section>

            {job ? (
              <ReportDistributionPanel submissionId={id} jobStatus={job.status} />
            ) : null}

            {job ? (
              <InternalFixWorkspace
                submissionId={id}
                jobId={job.id}
                initialFixes={internalFixes}
              />
            ) : null}

            <section className="bg-white rounded-xl border border-brand-border p-6">
              <h2 className="text-xs font-bold uppercase text-brand-blue mb-4">Intake details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full name" value={sub.full_name} />
                <Field label="Primary service" value={sub.primary_service} />
                <Field label="Service area" value={sub.service_area} />
                <Field label="Industry" value={sub.industry} />
                <Field label="Notes" value={sub.notes} />
              </dl>
            </section>

            <section className="bg-white rounded-xl border border-brand-border p-6">
              <h2 className="text-xs font-bold uppercase text-brand-blue mb-4">Admin notes</h2>
              <AddNoteForm submissionId={id} />
              <ul className="mt-6 space-y-4">
                {notes.map((n) => (
                  <li key={n.id} className="border-t border-brand-border pt-4 text-sm">
                    <p className="text-brand-muted">{n.note}</p>
                    <p className="text-xs text-brand-subtle mt-1">
                      {n.author_email} · {new Date(n.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {reportBundle ? (
        <div className="border-t border-brand-border">
          <AuditReportView
            bundle={reportBundle}
            showAdminBanner
            embedded
            footerNote={
              <p className="text-center text-xs text-brand-subtle pt-2">
                Admin preview of the customer-facing report layout.
              </p>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
