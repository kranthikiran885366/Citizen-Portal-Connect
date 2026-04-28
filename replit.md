# GovCare — Citizen Complaint Management System

## Overview

Full-stack complaint management system connecting citizens with government departments. Three role-based portals (Citizen, Officer, Admin) with real-time data, JWT authentication, SLA monitoring, and complete audit trails.

## Stack

- **Frontend**: React 18 + Vite 5 + Tailwind CSS + shadcn/ui + Wouter
- **Backend**: Node.js + Express 4 + PostgreSQL
- **Auth**: JWT (access tokens 15m) + Refresh tokens (7d)
- **Monorepo**: pnpm workspaces

## Key Commands

```bash
# Backend
cd backend
npm run db:migrate    # Create all tables
npm run db:seed       # Seed demo data
npm run dev           # Start on port 5000

# Frontend
cd artifacts/gov-portal
npm run dev           # Start on port 5173
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@govcare.gov.in | Admin@123 |
| Officer | suresh.singh@govcare.gov.in | Officer@123 |
| Citizen | rajesh.kumar@example.com | Citizen@123 |

## Architecture

```
Frontend (React :5173) → /api proxy → Backend (Express :5000) → PostgreSQL
```

## Artifacts

### gov-portal (artifacts/gov-portal/)

Complete React + Vite frontend connected to real backend API.

**Auth:**
- JWT with auto-refresh, role-based protected routes
- `src/lib/api.js` — all API calls with token injection
- `src/lib/AuthContext.jsx` — auth state + ProtectedRoute component
- `src/hooks/useApi.js` — useApi + useApiMutation hooks

**Pages:**
- `/` — Landing page
- `/login` — Login with demo account buttons
- `/register` — Registration with strict validation
- `/citizen` — Dashboard with live stats
- `/citizen/complaint/new` — 3-step complaint wizard
- `/citizen/track` — Real-time tracking by complaint ID
- `/citizen/history` — Paginated history with filters + rating
- `/citizen/profile` — Profile update + password change
- `/officer` — Dashboard with performance stats
- `/officer/complaints` — Manage complaints, status updates, bulk actions
- `/officer/sla` — Live SLA breach monitoring
- `/officer/performance` — Performance metrics
- `/officer/profile` — Officer profile
- `/admin` — System overview dashboard
- `/admin/analytics` — Charts, trends, department stats
- `/admin/officers` — Full CRUD officer management
- `/admin/departments` — Full CRUD department management
- `/admin/sla` — SLA violations with escalation
- `/admin/audit` — Audit logs with search/filter
- `/admin/settings` — System settings from DB

### Backend (backend/)

Express API with PostgreSQL, full CRUD, JWT auth, audit logging.

**API Endpoints:**
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Profile
- `PUT /api/auth/profile` — Update profile
- `PUT /api/auth/change-password` — Change password
- `GET /api/complaints` — List (role-filtered)
- `POST /api/complaints` — File complaint
- `GET /api/complaints/track/:number` — Track
- `PATCH /api/complaints/:id/status` — Update status
- `PATCH /api/complaints/bulk` — Bulk update
- `GET /api/officers` — List officers
- `POST /api/officers` — Create officer
- `GET /api/officers/my-performance` — Performance
- `GET /api/departments` — List departments
- `GET /api/analytics/overview` — System stats
- `GET /api/analytics/departments` — Dept stats
- `GET /api/analytics/trends` — Monthly trends
- `GET /api/analytics/officers` — Officer rankings
- `GET /api/notifications` — User notifications
- `GET /api/audit-logs` — Audit trail

## Database Tables

- `users` — All users (citizen/officer/admin)
- `departments` — Government departments
- `officers` — Officer profiles
- `complaints` — Complaints with SLA tracking
- `complaint_timeline` — Status history
- `notifications` — User notifications
- `audit_logs` — System audit trail
- `refresh_tokens` — JWT refresh tokens
- `system_settings` — Key-value config
