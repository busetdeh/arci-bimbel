# Product Requirements Document (PRD)

## Website Publik dan Dashboard Operasional Lembaga Bimbingan Belajar

**Status:** Draft v1.0  
**Tanggal:** 19 November 2026  
**Nama default website:** ARCI Bimbel  
**Pemilik produk:** Lembaga Bimbingan Belajar  
**Target rilis:** MVP bertahap

---

## 1. Ringkasan produk

Produk ini terdiri dari dua bagian yang saling terhubung:

1. **Website publik** untuk memperkenalkan lembaga, program belajar, pengajar, lokasi, testimoni, artikel, dan mendorong calon siswa/orang tua melakukan konsultasi atau pendaftaran.
2. **Dashboard internal** untuk mengelola calon siswa, siswa, orang tua, program, kelas, jadwal, pembayaran, presensi, materi, komunikasi, dan laporan operasional.

Tujuan utamanya adalah mengubah proses yang biasanya tersebar di WhatsApp, spreadsheet, dan pencatatan manual menjadi alur digital yang lebih rapi, mudah dipantau, dan dapat diukur.

---

## 2. Latar belakang dan masalah

### Masalah bisnis

- Informasi program, biaya, jadwal, dan lokasi belum tersaji konsisten untuk calon siswa.
- Lead dari berbagai kanal sulit ditindaklanjuti secara terstruktur.
- Pendaftaran dan pengumpulan dokumen masih memerlukan komunikasi manual.
- Pengelola kesulitan melihat kapasitas kelas, status pembayaran, dan kehadiran secara real-time.
- Guru membutuhkan akses yang lebih sederhana untuk melihat jadwal, daftar siswa, materi, dan presensi.
- Orang tua/siswa membutuhkan informasi yang transparan tentang jadwal, tagihan, presensi, dan progres.

### Peluang

- Meningkatkan konversi pengunjung website menjadi lead dan pendaftar.
- Mengurangi pekerjaan administratif berulang.
- Meningkatkan pengalaman siswa dan kepercayaan orang tua.
- Menyediakan data untuk keputusan pembukaan kelas, promosi, kapasitas guru, dan retensi siswa.

---

## 3. Tujuan dan indikator keberhasilan

### Tujuan produk

1. Menjadi sumber informasi resmi dan mudah dipahami tentang lembaga.
2. Menyediakan funnel pendaftaran dari website sampai siswa aktif.
3. Memusatkan data operasional dalam satu dashboard.
4. Membantu guru dan admin menyelesaikan pekerjaan harian dengan lebih cepat.
5. Memberi orang tua dan siswa akses terhadap informasi yang relevan.

### KPI awal

| Area | Indikator | Target awal yang disarankan |
|---|---|---:|
| Akuisisi | Rasio pengunjung menjadi lead | 3–8% |
| Respons | Lead yang dihubungi dalam 1 hari kerja | ≥90% |
| Pendaftaran | Lead menjadi konsultasi atau trial | ≥25% |
| Operasional | Pendaftaran yang diproses tanpa duplikasi input | ≥90% |
| Presensi | Sesi dengan presensi tercatat maksimal 24 jam | ≥95% |
| Pembayaran | Tagihan yang statusnya terbarui | ≥95% |
| Retensi | Siswa yang memperpanjang program | Dipantau per periode |
| Kepuasan | CSAT orang tua/siswa | ≥4/5 |

Target final ditetapkan setelah baseline 1–2 bulan.

---

## 4. Sasaran pengguna dan peran

### Pengguna eksternal

#### Calon siswa

Mencari program yang sesuai, melihat biaya/jadwal, meminta konsultasi, dan mendaftar trial atau program.

#### Orang tua/wali

Membandingkan program, memastikan kredibilitas lembaga, mendaftarkan anak, melakukan pembayaran, dan memantau perkembangan.

#### Siswa aktif

Melihat jadwal, materi, tugas, presensi, pengumuman, dan progres belajar.

### Pengguna internal

#### Super Admin/Pemilik

Mengelola seluruh konfigurasi, pengguna, akses, program, laporan, dan pengaturan bisnis.

#### Admin Operasional/Customer Service

Mengelola lead, pendaftaran, data siswa, kelas, komunikasi, dan bantuan pengguna.

#### Admin Keuangan

Mengelola paket harga, invoice, pembayaran, tunggakan, refund, dan laporan keuangan operasional.

#### Koordinator Akademik

Mengelola kurikulum, program, kelas, guru, jadwal, kapasitas, materi, dan monitoring akademik.

#### Guru/Tutor

