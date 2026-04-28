# 🚀 GovCare — Complete Features Documentation

## Overview

GovCare is a **full-stack, end-to-end** complaint management system with three role-based portals, real-time data, strict validation, and a complete audit trail.

---

## 🔐 Authentication & Security

| Feature | Details |
|---------|---------|
| JWT Access Tokens | 15-minute expiry, auto-refresh |
| Refresh Tokens | 7-day expiry, stored in DB, revocable |
| Password Hashing | bcrypt with 12 salt rounds |
| Role-Based Access | citizen / officer / admin — enforced on every route |
| Protected Routes | Frontend guards redirect unauthorized users |
| Auto Token Refresh | Transparent 401 handling with retry |
| Logout All Devices | Revokes all refresh tokens for a user |
| Audit Logging | Every login, logout, and action is logged |

### Password Validation Rules
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- Enforced on both frontend and backend

---

## 👤 Citizen Portal

### Registration
- Full name (min 2 chars)
- Email (valid format, unique)
- Password (strict validation)
- Phone (optional, format validated)
- Aadhaar (optional, 12-digit format)
- Address (optional)

### Login
- Email + password
- Remember me (localStorage vs sessionStorage)
- Demo account quick-fill buttons
- Auto-redirect if already logged in

### Dashboard
- Welcome message with user's name
- Live stats: Total Filed, Active, Resolved
- Recent complaints list (clickable for details)
- Quick action links
- Notification banner

### File Complaint (3-Step Wizard)
**Step 1 — Basic Info:**
- Title (min 5 chars, required)
- Department (dropdown from real DB, required)
- Category (optional text)
- Priority: Low / Medium / High / Urgent

**Step 2 — Details:**
- Description (min 20 chars, required, character counter)
- Voice input button (UI ready)
- Location / Address (required)
- Image upload area (UI ready)

**Step 3 — Review & Submit:**
- Mobile number for updates
- Anonymous submission toggle
- Full summary review
- Disclaimer acknowledgment
- Real API submission → returns complaint number

### Track Status
- Search by complaint number (case-insensitive)
- Full complaint details header
- 4-stage progress bar (Pending → Acknowledged → In Progress → Resolved)
- Complete activity timeline with timestamps
- Officer assignment info
- Location display
- Rating display if rated

### Complaint History
- Paginated list (10 per page)
- Search by title or complaint ID
- Filter by status (all 6 statuses)
- Filter by priority (all 4 levels)
- View full details modal with timeline
- Rate resolved complaints (star rating + feedback)
- Pagination controls

### Profile Management
- View/edit: name, phone, address, Aadhaar
- Email is read-only (cannot be changed)
- Save changes with API call
- Notification preferences toggles (SMS, Email, App, Weekly)
- Change password with current password verification
- Show/hide password toggles

---

## 👮 Officer Portal

### Dashboard
- Personalized greeting with officer's name
- Live stats: Assigned, Resolved, Pending, SLA Breaches
- Performance metrics card (compliance %, avg cycle)
- Complaint breakdown progress bars
- Performance metrics: resolution rate, avg time, rating, SLA compliance
- Quick links to all officer pages
- Recent assigned complaints list

### Complaint Management
- Full paginated table (15 per page)
- Search by title or complaint ID
- Filter by status and priority
- Checkbox multi-select for bulk actions
- Bulk status update (select status + apply)
- View complaint detail modal:
  - Full info: citizen, department, priority, location, SLA deadline
  - Complete timeline
  - Status update panel with next valid statuses
  - Add note for citizen
- SLA breach indicator per row (⚠ Breached / Due date)

### Status Workflow
```
pending     → acknowledged, in-progress, rejected
acknowledged → in-progress, rejected
in-progress  → resolved, rejected
```

### SLA Tracking
- Live stats: Breached, Critical (<6h), At Risk (<24h), Total Monitored
- Red alert banner for breached complaints
- Full table of at-risk complaints
- SLA status badges (color-coded)
- SLA policy reference table
- Empty state when all on track ✅

### Performance Report
- 4 KPI cards: Total Assigned, Resolved, Avg Rating, SLA Breaches
- Resolution Rate progress bar
- SLA Compliance Rate progress bar
- On-Time Resolution Rate progress bar
- Time statistics: avg, fastest, slowest resolution
- Overall grade (A+/A/B/C based on resolution rate)
- Citizen satisfaction score
- Department info

### Profile
- Same as citizen profile but with department info (read-only)
- Green color scheme for officer branding

---

## 🛡️ Admin Portal

