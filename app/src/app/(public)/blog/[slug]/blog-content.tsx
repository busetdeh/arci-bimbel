"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CmsArticleItem, INITIAL_CMS_ARTICLES } from "@/lib/cms-constants";
import { getPublicArticleBySlugAction } from "@/app/actions/cms";

export function BlogDetailContent({ slug }: { slug: string }) {
  const [article, setArticle] = useState<CmsArticleItem | null>(() => {
    return (
      INITIAL_CMS_ARTICLES.find(
        (a) => a.slug === slug || a.id.toLowerCase() === slug.toLowerCase()
      ) || INITIAL_CMS_ARTICLES[0]
    );
  });
  const [relatedArticles, setRelatedArticles] = useState<CmsArticleItem[]>(() => {
    return INITIAL_CMS_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);
  });
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      getPublicArticleBySlugAction(slug).then((res) => {
        if (res.success && res.article) {
          setArticle(res.article);
          if (res.relatedArticles && res.relatedArticles.length > 0) {
            setRelatedArticles(res.relatedArticles);
          }
        }
      });
    }
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-light-surface text-center">
        <span className="material-symbols-outlined text-[64px] text-light-outline mb-4">article</span>
        <h1 className="text-2xl font-bold font-headline mb-2 text-light-on-surface">Artikel Tidak Ditemukan</h1>
        <p className="text-light-on-surface-variant max-w-md mb-6">Artikel yang Anda cari mungkin telah dipindahkan atau belum diterbitkan.</p>
        <Link href="/blog" className="px-5 py-2.5 rounded-xl bg-light-primary text-light-on-primary font-semibold font-label">
          Kembali ke Katalog Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-light-surface text-light-on-surface font-body antialiased min-h-screen flex flex-col justify-between selection:bg-brand-indigo selection:text-white">
      {/* 1. Top Announcement Bar */}
      <aside className="bg-light-primary-container text-light-on-primary-container px-3 py-1.5 md:py-2 text-center text-label-sm border-b border-light-outline-variant">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-bold">
            Pendaftaran 2026 Dibuka
          </span>
          <span className="text-brand-indigo-dark font-medium text-[12px] sm:text-body-sm">
            Dapatkan diskon 25% dan gratis tes diagnostik gaya belajar.
          </span>
          <Link href="/pendaftaran" className="underline font-semibold hover:text-brand-indigo ml-1 text-label-sm">
            Daftar Sekarang &rarr;
          </Link>
        </div>
      </aside>

      {/* 2. Global Header */}
      <header className="sticky top-0 z-50 bg-light-surface/95 backdrop-blur-md border-b border-light-outline-variant transition-all duration-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 xl:gap-8">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-title-md shadow-sm group-hover:bg-brand-indigo-dark transition-colors">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-title-md lg:text-title-lg tracking-tight text-brand-indigo group-hover:text-brand-indigo-dark transition-colors whitespace-nowrap">
                  ARCI Bimbel
                </span>
                <span className="hidden sm:inline-block text-[10px] text-light-on-surface-variant font-label whitespace-nowrap">
                  Bimbingan Belajar Terpadu
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              <Link href="/#program" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium px-1 py-1">
                Program
              </Link>
              <Link href="/#tutor" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium px-1 py-1">
                Tutor
              </Link>
              <Link href="/#lokasi" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium px-1 py-1">
                Cabang
              </Link>
              <Link href="/blog" className="text-body-md font-label text-brand-indigo font-bold border-b-2 border-brand-indigo px-1 py-1">
                Blog Edukasi
              </Link>
              <Link href="/pendaftaran" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium px-1 py-1">
                Pendaftaran
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/blog" className="inline-flex items-center gap-1 text-body-sm font-label text-light-primary hover:underline font-semibold mr-2">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Semua Artikel</span>
            </Link>
            <Link href="/#konsultasi" className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md font-semibold shadow-xs">
              <span>Konsultasi Gratis</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="lg:hidden w-10 h-10 rounded-lg border border-light-outline flex items-center justify-center text-light-on-surface hover:bg-light-surface-container-low"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[22px]">{isMobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-light-outline-variant bg-light-surface px-5 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <Link href="/pendaftaran" className="flex items-center justify-between text-body-md font-semibold text-brand-indigo py-2 border-b border-light-outline-variant/60">
              <span>Pendaftaran Siswa Baru</span>
              <span className="material-symbols-outlined text-[18px] text-light-primary">chevron_right</span>
            </Link>
            <Link href="/blog" className="flex items-center justify-between text-body-md font-semibold text-brand-indigo py-2 border-b border-light-outline-variant/60">
              <span>Katalog Blog Edukasi</span>
              <span className="material-symbols-outlined text-[18px] text-brand-indigo">chevron_right</span>
            </Link>
            <Link href="/" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2 border-b border-light-outline-variant/60">
              <span>Halaman Utama</span>
              <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
            </Link>
          </div>
        )}
      </header>

      {/* 3. Main Reading Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-sm text-light-on-surface-variant mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-light-primary transition-colors">Beranda</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/blog" className="hover:text-light-primary transition-colors">Blog Edukasi</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-light-on-surface font-medium truncate max-w-xs">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Article Main Column */}
          <article className="lg:col-span-8 bg-light-surface border border-light-outline-variant rounded-3xl p-6 sm:p-10 shadow-xs">
            {/* Meta Header */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className={`px-3 py-1 rounded-full text-label-sm font-semibold ${article.categoryBadge}`}>
                {article.category}
              </span>
              <span className="text-body-sm text-light-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {article.publishedAt}
              </span>
              <span className="text-body-sm text-light-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                {article.views.toLocaleString("id-ID")} kali dibaca
              </span>
            </div>

            {/* Title */}
            <h1 className="font-headline text-headline-sm sm:text-headline-lg lg:text-display-sm text-light-on-surface font-bold tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Author Bar */}
            <div className="mt-6 pt-5 pb-6 border-y border-light-outline-variant/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-light-primary text-light-on-primary font-bold flex items-center justify-center text-title-md shadow-xs">
                  {article.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-headline font-semibold text-title-md text-light-on-surface">{article.author}</p>
                  <p className="text-[12px] text-light-on-surface-variant">Tim Pengajar & Akademik ARCI Bimbel</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-light-outline text-body-sm font-label font-medium text-light-on-surface hover:bg-light-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">{copied ? "check" : "link"}</span>
                  <span>{copied ? "Tersalin!" : "Salin Link"}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - Baca selengkapnya di ARCI Bimbel: ${pageUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success text-on-success text-body-sm font-label font-semibold hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Share WA</span>
                </a>
              </div>
            </div>

            {/* Summary Highlight Box */}
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-light-primary-container/40 border border-brand-indigo/20 text-body-md text-brand-indigo-dark font-medium leading-relaxed italic">
              "{article.summary}"
            </div>

            {/* Article Body Content */}
            <div className="prose prose-slate max-w-none text-light-on-surface leading-relaxed space-y-5 text-body-md sm:text-body-lg">
              {article.content ? (
                article.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={i} className="font-headline text-title-lg sm:text-headline-sm font-bold text-light-on-surface mt-8 mb-3">
                        {para.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (para.startsWith("- ") || para.startsWith("* ")) {
                    const items = para.split("\n").map((item) => item.replace(/^[-*]\s+/, ""));
                    return (
                      <ul key={i} className="list-disc pl-6 space-y-2 text-light-on-surface my-4">
                        {items.map((it, idx) => (
                          <li key={idx} dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                        ))}
                      </ul>
                    );
                  }
                  if (/^\d+\.\s/.test(para)) {
                    const items = para.split("\n").map((item) => item.replace(/^\d+\.\s+/, ""));
                    return (
                      <ol key={i} className="list-decimal pl-6 space-y-2 text-light-on-surface my-4">
                        {items.map((it, idx) => (
                          <li key={idx} dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") }} />
                  );
                })
              ) : (
                <p>{article.summary}</p>
              )}
            </div>

            {/* Author Bio Box */}
            <div className="mt-10 p-6 rounded-2xl bg-light-surface-container-low border border-light-outline-variant flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-indigo text-white font-bold flex items-center justify-center text-headline-sm shrink-0 shadow-sm">
                {article.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-headline font-bold text-title-md text-light-on-surface">{article.author}</h4>
                <p className="text-[12px] text-light-primary font-medium mt-0.5">Penulis & Tim Kurikulum ARCI Bimbel</p>
                <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
                  Berpengalaman lebih dari 8 tahun merancang strategi drilling soal SNBT, asesmen literasi nasional, dan pendampingan siswa menuju PTN terkemuka.
                </p>
              </div>
            </div>
          </article>

          {/* Right Sidebar: CTA & Related Articles */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Consultation Sticky Card */}
            <div className="bg-gradient-to-br from-brand-indigo to-brand-indigo-dark text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <span className="px-3 py-1 rounded-full text-label-sm font-label font-bold bg-accent text-on-accent inline-block mb-3">
                Free Trial Class
              </span>
              <h3 className="font-headline font-bold text-title-lg text-white">
                Siap Tingkatkan Prestasi Belajar?
              </h3>
              <p className="text-body-sm text-light-surface-container-low mt-2 leading-relaxed">
                Gabung kelas interaktif maksimal 8 siswa bersama tutor berpengalaman lulusan UI, ITB, dan UGM.
              </p>
              <div className="mt-6 space-y-2.5">
                <Link
                  href="/pendaftaran"
                  className="w-full py-3 rounded-xl bg-accent text-on-accent font-label text-label-md font-bold hover:bg-yellow-400 transition-colors block text-center shadow-xs"
                >
                  Daftar Siswa Baru
                </Link>
                <Link
                  href="/#konsultasi"
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-label text-label-md font-semibold transition-colors block text-center border border-white/20"
                >
                  Konsultasi Gratis
                </Link>
              </div>
            </div>

            {/* Related Articles Box */}
            <div className="bg-light-surface border border-light-outline-variant rounded-3xl p-6 shadow-xs">
              <h3 className="font-headline font-bold text-title-lg text-light-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-light-primary">auto_stories</span>
                <span>Artikel Terkait</span>
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="block p-3 rounded-xl hover:bg-light-surface-container-low transition-colors group"
                  >
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-1 ${rel.categoryBadge}`}>
                      {rel.category}
                    </span>
                    <h4 className="font-headline font-semibold text-body-md text-light-on-surface group-hover:text-brand-indigo transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-light-on-surface-variant mt-1 flex items-center gap-1">
                      <span>{rel.publishedAt}</span> • <span>{rel.views} pembaca</span>
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-light-outline-variant/60 text-center">
                <Link href="/blog" className="text-body-sm font-label font-semibold text-light-primary hover:underline inline-flex items-center gap-1">
                  <span>Lihat Semua Artikel</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="bg-light-surface border-t border-light-outline-variant pt-12 pb-10 text-light-on-surface">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              Bimbingan belajar terpadu dengan kurikulum komprehensif, tutor lulusan kampus unggulan, dan pemantauan belajar siswa 360°.
            </p>
          </div>

          <div>
            <p className="font-label font-bold text-light-on-surface mb-3 text-label-lg">Program Belajar</p>
            <ul className="space-y-2 text-body-sm text-light-on-surface-variant">
              <li><Link href="/program/intensif-utbk-2026" className="hover:text-light-primary">Intensif UTBK 2026</Link></li>
              <li><Link href="/#program" className="hover:text-light-primary">Bimbel Reguler SMP</Link></li>
              <li><Link href="/#program" className="hover:text-light-primary">Bimbel Reguler SMA</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-label font-bold text-light-on-surface mb-3 text-label-lg">Navigasi</p>
            <ul className="space-y-2 text-body-sm text-light-on-surface-variant">
              <li><Link href="/blog" className="hover:text-light-primary font-semibold text-brand-indigo">Katalog Blog Edukasi</Link></li>
              <li><Link href="/#tutor" className="hover:text-light-primary">Daftar Tutor Ahli</Link></li>
              <li><Link href="/#lokasi" className="hover:text-light-primary">Cabang & Fasilitas</Link></li>
              <li><Link href="/pendaftaran" className="hover:text-light-primary">Pendaftaran Baru</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-label font-bold text-light-on-surface mb-3 text-label-lg">Kontak Resmi</p>
            <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
              Jl. Pendidikan No. 42, Kebayoran Baru, Jakarta Selatan
            </p>
            <p className="text-body-sm text-light-on-surface-variant mt-2">
              WhatsApp: +62 812-3456-7890
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-light-outline-variant flex flex-col sm:flex-row items-center justify-between text-body-sm text-light-on-surface-variant gap-3 text-center sm:text-left">
          <p>© 2026 ARCI Bimbel. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Beranda</Link>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/pendaftaran" className="hover:underline">Daftar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