Melihat jadwal mengajar, daftar siswa, mengisi presensi, mengunggah materi, memberi tugas, dan menulis catatan perkembangan.

#### Orang tua/siswa pada portal

Mengakses informasi yang terbatas pada akun dan siswa yang terhubung.

---

## 5. Prinsip produk

- **Mobile-first:** sebagian besar calon siswa, orang tua, dan guru akan mengakses melalui ponsel.
- **Satu sumber data:** data lead, siswa, kelas, dan pembayaran tidak boleh berulang tanpa relasi yang jelas.
- **Action-oriented:** setiap halaman dashboard harus jelas tindakan berikutnya.
- **Transparan:** status pendaftaran, pembayaran, jadwal, dan presensi mudah dipahami.
- **Aman berdasarkan peran:** setiap pengguna hanya melihat dan mengubah data sesuai kebutuhannya.
- **Bertahap:** mulai dari proses inti yang memberi dampak operasional terbesar.

---

## 6. Ruang lingkup MVP

### Termasuk dalam MVP

- Website publik responsif.
- CMS sederhana untuk konten utama.
- Form konsultasi, trial, dan pendaftaran.
- Manajemen lead dan pipeline.
- Manajemen data siswa/orang tua.
- Manajemen program, kelas, guru, jadwal, dan kapasitas.
- Pembuatan invoice dan pencatatan pembayaran manual/unggah bukti.
- Presensi siswa.
- Pengumuman dan notifikasi dasar.
- Dashboard ringkasan KPI.
- Hak akses berbasis peran.
- Audit log untuk perubahan data penting.

### Di luar MVP

- Video conference native.
- Marketplace tutor.
- Penilaian adaptif berbasis AI.
- Integrasi akuntansi penuh.
- Payroll guru.
- Aplikasi mobile native.
- Gamifikasi kompleks.
- Pembayaran cicilan dengan aturan sangat kompleks.

---

## 6A. Rekomendasi stack teknis

### Rekomendasi utama

| Lapisan | Teknologi yang disarankan | Alasan |
|---|---|---|
| Framework web | Next.js App Router + TypeScript | Satu codebase untuk website publik, dashboard, route handler, rendering server, dan halaman interaktif |
| UI dan styling | Tailwind CSS + shadcn/ui | Cepat dikembangkan, responsif, mudah dikustomisasi, dan cocok untuk website profil serta dashboard |
| Form dan validasi | React Hook Form + Zod | Validasi form konsisten di client dan server, cocok untuk pendaftaran serta pembayaran |
| Database | Supabase PostgreSQL | Relational database cocok untuk siswa, kelas, jadwal, presensi, enrollment, invoice, dan audit log |
| Auth | Supabase Auth | Login, reset password, session, dan integrasi dengan kebijakan akses database |
| Otorisasi | PostgreSQL Row Level Security + role/permission di database | Membatasi data sampai level baris, penting untuk data siswa, orang tua, guru, dan keuangan |
| File storage | Supabase Storage | Penyimpanan dokumen pendaftaran, bukti pembayaran, materi, dan aset dengan policy akses |
| API/backend | Next.js Route Handlers dan Server Actions seperlunya | Menjaga operasi sensitif di server dan menghindari backend terpisah pada fase awal |
| Email | Resend atau layanan transactional email setara | Untuk konfirmasi pendaftaran, invoice, reset password, dan notifikasi penting |
| WhatsApp | WhatsApp Business Platform atau provider resmi | Untuk follow-up lead dan notifikasi operasional setelah kebutuhan template disepakati |
| Hosting | Vercel untuk aplikasi Next.js | Deployment sederhana, preview environment, CDN, dan cocok untuk halaman publik berperforma tinggi |
| Monitoring | Sentry atau layanan error monitoring setara + Vercel Analytics | Memantau error, performa, dan regresi produksi |
| Testing | Vitest, React Testing Library, dan Playwright | Unit/integration test serta pengujian alur pendaftaran dan dashboard di browser |
| Kontrol versi dan CI | GitHub + GitHub Actions atau CI bawaan hosting | Review kode, lint, type-check, test, dan deployment yang konsisten |

### Arsitektur yang disarankan

Gunakan **modular monolith** pada tahap awal: website publik dan dashboard berada dalam satu repository serta satu aplikasi Next.js, tetapi dipisahkan secara jelas berdasarkan route, domain logic, permission, dan komponen.

Struktur konseptual:

