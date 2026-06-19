export const AUDIT_VERSION = "2.0";

export type EvidenceStatus = "present" | "likely_present" | "not_confirmed" | "absent";
export type ConfidenceLevel = "high" | "medium" | "low";
export type AssetDepth = "strong" | "weak" | "schema_backed" | "not_schema_backed" | "limited";

export type RouteBucket =
  | "faq"
  | "process"
  | "case_studies"
  | "contact"
  | "about"
  | "service_page"
  | "conversion_page"
  | "educational_resource"
  | "legal"
  | "homepage"
  | "other";

export type AssetFinding = {
  status: EvidenceStatus;
  confidence: ConfidenceLevel;
  reason: string;
  evidence_urls: string[];
  depth?: AssetDepth;
  count?: number;
};

export type ClassifiedUrl = {
  url: string;
  path: string;
  bucket: RouteBucket;
  source: "sitemap" | "homepage_link" | "robots" | "manual";
  title?: string;
};

export type SchemaFindings = {
  organization_schema: AssetFinding;
  service_schema: AssetFinding;
  faq_schema: AssetFinding;
  article_schema: AssetFinding;
  detected_types: string[];
};

export type TechnicalFindings = {
  robots_txt: AssetFinding;
  sitemap_xml: AssetFinding;
  sitemap_url_count: number;
  canonical: AssetFinding;
  js_shell_detected: boolean;
};

export type ContentAssetFindings = {
  faq_content_presence: AssetFinding;
  process_page: AssetFinding;
  case_studies: AssetFinding;
  contact_page: AssetFinding;
  about_page: AssetFinding;
  service_pages: AssetFinding;
  conversion_page: AssetFinding;
  educational_content: AssetFinding;
};

export type DiscoveryResult = {
  baseUrl: string;
  auditedAt: string;
  auditVersion: string;
  httpStatus: number;
  discoveryComplete: boolean;
  sitemapUrls: string[];
  classifiedUrls: ClassifiedUrl[];
  homepageHtml: string;
  homepageIsJsShell: boolean;
  technical: TechnicalFindings;
  schema: SchemaFindings;
  assets: ContentAssetFindings;
  htmlMeta: {
    title: string;
    metaDesc: string;
    canonical: string;
    h1: string;
    ogTitle: string;
  };
  entityInfo: {
    businessNameInHtml: boolean;
    phoneCount: number;
    emailCount: number;
    hasAddress: boolean;
    hasContactInfo: boolean;
  };
};
