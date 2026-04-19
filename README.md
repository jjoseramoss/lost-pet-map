# Pet Scout (Lost Pet Map)

Map-first web app for posting and finding missing pets. Pet Scout lets the community drop “Lost” and “Found” pins (with photos + details) so sightings and reports are visible on a shared map in real time.

## Hackathon Purpose

When a pet goes missing, the first hours matter, but info usually gets scattered across group chats, social posts, and flyers. We built Pet Scout to be a lightweight, map-based “single place to look” where anyone can quickly:

- Report a missing pet or a found/loose pet with a photo and location
- See recent reports around them at a glance
- Filter posts to narrow down what matters (lost vs found, species, etc.)

The goal is to help neighbors coordinate faster, reduce duplicated posts, and improve the odds of a safe reunion.

## Team

- Jose Ramos
- Hector Corpuz

## Core Features

- Map-first UI with pins for pet reports
- Create a report (photo + description + optional contact info)
- Location support (use device location or pick a point on the map)
- Filters panel (post type/species and derived options like breed/color)
- Realtime updates via Supabase Realtime (new posts appear without refresh)

## Tech Stack

- Frontend: Next.js (App Router) + React + TypeScript
- Styling: Tailwind CSS
- Maps: Mapbox GL via `react-map-gl`
- Backend-as-a-Service: Supabase
  - Postgres table: `public.pet_posts`
  - Storage bucket: `pet-photos` (public)
  - Realtime: `supabase_realtime` publication for `pet_posts`
- Optional AI assist: server route that can infer basic pet attributes (species/breed/color) from an uploaded photo using an OpenAI-compatible API

## Project Structure (high level)

- `src/app/page.tsx`: full-screen map entry point
- `src/components/map-shell.tsx`: app orchestrator (intro overlay, nav, panels, location picking)
- `src/components/map-view.tsx`: Mapbox map + pin rendering + filtering
- `src/components/report-panel.tsx`: report form (uploads photo to Storage, inserts row into `pet_posts`)
- `src/lib/posts/*`: types and Supabase queries (including realtime)
- `src/lib/supabase/browser.ts`: Supabase browser client
- `src/app/api/ai/pet-attrs/route.ts`: optional AI endpoint
- `supabase.sql`: reference schema + basic RLS policies for the MVP

## Environment Variables

Create `.env.local` (copy from `.env.example`) and set:

- `NEXT_PUBLIC_MAPBOX_TOKEN` (required for the map)
- `NEXT_PUBLIC_SUPABASE_URL` (required for Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required for Supabase)

Optional (only if you want AI attribute inference enabled):

- `OPENAI_API_KEY`
- `OPENAI_MODEL_PET_ATTRS` (default: `gpt-5.2`)
- `OPENAI_BASE_URL` (defaults to `https://api.openai.com/v1`)

## Supabase Setup

1. Create a Supabase project
2. Run `supabase.sql` in the SQL editor
3. Create a public Storage bucket named `pet-photos`
4. Ensure policies allow anonymous MVP usage:
   - `public.pet_posts`: allow `select` + `insert` for `anon`
   - Storage: allow uploads to `pet-photos` for `anon` (Supabase UI → Storage → Policies)

The app expects each post row to include a `photo_path` in the `pet-photos` bucket.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes / Hackathon Scope

- This project is optimized for speed-to-demo: anonymous posting, minimal friction.
- Production hardening ideas (not implemented here): authentication, stronger moderation, rate limiting, expiration workflows, and private contact-handling.
