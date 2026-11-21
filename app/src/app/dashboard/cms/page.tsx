"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CmsArticleItem,
  CmsTestimonialItem,
  CmsBannerItem,
  CmsFaqItem,
  CmsMetrics,
  CmsTabType,
  CmsStatus,
} from "@/lib/cms-constants";
import {
  getCmsDataAction,
  saveArticleAction,
  createArticleAction,
  deleteArticleAction,
  saveBannerAction,
  saveTestimonialAction,
  saveFaqAction,
} from "@/app/actions/cms";

export default function CmsPage() {
  const [cmsTab, setCmsTab] = useState<CmsTabType>("articles");
  const [articles, setArticles] = useState<CmsArticleItem[]>([]);
  const [testimonials, setTestimonials] = useState<CmsTestimonialItem[]>([]);
  const [banners, setBanners] = useState<CmsBannerItem[]>([]);
  const [faqs, setFaqs] = useState<CmsFaqItem[]>([]);
  const [metrics, setMetrics] = useState<CmsMetrics>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    verifiedTestimonials: 0,
    activeBanners: 0,
    totalFaqs: 0,
  });

  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Quick Editor State
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editCategory, setEditCategory] = useState("Tips UTBK");
  const [editAuthor, setEditAuthor] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<CmsStatus>("Terbit (Live)");
  const [isSaving, setIsSaving] = useState(false);

  // New Article Modal State
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Tips UTBK");
  const [newAuthor, setNewAuthor] = useState("Tim Redaksi ARCI");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newStatus, setNewStatus] = useState<CmsStatus>("Terbit (Live)");
  const [isCreating, setIsCreating] = useState(false);

  const showToast = (message: string, type: "success" | "info" = "info") => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    const res = await getCmsDataAction();
    if (res.success) {
      setArticles(res.articles);
      setTestimonials(res.testimonials);
      setBanners(res.banners);
      setFaqs(res.faqs);
      setMetrics(res.metrics);

      if (res.articles.length > 0) {
        const initArt = res.articles[0];
        setSelectedArticleId(initArt.id);
        syncEditorFields(initArt);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const syncEditorFields = (art: CmsArticleItem) => {
    setEditTitle(art.title);
    setEditSlug(art.slug);
    setEditCategory(art.category);
    setEditAuthor(art.author);
    setEditSummary(art.summary);
    setEditContent(art.content || art.summary);
    setEditStatus(art.status);
  };

  const handleSelectArticle = (art: CmsArticleItem) => {
    setSelectedArticleId(art.id);
    syncEditorFields(art);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleId) return;

    setIsSaving(true);
    const existing = articles.find((a) => a.id === selectedArticleId);
    if (!existing) return;

    const updated: CmsArticleItem = {
      ...existing,
      title: editTitle,
      slug: editSlug,
      category: editCategory,
      author: editAuthor,
      summary: editSummary,
      content: editContent,
      status: editStatus,
      statusColor:
        editStatus === "Terbit (Live)"
          ? "bg-success/15 text-success"
          : editStatus === "Draft"
          ? "bg-warning/15 text-warning"
          : "bg-slate-200 text-slate-700",
    };

    const res = await saveArticleAction(updated);
    setIsSaving(false);

    if (res.success) {
      setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showToast(res.message, "success");
    } else {
      showToast(res.message, "info");
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Judul artikel tidak boleh kosong!", "info");
      return;
    }

    setIsCreating(true);
    const res = await createArticleAction({
      title: newTitle,
      category: newCategory,
      author: newAuthor,
      summary: newSummary,
      content: newContent,
      status: newStatus,
    });
    setIsCreating(false);

    if (res.success && res.article) {
      setArticles((prev) => [res.article!, ...prev]);
      setSelectedArticleId(res.article.id);
      syncEditorFields(res.article);
      setIsNewArticleOpen(false);
      setNewTitle("");
      setNewSummary("");
      setNewContent("");
      showToast(res.message, "success");
    } else {
      showToast(res.message, "info");
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return;

    const res = await deleteArticleAction(id);
    if (res.success) {
      const remaining = articles.filter((a) => a.id !== id);
      setArticles(remaining);
      if (remaining.length > 0) {
        setSelectedArticleId(remaining[0].id);
        syncEditorFields(remaining[0]);
      }
      showToast(res.message, "success");
    } else {
      showToast(res.message, "info");
    }
  };

  const handleToggleBanner = async (banner: CmsBannerItem) => {
    const updated = { ...banner, isActive: !banner.isActive };
    const res = await saveBannerAction(updated);
    if (res.success) {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b)));
      showToast(`Status banner "${banner.title}" berhasil diubah!`, "success");
    }
  };

  const handleToggleTestimonial = async (testi: CmsTestimonialItem) => {
    const updated = { ...testi, isVerified: !testi.isVerified };
    const res = await saveTestimonialAction(updated);
    if (res.success) {
      setTestimonials((prev) => prev.map((t) => (t.id === testi.id ? updated : t)));
      showToast(`Verifikasi testimoni ${testi.name} berhasil diperbarui!`, "success");
    }
  };

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[19px] ${
                toastMsg.type === "success" ? "text-success" : "text-brand-indigo"
              }`}
            >
              {toastMsg.type === "success" ? "check_circle" : "info"}
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg.message}</span>
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
            Kelola banner promo, artikel tips belajar, testimoni siswa, dan FAQ landing page secara langsung.
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
            <div className="text-label-sm text-light-on-surface-variant font-medium">Total Artikel Terbit</div>
            <div className="text-headline-sm font-bold text-brand-indigo mt-0.5">
              {metrics.publishedArticles} Artikel Live
            </div>
          </div>
          <span className="material-symbols-outlined text-success text-[28px]">published_with_changes</span>
        </div>

        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Draft Menunggu Review</div>
            <div className="text-headline-sm font-bold text-warning mt-0.5">
              {metrics.draftArticles} Draft
            </div>
          </div>
          <span className="material-symbols-outlined text-warning text-[28px]">edit_document</span>
        </div>

        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Testimoni Terverifikasi</div>
            <div className="text-headline-sm font-bold text-light-on-surface mt-0.5">
              {metrics.verifiedTestimonials} Siswa &amp; Wali
            </div>
          </div>
          <span className="material-symbols-outlined text-light-primary text-[28px]">format_quote</span>
        </div>

        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Banner Promo Aktif</div>
            <div className="text-headline-sm font-bold text-success mt-0.5">
              {metrics.activeBanners} Campaign
            </div>
          </div>
          <span className="material-symbols-outlined text-success text-[28px]">campaign</span>
        </div>
      </section>

      {/* TAB 1: ARTIKEL & PANDUAN BELAJAR */}
      {cmsTab === "articles" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left: Content Table (8 cols) */}
          <div className="xl:col-span-8 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                  Daftar Artikel &amp; Panduan Belajar
                </h2>
                <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                  Dipublikasikan di landing page publik untuk edukasi calon siswa dan optimasi SEO.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewArticleOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-semibold hover:bg-brand-indigo-dark shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Tulis Artikel Baru</span>
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-light-outline text-body-sm font-semibold text-light-on-surface hover:bg-light-surface-container"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Buka Web</span>
                </Link>
              </div>
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
                    const isSelected = art.id === selectedArticle?.id;
                    return (
                      <tr
                        key={art.id}
                        onClick={() => handleSelectArticle(art)}
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
                          <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleSelectArticle(art)}
                              className="px-2.5 py-1 rounded border border-light-outline text-[11px] font-semibold hover:bg-light-surface"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteArticle(art.id, art.title)}
                              className="px-2 py-1 rounded border border-danger/30 text-danger hover:bg-danger/10 text-[11px]"
                              title="Hapus Artikel"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Quick Editor Panel (4 cols) */}
          {selectedArticle && (
            <div className="xl:col-span-4 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
                <div>
                  <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                    Editor Konten Cepat
                  </h3>
                  <span className="text-[11px] text-light-on-surface-variant font-mono">
                    ID: {selectedArticle.id}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-label-sm font-bold ${selectedArticle.statusColor}`}>
                  {selectedArticle.status}
                </span>
              </div>

              <form onSubmit={handleSaveArticle} className="flex flex-col gap-3 text-body-sm">
                <div>
                  <label className="font-semibold block mb-1">Judul Artikel</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Kategori</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface"
                    >
                      <option value="Tips UTBK">Tips UTBK</option>
                      <option value="Konseling Karir">Konseling Karir</option>
                      <option value="Metode Belajar">Metode Belajar</option>
                      <option value="Persiapan Ujian">Persiapan Ujian</option>
                      <option value="Pengumuman">Pengumuman</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Status Publikasi</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as CmsStatus)}
                      className="w-full px-2.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface"
                    >
                      <option value="Terbit (Live)">Terbit (Live)</option>
                      <option value="Draft">Draft</option>
                      <option value="Arsip">Arsip</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Penulis</label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-light-outline font-mono text-[12px] bg-light-surface"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Ringkasan Meta SEO</label>
                  <textarea
                    rows={2}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Isi Konten Artikel</label>
                  <textarea
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-light-outline-variant">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-2.5 rounded-xl bg-light-primary text-light-on-primary font-semibold shadow-xs hover:bg-brand-indigo-dark transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan & Publikasikan"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TESTIMONI SISWA & WALI */}
      {cmsTab === "testimonials" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-light-outline-variant">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Testimoni Siswa &amp; Orang Tua
              </h2>
              <p className="text-body-sm text-light-on-surface-variant">
                Menampilkan testimoni riil siswa yang lolos PTN favorit dan ulasan kepuasan wali murid.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast("Testimoni baru dari form review alumni akan otomatis diverifikasi.", "info")}
              className="px-3.5 py-2 rounded-xl bg-light-primary text-light-on-primary text-body-sm font-semibold hover:bg-brand-indigo-dark self-start sm:self-auto"
            >
              + Tambah Testimoni Manual
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl border border-light-outline-variant bg-light-surface-soft flex flex-col justify-between gap-4 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px]">
                          star
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleTestimonial(t)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        t.isVerified ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                      }`}
                    >
                      {t.isVerified ? "Terverifikasi ✓" : "Pending Verifikasi"}
                    </button>
                  </div>
                  <p className="text-body-sm text-light-on-surface italic mt-3 leading-relaxed">
                    “{t.quote}”
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-light-outline-variant/60">
                  <div className="w-9 h-9 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {t.avatarText}
                  </div>
                  <div>
                    <h4 className="font-bold text-body-sm text-light-on-surface">{t.name}</h4>
                    <p className="text-[11px] text-light-on-surface-variant">{t.role}</p>
                    <p className="text-[10px] text-brand-indigo font-semibold">{t.program}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BANNER PROMO */}
      {cmsTab === "banners" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-6 space-y-6">
          <div className="pb-4 border-b border-light-outline-variant">
            <h2 className="font-headline font-bold text-title-md text-light-on-surface">
              Banner Promosi &amp; Pengumuman Beranda
            </h2>
            <p className="text-body-sm text-light-on-surface-variant">
              Banner sorotan yang tampil di bagian atas landing page dan promosi program unggulan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className={`p-6 rounded-2xl text-white bg-gradient-to-br ${b.gradient} flex flex-col justify-between gap-4 shadow-md relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 tracking-wider">
                      {b.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleBanner(b)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                        b.isActive ? "bg-success text-white" : "bg-white/30 text-white/80"
                      }`}
                    >
                      {b.isActive ? "Aktif Tampil" : "Non-aktif"}
                    </button>
                  </div>

                  <h3 className="font-headline font-bold text-title-lg mt-3 text-white">
                    {b.title}
                  </h3>
                  <p className="text-body-sm text-white/80 mt-1 leading-relaxed">
                    {b.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/20">
                  <span className="text-xs text-white/70 font-mono">Tautan: {b.ctaLink}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-white text-brand-indigo font-bold text-xs shadow-xs">
                    {b.ctaText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQ (TANYA JAWAB UMUM) */}
      {cmsTab === "faqs" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-light-outline-variant">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Tanya Jawab Umum (FAQ)
              </h2>
              <p className="text-body-sm text-light-on-surface-variant">
                Daftar pertanyaan yang paling sering diajukan orang tua dan calon siswa di website publik.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast("Fitur penambahan FAQ kustom siap digunakan.", "info")}
              className="px-3.5 py-2 rounded-xl bg-light-primary text-light-on-primary text-body-sm font-semibold hover:bg-brand-indigo-dark self-start sm:self-auto"
            >
              + Tambah Pertanyaan FAQ
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl border border-light-outline-variant bg-light-surface-soft space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-light-primary-container text-light-primary flex items-center justify-center font-bold text-xs">
                      {f.order}
                    </span>
                    <h3 className="font-headline font-bold text-body-md text-light-on-surface">
                      {f.question}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-light-surface-container text-light-on-surface-variant">
                    {f.category}
                  </span>
                </div>
                <p className="text-body-sm text-light-on-surface-variant pl-8 leading-relaxed">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: TULIS ARTIKEL BARU */}
      {isNewArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
              <div className="flex items-center gap-2 text-brand-indigo">
                <span className="material-symbols-outlined text-[22px]">post_add</span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Tulis Artikel &amp; Tips Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewArticleOpen(false)}
                className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="p-6 space-y-3.5 text-body-sm">
              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="cth: Rahasia Lolos SNBT Kedokteran 2026..."
                  className="w-full px-3 py-2 rounded-lg border border-light-outline bg-light-surface text-light-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-light-outline bg-light-surface text-light-on-surface"
                  >
                    <option value="Tips UTBK">Tips UTBK</option>
                    <option value="Konseling Karir">Konseling Karir</option>
                    <option value="Metode Belajar">Metode Belajar</option>
                    <option value="Persiapan Ujian">Persiapan Ujian</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CmsStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-light-outline bg-light-surface text-light-on-surface"
                  >
                    <option value="Terbit (Live)">Terbit (Live)</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Nama Penulis
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-light-outline bg-light-surface text-light-on-surface"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Ringkasan Artikel (Meta Description)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk preview dan cuplikan Google SEO..."
                  className="w-full px-3 py-2 rounded-lg border border-light-outline bg-light-surface text-light-on-surface"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Isi Konten Utama
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tuliskan isi panduan, rumus praktis, atau tips belajar di sini..."
                  className="w-full px-3 py-2 rounded-lg border border-light-outline bg-light-surface text-light-on-surface"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsNewArticleOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-light-outline text-light-on-surface font-semibold hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-bold hover:bg-brand-indigo-dark disabled:opacity-50"
                >
                  {isCreating ? "Menyimpan..." : "Publikasikan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
