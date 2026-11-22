-- Penyimpanan background Dashboard (bucket publik, hanya pemilik yang boleh unggah/ubah/hapus)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dashboard-bg', 'dashboard-bg', true, 8388608, array['image/webp','image/jpeg','image/png'])
on conflict (id) do update set public = true;
create policy "dbg read" on storage.objects for select using (bucket_id = 'dashboard-bg');
create policy "dbg insert owner" on storage.objects for insert to authenticated with check (bucket_id = 'dashboard-bg' and public.is_owner());
create policy "dbg update owner" on storage.objects for update to authenticated using (bucket_id = 'dashboard-bg' and public.is_owner());
create policy "dbg delete owner" on storage.objects for delete to authenticated using (bucket_id = 'dashboard-bg' and public.is_owner());
