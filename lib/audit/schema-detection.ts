import type { AssetFinding } from "./types";

export function extractJsonLdBlocks(html: string): unknown[] {
  const blocks: unknown[] = [];
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = match[1]?.trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      /* ignore malformed JSON-LD */
    }
  }
  return blocks;
}

function collectTypes(node: unknown, types: Set<string>): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectTypes(n, types));
    return;
  }
  const obj = node as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") types.add(t);
  if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
  if (obj["@graph"]) collectTypes(obj["@graph"], types);
  for (const value of Object.values(obj)) {
    if (value && typeof value === "object") collectTypes(value, types);
  }
}

export function detectSchemaTypes(html: string): string[] {
  const types = new Set<string>();
  for (const block of extractJsonLdBlocks(html)) {
    collectTypes(block, types);
  }
  return [...types];
}

const ORG_TYPES = new Set([
  "Organization",
  "LocalBusiness",
  "ProfessionalService",
  "Corporation",
  "WebSite",
]);

const SERVICE_TYPES = new Set(["Service", "OfferCatalog", "Offer", "Product"]);
const FAQ_TYPES = new Set(["FAQPage", "Question"]);
const ARTICLE_TYPES = new Set(["Article", "BlogPosting", "NewsArticle", "TechArticle"]);

function finding(
  status: AssetFinding["status"],
  confidence: AssetFinding["confidence"],
  reason: string,
  evidence_urls: string[],
  depth?: AssetFinding["depth"],
): AssetFinding {
  return { status, confidence, reason, evidence_urls, depth };
}

export function detectSchemaFindings(html: string, baseUrl: string): {
  detected_types: string[];
  organization_schema: AssetFinding;
  service_schema: AssetFinding;
  faq_schema: AssetFinding;
  article_schema: AssetFinding;
} {
  const detected_types = detectSchemaTypes(html);
  const evidence = [baseUrl];

  const hasOrg = detected_types.some((t) => ORG_TYPES.has(t));
  const hasService = detected_types.some((t) => SERVICE_TYPES.has(t));
  const hasFaq = detected_types.some((t) => FAQ_TYPES.has(t));
  const hasArticle = detected_types.some((t) => ARTICLE_TYPES.has(t));

  return {
    detected_types,
    organization_schema: hasOrg
      ? finding(
          "present",
          "high",
          `JSON-LD entity schema detected (${detected_types.filter((t) => ORG_TYPES.has(t)).join(", ") || "Organization"})`,
          evidence,
          "schema_backed",
        )
      : finding("not_confirmed", "low", "No organization or local business JSON-LD detected in fetched HTML", evidence, "not_schema_backed"),
    service_schema: hasService
      ? finding(
          "present",
          "high",
          `Service or offer schema detected (${detected_types.filter((t) => SERVICE_TYPES.has(t)).join(", ")})`,
          evidence,
          "schema_backed",
        )
      : finding("not_confirmed", "low", "No dedicated service or offer catalog schema detected in fetched HTML", evidence, "not_schema_backed"),
    faq_schema: hasFaq
      ? finding("present", "high", "FAQPage or Question schema detected in fetched HTML", evidence, "schema_backed")
      : finding("not_confirmed", "low", "FAQPage schema not detected in fetched HTML (content may still exist)", evidence, "not_schema_backed"),
    article_schema: hasArticle
      ? finding("present", "high", "Article or blog schema detected", evidence, "schema_backed")
      : finding("not_confirmed", "low", "Article/blog schema not detected in fetched HTML", evidence, "not_schema_backed"),
  };
}
