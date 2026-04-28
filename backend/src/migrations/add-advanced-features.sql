-- Advanced Features Schema Additions

-- 1. File Attachments Table
CREATE TABLE IF NOT EXISTS complaint_attachments (
  id SERIAL PRIMARY KEY,
  complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaint_attachments_complaint_id ON complaint_attachments(complaint_id);

-- 2. Complaint Escalations Table
CREATE TABLE IF NOT EXISTS complaint_escalations (
  id SERIAL PRIMARY KEY,
  complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  escalated_from INTEGER REFERENCES officers(id) ON DELETE SET NULL,
  escalated_to_department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  escalation_reason TEXT NOT NULL,
  priority_boost INTEGER DEFAULT 1,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'resolved')),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaint_escalations_complaint_id ON complaint_escalations(complaint_id);

-- 3. Complaint Comments/Discussion Thread
CREATE TABLE IF NOT EXISTS complaint_comments (
  id SERIAL PRIMARY KEY,
  complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  attachment_ids INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaint_comments_complaint_id ON complaint_comments(complaint_id);

-- 4. Complaint Surveys/Feedback
CREATE TABLE IF NOT EXISTS complaint_surveys (
  id SERIAL PRIMARY KEY,
  complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  process_feedback TEXT,
  officer_feedback TEXT,
  response_time_feedback TEXT,
  would_recommend BOOLEAN,
  suggestions TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaint_surveys_complaint_id ON complaint_surveys(complaint_id);

-- 5. System Settings/Configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  value_type VARCHAR(20),
  description TEXT,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Public Statistics Cache (for performance)
CREATE TABLE IF NOT EXISTS public_statistics (
  id SERIAL PRIMARY KEY,
  metric_key VARCHAR(100) UNIQUE NOT NULL,
  metric_value JSONB,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- 7. Officer Workload Metrics
CREATE TABLE IF NOT EXISTS officer_workload (
  id SERIAL PRIMARY KEY,
  officer_id INTEGER UNIQUE NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
  total_assigned INTEGER DEFAULT 0,
  pending_count INTEGER DEFAULT 0,
  in_progress_count INTEGER DEFAULT 0,
  overdue_count INTEGER DEFAULT 0,
  avg_resolution_time NUMERIC,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- 8. Department Performance Metrics
CREATE TABLE IF NOT EXISTS department_metrics (
  id SERIAL PRIMARY KEY,
  department_id INTEGER UNIQUE NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  total_complaints INTEGER DEFAULT 0,
  resolved_count INTEGER DEFAULT 0,
  resolution_rate NUMERIC,
  avg_resolution_time NUMERIC,
  sla_compliance_rate NUMERIC,
  citizen_satisfaction NUMERIC,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Add missing columns to complaints table if not present
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS geo_location POINT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS urgency_score INTEGER DEFAULT 0;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS citizen_phone VARCHAR(20);
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS escalation_count INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_sla_deadline ON complaints(sla_deadline) WHERE status != 'resolved' AND status != 'closed';
