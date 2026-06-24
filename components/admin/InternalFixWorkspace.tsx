"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  Check,
  Copy,
  Download,
  EyeOff,
  Loader2,
  RefreshCw,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import type { GeoInternalFix } from "@/lib/types/database";
import type { InternalFixGeneratedContent } from "@/lib/internal-fixes/types";

const TYPE_LABELS: Record<string, string> = {
  faq_fix: "FAQ",
  service_page_fix: "Service page",
  cta_fix: "CTA / conversion",
  internal_link_fix: "Internal linking",
  schema_fix: "Structured data",
  trust_content_fix: "Trust / proof",
  process_fix: "Process / methodology",
  educational_content_fix: "Educational content",
  about_copy_fix: "About / entity",
  page_quick_fix: "Page quick fix",
};

const STATUS_LABELS: Record<string, string> = {
  generated: "Generated",
  needs_review: "Needs review",
  approved_internal: "Approved (internal)",
  edited_internal: "Edited",
  hidden: "Hidden",
  rejected: "Rejected",
  archived: "Archived",
};

function formatFixBody(fix: GeoInternalFix): string {
  const content = (fix.generated_content ?? {}) as InternalFixGeneratedContent;
  const parts: string[] = [
    `# ${fix.title}`,
    "",
    `Finding: ${fix.related_finding_label ?? "—"}`,
    `Issue: ${fix.issue_summary}`,
    `Why it matters: ${fix.why_it_matters}`,
    "",
    "Implementation notes:",
    fix.implementation_notes ?? "—",
    "",
  ];

  if (content.sections?.length) {
    parts.push("Sections:");
    for (const s of content.sections) {
      parts.push(`\n## ${s.heading}\n${s.body}`);
    }
  }
  if (content.faqs?.length) {
    parts.push("\nFAQs:");
    for (const f of content.faqs) {
      parts.push(`Q: ${f.question}\nA: ${f.answer}${f.placement ? `\nPlacement: ${f.placement}` : ""}`);
    }
  }
  if (content.links?.length) {
    parts.push("\nInternal links:");
    for (const l of content.links) {
      parts.push(`• ${l.source} → ${l.target} (“${l.anchor}”) [${l.priority}] — ${l.rationale}`);
    }
  }
  if (content.ctaVariants?.length) {
    parts.push("\nCTA variants:");
    for (const v of content.ctaVariants) {
      parts.push(`• ${v.label}: ${v.copy}`);
    }
  }
  if (content.schemaBlocks?.length) {
    parts.push("\nSchema blocks:");
    for (const b of content.schemaBlocks) {
      parts.push(`${b.schemaType} @ ${b.placement}\n${JSON.stringify(b.json, null, 2)}`);
    }
  }
  if (content.pageChanges?.length) {
    parts.push("\nPage changes:");
    for (const p of content.pageChanges) {
      parts.push(`• ${p.page}: ${p.change}${p.example ? `\n  Example: ${p.example}` : ""}`);
    }
  }
  if (content.topics?.length) {
    parts.push("\nContent topics:");
    for (const t of content.topics) {
      parts.push(`• ${t.title} — ${t.angle}\n  ${t.addresses}`);
    }
  }
  if (content.caution) {
    parts.push(`\nCaution: ${content.caution}`);
  }
  if (fix.generated_json) {
    parts.push(`\nJSON:\n${JSON.stringify(fix.generated_json, null, 2)}`);
  }

  return parts.join("\n");
}

