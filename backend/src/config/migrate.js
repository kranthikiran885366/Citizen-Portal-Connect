import pool from "./db.js";

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'officer', 'admin')),
        aadhaar VARCHAR(20),
        address TEXT,
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMP,
        password_changed_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(10),
        color VARCHAR(50),
        description TEXT,
        head_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(20),
        sla_days INTEGER DEFAULT 7 CHECK (sla_days > 0),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS officers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        designation VARCHAR(255) NOT NULL DEFAULT 'Field Officer',
        is_active BOOLEAN DEFAULT true,
        joined_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        complaint_number VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        citizen_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        officer_id INTEGER REFERENCES officers(id) ON DELETE SET NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending','acknowledged','in-progress','resolved','closed','rejected')),
        priority VARCHAR(20) NOT NULL DEFAULT 'medium'
          CHECK (priority IN ('low','medium','high','urgent')),
        location TEXT,
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_anonymous BOOLEAN DEFAULT false,
        image_urls TEXT[] DEFAULT '{}',
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        feedback TEXT,
        rejection_reason TEXT,
        sla_deadline TIMESTAMP,
        acknowledged_at TIMESTAMP,
        resolved_at TIMESTAMP,
        closed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS complaint_timeline (
        id SERIAL PRIMARY KEY,
        complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        status VARCHAR(30) NOT NULL,
        note TEXT NOT NULL,
        updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        role VARCHAR(20),
        ip_address VARCHAR(50),
        user_agent TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'info'
          CHECK (type IN ('info','success','warning','error')),
        is_read BOOLEAN DEFAULT false,
        complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(512) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(50),
        user_agent TEXT,
        is_revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      INSERT INTO system_settings (key, value, description) VALUES
        ('max_complaints_per_day', '10', 'Maximum complaints a citizen can file per day'),
        ('sla_alert_hours', '24', 'Hours before SLA deadline to send alert'),
        ('auto_close_days', '30', 'Days after resolution to auto-close complaint'),
        ('allow_anonymous', 'true', 'Allow anonymous complaint filing'),
        ('maintenance_mode', 'false', 'Put system in maintenance mode')
      ON CONFLICT (key) DO NOTHING
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
      CREATE INDEX IF NOT EXISTS idx_complaints_officer ON complaints(officer_id);
      CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_id);
      CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
      CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
      CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_complaints_sla ON complaints(sla_deadline) WHERE status NOT IN ('resolved','closed','rejected');
      CREATE INDEX IF NOT EXISTS idx_timeline_complaint ON complaint_timeline(complaint_id);
      CREATE INDEX IF NOT EXISTS idx_audit_performed_by ON audit_logs(performed_by);
      CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
    `);

    await client.query("COMMIT");
    console.log("✅ Migration completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch(() => process.exit(1));
