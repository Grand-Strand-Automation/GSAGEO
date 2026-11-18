/** Shared GEO explainer copy used across home, audit, and sample report. */

export const GEO_DEFINITION =
  "GEO (Generative Engine Optimization) is the work of making your business easy for AI tools like ChatGPT, Google AI Overviews, Perplexity and Microsoft Copilot to understand, trust and recommend.";

export const GEO_EXAMPLE =
  'A customer asks ChatGPT "Who\'s the best commercial HVAC company near Myrtle Beach?" and the AI names three businesses. GEO is about being one of them.';

export const SEO_VS_GEO = [
  {
    label: "SEO",
    title: "Rank in a list of blue links",
    body: "Traditional search shows ten results. The goal is to appear high in that list when someone Googles a service.",
  },
  {
    label: "GEO",
    title: "Be named in the written answer",
    body: "AI tools write a short answer with a few recommendations. The goal is to be one of the businesses they name.",
  },
  {
    label: "Shared foundation",
    title: "A clear, trustworthy website",
    body: "Both need clear services, proof, and structure. GEO finishes differently: citation in the answer, not just a link slot.",
  },
] as const;

export const SIGNAL_GLOSSARY: Array<{
  id: string;
  name: string;
  plain: string;
}> = [
  {
    id: "entity-clarity",
    name: "Entity clarity",
    plain:
      "Can AI tell who you are, what you do, and where you work — without guessing from vague homepage copy?",
  },
  {
    id: "service-pages",
    name: "Service pages",
    plain:
      "Does each service have enough specific content that an AI tool can cite it for a real customer question?",
  },
  {
    id: "structured-data",
    name: "Structured data / schema markup",
    plain:
      "Machine-readable facts (like LocalBusiness or Service schema) that spell out your name, hours, area, and offers so tools don't have to scrape plain text.",
  },
  {
    id: "trust-proof",
    name: "Trust & proof",
    plain:
      "Reviews, credentials, project examples, and other evidence AI can use to decide you're worth recommending.",
  },
  {
    id: "local-signals",
    name: "Local signals",
    plain:
      "Consistent name, address, and phone across your site and listings so local answers don't conflict.",
  },
  {
    id: "ai-mentions",
    name: "AI mentions",
    plain:
      "How often AI tools actually name your business when people ask relevant questions in your market.",
  },
  {
    id: "bing-places",
    name: "Bing Places",
    plain:
      "Your business listing in Microsoft's local directory. Copilot and ChatGPT search lean on Bing data, so outdated Bing details can keep you out of AI answers even when Google looks fine.",
  },
];

/** Weighted score explanation for the sample report (weights sum to 100). */
export const SCORE_WEIGHTS = [
  { id: "ai-mentions", label: "AI mentions", weight: 25 },
  { id: "service-pages", label: "Service pages", weight: 20 },
  { id: "structured-data", label: "Structured data", weight: 15 },
  { id: "entity-clarity", label: "Entity clarity", weight: 15 },
  { id: "trust-proof", label: "Trust & proof", weight: 15 },
  { id: "local-signals", label: "Local signals", weight: 10 },
] as const;
