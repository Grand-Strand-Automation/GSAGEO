# Legacy API server (Replit artifact)

This Express app under `artifacts/api-server` is a **legacy Replit artifact**.

Production GEO / assessment APIs live in the Next.js app at the repo root (`app/api/**`), deployed as the **gsageo** Vercel project.

The linked **gsageo-api-server** Vercel project is configured to skip builds via `vercel.json` `ignoreCommand` so PR checks stay green. Do not point customer traffic here.
