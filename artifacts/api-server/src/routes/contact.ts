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

router.post("/contact", async (req, res) => {
  const { name, email, company, phone, teamSize, helpWith, message } = req.body ?? {};

  const resend = getResend();
  if (!resend) {
    console.warn("[contact] RESEND_API_KEY not set — skipping email");
    res.json({ ok: true });
    return;
  }

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Company", company],
    ["Phone", phone],
    ["Team size", teamSize],
    ["Topic", helpWith],
    ["Message", message],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><th align="left" style="padding:6px 14px;background:#f0f4f8;border-bottom:1px solid #dce8f0">${k}</th><td style="padding:6px 14px;border-bottom:1px solid #dce8f0">${v}</td></tr>`)
    .join("");

  try {
    await resend.emails.send({
      from: fromAddress(),
      to: TO_EMAIL,
      replyTo: email,
      subject: `New contact form submission${company ? ` — ${company}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0E2F54;margin-bottom:16px">New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%">${rows}</table>
        </div>
      `,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    res.status(500).json({ ok: false, error: "Failed to send email" });
  }
});

export default router;
