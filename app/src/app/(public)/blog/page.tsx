"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CmsArticleItem, INITIAL_CMS_ARTICLES } from "@/lib/cms-constants";
import { getPublicArticlesAction } from "@/app/actions/cms";

export default function BlogListingPage() {
  const [articles, setArticles] = useState<CmsArticleItem[]>(INITIAL_CMS_ARTICLES.filter((a) => a.status === "Terbit (Live)"));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    getPublicArticlesAction().then((res) => {
      if (res.success && res.articles.length > 0) {
        setArticles(res.articles);
      }
    });
  }, []);

  const categories = ["Semua", "Tips UTBK", "Konseling Karir", "Persiapan Ujian", "Metode Belajar", "Pengumuman"];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const regularArticles = filteredArticles.length > 0 ? filteredArticles.slice(1) : [];

  return (
    <div className="bg-light-surface text-light-on-surface font-body antialiased min-h-screen flex flex-col justify-between selection:bg-brand-indigo selection:text-white">
      {/* 1. Top Announcement Bar */}
      <aside className="bg-light-primary-container text-light-on-primary-container px-3 py-1.5 md:py-2.5 text-center text-label-sm md:text-body-sm border-b border-light-outline-variant transition-all">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-1.5 md:gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse"></span>
            Wawasan Edukasi 2026
          </span>
          <span className="font-medium text-brand-indigo-dark text-[11.5px] sm:text-body-sm">
            Artikel strategi belajar dan panduan SNBT resmi dari tim pengajar ARCI Bimbel.
          </span>
          <Link href="/pendaftaran" className="hover:text-brand-indigo-dark font-label font-bold text-brand-indigo ml-1 inline-flex items-center gap-1 text-label-sm whitespace-nowrap group">
            <span className="underline">Daftar Bimbel</span>
            <span className="material-symbols-outlined text-[16px] leading-none transition-transform group-hover:translate-x-0.5">arrow_forward</span>
          </Link>
        </div>
      </aside>

      {/* 2. Global Header */}
      <header className="sticky top-0 z-50 bg-light-surface/95 backdrop-blur-md border-b border-light-outline-variant transition-all duration-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 xl:gap-8">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-title-md lg:text-headline-sm shadow-sm group-hover:bg-brand-indigo-dark transition-colors">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-title-md lg:text-title-lg tracking-tight text-brand-indigo group-hover:text-brand-indigo-dark transition-colors whitespace-nowrap">
                  ARCI Bimbel
                </span>
                <span className="hidden sm:inline-block text-[10px] lg:text-label-sm text-light-on-surface-variant font-label whitespace-nowrap">
                  Bimbingan Belajar Terpadu
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6">
              <Link href="/#program" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
                Program
              </Link>
              <Link href="/#tutor" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
                Tutor
              </Link>
              <Link href="/#lokasi" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
                Cabang
              </Link>
              <Link href="/blog" className="text-body-md font-label text-brand-indigo font-bold border-b-2 border-brand-indigo whitespace-nowrap px-1 py-1">
                Blog Edukasi
              </Link>
              <Link href="/pendaftaran" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
                Pendaftaran
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
            <Link href="/login" className="inline-flex items-center gap-1.5 sm:gap-2 text-body-sm sm:text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo px-2.5 py-1.5 rounded-lg hover:bg-light-surface-container-low transition-colors whitespace-nowrap font-medium group">
              <span className="material-symbols-outlined text-[20px] text-light-on-surface-variant group-hover:text-brand-indigo leading-none shrink-0">account_circle</span>
              <span>Masuk</span>
            </Link>
            <Link href="/#konsultasi" className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md lg:text-label-lg shadow-sm hover:shadow transition-all whitespace-nowrap font-semibold">
              <span className="material-symbols-outlined text-[17px]">calendar_today</span>
              <span>Konsultasi Gratis</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="lg:hidden w-10 h-10 rounded-lg border border-light-outline flex items-center justify-center text-light-on-surface hover:bg-light-surface-container-low active:bg-light-surface-container transition-colors"
              aria-label="Buka Menu Navigasi"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-light-outline-variant bg-light-surface px-5 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <Link href="/pendaftaran" className="flex items-center justify-between text-body-md font-semibold text-brand-indigo py-2.5 border-b border-light-outline-variant/60 bg-light-primary-container/20 px-2 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-light-primary">how_to_reg</span>
                <span>Pendaftaran Siswa Baru</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-light-primary">chevron_right</span>
            </Link>
            <Link href="/#program" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
              <span>Program Belajar</span>
              <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
            </Link>
            <Link href="/#tutor" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
              <span>Tutor Ahli</span>
              <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
            </Link>
            <Link href="/blog" className="flex items-center justify-between text-body-md font-semibold text-brand-indigo py-2.5 border-b border-light-outline-variant/60">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-brand-indigo">article</span>
                <span>Blog & Wawasan Edukasi</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-brand-indigo">chevron_right</span>
            </Link>
            <Link href="/#lokasi" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
              <span>Cabang & Fasilitas</span>
              <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
            </Link>
            <Link href="/#konsultasi" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
              <span>Konsultasi & Free Trial</span>
              <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
            </Link>
          </div>
        )}
      </header>

      {/* 3. Hero & Search Banner */}
      <section className="bg-gradient-to-b from-light-primary/5 via-light-surface to-light-surface py-12 md:py-20 border-b border-light-outline-variant">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">
              Wawasan & Panduan Belajar
            </span>
            <h1 className="font-headline text-headline-sm sm:text-headline-lg lg:text-display-sm text-light-on-surface mt-2 tracking-tight">
              Blog Edukasi & Strategi Belajar ARCI
            </h1>
            <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-3 leading-relaxed">
              Kumpulan artikel edukatif, bedah materi ujian, tips lolos SNBT-UTBK, dan panduan karir akademik dari para Master Tutor berpengalaman.
            </p>

            {/* Search Input Box */}
            <div className="mt-8 relative max-w-xl mx-auto">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-light-on-surface-variant text-[22px]">
                search
              </span>
              <input
                type="text"
                placeholder="Cari artikel, tips UTBK, rumus, atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-2xl border border-light-outline bg-light-surface shadow-xs text-light-on-surface placeholder:text-light-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-light-primary text-body-md transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-light-on-surface-variant hover:text-light-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-label-sm font-label transition-all ${
                    selectedCategory === cat
                      ? "bg-brand-indigo text-white font-semibold shadow-xs"
                      : "bg-light-surface border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container-low"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Article Listing Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full flex-1">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-light-surface-soft rounded-2xl border border-light-outline-variant max-w-lg mx-auto">
            <span className="material-symbols-outlined text-[48px] text-light-outline mb-3">
              article
            </span>
            <h3 className="font-headline font-semibold text-title-lg text-light-on-surface">
              Tidak Ada Artikel yang Cocok
            </h3>
            <p className="text-body-sm text-light-on-surface-variant mt-1 px-4">
              Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori "Semua".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-light-primary text-light-on-primary text-label-sm font-semibold hover:bg-brand-indigo-dark transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article Card (if present) */}
            {featuredArticle && !searchQuery && selectedCategory === "Semua" && (
              <div className="bg-gradient-to-br from-light-surface to-light-surface-container-low rounded-3xl border-2 border-brand-indigo/30 p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="px-3 py-1 rounded-full text-label-sm font-label font-semibold bg-accent text-on-accent">
                        Artikel Pilihan
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[11.5px] font-semibold ${featuredArticle.categoryBadge}`}>
                        {featuredArticle.category}
                      </span>
                      <span className="text-label-sm text-light-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        {featuredArticle.publishedAt}
                      </span>
                    </div>
                    <h2 className="font-headline text-headline-sm sm:text-headline-lg text-light-on-surface font-bold tracking-tight hover:text-brand-indigo transition-colors">
                      <Link href={`/blog/${featuredArticle.slug}`}>
                        {featuredArticle.title}
                      </Link>
                    </h2>
                    <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-3 leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-light-outline-variant/60">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-light-primary-container text-light-primary font-bold flex items-center justify-center text-label-sm">
                          {featuredArticle.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-light-on-surface">{featuredArticle.author}</p>
                          <p className="text-[11px] text-light-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">visibility</span>
                            {featuredArticle.views.toLocaleString("id-ID")} pembaca
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-semibold hover:bg-brand-indigo-dark transition-all shadow-xs"
                      >
                        <span>Baca Artikel</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>

                  {/* Decorative Banner Illustration */}
                  <div className="lg:col-span-5 relative h-56 sm:h-64 lg:h-72 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-indigo-dark text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-inner">
                    <div className="absolute right-3 top-3 opacity-15">
                      <span className="material-symbols-outlined text-[120px]">school</span>
                    </div>
                    <div>
                      <span className="text-[12px] uppercase tracking-wider font-semibold text-accent">
                        Strategi Ujian Nasional
                      </span>
                      <h3 className="font-headline font-bold text-title-lg text-white mt-1">
                        Persiapan Tembus PTN Favorit 2026
                      </h3>
                    </div>
                    <p className="text-body-sm text-light-surface-container-low/90 z-10">
                      Disusun berdasarkan data analitik Passing Score SNBT & sistem Item Response Theory (IRT) terkini.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Articles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline font-bold text-title-lg sm:text-headline-sm text-light-on-surface">
                  {searchQuery || selectedCategory !== "Semua" ? "Hasil Pencarian" : "Semua Artikel Terbaru"}
                </h3>
                <span className="text-label-sm text-light-on-surface-variant font-medium">
                  Menampilkan {filteredArticles.length} artikel
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {(searchQuery || selectedCategory !== "Semua" ? filteredArticles : regularArticles).map((art) => (
                  <article
                    key={art.id}
                    className="bg-light-surface border border-light-outline-variant rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-brand-indigo/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${art.categoryBadge}`}>
                          {art.category}
                        </span>
                        <span className="text-[12px] text-light-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {art.publishedAt}
                        </span>
                      </div>

                      <h4 className="font-headline font-bold text-title-md sm:text-title-lg text-light-on-surface group-hover:text-brand-indigo transition-colors line-clamp-2">
                        <Link href={`/blog/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h4>

                      <p className="text-body-sm text-light-on-surface-variant mt-2.5 leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-light-outline-variant/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-light-surface-container text-light-primary font-bold flex items-center justify-center text-[10px]">
                          {art.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[12px] text-light-on-surface-variant truncate max-w-[120px]">
                          {art.author}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${art.slug}`}
                        className="text-body-sm font-label font-semibold text-light-primary group-hover:text-brand-indigo flex items-center gap-0.5 hover:underline"
                      >
                        <span>Baca</span>
                        <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. Bottom Consultation Banner */}
        <section className="mt-16 md:mt-24 bg-gradient-to-r from-brand-indigo to-brand-indigo-dark text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none">
            <span className="material-symbols-outlined text-[240px]">menu_book</span>
          </div>
          <div className="max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full text-label-sm font-label font-semibold bg-accent text-on-accent inline-block mb-3">
              Free Trial & Konsultasi Jurusan
            </span>
            <h3 className="font-headline font-bold text-headline-sm sm:text-headline-lg text-white tracking-tight">
              Ingin Meraih Prestasi Maksimal Bersama ARCI Bimbel?
            </h3>
            <p className="text-body-sm sm:text-body-md text-light-surface-container-low mt-2 leading-relaxed">
              Daftarkan putra-putri Anda untuk mengikuti tes diagnostik gaya belajar gratis dan konsultasi pemetaan jurusan bersama tim ahli kami.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pendaftaran"
                className="px-6 py-3 rounded-xl bg-accent text-on-accent font-label text-label-md font-bold hover:bg-yellow-400 transition-colors shadow-xs"
              >
                Daftar Siswa Baru
              </Link>
              <Link
                href="/#konsultasi"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-label text-label-md font-semibold transition-colors"
              >
                Konsultasi Gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="bg-light-surface border-t border-light-outline-variant pt-12 pb-10 sm:pt-16 sm:pb-12 text-light-on-surface">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3.5">
              <div className="w-9 h-9 rounded-xl bg-light-primary text-light-on-primary font-headline font-bold text-title-md flex items-center justify-center">
                A
              </div>
              <span className="font-headline font-bold text-title-lg tracking-tight text-brand-indigo">
                ARCI Bimbel
              </span>
            </Link>
            <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
              Bimbingan belajar modern dengan kelas interaktif maksimal 8 siswa, tutor lulusan universitas top, dan pemantauan belajar 360°.
            </p>
          </div>

          <div>
            <p className="font-label font-bold text-light-on-surface mb-3 md:mb-4 text-label-lg">Program Belajar</p>
            <ul className="flex flex-col gap-2.5 text-body-sm text-light-on-surface-variant">
              <li><Link href="/program/intensif-utbk-2026" className="hover:text-light-primary transition-colors">Intensif UTBK-SNBT 2026</Link></li>
              <li><Link href="/#program" className="hover:text-light-primary transition-colors">Bimbel Reguler SMP (Kelas 7–9)</Link></li>
              <li><Link href="/#program" className="hover:text-light-primary transition-colors">Bimbel Reguler SMA (Kelas 10–12)</Link></li>
              <li><Link href="/#program" className="hover:text-light-primary transition-colors">Bimbel Reguler SD (Kelas 4–6)</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-label font-bold text-light-on-surface mb-3 md:mb-4 text-label-lg">Akses & Layanan</p>
            <ul className="flex flex-col gap-2.5 text-body-sm text-light-on-surface-variant">
              <li><Link href="/blog" className="hover:text-light-primary transition-colors font-medium text-brand-indigo">Blog & Wawasan Edukasi</Link></li>
              <li><Link href="/#konsultasi" className="hover:text-light-primary transition-colors">Daftar Free Trial & Diagnostik</Link></li>
              <li><Link href="/#lokasi" className="hover:text-light-primary transition-colors">Katalog Fasilitas Cabang</Link></li>
              <li><Link href="/login" className="hover:text-light-primary transition-colors font-medium text-brand-indigo">Login Portal Siswa & Wali</Link></li>
              <li><Link href="/login-admin" className="hover:text-light-primary transition-colors">Dashboard Staf & Tutor</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-label font-bold text-light-on-surface mb-3 md:mb-4 text-label-lg">Kontak & Kantor</p>
            <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
              Jl. Pendidikan No. 42, Kebayoran Baru, Jakarta Selatan 12130
            </p>
            <p className="text-body-sm text-light-on-surface-variant mt-2.5">
              <strong>WhatsApp:</strong> +62 812-3456-7890
            </p>
            <p className="text-body-sm text-light-on-surface-variant mt-1">
              <strong>Email:</strong> halo@arcibimbel.id
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-light-outline-variant flex flex-col sm:flex-row items-center justify-between text-body-sm text-light-on-surface-variant gap-3 text-center sm:text-left">
          <p>© 2026 ARCI Bimbel. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="hover:underline hover:text-light-primary">Beranda</Link>
            <Link href="/blog" className="hover:underline hover:text-light-primary">Blog</Link>
            <Link href="/pendaftaran" className="hover:underline hover:text-light-primary">Pendaftaran</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
