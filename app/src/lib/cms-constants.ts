export type CmsStatus = "Terbit (Live)" | "Draft" | "Arsip";
export type CmsTabType = "articles" | "testimonials" | "banners" | "faqs";

export interface CmsArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryBadge: string;
  status: CmsStatus;
  statusColor: string;
  views: number;
  publishedAt: string;
  author: string;
  summary: string;
  content?: string;
}

export interface CmsTestimonialItem {
  id: string;
  name: string;
  role: string;
  program: string;
  quote: string;
  rating: number;
  isVerified: boolean;
  avatarText: string;
}

export interface CmsBannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  gradient: string;
}

export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface CmsMetrics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  verifiedTestimonials: number;
  activeBanners: number;
  totalFaqs: number;
}

export interface CmsDataResult {
  success: boolean;
  articles: CmsArticleItem[];
  testimonials: CmsTestimonialItem[];
  banners: CmsBannerItem[];
  faqs: CmsFaqItem[];
  metrics: CmsMetrics;
  message?: string;
}

export const INITIAL_CMS_ARTICLES: CmsArticleItem[] = [
  {
    id: "ART-01",
    title: "Strategi Efektif Taklukkan Soal TPS Penalaran Matematika UTBK 2026",
    slug: "strategi-tps-penalaran-matematika-utbk-2026",
    category: "Tips UTBK",
    categoryBadge: "bg-blue-100 text-blue-800",
    status: "Terbit (Live)",
    statusColor: "bg-success/15 text-success",
    views: 3420,
    publishedAt: "12 Nov 2026",
    author: "Budi Pratama, M.Si.",
    summary:
      "Panduan komprehensif membedah tipe soal penalaran matematika berstandar IRT nasional dengan rumus praktis ARCI.",
    content: `Penalaran matematika pada seleksi SNBT UTBK 2026 menuntut kecepatan analitik tinggi dan pemahaman konsep yang kokoh. Kuncinya bukan menghafal ratusan rumus rumit di luar kepala, melainkan memahami logika translasi kalimat cerita ke dalam bentuk pemodelan aljabar sederhana serta kemampuan mengeliminasi opsi pengecoh (*distractor*).

### 1. Kenali Pola Soal Berbasis Item Response Theory (IRT)
Sistem pembobotan skor UTBK menggunakan IRT, di mana soal yang berhasil dijawab benar oleh sedikit peserta akan bernilai lebih tinggi. Soal analitis grafik dan pola bilangan kompleks masuk ke dalam kategori berbobot tinggi.

- **Pola Geometri & Bangun Ruang:** Biasakan menggambar sketsa cepat dalam 15 detik.
- **Statistika & Peluang Terapan:** Fokus pada rata-rata gabungan, median tabel berfrekuensi, dan kombinatorika bersyarat.

### 2. Terapkan Metode Eliminasi Terbalik
Sebelum menghitung panjang lebar, periksa rentang angka pada pilihan jawaban (A sampai E). Seringkali 2 pilihan jawaban memiliki orde magnitudo yang tidak masuk akal sehingga bisa langsung dicoret dalam hitungan detik.

### 3. Rutin Evaluasi Tryout Mingguan
Di ARCI Bimbel, kami membiasakan siswa berlatih dengan simulasi sistem IRT digital real-time. Setiap pembahasan soal dilengkapi dengan video penjelasan interaktif dari Master Tutor agar siswa tahu letak kekeliruan bernalarnya.`,
  },
  {
    id: "ART-02",
    title: "Panduan Memilih Jurusan Kuliah Sesuai Minat & Peluang SNBT",
    slug: "panduan-memilih-jurusan-kuliah-snbt",
    category: "Konseling Karir",
    categoryBadge: "bg-purple-100 text-purple-800",
    status: "Terbit (Live)",
    statusColor: "bg-success/15 text-success",
    views: 2180,
    publishedAt: "08 Nov 2026",
    author: "Tim Konseling ARCI",
    summary:
      "Langkah-langkah analitik pemetaan peluang jurusan di PTN favorit dengan rasio keketatan dan passing grade terkini.",
    content: `Menentukan jurusan kuliah dan PTN tujuan merupakan keputusan strategis yang menentukan arah masa depan. Jangan hanya mengandalkan gengsi atau ikut-ikutan teman tanpa melihat data rasio keketatan dan daya tampung historis.

### 1. Matriks Portofolio Minat dan Realitas
Gunakan matriks perbandingan daya tampung historis 3 tahun terakhir dan passing score tryout berkala untuk menentukan kombinasi:
- **Pilihan 1 (Jurusan Impian):** Target ideal dengan keketatan tinggi yang menuntut skor maksimal.
- **Pilihan 2 (Jurusan Aman):** Jurusan dengan peluang lolos di atas 75% berdasarkan hasil simulasi tryout berkala.

### 2. Konseling Pemetaan Bersama Psikolog Pendidikan
Di ARCI Bimbel, setiap siswa intensif UTBK mendapatkan sesi konsultasi privat bersama tim konselor untuk menganalisis tes gaya belajar dan peta kecenderungan bakat alamiah.`,
  },
  {
    id: "ART-03",
    title: "5 Kebiasaan Belajar Siswa Berprestasi di Tingkat SMP",
    slug: "5-kebiasaan-belajar-siswa-smp",
    category: "Metode Belajar",
    categoryBadge: "bg-emerald-100 text-emerald-800",
    status: "Draft",
    statusColor: "bg-warning/15 text-warning",
    views: 450,
    publishedAt: "Dalam Review",
    author: "Siti Rahma, S.Si.",
    summary:
      "Cara mengatur jadwal belajar mandiri, teknik active recall, dan pemanfaatan modul ringkas untuk persiapan ujian sekolah.",
    content: `Masa transisi dari SD ke SMP seringkali mengejutkan siswa karena lonjakan jumlah mata pelajaran dan kedalaman materi sains. Siswa berprestasi tidak belajar 8 jam sehari tanpa henti, melainkan belajar secara cerdas dengan teknik:

1. **Active Recall & Spaced Repetition:** Menutup buku dan menuliskan kembali poin inti konsep dalam bentuk peta pikiran.
2. **Klinik PR Tepat Waktu:** Menyelesaikan kesulitan tugas hari itu juga tanpa menunda bersama tutor pendamping.
3. **Fokus Blok Waktu (Metode Pomodoro):** Belajar intensif 25 menit diselingi rehat 5 menit terbukti meningkatkan retensi otak hingga 40%.`,
  },
  {
    id: "ART-04",
    title: "Bedah Kisi-kisi ASPD DIY Jenjang SMP: Strategi Meraih Skor Maksimal",
    slug: "bedah-kisi-kisi-aspd-smp-diy",
    category: "Persiapan Ujian",
    categoryBadge: "bg-amber-100 text-amber-800",
    status: "Terbit (Live)",
    statusColor: "bg-success/15 text-success",
    views: 1890,
    publishedAt: "02 Nov 2026",
    author: "Ahmad Dani, M.Pd.",
    summary:
      "Analisis mendalam karakteristik soal literasi membaca, sains numerasi, dan bahasa Inggris pada instrumen ASPD standar daerah.",
    content: `Asesmen Standarisasi Pendidikan Daerah (ASPD) menguji kemampuan penalaran literasi kontekstual. Karakteristik utamanya adalah narasi soal yang panjang, grafik data, serta teks berita nyata.

### Trik Membaca Cepat Teks Stimulus:
- Baca pertanyaan dan pilihan jawaban terlebih dahulu sebelum membaca seluruh teks.
- Tandai kata kunci pada grafik, tabel angka, atau diagram alur.
- Kuasai kosakata teknis sains dan istilah inferensial Bahasa Indonesia.`,
  },
];