```text
app/
  (public)/          # website profil, program, artikel, kontak
  (auth)/            # login, reset password, invitation
  dashboard/         # admin, akademik, tutor, keuangan
  portal/            # siswa dan orang tua
  api/               # route handlers yang memang diperlukan
components/          # komponen UI reusable
features/            # domain: leads, students, classes, billing, attendance
lib/                 # auth, database client, validation, permissions
supabase/            # migrations, seed, policies
```

Pendekatan ini mengurangi kompleksitas awal dan memudahkan pembagian menjadi service terpisah jika jumlah cabang, volume transaksi, atau kebutuhan integrasi meningkat.

### Prinsip implementasi teknis

- Halaman website profil dan detail program diprioritaskan sebagai server-rendered/static content agar cepat, SEO-friendly, dan ringan.
- Interaksi seperti filter program, form, tabel dashboard, kalender, dan modal dibuat sebagai client component hanya bila diperlukan.
- Operasi sensitif seperti perubahan role, penerbitan invoice, verifikasi pembayaran, dan akses dokumen harus divalidasi ulang di server.
- Route handler diperlakukan sebagai endpoint publik: selalu lakukan pemeriksaan autentikasi dan otorisasi, bukan hanya menyembunyikan tombol di UI.
- Aktifkan Row Level Security untuk tabel yang berisi data pengguna, siswa, wali, presensi, pembayaran, dokumen, dan materi privat.
- Simpan secret key hanya di server; jangan expose service role key ke browser.
- Gunakan migration database dan seed data, bukan perubahan database manual tanpa histori.
- Gunakan komponen gambar responsif dan font yang dioptimalkan framework agar tidak memperlambat first load.
- Pisahkan data publik yang dapat di-cache dari data dashboard yang wajib dilindungi dan selalu divalidasi.

### Alternatif bila kondisi berubah

- Jika tim lebih kuat di Laravel/PHP, alternatif yang valid adalah Laravel + Filament untuk dashboard dan frontend terpisah atau Blade untuk website. Namun, untuk website profil yang sangat SEO/performance-oriented serta satu codebase TypeScript, rekomendasi utama tetap Next.js.
- Jika jumlah data dan kebutuhan backend sangat kecil, Supabase cukup untuk MVP. Jika kelak membutuhkan workflow keuangan, integrasi enterprise, atau multi-cabang kompleks, backend domain khusus dapat ditambahkan tanpa mengubah struktur website publik.

### Catatan biaya dan operasional

Stack di atas mengurangi pekerjaan DevOps awal, tetapi tetap perlu diperhitungkan biaya hosting, database, storage, email, WhatsApp, monitoring, domain, dan backup. Sebelum produksi, tentukan batas penggunaan, kebijakan backup, serta siapa yang bertanggung jawab terhadap akses akun layanan.

---

## 7. Struktur informasi website publik

### Halaman utama

Komponen minimum:

- Hero dengan proposisi nilai dan CTA utama: **Konsultasi** / **Daftar Trial**.
- Keunggulan lembaga.
- Program unggulan.
- Statistik kredibilitas, misalnya jumlah siswa, tahun pengalaman, atau jumlah cabang.
- Cara belajar atau alur pendaftaran.
- Testimoni.
- Profil tutor pilihan.
- FAQ.
- CTA penutup.

### Program belajar

Setiap program memiliki:

- Nama dan jenjang/target kelas.
- Deskripsi dan tujuan belajar.
- Mata pelajaran.
- Format belajar: offline, online, atau hybrid.
- Jadwal yang tersedia.
- Durasi dan periode.
- Harga mulai dari atau rincian biaya.
- Kapasitas kelas.
- Fasilitas/benefit.
- CTA daftar atau konsultasi.

### Detail program

- Ringkasan program.
- Kurikulum/topik.
- Jadwal dan lokasi.
- Profil tutor.
- Biaya dan kebijakan pembayaran.
- Pertanyaan umum terkait program.
- Form pendaftaran atau kontak admin.

### Tentang kami

- Visi dan misi.
- Cerita lembaga.
- Metode belajar.
- Profil tim/tutor.
- Sertifikasi atau pencapaian yang dapat dipublikasikan.

### Hasil dan testimoni

- Testimoni terverifikasi.
- Cerita keberhasilan siswa.
- Catatan bahwa hasil setiap siswa dapat berbeda.

### Artikel dan berita

- Tips belajar.
- Informasi ujian.
- Pengumuman program.
- Filter kategori dan pencarian.

### Kontak dan lokasi

- Alamat dan peta.
- Jam operasional.
- WhatsApp, telepon, email, dan media sosial.
- Form pertanyaan.

### Legal

