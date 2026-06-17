import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { geoSubmissionsTable, geoAuditJobsTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) { next(); return; }
  const provided = req.headers["x-admin-key"];
  if (provided !== expected) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  next();
}

router.use(requireAdminKey);

router.get("/geo-admin/submissions", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(geoSubmissionsTable)
      .orderBy(desc(geoSubmissionsTable.createdAt))
      .limit(200);
    res.json({ ok: true, submissions: rows });
  } catch (err) {
    console.error("[geo-admin] Failed to fetch submissions:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch submissions" });
  }
});

router.get("/geo-admin/jobs", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(geoAuditJobsTable)
      .orderBy(desc(geoAuditJobsTable.createdAt))
      .limit(200);
    res.json({ ok: true, jobs: rows });
  } catch (err) {
    console.error("[geo-admin] Failed to fetch jobs:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch jobs" });
  }
});

router.get("/geo-admin/report/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const [job] = await db
      .select()
      .from(geoAuditJobsTable)
      .where(eq(geoAuditJobsTable.jobId, jobId))
      .limit(1);

    if (!job) {
      res.status(404).json({ ok: false, error: "Job not found" });
      return;
    }

    const [submission] = await db
      .select()
      .from(geoSubmissionsTable)
      .where(eq(geoSubmissionsTable.id, job.submissionId))
      .limit(1);

    res.json({ ok: true, job, submission: submission ?? null });
  } catch (err) {
    console.error("[geo-admin] Failed to fetch report:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch report" });
  }
});

export default router;