export const INITIAL_CMS_TESTIMONIALS: CmsTestimonialItem[] = [
  {
    id: "TESTI-01",
    name: "Ratna Kusuma Dewi",
    role: "Siswa Lolos Kedokteran UI 2025",
    program: "Intensif Supercamp UTBK",
    quote:
      "Sistem drill IRT dan klinik konsultasi PR di ARCI benar-benar menyelamatkan skor TPS saya dari 580 ke 745. Tutor sangat sabar dan menguasai konsep sampai ke akarnya!",
    rating: 5,
    isVerified: true,
    avatarText: "RK",
  },
  {
    id: "TESTI-02",
    name: "Ir. Haryanto & Ibu",
    role: "Orang Tua Siswa SMP 8",
    program: "Reguler Juara SMP",
    quote:
      "Portal orang tua memudahkan saya memantau presensi dan hasil kuis mingguan Farhan langsung dari HP. Alhamdulillah ananda berhasil masuk peringkat 3 besar di kelasnya.",
    rating: 5,
    isVerified: true,
    avatarText: "HY",
  },
  {
    id: "TESTI-03",
    name: "Muhammad Bagas",
    role: "Siswa Lolos STEI ITB 2025",
    program: "Intensif Garansi SNBT",
    quote:
      "Modul ringkas rumus sakti dan tryout adaptif membuat persiapan terasa terarah tanpa stres berlebih. Terima kasih Kak Dimas dan seluruh tim tutor ARCI!",
    rating: 5,
    isVerified: true,
    avatarText: "MB",
  },
];

