# Supabase Setup — ARCI Bimbel

Dokumen ini menjelaskan setup Supabase untuk aplikasi Next.js ARCI Bimbel.

## Status saat ini

- Supabase client browser sudah tersedia di `src/lib/supabase/client.ts`.
- Supabase client server sudah tersedia di `src/lib/supabase/server.ts`.
- Session refresh sudah dipasang melalui `src/proxy.ts`.
- Schema database tersedia di `supabase/schema.sql`.
- Patch privilege API tersedia di `supabase/patches/0001-api-grants.sql`.
- Repository belum terhubung ke project Supabase cloud tertentu karena URL dan key belum tersedia.

## 1. Buat project Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Buat project baru, misalnya `arci-bimbel`.
3. Pilih region terdekat dengan pengguna utama.
4. Simpan password database di password manager.
5. Tunggu sampai database siap.

## 2. Jalankan database schema

1. Buka project Supabase.
2. Masuk ke **SQL Editor**.
3. Buat query baru.
4. Salin isi `supabase/schema.sql` ke SQL Editor.
5. Jalankan query.
6. Pastikan tabel berikut muncul di **Table Editor**: `profiles`, `branches`, `programs`, `leads`, `classes`, `students`, `parents`, `enrollments`, `attendance_sessions`, `attendance_records`, `invoices`, `payments`, `materials`, `announcements`, dan `audit_logs`.
7. Pastikan data sample cabang dan program muncul.

> Jalankan schema pada project baru. Untuk project yang sudah memiliki sebagian tabel, jangan menjalankannya berulang kali tanpa review karena sebagian `CREATE TYPE`, `CREATE TABLE`, seed, dan policy belum dibuat idempotent.

Jika `schema.sql` sudah pernah dijalankan, jalankan `supabase/patches/0001-api-grants.sql` secara terpisah. Patch ini memperbaiki privilege role API tanpa membuat ulang tabel.

## 3. Isi environment lokal

Salin `.env.example` menjadi `.env.local`, lalu isi dari **Project Settings → API**:

```bash
cp .env.example .env.local
```

Isi nilai berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Kode aplikasi masih memiliki fallback ke nama legacy berikut bila project Anda belum membuat key baru:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Catatan keamanan:

- `NEXT_PUBLIC_SUPABASE_URL` dan publishable/anon key boleh digunakan oleh browser karena akses tetap dibatasi RLS.
- `SUPABASE_SECRET_KEY` atau `SUPABASE_SERVICE_ROLE_KEY` adalah secret server-only. Jangan pernah menaruhnya di komponen client, `NEXT_PUBLIC_*`, Git, screenshot, atau log.
- `.env.local` sudah diabaikan oleh `.gitignore`.
- Jika service role key pernah ter-commit atau terbagi, segera rotate key dari Supabase Dashboard.

## 4. Konfigurasi Auth awal

Di Supabase Dashboard → **Authentication → URL Configuration**:

- Site URL lokal: `http://localhost:3000`.
- Redirect URL lokal: `http://localhost:3000/**` atau URL callback yang dipakai aplikasi.
- Tambahkan URL production nanti setelah domain Vercel tersedia.

Untuk tahap awal, gunakan email/password. Setelah alur login stabil, provider Google atau WhatsApp dapat ditambahkan.

## 5. Storage bucket

Buat bucket privat bernama `documents` untuk dokumen pendaftaran dan bukti pembayaran. Jangan membuat dokumen siswa menjadi public bucket.

Bucket public terpisah dapat digunakan untuk aset website yang memang boleh dilihat publik, misalnya gambar program atau banner.

Policy Storage harus membatasi:

- Staff berwenang dapat mengunggah dan memverifikasi dokumen.
- Orang tua hanya dapat melihat dokumen miliknya/anak yang terhubung.
- Siswa tidak dapat melihat dokumen keuangan atau dokumen wali yang tidak relevan.

## 6. Verifikasi lokal

Jalankan dari folder `app`:

```bash
pnpm lint
pnpm build
pnpm dev
```

Kemudian verifikasi:

1. Website publik dapat dibuka.
2. Halaman login tidak error ketika env valid.
3. Session tetap ada setelah refresh.
4. User baru membuat row `profiles` melalui trigger database.
5. Program publik dapat dibaca.
6. Lead dari form hanya dapat dibuat sesuai policy yang disetujui.
7. User tanpa role yang tepat tidak dapat membaca data dashboard.

## 7. Catatan sebelum production

- Review ulang semua policy RLS dengan data uji untuk role `super_admin`, `admin_akademik`, `admin_keuangan`, `tutor`, `parent`, dan `student`.
- Tambahkan policy eksplisit untuk `payments`, `materials`, `announcements`, `audit_logs`, `parents`, dan `student_parents` sebelum fitur-fitur tersebut diaktifkan.
- Ganti seed data dengan data bisnis yang benar atau pindahkan seed ke proses staging.
- Aktifkan backup dan tetapkan kebijakan retensi.
- Gunakan migration terurut untuk perubahan schema berikutnya; jangan mengedit database production secara manual tanpa histori.
- Jangan menguji RLS hanya dengan service role key karena key tersebut melewati RLS.

## 8. Informasi yang dibutuhkan untuk koneksi cloud

Setup repo dapat diselesaikan tanpa informasi tambahan. Untuk menghubungkan environment lokal ke project tertentu, diperlukan:

- Supabase project URL.
- Publishable/anon key.
- Keputusan apakah service role key diperlukan pada MVP.
- Nama bucket Storage yang disepakati.

Jangan kirim service role key melalui chat. Masukkan langsung ke `.env.local` di mesin development.
