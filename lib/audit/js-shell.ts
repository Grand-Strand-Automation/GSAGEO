/** Detect SPA / client-rendered shells where body content is mostly deferred to JS. */
export function isJsAppShell(html: string): boolean {
  if (!html || html.length < 200) return true;

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch?.[1] ?? html;
  const textOnly = body.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const scriptCount = (html.match(/<script\b/gi) ?? []).length;
  const hasRootMount =
    /<div[^>]+id=["'](root|app|__next|react-root)["']/i.test(body) ||
    /<div[^>]+id=["']root["']/i.test(body);

  const headRich = /<title[^>]*>[\s\S]{10,}?<\/title>/i.test(html) || /application\/ld\+json/i.test(html);
  const bodyThin = textOnly.length < 400;

  return (bodyThin && scriptCount >= 2 && hasRootMount) || (bodyThin && headRich && scriptCount >= 1);
}
