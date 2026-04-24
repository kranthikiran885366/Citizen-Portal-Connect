# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### gov-portal (/)
Government Complaint Management System — a complete React + Vite frontend-only app built with plain JavaScript (no TypeScript in src/).

**Pages:**
- `/` — Landing page with department overview, stats, how-it-works
- `/citizen` — Citizen dashboard with complaint overview
- `/citizen/complaint/new` — 3-step complaint filing form with voice/image upload
- `/citizen/track` — Track complaint by ID with real-time timeline
- `/citizen/history` — Full complaint history with search/filter
- `/citizen/profile` — Citizen profile management
- `/officer` — Officer dashboard with assigned complaints
- `/officer/complaints` — Complaints management with bulk actions
- `/officer/sla` — SLA tracking and breach monitoring
- `/officer/performance` — Officer performance metrics
- `/officer/profile` — Officer profile
- `/admin` — Admin dashboard with system overview
- `/admin/analytics` — Comprehensive analytics with charts
- `/admin/officers` — Officer management with add/edit/delete
- `/admin/departments` — All 15 departments monitoring
- `/admin/sla` — SLA violation monitoring
- `/admin/audit` — Audit logs with filtering
- `/admin/settings` — System settings configuration
- `/department/:id` — Individual department page (15 departments)

**Tech:**
- React + Vite (plain JavaScript, no TypeScript in src)
- Wouter for routing
- Tailwind CSS with shadcn/ui components
- Mock data in `src/lib/data.js`
