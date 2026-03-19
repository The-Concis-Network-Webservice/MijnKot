
create table if not exists users (
  id text primary key default (lower(hex(randomblob(16)))),
  email text unique not null,
  full_name text,
  password_hash text not null,
  role text not null check (role in ('super_admin','admin','editor','viewer')) default 'viewer',
  created_at text not null default (datetime('now'))
);

create table if not exists vestigingen (
  id text primary key default (lower(hex(randomblob(16)))),
  name text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  description text not null,
  description_en text,
  image_url text, /* Added logic for photo */
  archived_at text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create table if not exists user_vestigingen (
  id text primary key default (lower(hex(randomblob(16)))),
  user_id text not null references users(id) on delete cascade,
  vestiging_id text not null references vestigingen(id) on delete cascade,
  created_at text not null default (datetime('now')),
  unique (user_id, vestiging_id)
);

create table if not exists koten (
  id text primary key default (lower(hex(randomblob(16)))),
  vestiging_id text not null references vestigingen(id) on delete cascade,
  title text not null,
  title_en text,
  description text not null,
  description_en text,
  description_raw text,
  description_polished text,
  price real not null,
  availability_status text not null default 'available',
  status text not null check (status in ('draft','scheduled','published','archived')) default 'draft',
  is_highlighted boolean default false,
  scheduled_publish_at text,
  published_at text,
  archived_at text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create table if not exists media_assets (
  id text primary key default (lower(hex(randomblob(16)))),
  r2_key text not null,
  public_url text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes integer not null,
  width integer,
  height integer,
  created_by text references users(id) on delete set null,
  created_at text not null default (datetime('now'))
);

create table if not exists kot_photos (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete cascade,
  image_url text not null,
  order_index integer not null default 0,
  media_asset_id text references media_assets(id) on delete set null
);

create table if not exists site_settings (
  id text primary key default (lower(hex(randomblob(16)))),
  hero_title text not null,
  hero_title_en text,
  hero_subtitle text not null,
  hero_subtitle_en text,
  hero_cta_label text not null,
  hero_cta_label_en text,
  hero_cta_href text not null,
  contact_email text not null,
  contact_phone text not null,
  contact_address text not null
);

create table if not exists faq_items (
  id text primary key default (lower(hex(randomblob(16)))),
  question text not null,
  question_en text,
  answer text not null,
  answer_en text,
  category text not null,
  order_index integer not null default 0
);

create table if not exists availability_history (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete cascade,
  old_status text not null,
  new_status text not null,
  changed_by text references users(id) on delete set null,
  changed_at text not null default (datetime('now'))
);

create table if not exists audit_logs (
  id text primary key default (lower(hex(randomblob(16)))),
  actor_id text references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  changes text,
  created_at text not null default (datetime('now'))
);

create trigger if not exists set_vestigingen_updated_at
before update on vestigingen
for each row
begin
  update vestigingen set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists set_koten_updated_at
before update on koten
for each row
begin
  update koten set updated_at = datetime('now') where id = old.id;
end;

create index if not exists idx_koten_vestiging_id on koten(vestiging_id);
create index if not exists idx_kot_photos_kot_id on kot_photos(kot_id);
create index if not exists idx_kot_photos_media_asset_id on kot_photos(media_asset_id);
create index if not exists idx_user_vestigingen_user_id on user_vestigingen(user_id);
create index if not exists idx_user_vestigingen_vestiging_id on user_vestigingen(vestiging_id);
create index if not exists idx_availability_history_kot_id on availability_history(kot_id);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);

create table if not exists leads (
  id text primary key default (lower(hex(randomblob(16)))),
  email text not null,
  name text,
  source text default 'modal',
  created_at text not null default (datetime('now'))
);

create table if not exists contract_templates (
  id text primary key default (lower(hex(randomblob(16)))),
  name text not null,
  content text not null,
  is_default boolean default false,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create table if not exists contracts (
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

create trigger if not exists set_contract_templates_updated_at
before update on contract_templates
for each row
begin
  update contract_templates set updated_at = datetime('now') where id = old.id;
end;

create trigger if not exists set_contracts_updated_at
before update on contracts
for each row
begin
  update contracts set updated_at = datetime('now') where id = old.id;
end;

create index if not exists idx_contracts_kot_id on contracts(kot_id);
create index if not exists idx_contracts_token on contracts(token);

-- Building floor plan tables
create table if not exists building_floors (
  id text primary key default (lower(hex(randomblob(16)))),
  vestiging_id text not null references vestigingen(id) on delete cascade,
  floor_name text not null,
  level integer not null default 0,
  order_index integer not null default 0,
  created_at text not null default (datetime('now'))
);

create table if not exists building_rooms (
  id text primary key default (lower(hex(randomblob(16)))),
  floor_id text not null references building_floors(id) on delete cascade,
  kot_id text references koten(id) on delete set null,
  room_label text not null,
  location text,
  size_m2 real,
  pos_x real not null default 0,
  pos_y real not null default 0,
  width real not null default 100,
  height real not null default 65,
  availability_status text not null default 'available',
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create trigger if not exists set_building_rooms_updated_at
before update on building_rooms
for each row
begin
  update building_rooms set updated_at = datetime('now') where id = old.id;
end;

create index if not exists idx_building_floors_vestiging on building_floors(vestiging_id);
create index if not exists idx_building_rooms_floor on building_rooms(floor_id);
create index if not exists idx_building_rooms_kot on building_rooms(kot_id);

-- Rent types (huurcategorieën)
create table if not exists rent_types (
  id text primary key default (lower(hex(randomblob(16)))),
  name text not null,
  name_en text,
  slug text not null unique,
  order_index integer not null default 0,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create trigger if not exists set_rent_types_updated_at
before update on rent_types
for each row
begin
  update rent_types set updated_at = datetime('now') where id = old.id;
end;
