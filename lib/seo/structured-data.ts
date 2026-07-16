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
      "Monthly website redesign and hosting for service businesses, with optional GEO / AI visibility support.",
    sameAs: [siteConfig.mainSiteUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Website Redesign + Hosting — Grand Strand Ally",
    url: getSiteUrl(),
    description:
      "See a sample homepage mockup for your business, then launch with monthly redesign + hosting support.",
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
    name: "Monthly Website Redesign + Hosting",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    areaServed: siteConfig.serviceArea,
    description:
      "Instant homepage mockup preview plus month-to-month website redesign, hosting, and ongoing support for service businesses.",
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