function FixContentPreview({ fix }: { fix: GeoInternalFix }) {
  const content = (fix.generated_content ?? {}) as InternalFixGeneratedContent;

  return (
    <div className="space-y-4 text-sm text-brand-navy">
      {content.caution ? (
        <p className="rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 text-xs">
          {content.caution}
        </p>
      ) : null}

      {content.sections?.map((s) => (
        <div key={s.heading}>
          <p className="font-semibold text-brand-navy">{s.heading}</p>
          <p className="text-brand-muted whitespace-pre-wrap mt-1">{s.body}</p>
        </div>
      ))}

      {content.faqs?.map((f) => (
        <div key={f.question} className="rounded-lg border border-brand-border p-3 bg-brand-cream/50">
          <p className="font-semibold">{f.question}</p>
          <p className="text-brand-muted mt-1">{f.answer}</p>
          {f.placement ? <p className="text-xs text-brand-subtle mt-2">Placement: {f.placement}</p> : null}
        </div>
      ))}

      {content.links?.length ? (
        <ul className="space-y-2">
          {content.links.map((l) => (
            <li key={`${l.source}-${l.target}`} className="text-brand-muted">
              <span className="font-medium text-brand-navy">{l.source}</span> → {l.target} (“{l.anchor}”)
              <span className="text-xs ml-2 uppercase text-brand-blue">{l.priority}</span>
              <p className="text-xs mt-0.5">{l.rationale}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {content.ctaVariants?.map((v) => (
        <div key={v.label}>
          <p className="font-semibold">{v.label}</p>
          <p className="text-brand-muted mt-1">{v.copy}</p>
        </div>
      ))}

      {content.pageChanges?.map((p) => (
        <div key={p.page}>
          <p className="font-semibold">{p.page}</p>
          <p className="text-brand-muted mt-1">{p.change}</p>
          {p.example ? <p className="text-xs text-brand-subtle mt-1">Example: {p.example}</p> : null}
        </div>
      ))}

      {content.topics?.map((t) => (
        <div key={t.title}>
          <p className="font-semibold">{t.title}</p>
          <p className="text-brand-muted text-xs">{t.angle}</p>
          <p className="text-brand-muted mt-1">{t.addresses}</p>
        </div>
      ))}

      {fix.generated_html ? (
        <details className="rounded-lg border border-brand-border p-3">
          <summary className="cursor-pointer font-semibold text-xs uppercase text-brand-blue">
            HTML preview
          </summary>
          <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">{fix.generated_html}</pre>
        </details>
      ) : null}

      {fix.generated_json ? (
        <details className="rounded-lg border border-brand-border p-3">
          <summary className="cursor-pointer font-semibold text-xs uppercase text-brand-blue">
            JSON-LD / structured output
          </summary>
          <pre className="mt-2 text-xs overflow-x-auto">{JSON.stringify(fix.generated_json, null, 2)}</pre>
        </details>
      ) : null}
    </div>
  );
}

export function InternalFixWorkspace({
  submissionId,
  initialFixes,
  jobId,
}: {
  submissionId: string;
  initialFixes: GeoInternalFix[];
  jobId: string | null;
}) {
  const [fixes, setFixes] = useState(initialFixes);
  const [selectedId, setSelectedId] = useState<string | null>(initialFixes[0]?.id ?? null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return fixes.filter((f) => {
      if (typeFilter !== "all" && f.type !== typeFilter) return false;
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (statusFilter === "active" && ["hidden", "rejected", "archived"].includes(f.status)) return false;
      return true;
    });
  }, [fixes, typeFilter, statusFilter]);

  const selected = fixes.find((f) => f.id === selectedId) ?? filtered[0] ?? null;

  async function refreshFixes() {
    const resp = await fetch(`/api/admin/submissions/${submissionId}/internal-fixes`);
    const data = await resp.json();
    if (data.ok) setFixes(data.fixes);
  }

  async function patchFix(fixId: string, body: Record<string, unknown>) {
    setLoading(fixId);
    setMessage(null);
    try {
      const resp = await fetch(`/api/admin/internal-fixes/${fixId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error ?? "Update failed");
      setFixes((prev) => prev.map((f) => (f.id === fixId ? data.fix : f)));
      setMessage("Fix updated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(null);
    }
  }

  async function regenerateAll() {
    if (!jobId) return;
    setLoading("generate-all");
    setMessage(null);
    try {
      const resp = await fetch(`/api/admin/submissions/${submissionId}/internal-fixes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replaceExisting: true }),
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error ?? "Generation failed");
      await refreshFixes();
      setMessage(`Regenerated ${data.generated} internal fix draft(s).`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(null);
    }
  }

  async function regenerateOne(fixId: string) {
    setLoading(fixId);
    setMessage(null);
    try {
      const resp = await fetch(`/api/admin/internal-fixes/${fixId}/regenerate`, { method: "POST" });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error ?? "Regeneration failed");
      setFixes((prev) => prev.map((f) => (f.id === fixId ? data.fix : f)));
      setMessage("Fix regenerated.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setLoading(null);
    }
  }

  async function promoteFix(fixId: string) {
    setLoading(fixId);
    setMessage(null);
    try {
      const resp = await fetch(`/api/admin/internal-fixes/${fixId}/promote`, { method: "POST" });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error ?? "Promotion failed");
      await refreshFixes();
      setMessage(data.message ?? "Customer-safe draft preview created.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Promotion failed");
    } finally {
      setLoading(null);
    }
  }

  async function copyFix(fix: GeoInternalFix) {
    try {
      await navigator.clipboard.writeText(formatFixBody(fix));
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setMessage("Copy failed — try export instead.");
    }
  }

  function exportPacket() {
    window.location.href = `/api/admin/submissions/${submissionId}/internal-fixes/export`;
  }

  return (
    <section className="bg-white rounded-xl border border-brand-border overflow-hidden">
      <div className="border-b border-brand-border bg-brand-navy/5 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-brand-blue" />
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-blue">
                Employee-only fix workspace
              </p>
            </div>
            <h2 className="text-lg font-heading font-bold text-brand-navy">
              Internal Fix Drafts
            </h2>
            <p className="text-sm text-brand-muted mt-1 max-w-2xl">
              Implementation-ready fix suggestions for your team.{" "}
              <span className="font-semibold text-brand-navy">Not customer-visible.</span>{" "}
              Use promote only when you want a sanitized customer preview draft.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={regenerateAll}
              disabled={!jobId || loading === "generate-all"}
              className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-2 text-sm font-semibold text-brand-navy hover:border-brand-blue/40 disabled:opacity-60"
            >
              {loading === "generate-all" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Regenerate all
            </button>
            <button
              type="button"
              onClick={exportPacket}
              disabled={!fixes.length}
              className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-2 text-sm font-semibold text-brand-navy hover:border-brand-blue/40 disabled:opacity-60"
            >
              <Download size={14} />
              Export packet
            </button>
          </div>
        </div>

        {message ? (
          <p className="text-sm text-brand-blue mt-3">{message}</p>
        ) : null}
      </div>

      {!jobId ? (
        <p className="p-6 text-sm text-brand-muted">No audit job yet — internal fixes generate after audit completes.</p>
      ) : fixes.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-brand-muted mb-4">No internal fixes yet for this submission.</p>
          <button
            type="button"
            onClick={regenerateAll}
            disabled={loading === "generate-all"}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue text-white px-4 py-2 text-sm font-semibold"
          >
            <Sparkles size={14} />
            Generate internal fixes
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] min-h-[420px]">
          <div className="border-b lg:border-b-0 lg:border-r border-brand-border p-4 space-y-3">
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 text-xs rounded-lg border border-brand-border px-2 py-1.5 bg-white"
              >
                <option value="all">All types</option>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 text-xs rounded-lg border border-brand-border px-2 py-1.5 bg-white"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <ul className="space-y-1 max-h-[480px] overflow-y-auto">
              {filtered.map((fix) => (
                <li key={fix.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(fix.id)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
                      selected?.id === fix.id
                        ? "bg-brand-blue-light border border-brand-blue/20"
                        : "hover:bg-brand-cream border border-transparent"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase text-brand-blue">
                      {TYPE_LABELS[fix.type] ?? fix.type}
                    </p>
                    <p className="text-sm font-semibold text-brand-navy line-clamp-2">{fix.title}</p>
                    <p className="text-xs text-brand-subtle mt-1">
                      {STATUS_LABELS[fix.status] ?? fix.status} · {fix.priority.replace("_", " ")}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selected ? (
            <div className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    Internal only · Hidden from customer report
                  </span>
                  <h3 className="text-xl font-heading font-bold text-brand-navy mt-2">{selected.title}</h3>
                  <p className="text-sm text-brand-muted mt-1">
                    Linked finding: {selected.related_finding_label ?? "—"} ·{" "}
                    {TYPE_LABELS[selected.type] ?? selected.type}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyFix(selected)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold"
                  >
                    {copyState === "copied" ? <Check size={12} /> : <Copy size={12} />}
                    {copyState === "copied" ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => regenerateOne(selected.id)}
                    disabled={loading === selected.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold"
                  >
                    <RefreshCw size={12} />
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => patchFix(selected.id, { status: "approved_internal" })}
                    disabled={loading === selected.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold"
                  >
                    <Check size={12} />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => promoteFix(selected.id)}
                    disabled={loading === selected.id || Boolean(selected.promoted_preview_id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-blue text-brand-blue px-3 py-1.5 text-xs font-semibold"
                  >
                    <Sparkles size={12} />
                    {selected.promoted_preview_id ? "Promoted" : "Promote to customer draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => patchFix(selected.id, { status: "hidden" })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand-muted"
                  >
                    <EyeOff size={12} />
                    Hide
                  </button>
                  <button
                    type="button"
                    onClick={() => patchFix(selected.id, { status: "rejected" })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-700 px-3 py-1.5 text-xs font-semibold"
                  >
                    <X size={12} />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => patchFix(selected.id, { status: "archived" })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand-muted"
                  >
                    <Archive size={12} />
                    Archive
                  </button>
                </div>
              </div>

              <dl className="grid sm:grid-cols-3 gap-3 mb-5 text-xs">
                <div className="rounded-lg bg-brand-cream p-3">
                  <dt className="font-bold uppercase text-brand-subtle">Priority</dt>
                  <dd className="mt-1 font-semibold text-brand-navy">{selected.priority.replace(/_/g, " ")}</dd>
                </div>
                <div className="rounded-lg bg-brand-cream p-3">
                  <dt className="font-bold uppercase text-brand-subtle">Effort</dt>
                  <dd className="mt-1 font-semibold text-brand-navy">{selected.implementation_effort}</dd>
                </div>
                <div className="rounded-lg bg-brand-cream p-3">
                  <dt className="font-bold uppercase text-brand-subtle">Confidence</dt>
                  <dd className="mt-1 font-semibold text-brand-navy">{selected.confidence}</dd>
                </div>
              </dl>

              <div className="rounded-xl border border-brand-border p-4 mb-4 bg-white">
                <p className="text-xs font-bold uppercase text-brand-subtle mb-2">Issue summary</p>
                <p className="text-sm text-brand-navy">{selected.issue_summary}</p>
                <p className="text-xs font-bold uppercase text-brand-subtle mt-4 mb-2">Why it matters</p>
                <p className="text-sm text-brand-muted">{selected.why_it_matters}</p>
                {selected.affected_urls?.length ? (
                  <>
                    <p className="text-xs font-bold uppercase text-brand-subtle mt-4 mb-2">Affected URLs</p>
                    <ul className="text-xs text-brand-blue space-y-1">
                      {selected.affected_urls.map((u) => (
                        <li key={u} className="truncate">{u}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div className="rounded-xl border border-brand-border p-4 mb-4">
                <p className="text-xs font-bold uppercase text-brand-blue mb-3">Generated implementation draft</p>
                <FixContentPreview fix={selected} />
              </div>

              <div className="rounded-xl border border-brand-border p-4">
                <p className="text-xs font-bold uppercase text-brand-subtle mb-2">Implementation notes</p>
                <p className="text-sm text-brand-muted whitespace-pre-wrap">
                  {selected.implementation_notes ?? "—"}
                </p>
                {selected.internal_note ? (
                  <>
                    <p className="text-xs font-bold uppercase text-brand-subtle mt-4 mb-2">Internal note</p>
                    <p className="text-sm text-brand-muted">{selected.internal_note}</p>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="p-6 text-sm text-brand-muted">Select a fix to review.</p>
          )}
        </div>
      )}
    </section>
  );
}
