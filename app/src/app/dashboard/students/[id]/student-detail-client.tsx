"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  getStudentDetailAction,
  updateStudentStatusAction,
  updateStudentProfileAction,
} from "@/app/actions/students";
import {
  StudentItem,
  StudentStatus,
  STUDENT_STATUS_CONFIG,
} from "@/lib/student-constants";

interface TryoutScore {
  subject: string;
  scoreTO3: number;
  scoreTO4: number;
  trend: string;
  status: string;
}

const tryoutScores: TryoutScore[] = [
  {
    subject: "Penalaran Umum (TPS)",
    scoreTO3: 680,
    scoreTO4: 725,
    trend: "+45 ↑",
    status: "Aman (Target Kedokteran UI)",
  },
  {
    subject: "Pengetahuan Kuantitatif",
    scoreTO3: 650,
    scoreTO4: 710,
    trend: "+60 ↑",
    status: "Aman (Target FK)",
  },
  {
    subject: "Literasi Bahasa Indonesia",
    scoreTO3: 710,
    scoreTO4: 730,
    trend: "+20 ↑",
    status: "Sangat Baik",
  },
  {
    subject: "Literasi Bahasa Inggris",
    scoreTO3: 640,
    scoreTO4: 690,
    trend: "+50 ↑",
    status: "Meningkat Pesat",
  },
  {
    subject: "Penalaran Matematika",
    scoreTO3: 620,
    scoreTO4: 705,
    trend: "+85 ↑",
    status: "Lolos Ambang Batas",
  },
];

