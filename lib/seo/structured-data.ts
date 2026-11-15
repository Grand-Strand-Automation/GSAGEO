import { FAQ_ITEMS } from "@/lib/content/landing";
import { siteConfig } from "@/lib/brand/site";
import { absoluteUrl, getSiteUrl } from "./site-url";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    name: siteConfig.name,
    url: getSiteUrl(),
    email: siteConfig.email,
    areaServed: [
      {
        "@type": "Place",
        name: "Grand Strand",
      },
      {
        "@type": "City",
        name: "Myrtle Beach",
        containedInPlace: {
          "@type": "State",
          name: "South Carolina",
        },
      },
    ],
    description:
      "AI visibility support for service businesses. Free assessment first, then month-to-month GEO guidance.",
    sameAs: [siteConfig.mainSiteUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Grand Strand Ally GEO",
    url: getSiteUrl(),
    description:
      "GEO and AI visibility assessments for service businesses in Myrtle Beach and the Grand Strand.",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
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
    areaServed: "Grand Strand / Myrtle Beach, SC",
    description:
      "Free assessment of how ChatGPT, Google AI Overviews, Perplexity and Microsoft Copilot see your business — plus optional month-to-month support.",
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
