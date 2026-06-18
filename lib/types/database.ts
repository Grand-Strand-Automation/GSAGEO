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
  failure_reason: string | null;
  audit_version: string;
};

export type GeoAuditResult = {
  id: string;
  submission_id: string;
  audit_job_id: string;
  created_at: string;
  summary: string | null;
  scorecard_json: Record<string, unknown> | null;
  findings_json: Record<string, unknown> | null;
  recommendations_json: Record<string, unknown> | null;
  next_step_json: Record<string, unknown> | null;
};

export type GeoAdminNote = {
  id: string;
  submission_id: string;
  author_email: string;
  created_at: string;
  note: string;
};
