create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('super_admin', 'admin', 'editor', 'viewer');
  end if;
  if not exists (select 1 from pg_type where typname = 'kot_status') then
    create type kot_status as enum ('draft', 'scheduled', 'published', 'archived');
  end if;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  password_hash text not null,
  role user_role not null default 'viewer',
  created_at timestamptz not null default now()
);

create table if not exists vestigingen (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  description text not null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_vestigingen (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  vestiging_id uuid not null references vestigingen(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, vestiging_id)
);

create table if not exists koten (
  id uuid primary key default gen_random_uuid(),
  vestiging_id uuid not null references vestigingen(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10, 2) not null,
  availability_status text not null default 'available',
  status kot_status not null default 'draft',
  scheduled_publish_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  r2_key text not null,
  public_url text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists kot_photos (
  id uuid primary key default gen_random_uuid(),
  kot_id uuid not null references koten(id) on delete cascade,
  image_url text not null,
  order_index integer not null default 0,
  media_asset_id uuid references media_assets(id) on delete set null
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_title text not null,
  hero_subtitle text not null,
  hero_cta_label text not null,
  hero_cta_href text not null,
  contact_email text not null,
  contact_phone text not null,
  contact_address text not null
);

create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null,
  order_index integer not null default 0
);

create table if not exists availability_history (
  id uuid primary key default gen_random_uuid(),
  kot_id uuid not null references koten(id) on delete cascade,
  old_status text not null,
  new_status text not null,
  changed_by uuid references users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  changes jsonb,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_vestigingen_updated_at
before update on vestigingen
for each row execute function set_updated_at();

create trigger set_koten_updated_at
before update on koten
for each row execute function set_updated_at();

create index if not exists idx_koten_vestiging_id on koten(vestiging_id);
create index if not exists idx_kot_photos_kot_id on kot_photos(kot_id);
create index if not exists idx_kot_photos_media_asset_id on kot_photos(media_asset_id);
create index if not exists idx_user_vestigingen_user_id on user_vestigingen(user_id);
create index if not exists idx_user_vestigingen_vestiging_id on user_vestigingen(vestiging_id);
create index if not exists idx_availability_history_kot_id on availability_history(kot_id);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);

