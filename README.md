# LaunchDesk

A multi-business website management platform for agencies. Clients manage business information, products/services, offers, branding, page sections and a visual page builder; agency admins manage client accounts, designs, domains and publishing.

## Stack

- Next.js 16 (App Router, TypeScript), React 19
- Prisma 7 + PostgreSQL
- Supabase PostgreSQL for Phase 2 hosted development/production infrastructure
- bcrypt password hashing + signed JWT session cookie
- Tailwind CSS + Lucide icons
- Zod-backed Visual Builder validation

## Phase 2: Supabase setup

LaunchDesk now uses PostgreSQL rather than SQLite. Create a Supabase project and obtain the database connection strings from **Dashboard → Connect**. Supabase recommends a direct connection for migrations and a pooler connection for application traffic; the exact choice depends on the deployment runtime.

Set a `.env` file locally (never commit it):

```env
# Runtime/application connection. A Supavisor session-pooler URL is a good
# choice for an always-on Node backend; use the direct URL if your network
# supports IPv6 and you are running locally.
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Prisma CLI/migrations/admin tooling. Direct URL is preferred here.
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

SESSION_SECRET=""

# Development seed only. Never set these in production.
SEED_CLIENT_PASSWORD=""
SEED_ADMIN_PASSWORD=""
```

The Supabase publishable key is **not needed yet** because LaunchDesk talks to Postgres through Prisma on the server. Do not expose the database password or service-role credentials to the browser.

## Install and migrate

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

Then seed development data if needed:

```bash
npm run db:seed
```

Finally:

```bash
npm run dev
```

Open `http://localhost:3000`.

### First Supabase migration

Phase 2 contains a fresh PostgreSQL baseline migration because the Supabase database is new. The previous SQLite migration chain is retained under `prisma/migrations-sqlite-archive/` for historical/reference purposes and is not applied by Prisma.

## Production environment

At deployment time configure these secrets in the hosting provider rather than committing `.env`:

```env
DATABASE_URL="<runtime Supabase PostgreSQL connection>"
DIRECT_URL="<direct Supabase PostgreSQL connection>"
SESSION_SECRET="<fresh random secret>"
```

Generate a session secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

Do not run the development seed against production.

## Business localization

Every website stores its own country, currency, locale and phone country code. Prices use `Intl.NumberFormat`, and call/WhatsApp links use the business phone configuration. Date/time displays use the business locale.

## Multi-business support

The dashboard adapts terminology for retail/fashion, restaurants, healthcare/pharmacy, gyms/salons, education, hospitality, professional services, photography, travel, automobile/repair and home services/construction.

## Production safeguards

- Tenant-scoped client access
- Agency/client role separation
- Cryptographically secure temporary password generation
- Persistent database-backed rate limiting
- Server-side product/offer price validation
- Visual Builder payload validation and safe JSON parsing
- Published version snapshots separate draft edits from the live site
- Mobile navigation with an accessible drawer
- Theme-aware dashboard and Builder chrome
- Professional Lucide icons instead of UI emojis
- Security response headers

## Phase 2 roadmap

- [x] Move Prisma datasource to PostgreSQL
- [x] Add PostgreSQL driver adapter
- [x] Add a fresh Supabase baseline migration
- [x] Separate runtime and migration connection variables
- [ ] Move local image uploads to Supabase Storage
- [ ] Configure production deployment secrets
- [ ] Deploy LaunchDesk
- [ ] Add email delivery and monitoring


## Supabase Storage

LaunchDesk stores uploaded website media in the `launchdesk-media` Supabase Storage bucket by default.

Required environment variables:

```env
SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
SUPABASE_SECRET_KEY=""
SUPABASE_STORAGE_BUCKET="launchdesk-media"
UPLOAD_STORAGE="supabase"
```

`SUPABASE_SECRET_KEY` is server-only. Never expose it through a `NEXT_PUBLIC_*` variable, commit it to Git, or include it in a ZIP.

The bucket may be public for website image delivery, but uploads and deletes are performed only by the authenticated LaunchDesk server using the secret key. LaunchDesk validates image MIME type and file signatures before upload and limits images to 10 MB.

Set `UPLOAD_STORAGE=local` only when intentionally developing offline without Supabase Storage. Production must use Supabase Storage.
