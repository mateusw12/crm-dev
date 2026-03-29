-- ============================================================
-- CRM Database Schema - Supabase / PostgreSQL
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('USER', 'MANAGER', 'ADMIN');
CREATE TYPE deal_status AS ENUM ('LEAD', 'CONTACTED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');
CREATE TYPE interaction_type AS ENUM ('CALL', 'EMAIL', 'MEETING');
CREATE TYPE task_status AS ENUM ('PENDING', 'DONE');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY,  -- Matches NextAuth session sub
  email       TEXT NOT NULL UNIQUE,
  name        TEXT,
  picture     TEXT,
  role        user_role NOT NULL DEFAULT 'USER',
  manager_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  tenant_id   UUID,              -- Used for multi-tenant scoping
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed system ADMIN user (update with your NextAuth user id)
INSERT INTO users (id, email, name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@system.local',
  'System Admin',
  'ADMIN'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  industry    TEXT,
  website     TEXT,
  phone       TEXT,
  address     TEXT,
  notes       TEXT,
  tenant_id   UUID,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONTACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  company_id  UUID REFERENCES companies(id) ON DELETE SET NULL,
  notes       TEXT,
  tenant_id   UUID,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_created_by ON contacts(created_by);
CREATE INDEX idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX idx_contacts_email ON contacts(email);

-- ============================================================
-- INTERACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS interactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        interaction_type NOT NULL,
  description TEXT NOT NULL,
  date        TIMESTAMPTZ NOT NULL,
  contact_id  UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);

-- ============================================================
-- DEALS
-- ============================================================
CREATE TABLE IF NOT EXISTS deals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  value       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status      deal_status NOT NULL DEFAULT 'LEAD',
  contact_id  UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tenant_id   UUID,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_deals_created_by ON deals(created_by);
CREATE INDEX idx_deals_tenant_id ON deals(tenant_id);

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  due_date    TIMESTAMPTZ,
  status      task_status NOT NULL DEFAULT 'PENDING',
  contact_id  UUID REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id     UUID REFERENCES deals(id) ON DELETE SET NULL,
  tenant_id   UUID,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);

-- ============================================================
-- GROUPS
-- ============================================================
CREATE TABLE IF NOT EXISTS groups (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  manager_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id    UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT,
  type        TEXT NOT NULL DEFAULT 'info',
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  link        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- Enable RLS (NestJS uses service role key, so RLS doesn't block it.
-- RLS is provided as a safety net for direct DB access.)

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Service role bypass (NestJS backend uses service_role key — full access)
CREATE POLICY "service_role_bypass" ON contacts
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass" ON deals
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass" ON tasks
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass" ON interactions
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_bypass" ON companies
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_interactions_updated_at BEFORE UPDATE ON interactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
