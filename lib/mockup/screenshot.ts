import { normalizeAuditUrl } from "@/lib/audit/crawl-checks";

export type ScreenshotResult = {
  ok: boolean;
  imageUrl: string | null;
  provider: "microlink";
  error?: string;
};

const SCREENSHOT_TIMEOUT_MS = 12_000;

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
  endpoint.searchParams.set("meta", "false");

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
        error: `Microlink HTTP ${resp.status}`,
      };
    }

    const json = (await resp.json()) as {
      status?: string;
      data?: { screenshot?: { url?: string } | string };
      message?: string;
    };

    const shot = json.data?.screenshot;
    const imageUrl =
      typeof shot === "string"
        ? shot
        : typeof shot === "object" && shot?.url
          ? shot.url
          : null;

    if (imageUrl) {
      return { ok: true, imageUrl, provider: "microlink" };
    }

    return {
      ok: false,
      imageUrl: null,
      provider: "microlink",
      error: json.message || "No screenshot URL in Microlink response",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Screenshot request failed";
    return {
      ok: false,
      imageUrl: null,
      provider: "microlink",
      error: message,
    };
  } finally {
    clearTimeout(timer);
  }
}
