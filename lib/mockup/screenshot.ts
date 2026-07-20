import { normalizeAuditUrl } from "@/lib/audit/crawl-checks";

export type ScreenshotResult = {
  ok: boolean;
  imageUrl: string | null;
  provider: "microlink";
  /** True when Microlink captured a bot/Cloudflare challenge interstitial */
  isChallengePage: boolean;
  pageTitle: string | null;
  error?: string;
};

const SCREENSHOT_TIMEOUT_MS = 12_000;

export function looksLikeChallengeMeta(title: string | null | undefined, description?: string | null): boolean {
  const blob = `${title ?? ""} ${description ?? ""}`.toLowerCase();
  if (!blob.trim()) return false;
  return (
    /security verification|just a moment|attention required|checking your browser|cloudflare|enable javascript and cookies|verify you are (a )?human|bot protection|performing security/i.test(
      blob,
    )
  );
}

/**
 * Capture a homepage screenshot via Microlink.
 * Works without a key for light volume; set MICROLINK_API_KEY for higher limits.
 * Never throws — failures return ok:false so the mockup funnel continues.
 */
export async function captureHomepageScreenshot(
  websiteUrl: string,
): Promise<ScreenshotResult> {
  const url = normalizeAuditUrl(websiteUrl);
  const endpoint = new URL("https://api.microlink.io");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("screenshot", "true");
  endpoint.searchParams.set("meta", "true");

  const apiKey = process.env.MICROLINK_API_KEY?.trim();
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SCREENSHOT_TIMEOUT_MS);

  try {
    const resp = await fetch(endpoint.toString(), {
      signal: controller.signal,
      headers,
      redirect: "follow",
    });

    if (!resp.ok) {
      return {
        ok: false,
        imageUrl: null,
        provider: "microlink",
        isChallengePage: false,
        pageTitle: null,
        error: `Microlink HTTP ${resp.status}`,
      };
    }

    const json = (await resp.json()) as {
      status?: string;
      data?: {
        title?: string;
        description?: string;
        screenshot?: { url?: string } | string;
      };
      message?: string;
    };

    const pageTitle = json.data?.title?.trim() || null;
    const description = json.data?.description?.trim() || null;
    const isChallengePage = looksLikeChallengeMeta(pageTitle, description);

    const shot = json.data?.screenshot;
    const imageUrl =
      typeof shot === "string"
        ? shot
        : typeof shot === "object" && shot?.url
          ? shot.url
          : null;

    if (imageUrl && !isChallengePage) {
      return {
        ok: true,
        imageUrl,
        provider: "microlink",
        isChallengePage: false,
        pageTitle,
      };
    }

    if (isChallengePage) {
      return {
        ok: false,
        imageUrl: null,
        provider: "microlink",
        isChallengePage: true,
        pageTitle,
        error: "Screenshot is a security challenge page, not the real homepage",
      };
    }

    return {
      ok: false,
      imageUrl: null,
      provider: "microlink",
      isChallengePage: false,
      pageTitle,
      error: json.message || "No screenshot URL in Microlink response",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Screenshot request failed";
    return {
      ok: false,
      imageUrl: null,
      provider: "microlink",
      isChallengePage: false,
      pageTitle: null,
      error: message,
    };
  } finally {
    clearTimeout(timer);
  }
}
