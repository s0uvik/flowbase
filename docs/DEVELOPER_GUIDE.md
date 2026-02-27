# Flowbase Developer Guide

## Purpose
This guide helps a new developer run, understand, and extend the Flowbase codebase.

## Tech Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- tRPC + TanStack Query + SuperJSON
- Prisma + PostgreSQL
- Better Auth (email/password) with Polar billing plugin
- Inngest for background/event-driven jobs
- Sentry for monitoring
- Biome for linting/formatting
- Tailwind CSS 4 + Radix UI components

## Repository Structure
- `src/app`: App Router pages, layouts, and API route handlers
- `src/features`: Domain modules (auth, workflows, editor, subscriptions)
- `src/lib`: Shared integrations (`auth`, `db`, `polar`, helpers)
- `src/trpc`: tRPC server/client wiring and query hydration
- `src/components`: Shared UI and shell components
- `src/inngest`: Inngest client and functions
- `prisma`: Prisma schema and SQL migrations
- `public`: Static assets and icons

## Routing Model
- `/login`, `/signup` are auth routes under `src/app/(auth)`
- Dashboard shell is under `src/app/(dashboard)`
- Main pages:
  - `/workflows`
  - `/workflows/[workflowId]`
  - `/executions`
  - `/credentials`
- API routes:
  - `/api/auth/[...all]` (Better Auth)
  - `/api/trpc/[trpc]` (tRPC)
  - `/api/inngest` (Inngest)

## Local Setup
1. Install dependencies:
   - `npm install`
2. Create env file from sample:
   - copy `.env.sample` to `.env`
3. Configure required env vars (see below).
4. Run database migrations:
   - `npx prisma migrate dev`
5. Start app:
   - `npm run dev`
6. Start app + Inngest together (recommended for event testing):
   - `npm run dev:all`

## Environment Variables
Defined in `.env.sample`:
- `NODE_ENV`
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `SENTRY_AUTH_TOKEN`
- `POLAR_ACCESS_TOKEN`
- `POLAR_SUCCESS_URL`
- `POLAR_SERVER` (`sandbox` or `production`)

Notes:
- `DATABASE_URL` must point to PostgreSQL.
- Polar checkout/portal requires valid Polar credentials and product setup.
- Sentry DSN values are currently initialized in Sentry config files.

## NPM Scripts
- `npm run dev`: Next.js dev server (Turbopack)
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: Biome check
- `npm run format`: Biome format
- `npm run inngest:dev`: Inngest local dev server
- `npm run dev:all`: Next.js + Inngest concurrently

## Core Data Flow
### Auth
- Server auth client: `src/lib/auth.ts`
- Next handler: `src/app/api/auth/[...all]/route.ts`
- Client auth helper: `src/lib/auth-client.ts`
- Route protection helpers: `src/lib/auth-utils.ts` (`requireAuth`, `requireUnAuth`)

### tRPC
- Context/procedures: `src/trpc/init.ts`
- Main router: `src/trpc/routers/_app.ts`
- HTTP handler: `src/app/api/trpc/[trpc]/route.ts`
- Client provider: `src/trpc/client.tsx`
- Server prefetch/hydration: `src/trpc/server.tsx`

`protectedProcedure` enforces login.
`premiumProcedure` enforces an active Polar subscription.

### Workflows Feature (reference implementation)
- Router: `src/features/workflows/server/router.ts`
- Query params: `src/features/workflows/params.ts`
- Server prefetch: `src/features/workflows/server/prefetch.ts`
- UI list + actions: `src/features/workflows/components/workflows.tsx`
- Hooks: `src/features/workflows/hooks/use-workflows.ts`

Pattern used:
1. Parse URL params on server.
2. Prefetch tRPC query server-side.
3. Hydrate query on client.
4. Mutations invalidate list/detail query keys.

## Database
- Prisma schema: `prisma/schema.prisma`
- Current core models: `User`, `Session`, `Account`, `Verification`, `Workflow`

When changing schema:
1. Update `schema.prisma`
2. Run `npx prisma migrate dev --name <change_name>`
3. Validate impacted tRPC routers and UI hooks

## Inngest
- Client: `src/inngest/client.ts`
- Function definitions: `src/inngest/functions.ts`
- HTTP entrypoint: `src/app/api/inngest/route.ts`

Current function `execute-ai` listens to event `execute/ai` and calls Google GenAI via AI SDK.

## Observability
- Sentry config files:
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
  - `src/instrumentation-client.ts`
  - `src/instrumentation.ts`

## How To Add a New Feature
1. Create `src/features/<feature-name>/` with:
   - `server/router.ts`
   - `hooks/*`
   - `components/*`
2. Register router in `src/trpc/routers/_app.ts`.
3. Add/adjust page routes in `src/app`.
4. Add server prefetch + `HydrateClient` usage for initial load.
5. Use mutation hooks with query invalidation.
6. Gate endpoints with `protectedProcedure` or `premiumProcedure` as needed.

## Current Caveats to Know
- Root `README.md` is still the default Next.js template.
- `createTRPCContext` currently returns a hardcoded `userId` placeholder in `src/trpc/init.ts`; auth session is enforced through middleware procedures.
- Some feature pages (`executions`, `credentials`, editor) are scaffold/stub level.

## Recommended First Tasks for a New Developer
1. Replace root `README.md` with project-specific setup.
2. Add test strategy (unit/integration/e2e) and initial CI checks.
3. Harden env validation (for example with a runtime schema).
4. Expand editor/execution/credentials domains from scaffold to full flows.
