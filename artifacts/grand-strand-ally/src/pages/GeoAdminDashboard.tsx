import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

type Submission = {
  id: number;
  createdAt: string;
  fullName: string;
  workEmail: string;
  companyName: string;
  websiteUrl: string;
  industry: string | null;
  businessSize: string | null;
  mainGoal: string | null;
};

type AuditJob = {
  id: number;
  jobId: string;
  submissionId: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  results: Record<string, unknown> | null;
  adminNotes: string | null;
};

type ReportData = {
  job: AuditJob;
  submission: Submission;
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    complete:   "bg-green-100 text-green-800 border-green-200",
    failed:     "bg-red-100 text-red-800 border-red-200",
    queued:     "bg-blue-100 text-blue-800 border-blue-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
  );
}

function ScoreCard({ scorecard }: { scorecard: Record<string, { score: number; grade: string; label: string }> }) {
  const gradeColor = (g: string) =>
    g === "A" ? "text-green-600" : g === "B" ? "text-blue-600" : g === "C" ? "text-yellow-600" : g === "D" ? "text-orange-600" : "text-red-700";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
      {Object.values(scorecard).map((cat) => (
        <div key={cat.label} className="bg-[#F7F5F1] rounded-lg border border-[#D7E1EA] p-3 text-center">
          <div className={`text-2xl font-extrabold font-heading ${gradeColor(cat.grade)}`}>{cat.grade}</div>
          <div className="text-xs text-[#4B5B6B] mt-0.5">{cat.score}/100</div>
          <div className="text-[10px] font-semibold text-[#9AAEBB] mt-1 leading-tight">{cat.label}</div>
        </div>
      ))}
    </div>
  );
}

