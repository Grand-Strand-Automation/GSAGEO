import { createHash, randomBytes } from "node:crypto";

export function generateResultsToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashResultsToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getResultsTokenExpiry(): Date | null {
  const days = Number(process.env.RESULTS_TOKEN_EXPIRY_DAYS ?? "90");
  if (!days || days <= 0) return null;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function isAuditReviewRequired(): boolean {
  return process.env.AUDIT_REVIEW_REQUIRED === "true";
}

export function isAuditAutoPublish(): boolean {
  if (process.env.AUDIT_AUTO_PUBLISH === "false") return false;
  return !isAuditReviewRequired();
}
