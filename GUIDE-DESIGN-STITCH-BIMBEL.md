# Guide Design Stitch — Website, Dashboard, dan Portal ARCI Bimbel

## 1. Tujuan dokumen

Dokumen ini menjadi playbook untuk menghasilkan desain yang konsisten di Google Stitch untuk:

- Website profil dan marketing.
- Funnel konsultasi, trial, dan pendaftaran.
- Dashboard admin, akademik, tutor, dan keuangan.
- Portal siswa/orang tua.
- Prototype flow dan handoff ke developer.

Gunakan file [DESIGN.md](./DESIGN.md) sebagai aturan visual utama sebelum membuat screen baru.

## 2. Cara kerja yang disarankan di Stitch

1. Buat satu project Stitch bernama `ARCI Bimbel — Website & Dashboard`.
2. Masukkan konteks produk, persona, sitemap, dan [DESIGN.md](./DESIGN.md) sebagai design context.
3. Mulai dari design direction, bukan langsung semua halaman.
4. Generate satu screen utama untuk mengunci visual language.
5. Lakukan iterasi kecil: spacing, warna, hierarchy, CTA, mobile layout, dan states.
6. Setelah visual direction disetujui, generate screen lain dengan instruksi “preserve the existing design system”.
7. Hubungkan screen yang membentuk alur utama menggunakan prototype flow.
8. Review setiap screen pada mobile 390px dan desktop 1440px.
9. Export design/handoff setelah struktur dan copy disetujui; jangan menjadikan output AI sebagai pengganti review UX dan QA.

## 3. Formula prompt Stitch

Gunakan format berikut untuk setiap permintaan:

```text
Design [screen name] for [product area] used by [persona].
Goal: [one measurable user goal].
Viewport: [mobile 390px / tablet 768px / desktop 1440px].
Layout: [header/sidebar/grid/sections].
Content: [exact Indonesian labels, sample data, hierarchy].
Primary action: [CTA].
Secondary actions: [actions].
States: [loading / empty / error / success / disabled].
Responsive behavior: [what changes on smaller screens].
Use the existing ARCI Bimbel DESIGN.md system: [tokens/components].
Do not add: [out-of-scope elements].
Visual tone: warm, trustworthy, modern education, clear and accessible.
```

### Prompt hygiene

- Satu prompt harus memiliki satu tujuan utama.
- Sebutkan “mobile 390px” secara eksplisit jika ingin desain mobile.
- Berikan copy nyata, bukan “some text”.
- Sebutkan jumlah card, field, dan item yang dibutuhkan.
- Jelaskan apa yang harus tetap sama saat iterasi.
- Jika hasil terlalu ramai, minta `reduce visual noise`, `increase whitespace`, atau `prioritize the primary CTA`.
- Jika hasil tidak konsisten, referensikan nama komponen dan token dari `DESIGN.md`.

## 4. Screen inventory

### Website publik — P0

1. Home/landing page — mobile dan desktop.
2. Daftar program.
3. Detail program.
4. Tentang kami.
5. Tutor/pengajar.
6. Testimoni dan hasil belajar.
7. Artikel list.
8. Detail artikel.
9. Kontak dan lokasi.
10. FAQ.
11. Form konsultasi.
12. Form daftar trial.
13. Form pendaftaran.
14. Konfirmasi pendaftaran.
15. Login.
16. Kebijakan privasi dan syarat.

### Dashboard internal — P0

1. Login internal.
2. Dashboard ringkasan.
3. Daftar lead.
4. Detail lead dan timeline follow-up.
5. Daftar pendaftaran.
6. Review pendaftaran.
7. Daftar siswa dan orang tua.
8. Detail profil siswa.
9. Daftar program.
10. Detail program dan kelas.
11. Kalender jadwal.
12. Detail sesi kelas.
13. Presensi.
14. Daftar invoice.
15. Detail invoice dan verifikasi pembayaran.
16. Pengumuman/komunikasi.
17. Laporan.
18. Manajemen pengguna dan role.
19. CMS konten website.
20. Pengaturan.

### Portal siswa/orang tua — P1

1. Beranda portal.
2. Jadwal.
3. Detail sesi.
4. Presensi.
5. Materi dan tugas.
6. Tagihan dan pembayaran.
7. Pengumuman.
8. Profil dan relasi anak.

