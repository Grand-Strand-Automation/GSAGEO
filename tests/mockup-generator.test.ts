import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildMockupConcept, type SiteSignals } from "../lib/mockup/generator";
import { mockupRequestSchema } from "../lib/validation/mockup";

const emptySignals: SiteSignals = {
  fetched: false,
  title: "",
  h1: "",
  metaDesc: "",
  ogTitle: "",
  phone: null,
  serviceHints: [],
  ctaHints: [],
};

describe("mockup request validation", () => {
  it("normalizes bare domains to https URLs", () => {
    const parsed = mockupRequestSchema.parse({
      website_url: "example.com",
      business_name: "Example Co",
      business_category: "home_services",
      preferred_style: "clean_modern",
      homepage_goal: "more_calls",
      notes: "",
      email: "",
    });
    assert.equal(parsed.website_url, "https://example.com");
  });
});

describe("mockup concept generator", () => {
  it("builds a labeled sample concept from preferences when site fetch fails", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Coastal Plumbing",
      business_category: "home_services",
      preferred_style: "simple_trustworthy",
      homepage_goal: "more_calls",
      notes: "Show emergency service",
    });

    const concept = buildMockupConcept(input, emptySignals);
    assert.equal(concept.label, "Sample homepage concept");
    assert.match(concept.headline, /Coastal Plumbing/i);
    assert.equal(concept.styleLabel, "Simple and trustworthy");
    assert.equal(concept.theme.key, "simple_trustworthy");
    assert.ok(concept.services.length >= 3);
    assert.ok(concept.improvementNotes.length >= 3);
    assert.match(concept.disclaimer, /Preview only/i);
    assert.equal(concept.sourceSignals.usedLiveSite, false);
  });

  it("uses live headline and CTA hints when available", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Harbor Law",
      business_category: "legal",
      preferred_style: "premium_professional",
      homepage_goal: "modernize",
    });

    const concept = buildMockupConcept(input, {
      ...emptySignals,
      fetched: true,
      h1: "Trusted legal counsel for families",
      title: "Harbor Law",
      metaDesc: "Practical legal guidance for local families and small businesses.",
      ctaHints: ["Book a Consultation"],
      serviceHints: ["Family Law", "Estate Planning", "Business Counsel"],
    });

    assert.match(concept.headline, /Trusted legal counsel/i);
    assert.equal(concept.primaryCta, "Book a Consultation");
    assert.equal(concept.services[0]?.title, "Family Law");
    assert.equal(concept.sourceSignals.usedLiveSite, true);
  });
});