export const INITIAL_CMS_BANNERS: CmsBannerItem[] = [
  {
    id: "BANNER-01",
    badge: "PROMO AWAL TAHUN AJARAN",
    title: "Diskon Early Bird 25% Program UTBK SNBT 2026",
    subtitle: "Daftar sebelum 30 November 2026 dan dapatkan akses gratis 10x Tryout IRT Nasional & Klinik PR tanpa batas.",
    ctaText: "Klaim Diskon Sekarang",
    ctaLink: "/pendaftaran",
    isActive: true,
    gradient: "from-brand-indigo via-indigo-800 to-slate-900",
  },
  {
    id: "BANNER-02",
    badge: "EVENT SPESIAL",
    title: "Tryout Akbar & Tes Minat Bakat Jurusan PTN",
    subtitle: "Terbuka untuk umum siswa SMA/SMK se-Jabodetabek & DIY secara hybrid tatap muka & daring.",
    ctaText: "Daftar Tryout Gratis",
    ctaLink: "/pendaftaran",
    isActive: true,
    gradient: "from-blue-900 via-indigo-900 to-purple-900",
  },
];

export interface PublicTutorItem {
  id: string;
  name: string;
  subject: string;
  university: string;
  experienceYears: number;
  rating: number;
  description: string;
  photoUrl: string;
  levelBadge: string;
}

export interface PublicTestimonialItem {
  id: string;
  name: string;
  role: string;
  program: string;
  quote: string;
  rating: number;
  avatarText: string;
  photoUrl: string;
  achievementBadge?: string;
}

export const INITIAL_PUBLIC_TUTORS: PublicTutorItem[] = [
  {
    id: "tut-budi",
    name: "Budi Pratama, S.Si.",
    subject: "Tutor Matematika",
    university: "Universitas Indonesia",
    experienceYears: 7,
    rating: 4.95,
    description: "Pakar trik penalaran analitis dan aljabar tanpa rumus yang rumit.",
    photoUrl: "assets/images/tutor-budi.jpg",
    levelBadge: "SMA/UTBK",
  },
  {
    id: "tut-siti",
    name: "Siti Rahma, S.Si.",
    subject: "Tutor Sains & Kimia",
    university: "Institut Teknologi Bandung",
    experienceYears: 6,
    rating: 4.92,
    description: "Menyederhanakan konsep reaksi sains ke analogi dunia nyata yang seru.",
    photoUrl: "assets/images/tutor-siti.jpg",
    levelBadge: "SMP & SMA",
  },
  {
    id: "tut-amanda",
    name: "Amanda Putri, S.Si.",
    subject: "Fisika & Skolastik",
    university: "Universitas Gadjah Mada",
    experienceYears: 5,
    rating: 4.97,
    description: "Pendekatan interaktif dengan visualisasi grafis untuk pemecahan masalah.",
    photoUrl: "assets/images/tutor-amanda.jpg",
    levelBadge: "UTBK & OSN",
  },
  {
    id: "tut-dimas",
    name: "Dimas Arya, S.Si.",
    subject: "Literasi & Fisika",
    university: "Universitas Negeri Jakarta",
    experienceYears: 6,
    rating: 4.90,
    description: "Metode membaca kritis cepat dan bedah struktur teks ujian literasi.",
    photoUrl: "assets/images/tutor-dimas.jpg",
    levelBadge: "SD & SMP",
  },
];

