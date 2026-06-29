import Link from "next/link";
import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { isSupabaseAdminConfigured, isSupabaseAuthConfigured } from "@/lib/auth/admin";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { SubmissionsFilters } from "@/components/admin/SubmissionsFilters";
import type { GeoSubmission } from "@/lib/types/database";
import { formatPlanLabel, planBadgeClass } from "@/lib/brand/plans";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: "bg-yellow-100 text-yellow-800",
    complete: "bg-green-100 text-green-800",
    published: "bg-green-100 text-green-800",
    awaiting_review: "bg-purple-100 text-purple-800",
    failed: "bg-red-100 text-red-800",
    queued: "bg-blue-100 text-blue-800",
    submitted: "bg-gray-100 text-gray-700",
    reviewing: "bg-purple-100 text-purple-800",
    contacted: "bg-teal-100 text-teal-800",
    closed: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

function ConfigError({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
      <h2 className="font-heading font-bold text-brand-navy mb-2">Admin dashboard unavailable</h2>
      <p className="text-sm text-brand-muted">{message}</p>
    </div>
  );
}

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; plan?: string }>;
}) {
  if (!isSupabaseAuthConfigured()) {
    return (
      <div className="bg-brand-cream min-h-screen py-12">
        <div className="container px-4 md:px-6">
          <ConfigError message="Supabase auth environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy." />
        </div>
      </div>
    );
  }

  const user = await requireAdminUser();
  const params = await searchParams;

  if (!isSupabaseAdminConfigured()) {
    return (
      <div className="bg-brand-cream min-h-screen py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase text-brand-blue tracking-wide">Internal</p>
              <h1 className="text-2xl font-heading font-bold text-brand-navy">GEO Submissions</h1>
              <p className="text-sm text-brand-muted">Signed in as {user.email}</p>
            </div>
            <SignOutButton />
          </div>
          <ConfigError message="Database access is not configured. Set SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy." />
        </div>
      </div>
    );
  }

  let submissions: GeoSubmission[] | null = null;
  let jobsBySubmission: Record<string, { status: string }> = {};
  let loadError: string | null = null;

  try {
    const supabase = createAdminClient();

    let query = supabase.from("geo_submissions").select("*").order("created_at", { ascending: false }).limit(200);

    if (params.status) {
      query = query.eq("status", params.status);
    }
    if (params.plan) {
      query = query.eq("selected_plan", params.plan);
    }
    if (params.q?.trim()) {
      const term = `%${params.q.trim()}%`;
      query = query.or(`company_name.ilike.${term},work_email.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) {
      loadError = "Could not load submissions from Supabase.";
    } else {
      submissions = (data ?? []) as GeoSubmission[];
    }

    const { data: jobs } = await supabase
      .from("geo_audit_jobs")
      .select("submission_id, status")
      .order("created_at", { ascending: false });

    jobsBySubmission = Object.fromEntries((jobs ?? []).map((j) => [j.submission_id, j]));
  } catch {
    loadError = "Could not load submissions. Verify Supabase migrations and service role access.";
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase text-brand-blue tracking-wide">Internal</p>
            <h1 className="text-2xl font-heading font-bold text-brand-navy">GEO Submissions</h1>
            <p className="text-sm text-brand-muted">Signed in as {user.email}</p>
          </div>
          <SignOutButton />
        </div>

        <Suspense
          fallback={
            <div className="text-sm text-brand-muted mb-6">
              Preparing submission filters…
            </div>
          }
        >
          <SubmissionsFilters />
        </Suspense>

        {loadError ? (
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center text-red-700 text-sm">
            {loadError}
          </div>
        ) : !submissions?.length ? (
          <div className="bg-white rounded-xl border border-brand-border p-8 text-center text-brand-muted">
            No submissions match your filters yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-brand-border overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-brand-border bg-brand-cream text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase text-brand-subtle">Date</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-brand-subtle">Company</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-brand-subtle">Plan</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-brand-subtle">Email</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-brand-subtle">Website</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-brand-subtle">Status</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-brand-subtle">Assessment</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const job = jobsBySubmission[sub.id];
                  return (
                    <tr key={sub.id} className="border-b border-brand-border hover:bg-brand-cream/60">
                      <td className="px-5 py-4 text-brand-muted whitespace-nowrap">
                        {new Date(sub.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 font-medium text-brand-navy">{sub.company_name}</td>
                      <td className="px-5 py-4">
                        {sub.selected_plan ? (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planBadgeClass(sub.selected_plan)}`}
                          >
                            {formatPlanLabel(sub.selected_plan)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-4 text-brand-muted">{sub.work_email}</td>
                      <td className="px-5 py-4 text-brand-muted max-w-[180px] truncate">
                        {sub.website_url}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-5 py-4">
                        {job ? <StatusBadge status={job.status} /> : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/submissions/${sub.id}`}
                          className="text-brand-blue font-semibold text-xs hover:underline whitespace-nowrap"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
