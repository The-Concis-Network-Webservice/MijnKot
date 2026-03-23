create table if not exists floor_plan_tokens (
  id text primary key default (lower(hex(randomblob(16)))),
  vestiging_id text not null references vestigingen(id) on delete cascade,
  token text not null unique,
  expires_at text not null,
  created_at text not null default (datetime('now'))
);

create index if not exists idx_floor_plan_tokens_vestiging on floor_plan_tokens(vestiging_id);
create index if not exists idx_floor_plan_tokens_token on floor_plan_tokens(token);
