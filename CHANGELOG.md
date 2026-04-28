# 📝 Changelog

All notable changes to GovCare are documented here.

---

## [2.0.0] — 2025 — Full End-to-End Implementation

### 🚀 Major Changes — Complete Frontend-Backend Integration

This release transforms the project from a **mock-data frontend** into a **complete, production-ready full-stack application** with real API integration, authentication, and strict validation throughout.

---

### ✨ New Files Added

#### Frontend
- `src/lib/api.js` — Central API service layer with all backend endpoints, JWT injection, auto token refresh
- `src/lib/AuthContext.jsx` — React context for auth state, login/logout, protected routes
- `src/hooks/useApi.js` — Custom hooks: `useApi` (data fetching) and `useApiMutation` (mutations)
- `src/lib/auth.js` — Re-export shim for backward compatibility

#### Documentation
- `README.md` — Complete project documentation with architecture, API reference, setup guide
- `SETUP.md` — Step-by-step setup guide with troubleshooting
- `FEATURES.md` — Comprehensive feature documentation for all three portals
- `CHANGELOG.md` — This file

---

### 🔄 Modified Files

#### Frontend — Core
- **`src/App.jsx`** — Added `AuthProvider`, `ProtectedRoute` guards with role-based access for all routes
- **`src/components/Layout.jsx`** — Real user data from `AuthContext`, live notifications, real logout, notification dropdown with mark-all-read
- **`vite.config.ts`** — Removed Replit-specific `PORT`/`BASE_PATH` requirements, works locally on port 5173

#### Frontend — Auth Pages
- **`src/pages/Login.jsx`** — Uses `AuthContext.login()`, real API call, validation, demo account buttons
- **`src/pages/Register.jsx`** — Strict validation (email, password strength, Aadhaar format), real API, departments from DB

#### Frontend — Citizen Pages
- **`src/pages/citizen/CitizenDashboard.jsx`** — Live stats from API, real complaint list, complaint detail modal
- **`src/pages/citizen/FileComplaint.jsx`** — Real API submission, departments from DB, strict validation per step, character counter
- **`src/pages/citizen/TrackStatus.jsx`** — Real API tracking, full timeline, progress bar, rating display
- **`src/pages/citizen/ComplaintHistory.jsx`** — Paginated real data, filters, rating modal with star UI
- **`src/pages/citizen/CitizenProfile.jsx`** — Real profile update, password change with validation, notification toggles

#### Frontend — Officer Pages
- **`src/pages/officer/OfficerDashboard.jsx`** — Live assigned complaints, real performance stats from API
- **`src/pages/officer/OfficerComplaints.jsx`** — Real data, status update modal, bulk actions, SLA indicators
- **`src/pages/officer/OfficerSLA.jsx`** — Live SLA calculation from real complaint deadlines
- **`src/pages/officer/OfficerPerformance.jsx`** — Real performance metrics from API
- **`src/pages/officer/OfficerProfile.jsx`** — Real profile update and password change

#### Frontend — Admin Pages
- **`src/pages/admin/AdminDashboard.jsx`** — Live analytics overview, real department/officer data
- **`src/pages/admin/AdminAnalytics.jsx`** — Real analytics: KPIs, monthly trend chart, department table
- **`src/pages/admin/AdminOfficers.jsx`** — Full CRUD with real API, validation, pagination
- **`src/pages/admin/AdminDepartments.jsx`** — Full CRUD with real API, validation, delete
- **`src/pages/admin/AdminSLA.jsx`** — Live SLA data, escalation button
- **`src/pages/admin/AdminAudit.jsx`** — Real audit logs with search, role filter, pagination
- **`src/pages/admin/AdminSettings.jsx`** — Load/save settings from/to DB

#### Backend
- **`src/routes/auth.routes.js`** — Added `/profile` and `/change-password` aliases
- **`src/routes/complaint.routes.js`** — Added `PATCH /bulk`, `PATCH /:id/assign`, `PATCH /:id/reject`; comma-separated status filter
- **`src/routes/analytics.routes.js`** — Added `/overview`, `/departments`, `/trends`, `/officers` endpoints
- **`src/routes/department.routes.js`** — Added `DELETE /:id` endpoint
- **`src/controllers/analytics.controller.js`** — Added `departmentStats`, `complaintTrends`, `officerPerformance` handlers with flattened response shapes
- **`src/controllers/officer.controller.js`** — `getMyPerformance` now returns flattened performance object
- **`src/controllers/department.controller.js`** — Added `deleteDepartment` handler
- **`src/services/department.service.js`** — Added `removeDepartment` function
- **`src/repositories/department.repository.js`** — Added `deleteDepartment` (soft delete via `is_active = false`)
- **`src/repositories/complaint.repository.js`** — Fixed status filter to support comma-separated values

---

### 🐛 Bug Fixes

- Fixed Vite config crashing locally due to missing `PORT`/`BASE_PATH` env vars (Replit-specific)
- Fixed complaint list not filtering by multiple statuses (SLA page sent `"pending,acknowledged,in-progress"`)
- Fixed officer `getMyPerformance` returning nested object instead of flat performance data
- Fixed analytics endpoints returning wrong field names (frontend expected `total_complaints`, backend returned `stats.total_complaints`)
- Fixed department delete route missing from routes file
- Fixed bulk update endpoint method mismatch (frontend sent `PATCH /bulk`, backend only had `POST /bulk-update`)

---

### 🔒 Security Improvements

- All protected routes now require valid JWT
- Role-based guards on both frontend (redirect) and backend (403)
- Auto token refresh on 401 responses
- Session cleared on refresh token failure
- Password change requires current password verification

---

## [1.0.0] — Initial Release

- Basic React frontend with mock/static data
- All page layouts and UI components
- Navigation structure for all three portals
- shadcn/ui component library integration
- Tailwind CSS styling
- Express backend with PostgreSQL schema
- JWT authentication service
- Complaint CRUD operations
- Department and officer management
- Analytics repository with complex SQL queries
- Audit logging middleware
- Notification system
