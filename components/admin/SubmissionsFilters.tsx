"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { formatPlanLabel, INTAKE_PLAN_OPTIONS } from "@/lib/brand/plans";

const STATUS_OPTIONS = ["submitted", "reviewing", "contacted", "closed"] as const;

export function SubmissionsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const plan = searchParams.get("plan") ?? "";

  const apply = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`/admin/submissions?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 mb-6 flex flex-col lg:flex-row gap-3">
      <input
        type="search"
        defaultValue={q}
        placeholder="Search company or email…"
        className="flex-1 border border-brand-border rounded-lg h-10 px-3 text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            apply({ q: (e.target as HTMLInputElement).value.trim() });
          }
        }}
      />
      <select
        defaultValue={status}
        className="border border-brand-border rounded-lg h-10 px-3 text-sm bg-white"
        onChange={(e) => apply({ status: e.target.value })}
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        defaultValue={plan}
        className="border border-brand-border rounded-lg h-10 px-3 text-sm bg-white"
        onChange={(e) => apply({ plan: e.target.value })}
      >
        <option value="">All plans</option>
        {INTAKE_PLAN_OPTIONS.map((p) => (
          <option key={p.value} value={p.value}>
            {formatPlanLabel(p.value)}
          </option>
        ))}
        <option value="audit">{formatPlanLabel("audit")}</option>
        <option value="foundation">{formatPlanLabel("foundation")}</option>
      </select>
      <button
        type="button"
        disabled={pending}
        className="border border-brand-border rounded-lg h-10 px-4 text-sm font-semibold text-brand-navy hover:bg-brand-cream disabled:opacity-60"
        onClick={() => router.push("/admin/submissions")}
      >
        Clear
      </button>
      {pending && <span className="text-xs text-brand-muted self-center">Updating…</span>}
    </div>
  );
}
