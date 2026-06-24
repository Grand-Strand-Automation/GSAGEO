import { createAdminClient } from "@/lib/supabase/admin";
import type { GeoInternalFix } from "@/lib/types/database";
import type { InternalFixGeneratedContent } from "./types";

const INTERNAL_TO_PREVIEW_TYPE: Record<string, string> = {
  faq_fix: "faq",
  service_page_fix: "service_page",
  cta_fix: "cta",
  internal_link_fix: "internal_linking",
  schema_fix: "schema",
  trust_content_fix: "trust",
  process_fix: "messaging",
  educational_content_fix: "messaging",
  about_copy_fix: "messaging",
  page_quick_fix: "messaging",
};

function contentToAfterText(content: InternalFixGeneratedContent): string {
  const parts: string[] = [];

  if (content.faqs?.length) {
    parts.push(
      content.faqs.map((f, i) => `${i + 1}. ${f.question}\n${f.answer}`).join("\n\n"),
    );
  }

  if (content.sections?.length) {
    parts.push(
      content.sections.map((s) => `${s.heading}\n${s.body}`).join("\n\n"),
    );
  }

  if (content.links?.length) {
    parts.push(
      content.links
        .map((l) => `• ${l.source} → ${l.target} (“${l.anchor}”) — ${l.rationale}`)
        .join("\n"),
    );
  }

  if (content.ctaVariants?.length) {
    parts.push(
      content.ctaVariants.map((v) => `${v.label}: ${v.copy}`).join("\n\n"),
    );
  }

  if (content.pageChanges?.length) {
    parts.push(
      content.pageChanges.map((p) => `${p.page}: ${p.change}${p.example ? `\nExample: ${p.example}` : ""}`).join("\n\n"),
    );
  }

  if (content.topics?.length) {
    parts.push(
      content.topics.map((t) => `• ${t.title} — ${t.angle}\n  Addresses: ${t.addresses}`).join("\n"),
    );
  }

  return parts.join("\n\n") || "See internal fix workspace for full implementation draft.";
}

/** Admin-only: promote a sanitized subset into customer fix previews as draft. */
export async function promoteInternalFixToCustomerPreview(
  fix: GeoInternalFix,
): Promise<{ previewId: string }> {
  const supabase = createAdminClient();
  const content = (fix.generated_content ?? {}) as InternalFixGeneratedContent;

  const previewType = INTERNAL_TO_PREVIEW_TYPE[fix.type] ?? "messaging";
  const customerTitle = fix.title.replace(/— internal fix draft/i, "").trim();
  const afterText = contentToAfterText(content);

  const { data: preview, error } = await supabase
    .from("geo_fix_previews")
    .insert({
      submission_id: fix.submission_id,
      audit_job_id: fix.audit_job_id,
      type: previewType,
      title: `Suggested: ${customerTitle}`,
      issue_summary: fix.issue_summary,
      why_it_matters: fix.why_it_matters,
      before_text: null,
      after_text: afterText.slice(0, 8000),
      html_preview: fix.generated_html,
      evidence_urls: fix.affected_urls,
      priority: fix.priority,
      implementation_effort: fix.implementation_effort,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !preview) {
    throw new Error(error?.message ?? "Failed to create customer preview");
  }

  await supabase
    .from("geo_internal_fixes")
    .update({ promoted_preview_id: preview.id, status: "approved_internal" })
    .eq("id", fix.id);

  return { previewId: preview.id };
}
