-- Run in Supabase SQL Editor after schema.sql

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on table public.users to postgres, anon, authenticated, service_role;
grant all on table public.events to postgres, anon, authenticated, service_role;
grant all on table public.event_participants to postgres, anon, authenticated, service_role;

grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
