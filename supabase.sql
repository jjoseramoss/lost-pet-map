-- Lost Pet Map (MVP) - Supabase SQL

-- 1) Table
create table if not exists public.pet_posts (
  id uuid primary key default gen_random_uuid(),
  post_type text not null check (post_type in ('lost','found','shelter')),
  species text not null default 'dog' check (species in ('dog','cat','other')),
  pet_name text,
  breed text,
  color text,
  description text,
  event_time timestamptz,
  lat double precision not null,
  lng double precision not null,
  contact_name text,
  contact_phone text,
  contact_email text,
  photo_path text not null,
  source text not null default 'user' check (source in ('user','scrape')),
  source_url text,
  status text not null default 'active' check (status in ('active','reunited','expired')),
  created_at timestamptz not null default now()
);

-- 2) Useful indexes for map + filtering
create index if not exists pet_posts_post_type_idx on public.pet_posts (post_type);
create index if not exists pet_posts_species_idx on public.pet_posts (species);
create index if not exists pet_posts_status_idx on public.pet_posts (status);
create index if not exists pet_posts_created_at_idx on public.pet_posts (created_at desc);
create index if not exists pet_posts_event_time_idx on public.pet_posts (event_time desc);

-- 3) Realtime
alter publication supabase_realtime add table public.pet_posts;

-- 4) RLS policies (anonymous MVP)
alter table public.pet_posts enable row level security;

drop policy if exists "public read pet_posts" on public.pet_posts;
create policy "public read pet_posts"
  on public.pet_posts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public insert pet_posts" on public.pet_posts;
create policy "public insert pet_posts"
  on public.pet_posts
  for insert
  to anon, authenticated
  with check (true);
