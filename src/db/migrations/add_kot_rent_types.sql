create table if not exists kot_rent_types (
  id text primary key default (lower(hex(randomblob(16)))),
  kot_id text not null references koten(id) on delete cascade,
  rent_type_id text not null references rent_types(id) on delete cascade,
  unique (kot_id, rent_type_id)
);

create index if not exists idx_kot_rent_types_kot on kot_rent_types(kot_id);
create index if not exists idx_kot_rent_types_rent_type on kot_rent_types(rent_type_id);
