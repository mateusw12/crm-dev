-- Add CNPJ and CEP columns to companies table
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS cnpj TEXT,
  ADD COLUMN IF NOT EXISTS cep  TEXT;

-- Unique CNPJ per tenant (nullable unique)
CREATE UNIQUE INDEX IF NOT EXISTS companies_cnpj_tenant_unique
  ON companies (cnpj, tenant_id)
  WHERE cnpj IS NOT NULL;