## 5. Prompt dasar untuk visual direction

```text
Create three visual directions for an Indonesian tutoring institution called “ARCI Bimbel”.
The product serves parents, students, tutors, and operations staff.
Show one public website hero, one program card, and one dashboard summary card in each direction.
Direction A: trustworthy academic, deep indigo and warm yellow.
Direction B: warm community education, cream and teal with restrained accent color.
Direction C: modern performance coaching, navy and coral with strong typography.
Keep all directions mobile-friendly, accessible, and suitable for Indonesian content.
Do not use childish cartoon styling, excessive gradients, or generic SaaS illustrations.
Recommend the strongest direction for parent trust and conversion.
```

Setelah memilih arah visual:

```text
Keep the selected visual direction as the permanent ARCI Bimbel design system.
Create a compact UI kit showing: colors, typography, spacing, buttons, inputs, cards, badges, tabs, table rows, alerts, modal, navbar, sidebar, and mobile navigation.
Show default, hover, focus, active, disabled, loading, error, empty, and success states.
Use Indonesian labels and Rp currency examples.
```

## 6. Prompt template website profil

### 6.1 Home desktop

```text
Design the ARCI Bimbel public homepage for desktop 1440px.
Audience: parents of elementary, middle, and high school students.
Goal: build trust and move visitors to “Konsultasi Gratis” or “Lihat Program”.
Include: announcement bar, header with logo/navigation, hero with concise headline and two CTAs, trust metrics marked as sample content, program cards, “how it works” 3-step section, tutor preview, testimonial preview, FAQ preview, location/contact CTA, and footer.
Use clear Indonesian copy, realistic sample content, strong hierarchy, generous whitespace, and authentic education imagery placeholders.
Preserve the ARCI Bimbel DESIGN.md tokens and avoid excessive gradients.
```

### 6.2 Home mobile

```text
Adapt the ARCI Bimbel homepage to mobile 390px width.
Keep the primary goal: parents can understand the offer and tap “Konsultasi Gratis” within a few seconds.
Use compact header, single-column sections, one primary CTA above the fold, horizontal scroll only for optional card collections, readable typography, 44px touch targets, and a non-obstructive sticky WhatsApp/CTA control.
Do not shrink the desktop layout. Recompose the hierarchy for one-handed use and slow mobile networks.
```

### 6.3 Daftar program

```text
Design the public “Program Belajar” page for mobile 390px and desktop 1440px.
Include page title, short explanation, filter controls for jenjang, mata pelajaran, format, lokasi, and jadwal, program cards with price-from, duration, tutor, schedule, capacity badge, and CTA “Lihat Detail”.
Include empty filter state and full-class state with “Daftar Tunggu”.
On mobile, use a filter button opening a bottom sheet and one-column cards.
```

### 6.4 Detail program

```text
Design the “Detail Program” page for parents on mobile 390px.
Include breadcrumb, program title, short value proposition, hero image placeholder, price and duration, schedule/location, tutor profile, learning outcomes, curriculum modules, class capacity, FAQ, related programs, sticky CTA “Daftar Trial”, and secondary CTA “Tanya via WhatsApp”.
Keep the price, schedule, and CTA visible early. Use accordions for long content on mobile.
```

### 6.5 Form konsultasi/trial

```text
Design a mobile-first consultation form for ARCI Bimbel at 390px.
Fields: nama orang tua, nama siswa, nomor WhatsApp, email optional, jenjang, mata pelajaran/minat, preferred schedule, preferred location, message, privacy consent.
Show clear labels, inline validation, progress if multi-step, keyboard-friendly inputs, loading state, error state, and success confirmation with expected response time.
The success screen should offer “Kembali ke Program” and “Chat WhatsApp”.
```

### 6.6 Pendaftaran multi-step

```text
Design a 4-step mobile registration flow for ARCI Bimbel at 390px.
Steps: 1) data wali, 2) data siswa, 3) pilih program/kelas, 4) review and submit.
Show stepper, save-progress behavior, required versus optional fields, document upload with file type/size guidance, inline validation, back/next buttons, and a final confirmation with registration number.
Use Indonesian labels and realistic content. Make it easy to recover from errors without losing entered data.
```

