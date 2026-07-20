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
  title: "$99 Website Refresh | Homepage + Key Pages | Grand Strand Ally",
  description:
    "See a sample homepage mockup for your business, then refresh your homepage and 2–3 key sub pages for a flat $99.",
  path: "/",
});

export const AUDIT_METADATA = buildPageMetadata({
  title: "Start Your Free GEO Assessment | GEO",
  description:
    "Request your free GEO / AI Visibility assessment. Get clear findings and practical next steps — with an optional $99 website refresh when you are ready.",
  path: "/audit",
});

export const THANK_YOU_METADATA = buildPageMetadata({
  title: "Assessment Request Received | GEO",
  description:
    "Your GEO / AI Visibility assessment request has been received. Here's what happens next.",
  path: "/thank-you",
  index: false,
});
