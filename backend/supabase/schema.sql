-- popin. schema for Supabase (Postgres)
-- Run this in Supabase Dashboard → SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text not null unique,
  password text,
  google_id text unique,
  role text not null default 'user' check (role in ('admin', 'user')),
  password_reset_token text,
  password_reset_expires timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  date date not null,
  time text not null,
  location text not null,
  organizer_id uuid not null references public.users(id) on delete cascade,
  max_participants integer not null,
  category text not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'ongoing', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_participants (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index if not exists events_date_idx on public.events (date);
create index if not exists events_category_idx on public.events (category);
create index if not exists events_name_idx on public.events (name);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.users to postgres, anon, authenticated, service_role;
grant all on table public.events to postgres, anon, authenticated, service_role;
grant all on table public.event_participants to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
