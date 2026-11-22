# Nawa Factory ERP

Live: https://app.navinus.id (Hostinger, auto-deploy dari branch `main`). Cadangan: https://sahalfirdaus.github.io/nawa-erp/

## Cara mengubah aplikasi
1. Edit **`src/Main.dc.html`** (satu-satunya sumber: template `<x-dc>` + `class Component` di `<script type="text/x-dc">`).
2. Jalankan `python3 build.py` → menghasilkan `app.js` dan `index.html` (jangan edit dua file itu manual).
3. Commit + push ke `main`. Hostinger otomatis deploy dalam ±30 detik.

## Catatan
- `src/runtime.js`: mini runtime DC (binding `{{ }}`, `<sc-if>`, `<sc-for>`, `setState`).
- Data tersimpan di Supabase (tabel `app_state`, `allowed_emails`, `archive_data`). Jangan commit data/arsip ke repo (repo publik).
- Login wajib; hanya email di `allowed_emails` yang bisa masuk.
- Desain yang sama juga ada sebagai artifact Design di claude.ai (project/Main.dc.html) — samakan bila mengubah di salah satu tempat.
