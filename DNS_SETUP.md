# DNS setup for geo.gsally.com

## Overview

Point `geo.gsally.com` to your Vercel deployment. The apex domain `gsally.com` stays wherever it is today (Replit / existing host).

## Steps

### 1. Add domain in Vercel

1. Vercel project → Settings → Domains
2. Add `geo.gsally.com`
3. Vercel shows required DNS records (typically a CNAME)

### 2. Configure DNS at your registrar

Add a **CNAME** record:

| Type | Name | Value |
|------|------|-------|
| CNAME | `geo` | `cname.vercel-dns.com` |

Exact value may differ — use what Vercel displays in the Domains UI.

### 3. Wait for propagation

- DNS: usually 5–60 minutes, can take up to 48 hours
- Vercel provisions SSL automatically once DNS resolves

### 4. Verify

```bash
dig geo.gsally.com
curl -I https://geo.gsally.com/
```

Browser should show valid HTTPS and the GEO landing page.

## What stays unchanged

- `gsally.com` and `www.gsally.com` — no change required for this subdomain setup
- Only `geo.gsally.com` points to Vercel

## Troubleshooting

| Issue | Fix |
|-------|-----|
| SSL pending | Wait for DNS; confirm CNAME is correct |
| Wrong site | Confirm Vercel domain is assigned to this project |
| 404 on Vercel | Redeploy; confirm root directory is repo root |
