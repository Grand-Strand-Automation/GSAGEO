import Link from "next/link";
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
  const { state, bundle } = await loadResultsByToken(token);

  if (state === "ready" && bundle) {
    return <CustomerResultsView bundle={bundle} token={token} />;
  }

  return <ResultsPendingView state={state} token={token} />;
}