export const INITIAL_PUBLIC_TESTIMONIALS: PublicTestimonialItem[] = [
  {
    id: "testi-1",
    name: "Ibu Ratna Dewi",
    role: "Orang Tua Siswa Kelas 8 — SMP Labschool",
    program: "Bimbel Reguler SMP",
    quote: "Sebelumnya anak saya sering stres kalau ada PR matematika. Sejak ikut kelas reguler ARCI, nilainya melonjak dari 65 ke 92. Tutornya sangat sabar dan laporannya transparan sekali.",
    rating: 5,
    avatarText: "RD",
    photoUrl: "assets/images/parent-ratna.jpg",
  },
  {
    id: "testi-2",
    name: "Ahmad Fauzan",
    role: "Alumni SMA Labschool Kebayoran",
    program: "Intensif UTBK-SNBT",
    quote: "Drilling soal TPS dan pembahasan IRT di program UTBK ARCI bener-bener mirip dengan tipe soal aslinya. Konseling pemetaan jurusannya juga akurat banget sampai saya lolos ke FTTM ITB!",
    rating: 5,
    avatarText: "AF",
    photoUrl: "assets/images/student-success.jpg",
    achievementBadge: "Lolos SNBT FTTM ITB 2026",
  },
  {
    id: "testi-3",
    name: "drg. Haryanto W.",
    role: "Orang Tua Siswa Kelas 5 SD Mentari",
    program: "Bimbel Reguler SD",
    quote: "Format kelas maksimal 8 orang sangat efektif. Anak saya yang biasanya pendiam di sekolah jadi aktif bertanya. Ruang belajarnya juga nyaman, bersih, dan ber-AC dingin.",
    rating: 5,
    avatarText: "HW",
    photoUrl: "assets/images/parent-haryanto.jpg",
  },
  {
    id: "testi-4",
    name: "Ratna Kusuma Dewi",
    role: "Alumni SMAN 28 Jakarta",
    program: "Intensif Supercamp UTBK",
    quote: "Sistem drill IRT dan klinik konsultasi PR di ARCI benar-benar menyelamatkan skor TPS saya dari 580 ke 745. Tutor sangat sabar dan menguasai konsep sampai ke akarnya!",
    rating: 5,
    avatarText: "RK",
    photoUrl: "assets/images/student-success.jpg",
    achievementBadge: "Lolos Kedokteran UI 2025",
  },
];

