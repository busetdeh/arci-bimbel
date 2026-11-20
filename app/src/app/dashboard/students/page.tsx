"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  getStudentsListAction,
  updateStudentStatusAction,
} from "@/app/actions/students";
import {
  StudentItem,
  StudentStatus,
  STUDENT_STATUS_CONFIG,
} from "@/lib/student-constants";

export default function StudentsDirectoryPage() {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    graduated: 0,
    inactive: 0,
    sdCount: 0,
    smpCount: 0,
    smaCount: 0,
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const res = await getStudentsListAction();
      if (res.success && res.students) {
        setStudents(res.students);
        setStats(res.stats);
        if (res.students.length > 0 && !selectedStudentId) {
          setSelectedStudentId(res.students[0].id);
        }
      } else {
        showToast(res.message || "Gagal memuat data siswa.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Terjadi kesalahan saat memuat siswa.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0] || null;

  const filteredStudents = students.filter((s) => {
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.school.toLowerCase().includes(q) ||
      s.nisn.includes(q) ||
      s.parent.toLowerCase().includes(q) ||
      s.className.toLowerCase().includes(q);
    return matchesLevel && matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (studentId: string, newStatus: StudentStatus) => {
    if (!studentId) return;

    // Optimistic UI update
    const previousStudents = [...students];
    const previousStats = { ...stats };
    const oldStudent = students.find((s) => s.id === studentId);
    const oldStatus = oldStudent?.status || "active";

    const statusMeta = STUDENT_STATUS_CONFIG[newStatus];

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: newStatus,
              statusLabel: statusMeta.label,
              statusBadge: statusMeta.badge,
            }
          : s
      )
    );

    // Update stats count
    setStats((prev) => ({
      ...prev,
      [oldStatus]: Math.max(0, (prev[oldStatus as keyof typeof prev] || 1) - 1),
      [newStatus]: (prev[newStatus as keyof typeof prev] || 0) + 1,
    }));

    setIsUpdatingStatus(true);
    startTransition(async () => {
      try {
        const res = await updateStudentStatusAction(studentId, newStatus);
        if (res.success) {
          showToast(res.message, "success");
        } else {
          setStudents(previousStudents);
          setStats(previousStats);
          showToast(res.message, "error");
        }
      } catch (err: any) {
        setStudents(previousStudents);
        setStats(previousStats);
        showToast(err?.message || "Gagal memperbarui status siswa.", "error");
      } finally {
        setIsUpdatingStatus(false);
      }
    });
  };

  const handleExportCSV = () => {
    if (students.length === 0) {
      showToast("Tidak ada data siswa untuk diekspor.", "info");
      return;
    }

    const headers = ["NISN", "Nama Siswa", "Jenjang", "Sekolah Asal", "Status Siswa", "Rombel Kelas", "Cabang", "Wali Murid", "WhatsApp Wali", "Kehadiran", "Status SPP"];
    const rows = filteredStudents.map((s) => [
      `"${s.nisn}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.level}"`,
      `"${s.school.replace(/"/g, '""')}"`,
      `"${s.statusLabel}"`,
      `"${s.className.replace(/"/g, '""')}"`,
      `"${s.branch.replace(/"/g, '""')}"`,
      `"${s.parent.replace(/"/g, '""')}"`,
      `"${s.parentPhone}"`,
      `"${s.attendance}"`,
      `"${s.sppStatus}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `siswa-arci-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Data siswa berhasil diekspor ke file CSV!", "success");
  };

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

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Direktori Data Siswa &amp; Status Akademik
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-success text-on-success font-bold shadow-2xs">
              {stats.active} Siswa Aktif
            </span>
            {stats.graduated > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-blue-100 text-blue-800 font-bold border border-blue-200">
                {stats.graduated} Lulus
              </span>
            )}
            {stats.inactive > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-danger/10 text-danger font-bold border border-danger/20">
                {stats.inactive} Tidak Selesai
              </span>
            )}
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Kelola profil lengkap siswa, pembaruan status (aktif, lulus, tidak selesai), kontak wali, rombel kelas, dan presensi secara terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadStudents}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-medium hover:bg-light-surface-container transition-colors shadow-2xs disabled:opacity-50"
            title="Muat Ulang Data Siswa"
          >
            <span className={`material-symbols-outlined text-[18px] ${isLoading ? "animate-spin" : ""}`}>
              sync
            </span>
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-light-on-surface-variant">
              download
            </span>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Total Siswa Terdaftar
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-1">
              {stats.total} Orang
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              {stats.active} aktif • {stats.graduated} lulus • {stats.inactive} tidak selesai
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Siswa Aktif
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-1">
              {stats.active} Siswa
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Sedang aktif mengikuti bimbingan
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">check_circle</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Siswa Lulus
            </span>
            <p className="font-headline font-bold text-headline-sm text-blue-800 mt-1">
              {stats.graduated} Siswa
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Menyelesaikan program / UTBK
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Tidak Selesai / Cuti
            </span>
            <p className="font-headline font-bold text-headline-sm text-danger mt-1">
              {stats.inactive} Siswa
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Mengundurkan diri / berhenti
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">person_off</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-light-surface p-3.5 rounded-xl border border-light-outline-variant shadow-2xs">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-light-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, NISN, sekolah, nama wali, atau rombel..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-light-outline text-body-sm text-light-on-surface bg-light-surface-soft focus:bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-light-on-surface-variant hover:text-light-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Status Filter Tab Pills */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "Semua Status" },
            { key: "active", label: "Aktif" },
            { key: "graduated", label: "Lulus" },
            { key: "inactive", label: "Tidak Selesai" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-label font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.key
                  ? "bg-brand-indigo text-white shadow-2xs"
                  : "border border-light-outline text-light-on-surface hover:bg-light-surface-container"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split Layout: Table (Col 7) & Student Profile 360 Inspector (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Section: Student Directory Table (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Daftar Siswa Terdaftar
              </h2>
              <p className="text-[12px] text-light-on-surface-variant">
                Pilih siswa untuk melihat preview atau update status akademik secara langsung.
              </p>
            </div>

            {/* Jenjang Filter Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: "all", label: "Semua Jenjang" },
                { key: "SD", label: "SD" },
                { key: "SMP", label: "SMP" },
                { key: "SMA", label: "SMA" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setLevelFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-label font-semibold whitespace-nowrap transition-colors ${
                    levelFilter === tab.key
                      ? "bg-light-primary text-light-on-primary shadow-2xs"
                      : "border border-light-outline text-light-on-surface hover:bg-light-surface-container"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Siswa &amp; NISN</th>
                  <th className="py-3 px-4">Status Siswa</th>
                  <th className="py-3 px-4">Rombel Kelas</th>
                  <th className="py-3 px-4">Presensi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      <div className="inline-flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        <span>Memuat data siswa dari Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      <span className="material-symbols-outlined text-[32px] text-light-outline block mb-1">
                        folder_off
                      </span>
                      Tidak ada siswa yang cocok dengan filter atau pencarian saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudent && student.id === selectedStudent.id;
                    return (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-light-primary-container/20 border-l-4 border-light-primary"
                            : "hover:bg-light-surface-container"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-semibold text-light-on-surface block">
                            {student.name}
                          </span>
                          <span className="text-[11px] text-light-on-surface-variant font-mono">
                            NISN: {student.nisn}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap inline-flex items-center gap-1 ${student.statusBadge}`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {STUDENT_STATUS_CONFIG[student.status]?.icon || "info"}
                            </span>
                            <span>{student.statusLabel}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-light-on-surface">
                            {student.className}
                          </span>
                          <span className="text-[11px] text-light-on-surface-variant block">
                            {student.branch}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-brand-indigo">
                            {student.attendance}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/dashboard/students/${student.id}`}
                            className="px-2.5 py-1 rounded bg-light-primary text-light-on-primary text-[11px] font-label font-semibold shadow-2xs hover:bg-brand-indigo-dark inline-block"
                          >
                            Profil 360°
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant text-[13px]">
              Menampilkan {filteredStudents.length} dari {students.length} siswa terdaftar
            </span>
          </div>
        </section>

        {/* Right Section: Student 360 Inspector (Col 5) */}
        {selectedStudent ? (
          <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-6 sticky top-24">
            <div className="flex items-start justify-between pb-4 border-b border-light-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-light-primary text-light-on-primary font-headline font-bold text-headline-sm flex items-center justify-center shrink-0">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                    {selectedStudent.name}
                  </h2>
                  <span className="text-[12px] text-light-on-surface-variant block font-mono">
                    NISN: {selectedStudent.nisn}
                  </span>
                </div>
              </div>
              <Link
                href={`/dashboard/students/${selectedStudent.id}`}
                className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary font-semibold text-body-sm hover:bg-brand-indigo-dark shadow-xs inline-flex items-center gap-1"
              >
                <span>Detail 360°</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Quick Status Updater Box */}
            <div className="p-4 rounded-xl bg-light-surface-container-low/70 border border-light-outline-variant flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">
                    published_with_changes
                  </span>
                  Update Status Siswa
                </span>
                {isUpdatingStatus && (
                  <span className="text-[11px] text-light-primary font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                    Menyimpan...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-body-sm text-light-on-surface-variant shrink-0">Status saat ini:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${selectedStudent.statusBadge}`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {STUDENT_STATUS_CONFIG[selectedStudent.status]?.icon || "info"}
                  </span>
                  <span>{selectedStudent.statusLabel}</span>
                </span>
              </div>

              <div className="mt-1">
                <select
                  value={selectedStudent.status}
                  disabled={isUpdatingStatus || isPending}
                  onChange={(e) => handleStatusChange(selectedStudent.id, e.target.value as StudentStatus)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface bg-light-surface font-label text-body-sm focus:border-light-primary focus:ring-1 focus:ring-light-primary transition-colors disabled:opacity-50 font-semibold"
                >
                  <option value="active">🟢 Siswa Aktif (Mengikuti Kelas &amp; Presensi)</option>
                  <option value="graduated">🎓 Lulus (Selesai Program / Lolos UTBK)</option>
                  <option value="inactive">🔴 Tidak Selesai (Mengundurkan Diri / Berhenti)</option>
                </select>
              </div>

              <p className="text-[11px] text-light-on-surface-variant leading-tight mt-0.5">
                {STUDENT_STATUS_CONFIG[selectedStudent.status]?.description}
              </p>
            </div>

            {/* Profile Info Details */}
            <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2.5 text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-light-on-surface-variant">Sekolah Asal</span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedStudent.school}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-light-on-surface-variant">Orang Tua / Wali</span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedStudent.parent}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-light-on-surface-variant">No. WhatsApp Wali</span>
                <span className="font-semibold text-light-on-surface font-mono text-right">
                  {selectedStudent.parentPhone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-light-on-surface-variant">Rombel Aktif</span>
                <span className="font-semibold text-brand-indigo text-right">
                  {selectedStudent.className}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-light-on-surface-variant">Tingkat Kehadiran</span>
                <span className="font-bold text-success text-right">
                  {selectedStudent.attendance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-light-on-surface-variant">Status SPP</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${selectedStudent.sppBadge}`}>
                  {selectedStudent.sppStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/62${selectedStudent.parentPhone.replace(/[^0-9]/g, "").slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl border border-light-outline text-light-on-surface font-semibold text-body-sm hover:bg-light-surface-container flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">chat</span>
                <span>Hubungi Wali</span>
              </a>
              <Link
                href={`/dashboard/students/${selectedStudent.id}`}
                className="flex-1 py-2.5 rounded-xl bg-light-primary text-light-on-primary font-semibold text-body-sm hover:bg-brand-indigo-dark flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Buka Profil 360°</span>
              </Link>
            </div>
          </section>
        ) : (
          <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-8 text-center text-light-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-light-outline mb-2">person_search</span>
            <p className="font-medium text-light-on-surface">Pilih salah satu siswa pada tabel untuk melihat detail dan mengelola status akademik.</p>
          </section>
        )}
      </div>
    </>
  );
}
