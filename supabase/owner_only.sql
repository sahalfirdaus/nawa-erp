-- Hanya pemilik yang boleh mengelola pengguna & permintaan akses
create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select lower(coalesce(auth.jwt()->>'email', '')) = 'firdaussahal@gmail.com'
$$;
revoke execute on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

drop policy if exists "allowed insert" on public.allowed_emails;
drop policy if exists "allowed update" on public.allowed_emails;
drop policy if exists "allowed delete" on public.allowed_emails;
create policy "allowed insert" on public.allowed_emails for insert to authenticated with check (public.is_owner());
create policy "allowed update" on public.allowed_emails for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "allowed delete" on public.allowed_emails for delete to authenticated using (public.is_owner());

drop policy if exists "req select own or admin" on public.access_requests;
drop policy if exists "req update admin" on public.access_requests;
drop policy if exists "req delete admin" on public.access_requests;
create policy "req select own or admin" on public.access_requests for select to authenticated using (user_id = auth.uid() or public.is_owner());
create policy "req update admin" on public.access_requests for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "req delete admin" on public.access_requests for delete to authenticated using (public.is_owner());

drop policy if exists "archive insert" on public.archive_data;
drop policy if exists "archive update" on public.archive_data;
create policy "archive insert" on public.archive_data for insert to authenticated with check (public.is_owner());
create policy "archive update" on public.archive_data for update to authenticated using (public.is_owner()) with check (public.is_owner());
