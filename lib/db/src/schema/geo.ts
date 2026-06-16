import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const geoSubmissionsTable = pgTable("geo_submissions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  fullName: text("full_name").notNull(),
  workEmail: text("work_email").notNull(),
  companyName: text("company_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  phone: text("phone"),
  primaryService: text("primary_service"),
  serviceArea: text("service_area"),
  industry: text("industry"),
  businessSize: text("business_size"),
  mainGoal: text("main_goal"),
  topCompetitors: text("top_competitors"),
  cmsPlatform: text("cms_platform"),
  currentChallenges: text("current_challenges"),
  accessAvailable: text("access_available"),
  additionalNotes: text("additional_notes"),
  honeypot: text("honeypot"),
});

export const geoAuditJobsTable = pgTable("geo_audit_jobs", {
  id: serial("id").primaryKey(),
  jobId: text("job_id").notNull().unique(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => geoSubmissionsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: text("status").notNull().default("queued"),
  results: jsonb("results"),
  adminNotes: text("admin_notes"),
});

export type GeoSubmission = typeof geoSubmissionsTable.$inferSelect;
export type GeoAuditJob = typeof geoAuditJobsTable.$inferSelect;
