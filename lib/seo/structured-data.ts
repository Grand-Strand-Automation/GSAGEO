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
      "Website design and redesign for businesses — custom homepage mockup requests, $99 homepage refresh, full-site redesign, and optional GEO / AI visibility support.",
    sameAs: [siteConfig.mainSiteUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Website Design & Redesign — Grand Strand Ally",
    url: getSiteUrl(),
    description:
      "Request a custom homepage mockup, then choose a $99 homepage refresh or full website redesign. GEO support available as a next step.",
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
    name: "Website Design and Redesign",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    areaServed: siteConfig.serviceArea,
    description:
      "Custom homepage mockup requests, $99 homepage refresh, and full website design / redesign for businesses of all types, with GEO as a next-stage offer.",
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
