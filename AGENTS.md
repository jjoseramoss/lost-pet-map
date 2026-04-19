<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Project quick map (Pet Scout)

### What this repo is
- Map-first Next.js app that shows `pet_posts` as pins on a Mapbox map.
- Users can submit a report (photo + details) that uploads to Supabase Storage and inserts into Supabase Postgres.

### Key UI components
- `src/app/page.tsx` full-screen map page.
- `src/components/map-shell.tsx` app orchestrator (intro overlay, nav, filters, panels, location picking).
- `src/components/map-view.tsx` Mapbox map + Supabase pin rendering + filtering.
- `src/components/intro-overlay.tsx` initial blocking overlay (Continue).
- `src/components/nav-bar.tsx` mobile bottom bar / desktop rail.
- `src/components/report-panel.tsx` report form + submit flow to Supabase.
- `src/components/about-panel.tsx` about content.
- `src/components/filters/filter-bar.tsx` filter UI.
- `src/components/pet-profile-panel.tsx` selected pin details.

### Supabase integration
- Browser client: `src/lib/supabase/browser.ts`
- Env helpers: `src/lib/env.ts`
- Posts: `src/lib/posts/types.ts`, `src/lib/posts/queries.ts` (list + realtime)
- Storage URL helper: `src/lib/storage/public-url.ts`

### Environment variables
Put these in `.env.local` (copy from `.env.example`):
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase resources expected
- Table: `public.pet_posts` (schema reference in `supabase.sql`)
- Storage bucket: `pet-photos` (public)
- RLS/policies must allow anon insert into `public.pet_posts` and uploads to `storage.objects` for `pet-photos`.

### Conventions
- Prefer existing patterns/utilities (`createSupabaseBrowserClient`, `getPublicStorageUrl`, `PetPost` types).
- Keep UI as overlays on the map; avoid introducing page navigations unless requested.
<!-- END:nextjs-agent-rules -->
