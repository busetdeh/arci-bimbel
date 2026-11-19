"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryBadge: string;
  status: "Terbit (Live)" | "Draft" | "Arsip";
  statusColor: string;
  views: number;
  publishedAt: string;
  author: string;
  summary: string;
}

const initialArticles: ArticleItem[] = [
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
    author: "Budi Pratama, S.Si.",
    summary:
      "Panduan komprehensif membedah tipe soal penalaran matematika berstandar IRT nasional dengan rumus praktis ARCI.",
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
  },
  {
    id: "ART-03",
    title: "5 Kebiasaan Belajar Siswa Berprestasi di Tingkat SMP",
    slug: "5-kebiasaan-belajar-siswa-smp",
    category: "Metode Belajar",
    categoryBadge: "bg-emerald-100 text-emerald-800",
    status: "Draft",
    statusColor: "bg-warning/15 text-warning",
    views: 0,
    publishedAt: "Dalam Penulisan",
    author: "Siti Rahma, M.Pd.",
    summary:
      "Cara mengatur jadwal belajar mandiri, teknik active recall, dan pemanfaatan modul ringkas untuk persiapan ujian sekolah.",
  },
];

export default function CmsPage() {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("ART-01");
  const [cmsTab, setCmsTab] = useState<"articles" | "testimonials" | "banners" | "faqs">("articles");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedArticle =
    articles.find((a) => a.id === selectedArticleId) || articles[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Perubahan konten artikel berhasil disimpan & dipublikasikan ke website!");
  };

  return (
    <>
      {toastMsg && (
        <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px] text-success">
              check_circle
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 rounded hover:bg-black/5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Title and Section Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-light-on-surface-variant">
            <span>Website Profil</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-semibold text-light-primary">CMS Konten Publik</span>
          </div>
          <h1 className="text-headline-sm sm:text-headline-md font-headline font-bold text-light-on-surface mt-1">
            Manajemen Konten &amp; Publikasi Website
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Kelola banner promo, artikel tips belajar, testimoni siswa, profil pengajar, dan FAQ tanpa ubah kode.
          </p>
        </div>

        {/* CMS Tab Navigation */}
        <div className="inline-flex p-1 bg-light-surface-container rounded-xl shrink-0 overflow-x-auto shadow-2xs">
          {(["articles", "testimonials", "banners", "faqs"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCmsTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-body-sm font-semibold whitespace-nowrap transition-all ${
                cmsTab === tab
                  ? "bg-light-surface text-light-primary shadow-xs"
                  : "text-light-on-surface-variant hover:text-light-on-surface"
              }`}
            >
              {tab === "articles"
                ? "Artikel & Berita"
                : tab === "testimonials"
                ? "Testimoni"
                : tab === "banners"
                ? "Banner Promo"
                : "FAQ"}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Total Konten Terbit</div>
            <div className="text-headline-sm font-bold text-brand-indigo mt-0.5">24 Artikel</div>
          </div>
          <span className="material-symbols-outlined text-success text-[28px]">published_with_changes</span>
        </div>

        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Draft Menunggu Review</div>
            <div className="text-headline-sm font-bold text-warning mt-0.5">3 Draft</div>
          </div>
          <span className="material-symbols-outlined text-warning text-[28px]">edit_document</span>
        </div>

        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Testimoni Terverifikasi</div>
            <div className="text-headline-sm font-bold text-light-on-surface mt-0.5">18 Siswa/Wali</div>
          </div>
          <span className="material-symbols-outlined text-light-primary text-[28px]">format_quote</span>
        </div>

        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Status SEO Sitemap</div>
            <div className="text-headline-sm font-bold text-success mt-0.5">100% Valid</div>
          </div>
          <span className="material-symbols-outlined text-success text-[28px]">task_alt</span>
        </div>
      </section>

      {/* Main Layout: Content Table & Editor/Inspector Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Content Table (8 cols) */}
        <div className="xl:col-span-8 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Daftar Artikel &amp; Panduan Belajar
              </h2>
              <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                Dipublikasikan di landing page publik untuk edukasi calon siswa dan optimasi SEO.
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-light-outline text-body-sm font-semibold text-light-on-surface hover:bg-light-surface-container"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span>Buka Web</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="bg-light-surface-container border-b border-light-outline-variant text-label-sm font-bold text-light-on-surface">
                  <th className="p-4">JUDUL &amp; SLUG</th>
                  <th className="p-4">KATEGORI</th>
                  <th className="p-4 text-center">STATUS</th>
                  <th className="p-4 text-center">PEMBACA</th>
                  <th className="p-4 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant">
                {articles.map((art) => {
                  const isSelected = art.id === selectedArticle.id;
                  return (
                    <tr
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-light-primary-container/20 border-l-4 border-light-primary"
                          : "hover:bg-light-surface-container"
                      }`}
                    >
                      <td className="p-4">
                        <span className="font-bold text-light-on-surface block">{art.title}</span>
                        <span className="text-[11px] text-light-on-surface-variant font-mono">
                          /{art.slug}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${art.categoryBadge}`}>
                          {art.category}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${art.statusColor}`}>
                          {art.status}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-brand-indigo">
                        {art.views.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded border border-light-outline text-[11px] font-semibold hover:bg-light-surface"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Editor Panel (4 cols) */}
        <div className="xl:col-span-4 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-4 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
            <h3 className="font-headline font-bold text-title-md text-light-on-surface">
              Editor Konten Cepat
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-label-sm font-bold ${selectedArticle.statusColor}`}>
              {selectedArticle.status}
            </span>
          </div>

          <form onSubmit={handleSaveArticle} className="flex flex-col gap-3 text-body-sm">
            <div>
              <label className="font-semibold block mb-1">Judul Artikel</label>
              <input
                type="text"
                defaultValue={selectedArticle.title}
                className="w-full px-3 py-2 rounded-lg border border-light-outline"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Slug URL</label>
              <input
                type="text"
                defaultValue={selectedArticle.slug}
                className="w-full px-3 py-2 rounded-lg border border-light-outline font-mono text-[12px]"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Ringkasan Meta SEO</label>
              <textarea
                rows={3}
                defaultValue={selectedArticle.summary}
                className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-light-outline-variant">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-light-primary text-light-on-primary font-semibold shadow-xs hover:bg-brand-indigo-dark"
              >
                Simpan &amp; Publikasikan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
