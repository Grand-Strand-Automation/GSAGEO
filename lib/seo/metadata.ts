import type { Metadata } from "next";
import { absoluteUrl } from "./site-url";

const SITE_NAME = "Grand Strand Ally GEO";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  ogType?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
  ogType = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export const HOME_METADATA = buildPageMetadata({
  title: "AI Visibility for Service Businesses | Grand Strand Ally GEO",
  description:
    "We check how ChatGPT, Google AI Overviews, Perplexity and Microsoft Copilot read your website, show you what's holding you back, and help you fix it month to month.",
  path: "/",
});

export const AUDIT_METADATA = buildPageMetadata({
  title: "Free AI Visibility Assessment | Grand Strand Ally GEO",
  description:
    "See how AI tools see your business. Four short steps — only the first is required. Free assessment, results usually within minutes.",
  path: "/audit",
});

export const SAMPLE_REPORT_METADATA = buildPageMetadata({
  title: "Sample AI Visibility Report | Grand Strand Ally GEO",
  description:
    "See exactly what a Grand Strand Ally GEO assessment looks like — score, engine visibility, signal breakdown, and top priorities.",
  path: "/sample-report",
});

export const THANK_YOU_METADATA = buildPageMetadata({
  title: "Assessment Request Received | Grand Strand Ally GEO",
  description:
    "Your GEO / AI Visibility assessment request has been received. Here's what happens next.",
  path: "/thank-you",
  index: false,
});
