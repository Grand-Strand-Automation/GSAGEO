import { Router, type IRouter } from "express";
import { Resend } from "resend";

const router: IRouter = Router();

const TO_EMAIL = "shawn@gsally.com";

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
    <th align="left" style="padding:6px 14px;background:#f0f4f8;border-bottom:1px solid #dce8f0;white-space:nowrap">${label}</th>
    <td style="padding:6px 14px;border-bottom:1px solid #dce8f0">${value}</td>
  </tr>`;
}

function buildAdminEmail(company: Record<string, unknown>, results: Record<string, unknown>, adminHourlyRate?: number) {
  const spend = results.spend as Record<string, number> | undefined;
  const savings = results.savingsRange as Record<string, number> | undefined;
  const recs = (results.recommendations as Array<{ title: string; description: string }>) ?? [];

  const contactRows = [
    row("Company", String(company.companyName ?? "—")),
    row("Contact", String(company.contactName ?? "—")),
    row("Email", String(company.workEmail ?? "—")),
    row("Employees", String(company.employeeCount ?? "—")),
    adminHourlyRate ? row("Admin hourly rate", `$${adminHourlyRate}/hr`) : "",
  ].join("");

  const resultsRows = [
    row("Monthly spend", `$${fmt(spend?.monthly ?? 0)}`),
    row("Annual spend", `$${fmt(spend?.annual ?? 0)}`),
    row("Overlap risk", String(results.overlapLevel ?? "—")),
    row("Compliance level", String(results.complianceLevel ?? "—")),
    savings ? row("Savings opportunity (monthly)", `$${fmt(savings.monthlyLow)} – $${fmt(savings.monthlyHigh)}`) : "",
    savings ? row("Savings opportunity (annual)", `$${fmt(savings.annualLow)} – $${fmt(savings.annualHigh)}`) : "",
  ].join("");

  const recList = recs.length
    ? `<h3 style="color:#0E2F54;margin-top:24px">Areas worth reviewing</h3><ul style="padding-left:20px;line-height:1.7">${recs.map((r) => `<li><strong>${r.title}:</strong> ${r.description}</li>`).join("")}</ul>`
    : "";

  return `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#0E2F54;margin-bottom:16px">New IT Cost Analysis Submission</h2>
      <h3 style="color:#0E2F54;margin-bottom:8px">Contact info</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">${contactRows}</table>
      <h3 style="color:#0E2F54;margin-bottom:8px">Results</h3>
      <table style="border-collapse:collapse;width:100%">${resultsRows}</table>
      ${recList}
    </div>
  `;
}

function buildCustomerEmail(company: Record<string, unknown>, results: Record<string, unknown>) {
  const firstName = String(company.contactName ?? "").split(" ")[0];
  const spend = results.spend as Record<string, number> | undefined;
  const savings = results.savingsRange as Record<string, number> | undefined;

  const summaryRows = [
    row("Monthly spend", `$${fmt(spend?.monthly ?? 0)}`),
    row("Overlap risk", String(results.overlapLevel ?? "—")),
    row("Compliance review", String(results.complianceLevel ?? "—")),
    savings ? row("Potential monthly savings", `$${fmt(savings.monthlyLow)} – $${fmt(savings.monthlyHigh)}`) : "",
  ].join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0E2F54">Your IT Cost Analysis Results</h2>
      <p>Hi${firstName ? ` ${firstName}` : ""},</p>
      <p>Thanks for completing the Grand Strand Ally IT cost analysis. Here's a summary:</p>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">${summaryRows}</table>
      <p>We'll follow up within one business day to walk through your findings in detail. If you'd like to reach out sooner, just reply to this email.</p>
      <p style="margin-top:24px">— The Grand Strand Ally Team</p>
    </div>
  `;
}

router.post("/cost-analysis-report", async (req, res) => {
  const { company, results, adminHourlyRate } = req.body ?? {};

  const resend = getResend();
  if (!resend) {
    console.warn("[cost-analysis] RESEND_API_KEY not set — skipping email");
    res.json({ ok: true });
    return;
  }

  try {
    await resend.emails.send({
      from: fromAddress(),
      to: TO_EMAIL,
      replyTo: company?.workEmail,
      subject: `New TCO analysis — ${company?.companyName || company?.contactName || "unknown"}`,
      html: buildAdminEmail(company ?? {}, results ?? {}, adminHourlyRate),
    });

    if (company?.workEmail) {
      await resend.emails.send({
        from: fromAddress(),
        to: company.workEmail,
        subject: "Your Grand Strand Ally IT cost analysis results",
        html: buildCustomerEmail(company ?? {}, results ?? {}),
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("[cost-analysis] Failed to send email:", err);
    res.status(500).json({ ok: false, error: "Failed to send email" });
  }
});

export default router;
