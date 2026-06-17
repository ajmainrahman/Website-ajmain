---
name: Portfolio architecture
description: Full-stack portfolio deployment — React/Vite frontend, Express API, PostgreSQL+Drizzle, session auth, Vercel deployment
---

## Stack
- Frontend: React + Vite at `/` (artifact: artifacts/portfolio) → builds to `artifacts/portfolio/dist/`
- Backend: Express 5 at `/api` (artifact: artifacts/api-server) — local dev only
- DB: PostgreSQL + Drizzle ORM (lib/db) — `@workspace/db` exports `pool` and `db` from TypeScript source directly
- API contracts: OpenAPI spec → Orval codegen → hooks in lib/api-client-react
- Session auth via express-session + connect-pg-simple (PG-backed, survives cold starts)

## Admin auth
- Password stored in ADMIN_PASSWORD env var (currently "admin2024" — user should update)
- Session cookie: httpOnly; production: secure:true, sameSite:"none"; dev: sameSite:"lax"
- Frontend checks useAdminMe() to decide whether to show login or dashboard
- All admin mutation routes protected by requireAdmin middleware
- `app.set("trust proxy", 1)` required — Express behind Vercel proxy needs this for secure cookies

## Vercel deployment layout
- Serverless function: `api/index.ts` at repo root — imports and re-exports Express `app` from `../artifacts/api-server/src/app.js`
- Static output: `artifacts/portfolio/dist/` — vercel.json outputDirectory must be exactly this path
- buildCommand: `pnpm -r --filter "./artifacts/portfolio" run build` (frontend only; API compiled by Vercel inline)
- Vercel compiles `api/index.ts` with esbuild, following pnpm symlinks into `lib/db` and `lib/api-zod` TypeScript source

## Required Vercel env vars
- DATABASE_URL — Neon connection string (postgres://...)
- SESSION_SECRET — long random string
- NODE_ENV=production — controls secure cookies; Vercel sets this automatically
- ADMIN_PASSWORD — admin login password

## connect-pg-simple
- `createTableIfMissing: true` — auto-creates `session` table in Neon DB on first request
- Uses the same `pool` exported from `@workspace/db`

## Database tables
profile, certificates, research_papers, projects, blog_posts, hobbies, education,
skills, campus_ambassadors, photos, stories

## Routes
- / /about /education /research /projects /eca /hobbies /stories /contact /admin (SPA wouter)
- /admin → standalone layout (no SiteNav/SiteFooter)
