"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  ClassroomItem,
  ClassAcademicStats,
  ProgramOption,
  BranchOption,
  TutorOption,
  ClassGradeFilter,
  ClassStatusType,
} from "@/lib/class-constants";
import {
  getClassesDataAction,
  createClassAction,
  updateClassAction,
  deleteClassAction,
} from "@/app/actions/classes";

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassroomItem[]>([]);
  const [stats, setStats] = useState<ClassAcademicStats>({
    totalClasses: 0,
    totalStudentsEnrolled: 0,
    totalCapacity: 0,
    avgOccupancyPercent: 0,
    totalFullClasses: 0,
    scheduleConflictsCount: 0,
  });
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);
  const [tutorOptions, setTutorOptions] = useState<TutorOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [gradeFilter, setGradeFilter] = useState<ClassGradeFilter>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedClass, setSelectedClass] = useState<ClassroomItem | null>(null);
  const [editingClass, setEditingClass] = useState<ClassroomItem | null>(null);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Class Form State
  const [newClassForm, setNewClassForm] = useState({
    name: "",
    code: "",
    programId: "",
    branchId: "",
    tutorId: "",
    room: "Ruang Galileo",
    capacity: 8,
    scheduleDays: "Senin & Rabu",
    scheduleTime: "16:00 - 18:00 WIB",
    status: "active" as ClassStatusType,
  });

  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load classes data from Supabase
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getClassesDataAction();
      if (res.success) {
        setClasses(res.classes);
        setStats(res.stats);
        setProgramOptions(res.programOptions);
        setBranchOptions(res.branchOptions);
        setTutorOptions(res.tutorOptions);

        // Pre-fill initial dropdown values if available
        if (res.programOptions.length > 0 && !newClassForm.programId) {
          setNewClassForm((prev) => ({
            ...prev,
            programId: res.programOptions[0].id,
            branchId: res.branchOptions[0]?.id || "",
            tutorId: res.tutorOptions[0]?.id || "",
          }));
        }

        // If a class was previously inspected, refresh its student roster
        if (selectedClass) {
          const refreshed = res.classes.find((c) => c.id === selectedClass.id);
          if (refreshed) setSelectedClass(refreshed);
        }
      } else {
        showToast(res.message || "Gagal memuat data kelas dari Supabase.", "error");
      }
    } catch {
      showToast("Terjadi kendala saat memuat data rombel kelas.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered classes list
  const filteredClasses = classes.filter((cls) => {
    // Grade level filter
    if (gradeFilter !== "all" && cls.levelFilter !== gradeFilter) return false;

    // Branch filter
    if (branchFilter !== "all" && cls.branchId !== branchFilter) return false;

    // Status filter
    if (statusFilter !== "all" && cls.status !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cls.name.toLowerCase().includes(q);
      const matchCode = cls.code.toLowerCase().includes(q);
      const matchTutor = cls.tutorName.toLowerCase().includes(q);
      const matchRoom = cls.room.toLowerCase().includes(q);
      const matchBranch = cls.branchName.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchTutor && !matchRoom && !matchBranch) return false;
    }

    return true;
  });

  // Action: Create New Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.name.trim() || !newClassForm.programId || !newClassForm.branchId) {
      showToast("Lengkapi nama kelas, paket program, dan lokasi cabang.", "error");
      return;
    }

    startTransition(async () => {
      const res = await createClassAction(newClassForm);
      if (res.success) {
        showToast(res.message);
        setIsNewClassModalOpen(false);
        // Reset name
        setNewClassForm((prev) => ({ ...prev, name: "", code: "" }));
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Update Class
  const handleUpdateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    startTransition(async () => {
      const res = await updateClassAction({
        id: editingClass.id,
        name: editingClass.name,
        programId: editingClass.programId,
        branchId: editingClass.branchId,
        tutorId: editingClass.tutorId,
        room: editingClass.room,
        capacity: editingClass.capacity,
        scheduleDays: editingClass.scheduleDays,
        scheduleTime: editingClass.scheduleTime,
        status: editingClass.status,
      });

      if (res.success) {
        showToast(res.message);
        setEditingClass(null);
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Delete / Archive Class
  const handleDeleteClass = (classId: string, className: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus atau mengarsipkan kelas "${className}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteClassAction(classId);
      if (res.success) {
        showToast(res.message);
        setEditingClass(null);
        if (selectedClass?.id === classId) setSelectedClass(null);
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Download Student Attendance Sheet for a Class (CSV)
  const handleDownloadClassAttendance = (cls: ClassroomItem) => {
    if (cls.students.length === 0) {
      showToast("Kelas ini belum memiliki siswa terdaftar untuk diekspor.", "error");
      return;
    }

    const headers = [
      "No",
      "Nama Siswa",
      "NISN",
      "Tingkat",
      "Asal Sekolah",
      "Status Siswa",
      "Sesi 1",
      "Sesi 2",
      "Sesi 3",
      "Sesi 4",
      "Sesi 5",
      "Sesi 6",
      "Sesi 7",
      "Sesi 8",
      "Sesi 9",
      "Sesi 10",
      "Catatan Evaluasi",
    ];

    const rows = cls.students.map((st, idx) => [
      idx + 1,
      `"${st.studentName}"`,
      `"${st.nisn}"`,
      `"${st.grade}"`,
      `"${st.schoolOrigin.replace(/"/g, '""')}"`,
      `"${st.enrollmentStatus}"`,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      '""',
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      `"DAFTAR PRESENSI ROMBEL ARCI BIMBEL - ${cls.name} (${cls.code})"\n` +
      `"Tutor: ${cls.tutorName} | Jadwal: ${cls.scheduleDays} ${cls.scheduleTime} | Ruang: ${cls.room}"\n\n` +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `presensi-rombel-${cls.code.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Daftar presensi untuk rombel ${cls.name} berhasil diunduh.`);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-[20px] ${
                toastMsg.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {toastMsg.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 rounded hover:bg-black/5 text-light-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Manajemen Program, Kelas &amp; Rombel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-success text-on-success font-bold shadow-2xs">
              Tahun Ajaran 2026/2027
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1 leading-relaxed">
            Data live Supabase: Kelola kapasitas okupansi rombel (maks 8 siswa tatap muka), penempatan tutor pengampu, dan pemantauan konflik ruang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsNewClassModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Buka Rombel Baru</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            title="Refresh Data"
            disabled={loading}
            className="p-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                loading ? "animate-spin text-brand-indigo" : "text-light-on-surface-variant"
              }`}
            >
              sync
            </span>
          </button>
        </div>
      </div>

      {/* Academic KPI Snapshot Cards (Live from Supabase) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-light-surface p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">
              Total Rombel Aktif
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-0.5">
              {stats.totalClasses} Rombel
            </p>
            <p className="text-[11.5px] text-light-on-surface-variant mt-0.5">
              Tatap Muka &amp; Kelas Online Live
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">meeting_room</span>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">
              Rata-rata Okupansi Kursi
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-0.5">
              {stats.avgOccupancyPercent}% Terisi
            </p>
            <p className="text-[11.5px] text-light-on-surface-variant mt-0.5">
              {stats.totalStudentsEnrolled} dari {stats.totalCapacity} total kapasitas kursi
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success text-on-success flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">person_check</span>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">
              Status Jadwal &amp; Ruang
            </span>
            <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-0.5">
              {stats.scheduleConflictsCount === 0
                ? "0 Konflik Jadwal"
                : `${stats.scheduleConflictsCount} Potensi Konflik`}
            </p>
            <p className="text-[11.5px] text-success font-semibold mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Seluruh ruang dan tutor teralokasi valid</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-surface-container text-light-on-surface flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
          </div>
        </div>
      </section>

      {/* Filter Bar (Jenjang, Cabang, Status, Search) */}
      <div className="flex flex-col gap-3 bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-2xs">
        {/* Top: Jenjang Tabs & Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { key: "all", label: "Semua Jenjang" },
              { key: "sd", label: "SD (Kelas 4–6)" },
              { key: "smp", label: "SMP (Kelas 7–9)" },
              { key: "sma", label: "SMA (Kelas 10–12)" },
              { key: "utbk", label: "Intensif UTBK" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setGradeFilter(tab.key as ClassGradeFilter)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-label font-semibold whitespace-nowrap transition-colors ${
                  gradeFilter === tab.key
                    ? "bg-light-primary text-light-on-primary shadow-2xs"
                    : "border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-light-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari rombel, tutor, ruang..."
              className="w-full pl-9 pr-4 py-1.5 text-body-sm rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
            />
          </div>
        </div>

        {/* Bottom: Secondary Filters (Cabang & Status) */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-light-outline-variant text-body-sm">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-light-on-surface-variant font-medium">Cabang:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-light-outline-variant text-[12px] bg-light-surface focus:outline-none focus:ring-1 focus:ring-light-primary"
            >
              <option value="all">Semua Cabang</option>
              {branchOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] text-light-on-surface-variant font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-light-outline-variant text-[12px] bg-light-surface focus:outline-none focus:ring-1 focus:ring-light-primary"
            >
              <option value="all">Semua Status</option>
              <option value="active">Berjalan</option>
              <option value="upcoming">Segera Mulai</option>
              <option value="full">Penuh</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>

          <div className="ml-auto text-[12px] text-light-on-surface-variant">
            Ditemukan <strong>{filteredClasses.length}</strong> dari <strong>{classes.length}</strong> rombel
          </div>
        </div>
      </div>

      {/* Class Roster & Management Table */}
      <section className="bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Rombel &amp; Kode</th>
                <th className="py-3 px-4">Jenjang &amp; Cabang</th>
                <th className="py-3 px-4">Tutor Pengampu</th>
                <th className="py-3 px-4">Jadwal Sesi</th>
                <th className="py-3 px-4">Kapasitas Kursi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-outline-variant font-body">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-light-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] text-light-outline block mb-2">
                      class
                    </span>
                    {loading
                      ? "Memuat data kelas dari Supabase..."
                      : "Tidak ada rombel kelas yang sesuai dengan filter."}
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => {
                  const remainingSeats = cls.capacity - cls.enrolled;
                  return (
                    <tr key={cls.id} className="hover:bg-light-surface-container transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-light-on-surface text-[14px]">{cls.name}</p>
                        <p className="text-[11px] text-light-primary font-mono font-medium">
                          {cls.code}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-label font-semibold ${cls.levelBadge}`}
                        >
                          {cls.levelLabel}
                        </span>
                        <span className="text-[11px] text-light-on-surface-variant block mt-0.5">
                          {cls.branchName} • <strong className="text-slate-700">{cls.room}</strong>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-light-on-surface">{cls.tutorName}</p>
                        <p className="text-[11px] text-light-on-surface-variant">{cls.programName}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-light-on-surface">{cls.scheduleDays}</p>
                        <p className="text-[11px] text-light-on-surface-variant">{cls.scheduleTime}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-light-on-surface text-[12px]">
                            {cls.enrolled} / {cls.capacity} Siswa
                          </span>
                          <div className="w-16 bg-light-surface-container rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                cls.occupancyPercent >= 100
                                  ? "bg-brand-indigo"
                                  : cls.occupancyPercent >= 75
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                              style={{ width: `${Math.min(cls.occupancyPercent, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[11px] text-light-on-surface-variant block mt-0.5">
                          {remainingSeats > 0 ? (
                            <span className="text-success font-medium">Sisa {remainingSeats} Kursi</span>
                          ) : (
                            <span className="text-brand-indigo font-bold">Kuota Penuh</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${cls.statusBadge}`}
                        >
                          {cls.statusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedClass(cls)}
                            className="px-3 py-1.5 rounded-lg border border-light-outline text-light-on-surface text-[12px] font-label font-medium hover:bg-light-surface-container whitespace-nowrap transition-colors shadow-2xs flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[15px]">group</span>
                            <span>Anggota ({cls.enrolled})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingClass(cls)}
                            title="Edit Rombel"
                            className="p-1.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container text-[12px] shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                        </div>
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
            Menampilkan {filteredClasses.length} dari {classes.length} rombel kelas aktif (Supabase Live)
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: DETAIL ROMBEL & DAFTAR SISWA ANGGOTA KELAS                      */}
      {/* ========================================================================= */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-2xl w-full p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-title-lg text-light-on-surface">
                    {selectedClass.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${selectedClass.statusBadge}`}
                  >
                    {selectedClass.statusLabel}
                  </span>
                </div>
                <span className="text-[12px] text-light-on-surface-variant font-mono mt-0.5 block">
                  {selectedClass.code} • {selectedClass.branchName} ({selectedClass.room})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="p-1.5 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Class Info Summary Card */}
            <div className="p-4 bg-light-surface-soft rounded-xl border border-light-outline-variant text-body-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-light-on-surface-variant font-medium block">
                  Tutor Pengampu
                </span>
                <span className="font-bold text-light-on-surface text-[14px]">
                  {selectedClass.tutorName}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-light-on-surface-variant font-medium block">
                  Jadwal Sesi Belajar
                </span>
                <span className="font-semibold text-light-on-surface text-[14px]">
                  {selectedClass.scheduleDays} ({selectedClass.scheduleTime})
                </span>
              </div>
              <div>
                <span className="text-[11px] text-light-on-surface-variant font-medium block">
                  Paket Program
                </span>
                <span className="font-medium text-brand-indigo">
                  {selectedClass.programName}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-light-on-surface-variant font-medium block">
                  Kapasitas Kursi Terisi
                </span>
                <span className="font-bold text-success">
                  {selectedClass.enrolled} dari {selectedClass.capacity} Siswa ({selectedClass.occupancyPercent}%)
                </span>
              </div>
            </div>

            {/* Students Roster Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">
                    groups
                  </span>
                  <span>Daftar Siswa di Rombel Ini ({selectedClass.students.length})</span>
                </h4>

                <button
                  type="button"
                  onClick={() => handleDownloadClassAttendance(selectedClass)}
                  className="px-3 py-1 rounded-lg border border-light-outline text-[12px] font-label font-semibold text-light-on-surface hover:bg-light-surface-container flex items-center gap-1 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Unduh Presensi Rombel (CSV)</span>
                </button>
              </div>

              {selectedClass.students.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-light-outline-variant text-center text-light-on-surface-variant text-body-sm bg-light-surface-soft">
                  <span className="material-symbols-outlined text-[32px] text-light-outline block mb-1">
                    person_off
                  </span>
                  Belum ada siswa yang diplot ke rombel ini.
                  <p className="text-[11px] text-light-on-surface-variant mt-1">
                    Penempatan siswa baru dapat dilakukan langsung saat menyetujui pendaftaran di halaman <strong>Admissions / Pendaftaran</strong>.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-light-outline-variant overflow-hidden">
                  <table className="w-full text-left text-body-sm">
                    <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">No</th>
                        <th className="py-2.5 px-3">Nama Siswa</th>
                        <th className="py-2.5 px-3">NISN</th>
                        <th className="py-2.5 px-3">Asal Sekolah</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-outline-variant">
                      {selectedClass.students.map((st, idx) => (
                        <tr key={st.enrollmentId} className="hover:bg-light-surface-soft">
                          <td className="py-2.5 px-3 text-light-on-surface-variant text-[12px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-light-on-surface">
                            {st.studentName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[12px] text-light-on-surface-variant">
                            {st.nisn}
                          </td>
                          <td className="py-2.5 px-3 text-[12px] text-light-on-surface">
                            {st.schoolOrigin}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
                              {st.enrollmentStatus === "active" ? "Aktif" : "Menunggu"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-light-outline-variant">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold hover:bg-light-surface-container"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUKA ROMBEL KELAS BARU                                           */}
      {/* ========================================================================= */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-indigo text-[22px]">
                  domain_add
                </span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Buka Rombel Kelas Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewClassModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="flex flex-col gap-3.5 text-body-sm">
              <div>
                <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                  Nama Kelas / Rombel *
                </label>
                <input
                  type="text"
                  required
                  value={newClassForm.name}
                  onChange={(e) => setNewClassForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: SMP-8 Reguler Sudirman B"
                  className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Paket Program *
                  </label>
                  <select
                    value={newClassForm.programId}
                    onChange={(e) =>
                      setNewClassForm((prev) => ({ ...prev, programId: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  >
                    {programOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Lokasi Cabang *
                  </label>
                  <select
                    value={newClassForm.branchId}
                    onChange={(e) =>
                      setNewClassForm((prev) => ({ ...prev, branchId: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  >
                    {branchOptions.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Tutor Pengampu *
                  </label>
                  <select
                    value={newClassForm.tutorId}
                    onChange={(e) =>
                      setNewClassForm((prev) => ({ ...prev, tutorId: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  >
                    <option value="">-- Pilih Tutor Pengampu --</option>
                    {tutorOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Ruangan / Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassForm.room}
                    onChange={(e) =>
                      setNewClassForm((prev) => ({ ...prev, room: e.target.value }))
                    }
                    placeholder="Ruang Galileo / Zoom Live #1"
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Kuota Kursi *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={newClassForm.capacity}
                    onChange={(e) =>
                      setNewClassForm((prev) => ({ ...prev, capacity: Number(e.target.value) }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Hari Sesi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassForm.scheduleDays}
                    onChange={(e) =>
                      setNewClassForm((prev) => ({ ...prev, scheduleDays: e.target.value }))
                    }
                    placeholder="Senin & Rabu"
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Jam Sesi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassForm.scheduleTime}
                    onChange={(e) =>
                      setNewClassForm((prev) => ({ ...prev, scheduleTime: e.target.value }))
                    }
                    placeholder="16:00 - 18:00 WIB"
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold text-body-sm hover:bg-brand-indigo-dark disabled:opacity-50 shadow-2xs"
                >
                  {isPending ? "Menyimpan..." : "Buat Rombel Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT ROMBEL KELAS                                                */}
      {/* ========================================================================= */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Edit Rombel Kelas
                </h3>
                <span className="text-[12px] text-light-primary font-mono">
                  {editingClass.code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="flex flex-col gap-3.5 text-body-sm">
              <div>
                <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                  Nama Kelas / Rombel *
                </label>
                <input
                  type="text"
                  required
                  value={editingClass.name}
                  onChange={(e) =>
                    setEditingClass((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Tutor Pengampu
                  </label>
                  <select
                    value={editingClass.tutorId || ""}
                    onChange={(e) =>
                      setEditingClass((prev) =>
                        prev ? { ...prev, tutorId: e.target.value || null } : null
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  >
                    <option value="">-- Pilih Tutor --</option>
                    {tutorOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Ruangan
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClass.room}
                    onChange={(e) =>
                      setEditingClass((prev) => (prev ? { ...prev, room: e.target.value } : null))
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Kapasitas Kursi
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={editingClass.capacity}
                    onChange={(e) =>
                      setEditingClass((prev) =>
                        prev ? { ...prev, capacity: Number(e.target.value) } : null
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Hari Sesi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClass.scheduleDays}
                    onChange={(e) =>
                      setEditingClass((prev) =>
                        prev ? { ...prev, scheduleDays: e.target.value } : null
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Status Kelas
                  </label>
                  <select
                    value={editingClass.status}
                    onChange={(e) =>
                      setEditingClass((prev) =>
                        prev ? { ...prev, status: e.target.value as ClassStatusType } : null
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm"
                  >
                    <option value="active">Berjalan</option>
                    <option value="upcoming">Segera Mulai</option>
                    <option value="full">Penuh</option>
                    <option value="archived">Diarsipkan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => handleDeleteClass(editingClass.id, editingClass.name)}
                  className="px-3.5 py-2 rounded-lg border border-danger text-danger text-[13px] font-semibold hover:bg-danger/10"
                >
                  Hapus / Arsipkan
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingClass(null)}
                    className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold hover:bg-light-surface-container"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold text-body-sm hover:bg-brand-indigo-dark disabled:opacity-50 shadow-2xs"
                  >
                    {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
