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
import { resetOpenAiClientForTests, setOpenAiFetchForTests } from "@/lib/openai/client";

const originalFetch = globalThis.fetch;
const originalKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
  resetOpenAiClientForTests();
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
      email: "owner@example.com",
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
      email: "owner@example.com",
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
      email: "owner@example.com",
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
      email: "owner@example.com",
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
      email: "owner@example.com",
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

describe("normalize LLM payload", () => {
  it("maps primaryCTA aliases and pads missing improvement notes", async () => {
    const { normalizeLlmPayload } = await import("../lib/mockup/openai-concept");
    const normalized = normalizeLlmPayload({
      headline: "Reliable marine care for Grand Strand boaters",
      subheadline: "Coastal Marine helps boat owners with service and yard support.",
      primaryCTA: "Schedule Service",
      secondaryCTA: "Call Us",
      navItems: ["Services", "About", "Contact"],
      services: [
        { name: "Boat Service", description: "Mechanical and systems work from a local crew." },
        { title: "Yard Support", desc: "Haul-out help when projects need space." },
        { title: "Owner Support", desc: "Clear communication from quote to pickup." },
      ],
      trustLine: "Serving coastal boaters",
      proof_points: ["Local marine expertise", "Haul-out ready"],
    }) as Record<string, unknown>;

    assert.equal(normalized.primaryCta, "Schedule Service");
    assert.equal(normalized.secondaryCta, "Call Us");
    assert.ok(Array.isArray(normalized.improvementNotes));
    assert.ok((normalized.improvementNotes as string[]).length >= 2);
    assert.equal((normalized.services as { title: string }[])[0]?.title, "Boat Service");
  });
});

describe("normalize nested structured payload", () => {
  it("flattens hero + sections into renderable fields", async () => {
    const { parseAndValidateLlmContent } = await import("@/lib/mockup/llm-schema");
    const result = parseAndValidateLlmContent(
      JSON.stringify({
        businessType: "Marine services",
        audienceType: "Boat owners",
        tone: "Practical and trustworthy",
        hero: {
          eyebrow: "Myrtle Beach marine service",
          headline: "Reliable marine care for Grand Strand boaters",
          subheadline: "Coastal Marine helps boat owners with service and yard support.",
          primaryCta: "Schedule Service",
          secondaryCta: "Call Us",
          trustLine: "Serving coastal boaters",
        },
        navItems: ["Services", "About", "Contact"],
        proofPoints: ["Local marine expertise", "Haul-out ready", "Owner communication"],
        sections: [
          {
            type: "services",
            heading: "Marine services",
            items: [
              { title: "Boat Service", desc: "Mechanical and systems work from a local crew." },
              { title: "Yard Support", desc: "Haul-out help when projects need space." },
              { title: "Owner Support", desc: "Clear communication from quote to pickup." },
            ],
          },
          {
            type: "cta",
            heading: "Ready to get your boat back on the water?",
            body: "Tell us what you need and we will outline next steps.",
          },
        ],
        improvementSummary: [
          "Clearer first impression for marine service customers",
          "Stronger call-to-action placement",
          "Services presented in a scannable layout",
        ],
        designDirection: "Clean coastal blues with strong service cards",
      }),
    );
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.match(result.fields.headline, /marine/i);
      assert.equal(result.fields.primaryCta, "Schedule Service");
      assert.equal(result.fields.services.length, 3);
      assert.equal(result.fields.designDirection, "Clean coastal blues with strong service cards");
    }
  });
});

describe("OpenAI env status", () => {
  it("reports missing key clearly", async () => {
    delete process.env.OPENAI_API_KEY;
    const { getOpenAiEnvStatus } = await import("@/lib/openai/client");
    const status = getOpenAiEnvStatus();
    assert.equal(status.configured, false);
    assert.match(status.reason ?? "", /OPENAI_API_KEY/);
  });

  it("strips wrapping quotes from key values", async () => {
    process.env.OPENAI_API_KEY = '"sk-test-key-with-enough-length"';
    const { getOpenAiEnvStatus, getOpenAiApiKey, resetOpenAiClientForTests } = await import(
      "@/lib/openai/client"
    );
    resetOpenAiClientForTests();
    const status = getOpenAiEnvStatus();
    assert.equal(status.configured, true);
    assert.equal(getOpenAiApiKey(), "sk-test-key-with-enough-length");
  });
});

describe("OpenAI API call", () => {
  it("returns validated fields from a successful Chat Completions response", async () => {
    process.env.OPENAI_API_KEY = "test-key-with-enough-length-here";

    const mockFetch = mock.fn(async () =>
      new Response(
        JSON.stringify({
          id: "chatcmpl-test",
          object: "chat.completion",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: JSON.stringify({
                  businessType: "Marine services",
                  audienceType: "Boat owners",
                  tone: "Practical",
                  hero: {
                    eyebrow: "Grand Strand marine care",
                    headline: "Reliable marine care for Grand Strand boaters",
                    subheadline:
                      "Coastal Marine helps boat owners with service, storage, and yard support they can count on.",
                    primaryCta: "Request Service",
                    secondaryCta: "Call Us",
                    trustLine: "Serving coastal boaters · Straightforward next steps",
                  },
                  navItems: ["Services", "About", "Reviews", "Contact"],
                  proofPoints: ["Local marine expertise", "Haul-out ready", "Owner communication"],
                  sections: [
                    {
                      type: "services",
                      heading: "Our services",
                      items: [
                        { title: "Boat Service", desc: "Mechanical and systems work from a local crew." },
                        { title: "Yard Support", desc: "Haul-out and yard help when projects need space." },
                        { title: "Owner Support", desc: "Clear communication from quote to pickup." },
                      ],
                    },
                    {
                      type: "cta",
                      heading: "Ready for service?",
                      body: "Request a slot and we will confirm next steps.",
                    },
                  ],
                  improvementSummary: [
                    "Clearer first impression for marine service customers",
                    "Stronger call-to-action placement",
                    "Services presented in a scannable layout",
                  ],
                  designDirection: "Clean coastal layout with strong CTAs",
                }),
              },
              finish_reason: "stop",
            },
          ],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    ) as unknown as typeof fetch;

    setOpenAiFetchForTests(mockFetch);

    const input = mockupRequestSchema.parse({
      website_url: "https://coastalmarinemb.com",
      business_name: "Coastal Marine",
      business_category: "professional_services",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
      email: "owner@example.com",
    });

    const result = await generateConceptFieldsWithOpenAi(input, emptySiteSignals());
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.match(result.fields.headline, /marine/i);
      assert.equal(result.fields.services.length, 3);
      assert.ok(result.attempts >= 1);
    }
  });

  it("fails gracefully when API key is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    resetOpenAiClientForTests();
    const input = mockupRequestSchema.parse({
      website_url: "https://example.com",
      business_name: "Test",
      business_category: "other",
      preferred_style: "clean_modern",
      homepage_goal: "modernize",
      email: "owner@example.com",
    });
    const result = await generateConceptFieldsWithOpenAi(input, emptySiteSignals());
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.errorCode, "missing_key");
    }
  });
});
