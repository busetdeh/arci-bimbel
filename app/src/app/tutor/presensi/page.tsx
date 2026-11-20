"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getTutorAttendanceSessionsAction,
  saveTutorAttendanceAction,
  AttendanceStatus,
  StudentAttendanceItem,
  AttendanceSessionData,
} from "@/app/actions/attendance";
import {
  ATTENDANCE_STATUS_META,
  QUICK_REASON_PRESETS,
} from "@/lib/attendance-constants";

export default function AttendanceMobilePage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<AttendanceSessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionSwitcherOpen, setIsSessionSwitcherOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reason modal state for Izin / Sakit
  const [reasonModalStudent, setReasonModalStudent] = useState<StudentAttendanceItem | null>(null);
  const [reasonModalStatus, setReasonModalStatus] = useState<AttendanceStatus>("izin");
  const [customReason, setCustomReason] = useState("");

  // Tutor session notes
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionNotes, setSessionNotes] = useState(
    "Siswa antusias mengerjakan latihan mandiri. Latihan nomor 1-5 dijadikan PR mandiri."
  );

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const res = await getTutorAttendanceSessionsAction();
      if (res.success && res.sessions && res.sessions.length > 0) {
        setSessions(res.sessions);
        setActiveSessionId(res.sessions[0].id);
        setSessionTopic(res.sessions[0].topic);
        if (res.sessions[0].tutorNotes) {
          setSessionNotes(res.sessions[0].tutorNotes);
        }
      }
    } catch (err: any) {
      showToast(err?.message || "Gagal memuat sesi presensi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Helper to update a student's attendance status in the current session
  const updateStudentStatus = (
    studentId: string,
    newStatus: AttendanceStatus,
    openReasonModalIfAbsent = false
  ) => {
    if (!activeSession) return;

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSession.id) return sess;
        return {
          ...sess,
          roster: sess.roster.map((st) => {
            if (st.id !== studentId) return st;
            return {
              ...st,
              status: newStatus,
              checkInTime: newStatus === "hadir" ? "16:02 WIB" : undefined,
              notes: newStatus === "hadir" || newStatus === "alpa" ? "" : st.notes,
            };
          }),
        };
      })
    );

    // If tutor taps Izin or Sakit, optionally pop up reason modal immediately
    if (openReasonModalIfAbsent && (newStatus === "izin" || newStatus === "sakit")) {
      const st = activeSession.roster.find((s) => s.id === studentId);
      if (st) {
        setReasonModalStudent(st);
        setReasonModalStatus(newStatus);
        setCustomReason(st.notes || "");
      }
    }
  };

  // Quick Action: Mark all students present with 1 click
  const markAllPresent = () => {
    if (!activeSession) return;

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSession.id) return sess;
        return {
          ...sess,
          roster: sess.roster.map((st) => ({
            ...st,
            status: "hadir",
            checkInTime: "16:02 WIB",
            notes: "",
          })),
        };
      })
    );
    showToast("Semua siswa ditandai Hadir ✓", "success");
  };

  // Save reason from modal
  const handleSaveReason = () => {
    if (!reasonModalStudent || !activeSession) return;

    const noteToSave = customReason.trim();

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSession.id) return sess;
        return {
          ...sess,
          roster: sess.roster.map((st) => {
            if (st.id !== reasonModalStudent.id) return st;
            return {
              ...st,
              status: reasonModalStatus,
              notes: noteToSave,
            };
          }),
        };
      })
    );

    setReasonModalStudent(null);
    setCustomReason("");
    showToast(`Keterangan ${ATTENDANCE_STATUS_META[reasonModalStatus].label} tersimpan.`, "success");
  };

  // Handle final submission of attendance session
  const handleSubmitAttendance = async () => {
    if (!activeSession) return;

    startTransition(async () => {
      try {
        const payload = {
          sessionId: activeSession.id,
          classId: activeSession.classId,
          topic: sessionTopic,
          tutorNotes: sessionNotes,
          records: activeSession.roster.map((st) => ({
            studentId: st.id,
            status: st.status,
            notes: st.notes,
            checkInTime: st.checkInTime,
          })),
        };

        const res = await saveTutorAttendanceAction(payload);
        if (res.success) {
          showToast(res.message, "success");
          setTimeout(() => {
            router.push("/tutor");
          }, 1500);
        } else {
          showToast(res.message, "error");
        }
      } catch (err: any) {
        showToast(err?.message || "Gagal menyimpan presensi.", "error");
      }
    });
  };

  // Real-time roster counters
  const currentRoster = activeSession?.roster || [];
  const countHadir = currentRoster.filter((s) => s.status === "hadir").length;
  const countIzin = currentRoster.filter((s) => s.status === "izin").length;
  const countSakit = currentRoster.filter((s) => s.status === "sakit").length;
  const countAlpa = currentRoster.filter((s) => s.status === "alpa").length;

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body antialiased min-h-screen flex flex-col pb-28 selection:bg-brand-indigo selection:text-white">
      {/* Centered Mobile Viewport Frame */}
      <div className="w-full max-w-xl mx-auto bg-light-surface-soft min-h-screen shadow-md flex flex-col border-x border-light-outline-variant/60 pb-28">
        {/* Toast Notification Container */}
        {toastMsg && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 max-w-sm w-[92%] p-3.5 rounded-xl shadow-lg border text-body-sm transition-all animate-in fade-in slide-in-from-top-2 bg-light-surface">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[19px] ${
                  toastMsg.type === "error"
                    ? "text-danger"
                    : toastMsg.type === "success"
                    ? "text-success"
                    : "text-light-primary"
                }`}
              >
                {toastMsg.type === "error" ? "error" : toastMsg.type === "success" ? "check_circle" : "info"}
              </span>
              <span className="font-semibold text-light-on-surface">{toastMsg.text}</span>
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

        {/* Mobile Top App Bar */}
        <header className="bg-light-surface border-b border-light-outline-variant px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Link
              href="/tutor"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-light-on-surface hover:bg-light-surface-container transition-colors"
              title="Kembali ke Dashboard Tutor"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="font-headline font-bold text-title-md text-light-on-surface leading-tight">
                Presensi Sesi Kelas
              </h1>
              <p className="text-[11px] text-light-on-surface-variant font-medium">
                Portal Tutor &bull; Mode Mobile Presensi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-label bg-success text-on-success font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Live Sesi
            </span>
            <button
              type="button"
              onClick={() => setIsSessionSwitcherOpen(!isSessionSwitcherOpen)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                isSessionSwitcherOpen
                  ? "bg-light-primary text-light-on-primary border-light-primary"
                  : "border-light-outline text-light-on-surface hover:bg-light-surface-container"
              }`}
              title="Ganti Sesi Rombel"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </button>
          </div>
        </header>

        {/* Session Quick Switcher Drawer (Expandable) */}
        {isSessionSwitcherOpen && (
          <div className="bg-light-surface px-4 py-3 border-b border-light-outline-variant space-y-2 text-body-sm animate-in slide-in-from-top duration-150 shadow-xs">
            <label className="block text-[11px] font-label font-bold text-light-on-surface-variant uppercase">
              Pilih Rombel / Jadwal Aktif Hari Ini:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {sessions.map((sess) => {
                const isSelected = sess.id === activeSession?.id;
                return (
                  <button
                    key={sess.id}
                    type="button"
                    onClick={() => {
                      setActiveSessionId(sess.id);
                      setSessionTopic(sess.topic);
                      setIsSessionSwitcherOpen(false);
                      showToast(`Beralih ke sesi: ${sess.className}`, "info");
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-light-primary bg-light-primary-container/30"
                        : "border-light-outline hover:bg-light-surface-container"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-brand-indigo">{sess.className} ({sess.room})</p>
                      <p className="text-[11px] text-light-on-surface-variant">
                        {sess.timeSlot} &bull; {sess.roster.length} Siswa
                      </p>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-light-primary text-[20px]">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Session Context Header */}
        {activeSession && (
          <div className="p-4 bg-light-surface border-b border-light-outline-variant shadow-2xs">
            {/* Session Badge Card */}
            <div className="bg-gradient-to-br from-light-primary-container/60 via-light-surface-soft to-light-surface p-4 rounded-xl border border-light-primary/30 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-label text-brand-indigo font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  {activeSession.className}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-light-surface border border-light-outline-variant text-light-on-surface font-semibold">
                  {activeSession.room}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-body-sm font-semibold text-light-on-surface-variant shrink-0">Materi:</span>
                <input
                  type="text"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full text-body-sm font-bold text-light-on-surface bg-transparent border-b border-dashed border-light-outline focus:border-light-primary focus:outline-none"
                  placeholder="Tulis topik bahasan sesi..."
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant/60 text-[12px] text-light-on-surface">
                <span className="flex items-center gap-1 text-light-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">person</span>
                  Tutor: <strong className="text-light-on-surface font-semibold">{activeSession.tutorName}</strong>
                </span>
                <span className="flex items-center gap-1 text-light-on-surface-variant font-mono">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">schedule</span>
                  {activeSession.timeSlot}
                </span>
              </div>
            </div>

            {/* Quick Attendance Summary Counters Bar (Real-Time Dynamic Sync) */}
            <div className="grid grid-cols-4 gap-2 mt-3 text-center text-body-sm">
              {/* Counter 1: Hadir */}
              <div className="p-2.5 rounded-xl bg-success text-on-success flex flex-col justify-center shadow-2xs">
                <span className="font-bold font-headline text-title-lg leading-tight">{countHadir}</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">Hadir</span>
              </div>

              {/* Counter 2: Izin */}
              <div className="p-2.5 rounded-xl bg-warning text-on-warning flex flex-col justify-center shadow-2xs">
                <span className="font-bold font-headline text-title-lg leading-tight">{countIzin}</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">Izin</span>
              </div>

              {/* Counter 3: Sakit */}
              <div className="p-2.5 rounded-xl bg-blue-600 text-white flex flex-col justify-center shadow-2xs">
                <span className="font-bold font-headline text-title-lg leading-tight">{countSakit}</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">Sakit</span>
              </div>

              {/* Counter 4: Alpa */}
              <div className="p-2.5 rounded-xl bg-danger text-on-danger flex flex-col justify-center shadow-2xs">
                <span className="font-bold font-headline text-title-lg leading-tight">{countAlpa}</span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">Alpa</span>
              </div>
            </div>
          </div>
        )}

        {/* Student Attendance Roster (Mobile Touch Targets) */}
        <main className="p-4 flex flex-col gap-3 flex-1">
          {/* List Header Actions */}
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-label-sm font-label text-light-on-surface font-bold uppercase tracking-wider">
                Daftar Siswa ({currentRoster.length} Siswa)
              </span>
              <span className="text-[11px] text-light-on-surface-variant block font-normal">
                Ketuk tombol H, I, S, atau A untuk mengubah kehadiran
              </span>
            </div>
            <button
              type="button"
              onClick={markAllPresent}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark text-label-sm font-label font-bold shadow-2xs transition-colors min-h-[36px] active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Semua Hadir</span>
            </button>
          </div>

          {/* Roster Container */}
          {isLoading ? (
            <div className="py-12 text-center text-light-on-surface-variant">
              <div className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Memuat daftar siswa rombel...</span>
              </div>
            </div>
          ) : currentRoster.length === 0 ? (
            <div className="p-6 text-center bg-light-surface rounded-2xl border border-light-outline-variant">
              <span className="material-symbols-outlined text-[32px] text-light-outline block mb-1">group_off</span>
              <p className="text-body-sm text-light-on-surface-variant">Belum ada siswa yang terplotting pada rombel ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentRoster.map((student, idx) => {
                const isPresent = student.status === "hadir";
                const isPermitted = student.status === "izin";
                const isSick = student.status === "sakit";
                const isAbsent = student.status === "alpa";

                const initials = student.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("");

                return (
                  <div
                    key={student.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col gap-3 transition-colors hover:border-light-outline"
                  >
                    {/* Student Identity Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-light-primary-container text-light-primary font-headline font-bold text-title-md flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-light-on-surface text-body-md leading-tight">
                            {idx + 1}. {student.name}
                          </p>
                          <p className="text-[11px] text-light-on-surface-variant mt-0.5">
                            NISN: {student.nisn} &bull; {student.school}
                          </p>
                        </div>
                      </div>

                      {/* Current Status Badge Pill */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap inline-flex items-center gap-1 ${
                          ATTENDANCE_STATUS_META[student.status].badgeClass
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {ATTENDANCE_STATUS_META[student.status].icon}
                        </span>
                        <span>{ATTENDANCE_STATUS_META[student.status].label}</span>
                      </span>
                    </div>

                    {/* Interactive 4-Way Status Buttons (H, I, S, A) */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {/* [H] Hadir Button */}
                      <button
                        type="button"
                        onClick={() => updateStudentStatus(student.id, "hadir")}
                        className={`py-2 px-1 rounded-xl text-body-sm font-bold font-label flex items-center justify-center gap-1 border transition-all active:scale-95 ${
                          isPresent
                            ? "bg-success text-on-success border-success shadow-xs ring-2 ring-success/20"
                            : "border-light-outline text-light-on-surface bg-light-surface hover:bg-light-surface-container"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isPresent ? "check_circle" : "check"}
                        </span>
                        <span>Hadir</span>
                      </button>

                      {/* [I] Izin Button */}
                      <button
                        type="button"
                        onClick={() => updateStudentStatus(student.id, "izin", true)}
                        className={`py-2 px-1 rounded-xl text-body-sm font-bold font-label flex items-center justify-center gap-1 border transition-all active:scale-95 ${
                          isPermitted
                            ? "bg-warning text-on-warning border-warning shadow-xs ring-2 ring-warning/20"
                            : "border-light-outline text-light-on-surface bg-light-surface hover:bg-light-surface-container"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">assignment</span>
                        <span>Izin</span>
                      </button>

                      {/* [S] Sakit Button */}
                      <button
                        type="button"
                        onClick={() => updateStudentStatus(student.id, "sakit", true)}
                        className={`py-2 px-1 rounded-xl text-body-sm font-bold font-label flex items-center justify-center gap-1 border transition-all active:scale-95 ${
                          isSick
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20"
                            : "border-light-outline text-light-on-surface bg-light-surface hover:bg-light-surface-container"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">medical_services</span>
                        <span>Sakit</span>
                      </button>

                      {/* [A] Alpa Button */}
                      <button
                        type="button"
                        onClick={() => updateStudentStatus(student.id, "alpa")}
                        className={`py-2 px-1 rounded-xl text-body-sm font-bold font-label flex items-center justify-center gap-1 border transition-all active:scale-95 ${
                          isAbsent
                            ? "bg-danger text-on-danger border-danger shadow-xs ring-2 ring-danger/20"
                            : "border-light-outline text-light-on-surface bg-light-surface hover:bg-light-surface-container"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                        <span>Alpa</span>
                      </button>
                    </div>

                    {/* Absence / Permission Reason Chip if exists */}
                    {(isPermitted || isSick) && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-light-surface-soft border border-light-outline-variant text-[12px]">
                        <span className="flex items-center gap-1.5 text-light-on-surface truncate">
                          <span className="material-symbols-outlined text-[15px] text-light-primary shrink-0">
                            info
                          </span>
                          <span className="font-medium truncate">
                            {student.notes || "Belum ada keterangan spesifik"}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setReasonModalStudent(student);
                            setReasonModalStatus(student.status);
                            setCustomReason(student.notes || "");
                          }}
                          className="text-[11px] font-semibold text-light-primary hover:underline shrink-0 ml-2 cursor-pointer"
                        >
                          Ubah Alasan
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tutor Pedagogic & Homework Notes */}
          <section className="p-4 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col gap-3 mt-2">
            <div className="flex items-center justify-between">
              <label htmlFor="session-notes" className="text-label-sm font-label text-brand-indigo font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                Catatan Perkembangan Kelas &amp; PR
              </label>
              <span className="text-[11px] text-light-on-surface-variant font-medium">
                Auto-sync ke Wali Murid
              </span>
            </div>

            <textarea
              id="session-notes"
              rows={3}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Tuliskan materi bahasan, pemahaman siswa, kendala umum, dan tugas PR rumah..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-light-outline text-body-sm text-light-on-surface bg-light-surface-soft focus:bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary leading-relaxed transition-colors"
            />

            <div className="flex items-center justify-between text-[11px] text-light-on-surface-variant pt-1">
              <span className="flex items-center gap-1 text-success font-medium">
                <span className="material-symbols-outlined text-[14px]">send</span>
                Notifikasi WA akan dikirim otomatis ke orang tua
              </span>
              <span className="font-mono text-light-outline">
                {sessionNotes.length}/250
              </span>
            </div>
          </section>

          {/* Quick Guidance Box for Tutor */}
          <div className="p-3.5 rounded-xl bg-light-primary-container/40 border border-light-primary/20 flex items-start gap-2.5 text-body-sm">
            <span className="material-symbols-outlined text-light-primary text-[20px] shrink-0 mt-0.5">info</span>
            <p className="text-[12px] text-light-on-primary-container leading-relaxed">
              Tutor wajib mengonfirmasi presensi maksimal <strong>15 menit setelah sesi berakhir</strong> agar rekap honorarium dan pesan WhatsApp ke wali murid terbit tepat waktu.
            </p>
          </div>
        </main>

        {/* Sticky Bottom Save & Submit Bar */}
        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-light-surface/95 backdrop-blur-md border-t border-light-outline-variant p-3 sm:p-4 shadow-xl pb-safe">
          <div className="w-full max-w-xl mx-auto flex items-center gap-3">
            {/* Cancel Button */}
            <Link
              href="/tutor"
              className="px-4 py-3 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md font-semibold transition-colors flex items-center justify-center min-h-[48px] shrink-0"
              title="Tutup Presensi"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </Link>

            {/* Main Submit Button */}
            <button
              type="button"
              disabled={isPending || isLoading}
              onClick={handleSubmitAttendance}
              className="flex-1 py-3 px-4 rounded-xl bg-light-primary text-light-on-primary font-label text-label-lg font-bold shadow-sm hover:bg-brand-indigo-dark active:bg-brand-indigo-dark flex items-center justify-center gap-2 transition-all min-h-[48px] disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  <span>Menyimpan Presensi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[22px]">save</span>
                  <span>Simpan &amp; Kirim Presensi Sesi</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {/* Modal: Keterangan Izin / Sakit Siswa */}
      {reasonModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                Keterangan {ATTENDANCE_STATUS_META[reasonModalStatus].label}
              </h3>
              <button
                type="button"
                onClick={() => setReasonModalStudent(null)}
                className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="font-bold text-body-md text-light-on-surface">
                  {reasonModalStudent.name}
                </p>
                <p className="text-[12px] text-light-on-surface-variant">
                  Pilih alasan ketidakhadiran sesi tatap muka:
                </p>
              </div>

              {/* Quick Presets Grid */}
              <div className="grid grid-cols-2 gap-2">
                {QUICK_REASON_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomReason(preset)}
                    className={`p-2.5 text-left rounded-lg border text-xs font-medium transition-colors ${
                      customReason === preset
                        ? "border-light-primary bg-light-primary-container/40 text-brand-indigo font-bold"
                        : "border-light-outline hover:border-light-primary text-light-on-surface"
                    }`}
                  >
                    {preset.replace(/^.*?\((.*?)\)$/, "$1")}
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="custom-reason-input" className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  id="custom-reason-input"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Contoh: Mengikuti seleksi OSN Matematika"
                  className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary min-h-[44px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReasonModalStudent(null)}
                  className="flex-1 py-2.5 rounded-lg border border-light-outline text-light-on-surface font-semibold text-body-sm min-h-[44px] hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveReason}
                  className="flex-1 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-bold text-body-sm hover:bg-brand-indigo-dark min-h-[44px]"
                >
                  Simpan Alasan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
