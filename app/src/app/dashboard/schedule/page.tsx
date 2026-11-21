"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  CalendarSessionItem,
  DayColumnData,
  ScheduleCalendarStats,
  ScheduleClassOption,
  ScheduleBranchOption,
  ScheduleTutorOption,
} from "@/lib/schedule-constants";
import {
  getScheduleCalendarDataAction,
  createScheduleSessionAction,
  cancelScheduleSessionAction,
} from "@/app/actions/schedule";

export default function SchedulePage() {
  const [sessions, setSessions] = useState<CalendarSessionItem[]>([]);
  const [days, setDays] = useState<DayColumnData[]>([]);
  const [stats, setStats] = useState<ScheduleCalendarStats>({
    totalSessions: 0,
    completedSessions: 0,
    inProgressSessions: 0,
    scheduledSessions: 0,
    totalHoursTaught: 0,
  });

  const [classOptions, setClassOptions] = useState<ScheduleClassOption[]>([]);
  const [branchOptions, setBranchOptions] = useState<ScheduleBranchOption[]>([]);
  const [tutorOptions, setTutorOptions] = useState<ScheduleTutorOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Views
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [branchFilter, setBranchFilter] = useState("all");
  const [tutorFilter, setTutorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedSession, setSelectedSession] = useState<CalendarSessionItem | null>(null);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Session Form State
  const [newSessionForm, setNewSessionForm] = useState({
    classId: "",
    sessionDate: "2026-11-20",
    timeSlot: "16:00 - 18:00 WIB",
    topic: "Latihan Soal & Pembahasan Modul",
  });

  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getScheduleCalendarDataAction();
      if (res.success) {
        setSessions(res.sessions);
        setDays(res.days);
        setStats(res.stats);
        setClassOptions(res.classOptions);
        setBranchOptions(res.branchOptions);
        setTutorOptions(res.tutorOptions);

        if (res.classOptions.length > 0 && !newSessionForm.classId) {
          setNewSessionForm((prev) => ({
            ...prev,
            classId: res.classOptions[0].id,
            timeSlot: res.classOptions[0].scheduleTime,
          }));
        }
      } else {
        showToast(res.message || "Gagal memuat jadwal sesi.", "error");
      }
    } catch {
      showToast("Terjadi kendala saat memuat kalender jadwal.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Set default session date on client side
    const today = new Date().toISOString().split("T")[0];
    setNewSessionForm((prev) => ({ ...prev, sessionDate: today }));
  }, []);

  // Filter sessions
  const filterSessionItem = (s: CalendarSessionItem) => {
    if (branchFilter !== "all" && s.branchId !== branchFilter) return false;
    if (tutorFilter !== "all" && s.tutorId !== tutorFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.className.toLowerCase().includes(q);
      const matchCode = s.classCode.toLowerCase().includes(q);
      const matchTutor = s.tutorName.toLowerCase().includes(q);
      const matchRoom = s.room.toLowerCase().includes(q);
      const matchTopic = s.topic.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchTutor && !matchRoom && !matchTopic) return false;
    }
    return true;
  };

  // Filtered day columns for calendar view
  const filteredDays = days.map((col) => ({
    ...col,
    sessions: col.sessions.filter(filterSessionItem),
  }));

  // Filtered flat list for list view
  const filteredListSessions = sessions.filter(filterSessionItem);

  // Action: Create New Session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionForm.classId || !newSessionForm.sessionDate || !newSessionForm.timeSlot) {
      showToast("Lengkapi kelas, tanggal, dan jam belajar.", "error");
      return;
    }

    startTransition(async () => {
      const res = await createScheduleSessionAction(newSessionForm);
      if (res.success) {
        showToast(res.message);
        setIsNewSessionModalOpen(false);
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Cancel Session
  const handleCancelSession = (sessionId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan jadwal sesi ini?")) return;

    startTransition(async () => {
      const res = await cancelScheduleSessionAction(sessionId);
      if (res.success) {
        showToast(res.message);
        setSelectedSession(null);
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
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
              Kalender &amp; Jadwal Sesi Belajar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-light-primary-container text-light-primary font-bold shadow-2xs">
              Live Supabase
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1 leading-relaxed">
            Pantau jadwal sesi belajar harian &amp; mingguan, alokasi ruang, serta pengisian presensi siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-light-surface-container rounded-lg p-0.5 border border-light-outline-variant shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-md text-[12px] font-label font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === "calendar"
                  ? "bg-light-surface text-light-on-surface shadow-xs"
                  : "text-light-on-surface-variant hover:text-light-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
              <span>Mingguan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-[12px] font-label font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-light-surface text-light-on-surface shadow-xs"
                  : "text-light-on-surface-variant hover:text-light-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              <span>Daftar Sesi</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsNewSessionModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Jadwalkan Sesi</span>
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

      {/* Schedule KPI Snapshot Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Total Sesi Terjadwal
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-0.5">
              {stats.totalSessions} Sesi
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Minggu Aktif Berjalan
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">event_note</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Selesai &amp; Presensi Terisi
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-0.5">
              {stats.completedSessions} Sesi
            </p>
            <p className="text-[11px] text-success font-semibold mt-0.5">
              {stats.totalHoursTaught} Jam Pembelajaran Efektif
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success text-on-success flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">fact_check</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Sedang / Segera Dimulai
            </span>
            <p className="font-headline font-bold text-headline-sm text-warning mt-0.5">
              {stats.inProgressSessions + stats.scheduledSessions} Sesi
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Tatap Muka &amp; Online Live
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-warning text-on-warning flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">schedule</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Tautan Presensi Tutor
            </span>
            <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-0.5">
              Mobile-First
            </p>
            <Link
              href="/tutor/presensi"
              className="text-[11px] text-light-primary font-semibold mt-0.5 hover:underline flex items-center gap-1"
            >
              <span>Buka Presensi Tutor →</span>
            </Link>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-surface-container text-light-on-surface flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">touch_app</span>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-light-surface p-3.5 rounded-xl border border-light-outline-variant shadow-2xs text-body-sm">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-light-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kelas, materi, ruang, tutor..."
            className="w-full pl-9 pr-4 py-1.5 text-body-sm rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-light-outline-variant text-[12px] bg-light-surface focus:outline-none focus:ring-1 focus:ring-light-primary"
          >
            <option value="all">Semua Cabang</option>
            {branchOptions.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={tutorFilter}
            onChange={(e) => setTutorFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-light-outline-variant text-[12px] bg-light-surface focus:outline-none focus:ring-1 focus:ring-light-primary"
          >
            <option value="all">Semua Tutor</option>
            {tutorOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-light-outline-variant text-[12px] bg-light-surface focus:outline-none focus:ring-1 focus:ring-light-primary"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="in_progress">Sedang Berjalan</option>
            <option value="scheduled">Terjadwal</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: WEEKLY CALENDAR GRID (7 DAY COLUMNS)                         */}
      {/* ========================================================================= */}
      {viewMode === "calendar" ? (
        <section className="bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-4 overflow-x-auto">
          <div className="min-w-[1000px] grid grid-cols-7 gap-3">
            {filteredDays.map((col) => (
              <div
                key={col.dayKey}
                className={`flex flex-col rounded-xl border ${
                  col.isToday
                    ? "border-light-primary bg-light-primary-container/10"
                    : "border-light-outline-variant bg-light-surface-soft"
                } p-3 min-h-[500px]`}
              >
                {/* Day Header */}
                <div className="pb-2.5 mb-3 border-b border-light-outline-variant flex items-center justify-between">
                  <div>
                    <span className="font-headline font-bold text-body-md text-light-on-surface block">
                      {col.dayName}
                    </span>
                    <span className="text-[11px] text-light-on-surface-variant font-medium">
                      {col.formattedDate}
                    </span>
                  </div>
                  {col.isToday && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-light-primary text-light-on-primary">
                      Hari Ini
                    </span>
                  )}
                </div>

                {/* Day Sessions List */}
                <div className="flex flex-col gap-2.5 flex-1">
                  {col.sessions.length === 0 ? (
                    <div className="py-8 text-center text-light-on-surface-variant text-[11px]">
                      Tidak ada sesi
                    </div>
                  ) : (
                    col.sessions.map((sess) => (
                      <div
                        key={sess.id}
                        onClick={() => setSelectedSession(sess)}
                        className="p-3 rounded-lg bg-light-surface border border-light-outline-variant shadow-2xs hover:shadow-xs hover:border-light-primary transition-all cursor-pointer flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-light-primary font-mono truncate">
                            {sess.timeSlot}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold shrink-0 ${sess.statusBadge}`}
                          >
                            {sess.statusLabel}
                          </span>
                        </div>

                        <div>
                          <p className="font-bold text-[13px] text-light-on-surface leading-tight">
                            {sess.className}
                          </p>
                          <p className="text-[11px] text-light-on-surface-variant line-clamp-1 mt-0.5">
                            {sess.room} • {sess.tutorName}
                          </p>
                        </div>

                        <div className="pt-1.5 border-t border-light-outline-variant flex items-center justify-between text-[10.5px]">
                          <span className="text-light-on-surface-variant font-medium">
                            {sess.attendanceInfo}
                          </span>
                          <span className="text-brand-indigo font-bold hover:underline">
                            Detail →
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* ========================================================================= */
        /* VIEW MODE 2: FLAT LIST VIEW                                               */
        /* ========================================================================= */
        <section className="bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Tanggal &amp; Waktu</th>
                  <th className="py-3 px-4">Rombel &amp; Program</th>
                  <th className="py-3 px-4">Ruangan &amp; Cabang</th>
                  <th className="py-3 px-4">Tutor Pengampu</th>
                  <th className="py-3 px-4">Topik Sesi</th>
                  <th className="py-3 px-4">Presensi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {filteredListSessions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-light-on-surface-variant">
                      Tidak ada jadwal sesi yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredListSessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-light-surface-container transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-light-on-surface block">
                          {sess.dayLabel}, {sess.formattedDate}
                        </span>
                        <span className="text-[11px] font-mono text-light-primary">
                          {sess.timeSlot}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-light-on-surface">{sess.className}</p>
                        <p className="text-[11px] text-light-on-surface-variant">{sess.programName}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-light-on-surface">{sess.room}</p>
                        <p className="text-[11px] text-light-on-surface-variant">{sess.branchName}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-light-on-surface">
                        {sess.tutorName}
                      </td>
                      <td className="py-3.5 px-4 text-[12px] text-light-on-surface max-w-[200px] truncate">
                        {sess.topic}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[12px] text-light-on-surface">
                        {sess.attendanceInfo}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${sess.statusBadge}`}
                        >
                          {sess.statusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedSession(sess)}
                          className="px-3 py-1 rounded text-[11px] font-label font-semibold border border-light-outline text-light-on-surface hover:bg-light-surface shadow-2xs"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DETAIL SESI BELAJAR                                              */}
      {/* ========================================================================= */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                    {selectedSession.className}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-label font-bold ${selectedSession.statusBadge}`}
                  >
                    {selectedSession.statusLabel}
                  </span>
                </div>
                <p className="text-[12px] text-light-on-surface-variant font-mono mt-0.5">
                  {selectedSession.classCode} • {selectedSession.room}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2.5 text-body-sm">
              <div className="flex justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Hari &amp; Tanggal</span>
                <span className="font-semibold text-light-on-surface">
                  {selectedSession.dayLabel}, {selectedSession.sessionDate} ({selectedSession.timeSlot})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Tutor Pengampu</span>
                <span className="font-semibold text-light-on-surface">
                  {selectedSession.tutorName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Cabang &amp; Ruangan</span>
                <span className="font-semibold text-light-on-surface">
                  {selectedSession.branchName} — {selectedSession.room}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Topik Pembahasan</span>
                <span className="font-semibold text-brand-indigo text-right max-w-[220px]">
                  {selectedSession.topic}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-light-outline-variant">
                <span className="text-[12px] text-light-on-surface-variant">Rekap Kehadiran</span>
                <span className="font-bold text-success">
                  {selectedSession.attendanceInfo}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant">
              {selectedSession.status !== "cancelled" ? (
                <button
                  type="button"
                  onClick={() => handleCancelSession(selectedSession.id)}
                  disabled={isPending}
                  className="px-3.5 py-2 rounded-lg border border-danger text-danger text-body-sm font-semibold hover:bg-danger/10"
                >
                  Batalkan Sesi
                </button>
              ) : (
                <span className="text-[12px] text-danger font-semibold">Sesi Dibatalkan</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold hover:bg-light-surface-container"
                >
                  Tutup
                </button>

                <Link
                  href="/tutor/presensi"
                  className="px-4 py-2 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-semibold hover:bg-brand-indigo-dark flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">touch_app</span>
                  <span>Buka Presensi</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: JADWALKAN SESI BARU                                              */}
      {/* ========================================================================= */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-indigo text-[22px]">
                  event
                </span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Jadwalkan Sesi Belajar Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSessionModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="flex flex-col gap-3.5 text-body-sm">
              <div>
                <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                  Pilih Rombel Kelas *
                </label>
                <select
                  value={newSessionForm.classId}
                  onChange={(e) => {
                    const sel = classOptions.find((c) => c.id === e.target.value);
                    setNewSessionForm((prev) => ({
                      ...prev,
                      classId: e.target.value,
                      timeSlot: sel?.scheduleTime || prev.timeSlot,
                    }));
                  }}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                >
                  {classOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}) — {c.branchName} ({c.room})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Tanggal Sesi *
                  </label>
                  <input
                    type="date"
                    required
                    value={newSessionForm.sessionDate}
                    onChange={(e) =>
                      setNewSessionForm((prev) => ({ ...prev, sessionDate: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Jam Belajar *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSessionForm.timeSlot}
                    onChange={(e) =>
                      setNewSessionForm((prev) => ({ ...prev, timeSlot: e.target.value }))
                    }
                    placeholder="16:00 - 18:00 WIB"
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                  Topik / Silabus Materi
                </label>
                <input
                  type="text"
                  value={newSessionForm.topic}
                  onChange={(e) =>
                    setNewSessionForm((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  placeholder="Contoh: Latihan Soal HOTS Aljabar & Pembahasan"
                  className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold text-body-sm hover:bg-brand-indigo-dark disabled:opacity-50 shadow-2xs"
                >
                  {isPending ? "Menyimpan..." : "Jadwalkan Sesi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
