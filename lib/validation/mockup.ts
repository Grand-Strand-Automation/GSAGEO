import { z } from "zod";

/** Legacy style/goal enums still used by rules/OpenAI generator modules. */
export const STYLE_OPTIONS = [
  { value: "clean_modern", label: "Clean and modern" },
  { value: "premium_professional", label: "Premium and professional" },
  { value: "bold_conversion", label: "Bold and conversion-focused" },
  { value: "simple_trustworthy", label: "Simple and trustworthy" },
] as const;

export const GOAL_OPTIONS = [
  { value: "more_calls", label: "Get more calls" },
  { value: "more_quotes", label: "Get more quote requests" },
  { value: "look_credible", label: "Look more credible" },
  { value: "explain_services", label: "Explain services more clearly" },
  { value: "modernize", label: "Modernize the site" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "home_services", label: "Home services" },
  { value: "professional_services", label: "Professional services" },
  { value: "healthcare", label: "Healthcare / wellness" },
  { value: "legal", label: "Legal" },
  { value: "real_estate", label: "Real estate" },
  { value: "automotive", label: "Automotive" },
  { value: "hospitality", label: "Hospitality / tourism" },
  { value: "b2b", label: "B2B services" },
  { value: "other", label: "Other" },
] as const;

const styleValues = STYLE_OPTIONS.map((o) => o.value) as [
  (typeof STYLE_OPTIONS)[number]["value"],
  ...(typeof STYLE_OPTIONS)[number]["value"][],
];
const goalValues = GOAL_OPTIONS.map((o) => o.value) as [
  (typeof GOAL_OPTIONS)[number]["value"],
  ...(typeof GOAL_OPTIONS)[number]["value"][],
];
const categoryValues = CATEGORY_OPTIONS.map((o) => o.value) as [
  (typeof CATEGORY_OPTIONS)[number]["value"],
  ...(typeof CATEGORY_OPTIONS)[number]["value"][],
];

/** Legacy schema for internal generator modules (not the public request form). */
export const mockupRequestSchema = z.object({
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
  business_name: z.string().min(1, "Business name is required").max(120),
  business_category: z.enum(categoryValues),
  preferred_style: z.enum(styleValues),
  homepage_goal: z.enum(goalValues),
  notes: z.string().max(1000).optional().or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(200)
    .transform((v) => v.trim().toLowerCase()),
  website: z.string().optional(),
});

export type MockupRequestInput = z.infer<typeof mockupRequestSchema>;

export function styleLabel(value: string): string {
  return STYLE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function goalLabel(value: string): string {
  return GOAL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function categoryLabel(value: string): string {
  return CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