- Kebijakan privasi.
- Syarat dan ketentuan.
- Kebijakan pembatalan/refund.
- Persetujuan komunikasi pemasaran.

---

## 8. Persyaratan fungsional website

### W1 — Navigasi dan konten

- Pengunjung dapat menavigasi halaman melalui header dan footer.
- Admin dapat mengubah konten yang tidak memerlukan perubahan kode.
- Konten memiliki status draft, terbit, dan arsip.
- Setiap halaman memiliki metadata SEO dasar, slug, judul, deskripsi, dan gambar sosial.

### W2 — Pencarian program

- Pengunjung dapat memfilter berdasarkan jenjang, mata pelajaran, format, lokasi, dan hari/jadwal.
- Program penuh dapat diberi status “penuh” dan CTA alternatif berupa daftar tunggu atau konsultasi.
- Detail harga harus membedakan biaya pendaftaran, biaya program, diskon, dan biaya tambahan bila ada.

### W3 — Lead dan konsultasi

Form minimal:

- Nama calon siswa/orang tua.
- Nomor WhatsApp.
- Email opsional.
- Jenjang kelas.
- Program/minat.
- Preferensi jadwal/lokasi.
- Pesan.
- Sumber kampanye bila tersedia.
- Persetujuan kebijakan privasi.

Setelah dikirim:

- Data masuk ke dashboard sebagai lead baru.
- Pengunjung melihat konfirmasi dan estimasi waktu respons.
- Admin menerima notifikasi.
- Sistem menyimpan sumber, waktu, dan halaman asal lead.

### W4 — Pendaftaran

- Pengunjung dapat mengisi data wali dan siswa.
- Pengunjung memilih program atau kelas yang tersedia.
- Pengunjung dapat mengunggah dokumen jika diwajibkan.
- Sistem membuat nomor pendaftaran.
- Status pendaftaran: draft, diajukan, perlu dilengkapi, diverifikasi, diterima, ditolak, dibatalkan.
- Sistem mengirim ringkasan pendaftaran kepada pendaftar dan admin.

### W5 — Komunikasi

- Tombol WhatsApp menggunakan nomor resmi dan template pesan kontekstual.
- Form dapat dikonfigurasi agar mengirim email atau notifikasi internal.
- Pesan promosi wajib memiliki mekanisme opt-in/opt-out.

### W6 — SEO, aksesibilitas, dan performa

- URL bersih dan dapat diindeks.
- Sitemap dan robots tersedia.
- Gambar memiliki alt text.
- Kontras, fokus keyboard, label form, dan struktur heading mengikuti praktik aksesibilitas dasar.
- Halaman inti tetap usable pada jaringan seluler yang lambat.

### W7 — Mobile-first website profile

Website profil harus dirancang dan diuji mulai dari layar ponsel, bukan sekadar mengecilkan layout desktop.

- Target layout utama: 320px, 375px, 390px, 414px, 768px, 1024px, dan desktop lebar.
- Header mobile memiliki navigasi yang jelas, tombol menu yang mudah disentuh, dan CTA WhatsApp/Daftar yang mudah ditemukan.
- Hero section pada mobile menampilkan satu pesan utama dan satu CTA utama tanpa teks terlalu panjang.
- Card program menggunakan satu kolom di ponsel dan tidak memaksa pengguna melakukan horizontal scrolling.
- Tabel dan kalender dashboard boleh menggunakan pola scroll horizontal terkontrol atau tampilan card khusus mobile; tidak boleh memecahkan viewport.
- Form pendaftaran menggunakan input yang nyaman disentuh, label selalu terlihat, keyboard input sesuai tipe data, dan validasi tampil dekat field.
- Tombol utama memiliki target sentuh minimal sekitar 44px dan jarak antar-action yang memadai.
- Gambar hero, tutor, lokasi, dan testimoni menggunakan ukuran responsif, lazy loading bila tidak berada di atas fold, serta format modern bila kompatibel.
- CTA WhatsApp tetap mudah diakses tetapi tidak menutupi konten atau menghalangi tombol penting.
- Semua halaman publik dapat digunakan dengan satu tangan dan tanpa zoom manual.
- Pengujian dilakukan pada Safari iOS dan Chrome Android, termasuk kondisi koneksi lambat dan ukuran teks lebih besar.

---

## 9. Struktur dashboard

### Navigasi utama

1. Beranda
2. Lead & pendaftaran
3. Siswa & orang tua
4. Program & kelas
5. Jadwal
6. Presensi
7. Materi & tugas
8. Pembayaran
9. Komunikasi
10. Laporan
11. Konten website
12. Pengaturan

