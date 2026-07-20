import type { Metadata } from "next";
import { MockupResultView } from "@/components/mockup/MockupResultView";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Your Homepage Mockup Preview | Grand Strand Ally",
  description:
    "Review your sample homepage concept, then start the $99 Website Refresh for your homepage and 2–3 key sub pages.",
  path: "/mockup",
  index: false,
});

type Props = { params: Promise<{ token: string }> };

export default async function MockupResultPage({ params }: Props) {
  const { token } = await params;
  return <MockupResultView token={token} />;
}
