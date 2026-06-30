import { normalizeWebsiteUrl } from "./submission";

export type WebsiteReachabilityResult =
  | { ok: true; url: string; status: number }
  | { ok: false; error: string; status?: number };

type Fetcher = typeof fetch;

const DEFAULT_TIMEOUT_MS = 8_000;
const USER_AGENT = "GrandStrandAlly-GEOAudit-Preflight/1.0 (+https://geo.gsally.com)";

function candidateUrls(normalizedUrl: string): string[] {
  const parsed = new URL(normalizedUrl);
  const urls = [parsed.href.replace(/\/+$/, "")];

  if (parsed.protocol === "https:") {
    parsed.protocol = "http:";
    urls.push(parsed.href.replace(/\/+$/, ""));
  }

  return urls;
}

function statusMeansSiteExists(status: number): boolean {
  if (status === 404 || status === 410) return false;
  return status >= 200 && status < 500;
}

async function fetchWithTimeout(
  fetcher: Fetcher,
  url: string,
  timeoutMs: number,
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetcher(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml,text/xml,*/*",
      },
      redirect: "follow",
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function verifyWebsiteReachable(
  rawUrl: string,
  {
    fetcher = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: {
    fetcher?: Fetcher;
    timeoutMs?: number;
  } = {},
): Promise<WebsiteReachabilityResult> {
  let normalizedUrl: string;

  try {
    normalizedUrl = normalizeWebsiteUrl(rawUrl);
  } catch {
    return {
      ok: false,
      error: "Enter a valid company website, such as https://example.com.",
    };
  }

  for (const url of candidateUrls(normalizedUrl)) {
    const response = await fetchWithTimeout(fetcher, url, timeoutMs);
    if (!response) continue;

    if (statusMeansSiteExists(response.status)) {
      return { ok: true, url, status: response.status };
    }

    if (response.status >= 500) {
      return {
        ok: false,
        status: response.status,
        error:
          "We reached that website, but it returned a server error. Please check the URL before requesting an audit.",
      };
    }
  }

  return {
    ok: false,
    error:
      "We could not confirm that website is reachable. Please check the URL and try again.",
  };
}
