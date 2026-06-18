import { z } from "zod";

export const submissionSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  work_email: z.string().email("Please enter a valid work email"),
  company_name: z.string().min(1, "Company name is required"),
  website_url: z.string().min(4, "Website URL is required"),
  phone: z.string().optional(),
  primary_service: z.string().optional(),
  service_area: z.string().optional(),
  industry: z.string().optional(),
  business_size: z.string().optional(),
  main_goal: z.string().optional(),
  competitors: z.string().optional(),
  cms_platform: z.string().optional(),
  current_challenges: z.union([z.array(z.string()), z.string()]).optional(),
  access_available: z.union([z.array(z.string()), z.string()]).optional(),
  selected_plan: z.string().optional(),
  notes: z.string().optional(),
  /** Honeypot — must be empty */
  website: z.string().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export function normalizeArrayField(
  value: string | string[] | undefined,
): string | null {
  if (!value) return null;
  if (Array.isArray(value)) return value.length ? value.join(", ") : null;
  return value.trim() || null;
}

export function mapSubmissionToRow(input: SubmissionInput) {
  return {
    full_name: input.full_name.trim(),
    work_email: input.work_email.trim().toLowerCase(),
    company_name: input.company_name.trim(),
    website_url: input.website_url.trim(),
    phone: input.phone?.trim() || null,
    primary_service: input.primary_service?.trim() || null,
    service_area: input.service_area?.trim() || null,
    industry: input.industry?.trim() || null,
    business_size: input.business_size || null,
    main_goal: input.main_goal || null,
    competitors: input.competitors?.trim() || null,
    cms_platform: input.cms_platform || null,
    current_challenges: normalizeArrayField(input.current_challenges),
    access_available: normalizeArrayField(input.access_available),
    selected_plan: input.selected_plan?.trim() || null,
    notes: input.notes?.trim() || null,
    status: "submitted" as const,
  };
}
