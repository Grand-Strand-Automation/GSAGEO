import { z } from "zod";

export const REQUEST_STYLE_OPTIONS = [
  { value: "clean_modern", label: "Clean and modern" },
  { value: "premium_professional", label: "Premium and professional" },
  { value: "bold_conversion", label: "Bold and conversion-focused" },
  { value: "simple_trustworthy", label: "Simple and trustworthy" },
] as const;

export const INTEREST_OPTIONS = [
  { value: "homepage_refresh", label: "$99 homepage refresh" },
  { value: "full_redesign", label: "Full website redesign" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

export const IMPROVE_OPTIONS = [
  { value: "clearer_messaging", label: "Clearer messaging / first impression" },
  { value: "stronger_ctas", label: "Stronger calls to action" },
  { value: "modern_look", label: "More modern look and layout" },
  { value: "full_overhaul", label: "Broader site overhaul" },
  { value: "not_sure", label: "Not sure — need guidance" },
] as const;

export const REQUEST_CATEGORY_OPTIONS = [
  { value: "home_services", label: "Home services" },
  { value: "professional_services", label: "Professional services" },
  { value: "healthcare", label: "Healthcare / wellness" },
  { value: "legal", label: "Legal" },
  { value: "real_estate", label: "Real estate" },
  { value: "retail", label: "Retail / e-commerce" },
  { value: "hospitality", label: "Hospitality / tourism" },
  { value: "b2b", label: "B2B / technology" },
  { value: "nonprofit", label: "Nonprofit / education" },
  { value: "other", label: "Other" },
] as const;

const styleValues = REQUEST_STYLE_OPTIONS.map((o) => o.value) as [
  (typeof REQUEST_STYLE_OPTIONS)[number]["value"],
  ...(typeof REQUEST_STYLE_OPTIONS)[number]["value"][],
];
const interestValues = INTEREST_OPTIONS.map((o) => o.value) as [
  (typeof INTEREST_OPTIONS)[number]["value"],
  ...(typeof INTEREST_OPTIONS)[number]["value"][],
];
const improveValues = IMPROVE_OPTIONS.map((o) => o.value) as [
  (typeof IMPROVE_OPTIONS)[number]["value"],
  ...(typeof IMPROVE_OPTIONS)[number]["value"][],
];
const categoryValues = REQUEST_CATEGORY_OPTIONS.map((o) => o.value) as [
  (typeof REQUEST_CATEGORY_OPTIONS)[number]["value"],
  ...(typeof REQUEST_CATEGORY_OPTIONS)[number]["value"][],
];

/** Public mockup request form — stores a lead for manual follow-up (no live AI). */
export const mockupLeadRequestSchema = z.object({
  website_url: z
    .string()
    .min(1, "Website URL is required")
    .transform((v) => {
      const trimmed = v.trim();
      if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
      return trimmed;
    })
    .refine((v) => {
      try {
        const u = new URL(v);
        return Boolean(u.hostname.includes("."));
      } catch {
        return false;
      }
    }, "Enter a valid website URL"),
  business_name: z.string().min(1, "Company name is required").max(120),
  business_category: z.enum(categoryValues),
  improve_goal: z.enum(improveValues),
  preferred_style: z.union([z.enum(styleValues), z.literal("")]).optional(),
  interest: z.enum(interestValues),
  notes: z.string().max(1000).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(200)
    .transform((v) => v.trim().toLowerCase()),
  website: z.string().optional(),
});

export type MockupLeadRequestInput = z.infer<typeof mockupLeadRequestSchema>;

export function interestLabel(value: string): string {
  return INTEREST_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function improveLabel(value: string): string {
  return IMPROVE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function requestCategoryLabel(value: string): string {
  return REQUEST_CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function requestStyleLabel(value: string): string {
  return REQUEST_STYLE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
