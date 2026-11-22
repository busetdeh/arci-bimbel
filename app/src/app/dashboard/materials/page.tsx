"use client";

import React, { useState, useEffect } from "react";
import {
  MaterialItem,
  MaterialClassOption,
  MaterialStats,
  getMaterialsAction,
  createMaterialAction,
  updateMaterialAction,
  deleteMaterialAction,
} from "@/app/actions/materials";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [classes, setClasses] = useState<MaterialClassOption[]>([]);
  const [stats, setStats] = useState<MaterialStats>({
    totalMaterials: 0,
    totalModules: 0,
    totalTasks: 0,
    totalPractices: 0,
    totalSolutions: 0,
    classesCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    classId: "",
    title: "",
    fileUrl: "",
    fileSize: "2.5 MB",
    type: "modul" as "modul" | "latihan" | "tugas" | "solusi",
    dueDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    const res = await getMaterialsAction({
      classId: selectedClassId,
      type: selectedType,
      search: searchQuery,
    });

    if (res.success) {
      setMaterials(res.materials);
      setClasses(res.classes);
      setStats(res.stats);
      if (res.classes.length > 0 && !formData.classId) {
        setFormData((prev) => ({ ...prev, classId: res.classes[0].id }));
      }
    } else {
      showToast(res.message || "Gagal memuat data materi", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedClassId, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openCreateModal = () => {
    setFormData({
      classId: classes.length > 0 ? classes[0].id : "",
      title: "",
      fileUrl: "",
      fileSize: "2.5 MB",
      type: "modul",
      dueDate: "",
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (mat: MaterialItem) => {
    setSelectedMaterial(mat);
    setFormData({
      classId: mat.classId,
      title: mat.title,
      fileUrl: mat.fileUrl,
      fileSize: mat.fileSize || "2.5 MB",
      type: mat.type,
      dueDate: mat.dueDate || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (mat: MaterialItem) => {
    setSelectedMaterial(mat);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createMaterialAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      showToast(res.message, "success");
      setIsCreateModalOpen(false);
      loadData();
    } else {
      showToast(res.message, "error");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;
    setIsSubmitting(true);
    const res = await updateMaterialAction(selectedMaterial.id, formData);
    setIsSubmitting(false);

    if (res.success) {
      showToast(res.message, "success");
      setIsEditModalOpen(false);
      setSelectedMaterial(null);
      loadData();
    } else {
      showToast(res.message, "error");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedMaterial) return;
    setIsSubmitting(true);
    const res = await deleteMaterialAction(selectedMaterial.id);
    setIsSubmitting(false);

    if (res.success) {
      showToast(res.message, "success");
      setIsDeleteModalOpen(false);
      setSelectedMaterial(null);
      loadData();
    } else {
      showToast(res.message, "error");
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "modul":
        return {
          label: "Modul Belajar",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "menu_book",
        };
      case "tugas":
        return {
          label: "Tugas Siswa",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: "assignment",
        };
      case "latihan":
        return {
          label: "Latihan Soal",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: "quiz",
        };
      case "solusi":
        return {
          label: "Kunci & Solusi",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: "lightbulb",
        };
      default:
        return {
          label: "Materi",
          color: "bg-slate-100 text-slate-800 border-slate-200",
          icon: "description",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-body-sm font-medium ${
              toastMsg.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-red-50 text-red-900 border-red-200"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toastMsg.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-headline-sm text-light-on-surface">
            Materi &amp; Tugas Kelas
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Kelola modul digital, bank soal latihan, dan penugasan per rombongan belajar.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-semibold hover:bg-brand-indigo-dark transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          <span>Unggah Materi / Tugas</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">Total Dokumen</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">folder</span>
            </div>
          </div>
          <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-2">
            {stats.totalMaterials}
          </p>
          <p className="text-[11px] text-light-on-surface-variant mt-0.5">
            {stats.totalModules} modul pembelajaran
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">Tugas Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment</span>
            </div>
          </div>
          <p className="font-headline font-bold text-headline-sm text-amber-700 mt-2">
            {stats.totalTasks}
          </p>
          <p className="text-[11px] text-light-on-surface-variant mt-0.5">
            Dengan tenggat waktu siswa
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">Latihan &amp; Kunci</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">quiz</span>
            </div>
          </div>
          <p className="font-headline font-bold text-headline-sm text-emerald-700 mt-2">
            {stats.totalPractices + stats.totalSolutions}
          </p>
          <p className="text-[11px] text-light-on-surface-variant mt-0.5">
            Bank soal dan pembahasan
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">Kelas Terlayani</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">class</span>
            </div>
          </div>
          <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-2">
            {stats.classesCount}
          </p>
          <p className="text-[11px] text-light-on-surface-variant mt-0.5">
            Rombel aktif di sistem
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-light-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Cari materi, judul tugas, kelas, atau tutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-light-outline bg-light-surface text-body-sm text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
            />
          </form>

          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-class" className="text-label-sm text-light-on-surface-variant whitespace-nowrap font-medium">
              Rombel:
            </label>
            <select
              id="filter-class"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-body-sm text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary font-medium"
            >
              <option value="all">Semua Rombongan Belajar</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name} ({c.programLevel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-light-outline-variant/60">
          {[
            { id: "all", label: "Semua Kategori" },
            { id: "modul", label: "Modul Belajar" },
            { id: "tugas", label: "Tugas Siswa" },
            { id: "latihan", label: "Latihan Soal" },
            { id: "solusi", label: "Kunci & Solusi" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-label-sm font-label transition-colors whitespace-nowrap ${
                selectedType === tab.id
                  ? "bg-light-primary text-light-on-primary font-bold shadow-2xs"
                  : "text-light-on-surface-variant hover:bg-light-surface-container-low font-medium"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List Content */}
      {isLoading ? (
        <div className="py-16 text-center bg-light-surface rounded-2xl border border-light-outline-variant">
          <div className="w-8 h-8 border-3 border-light-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-body-sm text-light-on-surface-variant">Memuat daftar materi &amp; tugas...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="py-16 text-center bg-light-surface rounded-2xl border border-light-outline-variant p-6">
          <span className="material-symbols-outlined text-[48px] text-light-outline mb-2">
            folder_off
          </span>
          <h3 className="font-headline font-bold text-title-lg text-light-on-surface">
            Belum Ada Materi atau Tugas
          </h3>
          <p className="text-body-sm text-light-on-surface-variant max-w-sm mx-auto mt-1">
            Belum ada dokumen materi untuk filter kelas atau jenis yang dipilih.
          </p>
          <button
            onClick={openCreateModal}
            type="button"
            className="mt-4 px-4 py-2 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-semibold hover:bg-brand-indigo-dark transition-colors"
          >
            Unggah Materi Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((mat) => {
            const badge = getTypeBadge(mat.type);
            return (
              <div
                key={mat.id}
                className="bg-light-surface border border-light-outline-variant rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Type Badge & Class Code */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${badge.color}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-light-surface-container text-brand-indigo font-label">
                      {mat.classCode}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-headline font-bold text-title-md text-light-on-surface leading-snug line-clamp-2">
                    {mat.title}
                  </h3>

                  {/* Class Name */}
                  <p className="text-[12px] text-light-primary font-medium mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">class</span>
                    <span>{mat.className}</span>
                  </p>

                  {/* Task Deadline if applicable */}
                  {mat.type === "tugas" && mat.dueDate && (
                    <div className="mt-3 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11.5px] font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-amber-700">timer</span>
                      <span>Tenggat: <strong>{new Date(mat.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
                    </div>
                  )}

                  {/* Meta details */}
                  <div className="mt-4 pt-3 border-t border-light-outline-variant/60 flex items-center justify-between text-[11px] text-light-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">attach_file</span>
                      {mat.fileSize}
                    </span>
                    <span>Diunggah {mat.formattedDate}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-light-outline-variant/60 flex items-center justify-between gap-2">
                  <a
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-light-primary-container text-light-primary hover:bg-light-primary hover:text-light-on-primary transition-colors text-label-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Buka File</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(mat)}
                      type="button"
                      className="p-1.5 rounded-lg text-light-on-surface-variant hover:text-brand-indigo hover:bg-light-surface-container transition-colors"
                      title="Edit materi"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(mat)}
                      type="button"
                      className="p-1.5 rounded-lg text-light-on-surface-variant hover:text-danger hover:bg-red-50 transition-colors"
                      title="Hapus materi"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Tambah Materi / Tugas Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
              <div className="flex items-center gap-2 text-brand-indigo">
                <span className="material-symbols-outlined text-[22px]">upload_file</span>
                <h3 className="font-headline font-bold text-title-lg text-light-on-surface">
                  Unggah Materi &amp; Tugas Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-body-sm">
              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Pilih Rombongan Belajar / Kelas <span className="text-danger">*</span>
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name} ({c.programLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Jenis Dokumen <span className="text-danger">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                >
                  <option value="modul">Modul Belajar (Materi Pelajaran)</option>
                  <option value="tugas">Tugas Siswa (Dengan Tenggat)</option>
                  <option value="latihan">Latihan Soal &amp; Bank Soal</option>
                  <option value="solusi">Kunci Jawaban &amp; Pembahasan</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Judul Materi / Tugas <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul 02: Trik Aljabar &amp; Persamaan Linear"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Tautan File Dokumen / URL Cloud <span className="text-danger">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/... atau link PDF materi"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                    Estimasi Ukuran File
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 3.2 MB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>

                {formData.type === "tugas" && (
                  <div>
                    <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                      Tenggat Waktu (Due Date) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      required={formData.type === "tugas"}
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-light-outline-variant flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-light-outline text-light-on-surface font-label text-label-md font-semibold hover:bg-light-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-semibold hover:bg-brand-indigo-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>Unggah Materi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Materi / Tugas */}
      {isEditModalOpen && selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
              <div className="flex items-center gap-2 text-brand-indigo">
                <span className="material-symbols-outlined text-[22px]">edit_document</span>
                <h3 className="font-headline font-bold text-title-lg text-light-on-surface">
                  Edit Materi / Tugas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-body-sm">
              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Rombongan Belajar / Kelas
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name} ({c.programLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Jenis Dokumen
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                >
                  <option value="modul">Modul Belajar (Materi Pelajaran)</option>
                  <option value="tugas">Tugas Siswa (Dengan Tenggat)</option>
                  <option value="latihan">Latihan Soal &amp; Bank Soal</option>
                  <option value="solusi">Kunci Jawaban &amp; Pembahasan</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Judul Materi / Tugas
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Tautan File Dokumen / URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                    Ukuran File
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>

                {formData.type === "tugas" && (
                  <div>
                    <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                      Tenggat Waktu
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-light-outline bg-light-surface text-light-on-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-light-outline-variant flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-light-outline text-light-on-surface font-label text-label-md font-semibold hover:bg-light-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-semibold hover:bg-brand-indigo-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus */}
      {isDeleteModalOpen && selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-danger flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[28px]">delete</span>
            </div>
            <h3 className="font-headline font-bold text-title-lg text-light-on-surface">
              Hapus Materi Ini?
            </h3>
            <p className="text-body-sm text-light-on-surface-variant mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>"{selectedMaterial.title}"</strong>? Siswa di kelas terkait tidak akan dapat lagi mengakses file ini.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-light-outline text-light-on-surface font-label text-label-md font-semibold hover:bg-light-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-danger text-white font-label text-label-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                <span>Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
