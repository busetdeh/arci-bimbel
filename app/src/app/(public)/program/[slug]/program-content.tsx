"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export function ProgramDetailContent() {
  useEffect(() => {
    // FAQ Accordion interaction if present
    const faqBtns = document.querySelectorAll(".faq-btn");
    faqBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const content = btn.nextElementSibling as HTMLElement;
        const icon = btn.querySelector(".material-symbols-outlined") as HTMLElement;
        const isOpen = !content?.classList.contains("hidden");

        document.querySelectorAll(".faq-content").forEach((c) => c.classList.add("hidden"));
        document.querySelectorAll(".faq-btn .material-symbols-outlined").forEach((i) => {
          (i as HTMLElement).style.transform = "rotate(0deg)";
        });

        if (!isOpen && content && icon) {
          content.classList.remove("hidden");
          icon.style.transform = "rotate(180deg)";
        }
      });
    });

    // Mobile Menu Toggle if present
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const toggleMenu = () => mobileMenu?.classList.toggle("hidden");
    if (mobileBtn) mobileBtn.addEventListener("click", toggleMenu);

    return () => {
      if (mobileBtn) mobileBtn.removeEventListener("click", toggleMenu);
    };
  }, []);

  return (
    <div className="bg-light-surface text-light-on-surface font-body antialiased min-h-screen flex flex-col justify-between">


  {/* ============================================================== */}
  {/* TOP ANNOUNCEMENT BAR                                           */}
  {/* ============================================================== */}
  <aside className="bg-light-primary-container text-light-on-primary-container px-4 py-2 text-center text-body-sm border-b border-light-outline-variant relative z-50">
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-bold shadow-2xs">
        Early Bird Diskon 25%
      </span>
      <span>Pendaftaran Gelombang 1 dibuka hingga 30 November 2026. Kuota tersisa <strong className="text-danger font-bold">4 kursi</strong>.</span>
      <a href="/pendaftaran" className="underline font-semibold hover:text-brand-indigo ml-1">Klaim Kuota &rarr;</a>
    </div>
  </aside>

  {/* ============================================================== */}
  {/* GLOBAL HEADER & NAVIGATION                                     */}
  {/* ============================================================== */}
  <header className="sticky top-0 z-40 bg-light-surface/95 backdrop-blur-md border-b border-light-outline-variant transition-colors">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-10">
        <a href="/" className="flex items-center gap-3 group focus:outline-hidden">
          <div className="w-10 h-10 rounded-xl bg-light-primary group-hover:bg-brand-indigo-dark flex items-center justify-center text-light-on-primary font-headline font-bold text-headline-sm shadow-sm transition-colors">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-title-lg tracking-tight text-brand-indigo group-hover:text-brand-indigo-dark transition-colors">ARCI Bimbel</span>
            <span className="text-label-sm text-light-on-surface-variant font-label">Bimbingan Belajar Terpadu</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <a href="/" className="text-body-md font-label text-light-on-surface-variant hover:text-light-primary transition-colors">Beranda</a>
          <a href="/#program" className="text-body-md font-label text-light-primary font-bold flex items-center gap-1">
            Program Belajar
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          </a>
          <a href="/#keunggulan" className="text-body-md font-label text-light-on-surface-variant hover:text-light-primary transition-colors">Keunggulan</a>
          <a href="/#tutor" className="text-body-md font-label text-light-on-surface-variant hover:text-light-primary transition-colors">Tutor Pilihan</a>
          <a href="/#testimoni" className="text-body-md font-label text-light-on-surface-variant hover:text-light-primary transition-colors">Hasil &amp; Testimoni</a>
          <a href="/#lokasi" className="text-body-md font-label text-light-on-surface-variant hover:text-light-primary transition-colors">Lokasi &amp; Kontak</a>
          <a href="/blog" className="text-body-md font-label text-light-on-surface-variant hover:text-light-primary transition-colors">Blog</a>
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <a href="/login" className="inline-flex items-center gap-1.5 sm:gap-2 text-body-sm sm:text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo px-2.5 py-1.5 rounded-lg hover:bg-light-surface-container-low transition-colors whitespace-nowrap font-medium group">
          <span className="material-symbols-outlined text-[20px] text-light-on-surface-variant group-hover:text-brand-indigo leading-none shrink-0">account_circle</span>
          <span>Masuk</span>
        </a>
        <a href="/pendaftaran" className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md sm:text-label-lg shadow-sm hover:shadow transition-all whitespace-nowrap min-h-[44px] group">
          <span>Daftar Sekarang</span>
          <span className="material-symbols-outlined text-[16px] leading-none transition-transform group-hover:translate-x-0.5 select-none no-underline">arrow_forward</span>
        </a>

        {/* Mobile Hamburger Button */}
        <button 
          type="button" 
          id="btn-mobile-menu" 
           
          className="lg:hidden p-2 rounded-lg text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" 
          aria-label="Buka Menu Navigasi">
          <span className="material-symbols-outlined text-[26px]">menu</span>
        </button>
      </div>
    </div>

    {/* Mobile Slide-Down Menu Drawer */}
    <div id="mobile-menu" className="hidden lg:hidden border-t border-light-outline-variant bg-light-surface px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
      <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md text-light-on-surface hover:bg-light-surface-container font-medium">
        <span className="material-symbols-outlined text-[20px] text-light-primary">home</span>
        Beranda
      </a>
      <a href="/#program" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-body-md bg-light-primary-container/40 text-brand-indigo font-bold">
        <span className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-light-primary">school</span>
          Program Belajar UTBK 2026
        </span>
        <span className="text-xs bg-accent text-on-accent font-bold px-2 py-0.5 rounded-full">Aktif</span>
      </a>
      <a href="/#keunggulan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md text-light-on-surface hover:bg-light-surface-container font-medium">
        <span className="material-symbols-outlined text-[20px] text-light-primary">verified</span>
        Keunggulan Bimbel
      </a>
      <a href="/#tutor" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md text-light-on-surface hover:bg-light-surface-container font-medium">
        <span className="material-symbols-outlined text-[20px] text-light-primary">badge</span>
        Tutor Pilihan
      </a>
      <a href="/#testimoni" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md text-light-on-surface hover:bg-light-surface-container font-medium">
        <span className="material-symbols-outlined text-[20px] text-light-primary">reviews</span>
        Hasil &amp; Testimoni Lolos PTN
      </a>
      <a href="/#lokasi" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md text-light-on-surface hover:bg-light-surface-container font-medium">
        <span className="material-symbols-outlined text-[20px] text-light-primary">location_on</span>
        Lokasi &amp; Kontak Cabang
      </a>
      <a href="/blog" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md text-light-on-surface hover:bg-light-surface-container font-medium">
        <span className="material-symbols-outlined text-[20px] text-light-primary">article</span>
        Blog &amp; Edukasi
      </a>
      
      <div className="pt-3 border-t border-light-outline-variant flex flex-col gap-2">
        <a href="/login" className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-light-outline text-body-md font-semibold text-light-on-surface hover:bg-light-surface-container">
          <span className="material-symbols-outlined text-[18px]">login</span>
          Portal Siswa / Masuk
        </a>
        <a href="/pendaftaran" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-light-primary text-light-on-primary font-bold text-body-md hover:bg-brand-indigo-dark shadow-xs">
          <span>Daftar Siswa Baru Sekarang</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
    </div>
  </header>

  {/* ============================================================== */}
  {/* BREADCRUMBS BAR                                                */}
  {/* ============================================================== */}
  <nav aria-label="Breadcrumb" className="bg-light-surface-container-low border-b border-light-outline-variant py-3">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center flex-wrap gap-2 text-label-sm text-light-on-surface-variant">
      <a href="/" className="hover:text-light-primary flex items-center gap-1 transition-colors">
        <span className="material-symbols-outlined text-[16px]">home</span>
        Beranda
      </a>
      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
      <a href="/#program" className="hover:text-light-primary transition-colors">Program Belajar</a>
      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
      <span className="text-brand-indigo font-bold">Intensif UTBK SNBT 2026</span>
    </div>
  </nav>

  {/* ============================================================== */}
  {/* HERO PROGRAM BANNER                                            */}
  {/* ============================================================== */}
  <section className="bg-gradient-to-b from-light-primary-container/40 via-light-surface-soft to-light-surface py-12 lg:py-16 border-b border-light-outline-variant">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      
      {/* Hero Headline & Core Information (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        
        {/* Badges Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-label-sm font-bold bg-accent text-on-accent shadow-2xs">
            PROGRAM UNGGULAN #1
          </span>
          <span className="px-3 py-1 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800">
            Kelas 12 SMA &amp; Gap Year
          </span>
          <span className="px-3 py-1 rounded-full text-label-sm font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">verified</span> 
            88% Lolos PTN Favorit (SNBT 2025)
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-display-lg-mobile md:text-headline-lg font-headline font-bold text-brand-indigo tracking-tight leading-tight">
          Program Intensif Persiapan UTBK SNBT &amp; Ujian Mandiri 2026
        </h1>

        {/* Subtitle & Value Proposition */}
        <p className="text-body-md sm:text-body-lg text-light-on-surface-variant max-w-2xl leading-relaxed">
          Bimbingan belajar khusus dirancang untuk menembus PTN impian (UI, ITB, UGM, Unair, ITS, Undip). Mengupas tuntas pola soal TPS, Penalaran Matematika, Literasi Bahasa Indonesia &amp; Inggris dengan metode konsep matang, penalaran deduktif, dan drilling bank soal prediktif berstandar nasional.
        </p>

        {/* Key Program Spec Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">schedule</span>
            </div>
            <div>
              <p className="text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">Intensitas Sesi</p>
              <p className="font-bold text-body-sm text-light-on-surface">4 Sesi / Minggu (90 Menit)</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </div>
            <div>
              <p className="text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">Kapasitas Kelas</p>
              <p className="font-bold text-body-sm text-light-on-surface">Maksimal 15 Siswa / Rombel</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">domain</span>
            </div>
            <div>
              <p className="text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">Format Kelas</p>
              <p className="font-bold text-body-sm text-light-on-surface">Tatap Muka &amp; Live Hybrid</p>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Enrollment Card (4 cols) */}
      <div className="lg:col-span-4 bg-light-surface rounded-2xl border-2 border-light-primary/30 p-6 shadow-md flex flex-col gap-5 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 bg-accent text-on-accent text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-2xs">
          BATCH 1 SEGERA PENUH
        </div>

        {/* Pricing Header */}
        <div className="flex items-baseline justify-between border-b border-light-outline-variant pb-4 pt-1">
          <div>
            <span className="text-[11px] text-light-on-surface-variant font-label uppercase font-bold tracking-wider">Investasi Belajar</span>
            <div className="text-headline-md font-headline font-bold text-brand-indigo mt-0.5">
              Rp1.850.000 <span className="text-body-sm font-normal text-light-on-surface-variant">/bulan</span>
            </div>
            <div className="text-[12px] text-light-on-surface-variant line-through">Rp2.450.000 /bulan</div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-danger/10 text-danger border border-danger/20">
            Hemat 25%
          </span>
        </div>

        {/* What's Included */}
        <ul className="flex flex-col gap-2.5 text-body-sm text-light-on-surface">
          <li className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span>Modul Fisik Lengkap + E-Book Bank Soal UTBK 2026</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span>12x Simulasi Tryout CBT Berbasis IRT Nasional</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span>Konseling Jurusan &amp; Pemetaan Rasionalisasi 1-on-1</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span>Akses Penuh Portal Orang Tua &amp; Laporan Presensi Digital</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-success text-[18px] shrink-0 mt-0.5">check_circle</span>
            <span>Klinik Konsultasi Soal Bebas Tambahan (GRATIS)</span>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <a href="/pendaftaran" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg font-bold shadow-xs hover:shadow transition-all min-h-[44px]">
            <span>Daftar Kelas Ini Sekarang</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
          <a href="https://wa.me/6281234567890?text=Halo%20ARCI%20Bimbel,%20saya%20ingin%20konsultasi%20Program%20Intensif%20UTBK" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-light-outline hover:bg-light-surface-container font-label text-body-md text-light-on-surface transition-colors min-h-[44px]">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">chat</span>
            <span>Tanya Admin via WhatsApp</span>
          </a>
        </div>

        <p className="text-[11px] text-light-on-surface-variant text-center border-t border-light-outline-variant pt-3">
          Tersedia opsi cicilan bulanan tanpa bunga &amp; beasiswa prestasi.
        </p>
      </div>

    </div>
  </section>

  {/* ============================================================== */}
  {/* MAIN CONTENT: SYLLABUS, TUTORS, SCHEDULE & FAQ                  */}
  {/* ============================================================== */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
    
    {/* Left Main Content Column (8 cols) */}
    <div className="lg:col-span-8 flex flex-col gap-12">
      
      {/* Section 1: Curriculum / Syllabus */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-headline-sm font-headline font-bold text-brand-indigo flex items-center gap-2.5">
            <span className="material-symbols-outlined text-light-primary">menu_book</span>
            Silabus &amp; Kurikulum Pembelajaran UTBK 2026
          </h2>
          <p className="text-body-md text-light-on-surface-variant mt-1.5">
            Materi disusun komprehensif mengikuti kisi-kisi resmi BPPP Kemendikbudristek dengan penekanan pada logika penalaran tingkat tinggi (Higher Order Thinking Skills - HOTS).
          </p>
        </div>

        <div className="border border-light-outline-variant rounded-2xl overflow-hidden divide-y divide-light-outline-variant bg-light-surface shadow-2xs">
          
          {/* Module 1 */}
          <div className="p-5 bg-light-surface-soft hover:bg-light-surface-container-low/60 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-light-primary text-light-on-primary text-xs flex items-center justify-center font-bold">1</span>
                Modul 1: Tes Potensi Skolastik (TPS) Komprehensif
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800">
                40 Jam Ajar
              </span>
            </div>
            <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
              Mencakup Penalaran Umum (Deduktif, Induktif, Kuantitatif), Pemahaman Bacaan &amp; Menulis (PBM), Pengetahuan &amp; Pemahaman Umum (PPU). Dilengkapi latihan identifikasi premis, silogisme, dan pola deret logika kompleks.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-label text-light-on-surface-variant">
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Penalaran Deduktif</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Ejaan &amp; Konjungsi PBM</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Pemecahan Kuantitatif</span>
            </div>
          </div>

          {/* Module 2 */}
          <div className="p-5 bg-light-surface hover:bg-light-surface-container-low/60 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-light-primary text-light-on-primary text-xs flex items-center justify-center font-bold">2</span>
                Modul 2: Penalaran Matematika Cepat &amp; Kontekstual
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800">
                32 Jam Ajar
              </span>
            </div>
            <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
              Fokus pada pemodelan masalah nyata, aljabar fungsional, analisis data grafik/statistik, geometri spasial terapan, serta metode substitusi cerdas dan eliminasi opsi tanpa menghitung panjang.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-label text-light-on-surface-variant">
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Analisis Grafik Data</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Aritmatika Sosial</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Kalkulasi Cepat</span>
            </div>
          </div>

          {/* Module 3 */}
          <div className="p-5 bg-light-surface-soft hover:bg-light-surface-container-low/60 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-light-primary text-light-on-primary text-xs flex items-center justify-center font-bold">3</span>
                Modul 3: Literasi Bahasa Indonesia &amp; Bahasa Inggris
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800">
                28 Jam Ajar
              </span>
            </div>
            <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
              Strategi skimming-scanning teks ilmiah kompleks, penarikan kesimpulan tersirat (inferensi), analisis sudut pandang penulis, serta pengayaan sinonim dan istilah akademik bilingual.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-label text-light-on-surface-variant">
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Trik Skimming &amp; Scanning</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Critical Reading</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Context Clues</span>
            </div>
          </div>

          {/* Module 4 */}
          <div className="p-5 bg-light-surface hover:bg-light-surface-container-low/60 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-light-primary text-light-on-primary text-xs flex items-center justify-center font-bold">4</span>
                Modul 4: Bedah Soal Prediktif &amp; Simulasi CBT Nasional
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-accent text-on-accent">
                20 Jam Ajar
              </span>
            </div>
            <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
              12 kali simulasi CBT dengan sistem penilaian Item Response Theory (IRT) riil, evaluasi bobot butir soal, breakdown kelemahan per subtes, serta rekomendasi rasionalisasi pilihan prodi.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-label text-light-on-surface-variant">
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Simulasi CBT Full</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Sistem Penilaian IRT</span>
              <span className="px-2 py-0.5 rounded bg-light-surface border border-light-outline-variant">Rasionalisasi PTN</span>
            </div>
          </div>

        </div>
      </section>

      {/* Section 2: Class Schedule & Rombel Options */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-headline-sm font-headline font-bold text-brand-indigo flex items-center gap-2.5">
            <span className="material-symbols-outlined text-light-primary">calendar_month</span>
            Pilihan Rombel &amp; Jadwal Sesi Kelas
          </h2>
          <p className="text-body-md text-light-on-surface-variant mt-1.5">
            Pilih rombel yang paling sesuai dengan ritme belajar dan jadwal sekolah Anda. Setiap rombel dibatasi maksimal 15 siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rombel 1 */}
          <div className="p-4 rounded-xl border-2 border-light-primary bg-light-primary-container/20 flex flex-col justify-between gap-3 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-light-primary text-light-on-primary">FAVORIT</span>
                <span className="text-[12px] font-semibold text-success">Sisa 2 Kursi</span>
              </div>
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">Reguler Sore A</h3>
              <p className="text-[12px] text-light-on-surface-variant mt-1">Khusus siswa aktif kelas 12 setelah jam sekolah.</p>
              
              <div className="mt-3 space-y-1 text-body-sm">
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">event</span>
                  <span>Senin, Rabu, &amp; Jumat</span>
                </div>
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">schedule</span>
                  <span>16.00 – 18.00 WIB</span>
                </div>
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">location_on</span>
                  <span>Sudirman &amp; Rawamangun</span>
                </div>
              </div>
            </div>
            <a href="/pendaftaran" className="w-full text-center py-2 rounded-lg bg-light-primary text-light-on-primary text-label-md font-semibold hover:bg-brand-indigo-dark transition-colors">
              Pilih Rombel Ini
            </a>
          </div>

          {/* Rombel 2 */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface flex flex-col justify-between gap-3 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-light-surface-container text-light-on-surface">WEEKEND</span>
                <span className="text-[12px] font-semibold text-light-on-surface-variant">Sisa 5 Kursi</span>
              </div>
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">Weekend Intensif</h3>
              <p className="text-[12px] text-light-on-surface-variant mt-1">Fokus di akhir pekan tanpa bentrok ekstrakurikuler.</p>
              
              <div className="mt-3 space-y-1 text-body-sm">
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">event</span>
                  <span>Sabtu &amp; Minggu</span>
                </div>
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">schedule</span>
                  <span>08.30 – 12.30 WIB (Double Sesi)</span>
                </div>
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">location_on</span>
                  <span>Sudirman &amp; Live Zoom</span>
                </div>
              </div>
            </div>
            <a href="/pendaftaran" className="w-full text-center py-2 rounded-lg border border-light-outline text-light-on-surface text-label-md font-semibold hover:bg-light-surface-container transition-colors">
              Pilih Rombel Ini
            </a>
          </div>

          {/* Rombel 3 */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface flex flex-col justify-between gap-3 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-accent text-on-accent">GAP YEAR</span>
                <span className="text-[12px] font-semibold text-warning">Sisa 3 Kursi</span>
              </div>
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">Super Camp Alumni</h3>
              <p className="text-[12px] text-light-on-surface-variant mt-1">Kurikulum super padat pagi hari untuk pejuang alumni.</p>
              
              <div className="mt-3 space-y-1 text-body-sm">
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">event</span>
                  <span>Senin s.d. Kamis</span>
                </div>
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">schedule</span>
                  <span>09.00 – 11.30 WIB</span>
                </div>
                <div className="flex items-center gap-2 text-light-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">location_on</span>
                  <span>Sudirman Eksklusif</span>
                </div>
              </div>
            </div>
            <a href="/pendaftaran" className="w-full text-center py-2 rounded-lg border border-light-outline text-light-on-surface text-label-md font-semibold hover:bg-light-surface-container transition-colors">
              Pilih Rombel Ini
            </a>
          </div>
        </div>
      </section>

      {/* Section 3: Instructors / Tutors for this Program */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-headline-sm font-headline font-bold text-brand-indigo flex items-center gap-2.5">
            <span className="material-symbols-outlined text-light-primary">badge</span>
            Tutor Pengampu Program Ini
          </h2>
          <p className="text-body-md text-light-on-surface-variant mt-1.5">
            Dipandu oleh para tutor senior lulusan PTN terkemuka dengan pengalaman rata-rata 6+ tahun membimbing siswa lolos jurusan bergengsi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tutor 1 */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface flex items-center gap-4 shadow-2xs hover:shadow-xs transition-shadow">
            <img 
              src="assets/images/tutor-budi.jpg" 
              
              alt="Budi Pratama, S.Si" 
              className="w-16 h-16 rounded-full object-cover border-2 border-light-primary shrink-0" />
            <div>
              <div className="font-headline font-bold text-title-md text-light-on-surface">Budi Pratama, S.Si.</div>
              <div className="text-[12px] text-light-primary font-semibold">Tutor Fisika &amp; Penalaran Umum</div>
              <p className="text-[11px] text-light-on-surface-variant mt-1">Alumnus Universitas Indonesia • 8+ tahun mengajar, spesialis membimbing lolos FK UI &amp; STEI ITB.</p>
            </div>
          </div>

          {/* Tutor 2 */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface flex items-center gap-4 shadow-2xs hover:shadow-xs transition-shadow">
            <img 
              src="assets/images/tutor-siti.jpg" 
              
              alt="Siti Nurhaliza, M.Pd." 
              className="w-16 h-16 rounded-full object-cover border-2 border-light-primary shrink-0" />
            <div>
              <div className="font-headline font-bold text-title-md text-light-on-surface">Siti Nurhaliza, M.Pd.</div>
              <div className="text-[12px] text-light-primary font-semibold">Tutor Penalaran Matematika</div>
              <p className="text-[11px] text-light-on-surface-variant mt-1">Magister Pendidikan Matematika UPI • Penulis buku panduan trik cepat SNBT, membina 500+ siswa.</p>
            </div>
          </div>

          {/* Tutor 3 */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface flex items-center gap-4 shadow-2xs hover:shadow-xs transition-shadow">
            <img 
              src="assets/images/tutor-amanda.jpg" 
              
              alt="Amanda Putri, S.Pd." 
              className="w-16 h-16 rounded-full object-cover border-2 border-light-primary shrink-0" />
            <div>
              <div className="font-headline font-bold text-title-md text-light-on-surface">Amanda Putri, S.Pd.</div>
              <div className="text-[12px] text-light-primary font-semibold">Tutor Literasi Bahasa Indonesia &amp; Inggris</div>
              <p className="text-[11px] text-light-on-surface-variant mt-1">Alumnus Universitas Negeri Jakarta • Spesialis reading comprehension dan bedah esai kontekstual.</p>
            </div>
          </div>

          {/* Tutor 4 */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface flex items-center gap-4 shadow-2xs hover:shadow-xs transition-shadow">
            <img 
              src="assets/images/tutor-dimas.jpg" 
              
              alt="Dimas Arya, S.Si." 
              className="w-16 h-16 rounded-full object-cover border-2 border-light-primary shrink-0" />
            <div>
              <div className="font-headline font-bold text-title-md text-light-on-surface">Dimas Arya, S.Si.</div>
              <div className="text-[12px] text-light-primary font-semibold">Tutor Pengetahuan Kuantitatif</div>
              <p className="text-[11px] text-light-on-surface-variant mt-1">Alumnus Institut Teknologi Bandung • Peraih medali OSN Matematika, ahli strategi pembobotan skor IRT.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Facilities & Benefits */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-headline-sm font-headline font-bold text-brand-indigo flex items-center gap-2.5">
            <span className="material-symbols-outlined text-light-primary">star</span>
            Fasilitas Belajar Unggulan yang Didapatkan
          </h2>
          <p className="text-body-md text-light-on-surface-variant mt-1.5">
            Setiap siswa terdaftar mendapatkan akses menyeluruh terhadap ekosistem bimbingan digital dan fisik ARCI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">devices</span>
            </div>
            <div className="font-bold text-body-md text-light-on-surface">Portal Digital 24/7</div>
            <p className="text-[12px] text-light-on-surface-variant leading-relaxed">
              Akses video pembahasan, rekaman kelas, dan rangkuman rumus kapan saja dari aplikasi web dan mobile.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div className="font-bold text-body-md text-light-on-surface">Konsultasi PR Bebas</div>
            <p className="text-[12px] text-light-on-surface-variant leading-relaxed">
              Klinik belajar gratis sepulang sekolah bersama tutor standby setiap hari kerja tanpa dipungut biaya tambahan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">local_cafe</span>
            </div>
            <div className="font-bold text-body-md text-light-on-surface">Ruang Belajar Nyaman</div>
            <p className="text-[12px] text-light-on-surface-variant leading-relaxed">
              AC dingin, Wi-Fi kencang, ruang diskusi hening, meja belajar ergonomis, dan free flow mineral water.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
            <div className="font-bold text-body-md text-light-on-surface">Analisis IRT Nasional</div>
            <p className="text-[12px] text-light-on-surface-variant leading-relaxed">
              Rapor tryout mendalam dengan matriks ranking nasional, passing grade prediktif, dan indikator butir soal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div className="font-bold text-body-md text-light-on-surface">Konseling 1-on-1</div>
            <p className="text-[12px] text-light-on-surface-variant leading-relaxed">
              Sesi konsultasi personal bersama konselor pendidikan untuk penentuan jurusan aman di SNBP dan SNBT.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">family_restroom</span>
            </div>
            <div className="font-bold text-body-md text-light-on-surface">Laporan Wali Murid</div>
            <p className="text-[12px] text-light-on-surface-variant leading-relaxed">
              Rekap kehadiran presensi dan perkembangan nilai tryout terkirim otomatis via WhatsApp ke orang tua.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Student Success Stories */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-headline-sm font-headline font-bold text-brand-indigo flex items-center gap-2.5">
            <span className="material-symbols-outlined text-light-primary">military_tech</span>
            Kisah Sukses Alumni UTBK ARCI Bimbel
          </h2>
          <p className="text-body-md text-light-on-surface-variant mt-1.5">
            Testimoni riil dari siswa angkatan sebelumnya yang berhasil menembus PTN impian mereka melalui bimbingan terarah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Story 1 */}
          <div className="p-5 rounded-xl border border-light-outline-variant bg-light-surface shadow-2xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-light-primary text-light-on-primary font-bold flex items-center justify-center text-title-md">
                  AR
                </div>
                <div>
                  <h3 className="font-bold text-body-md text-light-on-surface">Ahmad Rizky Pratama</h3>
                  <p className="text-[12px] text-success font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Lolos STEI — Institut Teknologi Bandung (ITB)
                  </p>
                </div>
              </div>
              <p className="text-body-sm text-light-on-surface-variant italic leading-relaxed">
                “Tryout CBT di ARCI benar-benar mirip format aslinya. Pembahasan IRT-nya membantu saya tahu subtes mana yang harus digenjot. Alhamdulillah nilai saya tembus 712!”
              </p>
            </div>
            <div className="pt-3 border-t border-light-outline-variant flex items-center justify-between text-[11px] text-light-on-surface-variant">
              <span>Alumnus SMAN 8 Jakarta</span>
              <span className="font-semibold text-brand-indigo">SNBT 2025</span>
            </div>
          </div>

          {/* Story 2 */}
          <div className="p-5 rounded-xl border border-light-outline-variant bg-light-surface shadow-2xs flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-accent text-on-accent font-bold flex items-center justify-center text-title-md">
                  NP
                </div>
                <div>
                  <h3 className="font-bold text-body-md text-light-on-surface">Nabila Putri Maharani</h3>
                  <p className="text-[12px] text-success font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Lolos Pendidikan Dokter — Universitas Indonesia (UI)
                  </p>
                </div>
              </div>
              <p className="text-body-sm text-light-on-surface-variant italic leading-relaxed">
                “Tutor-tutor di ARCI sabar banget waktu saya kesusahan di penalaran kuantitatif. Klinik konsultasi bebas di luar kelas sangat membantu memperjelas konsep-konsep rumit.”
              </p>
            </div>
            <div className="pt-3 border-t border-light-outline-variant flex items-center justify-between text-[11px] text-light-on-surface-variant">
              <span>Alumnus SMAN 28 Jakarta</span>
              <span className="font-semibold text-brand-indigo">SNBT 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Interactive FAQ Section */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-headline-sm font-headline font-bold text-brand-indigo flex items-center gap-2.5">
            <span className="material-symbols-outlined text-light-primary">help</span>
            Pertanyaan Sering Diajukan (FAQ)
          </h2>
          <p className="text-body-md text-light-on-surface-variant mt-1">
            Jawaban lengkap seputar pendaftaran, teknis kelas, dan sistem bimbingan intensif UTBK.
          </p>
        </div>

        <div className="space-y-3">
          
          {/* FAQ 1 */}
          <div className="rounded-xl border border-light-outline-variant bg-light-surface overflow-hidden">
            <button 
              type="button" 
               
              className="w-full p-4 text-left font-bold text-body-md text-light-on-surface flex items-center justify-between hover:bg-light-surface-soft transition-colors"
              aria-expanded="true">
              <span>Apakah siswa gap year / alumni bisa mengikuti program ini?</span>
              <span className="material-symbols-outlined text-light-primary transition-transform duration-200 rotate-180">expand_more</span>
            </button>
            <div className="px-4 pb-4 text-body-sm text-light-on-surface-variant leading-relaxed">
              Bisa dan sangat dianjurkan. Kami menyediakan rombel khusus alumni/gap year (Super Camp Alumni) dengan jam belajar pagi hari yang intensif, dilengkapi modul drill soal mandiri untuk memaksimalkan persiapan waktu luang Anda.
            </div>
          </div>

          {/* FAQ 2 */}
          <div className="rounded-xl border border-light-outline-variant bg-light-surface overflow-hidden">
            <button 
              type="button" 
               
              className="w-full p-4 text-left font-bold text-body-md text-light-on-surface flex items-center justify-between hover:bg-light-surface-soft transition-colors"
              aria-expanded="false">
              <span>Bagaimana jika siswa berhalangan hadir saat sesi tatap muka?</span>
              <span className="material-symbols-outlined text-light-primary transition-transform duration-200">expand_more</span>
            </button>
            <div className="hidden px-4 pb-4 text-body-sm text-light-on-surface-variant leading-relaxed">
              Setiap sesi kelas offline dilengkapi siaran langsung hybrid via Zoom dan rekaman video yang diunggah ke Portal Siswa maksimal 2 jam setelah kelas usai. Siswa juga dapat menjadwalkan sesi klinik pengganti bersama tutor pendamping.
            </div>
          </div>

          {/* FAQ 3 */}
          <div className="rounded-xl border border-light-outline-variant bg-light-surface overflow-hidden">
            <button 
              type="button" 
               
              className="w-full p-4 text-left font-bold text-body-md text-light-on-surface flex items-center justify-between hover:bg-light-surface-soft transition-colors"
              aria-expanded="false">
              <span>Bagaimana sistem tes diagnostik awal dan pembagian kelas?</span>
              <span className="material-symbols-outlined text-light-primary transition-transform duration-200">expand_more</span>
            </button>
            <div className="hidden px-4 pb-4 text-body-sm text-light-on-surface-variant leading-relaxed">
              Sebelum kelas dimulai, seluruh siswa mengikuti Placement Test diagnostik secara online. Hasil tes digunakan untuk memetakan kekuatan dan kelemahan awal siswa sehingga materi di kelas dapat disesuaikan secara proporsional.
            </div>
          </div>

          {/* FAQ 4 */}
          <div className="rounded-xl border border-light-outline-variant bg-light-surface overflow-hidden">
            <button 
              type="button" 
               
              className="w-full p-4 text-left font-bold text-body-md text-light-on-surface flex items-center justify-between hover:bg-light-surface-soft transition-colors"
              aria-expanded="false">
              <span>Apakah biaya bimbingan bisa dicicil per bulan?</span>
              <span className="material-symbols-outlined text-light-primary transition-transform duration-200">expand_more</span>
            </button>
            <div className="hidden px-4 pb-4 text-body-sm text-light-on-surface-variant leading-relaxed">
              Ya, kami menyediakan skema pembayaran bertahap (cicilan bulanan) tanpa bunga, atau pembayaran lunas satu tahun ajaran dengan potongan diskon tambahan 10%.
            </div>
          </div>

        </div>
      </section>

    </div>

    {/* Right Sticky Consultation & Free Trial Form (4 cols) */}
    <div className="lg:col-span-4">
      <div className="sticky top-28 bg-light-surface rounded-2xl border border-light-outline-variant p-6 shadow-md flex flex-col gap-4">
        
        <div>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-light-primary-container text-light-primary">
            KONSULTASI &amp; TRIAL GRATIS
          </span>
          <h3 className="font-headline font-bold text-title-lg text-light-on-surface mt-1.5">
            Ingin Coba Kelas Trial Dulu?
          </h3>
          <p className="text-body-sm text-light-on-surface-variant mt-1 leading-relaxed">
            Ikuti 1 sesi percobaan gratis untuk merasakan langsung metode belajar interaktif dan interaksi tutor kami.
          </p>
        </div>

        {/* Trial Registration Form */}
        <form id="form-trial-class"  className="flex flex-col gap-3 text-body-sm">
          
          <div>
            <label htmlFor="trial-student-name" className="block text-label-sm font-semibold text-light-on-surface mb-1">
              Nama Calon Siswa <span className="text-danger">*</span>
            </label>
            <input 
              type="text" 
              id="trial-student-name" 
              name="student_name" 
              required 
              placeholder="Contoh: Muhammad Farhan" 
              className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary transition-colors min-h-[44px]" />
          </div>

          <div>
            <label htmlFor="trial-phone" className="block text-label-sm font-semibold text-light-on-surface mb-1">
              Nomor WhatsApp Aktif <span className="text-danger">*</span>
            </label>
            <input 
              type="tel" 
              id="trial-phone" 
              name="phone" 
              required 
              placeholder="0812-XXXX-XXXX" 
              className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary transition-colors min-h-[44px]" />
          </div>

          <div>
            <label htmlFor="trial-school" className="block text-label-sm font-semibold text-light-on-surface mb-1">
              Asal Sekolah &amp; Kelas
            </label>
            <input 
              type="text" 
              id="trial-school" 
              name="school" 
              placeholder="Contoh: SMAN 8 Jakarta (Kelas 12)" 
              className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary transition-colors min-h-[44px]" />
          </div>

          <div>
            <label htmlFor="trial-format" className="block text-label-sm font-semibold text-light-on-surface mb-1">
              Preferensi Format &amp; Lokasi
            </label>
            <select 
              id="trial-format" 
              name="format" 
              className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary transition-colors min-h-[44px]">
              <option value="sudirman" >Tatap Muka — Cabang Sudirman</option>
              <option value="rawamangun">Tatap Muka — Cabang Rawamangun</option>
              <option value="kebayoran">Tatap Muka — Cabang Kebayoran Baru</option>
              <option value="online">Online Interaktif (Live Zoom)</option>
            </select>
          </div>

          <div>
            <label htmlFor="trial-target" className="block text-label-sm font-semibold text-light-on-surface mb-1">
              Target Jurusan / PTN Impian
            </label>
            <input 
              type="text" 
              id="trial-target" 
              name="target" 
              placeholder="Contoh: STEI ITB / FK UI" 
              className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary transition-colors min-h-[44px]" />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md font-bold shadow-xs hover:shadow transition-all mt-2 min-h-[44px] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            <span>Kirim Permohonan Trial Gratis</span>
          </button>
        </form>

        <div className="pt-3 border-t border-light-outline-variant flex flex-col gap-2">
          <a 
            href="https://wa.me/6281234567890?text=Halo%20ARCI%20Bimbel,%20saya%20ingin%20jadwalkan%20trial%20UTBK" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-2 text-body-sm text-emerald-700 hover:text-emerald-800 font-semibold py-1">
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Konsultasi Langsung via WhatsApp &rarr;</span>
          </a>
          <p className="text-[11px] text-light-on-surface-variant text-center">
            Konselor akademik kami akan menghubungi Anda dalam 1x24 jam kerja untuk konfirmasi jadwal.
          </p>
        </div>

      </div>
    </div>

  </main>

  {/* ============================================================== */}
  {/* BOTTOM FULL-WIDTH CALL TO ACTION                               */}
  {/* ============================================================== */}
  <section className="bg-gradient-to-r from-brand-indigo via-brand-indigo-dark to-brand-indigo text-light-on-primary py-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="max-w-2xl text-center md:text-left">
        <span className="px-3 py-1 rounded-full text-label-sm font-bold bg-accent text-on-accent inline-block mb-3">
          KUOTA TERBATAS 2026
        </span>
        <h2 className="text-headline-sm sm:text-headline-md font-headline font-bold text-white tracking-tight">
          Siap Mengamankan Kursi di PTN Impianmu?
        </h2>
        <p className="text-body-md text-white/80 mt-2">
          Jangan tunda persiapan hingga semester akhir. Bergabunglah bersama ratusan alumni yang telah sukses menembus gerbang kampus favorit.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <a 
          href="/pendaftaran" 
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-accent text-on-accent hover:bg-yellow-400 font-label text-label-lg font-bold shadow-md hover:shadow-lg transition-all text-center min-h-[44px] flex items-center justify-center gap-2">
          <span>Daftar Kelas Ini Sekarang</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
        <a 
          href="https://wa.me/6281234567890?text=Halo%20ARCI%20Bimbel,%20saya%20ingin%20tanya%20program%20UTBK" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-label text-label-lg font-semibold transition-all text-center min-h-[44px] flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>Chat WhatsApp Admin</span>
        </a>
      </div>
    </div>
  </section>

  {/* ============================================================== */}
  {/* GLOBAL FOOTER                                                  */}
  {/* ============================================================== */}
  <footer className="bg-brand-indigo-dark text-light-on-primary py-14 border-t border-brand-indigo-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-body-sm">
      
      {/* Column 1: Brand Info */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-light-surface text-brand-indigo flex items-center justify-center font-bold font-headline text-headline-sm">
            A
          </div>
          <div>
            <span className="font-headline font-bold text-title-lg tracking-tight text-white block">ARCI Bimbel Indonesia</span>
            <span className="text-xs text-white/70">Membangun Fondasi Prestasi Sejak 2018</span>
          </div>
        </div>
        <p className="text-body-sm text-white/80 leading-relaxed pr-6">
          Bimbel terpadu berstandar modern dengan kurikulum adaptif, mentor berpengalaman, dan ekosistem digital untuk menjamin perkembangan akademik putra-putri Anda.
        </p>
        <div className="flex items-center gap-3 text-white/80 pt-2">
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent hover:text-on-accent flex items-center justify-center transition-colors" title="WhatsApp">
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </a>
          <a href="mailto:info@arcibimbel.id" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent hover:text-on-accent flex items-center justify-center transition-colors" title="Email">
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </a>
          <a href="tel:02178901234" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent hover:text-on-accent flex items-center justify-center transition-colors" title="Telepon">
            <span className="material-symbols-outlined text-[20px]">call</span>
          </a>
        </div>
      </div>

      {/* Column 2: Program Belajar */}
      <div className="flex flex-col gap-3">
        <h4 className="font-headline font-bold text-white text-title-md">Program Belajar</h4>
        <ul className="space-y-2 text-white/80 text-body-sm">
          <li><a href="/program/intensif-utbk-2026" className="hover:text-accent text-accent font-semibold flex items-center gap-1.5 transition-colors"><span>Intensif UTBK SNBT</span> &bull;</a></li>
          <li><a href="/#program" className="hover:text-accent transition-colors">Reguler SD (Kelas 4–6)</a></li>
          <li><a href="/#program" className="hover:text-accent transition-colors">Reguler SMP (Kelas 7–9)</a></li>
          <li><a href="/#program" className="hover:text-accent transition-colors">Reguler SMA (Kelas 10–12)</a></li>
          <li><a href="/program/intensif-utbk-2026" className="hover:text-accent transition-colors">Super Camp Gap Year</a></li>
        </ul>
      </div>

      {/* Column 3: Fasilitas & Portal */}
      <div className="flex flex-col gap-3">
        <h4 className="font-headline font-bold text-white text-title-md">Portal &amp; Akses</h4>
        <ul className="space-y-2 text-white/80 text-body-sm">
          <li><a href="/blog" className="hover:text-accent font-semibold text-accent transition-colors">Blog Edukasi &amp; Panduan</a></li>
          <li><a href="/login" className="hover:text-accent transition-colors">Portal Siswa &amp; Orang Tua</a></li>
          <li><a href="/login-admin" className="hover:text-accent transition-colors">Portal Admin &amp; Guru</a></li>
          <li><a href="/pendaftaran" className="hover:text-accent transition-colors">Pendaftaran Online</a></li>
          <li><a href="/#tutor" className="hover:text-accent transition-colors">Daftar Tutor Pengampu</a></li>
          <li><a href="/#testimoni" className="hover:text-accent transition-colors">Hasil Tryout Nasional</a></li>
        </ul>
      </div>

      {/* Column 4: Alamat & Operasional */}
      <div className="flex flex-col gap-3">
        <h4 className="font-headline font-bold text-white text-title-md">Kantor Pusat</h4>
        <address className="not-italic text-white/80 text-body-sm space-y-2 leading-relaxed">
          <p>Jl. Jend. Sudirman Kav. 24, Jakarta Selatan 12920</p>
          <p className="text-xs text-white/60">Senin – Jumat: 08.00 – 20.00 WIB<br />Sabtu – Minggu: 08.00 – 17.00 WIB</p>
          <p className="font-mono text-xs text-accent">Hotline: (021) 7890-1234</p>
        </address>
      </div>

    </div>

    {/* Copyright Bar */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
      <p>&copy; 2026 ARCI Bimbel Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
      <div className="flex items-center gap-6">
        <a href="/" className="hover:text-white transition-colors">Kebijakan Privasi</a>
        <a href="/" className="hover:text-white transition-colors">Syarat &amp; Ketentuan</a>
        <a href="/" className="hover:text-white transition-colors">Peta Situs</a>
      </div>
    </div>
  </footer>

  {/* ============================================================== */}
  {/* TOAST NOTIFICATION CONTAINER                                   */}
  {/* ============================================================== */}
  <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"></div>

  {/* ============================================================== */}
  {/* JAVASCRIPT LOGIC                                               */}
  {/* ============================================================== */}
  

    </div>
  );
}
