import { BenchmarkPage } from "@/components/benchmark/BenchmarkPage";
import { BENCHMARK_METADATA } from "@/lib/content/benchmark";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: BENCHMARK_METADATA.title,
  description: BENCHMARK_METADATA.description,
  alternates: {
    canonical: BENCHMARK_METADATA.path,
  },
  openGraph: {
    title: `${BENCHMARK_METADATA.title} | GSAGEO`,
    description: BENCHMARK_METADATA.description,
    url: BENCHMARK_METADATA.path,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BENCHMARK_METADATA.title} | GSAGEO`,
    description: BENCHMARK_METADATA.description,
  },
};

export default function MyrtleBeachBenchmarkPage() {
  return <BenchmarkPage />;
}
