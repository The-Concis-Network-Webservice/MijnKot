alter table vestigingen enable row level security;
alter table koten enable row level security;
alter table kot_photos enable row level security;
alter table site_settings enable row level security;
alter table faq_items enable row level security;
alter table profiles enable row level security;
alter table user_vestigingen enable row level security;
alter table media_assets enable row level security;
alter table availability_history enable row level security;
alter table audit_logs enable row level security;

create or replace function app_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable;

create or replace function is_super_admin()
returns boolean as $$
  select app_role() = 'super_admin';
$$ language sql stable;

create or replace function has_vestiging_access(vestiging uuid)
returns boolean as $$
  select is_super_admin()
  or exists (
    select 1 from user_vestigingen
    where user_id = auth.uid() and vestiging_id = vestiging
  );
$$ language sql stable;

create or replace function can_manage_vestiging()
returns boolean as $$
  select app_role() in ('super_admin', 'admin');
$$ language sql stable;

create or replace function can_edit_content()
returns boolean as $$
  select app_role() in ('super_admin', 'admin', 'editor');
$$ language sql stable;

-- Public read access for published content
create policy "public read vestigingen"
on vestigingen for select
using (archived_at is null);

create policy "public read koten"
on koten for select
using (status = 'published' and archived_at is null);

create policy "public read kot photos"
on kot_photos for select
using (
  exists (
    select 1 from koten
    where koten.id = kot_photos.kot_id
    and koten.status = 'published'
    and koten.archived_at is null
  )
);

create policy "public read site settings"
on site_settings for select
using (true);

create policy "public read faq items"
on faq_items for select
using (true);

-- Profiles
create policy "profile read own"
on profiles for select
using (auth.uid() = id);

create policy "profile update own"
on profiles for update
using (auth.uid() = id);

create policy "profile insert own"
on profiles for insert
with check (auth.uid() = id);

create policy "super admin read profiles"
on profiles for select
using (is_super_admin());

create policy "super admin update profiles"
on profiles for update
using (is_super_admin());

-- Vestiging assignments
create policy "super admin manage assignments"
on user_vestigingen for all
using (is_super_admin());

create policy "read own assignments"
on user_vestigingen for select
using (auth.uid() = user_id or is_super_admin());

-- CMS reads scoped by vestiging assignments
create policy "cms read vestigingen"
on vestigingen for select
using (has_vestiging_access(id));

create policy "cms read koten"
on koten for select
using (has_vestiging_access(vestiging_id));

create policy "cms read kot photos"
on kot_photos for select
using (
  exists (
    select 1 from koten
    where koten.id = kot_photos.kot_id
    and has_vestiging_access(koten.vestiging_id)
  )
);

create policy "cms read media assets"
on media_assets for select
using (
  is_super_admin()
  or created_by = auth.uid()
  or exists (
    select 1
    from kot_photos
    join koten on koten.id = kot_photos.kot_id
    where kot_photos.media_asset_id = media_assets.id
    and has_vestiging_access(koten.vestiging_id)
  )
);

create policy "cms read availability history"
on availability_history for select
using (
  exists (
    select 1 from koten
    where koten.id = availability_history.kot_id
    and has_vestiging_access(koten.vestiging_id)
  )
);

create policy "insert availability history"
on availability_history for insert
with check (auth.role() = 'authenticated');

-- CMS writes
create policy "admin create vestigingen"
on vestigingen for insert
with check (can_manage_vestiging());

create policy "admin update vestigingen"
on vestigingen for update
using (can_manage_vestiging());

create policy "admin delete vestigingen"
on vestigingen for delete
using (can_manage_vestiging());

create policy "editor create koten"
on koten for insert
with check (can_edit_content() and has_vestiging_access(vestiging_id));

create policy "editor update koten"
on koten for update
using (can_edit_content() and has_vestiging_access(vestiging_id));

create policy "editor delete koten"
on koten for delete
using (app_role() in ('super_admin', 'admin'));

create policy "editor write kot photos"
on kot_photos for insert
with check (
  can_edit_content()
  and exists (
    select 1 from koten where koten.id = kot_photos.kot_id
    and has_vestiging_access(koten.vestiging_id)
  )
);

create policy "editor update kot photos"
on kot_photos for update
using (
  can_edit_content()
  and exists (
    select 1 from koten where koten.id = kot_photos.kot_id
    and has_vestiging_access(koten.vestiging_id)
  )
);

create policy "editor delete kot photos"
on kot_photos for delete
using (can_edit_content());

create policy "editor write media assets"
on media_assets for insert
with check (can_edit_content() and created_by = auth.uid());

create policy "editor update media assets"
on media_assets for update
using (can_edit_content() and created_by = auth.uid());

create policy "admin delete media assets"
on media_assets for delete
using (app_role() in ('super_admin', 'admin'));

create policy "editor write faq"
on faq_items for insert
with check (can_edit_content());

create policy "editor update faq"
on faq_items for update
using (can_edit_content());

create policy "editor delete faq"
on faq_items for delete
using (app_role() in ('super_admin', 'admin'));

create policy "admin insert site settings"
on site_settings for insert
with check (can_manage_vestiging());

create policy "admin update site settings"
on site_settings for update
using (can_manage_vestiging());

-- Audit logs
create policy "insert audit logs"
on audit_logs for insert
with check (auth.role() = 'authenticated');

create policy "read audit logs"
on audit_logs for select
using (app_role() in ('super_admin', 'admin'));

