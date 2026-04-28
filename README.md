# 🏛️ GovCare — Citizen Complaint Management System

> **Final Year Project** | Full-Stack End-to-End Complaint Management Portal for Government Services

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)](https://postgresql.org)
[![Express](https://img.shields.io/badge/Express-4-black?logo=express)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?logo=tailwindcss)](https://tailwindcss.com)
[![CI](https://github.com/your-org/your-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/your-repo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Demo Accounts](#demo-accounts)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Database Schema](#database-schema)

---

## 🌟 Overview

GovCare is a **complete, production-ready** citizen complaint management system that connects citizens with government departments. Citizens can file complaints, track resolution in real-time, and rate the service. Officers manage and resolve complaints. Admins oversee the entire system with analytics, SLA monitoring, and audit trails.

**Key Highlights:**
- 🔐 JWT-based authentication with refresh tokens
- 👥 Three role-based portals: Citizen, Officer, Admin
- 📊 Real-time analytics and SLA monitoring
- 🔔 In-app notification system
- 📝 Complete audit trail for all actions
- ✅ Strict form validation on both frontend and backend
- 📱 Fully responsive design

---

## ✨ Features

### 👤 Citizen Portal
| Feature | Description |
|---------|-------------|
| Register / Login | JWT auth with remember-me, role-based redirect |
| File Complaint | 3-step wizard: Basic Info → Details → Review & Submit |
| Track Status | Real-time tracking by complaint ID with full timeline |
| Complaint History | Paginated list with search, status & priority filters |
| Rate Resolution | 1–5 star rating + feedback for resolved complaints |
| Profile Management | Update name, phone, address, Aadhaar |
| Change Password | Secure password change with validation |
| Notifications | In-app notification bell with unread count |

### 👮 Officer Portal
| Feature | Description |
|---------|-------------|
| Dashboard | Assigned complaints, performance stats, SLA overview |
| Complaint Management | View, update status, add notes, bulk actions |
| Status Workflow | pending → acknowledged → in-progress → resolved |
| SLA Tracking | Breached / Critical / At-Risk complaint monitoring |
| Performance Report | Resolution rate, avg time, citizen rating, compliance |
| Profile Management | Update profile and change password |

### 🛡️ Admin Portal
| Feature | Description |
|---------|-------------|
| Analytics Dashboard | System-wide stats, department performance, top officers |
| Officer Management | Full CRUD: add, edit, deactivate officers |
| Department Management | Full CRUD: add, edit, delete departments |
| SLA Monitor | Real-time SLA violation tracking with escalation |
| Audit Logs | Complete audit trail with search and pagination |
| System Settings | SLA policies, maintenance mode, complaint limits |
| Complaint Trends | Monthly trend charts (received vs resolved) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Wouter | Client-side routing |
| Tailwind CSS 4 | Styling |
| shadcn/ui | UI component library |
| Lucide React | Icons |
| TanStack Query | Server state management |
| React Hook Form | Form handling |
| Zod | Schema validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js 18+ | Runtime |
| Express 4 | HTTP framework |
| PostgreSQL 14+ | Database |
| node-postgres (pg) | Database driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| dotenv | Environment config |

---

## 📁 Project Structure

```
Citizen-Portal-Connect/
├── backend/                          # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # PostgreSQL connection pool
│   │   │   ├── migrate.js            # Database migration script
│   │   │   └── seed.js               # Demo data seeder
│   │   ├── controllers/              # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── complaint.controller.js
│   │   │   ├── officer.controller.js
│   │   │   ├── department.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── notification.controller.js
│   │   │   └── audit.controller.js
│   │   ├── services/                 # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── complaint.service.js
│   │   │   ├── officer.service.js
│   │   │   ├── department.service.js
│   │   │   └── analytics.service.js
│   │   ├── repositories/             # Database queries
│   │   │   ├── complaint.repository.js
│   │   │   ├── officer.repository.js
│   │   │   ├── department.repository.js
│   │   │   ├── analytics.repository.js
│   │   │   ├── audit.repository.js
│   │   │   ├── notification.repository.js
│   │   │   └── user.repository.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   ├── validate.middleware.js # Request validation
│   │   │   ├── audit.middleware.js   # Auto audit logging
│   │   │   └── error.middleware.js   # Global error handler
│   │   ├── routes/                   # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── complaint.routes.js
│   │   │   ├── officer.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   ├── notification.routes.js
│   │   │   └── audit.routes.js
│   │   ├── app.js                    # Express app setup
│   │   └── server.js                 # Server entry point
│   ├── .env                          # Environment variables
│   └── package.json
│
└── artifacts/gov-portal/             # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── ui/                   # shadcn/ui components
    │   │   ├── Layout.jsx            # Main layout with sidebar + header
    │   │   ├── AuthLayout.jsx        # Auth pages layout
    │   │   ├── ComplaintCard.jsx     # Complaint list item
    │   │   └── StatCard.jsx          # Stats display card
    │   ├── hooks/
    │   │   └── useApi.js             # Data fetching hooks
    │   ├── lib/
    │   │   ├── api.js                # All API calls + auth helpers
    │   │   ├── AuthContext.jsx       # Auth state + protected routes
    │   │   └── utils.ts              # Utility functions
    │   ├── pages/
    │   │   ├── Landing.jsx           # Public landing page
    │   │   ├── Login.jsx             # Login page
    │   │   ├── Register.jsx          # Registration page
    │   │   ├── citizen/              # Citizen portal pages
    │   │   │   ├── CitizenDashboard.jsx
    │   │   │   ├── FileComplaint.jsx
    │   │   │   ├── TrackStatus.jsx
    │   │   │   ├── ComplaintHistory.jsx
    │   │   │   └── CitizenProfile.jsx
    │   │   ├── officer/              # Officer portal pages
    │   │   │   ├── OfficerDashboard.jsx
    │   │   │   ├── OfficerComplaints.jsx
    │   │   │   ├── OfficerSLA.jsx
    │   │   │   ├── OfficerPerformance.jsx
    │   │   │   └── OfficerProfile.jsx
    │   │   └── admin/                # Admin portal pages
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminAnalytics.jsx
    │   │       ├── AdminOfficers.jsx
    │   │       ├── AdminDepartments.jsx
    │   │       ├── AdminSLA.jsx
    │   │       ├── AdminAudit.jsx
    │   │       └── AdminSettings.jsx
    │   ├── App.jsx                   # Router + AuthProvider
    │   └── main.jsx                  # React entry point
    ├── vite.config.ts                # Vite config with API proxy
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Step 1 — Database Setup

```sql
-- Run in psql or pgAdmin:
CREATE USER govcare_user WITH PASSWORD 'govcare_pass';
CREATE DATABASE govcare OWNER govcare_user;
GRANT ALL PRIVILEGES ON DATABASE govcare TO govcare_user;
```

### Step 2 — Backend

```bash
cd Citizen-Portal-Connect/backend

# Install dependencies
npm install

# Run migrations (creates all tables + indexes)
npm run db:migrate

# Seed demo data (creates demo accounts + sample data)
npm run db:seed

# Start backend server on port 5000
npm run dev
```

### Step 3 — Frontend

```bash
cd Citizen-Portal-Connect/artifacts/gov-portal

# Install dependencies
npm install

# Start frontend dev server on port 5173
npm run dev
```

### Step 4 — Open Browser

```
http://localhost:5173

---

## 📜 License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.

```

> The frontend proxies all `/api` requests to `http://localhost:5000` automatically.

---

## 🔑 Demo Accounts

| Role    | Email                         | Password    |
|---------|-------------------------------|-------------|
| 🛡️ Admin   | admin@govcare.gov.in          | Admin@123   |
| 👮 Officer | suresh.singh@govcare.gov.in   | Officer@123 |
| 👤 Citizen | rajesh.kumar@example.com      | Citizen@123 |

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| PUT | `/api/auth/change-password` | ✅ | Change password |
| GET | `/api/auth/settings` | 🛡️ Admin | Get system settings |
| PUT | `/api/auth/settings` | 🛡️ Admin | Update system setting |

### Complaints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/complaints` | ✅ | List complaints (role-filtered) |
| POST | `/api/complaints` | 👤 Citizen | File new complaint |
| GET | `/api/complaints/track/:number` | ❌ | Track by complaint number |
| GET | `/api/complaints/:id` | ✅ | Get complaint details |
| PATCH | `/api/complaints/:id/status` | 👮/🛡️ | Update status |
| PATCH | `/api/complaints/:id/assign` | 🛡️ Admin | Assign officer |
| PATCH | `/api/complaints/:id/reject` | 👮/🛡️ | Reject complaint |
| POST | `/api/complaints/:id/rate` | 👤 Citizen | Rate resolved complaint |
| PATCH | `/api/complaints/bulk` | 👮/🛡️ | Bulk status update |
| GET | `/api/complaints/sla-breaches` | 👮/🛡️ | Get SLA violations |

### Officers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/officers` | 🛡️ Admin | List all officers |
| POST | `/api/officers` | 🛡️ Admin | Create officer |
| GET | `/api/officers/my-performance` | 👮 Officer | My performance stats |
| GET | `/api/officers/:id` | 🛡️/👮 | Get officer details |
| PUT | `/api/officers/:id` | 🛡️ Admin | Update officer |
| DELETE | `/api/officers/:id` | 🛡️ Admin | Deactivate officer |

### Departments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/departments` | ❌ | List all departments |
| GET | `/api/departments/:id` | ❌ | Get department details |
| POST | `/api/departments` | 🛡️ Admin | Create department |
| PUT | `/api/departments/:id` | 🛡️ Admin | Update department |
| DELETE | `/api/departments/:id` | 🛡️ Admin | Delete department |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/overview` | 🛡️ Admin | System overview stats |
| GET | `/api/analytics/departments` | 🛡️ Admin | Department performance |
| GET | `/api/analytics/trends` | 🛡️ Admin | Complaint trends |
| GET | `/api/analytics/officers` | 🛡️ Admin | Officer performance |

### Notifications & Audit
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | ✅ | Get user notifications |
| PATCH | `/api/notifications/:id/read` | ✅ | Mark one as read |
| PATCH | `/api/notifications/read-all` | ✅ | Mark all as read |
| GET | `/api/audit-logs` | 🛡️ Admin | Get audit logs |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Citizen  │  │ Officer  │  │       Admin          │  │
│  │  Portal  │  │  Portal  │  │       Portal         │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       │              │                   │              │
│  ┌────▼──────────────▼───────────────────▼───────────┐  │
│  │           AuthContext + Protected Routes           │  │
│  │              api.js (fetch + JWT inject)           │  │
│  └────────────────────┬──────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────┘
                        │ /api proxy (Vite dev)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Express)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Routes  │→ │Controllers│→ │      Services        │  │
│  └──────────┘  └──────────┘  └──────────┬───────────┘  │
│                                          │              │
│  ┌───────────────────────────────────────▼───────────┐  │
│  │              Repositories (SQL queries)            │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                     │
│  users │ complaints │ departments │ officers             │
│  complaint_timeline │ notifications │ audit_logs         │
│  refresh_tokens │ system_settings                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | All users (citizen, officer, admin) |
| `departments` | Government departments |
| `officers` | Officer profiles linked to users |
| `complaints` | Complaint records with SLA tracking |
| `complaint_timeline` | Status change history per complaint |
| `notifications` | User notifications |
| `audit_logs` | System-wide audit trail |
| `refresh_tokens` | JWT refresh token store |
| `system_settings` | Key-value system configuration |

### Complaint Status Flow

```
pending → acknowledged → in-progress → resolved → closed
                    ↘                ↗
                     rejected
```

### SLA Priority Targets

| Priority | Target |
|----------|--------|
| 🔴 Urgent | 24 hours |
| 🟠 High | 3 days |
| 🔵 Medium | 7 days |
| ⚪ Low | 14 days |

---

## 🔒 Security Features

- **JWT Access Tokens** — 15 minute expiry
- **Refresh Tokens** — 7 day expiry, stored in DB
- **Password Hashing** — bcrypt with salt rounds 12
- **Role-Based Access Control** — citizen / officer / admin
- **Input Validation** — server-side validation on all endpoints
- **Audit Logging** — every action logged with IP + user agent
- **CORS** — configured for specific origins
- **SQL Injection Prevention** — parameterized queries throughout

---

## 📊 Validation Rules

### Registration
- Name: min 2 characters
- Email: valid email format
- Password: min 8 chars, 1 uppercase, 1 number
- Phone: valid format (optional)
- Aadhaar: 12-digit format (optional)

### Complaint Filing
- Title: min 5 characters
- Description: min 20 characters
- Department: required
- Location: required

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

Built as a **Final Year Project** — GovCare Citizen Complaint Management System

> A transparent, efficient, and accountable platform connecting citizens with government services.
