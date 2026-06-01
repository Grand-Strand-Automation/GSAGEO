import { Router, type IRouter } from "express";
import { Resend } from "resend";

const router: IRouter = Router();

const ADMIN_EMAIL = "shawn@gsally.com";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "Grand Strand Ally <onboarding@resend.dev>";
}

function fmt(n: number) {
  return Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function row(label: string, value: string) {
  return `<tr>
    <th align="left" style="padding:6px 14px;background:#f0f4f8;border-bottom:1px solid #dce8f0;white-space:nowrap;font-weight:600;font-size:13px">${label}</th>
    <td style="padding:6px 14px;border-bottom:1px solid #dce8f0;font-size:13px">${value}</td>
  </tr>`;
}

function tri(v: unknown): string {
  if (v === "yes") return "✅ Yes";
  if (v === "no") return "❌ No";
  return "❓ Not sure";
}

function section(title: string, rows: string) {
  return `
    <h3 style="color:#0E2F54;font-size:14px;font-weight:700;margin:24px 0 8px;text-transform:uppercase;letter-spacing:0.08em">${title}</h3>
    <table style="border-collapse:collapse;width:100%;margin-bottom:8px">${rows}</table>
  `;
}

function buildAdminLeadEmail(
  company: Record<string, unknown>,
  spend: Record<string, unknown>,
  overlap: Record<string, unknown>,
  compliance: Record<string, unknown>,
  results: Record<string, unknown>,
  adminHourlyRate?: number,
) {
  const spendData = results.spend as Record<string, number> | undefined;
  const savings = results.savingsRange as Record<string, number> | undefined;
  const recs = (results.recommendations as Array<{ title: string; description: string }>) ?? [];

  const contactRows = [
    row("Contact name", String(company.contactName ?? "—")),
    row("Company", String(company.companyName ?? "—")),
    row("Email", String(company.workEmail ?? "—")),
    row("Users", String(company.userCount ?? "—")),
    row("Devices", String(company.deviceCount ?? "—")),
    row("Locations", String(company.locationCount ?? "—")),
    row("Industry", String(company.industry ?? "—")),
    row("Handles sensitive data", tri(company.sensitiveData)),
    row("Uses Microsoft 365", tri(company.usesMicrosoft365)),
  ].join("");

  const spendRows = [
    row("Managed support", `$${fmt(Number(spend.managedSupport || 0))}/mo`),
    row("Microsoft 365 licensing", `$${fmt(Number(spend.microsoft365 || 0))}/mo`),
    row("Email security", `$${fmt(Number(spend.emailSecurity || 0))}/mo`),
    row("Endpoint security", `$${fmt(Number(spend.endpointSecurity || 0))}/mo`),
    row("Backup and recovery", `$${fmt(Number(spend.backupRecovery || 0))}/mo`),
    row("Network / firewall", `$${fmt(Number(spend.networkFirewall || 0))}/mo`),
    row("Cloud software / other", `$${fmt(Number(spend.cloudSoftware || 0))}/mo`),
    row("Internal admin time", `${fmt(Number(spend.adminTimeMonthly || 0))} hrs/mo @ $${fmt(Number(spend.adminHourlyRate || adminHourlyRate || 45))}/hr`),
    row("Estimated monthly total", `<strong>$${fmt(spendData?.monthly ?? 0)}</strong>`),
    row("Estimated annual total", `<strong>$${fmt(spendData?.annual ?? 0)}</strong>`),
  ].join("");

  const overlapRows = [
    row("Multiple security tools", tri(overlap.multipleSecurityTools)),
    row("Multiple backup tools", tri(overlap.multipleBackupTools)),
    row("Split vendors (support + security)", tri(overlap.splitVendors)),
    row("Unused or unclear software", tri(overlap.unusedSoftware)),
    row("Former employee accounts still active", tri(overlap.formerEmployeeLingers)),
    row("Onboarding is manual", tri(overlap.manualOnboarding)),
    row("Offboarding is manual", tri(overlap.manualOffboarding)),
    row("Microsoft 365 licensing is unclear", tri(overlap.microsoft365LicensingClear)),
    row("Shared mailboxes managed manually", tri(overlap.sharedMailboxManual)),
    row("<strong>Overlap level</strong>", `<strong>${String(results.overlapLevel ?? "—")}</strong>`),
  ].join("");

  const complianceRows = [
    row("Multi-factor authentication for all users", tri(compliance.mfaForAll)),
    row("Onboarding process documented", tri(compliance.onboardingDocumented)),
    row("Offboarding process documented", tri(compliance.offboardingDocumented)),
    row("Admin roles reviewed regularly", tri(compliance.adminRolesReviewed)),
    row("Backup ownership is clear", tri(compliance.backupOwnershipClear)),
    row("Restore tests performed", tri(compliance.testRestores)),
    row("Access changes tracked", tri(compliance.accessChangesTracked)),
    row("Compliance support needed", tri(compliance.needsComplianceSupport)),
    row("<strong>Compliance level</strong>", `<strong>${String(results.complianceLevel ?? "—")}</strong>`),
  ].join("");

  const savingsRows = savings ? [
    row("Monthly savings opportunity", `$${fmt(savings.monthlyLow)} – $${fmt(savings.monthlyHigh)}`),
    row("Annual savings opportunity", `$${fmt(savings.annualLow)} – $${fmt(savings.annualHigh)}`),
  ].join("") : "";

  const recList = recs.length
    ? `<h3 style="color:#0E2F54;font-size:14px;font-weight:700;margin:24px 0 8px;text-transform:uppercase;letter-spacing:0.08em">Areas worth reviewing</h3>
       <ul style="padding-left:20px;line-height:1.8;font-size:13px">${recs.map((r) => `<li><strong>${r.title}:</strong> ${r.description}</li>`).join("")}</ul>`
    : "";

  return `
    <div style="font-family:sans-serif;max-width:680px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0E2F54;padding:20px 24px;margin-bottom:24px;border-radius:8px">
        <h2 style="color:#ffffff;margin:0;font-size:18px">New Cost Analysis Lead</h2>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">${String(company.companyName || company.contactName || "Unknown")} — ${String(company.workEmail ?? "no email")}</p>
      </div>
      ${section("Contact and Company", contactRows)}
      ${section("Monthly Spend Breakdown", spendRows)}
      ${section("Overlap Assessment", overlapRows)}
      ${section("Compliance Assessment", complianceRows)}
      ${savings ? section("Estimated Savings Opportunity", savingsRows) : ""}
      ${recList}
    </div>
  `;
}

function buildCustomerEmail(company: Record<string, unknown>, results: Record<string, unknown>) {
  const firstName = String(company.contactName ?? "").split(" ")[0];
  const spend = results.spend as Record<string, number> | undefined;
  const savings = results.savingsRange as Record<string, number> | undefined;

  const summaryRows = [
    row("Monthly spend estimate", `$${fmt(spend?.monthly ?? 0)}`),
    row("Overlap risk", String(results.overlapLevel ?? "—")),
    row("Compliance review", String(results.complianceLevel ?? "—")),
    savings ? row("Potential monthly savings", `$${fmt(savings.monthlyLow)} – $${fmt(savings.monthlyHigh)}`) : "",
  ].join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#0E2F54;padding:20px 24px;margin-bottom:24px;border-radius:8px">
        <h2 style="color:#ffffff;margin:0;font-size:18px">Your Information Technology Cost Analysis Results</h2>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">Grand Strand Ally</p>
      </div>
      <p>Hi${firstName ? ` ${firstName}` : ""},</p>
      <p>Thanks for completing the Grand Strand Ally cost analysis. Here is a summary of your results:</p>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">${summaryRows}</table>
      <p>We will follow up within one business day to walk through your findings in detail and discuss practical next steps. If you would like to reach out sooner, just reply to this email.</p>
      <p style="margin-top:24px">— The Grand Strand Ally Team<br><a href="https://gsally.com" style="color:#1F5E95">gsally.com</a></p>
    </div>
  `;
}

router.post("/cost-analysis-report", async (req, res) => {
  const { company, spend, overlap, compliance, results, adminHourlyRate } = req.body ?? {};

  const resend = getResend();
  if (!resend) {
    console.warn("[cost-analysis] RESEND_API_KEY not set — skipping email");
    res.json({ ok: true });
    return;
  }

  // ── Admin lead email — send first, independently ──────────────────────────
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: ADMIN_EMAIL,
      replyTo: company?.workEmail,
      subject: `New cost analysis lead — ${company?.companyName || company?.contactName || "unknown"}`,
      html: buildAdminLeadEmail(
        company ?? {},
        spend ?? {},
        overlap ?? {},
        compliance ?? {},
        results ?? {},
        adminHourlyRate,
      ),
    });
    console.log(`[cost-analysis] Admin lead email sent for ${company?.workEmail ?? "unknown"}`);
  } catch (err) {
    console.error("[cost-analysis] Failed to send admin lead email:", err);
  }

  // ── Customer results email — independent of admin email ───────────────────
  if (company?.workEmail) {
    try {
      await resend.emails.send({
        from: fromAddress(),
        to: company.workEmail,
        replyTo: ADMIN_EMAIL,
        subject: "Your Grand Strand Ally cost analysis results",
        html: buildCustomerEmail(company ?? {}, results ?? {}),
      });
      console.log(`[cost-analysis] Customer results email sent to ${company.workEmail}`);
    } catch (err) {
      console.error(`[cost-analysis] Failed to send customer email to ${company.workEmail}:`, err);
    }
  }

  res.json({ ok: true });
});

export default router;