Menu ditampilkan sesuai peran pengguna.

---

## 10. Persyaratan fungsional dashboard

### D1 — Dashboard ringkasan

Menampilkan sesuai hak akses:

- Lead baru hari ini/minggu ini.
- Pendaftaran berdasarkan status.
- Siswa aktif dan siswa baru.
- Kelas aktif dan kapasitas tersisa.
- Jadwal hari ini.
- Presensi yang belum diisi.
- Invoice belum lunas dan jatuh tempo.
- Notifikasi atau tugas yang membutuhkan tindakan.
- Grafik tren lead, pendaftaran, pembayaran, dan kehadiran.

Setiap kartu KPI dapat diklik menuju daftar terfilter.

### D2 — Lead dan pipeline

Fitur:

- Daftar lead dengan pencarian dan filter.
- Sumber lead: website, WhatsApp, Instagram, referral, walk-in, lainnya.
- Tahapan: baru, dihubungi, konsultasi, trial, proposal/biaya, daftar, tidak tertarik, tidak dapat dihubungi.
- Penugasan lead kepada admin.
- Catatan, aktivitas, dan riwayat kontak.
- Pengingat follow-up.
- Konversi lead menjadi pendaftaran tanpa input ulang.
- Dedup berdasarkan nomor telepon/email dengan konfirmasi admin.

### D3 — Pendaftaran dan onboarding siswa

- Daftar pendaftaran dengan filter status dan periode.
- Verifikasi data dan dokumen.
- Permintaan perbaikan data kepada pendaftar.
- Persetujuan atau penolakan dengan alasan.
- Pembuatan profil siswa dan wali setelah diterima.
- Penempatan siswa ke program/kelas.
- Checklist onboarding: data lengkap, pembayaran awal, jadwal terkirim, akun dibuat, orientasi selesai.

### D4 — Data siswa dan orang tua

Profil siswa memuat:

- Identitas dasar.
- Jenjang sekolah dan kelas.
- Kontak wali.
- Program/kelas aktif dan riwayat.
- Jadwal.
- Presensi.
- Catatan akademik.
- Tagihan dan pembayaran.
- Dokumen dan persetujuan.

Data sensitif harus dibatasi berdasarkan peran dan dicatat dalam audit log.

### D5 — Program dan kelas

- CRUD program, mata pelajaran, format, lokasi, periode, harga, dan status publikasi.
- Membuat kelas dari program.
- Menetapkan tutor utama dan tutor pendamping.
- Menentukan kapasitas minimum/maksimum.
- Menambahkan siswa secara manual atau melalui pendaftaran.
- Status kelas: rancangan, pendaftaran dibuka, berjalan, selesai, dibatalkan.
- Daftar tunggu ketika kapasitas penuh.

### D6 — Jadwal

- Kalender harian, mingguan, dan bulanan.
- Jadwal kelas berulang atau sesi tunggal.
- Ruang/lokasi atau tautan online.
- Deteksi konflik jadwal tutor, ruang, dan kelas.
- Perubahan jadwal dengan alasan dan notifikasi.
- Riwayat perubahan jadwal.

### D7 — Presensi

- Tutor melihat daftar siswa untuk sesi tertentu.
- Status: hadir, terlambat, izin, sakit, alpa.
- Catatan presensi.
- Admin dapat mengoreksi dengan alasan.
- Orang tua/siswa dapat melihat riwayatnya.
- Rekap per kelas, siswa, periode, dan tutor.
- Notifikasi bila ketidakhadiran mencapai ambang tertentu.

### D8 — Materi dan tugas

MVP:

- Tutor dapat mengunggah materi atau menautkan file.
- Materi terhubung dengan program, kelas, dan sesi.
- Tutor dapat membuat tugas sederhana dengan tenggat.
- Siswa dapat melihat materi dan status tugas.
- Admin dapat mengarsipkan atau menghapus materi sesuai hak akses.

Pengumpulan tugas dan penilaian terstruktur dapat menjadi fase berikutnya bila kebutuhan sudah jelas.

### D9 — Pembayaran

- Pengaturan paket, harga, diskon, dan periode tagihan.
- Pembuatan invoice otomatis atau manual.
- Status: draft, diterbitkan, menunggu pembayaran, dibayar, terlambat, dibatalkan, direfund.
- Unggah bukti transfer.
- Verifikasi pembayaran oleh admin keuangan.
- Nomor invoice unik.
- Riwayat transaksi dan catatan koreksi.
- Pengingat jatuh tempo.
- Ekspor laporan transaksi.

