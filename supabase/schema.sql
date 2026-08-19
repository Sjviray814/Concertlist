-- ConcertList database schema (Supabase / Postgres)
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).

-- ---------- profiles ----------
-- One row per authenticated user, keyed to Supabase's built-in auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)),
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- concerts ----------
create table if not exists public.concerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  artist text not null,
  venue text not null,
  date date not null,
  genre text not null default 'Other',
  score numeric(3,1) not null check (score >= 1 and score <= 10),
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists concerts_user_id_idx on public.concerts(user_id);
create index if not exists concerts_date_idx on public.concerts(date desc);

alter table public.concerts enable row level security;

-- Everyone can read every logged show (needed for public profiles / Compare / rankings-of-others later).
create policy "Concerts are viewable by everyone"
  on public.concerts for select
  using (true);

create policy "Users can insert their own concerts"
  on public.concerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own concerts"
  on public.concerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own concerts"
  on public.concerts for delete
  using (auth.uid() = user_id);

-- ---------- leaderboard ----------
-- Real (not mock) per-user aggregates for the Compare screen.
-- security_invoker means it respects the RLS policies of the querying user, not the view owner's.
create or replace view public.leaderboard
  with (security_invoker = true)
as
select
  p.id as user_id,
  p.username,
  p.display_name,
  count(c.id) as show_count,
  coalesce(round(avg(c.score), 1), 0) as avg_score
from public.profiles p
left join public.concerts c on c.user_id = p.id
group by p.id, p.username, p.display_name
order by show_count desc;

grant select on public.leaderboard to anon, authenticated;

