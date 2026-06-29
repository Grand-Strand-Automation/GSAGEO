export type GeoSubmission = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  work_email: string;
  company_name: string;
  website_url: string;
  phone: string | null;
  primary_service: string | null;
  service_area: string | null;
  industry: string | null;
  business_size: string | null;
  main_goal: string | null;
  competitors: string | null;
  cms_platform: string | null;
  current_challenges: string | null;
  access_available: string | null;
  selected_plan: string | null;
  notes: string | null;
  status: string;
};

export type GeoAuditJob = {
  id: string;
  submission_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  audit_version: string;
  review_required?: boolean;
  published_at?: string | null;
};

export type GeoAuditResult = {
  id: string;
  submission_id: string;
  audit_job_id: string;
  created_at: string;
  updated_at?: string;
  summary: string | null;
  executive_summary?: string | null;
  customer_headline?: string | null;
  customer_executive_summary?: string | null;
  strengths_json?: unknown;
  scorecard_json: Record<string, unknown> | null;
  findings_json: Record<string, unknown> | null;
  recommendations_json: Record<string, unknown> | null;
  next_step_json: Record<string, unknown> | null;
  limitations_json?: unknown;
  crawl_notes_json?: unknown;
};

export type GeoFixPreview = {
  id: string;
  submission_id: string;
  audit_job_id: string;
  created_at: string;
  type: string;
  title: string;
  issue_summary: string;
  why_it_matters: string;
  before_text: string | null;
  after_text: string;
  html_preview: string | null;
  evidence_urls: string[];
  priority: string;
  implementation_effort: string;
  status: string;
};

export type GeoInternalFix = {
  id: string;
  submission_id: string;
  audit_job_id: string;
  related_finding_label: string | null;
  related_finding_category: string | null;
  type: string;
  title: string;
  issue_summary: string;
  why_it_matters: string;
  affected_urls: string[];
  generated_content: Record<string, unknown>;
  generated_html: string | null;
  generated_json: Record<string, unknown> | null;
  implementation_notes: string | null;
  implementation_effort: string;
  priority: string;
  confidence: string;
  status: string;
  internal_only: boolean;
  customer_visible: boolean;
  created_by_system: boolean;
  internal_note: string | null;
  promoted_preview_id: string | null;
  created_at: string;
  updated_at: string;
};

export type GeoResultAccessToken = {
  id: string;
  submission_id: string;
  audit_job_id: string | null;
  token_hash: string;
  created_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  last_accessed_at: string | null;
};

export type GeoAdminNote = {
  id: string;
  submission_id: string;
  author_email: string;
  created_at: string;
  note: string;
};

export type ResultsBundle = {
  submission: GeoSubmission;
  job: GeoAuditJob;
  result: GeoAuditResult | null;
  previews: GeoFixPreview[];
};