Integrasi payment gateway dapat ditambahkan setelah metode pembayaran dan kebutuhan rekonsiliasi ditetapkan.

### D10 — Komunikasi

- Pengumuman berdasarkan target: semua, program, kelas, siswa, atau orang tua.
- Template pesan untuk pendaftaran, pembayaran, perubahan jadwal, presensi, dan pengumuman.
- Riwayat pengiriman dan status gagal.
- Notifikasi in-app/email pada MVP; WhatsApp resmi menjadi opsi integrasi.

### D11 — Laporan

Laporan minimum:

- Funnel lead dan konversi.
- Pendaftaran per periode/program/sumber.
- Siswa aktif, baru, berhenti, dan memperpanjang.
- Okupansi kelas.
- Presensi.
- Invoice dan pembayaran.
- Kinerja follow-up lead.
- Aktivitas pengguna dan audit log.

Semua laporan harus dapat difilter periode dan diekspor CSV/XLSX bila diperlukan.

### D12 — Pengguna, peran, dan keamanan

- Login dan reset password.
- Undangan pengguna internal.
- Role-based access control.
- Nonaktifkan akun tanpa menghapus riwayat.
- Sesi kedaluwarsa dan logout semua perangkat.
- Audit log untuk login, perubahan status, data siswa, pembayaran, dan pengaturan akses.
- Opsional fase berikutnya: 2FA.

---

## 11. Portal orang tua dan siswa

Portal dapat dirilis bersamaan dengan dashboard atau sebagai fase 2.

### Fitur orang tua

- Melihat profil anak yang terhubung.
- Melihat program, jadwal, lokasi, dan pengumuman.
- Melihat presensi dan catatan perkembangan.
- Melihat invoice, mengunggah bukti pembayaran, dan mengunduh kuitansi.
- Menerima notifikasi penting.
- Mengajukan perubahan data atau pertanyaan.

### Fitur siswa

- Melihat jadwal.
- Mengakses materi dan tugas.
- Melihat presensi.
- Melihat pengumuman.
- Mengubah profil terbatas.

---

## 12. Alur utama end-to-end

### Alur A — Calon siswa menjadi siswa aktif

1. Pengunjung membuka halaman program.
2. Pengunjung memilih konsultasi, trial, atau pendaftaran.
3. Sistem membuat lead atau pendaftaran.
4. Admin memvalidasi dan melakukan follow-up.
5. Calon siswa memilih program/kelas.
6. Admin meminta data/dokumen yang belum lengkap.
7. Pendaftaran disetujui.
8. Sistem membuat profil siswa dan wali.
9. Invoice diterbitkan.
10. Pembayaran diverifikasi.
11. Siswa ditempatkan ke kelas.
12. Jadwal dan informasi orientasi dikirim.
13. Siswa mengikuti sesi pertama dan presensi tercatat.

### Alur B — Operasional sesi kelas

1. Koordinator membuat kelas dan jadwal.
2. Tutor melihat sesi di kalender.
3. Tutor membuka sesi dan menandai presensi.
4. Tutor menambahkan materi/catatan.
5. Sistem memperbarui riwayat siswa.
6. Orang tua/siswa menerima notifikasi bila relevan.

### Alur C — Pembayaran

1. Admin membuat atau menerbitkan invoice.
2. Orang tua melihat tagihan.
3. Orang tua melakukan pembayaran dan mengunggah bukti.
4. Admin keuangan meninjau bukti.
5. Admin menyetujui/menolak dengan alasan.
6. Sistem memperbarui status invoice dan mengirim notifikasi.

---

## 13. Model data inti

Entitas minimum:

- User
- Role
- Permission
- Lead
- Contact/Parent
- Student
- Student-Parent Relationship
- Program
- Subject
- Class
- Tutor
- Schedule Session
- Attendance
- Material
- Assignment
- Enrollment
- Invoice
- Payment
- Discount
- Announcement
- Notification
- Content Page
- Article
- Location/Room
- Document
- Audit Log

Relasi penting:

- Satu orang tua dapat memiliki beberapa siswa.
- Satu siswa dapat memiliki satu atau lebih enrollment sepanjang periode.
- Satu program dapat memiliki banyak kelas.
- Satu kelas memiliki banyak sesi jadwal dan siswa.
- Satu invoice dapat memiliki satu atau beberapa catatan pembayaran sesuai kebijakan bisnis.
- Semua data operasional penting menyimpan `created_at`, `updated_at`, dan pengguna pembuat/perubah.

---

## 14. Non-functional requirements

### Performa

