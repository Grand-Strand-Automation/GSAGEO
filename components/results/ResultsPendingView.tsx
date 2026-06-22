"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  AlertCircle,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  CUSTOMER_STATUS_COPY,
  type CustomerResultsState,
} from "@/lib/results/customer-state";
import { useCustomerReportStatus } from "./useCustomerReportStatus";

function StateIcon({ state }: { state: CustomerResultsState }) {
  if (state === "failed" || state === "expired" || state === "revoked") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={28} />
      </div>
    );
  }
  if (state === "awaiting_review") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-6">
        <ShieldCheck size={28} />
      </div>
    );
  }
  if (state === "processing" || state === "pending") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-6">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }
  return null;
}

export function ResultsPendingView({
  state: initialState,
  token,
}: {
  state: CustomerResultsState;
  token: string;
}) {
  const router = useRouter();
  const { status } = useCustomerReportStatus(token, true);
  const state = status?.state ?? initialState;
  const copy = CUSTOMER_STATUS_COPY[state] ?? CUSTOMER_STATUS_COPY.pending;
  const isWaiting = state === "pending" || state === "processing" || state === "awaiting_review";

  useEffect(() => {
    if (status?.ready) {
      router.refresh();
    }
  }, [status?.ready, router]);

  return (
    <div className="report-page bg-brand-cream min-h-screen pt-24 pb-16 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="report-pending-card rounded-3xl border border-brand-border bg-white shadow-card-md overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-blue via-brand-sky to-brand-blue" />
          <div className="p-8 md:p-12 text-center">
            <StateIcon state={state} />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue mb-3">
              GEO Audit Report
            </p>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy mb-4">
              {copy.title}
            </h1>
            <p
              className={`text-sm md:text-[15px] leading-relaxed max-w-md mx-auto ${
                copy.tone === "error" ? "text-red-700" : "text-brand-muted"
              }`}
            >
              {copy.body}
            </p>

            {isWaiting ? (
              <div className="mt-8 rounded-2xl border border-brand-border bg-brand-cream/70 p-5 text-left max-w-md mx-auto">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-subtle mb-3">
                  While you wait
                </p>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-start gap-2">
                    <RefreshCw size={14} className="mt-0.5 shrink-0 text-brand-blue" />
                    This page checks for updates automatically every few seconds
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock size={14} className="mt-0.5 shrink-0 text-brand-blue" />
                    Your private link stays the same — bookmark it for later
                  </li>
                </ul>
              </div>
            ) : null}

            {isWaiting ? (
              <p className="text-xs text-brand-subtle mt-6 inline-flex items-center gap-2 justify-center">
                <Loader2 size={14} className="animate-spin text-brand-blue" />
                Checking for your report…
              </p>
            ) : null}

            <div className="mt-8">
              <Link href="/" className="text-sm text-brand-blue hover:underline">
                ← Back to GEO home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