export const INITIAL_CMS_FAQS: CmsFaqItem[] = [
  {
    id: "FAQ-01",
    question: "Bagaimana cara mendaftar kelas uji coba (trial class) gratis?",
    answer: "Anda cukup mengisi formulir pada halaman website atau menghubungi admin WhatsApp kami. Tim akademik akan menjadwalkan tes diagnostik dan satu sesi kelas trial sesuai jenjang tanpa biaya.",
    category: "Pendaftaran",
    order: 1,
  },
  {
    id: "FAQ-02",
    question: "Berapa kapasitas maksimal siswa dalam satu rombongan belajar?",
    answer: "Kami membatasi maksimal 8 siswa per kelas untuk program reguler dan intensif, guna menjamin interaksi dua arah yang optimal dan perhatian tutor secara personal.",
    category: "Akademik",
    order: 2,
  },
  {
    id: "FAQ-03",
    question: "Apakah tersedia sesi konsultasi PR di luar jadwal les?",
    answer: "Ya! Fasilitas Klinik PR dibuka setiap sore hari sebelum dan sesudah kelas, serta grup konsultasi digital bersama tutor pendamping.",
    category: "Fasilitas",
    order: 3,
  },
  {
    id: "FAQ-04",
    question: "Bagaimana orang tua memantau kehadiran dan perkembangan belajar anak?",
    answer: "Orang tua mendapatkan akses login Portal ARCI untuk memantau presensi real-time, laporan rapor hasil kuis, dan invoice SPP secara transparan.",
    category: "Portal & Layanan",
    order: 4,
  },
];

export interface PublicFacilityItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const INITIAL_PUBLIC_FACILITIES: PublicFacilityItem[] = [
  {
    id: "fac-1",
    name: "Ruang Ber-AC Sejuk",
    description: "Kondusif & higienis",
    icon: "ac_unit",
  },
  {
    id: "fac-2",
    name: "Smart TV & Proyektor",
    description: "Visual materi interaktif",
    icon: "tv",
  },
  {
    id: "fac-3",
    name: "Wi-Fi Cepat 100 Mbps",
    description: "Drill soal digital lancar",
    icon: "wifi",
  },
  {
    id: "fac-4",
    name: "Mini Perpustakaan",
    description: "Bank soal & referensi",
    icon: "menu_book",
  },
  {
    id: "fac-5",
    name: "Lounge & Free Water",
    description: "Ruang tunggu orang tua",
    icon: "local_cafe",
  },
];

export interface PublicBranchItem {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  scheduleText: string;
  badgeText: string;
  isOpen: boolean;
  photoUrl: string;
  isOnline: boolean;
}

export const INITIAL_PUBLIC_BRANCHES: PublicBranchItem[] = [
  {
    id: "411a4f54-0257-464a-bbd7-6fc6b21867a1",
    name: "Cabang Sudirman Utama",
    code: "SDR",
    city: "Jakarta Selatan",
    address: "Jl. Jend. Sudirman Kav. 24, Jakarta Selatan (Dekat Stasiun MRT Setiabudi Astra)",
    phone: "(021) 520-1122 / 0812-3456-7890",
    scheduleText: "Senin – Sabtu: 08.00 – 19.30 WIB",
    badgeText: "Cabang Pusat",
    isOpen: true,
    photoUrl: "assets/images/branch-kebayoran.jpg",
    isOnline: false,
  },
  {
    id: "be8e37eb-541f-4f35-98af-3a5207a785b5",
    name: "Cabang Kebayoran Baru",
    code: "KBY",
    city: "Jakarta Selatan",
    address: "Jl. Pendidikan No. 42, Kebayoran Baru, Jakarta Selatan 12130 (Dekat Stasiun MRT Blok M)",
    phone: "(021) 720-4567 / 0813-8899-2211",
    scheduleText: "Senin – Sabtu: 08.00 – 19.30 WIB",
    badgeText: "Cabang Selatan",
    isOpen: true,
    photoUrl: "assets/images/branch-rawamangun.jpg",
    isOnline: false,
  },
  {
    id: "acb1d263-7779-4432-ba2a-515b2362deb7",
    name: "Kelas Online Nasional",
    code: "ONL",
    city: "Seluruh Indonesia",
    address: "Live Interaktif via Zoom Pro & Google Meet (Pengiriman modul cetak langsung ke rumah)",
    phone: "0821-1234-5678 (WhatsApp Support)",
    scheduleText: "Jadwal Fleksibel (Sore & Malam)",
    badgeText: "Kelas Online Nasional",
    isOpen: true,
    photoUrl: "assets/images/class-online.jpg",
    isOnline: true,
  },
];

