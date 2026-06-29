import type { Metadata } from "next";
import { absoluteUrl } from "./site-url";

const SITE_NAME = "GEO";

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
  title: "GEO / AI Visibility Assessments for Service Businesses | GEO",
  description:
    "See how clearly your business is positioned for ChatGPT, Google AI Overviews, and AI-driven search. GEO assessments for service businesses with clear deliverables and practical next steps.",
  path: "/",
});

export const AUDIT_METADATA = buildPageMetadata({
  title: "Complete Your Assessment Request | GEO",
  description:
    "Fill out the form on this page to request your GEO / AI Visibility assessment. Submit your business and website details to start your review.",
  path: "/audit",
});

export const THANK_YOU_METADATA = buildPageMetadata({
  title: "Assessment Request Received | GEO",
  description:
    "Your GEO / AI Visibility assessment request has been received. Here's what happens next.",
  path: "/thank-you",
  index: false,
});
