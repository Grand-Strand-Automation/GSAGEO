import { z } from "zod";

const WEBSITE_URL_REQUIRED = "Website URL is required";
const WEBSITE_URL_INVALID =
  "Enter a valid company website, such as https://example.com.";

function hasWhitespace(value: string): boolean {
  return /\s/.test(value);
}

function isIpAddress(hostname: string): boolean {
  const normalized = hostname.replace(/^\[|\]$/g, "");
  return isIpv4Address(normalized) || normalized.includes(":");
}

function isIpv4Address(hostname: string): boolean {
  const parts = hostname.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const value = Number(part);
    return value >= 0 && value <= 255 && String(value) === part;
  });
}

function isPrivateIpv4Address(hostname: string): boolean {
  if (!isIpv4Address(hostname)) return false;
  const [a = 0, b = 0] = hostname.split(".").map(Number);
  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 0
  );
}

function isPublicHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  if (!normalized || normalized === "localhost" || normalized.endsWith(".local")) {
    return false;
  }
  if (isPrivateIpv4Address(normalized)) {
    return false;
  }
  if (isIpAddress(normalized)) {
    return isIpv4Address(normalized);
  }

  const labels = normalized.split(".");
  if (labels.length < 2) return false;
  return labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
}

export function normalizeWebsiteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || hasWhitespace(trimmed)) {
    throw new Error(WEBSITE_URL_INVALID);
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProtocol);

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(WEBSITE_URL_INVALID);
  }
  if (parsed.username || parsed.password || !isPublicHostname(parsed.hostname)) {
    throw new Error(WEBSITE_URL_INVALID);
  }

  parsed.hash = "";
  parsed.protocol = parsed.protocol.toLowerCase();
  parsed.hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");

  return parsed.href.replace(/\/+$/, "");
}

function isValidWebsiteUrl(value: string): boolean {
  try {
    normalizeWebsiteUrl(value);
    return true;
  } catch {
    return false;
  }
}

export const submissionSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  work_email: z.string().email("Please enter a valid work email"),
  company_name: z.string().min(1, "Company name is required"),
  website_url: z
    .string()
    .min(1, WEBSITE_URL_REQUIRED)
    .refine(isValidWebsiteUrl, WEBSITE_URL_INVALID)
    .transform(normalizeWebsiteUrl),
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
    website_url: normalizeWebsiteUrl(input.website_url),
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