### 6.7 Artikel dan FAQ

```text
Design a mobile-first article listing and FAQ section for an Indonesian tutoring website.
Use category chips, search, article cards with reading time, featured article, pagination/load more, and FAQ accordions.
Keep the layout calm and readable. Prioritize typography and scanning over decorative visuals.
```

## 7. Prompt template dashboard

### 7.1 Dashboard overview

```text
Design the ARCI Bimbel internal operations dashboard for desktop 1440px.
User: operations admin.
Goal: understand what needs attention today in under 10 seconds.
Include left sidebar, top bar with search/notifications/profile, KPI cards for new leads, pending registrations, active classes, unpaid invoices, today’s sessions, and attendance not yet submitted.
Add a lead conversion chart, today’s schedule list, urgent action panel, and recent activity.
Use restrained indigo UI, white surfaces, clear borders, compact but readable density, and accessible status badges.
Every KPI card must link to a filtered list.
```

### 7.2 Dashboard mobile

```text
Adapt the operations dashboard to mobile 390px for an admin who works from a phone.
Use a compact top bar, prioritized KPI cards, horizontally scrollable chart only when necessary, stacked action list, bottom navigation or drawer, and prominent “Add Lead” action.
Avoid dense desktop tables. Convert rows into cards with the most important status, name, date, and next action.
Keep loading, empty, and error states visible.
```

### 7.3 Lead management

```text
Design the lead management screen for desktop and mobile.
Desktop: filter bar, search, stage tabs, table with name, source, interested program, last contact, owner, next follow-up, and status.
Mobile: filter button, stage selector, lead cards, quick actions for call, WhatsApp, assign, and schedule follow-up.
Create a lead detail screen with contact summary, pipeline stage selector, activity timeline, notes, follow-up task, and “Convert to Registration”.
Include no-results, duplicate-warning, overdue-follow-up, and success states.
```

### 7.4 Pendaftaran dan siswa

```text
Design the registration review screen for an operations admin.
Show registration status stepper, applicant summary, parent/student information, selected program/class, uploaded documents, payment status, internal notes, activity history, and actions: request changes, approve, reject, and assign class.
Make destructive actions require confirmation and a reason.
On mobile, group information into accordion sections and keep the primary action sticky at the bottom.
```

### 7.5 Program, kelas, dan jadwal

```text
Design the academic management area for a coordinator.
Create screens for program list, program detail, class roster, tutor assignment, capacity, room/location, recurring schedule, and conflict warning.
Use tabs: Overview, Classes, Curriculum, Tutors, Schedule.
Show class status, capacity used, next session, tutor, and action menu.
For mobile, turn the calendar into a session list with date chips and a clear “Create Session” button.
```

### 7.6 Presensi tutor

```text
Design a tutor attendance screen for mobile 390px.
Show class name, date, start/end time, room or online link, student list, and large status controls: Hadir, Terlambat, Izin, Sakit, Alpa.
Allow a short note per student and a class note.
Include unsaved-change warning, save progress, submit confirmation, and success state.
The screen must be usable quickly with one hand and without small table controls.
```

### 7.7 Invoice dan pembayaran

```text
Design the finance dashboard for desktop and mobile.
Include revenue summary, unpaid invoices, overdue amount, payment review queue, filters by period/status/program, invoice table, invoice detail, uploaded proof preview, approve/reject actions, refund/cancel confirmation, and audit timeline.
Use clear currency formatting in Indonesian Rupiah and never rely on color alone for payment status.
```

### 7.8 CMS dan pengaturan

```text
Design a simple content management screen for non-technical staff.
Include content list with draft/published/archived states, search, edit form, preview, publish confirmation, SEO title/description fields, slug, cover image, and revision history.
Also show a role and permission screen with clear warnings before changing access.
Keep the editing experience comfortable on a tablet and mobile.
```

## 8. Prompt template portal siswa/orang tua

### 8.1 Beranda portal

```text
Design the parent/student portal home for mobile 390px.
Show greeting, selected student switcher if a parent has multiple children, next class card, attendance summary, outstanding invoice, latest announcement, and quick actions for schedule, materials, payment, and contact admin.
Use a calm, encouraging education tone. Prioritize the next action and avoid admin-style density.
```

