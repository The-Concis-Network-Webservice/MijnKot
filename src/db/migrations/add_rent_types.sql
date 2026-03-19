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
