export function extractHtmlData(html: string) {
  const title =
    html.match(/<title[^>]*>([^<]{1,200})<\/title>/i)?.[1]?.trim() ?? "";
  const metaDesc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,300})["'][^>]*>/i)?.[1]?.trim() ??
    html.match(/<meta[^>]+content=["']([^"']{1,300})["'][^>]+name=["']description["'][^>]*>/i)?.[1]?.trim() ??
    "";
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']{1,300})["'][^>]*>/i)?.[1]?.trim() ??
    html.match(/<link[^>]+href=["']([^"']{1,300})["'][^>]+rel=["']canonical["'][^>]*>/i)?.[1]?.trim() ??
    "";
  const h1 =
    html
      .match(/<h1[^>]*>([\s\S]{1,300}?)<\/h1>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ?? "";
  const hasStructuredData = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  const ogTitle =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{1,200})["']/i)?.[1]?.trim() ?? "";

  const hrefMatches = [...html.matchAll(/href=["']([^"'#?]{2,400})["']/gi)];
  const allLinks = [...new Set(hrefMatches.map((m) => m[1]).filter(Boolean))];

  return { title, metaDesc, canonical, h1, hasStructuredData, ogTitle, allLinks };
}

export function detectPageTypes(html: string, allLinks: string[], baseUrl: string) {
  let domain = "";
  try {
    domain = new URL(baseUrl).hostname;
  } catch {
    /* ignore */
  }

  const internalLinks = allLinks.filter(
    (l) => l.startsWith("/") || (domain && l.includes(domain)),
  );

  const lc = html.toLowerCase();
  const lt = internalLinks.join(" ").toLowerCase();

  const check = (patterns: RegExp[]) =>
    patterns.some((p) => p.test(lt) || p.test(lc));

  const servicePageCount = internalLinks.filter((l) =>
    /\/service[s]?\/|\/solution[s]?\/|\/offering[s]?\//i.test(l),
  ).length;

  return {
    hasAbout: check([/\/about/, /about[-\s]us/, /who[-\s]we[-\s]are/]),
    hasServices: check([/\/service[s]?\b/, /\/solution[s]?\b/, /\/what[-\s]we[-\s]do/, /\/offering[s]?\b/]),
    hasContact: check([/\/contact/, /contact[-\s]us/, /get[-\s]in[-\s]touch/, /reach[-\s]us/]),
    hasFAQ: check([/\/faq/, /\/frequently[-\s]asked/, /\/questions\b/, /questions?[-\s]+and[-\s]+answers?/]),
    hasPricing: check([/\/pricing/, /\/rates/, /\/plans\b/, /\/cost[s]?\b/]),
    hasProcess: check([/\/process\b/, /\/how[-\s]it[-\s]works/, /\/methodology/, /\/approach\b/]),
    hasCaseStudies: check([
      /\/case[-\s]stud/,
      /\/testimonial/,
      /\/review[s]?\b/,
      /\/success[-\s]stor/,
      /\/client[-\s]stor/,
      /\/portfolio\b/,
    ]),
    hasBlogOrResources: check([
      /\/blog\b/,
      /\/resource[s]?\b/,
      /\/article[s]?\b/,
      /\/insight[s]?\b/,
      /\/guide[s]?\b/,
      /\/learn\b/,
    ]),
    hasComparison: check([/\bvs\b\.?\s+/, /\/compar[e]?\b/, /\/alternative[s]?\b/]),
    hasLocation: check([/\/location[s]?\b/, /\/area[s]?[-\s]served/, /\/service[-\s]area/, /serving\s+[a-z]+/]),
    servicePageCount,
    internalLinkCount: internalLinks.length,
  };
}

export function extractEntityInfo(html: string, companyName: string) {
  const lc = html.toLowerCase();
  const cn = companyName.toLowerCase().trim();

  const phones = html.match(/(\+?1[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g) ?? [];
  const emails = html.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g) ?? [];

  const hasAddress = [
    /\d{2,5}\s+[a-z][a-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|blvd|boulevard|lane|ln|way)\b/i,
    /\b[a-z][a-z\s]+,\s*[a-z]{2}\s+\d{5}\b/i,
    /(?:located|based)\s+(?:in|at)\s+[a-z][a-z\s,]+/i,
  ].some((p) => p.test(html));

  const socialLinks =
    html.match(/(?:linkedin|twitter|facebook|instagram|youtube)\.com\/[a-z0-9_-]+/gi) ?? [];

  return {
    businessNameInHtml: cn.length >= 3 ? lc.includes(cn) : false,
    phoneCount: phones.length,
    emailCount: emails.length,
    hasAddress,
    socialCount: socialLinks.length,
    hasContactInfo: phones.length > 0 || emails.length > 0 || hasAddress,
  };
}

/** Content structure extraction from homepage HTML */
export function extractContentStructure(html: string, baseUrl: string, companyName: string) {
  const htmlData = extractHtmlData(html);
  const pageTypes = detectPageTypes(html, htmlData.allLinks, baseUrl);
  const entityInfo = extractEntityInfo(html, companyName);
  return { htmlData, pageTypes, entityInfo };
}