### 8.2 Jadwal dan materi

```text
Design the student schedule and materials screens for mobile 390px.
Schedule: date chips, session cards, tutor, subject, time, location/link, attendance status.
Materials: subject tabs, lesson cards, file type, uploaded date, task deadline, and completion status.
Include empty, late, unavailable, and completed states.
```

### 8.3 Pembayaran orang tua

```text
Design the parent billing screen for mobile 390px.
Show current balance, invoice cards, due date, payment status, invoice detail, upload proof flow, receipt download, and help CTA.
Use clear Rp formatting, plain-language status labels, and a safe confirmation before submitting payment proof.
```

## 9. States yang wajib didesain

Untuk screen kritikal, selalu minta Stitch menghasilkan varian berikut:

- Default/content loaded.
- Loading skeleton.
- Empty state dengan next action.
- Error state dengan retry atau bantuan.
- Success confirmation.
- Disabled/permission denied.
- Long content.
- Long names and large numbers.
- Mobile keyboard open untuk form.
- Offline/poor connection bila alur memerlukan upload atau penyimpanan.

Prompt reusable:

```text
Create the loading, empty, error, success, disabled, and permission-denied variants for this screen.
Keep the same layout and component system. Each state must explain what happened and provide the next useful action.
```

## 10. Review checklist sebelum menyetujui screen

### UX

- Tujuan screen dapat dipahami dalam 3–5 detik.
- Ada satu primary action yang jelas.
- Hierarki informasi sesuai persona.
- Tidak ada fitur yang muncul tanpa kebutuhan di PRD.
- State error dan empty dapat dipulihkan.

### Mobile

- Screen 390px tidak horizontal overflow.
- CTA dan input nyaman disentuh.
- Tidak ada tabel desktop yang dipaksakan ke ponsel.
- Konten penting muncul sebelum scroll panjang.
- Sticky CTA tidak menutupi konten.
- Form tetap usable saat keyboard terbuka.

### Visual

- Warna, radius, typography, dan spacing konsisten dengan `DESIGN.md`.
- Status tidak hanya dibedakan dengan warna.
- Gambar memiliki rasio dan placeholder yang konsisten.
- Tidak terlalu banyak card, border, atau efek dekoratif.

### Handoff

- Nama screen jelas.
- Flow antar-screen dapat dipahami.
- Copy final atau sample copy diberi label.
- Komponen khusus dan behavior responsif dicatat.
- Screen siap dibandingkan dengan implementasi Next.js.

## 11. Urutan pengerjaan yang direkomendasikan

1. Visual direction dan UI kit.
2. Home desktop + mobile.
3. Program list + detail program.
4. Konsultasi/trial + pendaftaran multi-step.
5. Dashboard overview.
6. Lead management.
7. Registration review + student profile.
8. Class, schedule, and attendance.
9. Invoice and payment review.
10. Portal parent/student.
11. CMS and settings.
12. Edge states, accessibility, and final responsive review.

Urutan ini menjaga agar design system dan pola mobile terbentuk sejak awal, sebelum screen dashboard yang lebih kompleks dibuat.

## 12. Handoff ke developer

- Gunakan screen yang telah disetujui sebagai referensi visual, bukan sebagai pengganti PRD.
- Petakan setiap komponen Stitch ke komponen reusable di Next.js/Tailwind/shadcn/ui.
- Catat token final: color, font, spacing, radius, shadow, breakpoint, dan z-index.
- Verifikasi copy, status, permission, dan data sensitif sebelum implementasi.
- Implementasikan website publik sebagai halaman yang ringan dan SEO-friendly; jadikan dashboard sebagai area terautentikasi.
- Setelah implementasi, lakukan visual comparison pada 390px dan 1440px serta uji alur pendaftaran end-to-end.

## 13. Sumber dan catatan

Stitch adalah tool desain AI eksperimental Google Labs yang mendukung pembuatan UI high-fidelity dari bahasa natural, iterasi lintas screen, prototype flow, dan penggunaan `DESIGN.md` untuk membawa aturan desain antar project/tool. Fitur dan format export dapat berubah, sehingga hasil export tetap perlu diperiksa sebelum dijadikan source code produksi.

