import { siteConfig } from "@/lib/brand/site";
import { appUrl } from "@/lib/utils";

type EmailLayoutInput = {
  headline: string;
  preview?: string;
  bodyParagraphs: readonly string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  support?: string;
  footer?: string;
};

export function renderBrandedEmail(input: EmailLayoutInput): string {
  const primaryBtn = input.primaryCta
    ? `<p style="margin:28px 0 0;text-align:center;">
        <a href="${input.primaryCta.href}" style="display:inline-block;background:#1f5e95;color:#ffffff;text-decoration:none;font-family:Inter,Arial,sans-serif;font-size:15px;font-weight:600;padding:14px 28px;border-radius:10px;">
          ${input.primaryCta.label}
        </a>
      </p>`
  : "";

  const secondaryBtn = input.secondaryCta
    ? `<p style="margin:16px 0 0;text-align:center;">
        <a href="${input.secondaryCta.href}" style="color:#1f5e95;text-decoration:underline;font-family:Inter,Arial,sans-serif;font-size:14px;">
          ${input.secondaryCta.label}
        </a>
      </p>`
    : "";

  const paragraphs = input.bodyParagraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#4b5b6b;">${p}</p>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${input.preview ? `<meta name="description" content="${input.preview}" />` : ""}
  <title>${input.headline}</title>
</head>
<body style="margin:0;padding:0;background:#f7f5f1;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0e2f54;border-radius:14px 14px 0 0;padding:24px 28px;">
      <p style="margin:0;font-family:Inter,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#9aaeb8;">${siteConfig.tagline}</p>
      <h1 style="margin:10px 0 0;font-family:Manrope,Inter,Arial,sans-serif;font-size:24px;line-height:1.25;color:#ffffff;">${input.headline}</h1>
    </div>
    <div style="background:#ffffff;border:1px solid #d7e1ea;border-top:none;border-radius:0 0 14px 14px;padding:28px;">
      ${paragraphs}
      ${input.support ? `<p style="margin:0 0 4px;font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.5;color:#9aaeb8;">${input.support}</p>` : ""}
      ${primaryBtn}
      ${secondaryBtn}
    </div>
    <p style="margin:20px 0 0;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:1.5;color:#9aaeb8;text-align:center;">
      ${input.footer ?? `${siteConfig.name} · ${siteConfig.serviceArea}`}<br />
      <a href="${appUrl("/")}" style="color:#1f5e95;text-decoration:none;">${appUrl("/")}</a>
    </p>
  </div>
</body>
</html>`;
}
