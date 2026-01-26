# Mijn-Kot (Next.js + Supabase + R2)

## Project Architecture
- **Next.js App Router** for server-rendered pages and API routes.
- **Supabase** as database + auth; public pages read data via RLS and admin writes via authenticated users.
- **Cloudflare R2** for image storage using presigned uploads via `/api/r2/presign`.
- **Custom CMS** under `/admin` with RBAC, multi-vestiging context, audit logs, and media library.

## Folder Structure
```
app/
  admin/               # Custom CMS + protected admin routes
  api/                 # API routes (R2 presign)
  contact/             # Contact page
  faq/                 # FAQ page
  koten/               # Kot detail
  vestigingen/         # Vestigingen overview + detail
components/            # UI components
lib/                   # Supabase + R2 + queries
supabase/              # SQL schema + RLS policies
types/                 # Shared types
```

## Environment Variables
Create `.env.local` (or `.env`) with:
```
DB_PATH=./db/local.sqlite
AUTH_SECRET=your_jwt_secret
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=...
R2_PUBLIC_BASE_URL=...
```

## Local SQL Setup
1. Create the SQLite database in `db/local.sqlite`.
2. Run `db/schema.sqlite.sql`.
3. Insert at least one admin user in `users` with a hashed password.
   - You can generate a hash using `bcryptjs` in a Node REPL:
     ```
     node -e "console.log(require('bcryptjs').hashSync('password', 10))"
     ```
4. Assign users to vestigingen via `user_vestigingen`.

### Seed test data
```
node ./scripts/seed.js
```
Optional env:
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Cloudflare R2 Setup
1. Create an R2 bucket.
2. Generate access keys.
3. Set `R2_PUBLIC_BASE_URL` to your bucket's public URL (or custom domain).

## Image Upload Flow
- Admin selects image(s) in the CMS.
- Frontend requests a presigned URL from `/api/r2/presign`.
- Image is uploaded directly to R2 using the presigned URL.
- Public URL is stored in Supabase `media_assets`, then linked in `kot_photos`.

## CMS Workflow
- **Draft → Published**: set `status` on kot, use `scheduled_publish_at` for future releases.
- **Archive**: soft delete by setting `status = archived` and `archived_at`.
- **Availability history**: tracked automatically on availability changes.

## Migration Notes
- This version removes Supabase and uses local PostgreSQL.
- Run `db/schema.sql` and migrate data into the new tables.
- Existing `kot_photos.image_url` remains valid; optionally link to `media_assets`.

## Local Development
```
npm install
npm run dev
```

Visit:
- Public site: `http://localhost:3000`
- Admin CMS: `http://localhost:3000/admin`

