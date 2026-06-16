---
name: Portfolio architecture
description: Key decisions for Moshfiqur's portfolio — stack, auth, DB, API patterns
---

## Stack
- Frontend: React + Vite at `/` (artifact: artifacts/portfolio)
- Backend: Express 5 at `/api` (artifact: artifacts/api-server)
- DB: PostgreSQL + Drizzle ORM (lib/db)
- API contracts: OpenAPI spec → Orval codegen → hooks in lib/api-client-react
- Session auth via express-session (SESSION_SECRET env var)

## Admin auth
- Password stored in ADMIN_PASSWORD env var (currently "admin2024" — user should update)
- Session cookie: httpOnly, sameSite:lax, 24h maxAge
- Frontend checks useAdminMe() to decide whether to show login or dashboard
- All admin mutation routes protected by requireAdmin middleware
- Same-origin via Replit proxy — no credentials:include needed in frontend fetch

## Database tables
profile, certificates, research_papers, projects, blog_posts, hobbies, education

## Routes
- / about /education /research /projects /eca /hobbies /contact /admin (SPA wouter)
- /admin → standalone layout (no SiteNav/SiteFooter)
- /education replaced /biography

## DB seeded with
- 5 real research papers (real publication titles, venues marked as placeholder)
- 5 projects (competitive programming + ML/data projects)
- 6 hobbies
- 1 education entry (institution marked as placeholder)

**Why:** All venue/institution fields marked "Placeholder Venue — update via Admin Panel" so user knows to fill in real data via /admin.
