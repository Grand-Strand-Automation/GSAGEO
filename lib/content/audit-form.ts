/** Shared option lists for the /audit multi-step form. Values map 1:1 to API payload keys. */

export const GOAL_OPTIONS = [
  { value: "more-qualified-leads", label: "More qualified inbound leads" },
  { value: "ai-search-visibility", label: "Stronger visibility in AI search" },
  { value: "service-page-performance", label: "Better service-page performance" },
  { value: "local-visibility", label: "More local visibility" },
  { value: "technical-cleanup", label: "Technical cleanup and structure" },
  { value: "monthly-optimization", label: "Ongoing monthly optimization" },
] as const;

export const CHALLENGE_OPTIONS = [
  { value: "weak-rankings", label: "Weak rankings in traditional search" },
  { value: "poor-content", label: "Poor or thin content structure" },
  { value: "limited-service-pages", label: "Limited or underdeveloped service pages" },
  { value: "no-internal-linking", label: "No clear internal linking structure" },
  { value: "weak-local", label: "Weak local or geographic visibility" },
  { value: "no-analytics", label: "No analytics or reporting in place" },
  { value: "not-sure", label: "Not sure where the gaps are" },
] as const;

export const ACCESS_OPTIONS = [
  { value: "no-access", label: "No access to analytics yet" },
  { value: "search-console", label: "Google Search Console" },
  { value: "analytics", label: "Google Analytics" },
  { value: "cms-access", label: "CMS / website backend" },
  { value: "bing-webmaster", label: "Bing Webmaster Tools" },
] as const;

export const BUSINESS_SIZE_OPTIONS = [
  { value: "1-5", label: "1–5" },
  { value: "6-20", label: "6–20" },
  { value: "21-50", label: "21–50" },
  { value: "51-200", label: "51–200" },
  { value: "200+", label: "200+" },
] as const;

export const CMS_OPTIONS = [
  { value: "wordpress", label: "WordPress" },
  { value: "webflow", label: "Webflow" },
  { value: "shopify", label: "Shopify" },
  { value: "squarespace", label: "Squarespace" },
  { value: "wix", label: "Wix" },
  { value: "custom-react", label: "Custom / React" },
  { value: "other", label: "Other" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const SCAN_CHECKLIST = [
  "Reading your site structure",
  "Identifying your business & services",
  "Checking trust & proof signals",
  "Looking for structured data",
  "Asking AI tools about you",
] as const;

export const STEP_LABELS = [
  "Your site",
  "Business",
  "Goals",
  "Finish",
] as const;

export const AUDIT_STORAGE_KEY = "gsa-audit-draft-v2";

/**
 * Public booking URL for the audit results CTA.
 * Empty by default — button is hidden until NEXT_PUBLIC_REVIEW_BOOKING_URL is set.
 * (Unlike thank-you flow, no mailto fallback here per redesign spec.)
 */
export const BOOKING_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_REVIEW_BOOKING_URL?.trim()) ||
  "";

export const PLAN_CHIP_LABELS: Record<string, string> = {
  monitor: "Monitor",
  growth: "Growth",
  managed: "Managed",
  custom: "Custom",
};
