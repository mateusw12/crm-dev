-- ============================================================
-- Migration 003: Upload fields and attachments table
-- ============================================================

-- Avatar URL for contacts
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Logo URL for companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Attachments table (deals / interactions)
CREATE TABLE IF NOT EXISTS attachments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type  TEXT NOT NULL,   -- 'deal' | 'interaction'
  entity_id    UUID NOT NULL,
  url          TEXT NOT NULL,
  path         TEXT NOT NULL,
  filename     TEXT NOT NULL,
  content_type TEXT,
  size         INTEGER,
  uploaded_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);
