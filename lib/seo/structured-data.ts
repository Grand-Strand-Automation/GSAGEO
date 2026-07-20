import { FAQ_ITEMS } from "@/lib/content/landing";
import { siteConfig } from "@/lib/brand/site";
import { absoluteUrl, getSiteUrl } from "./site-url";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: getSiteUrl(),
    email: siteConfig.email,
    areaServed: {
      "@type": "Place",
      name: siteConfig.serviceArea,
    },
    description:
      "$99 Website Refresh for service businesses — homepage plus 2–3 key sub pages, with optional GEO / AI visibility support.",
    sameAs: [siteConfig.mainSiteUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "$99 Website Refresh — Grand Strand Ally",
    url: getSiteUrl(),
    description:
      "See a sample homepage mockup for your business, then refresh your homepage and 2–3 key sub pages for a flat $99.",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.mainSiteUrl,
    },
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "$99 Website Refresh",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    areaServed: siteConfig.serviceArea,
    description:
      "Instant homepage mockup preview plus a flat $99 refresh of your homepage and 2–3 key sub pages for service businesses.",
    url: absoluteUrl("/"),
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function homeStructuredData() {
  return [organizationJsonLd(), websiteJsonLd(), serviceJsonLd(), faqPageJsonLd()];
}