- Halaman publik inti terasa responsif pada jaringan seluler.
- Website profil memprioritaskan first contentful paint, layout stabil, dan ukuran JavaScript minimal.
- Target awal Core Web Vitals halaman publik: LCP ≤2,5 detik, INP ≤200 ms, dan CLS ≤0,1 pada mayoritas sesi yang terukur.
- Target Lighthouse mobile untuk halaman publik utama: Performance dan Accessibility minimal 90 pada staging, dengan pengecualian yang terdokumentasi.
- Dashboard menampilkan state loading, empty, error, dan success yang jelas.
- Query daftar menggunakan pagination/server-side filtering.
- Upload file memiliki batas ukuran, tipe, dan progres.

### Keamanan dan privasi

- HTTPS untuk seluruh trafik.
- Password disimpan dengan hashing yang aman.
- Validasi input di sisi client dan server.
- Perlindungan terhadap akses lintas tenant/peran bila kelak mendukung banyak cabang.
- Dokumen pribadi tidak boleh menjadi file publik tanpa otorisasi.
- Backup dan kebijakan retensi data perlu ditetapkan.
- Persetujuan privasi direkam bersama timestamp dan versi kebijakan.

### Reliabilitas

- Kegagalan notifikasi tidak boleh membatalkan transaksi utama.
- Perubahan status penting harus idempotent dan tercatat.
- Sistem menyediakan pesan error yang dapat ditindaklanjuti.

### Aksesibilitas

- Navigasi keyboard dasar.
- Label form yang jelas.
- Komponen tidak hanya mengandalkan warna.
- Target sentuh cukup besar pada mobile.

### SEO dan analitik

- Metadata per halaman.
- Structured data untuk organisasi, kursus, FAQ, dan artikel bila relevan.
- Event analitik: view_program, click_cta, submit_lead, start_registration, submit_registration, payment_uploaded.
- Banner cookie/consent mengikuti kebutuhan hukum dan konfigurasi wilayah.

---

## 15. Aturan bisnis awal

- Siswa tidak boleh aktif di kelas yang statusnya dibatalkan.
- Kapasitas kelas tidak boleh terlampaui tanpa override dari koordinator/admin.
- Invoice yang sudah lunas tidak dapat dihapus, hanya dibatalkan atau direfund sesuai kewenangan.
- Perubahan presensi setelah periode tertentu membutuhkan alasan dan hak akses khusus.
- Lead yang sudah dikonversi tetap disimpan untuk histori sumber akuisisi.
- Nomor telepon/email yang sama memunculkan peringatan kemungkinan duplikasi.
- Data anak hanya dapat diakses oleh wali terhubung dan staf berwenang.
- Program yang telah memiliki transaksi tidak boleh dihapus permanen.

---

## 16. Kriteria penerimaan tingkat produk

Produk dianggap siap MVP bila:

- Pengunjung dapat menemukan program, biaya, jadwal, lokasi, dan CTA tanpa bantuan admin.
- Setiap lead dari form website masuk dashboard dengan sumber dan timestamp.
- Admin dapat mengubah lead menjadi pendaftaran tanpa menyalin ulang data inti.
- Pendaftaran dapat diverifikasi, diterima, dan dihubungkan ke siswa serta kelas.
- Admin dapat membuat kelas, menetapkan tutor, menjadwalkan sesi, dan melihat konflik.
- Tutor dapat mengisi presensi dari ponsel.
- Admin keuangan dapat menerbitkan invoice dan memverifikasi bukti pembayaran.
- Siswa/orang tua hanya melihat data yang menjadi haknya.
- Perubahan data penting dapat ditelusuri melalui audit log.
- Kondisi loading, kosong, error, dan sukses tersedia pada alur kritis.
- Website profil lolos pengujian pada ukuran 320px sampai desktop tanpa horizontal overflow yang tidak disengaja.
- Alur utama website—melihat program, membuka detail, menghubungi WhatsApp, mengisi lead, dan memulai pendaftaran—dapat diselesaikan dari perangkat mobile.
- Pengujian dilakukan minimal pada satu perangkat iOS/Safari dan satu perangkat Android/Chrome sebelum rilis.
- Website responsif pada ukuran mobile, tablet, dan desktop.
- Pengujian alur utama selesai di lingkungan staging dengan data uji.

---

## 17. Prioritas fitur

### P0 — wajib untuk MVP

- Website beranda, program, detail program, kontak, FAQ.
- Form lead/konsultasi dan pendaftaran.
- Dashboard lead dan pendaftaran.
- Data siswa/orang tua.
- Program, kelas, tutor, jadwal.
- Invoice dan pencatatan pembayaran.
- Presensi.
- Role dan permission.
- Dashboard KPI dasar.

