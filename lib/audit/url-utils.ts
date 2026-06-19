export function normalizeUrl(raw: string): string {
  const u = raw.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

export function getOrigin(baseUrl: string): string {
  try {
    return new URL(baseUrl).origin;
  } catch {
    return normalizeUrl(baseUrl);
  }
}

export function normalizePath(path: string): string {
  if (!path) return "/";
  const withoutFragment = path.split("#")[0] ?? path;
  const withLeading = withoutFragment.startsWith("/") ? withoutFragment : `/${withoutFragment}`;
  if (withLeading.length > 1 && withLeading.endsWith("/")) {
    return withLeading.slice(0, -1);
  }
  return withLeading || "/";
}

export function resolveInternalUrl(href: string, baseUrl: string): string | null {
  try {
    const origin = getOrigin(baseUrl);
    const resolved = href.startsWith("http") ? new URL(href) : new URL(href, origin);
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
    if (resolved.origin !== origin) return null;
    return `${resolved.origin}${normalizePath(resolved.pathname)}`;
  } catch {
    return null;
  }
}

export function pathFromUrl(url: string): string {
  try {
    return normalizePath(new URL(url).pathname);
  } catch {
    return "/";
  }
}

export function dedupeUrls(urls: string[], baseUrl?: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    let normalized: string | null = null;
    if (raw.startsWith("http")) {
      normalized = `${getOrigin(raw)}${normalizePath(pathFromUrl(raw))}`;
    } else if (baseUrl) {
      normalized = resolveInternalUrl(raw, baseUrl);
    }
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}
