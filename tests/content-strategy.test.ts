import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildContentStrategy,
  buildCustomerHeadline,
  inferNiche,
  isMetaHomepageCopy,
  pickPrimaryCta,
} from "../lib/mockup/content-strategy";
import { emptySiteSignals } from "../lib/mockup/generator";
import { mockupRequestSchema } from "../lib/validation/mockup";

describe("content strategy", () => {
  it("detects meta redesign copy", () => {
    assert.equal(isMetaHomepageCopy("A clearer, more modern homepage for Acme"), true);
    assert.equal(isMetaHomepageCopy("Clearer first impression"), true);
    assert.equal(isMetaHomepageCopy("Reliable plumbing when you need it most"), false);
  });

  it("infers niches across business types", () => {
    assert.equal(
      inferNiche(
        mockupRequestSchema.parse({
          website_url: "https://coastalmarinemb.com",
          business_name: "Coastal Marine",
          business_category: "other",
          preferred_style: "clean_modern",
          homepage_goal: "modernize",
        }),
      ),
      "marine",
    );
    assert.equal(
      inferNiche(
        mockupRequestSchema.parse({
          website_url: "https://example.com",
          business_name: "Strand HVAC",
          business_category: "home_services",
          preferred_style: "bold_conversion",
          homepage_goal: "more_quotes",
        }),
      ),
      "hvac",
    );
    assert.equal(
      inferNiche(
        mockupRequestSchema.parse({
          website_url: "https://example.com",
          business_name: "Harbor Law",
          business_category: "legal",
          preferred_style: "premium_professional",
          homepage_goal: "look_credible",
        }),
      ),
      "legal",
    );
  });

  it("picks business-specific CTAs by goal and niche", () => {
    const marine = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
    });
    assert.equal(pickPrimaryCta(marine, emptySiteSignals(), "marine").cta, "Schedule Service");

    const quotes = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Coastal Plumbing",
      business_category: "home_services",
      preferred_style: "simple_trustworthy",
      homepage_goal: "more_quotes",
    });
    assert.equal(pickPrimaryCta(quotes, emptySiteSignals(), "plumbing").cta, "Request a Quote");

    const legal = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Harbor Law",
      business_category: "legal",
      preferred_style: "premium_professional",
      homepage_goal: "look_credible",
    });
    assert.equal(pickPrimaryCta(legal, emptySiteSignals(), "legal").cta, "Book a Consultation");
  });

  it("varies section plans by business type", () => {
    const home = buildContentStrategy(
      mockupRequestSchema.parse({
        website_url: "https://example.com",
        business_name: "Reliable Roofing",
        business_category: "home_services",
        preferred_style: "bold_conversion",
        homepage_goal: "more_quotes",
      }),
      emptySiteSignals(),
    );
    assert.ok(home.sectionPlan.includes("service_area") || home.sectionPlan.includes("process"));

    const legal = buildContentStrategy(
      mockupRequestSchema.parse({
        website_url: "https://example.com",
        business_name: "Harbor Law",
        business_category: "legal",
        preferred_style: "premium_professional",
        homepage_goal: "look_credible",
      }),
      emptySiteSignals(),
    );
    assert.ok(legal.sectionPlan.includes("process"));
    assert.equal(legal.primaryCta, "Book a Consultation");
  });

  it("never returns meta headlines from the rules layer", () => {
    const cases = [
      {
        website_url: "https://example.com",
        business_name: "Grand Strand IT",
        business_category: "b2b" as const,
        preferred_style: "clean_modern" as const,
        homepage_goal: "modernize" as const,
        notes: "Managed IT support",
      },
      {
        website_url: "https://example.com",
        business_name: "Tidewater Med Spa",
        business_category: "healthcare" as const,
        preferred_style: "premium_professional" as const,
        homepage_goal: "look_credible" as const,
      },
      {
        website_url: "https://example.com",
        business_name: "Shoreline Electric",
        business_category: "home_services" as const,
        preferred_style: "simple_trustworthy" as const,
        homepage_goal: "more_calls" as const,
      },
    ];

    for (const raw of cases) {
      const input = mockupRequestSchema.parse(raw);
      const niche = inferNiche(input);
      const headline = buildCustomerHeadline(input, emptySiteSignals(), niche);
      assert.equal(isMetaHomepageCopy(headline), false, headline);
    }
  });
});
