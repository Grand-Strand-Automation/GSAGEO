"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Link2, Loader2 } from "lucide-react";

export function ReportActionBar({
  token,
  companyName,
}: {
  token: string;
  companyName: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const pdfUrl = `/api/results/${encodeURIComponent(token)}/pdf`;

  useEffect(() => {
    setShareUrl(`${window.location.origin}/results/${encodeURIComponent(token)}`);
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
    <div className="flex flex-wrap items-center gap-2 justify-end mb-6 -mt-2">
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
        className="inline-flex items-center gap-2 rounded-xl bg-brand-blue text-white px-4 py-2.5 text-sm font-semibold shadow-card hover:bg-brand-blue-hover disabled:opacity-60 transition-colors"
      >
        {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {pdfLoading ? "Preparing PDF…" : "Download PDF"}
      </button>
      <a
        href={shareUrl || `#`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-muted hover:text-brand-blue transition-colors"
      >
        <Link2 size={16} />
        Open link
      </a>
    </div>
  );
}
