-- Migration: Add building floor plan tables
-- Run: wrangler d1 execute mijnkot --local --file=src/db/migrations/add_building_floor_plans.sql

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
