import type { StructuredFinding } from "@/lib/audit/report-builder";

export const INTERNAL_FIX_TYPES = [
  "faq_fix",
  "service_page_fix",
  "cta_fix",
  "internal_link_fix",
  "schema_fix",
  "trust_content_fix",
  "process_fix",
  "educational_content_fix",
  "about_copy_fix",
  "page_quick_fix",
] as const;

export type InternalFixType = (typeof INTERNAL_FIX_TYPES)[number];

export const INTERNAL_FIX_STATUSES = [
  "generated",
  "needs_review",
  "approved_internal",
  "edited_internal",
  "hidden",
  "rejected",
  "archived",
] as const;

export type InternalFixStatus = (typeof INTERNAL_FIX_STATUSES)[number];

export type InternalFixGeneratedContent = {
  sections?: Array<{ heading: string; body: string }>;
  faqs?: Array<{ question: string; answer: string; placement?: string }>;
  links?: Array<{
    source: string;
    target: string;
    anchor: string;
    rationale: string;
    priority: "high" | "medium" | "low";
  }>;
  schemaBlocks?: Array<{ schemaType: string; json: Record<string, unknown>; placement: string }>;
  ctaVariants?: Array<{ label: string; copy: string; placement?: string }>;
  pageChanges?: Array<{ page: string; change: string; example?: string }>;
  topics?: Array<{ title: string; angle: string; addresses: string }>;
  caution?: string;
};

export type InternalFixDraft = {
  type: InternalFixType;
  related_finding_label: string;
  related_finding_category: string;
  title: string;
  issue_summary: string;
  why_it_matters: string;
  affected_urls: string[];
  generated_content: InternalFixGeneratedContent;
  generated_html: string | null;
  generated_json: Record<string, unknown> | null;
  implementation_notes: string;
  implementation_effort: "light" | "medium" | "larger";
  priority: "fix_first" | "improve_next" | "nice_to_add";
  confidence: "high" | "medium" | "low";
  status: InternalFixStatus;
};

export type InternalFixContext = {
  companyName: string;
  websiteUrl: string;
  primaryService: string | null;
  serviceArea: string | null;
  sitemapUrls: string[];
};

export type FindingFixMapping = {
  finding: StructuredFinding;
  fixTypes: InternalFixType[];
  mode: "full" | "cautious" | "skip";
};
