"use client";

import { useCallback, useEffect, useState } from "react";
import type { CustomerReportStatus } from "@/lib/results/customer-report";

const POLL_MS = 8000;

export function useCustomerReportStatus(token: string, enabled = true) {
  const [status, setStatus] = useState<CustomerReportStatus | null>(null);
  const [loading, setLoading] = useState(Boolean(token && enabled));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return null;
    try {
      const resp = await fetch(`/api/results/${encodeURIComponent(token)}/status`);
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        throw new Error(data.error ?? "Status unavailable");
      }
      const next: CustomerReportStatus = {
        state: data.state,
        ready: data.ready,
        companyName: data.companyName,
        websiteUrl: data.websiteUrl,
        updatedAt: data.updatedAt,
      };
      setStatus(next);
      setError(null);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status unavailable");
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !enabled) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const run = async () => {
      const next = await refresh();
      if (cancelled || !next) return;
      if (!next.ready && next.state !== "failed" && next.state !== "revoked" && next.state !== "expired") {
        timer = setInterval(async () => {
          const polled = await refresh();
          if (polled?.ready) {
            if (timer) clearInterval(timer);
          }
        }, POLL_MS);
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [token, enabled, refresh]);

  return { status, loading, error, refresh };
}
