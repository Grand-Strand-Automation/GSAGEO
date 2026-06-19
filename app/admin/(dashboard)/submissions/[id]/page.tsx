import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { AddNoteForm } from "@/components/admin/AddNoteForm";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { formatPlanLabel } from "@/lib/brand/plans";
import type { GeoAuditJob, GeoAuditResult, GeoSubmission, GeoAdminNote } from "@/lib/types/database";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-[#9AAEBB]">{label}</dt>
      <dd className="text-sm text-[#0E2F54] mt-1">{value || "—"}</dd>
    </div>
  );
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminUser();
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) notFound();

  const sub = submission as GeoSubmission;

  const { data: jobs } = await supabase
    .from("geo_audit_jobs")
    .select("*")
    .eq("submission_id", id)
    .order("created_at", { ascending: false });

  const job = (jobs?.[0] ?? null) as GeoAuditJob | null;

  let result: GeoAuditResult | null = null;
  if (job) {
    const { data: results } = await supabase
      .from("geo_audit_results")
      .select("*")
      .eq("audit_job_id", job.id)
      .order("created_at", { ascending: false })
      .limit(1);
    result = (results?.[0] ?? null) as GeoAuditResult | null;
  }

  const { data: notes } = await supabase
    .from("geo_admin_notes")
    .select("*")
    .eq("submission_id", id)
    .order("created_at", { ascending: false });

  const scorecard = result?.scorecard_json as {
    overall?: number;
    overallGrade?: string;
    categories?: Record<string, { score: number; grade: string; label: string }>;
  } | null;

  const recommendations = result?.recommendations_json as {
    topFixes?: { priority: string; title: string; description: string }[];
    topContentGaps?: { impact: string; title: string; description: string }[];
    suggestedTier?: string;
  } | null;

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="container px-4 md:px-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/submissions" className="text-sm text-[#1F5E95] hover:underline">
              ← All submissions
            </Link>
            <h1 className="text-2xl font-heading font-bold text-[#0E2F54] mt-2">{sub.company_name}</h1>
            <p className="text-sm text-[#4B5B6B]">{sub.work_email}</p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid gap-6">
          <section className="bg-white rounded-xl border border-[#D7E1EA] p-6">
            <h2 className="text-xs font-bold uppercase text-[#1F5E95] mb-4">Overview</h2>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Website" value={sub.website_url} />
              <Field label="Selected plan" value={formatPlanLabel(sub.selected_plan)} />
              <Field label="Status" value={sub.status} />
              <Field label="Submitted" value={new Date(sub.created_at).toLocaleString()} />
              <Field label="Updated" value={new Date(sub.updated_at).toLocaleString()} />
              <Field label="Phone" value={sub.phone} />
            </dl>
          </section>

          <section className="bg-white rounded-xl border border-[#D7E1EA] p-6">
            <h2 className="text-xs font-bold uppercase text-[#1F5E95] mb-4">Intake details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full name" value={sub.full_name} />
              <Field label="Primary service" value={sub.primary_service} />
              <Field label="Service area" value={sub.service_area} />
              <Field label="Industry" value={sub.industry} />
              <Field label="Business size" value={sub.business_size} />
              <Field label="Main goal" value={sub.main_goal} />
              <Field label="Competitors" value={sub.competitors} />
              <Field label="CMS platform" value={sub.cms_platform} />
              <Field label="Current challenges" value={sub.current_challenges} />
              <Field label="Access available" value={sub.access_available} />
              <Field label="Notes" value={sub.notes} />
            </dl>
          </section>

          <section className="bg-white rounded-xl border border-[#D7E1EA] p-6">
            <h2 className="text-xs font-bold uppercase text-[#1F5E95] mb-4">Audit job</h2>
            {!job ? (
              <p className="text-sm text-[#4B5B6B]">No audit job found.</p>
            ) : (
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Job status" value={job.status} />
                <Field label="Audit version" value={job.audit_version} />
                <Field label="Started" value={job.started_at ? new Date(job.started_at).toLocaleString() : null} />
                <Field label="Completed" value={job.completed_at ? new Date(job.completed_at).toLocaleString() : null} />
                <Field label="Failure reason" value={job.failure_reason} />
              </dl>
            )}
            {/* TODO: Manual re-queue button for failed jobs once admin actions are wired */}
          </section>

          {result && (
            <section className="bg-white rounded-xl border border-[#D7E1EA] p-6">
              <h2 className="text-xs font-bold uppercase text-[#1F5E95] mb-4">Audit results</h2>
              {result.summary && <p className="text-sm text-[#4B5B6B] mb-4">{result.summary}</p>}
              {scorecard?.overall != null && (
                <p className="text-sm font-semibold text-[#0E2F54] mb-4">
                  Overall: {scorecard.overall}/100 ({scorecard.overallGrade})
                  {recommendations?.suggestedTier && (
                    <> · Suggested: {recommendations.suggestedTier}</>
                  )}
                </p>
              )}
              {scorecard?.categories && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {Object.values(scorecard.categories).map((cat) => (
                    <div key={cat.label} className="bg-[#F7F5F1] rounded-lg border border-[#D7E1EA] p-3 text-center">
                      <div className="text-xl font-bold">{cat.grade}</div>
                      <div className="text-xs text-[#4B5B6B]">{cat.score}/100</div>
                      <div className="text-[10px] text-[#9AAEBB] mt-1">{cat.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {recommendations?.topFixes && recommendations.topFixes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-[#0E2F54] mb-2">Top fixes</h3>
                  <ul className="space-y-2 text-sm text-[#4B5B6B]">
                    {recommendations.topFixes.map((f) => (
                      <li key={f.title}>
                        <strong>[{f.priority}]</strong> {f.title}: {f.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {recommendations?.topContentGaps && recommendations.topContentGaps.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#0E2F54] mb-2">Content opportunities</h3>
                  <ul className="space-y-2 text-sm text-[#4B5B6B]">
                    {recommendations.topContentGaps.map((g) => (
                      <li key={g.title}>
                        <strong>[{g.impact}]</strong> {g.title}: {g.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section className="bg-white rounded-xl border border-[#D7E1EA] p-6">
            <h2 className="text-xs font-bold uppercase text-[#1F5E95] mb-4">Admin notes</h2>
            <AddNoteForm submissionId={id} />
            <ul className="mt-6 space-y-4">
              {((notes ?? []) as GeoAdminNote[]).map((n) => (
                <li key={n.id} className="border-t border-[#D7E1EA] pt-4 text-sm">
                  <p className="text-[#4B5B6B]">{n.note}</p>
                  <p className="text-xs text-[#9AAEBB] mt-1">
                    {n.author_email} · {new Date(n.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
