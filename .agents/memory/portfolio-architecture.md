---
name: Portfolio architecture
description: Full-stack portfolio deployment — React/Vite frontend, Express API, PostgreSQL+Drizzle, session auth, Vercel deployment
---

## Stack
- Frontend: React + Vite at `/` (artifact: artifacts/portfolio) → builds to `artifacts/portfolio/dist/`
- Backend: Express 5 at `/api` (artifact: artifacts/api-server) — local dev only
- DB: PostgreSQL + Drizzle ORM (lib/db) — `@workspace/db` exports `pool` and `db`
- API contracts: OpenAPI spec → Orval codegen → hooks in lib/api-client-react
- Session auth via express-session + connect-pg-simple (Neon-backed)

## Admin auth
- Password stored in ADMIN_PASSWORD env var
- Session cookie: httpOnly; production: secure:true, sameSite:"lax"
- `req.session.save(cb)` MUST be called before sending the login response — Express serverless functions terminate before async session writes complete otherwise
- All admin mutation routes protected by requireAdmin middleware
- `app.set("trust proxy", 1)` required for secure cookies behind Vercel proxy

## Vercel deployment (Build Output API v3)
- `build-vercel.mjs` is the build script — run by `vercel build` via `buildCommand`
- It writes to `.vercel/output/` using Vercel Build Output API v3:
  - `.vercel/output/static/` ← frontend dist (copied from artifacts/portfolio/dist/)
  - `.vercel/output/functions/api/index.func/index.js` ← Express app bundle
  - `.vercel/output/functions/api/index.func/.vc-config.json` ← `{runtime:"nodejs20.x", handler:"index.js", launcherType:"Nodejs"}`
  - `.vercel/output/config.json` ← routes: `/api(/.*)?$` → `/api/index`, filesystem, then `^/.*` → `/index.html`
- `vercel.json` is minimal: just `buildCommand`, `installCommand`, `framework: null`
- pino/pino-http/pino-pretty are SHIMMED with console equivalents in the build — pino uses worker threads which crash Vercel serverless functions
- Only `pg-native` is externalized (optional native addon)

## Required Vercel env vars (all set via API or dashboard)
- DATABASE_URL — Neon connection string (postgresql://neondb_owner:...)
- SESSION_SECRET — long random string
- ADMIN_PASSWORD — admin login password
- NODE_ENV=production (set on production target)

## Neon DB
- Schema pushed with: `DATABASE_URL=$NEON_DATABASE_URL pnpm --filter @workspace/db run push`
- Session table created manually (connect-pg-simple createTableIfMissing is unreliable on cold-start serverless)
- Tables: profile, certificates, research_papers, projects, blog_posts, hobbies, education, skills, campus_ambassadors, photos, stories, messages, session

## Routes
- / /about /education /research /projects /eca /hobbies /stories /contact /admin (SPA wouter)
- /admin → standalone layout (no SiteNav/SiteFooter)