### Dashboard
- System-wide stats: Total Complaints, Resolved, In Progress, Active Officers
- Open cases count, SLA violations count
- Department performance bar chart (top 6)
- Top officers leaderboard (ranked by rating)
- Quick navigation grid to all admin pages

### Analytics
- 4 KPI cards: Total Complaints, Resolution Rate, Avg Resolution Time, SLA Violations
- Monthly trend bar chart (received vs resolved)
- System overview breakdown (all statuses with %)
- Department-wise performance table (sortable, with resolution rate bars)

### Officer Management
- Stats: Total Officers, Active, Departments, Avg Rating
- Search by name or department
- Paginated table (15 per page) with:
  - Officer name + email
  - Department
  - Employee ID
  - Assigned / Resolved counts
  - Rating
  - Active/Inactive status
  - Edit / Deactivate buttons
- Add Officer modal with full validation:
  - Name, Email, Password (required)
  - Employee ID (required)
  - Department (dropdown)
  - Phone, Designation (optional)
- Edit Officer modal (pre-filled)
- Deactivate with confirmation

### Department Management
- Stats: Total Departments, Total Complaints, Total Resolved, Avg Rate
- Search + sort (by rate / total / pending)
- Full table with: icon, name, head, total, resolved, pending, SLA days, rate bar, trend icon
- Add Department modal:
  - Name (required), Icon (emoji), Description
  - Head Name, Contact Email, Contact Phone
  - SLA Days (default resolution target)
- Edit / Delete with confirmation

### SLA Monitor
- 4 stat cards: Breached, Critical, At Risk, Departments Affected
- Red alert banner for violations
- Full violations table with escalation button
- Empty state when all on track
- SLA policy reference cards

### Audit Logs
- Search by action text
- Filter by role (admin/officer/citizen)
- Paginated table (20 per page):
  - Action description
  - Performed by (user name)
  - Role badge (color-coded)
  - Entity type + ID
  - IP address
  - Timestamp
- Pagination controls

### System Settings
- Complaint Settings:
  - Max complaints per day per citizen
  - Auto-close after resolution (days)
- SLA Configuration:
  - Alert hours before deadline
  - Priority reference cards
- Portal Features:
  - Allow anonymous complaints toggle
- System & Security:
  - Maintenance mode toggle (with warning banner)
- Save All button with success feedback
- Settings loaded from and saved to database

---

## 🔔 Notification System

- Bell icon in header with unread count badge
- Dropdown panel showing latest 10 notifications
- Mark all as read button
- Individual notification items (title + message)
- Unread notifications highlighted
- Auto-loaded on page mount

---

## 📊 Real-Time Data

All pages fetch live data from the backend:
- No mock/static data in production
- Loading spinners during fetch
- Error states with messages
- Automatic refetch after mutations
- Pagination with server-side counting

---

## ✅ Validation Summary

### Frontend Validation
| Field | Rule |
|-------|------|
| Name | min 2 chars |
| Email | valid format regex |
| Password | min 8, 1 uppercase, 1 number |
| Phone | valid phone format |
| Aadhaar | 12-digit format |
| Complaint Title | min 5 chars |
| Description | min 20 chars |
| Department | required selection |
| Location | required |
| SLA Days | positive number |
| Employee ID | required |

### Backend Validation
- All inputs validated via `validate.middleware.js`
- SQL injection prevention via parameterized queries
- Role authorization on every protected route
- Complaint count limit per day per citizen
- Status transition validation (can't skip steps)
- Rating only allowed on resolved/closed complaints

---

## 🗺️ All Routes

### Public Routes
| Path | Page |
|------|------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Register |
| `/department/:id` | Department detail |

### Citizen Routes (protected)
| Path | Page |
|------|------|
| `/citizen` | Dashboard |
| `/citizen/complaint/new` | File Complaint |
| `/citizen/track` | Track Status |
| `/citizen/history` | Complaint History |
| `/citizen/profile` | Profile |

### Officer Routes (protected)
| Path | Page |
|------|------|
| `/officer` | Dashboard |
| `/officer/complaints` | Complaints |
| `/officer/sla` | SLA Tracking |
| `/officer/performance` | Performance |
| `/officer/profile` | Profile |

### Admin Routes (protected)
| Path | Page |
|------|------|
| `/admin` | Dashboard |
| `/admin/analytics` | Analytics |
| `/admin/officers` | Officers |
| `/admin/departments` | Departments |
| `/admin/sla` | SLA Monitor |
| `/admin/audit` | Audit Logs |
| `/admin/settings` | Settings |
