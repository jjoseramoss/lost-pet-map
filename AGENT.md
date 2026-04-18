# Lost Pet Map (Hackathon MVP)

## One-liner
A map-first web app for the RGV that centralizes lost pets, found/stray sightings, and shelter intakes, with AI photo similarity to suggest matches.

## MVP goals (24h)
- Anyone can view the map and posts (no login)
- Anyone can anonymously submit a **Lost** or **Found** report
- New posts appear live on the map via realtime updates
- After posting, show a **Possible matches** list (photo similarity + duplicate detection)
- Seed initial data by scraping 1–2 local shelter pages and importing into the database

## Tech stack (locked)
- Frontend: `Next.js` (App Router) + `TypeScript` + `TailwindCSS`
- Map: `Mapbox GL` via `react-map-gl`
- Backend/API: `Next.js` Route Handlers
- Database: `Supabase Postgres`
- Realtime: `Supabase Realtime` (listen to inserts/updates on posts)
- Photo storage: `Supabase Storage` (public bucket for MVP)
- AI matching: image embedding + cosine similarity (MVP: compute in API; upgrade later to pgvector)
- Scraping/import: a script (Node or Python) that upserts into Supabase

## Current repo status
- Scaffolded Next.js app in this folder
- Fullscreen Mapbox map with demo pins once `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- Intro overlay blocks interaction until user clicks Continue
- Responsive navigation overlay (bottom bar on mobile, vertical rail on desktop)
- Map style uses Mapbox Standard with basemap config (night preset + custom colors)
- Initial map view attempts to center from browser geolocation (falls back to default)

Key files:
- `src/app/page.tsx` layout + map page
- `src/components/map-shell.tsx` composition + geolocation + intro/nav state
- `src/components/map-view.tsx` Mapbox map + Supabase pins + popup
- `src/components/intro-overlay.tsx` intro UI (title/description/continue)
- `src/components/nav-bar.tsx` responsive nav overlay
- `.env.example` env var template
- `next.config.ts` disables Next.js dev indicator UI

## Environment variables
Put these in `.env.local` (copy from `.env.example`):
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-side only (later):
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Data model (MVP)
Single table: `pet_posts`
- `id` uuid
- `post_type` enum/text: `lost | found | shelter`
- `lat` double, `lng` double
- `description` text
- `contact_name` text, `contact_phone` text nullable, `contact_email` text nullable
- `photo_path` text
- `source` text: `user | scrape`
- `source_url` text nullable
- `created_at` timestamptz

Schema SQL is in `supabase.sql`.

## Supabase policies (MVP)
- Public `SELECT` on `pet_posts`
- Public `INSERT` on `pet_posts`
- Storage bucket set to public (MVP only)

## Supabase setup (what exists now)
- Table: `public.pet_posts` created via `supabase.sql`
- Storage bucket: `pet-photos` (public)
- Demo images uploaded under `pet-photos/demo/*.jpg`
- Demo rows inserted with `photo_path` like `demo/luna.jpg`
- Realtime enabled for `public.pet_posts` (table is in `supabase_realtime` publication)

## Backend integration (implemented)
The map is already connected to Supabase.

Implemented modules:
- `src/lib/env.ts` env access + required key checks
- `src/lib/supabase/browser.ts` Supabase browser client factory
- `src/lib/posts/types.ts` `PetPost` type matching `public.pet_posts`
- `src/lib/posts/queries.ts`
  - `listPosts()` fetches posts from `pet_posts`
  - `subscribeToPostChanges()` subscribes to realtime `INSERT/UPDATE/DELETE`
- `src/lib/storage/public-url.ts` helper to build public Storage URLs

UI behavior:
- Pins load from `pet_posts` (filtered to `status='active'`)
- Pins update live via realtime subscription
- Pin avatar uses Storage image URL from bucket `pet-photos` + `photo_path`

Quick verification query:

```sql
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
order by schemaname, tablename;
```

## Pages / UX
- `/` Map view
  - Pins for lost/found/shelter
  - Click pin → details (photo, description, contact)
  - Filters (type/species/date/radius) if time
- `/report` Create post
  - Choose lost/found, place pin, upload photo, add contact
  - On success → show matches
- `/matches/:id` Match results
  - Top-N similar posts, link each back to map

## 24h build order (suggested)
1) Supabase: table + RLS + Storage bucket
2) Map reads from Supabase (instead of demo pins)
3) Realtime subscription updates pins live
4) Report form UI + submit flow: upload → insert row
5) Matching endpoint: embedding + similarity
6) Scraper/import script for shelter seed data

## Notes for agents
- There is an `AGENTS.md` file with Next.js-specific warnings; follow it.
- Keep scope tight: working map + posting + seed data beats extra features.
