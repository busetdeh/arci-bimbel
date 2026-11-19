import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Award, 
  Star,
  BookOpenCheck
} from "lucide-react";

export function HeroSection() {
  const stats = [
    { value: "98.4%", label: "Lolos PTN & Sekolah Impian", sub: "Akumulasi kelulusan siswa 3 tahun terakhir" },
    { value: "1 : 8", label: "Rasio Maksimal Kelas", sub: "Perhatian personal ke tiap siswa terjamin" },
    { value: "15+ Th", label: "Pengalaman Akademik", sub: "Metodologi teruji sejak tahun 2011" },
    { value: "4.9 / 5", label: "Indeks Kepuasan Wali Murid", sub: "Berdasarkan evaluasi semester berkala" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-light-surface-soft via-white to-light-surface-soft border-b border-light-outline py-12 md:py-20 lg:py-24">
      {/* Subtle Background pattern */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-light-primary-container border border-brand-indigo/20 text-brand-indigo text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Penerimaan Siswa Baru Semester Genap & UTBK 2026 Dibuka</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-brand-indigo leading-[1.15] tracking-tight">
              Bimbingan Belajar Personal & Terstruktur untuk Prestasi Terbaik Putra-Putri Anda.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-light-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Kombinasi kurikulum adaptif, kelas kecil yang interaktif, tutor inspiratif lulusan PTN ternama, serta laporan perkembangan belajar 360° yang transparan bagi orang tua.
            </p>

            {/* Key Value Checks */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-light-on-surface font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kelas Maksimal 8 Siswa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tes Diagnostik Bakat & Gaya Belajar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Garansi Konsultasi Tambahan</span>
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <a
                href="#konsultasi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-dark font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <span>Daftar Konsultasi & Trial Gratis</span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </a>
              <a
                href="#program"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-brand-indigo hover:bg-light-surface-soft border border-light-outline font-semibold text-sm shadow-xs transition-colors"
              >
                Lihat Katalog Program
              </a>
            </div>
          </div>

          {/* Right Hero Image & Visual Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[500px] lg:max-w-none">
              {/* Outer decorative card */}
              <div className="relative rounded-2xl overflow-hidden border border-light-outline shadow-2xl bg-white aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/hero-classroom.jpg"
                  alt="Suasana kelas bimbingan belajar interaktif ARCI Bimbel"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium text-accent">
                    <BookOpenCheck className="w-4 h-4" />
                    <span>Metode Belajar Aktif & Dialogis</span>
                  </div>
                  <p className="text-sm font-semibold mt-0.5">Ruang Kelas Nyaman, Ber-AC & Terfokus</p>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-light-outline rounded-xl p-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-light-on-surface">Rating 4.9/5</div>
                  <div className="text-[11px] text-light-muted">950+ Ulasan Wali Murid</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-light-outline rounded-xl p-3.5 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-light-on-surface">Rapor 360° Real-time</div>
                  <div className="text-[11px] text-light-muted">Akses Langsung via WhatsApp & Portal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 lg:mt-20 pt-10 border-t border-light-outline grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-xs rounded-xl p-4 sm:p-5 border border-light-outline/70 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-indigo tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-light-on-surface mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-light-muted mt-0.5 leading-snug">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
