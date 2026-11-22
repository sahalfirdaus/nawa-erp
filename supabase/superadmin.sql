-- Peran Admin berganti nama menjadi Superadmin
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.allowed_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) and active and role in ('Admin', 'Superadmin'))
$$;
