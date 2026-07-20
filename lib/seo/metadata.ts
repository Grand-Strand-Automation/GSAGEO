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
  title: "Website Design & Redesign | Request a Homepage Mockup | Grand Strand Ally",
  description:
    "Request a custom homepage mockup, then choose a $99 homepage refresh or full website redesign. GEO / AI visibility support available as a next step.",
  path: "/",
});

export const AUDIT_METADATA = buildPageMetadata({
  title: "Start Your Free GEO Assessment | GEO",
  description:
    "Request your free GEO / AI Visibility assessment. Best as a next step after your website is clearer — with homepage refresh and full redesign options available.",
  path: "/audit",
});

export const THANK_YOU_METADATA = buildPageMetadata({
  title: "Assessment Request Received | GEO",
  description:
    "Your GEO / AI Visibility assessment request has been received. Here's what happens next.",
  path: "/thank-you",
  index: false,
});
