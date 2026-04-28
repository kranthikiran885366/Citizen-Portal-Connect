# GovCare Backend API

Express.js REST API for the GovCare Citizen Complaint Management System.

## Quick Start

```bash
npm install
npm run db:migrate   # Create tables
npm run db:seed      # Seed demo data
npm run dev          # Start on port 5000
```

## Environment Variables

```env
PORT=5000
DATABASE_URL=postgresql://govcare_user:govcare_pass@localhost:5432/govcare
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_DAYS=7
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Auth
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
POST   /api/auth/refresh           Refresh access token
POST   /api/auth/logout            Logout (revoke refresh token)
POST   /api/auth/logout-all        Logout all devices
GET    /api/auth/me                Get current user profile
PUT    /api/auth/profile           Update profile
PUT    /api/auth/change-password   Change password
GET    /api/auth/settings          Get system settings (admin)
PUT    /api/auth/settings          Update system setting (admin)
```

### Complaints
```
GET    /api/complaints                    List complaints (role-filtered)
POST   /api/complaints                    File new complaint (citizen)
GET    /api/complaints/track/:number      Track by complaint number (public)
GET    /api/complaints/sla-breaches       Get SLA violations (officer/admin)
PATCH  /api/complaints/bulk              Bulk status update (officer/admin)
GET    /api/complaints/:id               Get complaint details
PATCH  /api/complaints/:id/status        Update status (officer/admin)
PATCH  /api/complaints/:id/assign        Assign officer (admin)
PATCH  /api/complaints/:id/reject        Reject complaint (officer/admin)
POST   /api/complaints/:id/rate          Rate resolved complaint (citizen)
```

### Officers
```
GET    /api/officers                  List all officers (admin)
POST   /api/officers                  Create officer (admin)
GET    /api/officers/my-performance   My performance stats (officer)
GET    /api/officers/:id              Get officer details (admin/officer)
PUT    /api/officers/:id              Update officer (admin)
DELETE /api/officers/:id              Deactivate officer (admin)
```

### Departments
```
GET    /api/departments       List all departments (public)
GET    /api/departments/:id   Get department details (public)
POST   /api/departments       Create department (admin)
PUT    /api/departments/:id   Update department (admin)
DELETE /api/departments/:id   Delete department (admin)
```

### Analytics
```
GET    /api/analytics/overview      System overview stats (admin)
GET    /api/analytics/departments   Department performance (admin)
GET    /api/analytics/trends        Monthly complaint trends (admin)
GET    /api/analytics/officers      Officer performance rankings (admin)
```

### Notifications
```
GET    /api/notifications           Get user notifications
PATCH  /api/notifications/read-all  Mark all as read
PATCH  /api/notifications/:id/read  Mark one as read
```

### Audit Logs
```
GET    /api/audit-logs   Get audit logs with search/filter (admin)
```

### Health
```
GET    /api/health   Server + database health check
```

## Complaint Status Flow

```
pending → acknowledged → in-progress → resolved → closed
                    ↘                ↗
                     rejected
```

## SLA Targets

| Priority | Target |
|----------|--------|
| urgent | 24 hours |
| high | 3 days |
| medium | 7 days |
| low | 14 days |

## Project Structure

```
src/
├── config/
│   ├── db.js          PostgreSQL connection pool
│   ├── migrate.js     Database migration
│   └── seed.js        Demo data seeder
├── controllers/       Request handlers
├── services/          Business logic
├── repositories/      SQL queries
├── middlewares/       Auth, validation, audit, error
├── routes/            Route definitions
├── app.js             Express app
└── server.js          Entry point
```

## Scripts

```bash
npm run dev          # Development with --watch
npm start            # Production
npm run db:migrate   # Run migrations
npm run db:seed      # Seed demo data
npm run db:setup     # migrate + seed
```
