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
    content:
      "Penalaran matematika pada SNBT menuntut kecepatan analitik tinggi. Kuncinya bukan menghafal ratusan rumus, melainkan memahami logika translasi kalimat cerita ke bentuk aljabar sederhana serta eliminasi pilihan jawaban distractor.",
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
    content:
      "Gunakan matriks perbandingan daya tampung historis 3 tahun terakhir dan passing score tryout berkala untuk menentukan kombinasi Pilihan 1 (impian) dan Pilihan 2 (aman).",
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
    content:
      "Teknik belajar 25 menit fokus (Pomodoro) dikombinasikan dengan latihan soal harian terbukti menaikkan pemahaman konsep IPA hingga 40% lebih cepat daripada sistem kebut semalam.",
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
    content:
      "Literasi numerasi ASPD menguji kemampuan aplikasi konsep pada konteks nyata seperti infografis, diskon belanja, dan data lingkungan. Biasakan membaca grafik dengan cepat.",
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

