import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { geoSubmissionsTable, geoAuditJobsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const router: IRouter = Router();

const ADMIN_EMAIL = "shawn@gsally.com";
const AUDIT_TIMEOUT_MS = 10_000;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "Grand Strand Ally <onboarding@resend.dev>";
}

function normalizeUrl(raw: string): string {
  const u = raw.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

async function fetchWithTimeout(url: string): Promise<{ ok: boolean; status: number; html: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUDIT_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GrandStrandAlly-GEOAudit/1.0 (+https://gsally.com)",
        "Accept": "text/html,application/xhtml+xml,*/*",
      },
      redirect: "follow",
    });
    const html = await resp.text();
    return { ok: resp.ok, status: resp.status, html: html.slice(0, 500_000) };
  } catch {
    return { ok: false, status: 0, html: "" };
  } finally {
    clearTimeout(timer);
  }
}

async function checkUrl(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6_000);
  try {
    const resp = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "User-Agent": "GrandStrandAlly-GEOAudit/1.0" },
      redirect: "follow",
    });
    return resp.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function extractHtmlData(html: string) {
  const title =
    html.match(/<title[^>]*>([^<]{1,200})<\/title>/i)?.[1]?.trim() ?? "";
  const metaDesc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,300})["'][^>]*>/i)?.[1]?.trim() ??
    html.match(/<meta[^>]+content=["']([^"']{1,300})["'][^>]+name=["']description["'][^>]*>/i)?.[1]?.trim() ?? "";
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']{1,300})["'][^>]*>/i)?.[1]?.trim() ??
    html.match(/<link[^>]+href=["']([^"']{1,300})["'][^>]+rel=["']canonical["'][^>]*>/i)?.[1]?.trim() ?? "";
  const h1 =
    html.match(/<h1[^>]*>([\s\S]{1,300}?)<\/h1>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ?? "";
  const hasStructuredData = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  const ogTitle =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{1,200})["']/i)?.[1]?.trim() ?? "";

  const hrefMatches = [...html.matchAll(/href=["']([^"'#?]{2,400})["']/gi)];
  const allLinks = [...new Set(hrefMatches.map(m => m[1]).filter(Boolean))];

  return { title, metaDesc, canonical, h1, hasStructuredData, ogTitle, allLinks };
}

function detectPageTypes(html: string, allLinks: string[], baseUrl: string) {
  let domain = "";
  try { domain = new URL(baseUrl).hostname; } catch { /* ignore */ }

  const internalLinks = allLinks.filter(l =>
    l.startsWith("/") ||
    (domain && l.includes(domain))
  );

  const lc = html.toLowerCase();
  const lt = internalLinks.join(" ").toLowerCase();

  const check = (patterns: RegExp[]) =>
    patterns.some(p => p.test(lt) || p.test(lc));

  const servicePageCount = internalLinks.filter(l =>
    /\/service[s]?\/|\/solution[s]?\/|\/offering[s]?\//i.test(l)
  ).length;

  return {
    hasAbout: check([/\/about/, /about[-\s]us/, /who[-\s]we[-\s]are/]),
    hasServices: check([/\/service[s]?\b/, /\/solution[s]?\b/, /\/what[-\s]we[-\s]do/, /\/offering[s]?\b/]),
    hasContact: check([/\/contact/, /contact[-\s]us/, /get[-\s]in[-\s]touch/, /reach[-\s]us/]),
    hasFAQ: check([/\/faq/, /\/frequently[-\s]asked/, /\/questions\b/, /questions?[-\s]+and[-\s]+answers?/]),
    hasPricing: check([/\/pricing/, /\/rates/, /\/plans\b/, /\/cost[s]?\b/]),
    hasProcess: check([/\/process\b/, /\/how[-\s]it[-\s]works/, /\/methodology/, /\/approach\b/]),
    hasCaseStudies: check([
      /\/case[-\s]stud/, /\/testimonial/, /\/review[s]?\b/,
      /\/success[-\s]stor/, /\/client[-\s]stor/, /\/portfolio\b/,
    ]),
    hasBlogOrResources: check([/\/blog\b/, /\/resource[s]?\b/, /\/article[s]?\b/, /\/insight[s]?\b/, /\/guide[s]?\b/, /\/learn\b/]),
    hasComparison: check([/\bvs\b\.?\s+/, /\/compar[e]?\b/, /\/alternative[s]?\b/]),
    hasLocation: check([/\/location[s]?\b/, /\/area[s]?[-\s]served/, /\/service[-\s]area/, /serving\s+[a-z]+/]),
    servicePageCount,
    internalLinkCount: internalLinks.length,
  };
}

function extractEntityInfo(html: string, companyName: string) {
  const lc = html.toLowerCase();
  const cn = companyName.toLowerCase().trim();

  const phones = html.match(/(\+?1[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g) ?? [];
  const emails = html.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g) ?? [];

  const hasAddress = [
    /\d{2,5}\s+[a-z][a-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|blvd|boulevard|lane|ln|way)\b/i,
    /\b[a-z][a-z\s]+,\s*[a-z]{2}\s+\d{5}\b/i,
    /(?:located|based)\s+(?:in|at)\s+[a-z][a-z\s,]+/i,
  ].some(p => p.test(html));

  const socialLinks = html.match(/(?:linkedin|twitter|facebook|instagram|youtube)\.com\/[a-z0-9_-]+/gi) ?? [];

  return {
    businessNameInHtml: cn.length >= 3 ? lc.includes(cn) : false,
    phoneCount: phones.length,
    emailCount: emails.length,
    hasAddress,
    socialCount: socialLinks.length,
    hasContactInfo: phones.length > 0 || emails.length > 0 || hasAddress,
  };
}

function grade(score: number): string {
  return score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";
}

function generateScorecard(
  httpStatus: number,
  sitemapOk: boolean,
  robotsOk: boolean,
  htmlData: ReturnType<typeof extractHtmlData>,
  pageTypes: ReturnType<typeof detectPageTypes>,
  entityInfo: ReturnType<typeof extractEntityInfo>,
) {
  const crawlScore =
    (httpStatus === 200 ? 50 : 0) +
    (sitemapOk ? 25 : 0) +
    (robotsOk ? 25 : 0);

  const techRaw =
    (htmlData.title ? 20 : 0) +
    (htmlData.title.length >= 30 && htmlData.title.length <= 70 ? 15 : htmlData.title ? 5 : 0) +
    (htmlData.metaDesc ? 20 : 0) +
    (htmlData.metaDesc.length >= 80 && htmlData.metaDesc.length <= 165 ? 10 : htmlData.metaDesc ? 3 : 0) +
    (htmlData.canonical ? 20 : 0) +
    (htmlData.h1 ? 15 : 0);

  const entityScore =
    (entityInfo.businessNameInHtml ? 34 : 0) +
    (entityInfo.hasAddress || pageTypes.hasLocation ? 33 : 0) +
    (entityInfo.hasContactInfo ? 33 : 0);

  const spCount = pageTypes.servicePageCount;
  const spRaw = spCount === 0 ? 0 : spCount === 1 ? 35 : spCount === 2 ? 55 : spCount <= 4 ? 75 : 100;
  const serviceScore = pageTypes.hasServices ? Math.max(spRaw, 25) : spRaw;

  const trustScore =
    (pageTypes.hasCaseStudies ? 45 : 0) +
    (pageTypes.hasAbout ? 30 : 0) +
    (pageTypes.hasBlogOrResources ? 25 : 0);

  const aecScore =
    (pageTypes.hasFAQ ? 30 : 0) +
    (pageTypes.hasProcess ? 25 : 0) +
    (pageTypes.hasComparison ? 20 : 0) +
    (pageTypes.hasBlogOrResources ? 25 : 0);

  const lc = pageTypes.internalLinkCount;
  const structScore = lc === 0 ? 5 : lc <= 5 ? 20 : lc <= 15 ? 45 : lc <= 30 ? 72 : 100;

  const convScore =
    (pageTypes.hasContact ? 40 : 0) +
    (pageTypes.hasPricing ? 35 : 0) +
    (pageTypes.hasServices ? 25 : 0);

  const cats = {
    crawlability:        { score: crawlScore,           grade: grade(crawlScore),    label: "Crawlability" },
    technicalReadiness:  { score: Math.min(100, techRaw), grade: grade(Math.min(100, techRaw)), label: "Technical Readiness" },
    entityClarity:       { score: entityScore,          grade: grade(entityScore),   label: "Entity Clarity" },
    servicePageDepth:    { score: serviceScore,         grade: grade(serviceScore),  label: "Service-Page Depth" },
    trustContent:        { score: trustScore,           grade: grade(trustScore),    label: "Trust and Proof Content" },
    answerEngineCoverage:{ score: aecScore,             grade: grade(aecScore),      label: "Answer-Engine Coverage" },
    internalStructure:   { score: structScore,          grade: grade(structScore),   label: "Internal Structure" },
    conversionReadiness: { score: convScore,            grade: grade(convScore),     label: "Conversion Readiness" },
  };

  const weights = [0.15, 0.20, 0.15, 0.15, 0.10, 0.10, 0.10, 0.05];
  const scores = Object.values(cats).map(c => c.score);
  const overall = Math.round(scores.reduce((acc, s, i) => acc + s * weights[i], 0));

  return { overall, overallGrade: grade(overall), categories: cats };
}

function generateRecommendations(
  scorecard: ReturnType<typeof generateScorecard>,
  pageTypes: ReturnType<typeof detectPageTypes>,
  htmlData: ReturnType<typeof extractHtmlData>,
  httpStatus: number,
) {
  const fixes: { priority: string; title: string; description: string }[] = [];
  const gaps:  { impact: string; title: string; description: string }[] = [];

  if (httpStatus !== 200)
    fixes.push({ priority: "critical", title: "Homepage Not Reachable", description: "The site could not be accessed at the submitted URL. Verify the URL is correct, the site is live, and no firewall or robot rules are blocking crawlers." });

  if (!htmlData.title)
    fixes.push({ priority: "high", title: "Missing Title Tag", description: "Add a descriptive title tag (30–70 characters) to every page. This is one of the primary signals AI systems use to understand page content." });

  if (!htmlData.metaDesc)
    fixes.push({ priority: "high", title: "Missing Meta Description", description: "Add a meta description (100–160 characters) to each page. Clear summaries help AI systems represent your content accurately." });

  if (!scorecard.categories.entityClarity || scorecard.categories.entityClarity.score < 34)
    fixes.push({ priority: "high", title: "Contact Information Not Visible", description: "Make your phone number, email address, or location visible on the homepage. Entity clarity helps AI systems verify your business and confirm it is real and local." });

  if (!pageTypes.hasContact)
    fixes.push({ priority: "high", title: "No Contact Page Found", description: "Add a dedicated contact page. This is expected by both users and AI crawlers as part of a trustworthy site structure." });

  if (!htmlData.canonical)
    fixes.push({ priority: "medium", title: "Missing Canonical Tags", description: "Add rel=canonical tags across your pages. This prevents AI systems from indexing fragmented or duplicated versions of your content." });

  if (!scorecard.categories.crawlability || !scorecard.categories.crawlability.score || scorecard.categories.crawlability.score < 75)
    fixes.push({ priority: "medium", title: "Sitemap or Robots File Missing", description: "Create an XML sitemap at /sitemap.xml and a robots.txt file. These help search engines and AI crawlers discover and properly index your pages." });

  if (!htmlData.h1)
    fixes.push({ priority: "medium", title: "Missing H1 Heading", description: "Add a clear H1 heading to each page describing its topic. This is the primary content classification signal for AI indexing systems." });

  if (!pageTypes.hasFAQ)
    gaps.push({ impact: "high", title: "Build a Dedicated FAQ Page", description: "FAQ pages are among the most reliably cited content types by AI answer engines. Organize the questions your clients actually ask and answer them specifically and clearly." });

  if (!pageTypes.hasCaseStudies)
    gaps.push({ impact: "high", title: "Add Case Studies or Client Results", description: "Documented outcomes and client stories improve credibility signals for AI systems. Even two or three brief case studies can meaningfully improve trustworthiness indicators." });

  if (!pageTypes.hasServices)
    gaps.push({ impact: "high", title: "Build Dedicated Service Pages", description: "Each service you offer should have its own clearly structured page with a description, who it is for, and what is included. This is the foundation of GEO-ready architecture." });

  if (!pageTypes.hasProcess)
    gaps.push({ impact: "medium", title: "Document Your Process", description: "A clear 'how it works' or process page helps AI systems understand and summarize your offering — and helps prospects feel confident before reaching out." });

  if (!pageTypes.hasPricing)
    gaps.push({ impact: "medium", title: "Add a Pricing or Rates Page", description: "Pricing transparency pages are frequently cited when users ask cost-related questions through AI search. Even a 'starting at' or 'how pricing works' page adds value." });

  if (!pageTypes.hasLocation)
    gaps.push({ impact: "medium", title: "Create Location or Service Area Pages", description: "If you serve specific cities or regions, dedicated location pages improve local AI visibility and help clients find you when they search with geographic context." });

  if (!pageTypes.hasComparison)
    gaps.push({ impact: "medium", title: "Consider Comparison Pages", description: "Pages addressing 'X vs Y' or 'alternatives to X' are frequently surfaced by AI answer engines when users are evaluating options. These can be strong discoverability assets." });

  if (!pageTypes.hasBlogOrResources)
    gaps.push({ impact: "low", title: "Start a Resources or Articles Section", description: "Educational content increases the overall surface area of your site for AI indexing. A small library of 4–6 well-written, specific pieces makes a measurable difference." });

  const { overall } = scorecard;
  const suggestedTier =
    overall < 40 ? "GEO Foundation Build" :
    overall < 65 ? "GEO Quick Audit"       :
                   "GEO Monthly Growth";

  return {
    topFixes: fixes.slice(0, 5),
    topContentGaps: gaps.slice(0, 5),
    allFixes: fixes,
    allContentGaps: gaps,
    suggestedTier,
  };
}

function buildAdminEmail(
  sub: Record<string, unknown>,
  jobId: string,
  scorecard: ReturnType<typeof generateScorecard>,
  recs: ReturnType<typeof generateRecommendations>,
) {
  const gradeColor = (g: string) =>
    g === "A" ? "#22c55e" : g === "B" ? "#3b82f6" : g === "C" ? "#f59e0b" : g === "D" ? "#ef4444" : "#991b1b";

  const catRows = Object.values(scorecard.categories)
    .map(c => `<tr>
      <td style="padding:5px 12px;border-bottom:1px solid #dce8f0;font-size:13px">${c.label}</td>
      <td style="padding:5px 12px;border-bottom:1px solid #dce8f0;font-size:13px">${c.score}/100</td>
      <td style="padding:5px 12px;border-bottom:1px solid #dce8f0;font-size:13px">
        <span style="background:${gradeColor(c.grade)};color:#fff;font-weight:700;font-size:11px;padding:2px 7px;border-radius:4px">${c.grade}</span>
      </td>
    </tr>`).join("");

  const fixList = recs.topFixes
    .map(f => `<li style="margin-bottom:7px;font-size:13px"><strong>[${f.priority.toUpperCase()}] ${f.title}:</strong> ${f.description}</li>`)
    .join("") || "<li style='font-size:13px'>No critical fixes found.</li>";

  const gapList = recs.topContentGaps
    .map(g => `<li style="margin-bottom:7px;font-size:13px"><strong>[${g.impact.toUpperCase()}] ${g.title}:</strong> ${g.description}</li>`)
    .join("") || "<li style='font-size:13px'>No major content gaps identified.</li>";

  return `
    <div style="font-family:sans-serif;max-width:700px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0E2F54;padding:20px 24px;margin-bottom:24px;border-radius:8px">
        <h2 style="color:#fff;margin:0;font-size:18px">New GEO Audit Request</h2>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">${sub.companyName} — ${sub.workEmail} — Job ID: ${jobId}</p>
      </div>

      <h3 style="color:#0E2F54;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:.08em">Contact Info</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
        ${[
          ["Name", sub.fullName], ["Email", sub.workEmail], ["Company", sub.companyName],
          ["Website", sub.websiteUrl], ["Phone", sub.phone || "—"],
          ["Industry", sub.industry || "—"], ["Business Size", sub.businessSize || "—"],
          ["Main Goal", sub.mainGoal || "—"], ["CMS / Platform", sub.cmsPlatform || "—"],
          ["Challenges", sub.currentChallenges || "—"], ["Access Available", sub.accessAvailable || "—"],
          ["Service Area", sub.serviceArea || "—"], ["Notes", sub.additionalNotes || "—"],
        ].map(([k, v]) => `<tr>
          <th align="left" style="padding:5px 12px;background:#f0f4f8;border-bottom:1px solid #dce8f0;font-size:13px;white-space:nowrap">${k}</th>
          <td style="padding:5px 12px;border-bottom:1px solid #dce8f0;font-size:13px">${v}</td>
        </tr>`).join("")}
      </table>

      <h3 style="color:#0E2F54;font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.08em">
        GEO Scorecard — Overall: ${scorecard.overall}/100 (${scorecard.overallGrade})
      </h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
        <thead><tr>
          <th align="left" style="padding:5px 12px;background:#f0f4f8;border-bottom:1px solid #dce8f0;font-size:12px;font-weight:700;text-transform:uppercase">Category</th>
          <th align="left" style="padding:5px 12px;background:#f0f4f8;border-bottom:1px solid #dce8f0;font-size:12px;font-weight:700;text-transform:uppercase">Score</th>
          <th align="left" style="padding:5px 12px;background:#f0f4f8;border-bottom:1px solid #dce8f0;font-size:12px;font-weight:700;text-transform:uppercase">Grade</th>
        </tr></thead>
        <tbody>${catRows}</tbody>
      </table>

      <h3 style="color:#0E2F54;font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.08em">Top Priority Fixes</h3>
      <ul style="padding-left:20px;line-height:1.7">${fixList}</ul>

      <h3 style="color:#0E2F54;font-size:13px;font-weight:700;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.08em">Top Content Opportunities</h3>
      <ul style="padding-left:20px;line-height:1.7">${gapList}</ul>

      <p style="margin-top:24px;font-size:13px;color:#4B5B6B">
        Suggested tier: <strong>${recs.suggestedTier}</strong>
      </p>
    </div>
  `;
}

async function processAudit(
  jobId: string,
  dbJobId: number,
  websiteUrl: string,
  sub: Record<string, unknown>,
) {
  const baseUrl = normalizeUrl(websiteUrl);
  console.log(`[geo-audit] Starting audit for ${baseUrl} (job: ${jobId})`);

  const [homepageResult, sitemapOk, robotsOk] = await Promise.all([
    fetchWithTimeout(baseUrl),
    checkUrl(`${baseUrl}/sitemap.xml`),
    checkUrl(`${baseUrl}/robots.txt`),
  ]);

  const htmlData = extractHtmlData(homepageResult.html);
  const pageTypes = detectPageTypes(homepageResult.html, htmlData.allLinks, baseUrl);
  const entityInfo = extractEntityInfo(homepageResult.html, String(sub.companyName ?? ""));
  const scorecard = generateScorecard(
    homepageResult.status, sitemapOk, robotsOk, htmlData, pageTypes, entityInfo,
  );
  const recommendations = generateRecommendations(scorecard, pageTypes, htmlData, homepageResult.status);

  const results = {
    auditedAt: new Date().toISOString(),
    baseUrl,
    httpStatus: homepageResult.status,
    sitemapPresent: sitemapOk,
    robotsPresent: robotsOk,
    extractedData: {
      title: htmlData.title,
      titleLength: htmlData.title.length,
      metaDesc: htmlData.metaDesc,
      metaDescLength: htmlData.metaDesc.length,
      canonical: htmlData.canonical,
      h1: htmlData.h1,
      hasStructuredData: htmlData.hasStructuredData,
      ogTitle: htmlData.ogTitle,
    },
    pageTypes,
    entityInfo,
    scorecard,
    recommendations,
  };

  await db
    .update(geoAuditJobsTable)
    .set({ status: "complete", results, updatedAt: new Date() })
    .where(eq(geoAuditJobsTable.id, dbJobId));

  console.log(`[geo-audit] Audit complete for ${baseUrl} — overall score: ${scorecard.overall}/100 (${scorecard.overallGrade})`);

  const resend = getResend();
  if (resend) {
    try {
      await resend.emails.send({
        from: fromAddress(),
        to: ADMIN_EMAIL,
        replyTo: String(sub.workEmail ?? ""),
        subject: `New GEO audit — ${sub.companyName ?? "unknown"} (${scorecard.overall}/100)`,
        html: buildAdminEmail(sub, jobId, scorecard, recommendations),
      });
    } catch (err) {
      console.error("[geo-audit] Failed to send admin email:", err);
    }
  } else {
    console.warn("[geo-audit] RESEND_API_KEY not set — skipping email");
  }
}

router.post("/geo-audit", async (req, res) => {
  const body = req.body ?? {};

  if (body.website) {
    res.json({ ok: true, jobId: "filtered" });
    return;
  }

  const { fullName, workEmail, companyName, websiteUrl } = body;
  if (!fullName || !workEmail || !companyName || !websiteUrl) {
    res.status(400).json({ ok: false, error: "Missing required fields: fullName, workEmail, companyName, websiteUrl" });
    return;
  }

  try {
    const [submission] = await db
      .insert(geoSubmissionsTable)
      .values({
        fullName:          String(fullName),
        workEmail:         String(workEmail),
        companyName:       String(companyName),
        websiteUrl:        String(websiteUrl),
        phone:             body.phone             ? String(body.phone)             : null,
        primaryService:    body.primaryService    ? String(body.primaryService)    : null,
        serviceArea:       body.serviceArea       ? String(body.serviceArea)       : null,
        industry:          body.industry          ? String(body.industry)          : null,
        businessSize:      body.businessSize      ? String(body.businessSize)      : null,
        mainGoal:          body.mainGoal          ? String(body.mainGoal)          : null,
        topCompetitors:    body.topCompetitors    ? String(body.topCompetitors)    : null,
        cmsPlatform:       body.cmsPlatform       ? String(body.cmsPlatform)       : null,
        currentChallenges: Array.isArray(body.currentChallenges)
          ? body.currentChallenges.join(", ")
          : body.currentChallenges ? String(body.currentChallenges) : null,
        accessAvailable:   Array.isArray(body.accessAvailable)
          ? body.accessAvailable.join(", ")
          : body.accessAvailable ? String(body.accessAvailable) : null,
        additionalNotes:   body.additionalNotes   ? String(body.additionalNotes)   : null,
        honeypot:          body.website           ? String(body.website)           : null,
        selectedPlan:      body.selectedPlan      ? String(body.selectedPlan)      : null,
      })
      .returning();

    const jobId = randomBytes(8).toString("hex");
    const [job] = await db
      .insert(geoAuditJobsTable)
      .values({ jobId, submissionId: submission.id, status: "processing" })
      .returning();

    res.json({ ok: true, jobId });

    setImmediate(() => {
      processAudit(jobId, job.id, websiteUrl, {
        fullName, workEmail, companyName, websiteUrl,
        phone: body.phone, industry: body.industry,
        businessSize: body.businessSize, mainGoal: body.mainGoal,
        cmsPlatform: body.cmsPlatform, serviceArea: body.serviceArea,
        currentChallenges: Array.isArray(body.currentChallenges)
          ? body.currentChallenges.join(", ") : body.currentChallenges ?? null,
        accessAvailable: Array.isArray(body.accessAvailable)
          ? body.accessAvailable.join(", ") : body.accessAvailable ?? null,
        additionalNotes: body.additionalNotes,
      }).catch(async (err) => {
        console.error("[geo-audit] Audit pipeline failed:", err);
        try {
          await db
            .update(geoAuditJobsTable)
            .set({ status: "failed", updatedAt: new Date() })
            .where(eq(geoAuditJobsTable.id, job.id));
        } catch { /* ignore */ }
      });
    });
  } catch (err) {
    console.error("[geo-audit] Failed to store submission:", err);
    res.status(500).json({ ok: false, error: "Failed to save submission" });
  }
});

export default router;
