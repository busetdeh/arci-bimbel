"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { 
  Users, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Flame 
} from "lucide-react";

interface ProgramItem {
  id: string;
  slug: string;
  category: "sd" | "smp" | "sma" | "utbk";
  title: string;
  target: string;
  badge: string;
  popular?: boolean;
  image: string;
  price: number;
  period: string;
  sessions: string;
  capacity: string;
  features: string[];
}

export function ProgramsSection() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const programs: ProgramItem[] = [
    {
      id: "utbk-super",
      slug: "program-intensif-utbk",
      category: "utbk",
      title: "Super Intensif UTBK-SNBT 2026",
      target: "Siswa Kelas 12 & Gap Year",
      badge: "Paling Diminati",
      popular: true,
      image: "/images/student-success.jpg",
      price: 3850000,
      period: "per paket program (4 Bulan)",
      sessions: "4x Pertemuan / Minggu (120 Menit)",
      capacity: "Maks. 8 Siswa / Kelas",
      features: [
        "Bedah Tuntas TPS, Literasi & Penalaran Matematika",
        "12x Tryout Akbar Sistem CAT Berperingkat Nasional",
        "Konseling Pemilihan Jurusan & Analisis Rasionalisasi PTN",
        "Garansi Akses Klinik Konsultasi Soal Sulit Harian",
      ],
    },
    {
      id: "sma-prestasi",
      slug: "program-sma-reguler",
      category: "sma",
      title: "Reguler Unggulan SMA (Kelas 10–12)",
      target: "Fokus Kurikulum Merdeka & Rapor Semester",
      badge: "Semester Genap",
      image: "/images/program-sma.jpg",
      price: 1150000,
      period: "per bulan",
      sessions: "3x Pertemuan / Minggu (90 Menit)",
      capacity: "Maks. 8 Siswa / Kelas",
      features: [
        "Pendalaman Matematika Tingkat Lanjut, Fisika, Kimia, Biologi",
        "Bimbingan Portofolio Akademik & Ujian Sekolah",
        "Sesi Tanya Tugas Rumah (PR) Tanpa Batas Waktu",
        "Rapor Bulanan Terintegrasi ke WhatsApp Orang Tua",
      ],
    },
    {
      id: "smp-akselerasi",
      slug: "program-smp-reguler",
      category: "smp",
      title: "Prestasi Terpadu SMP (Kelas 7–9)",
      target: "Persiapan Ulangan Harian & Masuk SMA Favorit",
      badge: "Favorit",
      image: "/images/program-smp.jpg",
      price: 950000,
      period: "per bulan",
      sessions: "3x Pertemuan / Minggu (90 Menit)",
      capacity: "Maks. 8 Siswa / Kelas",
      features: [
        "Konsep Matematika & IPA Nalar Tanpa Hafalan",
        "Peningkatan Kemampuan Bahasa Inggris Komunikatif",
        "Simulasi Tes Asesmen Bakat Masuk SMA Unggulan",
        "Pendampingan Tutor Sabar, Ramah, dan Edukatif",
      ],
    },
    {
      id: "sd-fondasi",
      slug: "program-sd-reguler",
      category: "sd",
      title: "Fondasi Juara SD (Kelas 4–6)",
      target: "Fokus Pemahaman Konsep Dasar & Kebiasaan Belajar",
      badge: "Dasar Kuat",
      image: "/images/program-sd.jpg",
      price: 780000,
      period: "per bulan",
      sessions: "2–3x Pertemuan / Minggu (75 Menit)",
      capacity: "Maks. 6 Siswa / Kelas",
      features: [
        "Matematika Menyenangkan (Fun Math) & Logika Berhitung",
        "Literasi Membaca Cepat & Pemahaman Sains Dasar",
        "Persiapan Ujian Sekolah & Asesmen Nasional",
        "Kelas Suasana Hangat, Positif, & Penuh Apresiasi",
      ],
    },
  ];

  const filtered = activeTab === "all" 
    ? programs 
    : programs.filter((p) => p.category === activeTab);

  return (
    <section id="program" className="py-16 md:py-24 bg-light-surface-soft border-b border-light-outline">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Katalog Program Terpadu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            Pilihan Program Belajar Sesuai Kebutuhan Putra-Putri Anda
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Setiap program dirancang dengan jumlah peserta terbatas, modul eksklusif, serta fleksibilitas memilih kelas tatap muka atau online interaktif.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: "all", label: "Semua Program" },
              { id: "utbk", label: "UTBK-SNBT 2026" },
              { id: "sma", label: "SMA (10–12)" },
              { id: "smp", label: "SMP (7–9)" },
              { id: "sd", label: "SD (4–6)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-brand-indigo text-white shadow-sm"
                    : "bg-white text-light-on-surface hover:bg-light-surface-container border border-light-outline"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((prog) => (
            <div
              key={prog.id}
              className={`rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                prog.popular
                  ? "border-brand-indigo ring-2 ring-brand-indigo/20 shadow-xl relative"
                  : "border-light-outline hover:shadow-lg"
              }`}
            >
              {/* Popular Flag */}
              {prog.popular && (
                <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-on-accent text-[11px] font-bold shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-on-accent" />
                  <span>{prog.badge}</span>
                </div>
              )}

              <div>
                {/* Thumbnail Image */}
                <div className="relative h-44 w-full bg-light-surface-container overflow-hidden">
                  <Image
                    src={prog.image}
                    alt={prog.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                    {prog.target}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <h3 className="font-bold text-lg text-brand-indigo leading-snug min-h-[48px]">
                    {prog.title}
                  </h3>

                  {/* Meta Pills */}
                  <div className="space-y-1.5 text-xs text-light-muted">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand-indigo" />
                      <span>{prog.sessions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-brand-indigo" />
                      <span>{prog.capacity}</span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-2 border-t border-light-outline/70">
                    <div className="text-xl sm:text-2xl font-extrabold text-brand-indigo">
                      {formatRupiah(prog.price)}
                    </div>
                    <div className="text-[11px] text-light-muted">{prog.period}</div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-2 border-t border-light-outline/70">
                    {prog.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-light-on-surface">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-5 sm:p-6 pt-0 space-y-2">
                <Link
                  href={`/pendaftaran?program=${prog.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-dark font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98]"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4 text-accent" />
                </Link>
                <a
                  href="#konsultasi"
                  className="w-full inline-flex items-center justify-center py-2 px-4 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-soft font-medium text-xs transition-colors"
                >
                  Konsultasi Gratis Dulu
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