### P1 — penting setelah MVP

- Portal orang tua/siswa.
- Materi dan tugas.
- Notifikasi otomatis lebih lengkap.
- Artikel/CMS lanjutan.
- Ekspor laporan.
- Integrasi WhatsApp resmi dan payment gateway.

### P2 — pengembangan lanjutan

- Penilaian dan rapor digital.
- Kelas online terintegrasi.
- Aplikasi mobile native.
- Multi-cabang/multi-tenant.
- CRM marketing automation.
- Analitik prediktif dan rekomendasi program.

---

## 18. Rencana delivery

### Fase 0 — Discovery dan fondasi

- Validasi proses bisnis aktual.
- Finalisasi peran, status, kebijakan biaya, dan kebijakan refund.
- Sitemap, user flow, dan wireframe.
- Definisi data dan struktur permission.

### Fase 1 — Website dan lead

- Website publik inti.
- CMS konten dasar.
- Form lead dan konsultasi.
- Dashboard lead dan follow-up.

### Fase 2 — Pendaftaran dan operasional akademik

- Pendaftaran online.
- Data siswa/orang tua.
- Program, kelas, tutor, jadwal.
- Presensi.

### Fase 3 — Keuangan dan komunikasi

- Invoice dan verifikasi pembayaran.
- Pengumuman dan notifikasi.
- Laporan operasional dasar.

### Fase 4 — Portal dan optimasi

- Portal orang tua/siswa.
- Materi/tugas.
- Integrasi komunikasi/pembayaran.
- Optimasi berdasarkan data penggunaan.

---

## 19. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Proses bisnis belum seragam | Tinggi | Workshop dan SOP sebelum development |
| Data lama tidak bersih | Tinggi | Template import, deduplikasi, validasi bertahap |
| Scope melebar | Tinggi | Prioritas P0/P1/P2 dan change request |
| Adopsi guru rendah | Sedang | Alur presensi sangat ringkas, pelatihan, dukungan awal |
| Notifikasi gagal | Sedang | Retry, log status, fallback kanal manual |
| Kebocoran data siswa | Tinggi | RBAC, audit log, proteksi file, review keamanan |
| Jadwal dan pembayaran kompleks | Sedang | Mulai dengan aturan sederhana yang eksplisit |

---

## 20. Keputusan yang perlu dikonfirmasi

1. Nama merek, domain, dan identitas visual lembaga.
2. Target utama: SD, SMP, SMA, UTBK, bahasa, atau kombinasi.
3. Model layanan: offline, online, hybrid, privat, kelompok, atau semua.
4. Jumlah cabang dan apakah satu dashboard akan menangani multi-cabang.
5. Metode pembayaran yang dipakai.
6. Apakah orang tua dan siswa membutuhkan akun sejak MVP.
7. Kanal notifikasi yang diutamakan: email, WhatsApp, SMS, atau in-app.
8. Kebijakan trial, refund, diskon, cicilan, dan daftar tunggu.
9. Format laporan akademik yang dibutuhkan.
10. Data siswa lama yang perlu dimigrasikan.
11. Apakah materi/tugas masuk MVP atau fase berikutnya.
12. Kebutuhan integrasi dengan Google Calendar, Zoom/Meet, payment gateway, atau akuntansi.

---

## 21. Rekomendasi langkah berikutnya

Sebelum desain UI dan implementasi, lakukan sesi discovery singkat dengan pemilik, admin, keuangan, koordinator akademik, dan minimal satu tutor. Hasil sesi tersebut sebaiknya menghasilkan:

- Daftar proses bisnis aktual dari lead sampai siswa aktif.
- Daftar status dan aturan bisnis final.
- Contoh formulir, invoice, laporan, dan template komunikasi yang digunakan saat ini.
- Prioritas fitur P0 yang disepakati.
- Data awal untuk uji coba.
- Keputusan apakah portal orang tua/siswa termasuk MVP.

Dokumen ini dapat menjadi baseline product, tetapi detail status, permission, kebijakan pembayaran, dan kanal integrasi perlu dikunci sebelum estimasi teknis final.

---

## 22. Dokumen desain Stitch

Panduan pembuatan template dan prompt desain untuk Stitch tersedia di [GUIDE-DESIGN-STITCH-BIMBEL.md](./GUIDE-DESIGN-STITCH-BIMBEL.md). Aturan visual yang dapat diimpor atau dijadikan design context tersedia di [DESIGN.md](./DESIGN.md).

