import { ABOUT_BLOCK, FAQ_ITEMS, TIERS } from "@/lib/content/landing";
import { siteConfig } from "@/lib/brand/site";
import { absoluteUrl, getSiteUrl } from "./site-url";

function priceAmount(price: string): string | undefined {
  const match = price.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match?.[1];
}

export function organizationJsonLd() {
  const sameAs = [siteConfig.mainSiteUrl, siteConfig.linkedinUrl].filter(
    (v): v is string => Boolean(v),
  );

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    name: siteConfig.name,
    legalName: siteConfig.name,
    url: getSiteUrl(),
    logo: absoluteUrl(siteConfig.logoIconSrc),
    image: absoluteUrl(siteConfig.logoIconSrc),
    email: siteConfig.contactEmail,
    ...(siteConfig.contactPhone ? { telephone: siteConfig.contactPhone } : {}),
    areaServed: [
      {
        "@type": "Place",
        name: "Grand Strand, SC",
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
      "AI visibility support for service businesses. Free assessment first, then month-to-month GEO (Generative Engine Optimization) guidance.",
    sameAs,
    founder: {
      "@type": "Person",
      name: ABOUT_BLOCK.name,
      jobTitle: ABOUT_BLOCK.role,
      ...(ABOUT_BLOCK.linkedinUrl ? { sameAs: [ABOUT_BLOCK.linkedinUrl] } : {}),
    },
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
    areaServed: ["Grand Strand, SC", "Myrtle Beach, SC"],
    description:
      "Free assessment of how ChatGPT, Google AI Overviews, Perplexity, Microsoft Copilot and Gemini see your business — plus optional month-to-month support.",
    url: absoluteUrl("/audit"),
  };
}

export function planOfferJsonLd() {
  return TIERS.map((tier) => {
    const amount = priceAmount(tier.price);
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${tier.name} GEO plan`,
      description: tier.includes.join(". "),
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: getSiteUrl(),
      },
      areaServed: ["Grand Strand, SC", "Myrtle Beach, SC"],
      url: absoluteUrl(`/audit?tier=${tier.tier}`),
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        ...(amount ? { price: amount } : {}),
        availability: "https://schema.org/InStock",
        url: absoluteUrl(`/audit?tier=${tier.tier}`),
      },
    };
  });
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
  return [
    organizationJsonLd(),
    websiteJsonLd(),
    serviceJsonLd(),
    ...planOfferJsonLd(),
    faqPageJsonLd(),
  ];
}
