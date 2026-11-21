"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PortalStudentProfile,
  PortalDataResult,
} from "@/lib/portal-constants";
import {
  getPortalDataAction,
  submitPortalAbsenceNoticeAction,
} from "@/app/actions/portal";

export default function StudentPortalPage() {
  const [students, setStudents] = useState<PortalStudentProfile[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<"home" | "jadwal" | "materi" | "tagihan">("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Absence form state
  const [absenceReason, setAbsenceReason] = useState("Sakit");
  const [absenceSession, setAbsenceSession] = useState("Hari Ini — Sesi Reguler");
  const [absenceNotes, setAbsenceNotes] = useState("");
  const [isSubmittingAbsence, setIsSubmittingAbsence] = useState(false);

  const showToast = (message: string, type: "success" | "info" = "info") => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res: PortalDataResult = await getPortalDataAction();
      if (res.success && res.students.length > 0) {
        setStudents(res.students);
        setActiveStudentId(res.activeStudentId || res.students[0].id);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const activeStudent: PortalStudentProfile | undefined =
    students.find((s) => s.id === activeStudentId) || students[0];

  const handleSelectStudent = (id: string) => {
    setActiveStudentId(id);
    setIsDropdownOpen(false);
    const selected = students.find((s) => s.id === id);
    if (selected) {
      showToast(`Beralih ke profil siswa: ${selected.fullName}`, "info");
    }
  };

  const handleAbsenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    setIsSubmittingAbsence(true);
    const res = await submitPortalAbsenceNoticeAction({
      studentId: activeStudent.id,
      studentName: activeStudent.fullName,
      sessionTitle: absenceSession,
      reason: absenceReason,
      notes: absenceNotes,
    });
    setIsSubmittingAbsence(false);
    setIsAbsenceModalOpen(false);
    setAbsenceNotes("");

    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.message || "Gagal mengirim izin absen", "info");
    }
  };

  const handleDownloadReceipt = (invNumber: string) => {
    showToast(`Mengunduh Kuitansi Resmi #${invNumber} (PDF)...`, "success");
  };

  const handleOpenTutorChat = () => {
    if (!activeStudent) return;
    const tutorName = activeStudent.upcomingClass.tutor.split(",")[0];
    const text = encodeURIComponent(
      `Halo ${tutorName}, saya ${activeStudent.parentName} (${activeStudent.parentRelationship} dari ${activeStudent.fullName}). Ingin berkonsultasi mengenai perkembangan belajar di ARCI.`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="bg-light-surface-soft min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-light-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-sm font-semibold text-brand-indigo">Memuat Portal Siswa &amp; Orang Tua...</p>
        </div>
      </div>
    );
  }

  if (!activeStudent) {
    return (
      <div className="bg-light-surface-soft min-h-screen flex items-center justify-center p-4">
        <div className="p-6 bg-light-surface rounded-2xl border border-light-outline-variant shadow-md text-center max-w-md">
          <span className="material-symbols-outlined text-[40px] text-light-on-surface-variant">person_off</span>
          <h2 className="font-headline font-bold text-title-md text-light-on-surface mt-2">Tidak Ada Data Siswa</h2>
          <p className="text-body-sm text-light-on-surface-variant mt-1">Belum ada akun siswa aktif yang terdaftar di database.</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-light-primary text-light-on-primary rounded-xl font-bold text-body-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body antialiased min-h-screen flex flex-col pb-24 lg:pb-0 selection:bg-brand-indigo selection:text-white">
      {/* Toast Notification Container */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-[90%] pointer-events-none">
          <div
            className={`p-3.5 rounded-xl shadow-xl border text-body-sm font-medium flex items-center gap-2.5 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200 ${
              toastMsg.type === "success"
                ? "bg-light-surface text-light-on-surface border-success border-l-4 border-l-success"
                : "bg-light-surface text-light-on-surface border-brand-indigo border-l-4 border-l-brand-indigo"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] shrink-0 ${
                toastMsg.type === "success" ? "text-success" : "text-brand-indigo"
              }`}
            >
              {toastMsg.type === "success" ? "check_circle" : "info"}
            </span>
            <span className="text-body-sm text-light-on-surface flex-1">{toastMsg.message}</span>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-light-on-surface-variant hover:text-light-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Centered Mobile Viewport Frame */}
      <div className="w-full max-w-xl mx-auto bg-light-surface-soft min-h-screen shadow-md flex flex-col border-x border-light-outline-variant/60 pb-24">
        {/* MOBILE TOP BAR WITH CHILD SWITCHER */}
        <header className="bg-light-surface border-b border-light-outline-variant px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-light-primary text-light-on-primary flex items-center justify-center font-headline font-bold text-title-md shadow-xs hover:bg-brand-indigo-dark transition-colors"
              title="Kembali ke Beranda"
            >
              A
            </Link>
            <div>
              <h1 className="font-headline font-bold text-title-md text-brand-indigo leading-tight">Portal ARCI Bimbel</h1>
              <p className="text-[11px] text-light-on-surface-variant font-medium">
                Selamat datang, {activeStudent.parentName}
              </p>
            </div>
          </div>

          {/* Student Switcher Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-light-surface-container-low border border-light-outline-variant hover:border-light-primary text-[11px] font-label font-bold text-light-on-surface shadow-2xs transition-colors min-h-[38px]"
            >
              <span className="material-symbols-outlined text-[15px] text-light-primary">face</span>
              <span>{activeStudent.shortName}</span>
              <span className="material-symbols-outlined text-[15px] text-light-on-surface-variant">
                {isDropdownOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Child Switcher Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-2.5 py-1 text-[10px] font-label font-bold text-light-on-surface-variant uppercase tracking-wider">
                  Pilih Profil Siswa
                </p>

                {students.map((st) => {
                  const isSelected = st.id === activeStudent.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectStudent(st.id)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-light-primary-container/40 border border-light-primary/30"
                          : "hover:bg-light-surface-container"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center ${
                            isSelected ? "bg-light-primary text-light-on-primary" : "bg-light-surface-container text-light-on-surface"
                          }`}
                        >
                          {st.initials}
                        </div>
                        <div>
                          <p className="font-bold text-body-sm text-light-on-surface">{st.fullName}</p>
                          <p className="text-[10px] text-light-on-surface-variant">{st.grade}</p>
                        </div>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isSelected ? "text-light-primary" : "text-transparent"
                        }`}
                      >
                        check_circle
                      </span>
                    </button>
                  );
                })}

                <div className="pt-1 border-t border-light-outline-variant/60 flex items-center justify-between px-2 text-[11px]">
                  <Link href="/login" className="text-danger font-semibold hover:underline flex items-center gap-1 py-1">
                    <span className="material-symbols-outlined text-[14px]">logout</span>
                    Keluar Akun
                  </Link>
                  <Link href="/" className="text-light-primary font-semibold hover:underline py-1">
                    Beranda Web
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* TAB 1: BERANDA / OVERVIEW */}
        {currentTab === "home" && (
          <main className="p-4 flex flex-col gap-4 flex-1">
            {/* Next Upcoming Class Hero Card */}
            <section className="bg-gradient-to-br from-light-primary-container/70 via-light-surface-soft to-light-surface rounded-2xl border-2 border-light-primary/40 p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-light-primary text-light-on-primary font-bold shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Sesi Belajar Berikutnya
                </span>
                <span className="text-[11px] text-brand-indigo font-bold bg-light-surface px-2 py-0.5 rounded-md border border-light-outline-variant font-mono">
                  {activeStudent.upcomingClass.timeLabel}
                </span>
              </div>

              <div>
                <h2 className="font-headline text-headline-sm font-bold text-light-on-surface">
                  {activeStudent.upcomingClass.title}
                </h2>
                <p className="text-body-sm text-light-on-surface-variant mt-0.5 font-medium">
                  {activeStudent.upcomingClass.topic}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-light-outline-variant text-body-sm text-light-on-surface">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-light-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">person</span>
                    <span>{activeStudent.upcomingClass.tutor}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-light-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">location_on</span>
                    <span>{activeStudent.upcomingClass.room}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-label-sm font-label font-bold hover:bg-brand-indigo-dark shadow-2xs transition-colors self-start sm:self-auto min-h-[36px]"
                >
                  Detail Sesi &amp; Zoom
                </button>
              </div>
            </section>

            {/* Academic & Attendance Snapshot (2 Cols Grid) */}
            <section className="grid grid-cols-2 gap-3">
              {/* Attendance Metric Card */}
              <div className="p-3.5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-label font-bold text-light-on-surface-variant uppercase tracking-wider">
                    Kehadiran Siswa
                  </span>
                  <span className="w-6 h-6 rounded-md bg-success/15 text-success flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </span>
                </div>
                <div className="mt-2.5">
                  <span className="font-headline font-bold text-title-lg text-success">
                    {activeStudent.attendance.rateStr}
                  </span>
                  <p className="text-[11px] text-light-on-surface-variant mt-0.5">
                    {activeStudent.attendance.detailStr}
                  </p>
                  <div className="w-full bg-light-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-success h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeStudent.attendance.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Tryout Average Metric Card */}
              <div className="p-3.5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-label font-bold text-light-on-surface-variant uppercase tracking-wider">
                    Rata-rata Tryout
                  </span>
                  <span className="w-6 h-6 rounded-md bg-light-primary-container text-light-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">analytics</span>
                  </span>
                </div>
                <div className="mt-2.5">
                  <span className="font-headline font-bold text-title-lg text-brand-indigo">
                    {activeStudent.evaluation.scoreStr}
                  </span>
                  <p className="text-[11px] text-success font-semibold mt-0.5 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    {activeStudent.evaluation.trendStr}
                  </p>
                  <div className="w-full bg-light-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-brand-indigo h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeStudent.evaluation.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Latest Tutor Note to Parent */}
            <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-2xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-label text-brand-indigo font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                  <span>{activeStudent.evaluation.noteTitle}</span>
                </span>
                <span className="text-[11px] text-light-on-surface-variant font-mono">
                  {activeStudent.evaluation.noteDate}
                </span>
              </div>
              <p className="text-body-sm text-light-on-surface italic bg-light-surface-soft p-3.5 rounded-xl border border-light-outline-variant/70 leading-relaxed">
                {activeStudent.evaluation.noteBody}
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-light-on-surface-variant">
                <span className="flex items-center gap-1 text-success font-medium">
                  <span className="material-symbols-outlined text-[14px]">done_all</span>
                  Terbaca oleh wali murid
                </span>
                <button
                  type="button"
                  onClick={handleOpenTutorChat}
                  className="text-light-primary font-semibold hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">chat</span>
                  Balas via WhatsApp
                </button>
              </div>
            </section>

            {/* Financial Status & Billing Card */}
            <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-light-primary text-[20px]">receipt_long</span>
                  <span className="font-headline font-bold text-title-md text-light-on-surface">Tagihan &amp; SPP Belajar</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold shadow-2xs ${activeStudent.billing.statusClass}`}
                >
                  {activeStudent.billing.statusBadge}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-center justify-between text-body-sm gap-2">
                <div>
                  <p className="font-semibold text-light-on-surface">{activeStudent.billing.invoiceTitle}</p>
                  <p className="text-[11px] text-light-on-surface-variant font-mono">{activeStudent.billing.invoiceMeta}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadReceipt(activeStudent.invoices[0]?.invoiceNumber || "INV-2026-1189")}
                  className="px-3 py-1.5 rounded-lg border border-light-outline text-light-on-surface text-[11px] font-label font-semibold hover:bg-light-surface shadow-2xs transition-colors shrink-0 flex items-center gap-1 min-h-[36px]"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Unduh Kuitansi</span>
                </button>
              </div>
            </section>

            {/* Quick Action Utilities Grid */}
            <section className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsAbsenceModalOpen(true)}
                className="p-3 rounded-xl bg-light-surface border border-light-outline-variant hover:border-light-primary shadow-2xs flex items-center gap-2.5 text-left transition-colors min-h-[44px]"
              >
                <span className="material-symbols-outlined text-amber-600 text-[22px]">event_busy</span>
                <div>
                  <p className="font-bold text-body-sm text-light-on-surface">Ajukan Izin Absen</p>
                  <p className="text-[10px] text-light-on-surface-variant">Sakit / keperluan dinas</p>
                </div>
              </button>

              <Link
                href="/portal/jadwal"
                className="p-3 rounded-xl bg-light-surface border border-light-outline-variant hover:border-light-primary shadow-2xs flex items-center gap-2.5 text-left transition-colors min-h-[44px]"
              >
                <span className="material-symbols-outlined text-brand-indigo text-[22px]">menu_book</span>
                <div>
                  <p className="font-bold text-body-sm text-light-on-surface">Jadwal &amp; Tugas PR</p>
                  <p className="text-[10px] text-light-on-surface-variant">Unduh modul &amp; tugas</p>
                </div>
              </Link>
            </section>
          </main>
        )}

        {/* TAB 2: JADWAL KELAS LENGKAP */}
        {currentTab === "jadwal" && (
          <main className="p-4 flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-title-lg text-brand-indigo">Jadwal Sesi Belajar</h2>
                <p className="text-[12px] text-light-on-surface-variant">Kalender sesi mingguan &amp; link siaran langsung</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-light-primary-container text-light-primary font-bold text-[11px] font-mono">
                Pekan Berjalan
              </span>
            </div>

            <div className="space-y-3">
              {activeStudent.schedules.map((sch) => (
                <div
                  key={sch.id}
                  className={`p-4 rounded-2xl bg-light-surface border shadow-2xs flex flex-col gap-2.5 ${
                    sch.isToday ? "border-2 border-light-primary shadow-xs" : "border-light-outline-variant"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        sch.isToday
                          ? "bg-success text-on-success"
                          : "bg-light-surface-container text-light-on-surface"
                      }`}
                    >
                      {sch.dayLabel}
                    </span>
                    <span className="text-body-sm font-bold text-brand-indigo font-mono">{sch.timeSlot}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-body-md text-light-on-surface">{sch.title}</h3>
                    <p className="text-body-sm text-light-on-surface-variant">Materi: {sch.topic}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant text-[12px] text-light-on-surface-variant">
                    <span>Tutor: {sch.tutor}</span>
                    <span className="font-medium text-brand-indigo">{sch.room}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={sch.zoomUrl || "https://zoom.us"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-light-primary text-light-on-primary text-center text-label-sm font-bold shadow-2xs hover:bg-brand-indigo-dark transition-colors flex items-center justify-center gap-1.5 min-h-[38px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">videocam</span>
                      <span>Akses Zoom Hybrid</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setAbsenceSession(`${sch.dayLabel} — ${sch.title}`);
                        setIsAbsenceModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-lg border border-light-outline text-light-on-surface text-label-sm font-medium hover:bg-light-surface-container transition-colors min-h-[38px]"
                    >
                      Izin Sesi Ini
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* TAB 3: MATERI & RAPOR */}
        {currentTab === "materi" && (
          <main className="p-4 flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-title-lg text-brand-indigo">Materi &amp; Rapor Akademik</h2>
                <p className="text-[12px] text-light-on-surface-variant">Modul ajar, rekaman video &amp; perkembangan tryout</p>
              </div>
              <Link
                href="/portal/rapor"
                className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-label-sm font-bold shadow-2xs hover:bg-brand-indigo-dark transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">analytics</span>
                <span>Buka Rapor</span>
              </Link>
            </div>

            {/* Tryout Performance Card */}
            <div className="p-4 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline font-bold text-title-md text-light-on-surface">Hasil Evaluasi Belajar</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success text-on-success">
                  {activeStudent.evaluation.predicate}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-body-sm">
                {activeStudent.evaluation.subjectScores.map((subj, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-light-surface-soft border border-light-outline-variant">
                    <p className="text-[11px] text-light-on-surface-variant font-medium">{subj.subject}</p>
                    <p className="font-headline font-bold text-title-md text-brand-indigo mt-0.5">{subj.score}</p>
                  </div>
                ))}
              </div>

              {activeStudent.evaluation.rankText && (
                <p className="text-[12px] text-light-on-surface-variant italic">
                  *{activeStudent.evaluation.rankText}
                </p>
              )}
            </div>

            {/* Downloadable Modul & Video */}
            <div className="space-y-2.5">
              <p className="font-label text-label-sm font-bold text-light-on-surface uppercase tracking-wider">
                Modul Pembelajaran Tersedia
              </p>

              {activeStudent.materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-3 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        mat.type === "PDF"
                          ? "bg-red-100 text-red-700"
                          : mat.type === "VID"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {mat.type}
                    </div>
                    <div>
                      <p className="font-bold text-body-sm text-light-on-surface">{mat.title}</p>
                      <p className="text-[11px] text-light-on-surface-variant">
                        {mat.fileSize} &bull; {mat.category} &bull; {mat.createdAt}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`Mengunduh materi: ${mat.title}...`, "success")}
                    className="p-2 rounded-lg hover:bg-light-surface-container text-light-primary"
                    title="Unduh Modul"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {mat.type === "VID" ? "play_circle" : "download"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* TAB 4: TAGIHAN & INVOICE SPP */}
        {currentTab === "tagihan" && (
          <main className="p-4 flex flex-col gap-4 flex-1">
            <div>
              <h2 className="font-headline font-bold text-title-lg text-brand-indigo">Status Keuangan &amp; Tagihan SPP</h2>
              <p className="text-[12px] text-light-on-surface-variant">
                Rincian invoice bulanan, kuitansi resmi, dan pembayaran
              </p>
            </div>

            {/* Current Billing Summary Card */}
            <div className="p-4 rounded-2xl bg-light-surface border-2 border-success/40 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-label-sm font-bold text-light-on-surface uppercase">Bulan Berjalan</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    activeStudent.billing.unpaidCount === 0 ? "bg-success text-on-success" : "bg-warning text-on-warning"
                  }`}
                >
                  {activeStudent.billing.unpaidCount === 0 ? "Semua Tagihan Lunas" : `${activeStudent.billing.unpaidCount} Tagihan Menunggu`}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-light-on-surface-variant font-label">Total Dibayarkan (Nov 2026):</span>
                <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-0.5">
                  {activeStudent.billing.totalPaidFormatted}
                </p>
              </div>
              <p className="text-[12px] text-light-on-surface-variant">
                Tagihan SPP berikutnya akan otomatis diperbarui setiap awal bulan periode bimbingan.
              </p>
            </div>

            {/* Invoice History List */}
            <div className="space-y-2.5">
              <p className="font-label text-label-sm font-bold text-light-on-surface uppercase tracking-wider">
                Riwayat Pembayaran &amp; Kwitansi
              </p>

              {activeStudent.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-body-sm text-light-on-surface">{inv.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.statusBadgeClass}`}>
                        {inv.statusLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-light-on-surface-variant font-mono mt-0.5">
                      {inv.invoiceNumber} &bull; {inv.amountFormatted} &bull; Jatuh Tempo: {inv.dueDate}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadReceipt(inv.invoiceNumber)}
                    className="px-2.5 py-1.5 rounded-lg border border-light-outline text-xs font-semibold hover:bg-light-surface-container flex items-center gap-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[15px]">receipt</span>
                    <span>Kuitansi</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Payment Support Card */}
            <div className="p-4 rounded-xl bg-light-primary-container/40 border border-light-primary/20 flex items-center justify-between text-body-sm">
              <div>
                <p className="font-bold text-brand-indigo">Butuh Bantuan Tagihan?</p>
                <p className="text-[11px] text-light-on-primary-container">Konfirmasi mutasi &amp; konsultasi bagian keuangan</p>
              </div>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20Keuangan%20ARCI,%20saya%20ingin%20konfirmasi%20SPP"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-xs font-bold hover:bg-brand-indigo-dark transition-colors shrink-0"
              >
                Chat Kasir
              </a>
            </div>
          </main>
        )}

        {/* STICKY BOTTOM MOBILE NAVIGATION FOR PORTAL */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-light-surface/95 backdrop-blur-md border-t border-light-outline-variant px-6 py-2 shadow-lg pb-safe">
          <div className="w-full max-w-xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentTab("home")}
              className={`flex flex-col items-center gap-0.5 font-label text-[11px] transition-colors min-h-[44px] min-w-[56px] justify-center ${
                currentTab === "home" ? "text-light-primary font-bold" : "text-light-on-surface-variant hover:text-light-primary font-medium"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>Beranda</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab("jadwal")}
              className={`flex flex-col items-center gap-0.5 font-label text-[11px] transition-colors min-h-[44px] min-w-[56px] justify-center ${
                currentTab === "jadwal" ? "text-light-primary font-bold" : "text-light-on-surface-variant hover:text-light-primary font-medium"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>Jadwal</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab("materi")}
              className={`flex flex-col items-center gap-0.5 font-label text-[11px] transition-colors min-h-[44px] min-w-[56px] justify-center ${
                currentTab === "materi" ? "text-light-primary font-bold" : "text-light-on-surface-variant hover:text-light-primary font-medium"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">book</span>
              <span>Materi</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab("tagihan")}
              className={`flex flex-col items-center gap-0.5 font-label text-[11px] transition-colors min-h-[44px] min-w-[56px] justify-center ${
                currentTab === "tagihan" ? "text-light-primary font-bold" : "text-light-on-surface-variant hover:text-light-primary font-medium"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              <span>Tagihan</span>
            </button>
          </div>
        </nav>
      </div>

      {/* MODAL: AJUKAN IZIN KETIDAKHADIRAN */}
      {isAbsenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
              <div className="flex items-center gap-2 text-brand-indigo">
                <span className="material-symbols-outlined text-[20px]">event_busy</span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">Ajukan Izin Absen Siswa</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAbsenceModalOpen(false)}
                className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAbsenceSubmit} className="p-5 space-y-3 text-body-sm">
              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Nama Siswa</label>
                <input
                  type="text"
                  readOnly
                  value={`${activeStudent.fullName} (${activeStudent.classCode})`}
                  className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-light-on-surface font-medium min-h-[40px]"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Sesi Kelas yang Diizinkan
                </label>
                <select
                  value={absenceSession}
                  onChange={(e) => setAbsenceSession(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface min-h-[40px]"
                >
                  <option value={`Hari Ini — ${activeStudent.upcomingClass.title}`}>
                    Hari Ini — {activeStudent.upcomingClass.title} ({activeStudent.upcomingClass.timeSlot})
                  </option>
                  <option value="Sabtu — Sesi Tambahan / Laboratorium">Sabtu — Sesi Tambahan / Laboratorium</option>
                  <option value="Senin — Sesi Evaluasi Awal Pekan">Senin — Sesi Evaluasi Awal Pekan</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Alasan Tidak Hadir</label>
                <select
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface min-h-[40px]"
                >
                  <option value="Sakit">Sakit (Demam / Kurang Enak Badan)</option>
                  <option value="Lomba">Mengikuti Lomba / Acara Sekolah</option>
                  <option value="Keluarga">Acara Keluarga / Kepentingan Mendesak</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Pesan / Catatan untuk Tutor
                </label>
                <textarea
                  rows={2}
                  value={absenceNotes}
                  onChange={(e) => setAbsenceNotes(e.target.value)}
                  placeholder="Mohon izin tidak dapat hadir tatap muka. Minta link rekaman kelas..."
                  className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAbsenceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-light-outline text-light-on-surface font-semibold text-body-sm min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAbsence}
                  className="flex-1 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-bold text-body-sm hover:bg-brand-indigo-dark min-h-[44px] disabled:opacity-50"
                >
                  {isSubmittingAbsence ? "Mengirim..." : "Kirim Izin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL SESI KELAS & HYBRID ZOOM LINK */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">Rincian Sesi Belajar</h3>
              <button
                type="button"
                onClick={() => setIsSessionModalOpen(false)}
                className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-3 text-body-sm">
              <div className="p-3 rounded-xl bg-light-primary-container/40 border border-light-primary/20">
                <p className="font-bold text-brand-indigo">{activeStudent.upcomingClass.title}</p>
                <p className="text-[12px] text-light-on-surface-variant mt-0.5">{activeStudent.upcomingClass.topic}</p>
              </div>

              <div className="space-y-1.5 text-body-sm text-light-on-surface">
                <div className="flex items-center justify-between py-1 border-b border-light-outline-variant/60">
                  <span className="text-light-on-surface-variant">Jadwal Sesi</span>
                  <span className="font-semibold font-mono">{activeStudent.upcomingClass.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-light-outline-variant/60">
                  <span className="text-light-on-surface-variant">Lokasi / Ruang</span>
                  <span className="font-semibold">{activeStudent.upcomingClass.room}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-light-outline-variant/60">
                  <span className="text-light-on-surface-variant">Tutor Pengampu</span>
                  <span className="font-semibold">{activeStudent.upcomingClass.tutor}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-light-on-surface-variant">Format Sesi</span>
                  <span className="font-semibold text-success">Tatap Muka &amp; Hybrid Zoom</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={activeStudent.upcomingClass.zoomUrl || "https://zoom.us"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-light-primary text-light-on-primary font-bold text-center hover:bg-brand-indigo-dark transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span>Buka Tautan Zoom Kelas</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-light-outline text-light-on-surface font-semibold text-center hover:bg-light-surface-container transition-colors min-h-[44px]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
