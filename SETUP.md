# ⚙️ GovCare — Complete Setup Guide

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| PostgreSQL | 14+ | https://postgresql.org |
| npm | 9+ | Included with Node.js |
| Git | Any | https://git-scm.com |

---

## 1. Clone the Repository

```bash
git clone https://github.com/kranthikiran885366/Citizen-Portal-Connect.git
cd Citizen-Portal-Connect
```

---

## 2. Database Setup

### Option A — Using psql CLI

```bash
psql -U postgres
```

```sql
CREATE USER govcare_user WITH PASSWORD 'govcare_pass';
CREATE DATABASE govcare OWNER govcare_user;
GRANT ALL PRIVILEGES ON DATABASE govcare TO govcare_user;
\q
```

### Option B — Using pgAdmin
1. Open pgAdmin → Servers → PostgreSQL
2. Right-click **Login/Group Roles** → Create → Login/Group Role
   - Name: `govcare_user`, Password: `govcare_pass`, Can login: Yes
3. Right-click **Databases** → Create → Database
   - Name: `govcare`, Owner: `govcare_user`

---

## 3. Backend Setup

```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Environment Variables
The `.env` file is already configured:
```env
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
DATABASE_URL=postgresql://govcare_user:govcare_pass@localhost:5432/govcare
JWT_SECRET=govcare_jwt_super_secret_key_change_in_production_32chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_DAYS=7
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

> ⚠️ Change `JWT_SECRET` to a strong random string in production!

### Run Database Migration
```bash
npm run db:migrate
```
This creates all tables: `users`, `departments`, `officers`, `complaints`, `complaint_timeline`, `notifications`, `audit_logs`, `refresh_tokens`, `system_settings`

### Seed Demo Data
```bash
npm run db:seed
```
This creates:
- 15 government departments
- 3 demo user accounts (admin, officer, citizen)
- Sample complaints with timelines

### Start Backend Server
```bash
npm run dev
```
Server runs at: **http://localhost:5000**

Health check: http://localhost:5000/api/health

---

## 4. Frontend Setup

```bash
cd ../artifacts/gov-portal
```

### Install Dependencies

**Using npm (standalone):**
```bash
npm install
```

**Using pnpm (workspace):**
```bash
cd ../..   # back to Citizen-Portal-Connect root
pnpm install
```

### Start Frontend Dev Server
```bash
# npm
npm run dev

# pnpm from root
pnpm --filter @workspace/gov-portal dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server automatically proxies `/api/*` requests to `http://localhost:5000`

---

## 5. Demo Accounts

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| 🛡️ Admin | admin@govcare.gov.in | Admin@123 | /admin |
| 👮 Officer | suresh.singh@govcare.gov.in | Officer@123 | /officer |
| 👤 Citizen | rajesh.kumar@example.com | Citizen@123 | /citizen |

---

## 6. Verify Everything Works

1. Open http://localhost:5173
2. Click **"Admin demo"** button on login page
3. Click **Sign In** → redirected to Admin Dashboard
4. Check Analytics, Officers, Departments pages load with real data
5. Logout → Login as Citizen → File a complaint
6. Logout → Login as Officer → Update complaint status

---

## 7. Production Build

### Backend
```bash
cd backend
npm start   # runs with node (no watch)
```

### Frontend
```bash
cd artifacts/gov-portal
npm run build   # outputs to dist/public/
npm run serve   # preview production build
```

---

## 8. Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running: `pg_ctl status` or check Services
- Verify credentials in `.env` match what you created
- Test connection: `psql -U govcare_user -d govcare -h localhost`

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Port 5173 already in use"
Change port in `vite.config.ts`: `port: 5174`

### Frontend shows "Request failed" errors
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify the Vite proxy config in `vite.config.ts`

### "Migration failed"
- Ensure the database exists and user has privileges
- Check PostgreSQL logs for details
- Try running migration again (it uses `CREATE TABLE IF NOT EXISTS`)

---

## 9. Environment Variables Reference

### Backend `.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Backend server port |
| `DATABASE_URL` | postgresql://... | PostgreSQL connection string |
| `JWT_SECRET` | (set value) | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | 15m | Access token expiry |
| `REFRESH_TOKEN_DAYS` | 7 | Refresh token expiry in days |
| `CORS_ORIGIN` | http://localhost:5173 | Allowed frontend origins |
| `NODE_ENV` | development | Environment mode |
