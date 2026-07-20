import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMockupConcept,
  emptySiteSignals,
  parseHomepageHtml,
  type SiteSignals,
} from "../lib/mockup/generator";
import { mockupRequestSchema } from "../lib/validation/mockup";

const emptySignals: SiteSignals = emptySiteSignals();

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

describe("mockup site extraction", () => {
  it("extracts headline, services, CTAs, and phone from HTML", () => {
    const html = `
      <html><head>
        <title>Coastal Plumbing | Myrtle Beach</title>
        <meta name="description" content="Trusted plumbing for Myrtle Beach homes and businesses." />
        <meta property="og:image" content="https://example.com/logo.png" />
        <meta name="theme-color" content="#0e2f54" />
      </head><body>
        <nav><a href="/">Home</a><a href="/services">Services</a><a href="/about">About</a><a href="/contact">Contact</a></nav>
        <h1>Reliable plumbing when you need it most</h1>
        <p>We help homeowners across the Grand Strand with repairs, installs, and emergency service.</p>
        <a href="/contact">Request a Free Quote</a>
        <h2>Emergency Repairs</h2>
        <p>Fast response for burst pipes, leaks, and urgent plumbing issues.</p>
        <h2>Water Heaters</h2>
        <p>Install and service tank and tankless water heaters.</p>
        <h2>Drain Cleaning</h2>
        <p>Clear stubborn clogs and keep your drains flowing.</p>
        <p>Call 843-555-0199 today.</p>
      </body></html>
    `;

    const signals = parseHomepageHtml(html, "https://example.com");
    assert.equal(signals.fetched, true);
    assert.equal(signals.fetchQuality, "strong");
    assert.match(signals.h1, /Reliable plumbing/i);
    assert.match(signals.heroParagraph, /Grand Strand/i);
    assert.ok(signals.services.length >= 3);
    assert.equal(signals.services[0]?.title, "Emergency Repairs");
    assert.match(signals.services[0]?.desc ?? "", /burst pipes/i);
    assert.equal(signals.ctaHints[0], "Request a Free Quote");
    assert.ok(signals.phone?.includes("843"));
    assert.equal(signals.logoUrl, "https://example.com/logo.png");
    assert.equal(signals.themeColor, "#0e2f54");
    assert.ok(signals.navItems.includes("Services"));
  });
});

describe("mockup concept generator", () => {
  it("builds customer-facing homepage copy — not redesign commentary", () => {
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
    assert.match(concept.headline, /Coastal Plumbing|plumbing/i);
    assert.doesNotMatch(concept.headline, /clearer|fresher|modern homepage|redesign|mockup/i);
    assert.doesNotMatch(concept.subheadline, /fresher homepage direction|clearer first impression/i);
    assert.match(concept.primaryCta, /Call/i);
    assert.equal(concept.styleLabel, "Simple and trustworthy");
    assert.equal(concept.theme.key, "simple_trustworthy");
    assert.ok(concept.services.length >= 3);
    assert.ok(concept.improvementNotes.length >= 3);
    assert.ok(concept.heroEyebrow);
    assert.ok(concept.sectionPlan.includes("hero"));
    assert.ok(concept.proofPoints.every((p) => !/clearer first|stronger call|easier-to-scan/i.test(p)));
    assert.match(concept.disclaimer, /Preview only/i);
    assert.equal(concept.sourceSignals.usedLiveSite, false);
    assert.equal(concept.sourceSignals.usedRealServices, false);
    assert.ok(concept.currentSnapshot);
    assert.ok(concept.personalizationLine);
  });

  it("uses marine-specific copy and CTA when niche is inferred from the name", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
      notes: "Boat service and marina",
    });
    const concept = buildMockupConcept(input, emptySignals);
    assert.equal(concept.sourceSignals.niche, "marine");
    assert.match(concept.headline, /marine|boat/i);
    assert.doesNotMatch(concept.headline, /clearer, more modern homepage/i);
    assert.match(concept.primaryCta, /Schedule Service|Request a Quote|Call/i);
    assert.ok(concept.services.some((s) => /haul|mechanical|storage|marine/i.test(s.title)));
    assert.ok(concept.sectionPlan.includes("process"));
  });

  it("prefers real site headline, CTA, and service copy over canned fallbacks", () => {
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
      fetchQuality: "strong",
      h1: "Trusted legal counsel for families",
      title: "Harbor Law",
      metaDesc: "Practical legal guidance for local families and small businesses.",
      heroParagraph: "Practical legal guidance for local families and small businesses.",
      ctaHints: ["Book a Consultation"],
      services: [
        { title: "Family Law", desc: "Support through divorce, custody, and family matters." },
        { title: "Estate Planning", desc: "Wills, trusts, and plans that protect your family." },
        { title: "Business Counsel", desc: "Clear advice for local business owners." },
      ],
      serviceHints: ["Family Law", "Estate Planning", "Business Counsel"],
      navItems: ["Practice Areas", "About", "Results", "Contact"],
      phone: "843-555-0100",
    });

    assert.match(concept.headline, /Trusted legal counsel/i);
    assert.equal(concept.primaryCta, "Book a Consultation");
    assert.equal(concept.services[0]?.title, "Family Law");
    assert.match(concept.services[0]?.desc ?? "", /custody/i);
    assert.equal(concept.sourceSignals.usedLiveSite, true);
    assert.equal(concept.sourceSignals.usedRealServices, true);
    assert.equal(concept.sourceSignals.usedRealCta, true);
    assert.deepEqual(concept.navItems.slice(0, 4), [
      "Practice Areas",
      "About",
      "Results",
      "Contact",
    ]);
    assert.match(concept.trustLine, /843-555-0100/);
    assert.match(concept.improvementNotes.join(" "), /services|CTA|headline|Customer-facing/i);
  });

  it("attaches screenshot url into currentSnapshot when provided", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Test Co",
      business_category: "other",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
    });
    const concept = buildMockupConcept(input, emptySignals, {
      screenshotUrl: "https://cdn.example.com/shot.png",
    });
    assert.equal(concept.currentSnapshot.screenshotUrl, "https://cdn.example.com/shot.png");
    assert.equal(concept.currentSnapshot.screenshotStatus, "ready");
  });
});