function ReportModal({ jobId, onClose }: { jobId: string; onClose: () => void }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/geo-admin/report/${jobId}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setData(d); else setError(d.error ?? "Failed to load"); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [jobId]);

  const results = data?.job?.results as Record<string, unknown> | null;
  const scorecard = (results?.scorecard as { categories: Record<string, { score: number; grade: string; label: string }> } | undefined)?.categories;
  const recs = results?.recommendations as { topFixes: { priority: string; title: string; description: string }[]; topContentGaps: { impact: string; title: string; description: string }[]; suggestedTier: string } | undefined;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4 pt-12">
      <div className="bg-white rounded-2xl border border-[#D7E1EA] shadow-2xl w-full max-w-3xl mb-12">
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#D7E1EA]">
          <h2 className="font-heading font-bold text-lg text-[#0E2F54]">Audit Report — {jobId}</h2>
          <button
            onClick={onClose}
            className="text-[#9AAEBB] hover:text-[#0E2F54] text-2xl leading-none font-light transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-7 space-y-7">
          {loading && <p className="text-[#4B5B6B] text-sm">Loading report…</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {data && (
            <>
              {/* Submission info */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1F5E95] mb-3">Submission</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ["Name", data.submission?.fullName],
                    ["Email", data.submission?.workEmail],
                    ["Company", data.submission?.companyName],
                    ["Website", data.submission?.websiteUrl],
                    ["Industry", data.submission?.industry ?? "—"],
                    ["Goal", data.submission?.mainGoal ?? "—"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold text-[#0E2F54]">{k}: </span>
                      <span className="text-[#4B5B6B]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1F5E95] mb-3">Job Status</h3>
                <div className="flex items-center gap-4 text-sm">
                  <StatusBadge status={data.job.status} />
                  <span className="text-[#4B5B6B]">Created: {new Date(data.job.createdAt).toLocaleString()}</span>
                  <span className="text-[#4B5B6B]">Updated: {new Date(data.job.updatedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Scorecard */}
              {scorecard && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1F5E95] mb-1">GEO Scorecard</h3>
                  {(() => {
                    const sc = results?.scorecard as { overall: number; overallGrade: string } | undefined;
                    return sc ? (
                      <p className="text-sm text-[#4B5B6B] mb-2">
                        Overall: <strong className="text-[#0E2F54]">{sc.overall}/100</strong> ({sc.overallGrade})
                        {recs && <> · Suggested tier: <strong className="text-[#1F5E95]">{recs.suggestedTier}</strong></>}
                      </p>
                    ) : null;
                  })()}
                  <ScoreCard scorecard={scorecard} />
                </div>
              )}

              {/* Top Fixes */}
              {recs && recs.topFixes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1F5E95] mb-3">Top Priority Fixes</h3>
                  <ul className="space-y-3">
                    {recs.topFixes.map((f, i) => (
                      <li key={i} className="text-sm">
                        <span className={`font-bold uppercase text-xs mr-2 ${
                          f.priority === "critical" ? "text-red-600" :
                          f.priority === "high"     ? "text-orange-600" : "text-yellow-700"
                        }`}>[{f.priority}]</span>
                        <strong className="text-[#0E2F54]">{f.title}:</strong>{" "}
                        <span className="text-[#4B5B6B]">{f.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Gaps */}
              {recs && recs.topContentGaps.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1F5E95] mb-3">Top Content Opportunities</h3>
                  <ul className="space-y-3">
                    {recs.topContentGaps.map((g, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-bold uppercase text-xs text-blue-700 mr-2">[{g.impact}]</span>
                        <strong className="text-[#0E2F54]">{g.title}:</strong>{" "}
                        <span className="text-[#4B5B6B]">{g.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical findings */}
              {results?.extractedData && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#1F5E95] mb-3">Technical Findings</h3>
                  <div className="bg-[#F7F5F1] rounded-lg border border-[#D7E1EA] p-4 text-xs font-mono text-[#4B5B6B] overflow-x-auto">
                    <pre>{JSON.stringify(results.extractedData, null, 2)}</pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GeoAdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [jobs, setJobs] = useState<AuditJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/geo-admin/submissions").then(r => r.json()),
      fetch("/api/geo-admin/jobs").then(r => r.json()),
    ])
      .then(([subData, jobData]) => {
        if (subData.ok) setSubmissions(subData.submissions);
        if (jobData.ok) setJobs(jobData.jobs);
      })
      .catch(() => setError("Failed to load data. Ensure the API server is running."))
      .finally(() => setLoading(false));
  }, []);

  const jobsBySubmissionId = Object.fromEntries(jobs.map(j => [j.submissionId, j]));

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>GEO Audit Admin | Grand Strand Ally</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="bg-[#0E2F54] text-white pt-28 pb-10 md:pt-32 md:pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-extrabold mb-1">GEO Audit Dashboard</h1>
              <p className="text-white/55 text-sm">Internal view — not linked from the public site</p>
            </div>
            <Link href="/" className="text-sm text-[#60B8F0] hover:text-white transition-colors">
              ← Back to site
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F7F5F1] min-h-[60vh]">
        <div className="container mx-auto px-4 md:px-6">
          {loading && <p className="text-[#4B5B6B] text-sm">Loading…</p>}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 text-sm max-w-lg">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-lg text-[#0E2F54]">
                  Submissions ({submissions.length})
                </h2>
              </div>

              {submissions.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#D7E1EA] p-8 text-center text-[#4B5B6B] text-sm">
                  No submissions yet.
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#D7E1EA] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#D7E1EA] bg-[#F7F5F1]">
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AAEBB]">Date</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AAEBB]">Company</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AAEBB]">Contact</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AAEBB]">Website</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AAEBB]">Audit Status</th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9AAEBB]">Score</th>
                          <th className="px-5 py-3.5" />
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map(sub => {
                          const job = jobsBySubmissionId[sub.id];
                          const sc = (job?.results as Record<string, unknown> | null)?.scorecard as { overall: number; overallGrade: string } | undefined;
                          return (
                            <tr key={sub.id} className="border-b border-[#D7E1EA] last:border-0 hover:bg-[#F7F5F1] transition-colors">
                              <td className="px-5 py-4 text-[#4B5B6B] whitespace-nowrap">
                                {new Date(sub.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-4 font-medium text-[#0E2F54]">{sub.companyName}</td>
                              <td className="px-5 py-4 text-[#4B5B6B]">
                                <div>{sub.fullName}</div>
                                <div className="text-xs text-[#9AAEBB]">{sub.workEmail}</div>
                              </td>
                              <td className="px-5 py-4 text-[#4B5B6B] max-w-[180px] truncate">
                                <a
                                  href={sub.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1F5E95] hover:text-[#0E2F54] transition-colors"
                                >
                                  {sub.websiteUrl.replace(/^https?:\/\//, "")}
                                </a>
                              </td>
                              <td className="px-5 py-4">
                                {job ? <StatusBadge status={job.status} /> : <span className="text-xs text-[#9AAEBB]">—</span>}
                              </td>
                              <td className="px-5 py-4">
                                {sc ? (
                                  <span className="font-bold text-[#0E2F54]">{sc.overall}/100 <span className="text-[#9AAEBB] font-normal">({sc.overallGrade})</span></span>
                                ) : <span className="text-xs text-[#9AAEBB]">—</span>}
                              </td>
                              <td className="px-5 py-4">
                                {job && (
                                  <button
                                    onClick={() => setSelectedJobId(job.jobId)}
                                    className="text-xs font-semibold text-[#1F5E95] hover:text-[#0E2F54] transition-colors whitespace-nowrap"
                                  >
                                    View Report →
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedJobId && (
        <ReportModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
}
