"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Loader2,
  RefreshCw,
  ShieldOff,
} from "lucide-react";
import type { ShareStatus } from "@/lib/results/share";

export function ReportDistributionPanel({
  submissionId,
  jobStatus,
}: {
  submissionId: string;
  jobStatus: string | null;
}) {
  const [status, setStatus] = useState<ShareStatus | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [message, setMessage] = useState("");

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/admin/submissions/${submissionId}/share`);
      const data = await resp.json();
      if (data.ok) {
        setStatus({
          published: data.published,
          shareable: data.shareable,
          hasActiveToken: data.hasActiveToken,
          activeTokenCreatedAt: data.activeTokenCreatedAt,
          lastAccessedAt: data.lastAccessedAt,
          message: data.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus, jobStatus]);

  async function generateLink() {
    setAction("generate");
    setMessage("");
    try {
      const resp = await fetch(`/api/admin/submissions/${submissionId}/share`, { method: "POST" });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Failed to generate link");
      setShareUrl(data.url);
      setMessage("New share link generated. Previous links no longer work.");
      await loadStatus();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not generate link.");
    } finally {
      setAction(null);
    }
  }

  async function copyLink() {
    if (!shareUrl) {
      setMessage("Generate a share link first.");
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2500);
  }

  async function revokeLink() {
    setAction("revoke");
    setMessage("");
    try {
      const resp = await fetch(`/api/admin/submissions/${submissionId}/share/revoke`, {
        method: "POST",
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Failed to revoke");
      setShareUrl("");
      setMessage("Share link revoked.");
      await loadStatus();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not revoke link.");
    } finally {
      setAction(null);
    }
  }

  async function downloadPdf(variant: "customer" | "technical" = "customer") {
    setAction(variant === "technical" ? "pdf-technical" : "pdf");
    setMessage("");
    try {
      const pdfUrl =
        variant === "technical"
          ? `/api/admin/submissions/${submissionId}/pdf?variant=technical`
          : `/api/admin/submissions/${submissionId}/pdf`;
      const resp = await fetch(pdfUrl);
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error ?? "PDF export failed");
      }
      const blob = await resp.blob();
      const disposition = resp.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "geo-report.pdf";
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not download PDF.");
    } finally {
      setAction(null);
    }
  }

  const shareable = status?.shareable ?? false;

  return (
    <section className="bg-white rounded-xl border border-brand-border p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase text-brand-blue mb-1">Report distribution</h2>
          <p className="text-sm text-brand-muted">
            Share and export the final customer-ready published report.
          </p>
        </div>
        {loading ? <Loader2 size={18} className="animate-spin text-brand-subtle" /> : null}
      </div>

      <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5 text-sm">
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Publication</dt>
          <dd className="text-brand-navy mt-1 capitalize">{jobStatus?.replace(/_/g, " ") ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Shareable</dt>
          <dd className="text-brand-navy mt-1">{shareable ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-brand-subtle">Active link</dt>
          <dd className="text-brand-navy mt-1">{status?.hasActiveToken ? "Yes" : "No"}</dd>
        </div>
      </dl>

      {status?.message ? (
        <p className="text-xs text-brand-muted mb-4 bg-brand-cream rounded-lg px-3 py-2 border border-brand-border">
          {status.message}
        </p>
      ) : null}

      {shareUrl ? (
        <div className="mb-4 rounded-lg border border-brand-border bg-brand-cream/60 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-subtle mb-1">
            Customer report URL
          </p>
          <p className="text-xs text-brand-navy break-all font-mono">{shareUrl}</p>
        </div>
      ) : null}

      {message ? <p className="text-xs text-brand-blue mb-3">{message}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={generateLink}
          disabled={!shareable || action === "generate"}
          className="inline-flex items-center gap-2 text-sm bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {action === "generate" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Generate share link
        </button>
        <button
          type="button"
          onClick={copyLink}
          disabled={!shareable || !shareUrl}
          className="inline-flex items-center gap-2 text-sm border border-brand-border px-4 py-2 rounded-lg font-semibold text-brand-navy disabled:opacity-50"
        >
          {copyState === "copied" ? <Check size={14} /> : <Copy size={14} />}
          Copy link
        </button>
        {shareUrl ? (
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm border border-brand-border px-4 py-2 rounded-lg font-semibold text-brand-navy"
          >
            <ExternalLink size={14} />
            Open customer report
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => downloadPdf("customer")}
          disabled={!shareable || action === "pdf"}
          className="inline-flex items-center gap-2 text-sm border border-brand-border px-4 py-2 rounded-lg font-semibold text-brand-navy disabled:opacity-50"
        >
          {action === "pdf" ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download customer PDF
        </button>
        <button
          type="button"
          onClick={() => downloadPdf("technical")}
          disabled={!shareable || action === "pdf-technical"}
          className="inline-flex items-center gap-2 text-sm border border-brand-border px-4 py-2 rounded-lg font-semibold text-brand-navy disabled:opacity-50"
        >
          {action === "pdf-technical" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          Download technical PDF
        </button>
        <button
          type="button"
          onClick={revokeLink}
          disabled={!shareable || !status?.hasActiveToken || action === "revoke"}
          className="inline-flex items-center gap-2 text-sm border border-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {action === "revoke" ? <Loader2 size={14} className="animate-spin" /> : <ShieldOff size={14} />}
          Revoke link
        </button>
      </div>

      {!shareable ? (
        <p className="text-xs text-brand-subtle mt-4">
          Share and PDF export unlock once the report is published to the customer.
        </p>
      ) : null}
    </section>
  );
}
