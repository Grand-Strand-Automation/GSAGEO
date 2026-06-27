import { BenchmarkPage } from "@/components/benchmark/BenchmarkPage";
import { BENCHMARK_METADATA } from "@/lib/content/benchmark";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: `${BENCHMARK_METADATA.title} | GEO`,
  description: BENCHMARK_METADATA.description,
  path: BENCHMARK_METADATA.path,
});

export default function MyrtleBeachBenchmarkPage() {
  return <BenchmarkPage />;
}
