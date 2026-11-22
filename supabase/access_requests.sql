-- Permintaan akses (pendaftaran akun baru)
create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() unique,
  email text not null,
  name text not null,
  phone text,
  jabatan text,
  divisi text,
  note text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by text
);
alter table public.access_requests enable row level security;
drop policy if exists "req insert own" on public.access_requests;
drop policy if exists "req select own or admin" on public.access_requests;
drop policy if exists "req update admin" on public.access_requests;
drop policy if exists "req delete admin" on public.access_requests;
create policy "req insert own" on public.access_requests for insert to authenticated
  with check (user_id = auth.uid() and lower(email) = lower(auth.jwt()->>'email') and status = 'pending');
create policy "req select own or admin" on public.access_requests for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy "req update admin" on public.access_requests for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "req delete admin" on public.access_requests for delete to authenticated
  using (public.is_admin());
grant select, insert, update, delete on public.access_requests to authenticated;
alter publication supabase_realtime add table public.access_requests;
