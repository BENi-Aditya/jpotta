# JPOTTA - JP Olympia Table Tennis Academy

## Overview
Full-stack website for JP Olympia Table Tennis Academy (JPOTTA) with dark red/black premium theme, admin portal, and dynamic content management. Runs on Replit with a PostgreSQL database.

## Architecture

### Frontend (`artifacts/jpotta/`)
- React 19 + Vite + TypeScript
- Tailwind CSS 4 with dark red/black theme
- Framer Motion for animations
- Embla Carousel for image carousels
- Wouter for routing
- API calls via `src/lib/api.ts` (typed fetch client)
- Dev server proxies `/api` → `http://localhost:8080`

### Backend (`artifacts/api-server/`)
- Express 5 + TypeScript on port 8080
- Session-based admin auth + JWT token issuance on login
- Routes: `/api/admin/login|logout|me`, `/api/players`, `/api/news`, `/api/achievements`, `/api/committee`, `/api/reviews`, `/api/setup`
- Built with esbuild to `dist/index.mjs`

### Database (`lib/db/`)
- Replit PostgreSQL (credentials auto-injected via `DATABASE_URL`)
- Drizzle ORM with `pg` driver
- Schema: players, achievements, achievement_players, news, committee_members, reviews
- Run `pnpm --filter @workspace/db run push` to sync schema changes
- POST `/api/setup` seeds default data (run once after first deploy)

## Workflows
- **API Server**: `pnpm --filter @workspace/api-server run dev` (port 8080, console)
- **Start application**: `pnpm --filter @workspace/jpotta run dev` (port 3000, webview)

## Vercel Deployment
The project is configured for Vercel hosting at root (`vercel.json`):
- **Build**: `pnpm --filter @workspace/jpotta run build` → outputs to `artifacts/jpotta/dist`
- **API**: Serverless functions in `api/` directory using `@vercel/node`
- **Database**: Uses `POSTGRES_URL` env var (Vercel Postgres / Neon)
- **Routing**: `/api/*` → serverless functions, everything else → SPA `index.html`

### Deploying to Vercel:
1. Push repo to GitHub
2. Import project in vercel.com
3. Add Vercel Postgres from the Storage tab (sets `POSTGRES_URL` automatically)
4. Add env vars: `JWT_SECRET`, `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
5. After first deploy, call `POST /api/setup` to seed the database

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit)
- `ADMIN_USERNAME` — Admin login username (default: `admin`)
- `ADMIN_PASSWORD` — Admin login password (default: `jpotta@2024`)
- `JWT_SECRET` — JWT signing secret (default: `jpotta-jwt-secret-change-in-production`)
- `SESSION_SECRET` — Express session secret

## Pages
- `/` — Single scrollable homepage: Hero, About, Facilities, Reviews, Contact
- `/about` — Full About page: Vision & Mission, stat counters, committee members, players
- `/news` — Academy news/updates
- `/achievements` — Year-wise achievements with popup details
- `/admin` — Admin login (JWT auth)
- `/admin/dashboard` — Admin CRUD portal for all content

## Admin Access
- Default username: `admin`
- Default password: `jpotta@2024`
- JWT secret via `JWT_SECRET` env var
- Token stored in `sessionStorage` as `jpotta_token`, sent as `Authorization: Bearer`

## Key Files
- `lib/db/src/index.ts` — PostgreSQL/Drizzle DB connection
- `lib/db/src/schema/` — Full database schema
- `artifacts/api-server/src/app.ts` — Express app setup (CORS, session, logging)
- `artifacts/api-server/src/routes/` — All API route handlers
- `artifacts/api-server/src/routes/setup.ts` — DB seed route (POST /api/setup)
- `artifacts/jpotta/src/lib/api.ts` — Frontend API client (all CRUD + admin auth)
- `artifacts/jpotta/src/hooks/use-store.ts` — Async data hooks with DataContext refresh

## Key Dependencies
- `framer-motion` — animations
- `embla-carousel-react` — image carousels
- `drizzle-orm` — database ORM
- `pg` — PostgreSQL node driver
- `jose` — JWT signing/verification
- `express` v5 — HTTP server
