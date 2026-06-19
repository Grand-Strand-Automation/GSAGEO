"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function JobActions({
  jobId,
  jobStatus,
  submissionId,
}: {
  jobId: string;
  jobStatus: string;
  submissionId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function publish() {
    setLoading("publish");
    setMessage("");
    const resp = await fetch(`/api/admin/jobs/${jobId}/publish`, { method: "POST" });
    setLoading(null);
    if (!resp.ok) {
      setMessage("Publish failed");
      return;
    }
    router.refresh();
  }

  async function rerun() {
    setLoading("rerun");
    setMessage("");
    const resp = await fetch(`/api/admin/jobs/${jobId}/rerun`, { method: "POST" });
    setLoading(null);
    if (!resp.ok) {
      setMessage("Re-run failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {(jobStatus === "awaiting_review" || jobStatus === "complete") && (
        <button
          type="button"
          onClick={publish}
          disabled={!!loading}
          className="text-sm bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading === "publish" ? "Publishing…" : "Publish to customer"}
        </button>
      )}
      <button
        type="button"
        onClick={rerun}
        disabled={!!loading}
        className="text-sm border border-brand-border px-4 py-2 rounded-lg font-semibold text-brand-navy disabled:opacity-60"
      >
        {loading === "rerun" ? "Queuing…" : "Re-run audit"}
      </button>
      {message && <span className="text-sm text-red-600">{message}</span>}
      <span className="text-xs text-brand-subtle">Submission {submissionId.slice(0, 8)}…</span>
    </div>
  );
}
