# GEO audit logic (v2.0)

## Discovery order

For each audited domain, the pipeline runs in this order:

1. **Normalize URL** — enforce `https://`, strip trailing slashes
2. **Fetch homepage** — capture HTML, HTTP status, meta tags, internal links
3. **Fetch robots.txt** — parse `Sitemap:` directives
4. **Fetch sitemap.xml** — follow sitemap indexes (up to 8 child sitemaps)
5. **Collect URLs** — merge sitemap URLs + homepage/nav/footer links; dedupe by normalized path
6. **Classify routes** — bucket URLs (faq, process, service_page, etc.)
7. **Detect JS app shell** — thin body + scripts + `#root` mount
8. **Sample key pages** — fetch up to 6 classified routes for title/H1 confirmation
9. **Parse JSON-LD** — separate organization, service, FAQ, and article schema findings
10. **Evaluate assets** — evidence-weighted status per content type
11. **Score + recommend** — weighted categories; recommendations respect evidence statuses

## Confidence model

Each asset returns:

| Field | Values |
|-------|--------|
| `status` | `present`, `likely_present`, `not_confirmed`, `absent` |
| `confidence` | `high`, `medium`, `low` |
| `depth` | `strong`, `weak`, `schema_backed`, `not_schema_backed`, `limited` |

Evidence weights:

| Signal | Points |
|--------|--------|
| Matching route in sitemap | +5 |
| Sample page fetch succeeds | +5 |
| Page title confirms asset type | +4 |
| Heading confirms asset type | +3 |
| Schema confirms asset type | +4 |
| Homepage mention only | +1 |

Score → status:

- **≥ 8** → `present` (high confidence)
- **≥ 5** → `likely_present` (medium)
- **≥ 1** → `not_confirmed` (low)
- **0** → `absent` only when discovery is complete

## JS shell handling

Triggered when homepage HTML has:

- Thin visible body text (< ~400 chars after stripping scripts)
- Multiple scripts and a root mount div (`#root`, `#app`, `#__next`)
- Rich head metadata (title, JSON-LD) but minimal body content

When triggered:

- Do **not** conclude content is missing from HTML alone
- Prefer sitemap + classified route evidence
- Sample-fetch classified URLs for title/H1 confirmation
- Recommend improving server-rendered signals without claiming assets are absent

## Why sitemap evidence overrides raw HTML false negatives

Client-rendered sites (e.g. gsally.com) often ship an app shell in initial HTML. Nav links and page body may not appear in the first response even though routes exist and are listed in `sitemap.xml`.

The audit therefore treats **sitemap route + optional sample page title** as strong evidence that a dedicated page exists, even when the homepage HTML alone would suggest it is missing.

## Present vs absent vs not_confirmed

| Status | Meaning |
|--------|---------|
| `present` | Strong evidence: sitemap route + sample confirmation or schema |
| `likely_present` | Sitemap or discovery found dedicated route; sample not fully confirmed |
| `not_confirmed` | Some signals but discovery incomplete or ambiguous |
| `absent` | All checks completed and no evidence found |

## Report wording

Recommendations distinguish:

- **Missing** — asset status is `absent` or `not_confirmed` after full discovery
- **Present but weak** — `likely_present` or low depth
- **Present but not schema-backed** — content found, FAQPage/Organization schema missing
- **Present but limited** — e.g. few service pages or shallow case studies

## gsally.com regression expectations

With sitemap + app-shell homepage fixture, the audit should classify as present/likely_present:

- FAQ (`/faq`)
- Process (`/process`)
- Case studies (`/case-studies`)
- Contact, about, conversion pages
- Multiple service pages
- Educational resources
- robots.txt, sitemap.xml
- Organization + OfferCatalog schema

It may still recommend FAQ schema markup even when FAQ content is present.

## Remaining limitations

- No headless browser — rendered DOM text is approximated via sample fetches only
- Sample limit of 6 pages per audit (performance)
- Route classification uses slug/title heuristics; unusual URL structures may be `not_confirmed`
- External proof (backlinks, Google Business Profile) is not evaluated
- Non-HTML resources (PDF guides) are not detected unless linked as crawlable pages
