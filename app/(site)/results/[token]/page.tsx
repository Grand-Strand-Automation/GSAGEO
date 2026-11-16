import { loadResultsByToken } from "@/lib/results/access";
import { CustomerResultsView } from "@/components/results/CustomerResultsView";
import { ResultsPendingView } from "@/components/results/ResultsPendingView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your GEO Assessment Results",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CustomerResultsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let state: Awaited<ReturnType<typeof loadResultsByToken>>["state"] = "not_found";
  let bundle: Awaited<ReturnType<typeof loadResultsByToken>>["bundle"] = null;

  try {
    const loaded = await loadResultsByToken(token);
    state = loaded.state;
    bundle = loaded.bundle;
  } catch {
    // Missing Supabase env or transient DB errors — show a safe empty state.
    state = "not_found";
    bundle = null;
  }

  if (state === "ready" && bundle) {
    return <CustomerResultsView bundle={bundle} token={token} />;
  }

  return <ResultsPendingView state={state} token={token} />;
}
