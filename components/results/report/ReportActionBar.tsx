"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Link2, Loader2, Share2 } from "lucide-react";

export function ReportActionBar({
  token,
  companyName,
}: {
  token: string;
  companyName: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "shared" | "error">("idle");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  const pdfUrl = `/api/results/${encodeURIComponent(token)}/pdf`;

  useEffect(() => {
    const url = `${window.location.origin}/results/${encodeURIComponent(token)}`;
    setShareUrl(url);
    setCanNativeShare(typeof navigator !== "undefined" && Boolean(navigator.share));
  }, [token]);

  async function copyLink() {
    const url = shareUrl || `${window.location.origin}/results/${encodeURIComponent(token)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2500);
    }
  }

  async function shareReport() {
    const url = shareUrl || `${window.location.origin}/results/${encodeURIComponent(token)}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${companyName} — GEO Audit Report`,
          text: "Private GEO audit report",
          url,
        });
        setShareState("shared");
        setTimeout(() => setShareState("idle"), 2500);
        return;
      }
      await copyLink();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setShareState("error");
      setTimeout(() => setShareState("idle"), 2500);
    }
  }

  async function downloadPdf() {
    setPdfLoading(true);
    try {
      const resp = await fetch(pdfUrl);
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error ?? "PDF export failed");
      }
      const blob = await resp.blob();
      const disposition = resp.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `geo-report-${companyName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not download PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 md:p-5 shadow-card-md mb-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue mb-3">
        Your report
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {canNativeShare ? (
          <button
            type="button"
            onClick={shareReport}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue text-white px-4 py-2.5 text-sm font-semibold shadow-card hover:bg-brand-blue-hover transition-colors"
          >
            <Share2 size={16} />
            {shareState === "shared" ? "Shared" : shareState === "error" ? "Share failed" : "Share report"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy shadow-card hover:border-brand-blue/40 transition-colors"
        >
          {copyState === "copied" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          {copyState === "copied" ? "Link copied" : copyState === "error" ? "Copy failed" : "Copy share link"}
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy shadow-card hover:border-brand-blue/40 disabled:opacity-60 transition-colors"
        >
          {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {pdfLoading ? "Preparing PDF…" : "Download PDF"}
        </button>
        <a
          href={shareUrl || `#`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-cream px-4 py-2.5 text-sm font-semibold text-brand-muted hover:text-brand-blue transition-colors"
        >
          <Link2 size={16} />
          Open in new tab
        </a>
      </div>
      <p className="text-xs text-brand-subtle mt-3">
        Share this secure link or download a PDF version of your published report.
      </p>
    </div>
  );
}
