import type { StructuredFinding } from "@/lib/audit/report-builder";
import type { FindingFixMapping, InternalFixType } from "./types";

const FINDING_LABEL_MAP: Record<string, InternalFixType[]> = {
  "FAQ content": ["faq_fix"],
  "FAQ schema": ["schema_fix", "faq_fix"],
  "Process / methodology page": ["process_fix"],
  "Case studies / proof content": ["trust_content_fix"],
  "Contact page": ["cta_fix", "page_quick_fix"],
  "About / company page": ["about_copy_fix"],
  "Dedicated service pages": ["service_page_fix"],
  "Conversion / offer page": ["cta_fix", "service_page_fix"],
  "Educational resources": ["educational_content_fix"],
  "Organization / entity schema": ["schema_fix", "about_copy_fix"],
  "Service / offer schema": ["schema_fix", "service_page_fix"],
  "Server-rendered content signals": ["page_quick_fix"],
  robots: ["page_quick_fix"],
  sitemap: ["page_quick_fix"],
};

const CATEGORY_FALLBACK: Record<string, InternalFixType[]> = {
  content: ["page_quick_fix"],
  schema: ["schema_fix"],
  trust: ["trust_content_fix"],
  conversion: ["cta_fix"],
  entity: ["about_copy_fix"],
  services: ["service_page_fix"],
  technical: ["page_quick_fix"],
};

function normalizeLabel(label: string): string {
  if (label.toLowerCase().includes("robots")) return "robots";
  if (label.toLowerCase().includes("sitemap")) return "sitemap";
  return label;
}

export function resolveGenerationMode(
  finding: StructuredFinding,
): "full" | "cautious" | "skip" {
  if (finding.status === "Present") return "skip";
  if (finding.status === "Likely present" && finding.impact === "low") return "skip";

  if (finding.status === "Not confirmed" && finding.confidence === "low") {
    return "cautious";
  }

  if (finding.priority === "nice_to_add" && finding.impact === "low") {
    return "skip";
  }

  if (finding.impact === "high" || finding.priority === "fix_first") {
    return "full";
  }

  if (finding.impact === "medium" || finding.priority === "improve_next") {
    return finding.status === "Not confirmed" ? "cautious" : "full";
  }

  return "cautious";
}

export function mapFindingToFixTypes(finding: StructuredFinding): InternalFixType[] {
  const key = normalizeLabel(finding.label);
  const mapped = FINDING_LABEL_MAP[key] ?? CATEGORY_FALLBACK[finding.category] ?? ["page_quick_fix"];
  return [...new Set(mapped)];
}

export function mapFindingsToFixes(findings: StructuredFinding[]): FindingFixMapping[] {
  const mappings: FindingFixMapping[] = [];
  const seenTypes = new Set<InternalFixType>();

  for (const finding of findings) {
    const mode = resolveGenerationMode(finding);
    if (mode === "skip") continue;

    const fixTypes = mapFindingToFixTypes(finding).filter((type) => {
      if (type === "internal_link_fix") return true;
      if (seenTypes.has(type)) return false;
      seenTypes.add(type);
      return true;
    });

    if (fixTypes.length) {
      mappings.push({ finding, fixTypes, mode });
    }
  }

  const linkingEligible = findings.some(
    (f) =>
      resolveGenerationMode(f) !== "skip" &&
      ["content", "services", "conversion", "entity"].includes(f.category),
  );
  if (linkingEligible && !seenTypes.has("internal_link_fix")) {
    const anchorFinding =
      findings.find((f) => f.label === "Dedicated service pages") ??
      findings.find((f) => resolveGenerationMode(f) !== "skip") ??
      findings[0];
    if (anchorFinding) {
      mappings.push({
        finding: anchorFinding,
        fixTypes: ["internal_link_fix"],
        mode: "full",
      });
    }
  }

  return mappings;
}
