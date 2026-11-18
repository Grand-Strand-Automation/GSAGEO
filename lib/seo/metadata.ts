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
  const ogImage = absoluteUrl("/opengraph-image");

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Grand Strand Ally GEO — AI Visibility for Local Service Businesses",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export const HOME_METADATA = buildPageMetadata({
  title: "AI Visibility for Service Businesses | Grand Strand Ally GEO",
  description:
    "GEO (Generative Engine Optimization) for Grand Strand service businesses. We check how ChatGPT, Google AI Overviews, Perplexity, Copilot and Gemini read your site — then help you fix it month to month.",
  path: "/",
});

export const AUDIT_METADATA = buildPageMetadata({
  title: "Free AI Visibility Assessment | Grand Strand Ally GEO",
  description:
    "GEO = Generative Engine Optimization. Enter your website, tell us how to reach you, and get a free AI visibility score — usually within minutes.",
  path: "/audit",
});

export const SAMPLE_REPORT_METADATA = buildPageMetadata({
  title: "Sample AI Visibility Report | Grand Strand Ally GEO",
  description:
    "Preview a fictional GEO assessment: AI Visibility Score, how five AI tools see the business, signal breakdown with plain-English glossary, and top priorities.",
  path: "/sample-report",
});

export const THANK_YOU_METADATA = buildPageMetadata({
  title: "Assessment Request Received | Grand Strand Ally GEO",
  description:
    "Your GEO / AI Visibility assessment request has been received. Here's what happens next.",
  path: "/thank-you",
  index: false,
});
