import type { Metadata } from "next";
import { MockupResultView } from "@/components/mockup/MockupResultView";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Your Homepage Mockup Preview | Grand Strand Ally",
  description:
    "Review your sample homepage concept, then choose a monthly redesign + hosting plan to launch and improve it.",
  path: "/mockup",
  index: false,
});

type Props = { params: Promise<{ token: string }> };

export default async function MockupResultPage({ params }: Props) {
  const { token } = await params;
  return <MockupResultView token={token} />;
}
