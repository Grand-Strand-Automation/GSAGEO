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
      "GEO and AI visibility assessments for service businesses in Myrtle Beach and the Grand Strand.",
    sameAs: [siteConfig.mainSiteUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GEO — AI Visibility Assessments",
    url: getSiteUrl(),
    description:
      "Practical GEO / AI visibility assessments for service businesses with clear deliverables and next steps.",
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
    name: "GEO / AI Visibility Assessment",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    areaServed: siteConfig.serviceArea,
    description:
      "Structured assessment of service page clarity, trust content, internal linking, schema readiness, and AI search visibility gaps.",
    url: absoluteUrl("/audit"),
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
