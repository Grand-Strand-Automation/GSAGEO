import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { SignOutButton } from "@/components/admin/SignOutButton";
import type { GeoSubmission } from "@/lib/types/database";
import { formatPlanLabel, planBadgeClass } from "@/lib/brand/plans";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: "bg-yellow-100 text-yellow-800",
    complete: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    queued: "bg-blue-100 text-blue-800",
    submitted: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] ?? "bg-gray-100"}`}>
      {status}
    </span>
  );
}

export default async function AdminSubmissionsPage() {
  await requireAdminUser();
  const supabase = createAdminClient();

  const { data: submissions } = await supabase
    .from("geo_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: jobs } = await supabase
    .from("geo_audit_jobs")
    .select("id, submission_id, status, created_at")
    .order("created_at", { ascending: false });

  const jobsBySubmission = Object.fromEntries(
    (jobs ?? []).map((j) => [j.submission_id, j]),
  );

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-16">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-brand-navy">GEO Submissions</h1>
            <p className="text-sm text-brand-muted">Internal admin view</p>
          </div>
          <SignOutButton />
        </div>

        {!submissions?.length ? (
          <div className="bg-white rounded-xl border border-[#D7E1EA] p-8 text-center text-[#4B5B6B]">
            No submissions yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#D7E1EA] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#D7E1EA] bg-[#F7F5F1] text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase text-[#9AAEBB]">Date</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-[#9AAEBB]">Company</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-[#9AAEBB]">Plan</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-[#9AAEBB]">Email</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-[#9AAEBB]">Status</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase text-[#9AAEBB]">Audit</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {(submissions as GeoSubmission[]).map((sub) => {
                  const job = jobsBySubmission[sub.id];
                  return (
                    <tr key={sub.id} className="border-b border-[#D7E1EA] hover:bg-[#F7F5F1]">
                      <td className="px-5 py-4 text-[#4B5B6B]">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 font-medium text-[#0E2F54]">{sub.company_name}</td>
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
                      <td className="px-5 py-4 text-[#4B5B6B]">{sub.work_email}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-5 py-4">
                        {job ? <StatusBadge status={job.status} /> : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/submissions/${sub.id}`}
                          className="text-[#1F5E95] font-semibold text-xs hover:underline"
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
