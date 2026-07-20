import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import {
  buildOpenAiBrief,
  inferBusinessHints,
  mergeLlmFieldsIntoConcept,
  generateConceptFieldsWithOpenAi,
} from "../lib/mockup/openai-concept";
import {
  buildMockupConcept,
  emptySiteSignals,
  isChallengePage,
  parseHomepageHtml,
} from "../lib/mockup/generator";
import { mockupRequestSchema } from "../lib/validation/mockup";

const originalFetch = globalThis.fetch;
const originalKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
});

describe("challenge page detection", () => {
  it("detects Cloudflare security verification HTML", () => {
    const html = `
      <html><body>
        <h1>www.coastalmarinemb.com</h1>
        <p>Performing security verification</p>
        <p>This website uses a security service to protect against malicious bots.</p>
      </body></html>
    `;
    assert.equal(isChallengePage(html), true);
    const signals = parseHomepageHtml(html, "https://coastalmarinemb.com");
    assert.equal(signals.fetched, false);
    assert.ok(signals.blockedReason);
  });
});

describe("OpenAI brief builder", () => {
  it("includes blocked status and business details when scrape failed", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
      notes: "Boat service and marina",
    });
    const signals = {
      ...emptySiteSignals(),
      blockedReason: "Site blocked automated access (security / bot protection).",
    };
    const brief = buildOpenAiBrief(input, signals);
    assert.match(brief, /Coastal Marine/);
    assert.match(brief, /BLOCKED/i);
    assert.match(brief, /Boat service/);
    assert.match(brief, /marine|marina|Myrtle/i);
    assert.match(brief, /Modernize/i);
  });

  it("infers marine + Myrtle Beach hints from coastalmarinemb.com", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
    });
    const hints = inferBusinessHints(input).join(" ");
    assert.match(hints, /marine|marina|boat/i);
    assert.match(hints, /Myrtle|Grand Strand/i);
  });

  it("includes extracted services when available", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Harbor Law",
      business_category: "legal",
      preferred_style: "premium_professional",
      homepage_goal: "more_calls",
    });
    const signals = {
      ...emptySiteSignals(),
      fetched: true,
      fetchQuality: "strong" as const,
      h1: "Trusted counsel",
      services: [{ title: "Family Law", desc: "Custody and divorce support." }],
      serviceHints: ["Family Law"],
    };
    const brief = buildOpenAiBrief(input, signals);
    assert.match(brief, /Family Law/);
    assert.match(brief, /Trusted counsel/);
  });
});

describe("merge LLM fields", () => {
  it("overlays OpenAI copy onto the base concept", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
    });
    const base = buildMockupConcept(input, emptySiteSignals());
    const merged = mergeLlmFieldsIntoConcept(
      base,
      {
        headline: "Marine service you can trust on the Grand Strand",
        subheadline:
          "From haul-outs to routine care, Coastal Marine keeps boats ready for the water.",
        primaryCta: "Schedule Service",
        secondaryCta: "View Services",
        navItems: ["Services", "About", "Gallery", "Contact"],
        services: [
          { title: "Haul-Out & Yard", desc: "Safe haul-outs and yard space when you need work done." },
          { title: "Mechanical Service", desc: "Engine and systems care from a local marine team." },
          { title: "Seasonal Storage", desc: "Protected storage options between seasons." },
        ],
        trustLine: "Coastal Marine · Myrtle Beach area · Call for availability",
        proofPoints: ["Local marine expertise", "Haul-out ready", "Owner communication"],
        improvementNotes: [
          "Stronger homepage headline for marina and boat service",
          "Clearer primary CTA above the fold",
          "Services organized so visitors can scan quickly",
        ],
      },
      { usedOpenAi: true },
    );

    assert.match(merged.headline, /Marine service/i);
    assert.equal(merged.primaryCta, "Schedule Service");
    assert.equal(merged.services[0]?.title, "Haul-Out & Yard");
    assert.equal(merged.sourceSignals.generatedBy, "openai");
    assert.doesNotMatch(merged.headline, /mockup|redesign|concept/i);
    assert.ok(merged.proofPoints.every((p) => !/clearer first|stronger call/i.test(p)));
  });

  it("rejects meta proofPoints from the LLM and keeps trust chips", () => {
    const input = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
    });
    const base = buildMockupConcept(input, emptySiteSignals());
    const merged = mergeLlmFieldsIntoConcept(
      base,
      {
        headline: "Marine service you can trust on the Grand Strand",
        subheadline: "From haul-outs to routine care, Coastal Marine keeps boats ready.",
        primaryCta: "Schedule Service",
        secondaryCta: "View Services",
        navItems: ["Services", "About", "Contact"],
        services: [
          { title: "Haul-Out", desc: "Safe haul-outs when you need yard work done." },
          { title: "Mechanical", desc: "Engine and systems care from a local team." },
          { title: "Storage", desc: "Protected storage between seasons." },
        ],
        trustLine: "Myrtle Beach area marine service",
        proofPoints: ["Clearer first impression", "Stronger call to action", "Easier service layout"],
        improvementNotes: [
          "Customer-facing headline for marine service",
          "Stronger CTA above the fold",
          "Cleaner service layout",
        ],
      },
      { usedOpenAi: true },
    );
    assert.ok(merged.proofPoints.every((p) => !/clearer first|stronger call|easier service/i.test(p)));
    assert.ok(merged.proofPoints.length >= 2);
  });
});

describe("OpenAI API call", () => {
  it("returns validated fields from a successful Chat Completions response", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    globalThis.fetch = mock.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  headline: "Reliable marine care for Grand Strand boaters",
                  subheadline:
                    "Coastal Marine helps boat owners with service, storage, and yard support they can count on.",
                  primaryCta: "Request Service",
                  secondaryCta: "Call Us",
                  navItems: ["Services", "About", "Reviews", "Contact"],
                  services: [
                    { title: "Boat Service", desc: "Mechanical and systems work from a local crew." },
                    { title: "Yard Support", desc: "Haul-out and yard help when projects need space." },
                    { title: "Owner Support", desc: "Clear communication from quote to pickup." },
                  ],
                  trustLine: "Serving coastal boaters · Straightforward next steps",
                  proofPoints: ["Clearer headline", "Stronger CTA", "Easier services"],
                  improvementNotes: [
                    "Clearer first impression for marine service customers",
                    "Stronger call-to-action placement",
                    "Services presented in a scannable layout",
                  ],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    ) as unknown as typeof fetch;

    const input = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
    });

    const result = await generateConceptFieldsWithOpenAi(input, emptySiteSignals());
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.match(result.fields.headline, /marine/i);
      assert.equal(result.fields.services.length, 3);
    }
  });

  it("fails gracefully when API key is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    const input = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Test",
      business_category: "other",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
    });
    const result = await generateConceptFieldsWithOpenAi(input, emptySiteSignals());
    assert.equal(result.ok, false);
  });
});