export default function StudentDetailClient({ id }: { id: string }) {
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<"academic" | "attendance" | "billing" | "documents">("academic");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: "",
    schoolOrigin: "",
    targetUniversity: "",
    targetMajor: "",
    status: "active" as StudentStatus,
  });

  const loadStudent = async () => {
    setIsLoading(true);
    try {
      const res = await getStudentDetailAction(id);
      if (res.success && res.student) {
        setStudent(res.student);
        setEditForm({
          fullName: res.student.name,
          schoolOrigin: res.student.school.split(" • ")[0] || res.student.school,
          targetUniversity: res.student.targetUniversity || "",
          targetMajor: res.student.targetMajor || "",
          status: res.student.status,
        });
      } else {
        showToast(res.message || "Gagal memuat profil siswa.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Terjadi kesalahan saat memuat data siswa.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleStatusChange = async (newStatus: StudentStatus) => {
    if (!student) return;

    const previousStatus = student.status;
    const statusMeta = STUDENT_STATUS_CONFIG[newStatus];

    // Optimistic UI update
    setStudent({
      ...student,
      status: newStatus,
      statusLabel: statusMeta.label,
      statusBadge: statusMeta.badge,
    });
    setEditForm((prev) => ({ ...prev, status: newStatus }));

    setIsUpdatingStatus(true);
    startTransition(async () => {
      try {
        const res = await updateStudentStatusAction(student.id, newStatus);
        if (res.success) {
          showToast(res.message, "success");
        } else {
          setStudent((prev) => prev ? { ...prev, status: previousStatus } : null);
          showToast(res.message, "error");
        }
      } catch (err: any) {
        setStudent((prev) => prev ? { ...prev, status: previousStatus } : null);
        showToast(err?.message || "Gagal memperbarui status siswa.", "error");
      } finally {
        setIsUpdatingStatus(false);
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    startTransition(async () => {
      try {
        const res = await updateStudentProfileAction(student.id, editForm);
        if (res.success) {
          showToast(res.message, "success");
          setIsEditModalOpen(false);
          await loadStudent();
        } else {
          showToast(res.message, "error");
        }
      } catch (err: any) {
        showToast(err?.message || "Gagal menyimpan perubahan profil.", "error");
      }
    });
  };

  if (isLoading && !student) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-light-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-sm text-light-on-surface-variant font-medium">
            Memuat profil 360° data siswa...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center bg-light-surface rounded-2xl border border-light-outline-variant">
        <span className="material-symbols-outlined text-[48px] text-light-outline mb-2">person_off</span>
        <h2 className="font-headline font-bold text-title-lg text-light-on-surface">Data Siswa Tidak Ditemukan</h2>
        <p className="text-body-sm text-light-on-surface-variant mt-1 mb-4">
          Data siswa dengan ID atau NISN &quot;{id}&quot; tidak dapat ditemukan di database.
        </p>
        <Link
          href="/dashboard/students"
          className="px-4 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold text-body-sm inline-flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Direktori Siswa</span>
        </Link>
      </div>
    );
  }

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      {toastMsg && (
        <div
          className={`p-3.5 rounded-xl border text-body-sm flex items-center justify-between gap-3 shadow-xs transition-all ${
            toastMsg.type === "error"
              ? "bg-red-50 border-red-200 text-danger"
              : toastMsg.type === "success"
              ? "bg-green-50 border-green-200 text-success"
              : "border-light-outline-variant bg-light-surface text-light-on-surface"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">
              {toastMsg.type === "error" ? "error" : toastMsg.type === "success" ? "check_circle" : "info"}
            </span>
            <span className="font-medium">{toastMsg.text}</span>
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

      {/* Navigation Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-semibold transition-colors shadow-2xs w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Direktori Siswa</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditForm({
                fullName: student.name,
                schoolOrigin: student.school.split(" • ")[0] || student.school,
                targetUniversity: student.targetUniversity || "",
                targetMajor: student.targetMajor || "",
                status: student.status,
              });
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Edit Profil &amp; Status</span>
          </button>
        </div>
      </div>

      {/* Top Student Header Card with Integrated Status Updater */}
      <div className="bg-light-surface p-5 sm:p-6 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-light-primary text-light-on-primary font-headline font-bold text-headline-sm sm:text-headline-md flex items-center justify-center shadow-xs shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className="text-headline-sm font-headline font-bold text-light-on-surface">
                {student.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-label-sm font-bold inline-flex items-center gap-1 ${student.statusBadge}`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {STUDENT_STATUS_CONFIG[student.status]?.icon || "info"}
                </span>
                <span>{student.statusLabel}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800">
                NISN: {student.nisn}
              </span>
            </div>
            <p className="text-body-sm text-light-on-surface-variant mt-1">
              {student.school} {student.targetUniversity ? `• Target: ${student.targetUniversity}` : ""}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[12px] text-light-on-surface-variant mt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-light-primary">
                  person
                </span>{" "}
                Wali: {student.parent}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">
                  call
                </span>{" "}
                {student.parentPhone}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-light-primary">
                  domain
                </span>{" "}
                {student.branch}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Status Dropdown */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-light-outline-variant">
          {/* Status Quick Updater */}
          <div className="flex flex-col items-start lg:items-end gap-1">
            <span className="text-[11px] font-label text-light-on-surface-variant font-semibold uppercase flex items-center gap-1">
              <span>Status Akademik</span>
              {isUpdatingStatus && (
                <span className="text-light-primary flex items-center gap-0.5 font-normal lowercase">
                  <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
                  menyimpan...
                </span>
              )}
            </span>
            <select
              value={student.status}
              disabled={isUpdatingStatus || isPending}
              onChange={(e) => handleStatusChange(e.target.value as StudentStatus)}
              className="px-3 py-1.5 rounded-lg border border-light-outline text-body-sm font-semibold bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary transition-colors cursor-pointer"
            >
              <option value="active">🟢 Siswa Aktif</option>
              <option value="graduated">🎓 Lulus / Selesai Program</option>
              <option value="inactive">🔴 Tidak Selesai / Mengundurkan Diri</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/62${student.parentPhone.replace(/[^0-9]/g, "").slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-light-outline hover:bg-light-surface-container font-label text-body-sm font-semibold text-light-on-surface shadow-2xs transition-colors"
            >
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">chat</span>
              <span>Hubungi Wali</span>
            </a>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Rapor Belajar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-light-outline-variant bg-light-surface rounded-t-xl px-2 sm:px-4 overflow-x-auto shadow-2xs">
        {[
          { key: "academic", label: "Perkembangan Akademik & Tryout", icon: "analytics" },
          { key: "attendance", label: `Riwayat Presensi (${student.attendance})`, icon: "fact_check" },
          { key: "billing", label: "Tagihan & Invoice SPP", icon: "receipt_long" },
          { key: "documents", label: "Berkas & Rombel Siswa", icon: "folder_shared" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 sm:px-5 py-3 border-b-2 font-semibold text-body-sm flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "border-light-primary text-light-primary"
                : "border-transparent text-light-on-surface-variant hover:text-light-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      {activeTab === "academic" && (
        <div className="flex flex-col gap-6">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-light-outline-variant pb-4">
              <div>
                <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
                  Riwayat Skor Tryout Akademik
                </h2>
                <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                  Grafik skor simulasi berdasarkan target {student.targetUniversity || "PTN Favorit"} ({student.targetMajor || "Program Pilihan"}).
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-label-sm text-light-on-surface-variant font-medium">
                  Skor Rata-rata Terakhir
                </span>
                <div className="text-headline-sm font-bold text-brand-indigo mt-0.5">
                  712.5 / 1000
                </div>
              </div>
            </div>

            <div className="border border-light-outline-variant rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-body-sm">
                  <thead>
                    <tr className="bg-light-surface-container border-b border-light-outline-variant text-label-sm font-bold text-light-on-surface">
                      <th className="p-3.5">SUBTES UJIAN</th>
                      <th className="p-3.5 text-center">SKOR TO #3</th>
                      <th className="p-3.5 text-center">SKOR TO #4</th>
                      <th className="p-3.5 text-center">TREN</th>
                      <th className="p-3.5">STATUS KELULUSAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-outline-variant">
                    {tryoutScores.map((score, i) => (
                      <tr key={i} className="hover:bg-light-surface-soft transition-colors">
                        <td className="p-3.5 font-semibold text-light-on-surface">
                          {score.subject}
                        </td>
                        <td className="p-3.5 text-center text-light-on-surface-variant">
                          {score.scoreTO3}
                        </td>
                        <td className="p-3.5 text-center font-bold text-brand-indigo">
                          {score.scoreTO4}
                        </td>
                        <td className="p-3.5 text-center text-success font-semibold">
                          {score.trend}
                        </td>
                        <td className="p-3.5 text-light-on-surface font-medium">
                          {score.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
            <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
              Rekap Kehadiran Siswa
            </h2>
            <span className="font-headline font-bold text-headline-sm text-success">
              {student.attendance}
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant">
            Siswa terdaftar di <strong>{student.className}</strong> ({student.branch}). Status saat ini: <strong>{student.statusLabel}</strong>.
          </p>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
            <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
              Status Tagihan SPP &amp; Biaya Bimbingan
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-label-sm font-semibold ${student.sppBadge}`}>
              {student.sppStatus}
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant">
            Wali penanggung jawab tagihan: <strong>{student.parent}</strong> ({student.parentPhone}).
          </p>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
            <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
              Berkas &amp; Penempatan Rombel Siswa
            </h2>
            <span className="text-body-sm text-light-on-surface-variant font-mono">
              ID: {student.id}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
            <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant">
              <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">Rombel Kelas Terdaftar</span>
              <span className="font-semibold text-light-on-surface">{student.className}</span>
            </div>
            <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant">
              <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">Lokasi Cabang</span>
              <span className="font-semibold text-light-on-surface">{student.branch}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profil Siswa & Status Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-light-primary">edit</span>
                <span>Edit Data Siswa &amp; Status</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3.5 text-body-sm">
              <div>
                <label className="font-semibold text-light-on-surface block mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-light-on-surface block mb-1">Asal Sekolah</label>
                <input
                  type="text"
                  required
                  value={editForm.schoolOrigin}
                  onChange={(e) => setEditForm({ ...editForm, schoolOrigin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-light-on-surface block mb-1">Target Kampus / Sekolah</label>
                  <input
                    type="text"
                    value={editForm.targetUniversity}
                    onChange={(e) => setEditForm({ ...editForm, targetUniversity: e.target.value })}
                    placeholder="Contoh: Universitas Indonesia"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-light-on-surface block mb-1">Target Jurusan</label>
                  <input
                    type="text"
                    value={editForm.targetMajor}
                    onChange={(e) => setEditForm({ ...editForm, targetMajor: e.target.value })}
                    placeholder="Contoh: Kedokteran"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </div>
              </div>

              {/* Status Siswa Selector */}
              <div className="p-3.5 rounded-xl bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-1.5">
                <label className="font-bold text-light-on-surface block">
                  Status Siswa <span className="text-danger">*</span>
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as StudentStatus })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface bg-light-surface font-label text-body-sm focus:border-light-primary focus:ring-1 focus:ring-light-primary font-semibold"
                >
                  <option value="active">🟢 Siswa Aktif (Sedang Bimbingan Belajar)</option>
                  <option value="graduated">🎓 Lulus (Selesai Program / Lolos Ujian PTN)</option>
                  <option value="inactive">🔴 Tidak Selesai (Mengundurkan Diri / Berhenti)</option>
                </select>
                <p className="text-[11px] text-light-on-surface-variant">
                  {STUDENT_STATUS_CONFIG[editForm.status]?.description}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold hover:bg-brand-indigo-dark disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isPending && <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rapor Belajar Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-xl w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-light-primary">print</span>
                <span>Rapor Evaluasi Belajar Siswa</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-4 bg-light-surface-soft border border-light-outline-variant rounded-xl text-body-sm space-y-2">
              <p className="font-bold text-light-on-surface">ARCI Bimbel Academic Progress Report</p>
              <p className="text-light-on-surface-variant">Siswa: <strong>{student.name}</strong> (NISN: {student.nisn})</p>
              <p className="text-light-on-surface-variant">Status Siswa: <strong className="text-light-primary">{student.statusLabel}</strong></p>
              <p className="text-light-on-surface-variant">Rata-rata Skor Tryout: <strong>712.5</strong> (Kenaikan +42 poin dari TO sebelumnya)</p>
              <p className="text-light-on-surface-variant">Kehadiran Kelas: <strong>{student.attendance}</strong></p>
              <p className="text-success font-medium">Catatan Konselor: Peluang lolos pilihan utama sangat tinggi dengan pemantapan konsisten.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-light-outline"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReportModalOpen(false);
                  showToast("Dokumen Rapor PDF berhasil dicetak!", "success");
                }}
                className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">print</span>
                <span>Cetak PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
