-- Drop the old contracts table
DROP TABLE IF EXISTS contracts;

-- Recreate with nullable tenant fields
CREATE TABLE contracts (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete restrict,
  template_id text references contract_templates(id),
  status text not null check (status in ('draft','pending_signature','signed','voided')) default 'draft',
  tenant_first_name text,
  tenant_last_name text,
  tenant_email text,
  contract_html text not null,
  token text unique not null,
  signature_data text,
  signed_pdf_url text,
  signed_at text,
  signer_ip text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

-- Recreate triggers
DROP TRIGGER IF EXISTS set_contracts_updated_at;

CREATE TRIGGER set_contracts_updated_at
before update on contracts
for each row
begin
  update contracts set updated_at = datetime('now') where id = old.id;
end;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_contracts_kot_id on contracts(kot_id);
CREATE INDEX IF NOT EXISTS idx_contracts_token on contracts(token);
