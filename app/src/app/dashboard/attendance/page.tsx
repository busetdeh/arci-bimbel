"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StudentRosterItem {
  id: string;
  name: string;
  nisn: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpa";
  time?: string;
  note?: string;
}

interface AttendanceSession {
  id: string;
  code: string;
  title: string;
  sessionNumber: string;
  timeSlot: string;
  room: string;
  tutor: string;
  status: "Sudah Terisi" | "Menunggu Input" | "Belum Dimulai";
  statusColor: string;
  submittedAt?: string;
  roster: StudentRosterItem[];
}

const mockAttendanceSessions: AttendanceSession[] = [
  {
    id: "SES-001",
    code: "UTBK-12A",
    title: "UTBK 12-IPA — Fisika Gelombang",
    sessionNumber: "SESI 1",
    timeSlot: "14:00 - 15:30 WIB",
    room: "Lab Newton",
    tutor: "Budi Pratama, S.Si.",
    status: "Sudah Terisi",
    statusColor: "bg-success/15 text-success",
    submittedAt: "Hari ini, 15:28 WIB via Tablet Tutor",
    roster: [
      { id: "1", name: "Ahmad Rizky Pratama", nisn: "00891234", status: "Hadir", time: "14:02" },
      { id: "2", name: "Nadia Amanda Putri", nisn: "00892451", status: "Hadir", time: "14:00" },
      { id: "3", name: "Bima Pangestu", nisn: "00893321", status: "Sakit", note: "Surat dokter terlampir di WA" },
      { id: "4", name: "Dimas Kurniawan", nisn: "00894100", status: "Alpa", note: "Tanpa konfirmasi" },
    ],
  },
  {
    id: "SES-002",
    code: "SMA-12IPS",
    title: "SMA 12-IPS — Ekonomi Makro",
    sessionNumber: "SESI 2",
    timeSlot: "16:00 - 17:30 WIB",
    room: "R. Adam Smith",
    tutor: "Rina Kusuma, S.E.",
    status: "Menunggu Input",
    statusColor: "bg-warning/15 text-warning",
    roster: [
      { id: "5", name: "Farhan Pratama", nisn: "00912345", status: "Hadir" },
      { id: "6", name: "Bagas Wicaksono", nisn: "00887654", status: "Hadir" },
    ],
  },
  {
    id: "SES-003",
    code: "ONLINE-ENG",
    title: "ONLINE — Literasi Bahasa Inggris",
    sessionNumber: "MALAM",
    timeSlot: "19:00 - 20:30 WIB",
    room: "Google Meet #2",
    tutor: "Sarah Priscillia, M.Pd.",
    status: "Belum Dimulai",
    statusColor: "bg-light-surface-container text-light-on-surface",
    roster: [
      { id: "7", name: "Aqila Zahra", nisn: "01023456", status: "Hadir" },
    ],
  },
];

export default function AttendancePage() {
  const [sessions, setSessions] = useState<AttendanceSession[]>(mockAttendanceSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("SES-001");
  const [overrideModalStudent, setOverrideModalStudent] = useState<StudentRosterItem | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<StudentRosterItem["status"]>("Hadir");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModalStudent) return;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSession.id) return s;
        return {
          ...s,
          roster: s.roster.map((r) =>
            r.id === overrideModalStudent.id
              ? { ...r, status: overrideStatus, note: "Dikoreksi Admin Operasional" }
              : r
          ),
        };
      })
    );
    setOverrideModalStudent(null);
    showToast(`Status kehadiran ${overrideModalStudent.name} berhasil diperbarui!`);
  };

  const hadirCount = selectedSession.roster.filter((r) => r.status === "Hadir").length;
  const totalCount = selectedSession.roster.length;
  const attendanceRate = totalCount > 0 ? Math.round((hadirCount / totalCount) * 100) : 0;

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

      {/* Top Title and Filter Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-light-on-surface-variant">
            <span>Operasional Akademik</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-semibold text-light-primary">Rekap Presensi &amp; Kehadiran</span>
          </div>
          <h1 className="text-headline-sm sm:text-headline-md font-headline font-bold text-light-on-surface mt-1">
            Dashboard Presensi &amp; Rekap Kehadiran Siswa
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Monitoring absensi real-time, audit kehadiran tutor, dan rekap otomatis portal orang tua.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tutor/presensi"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-semibold transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
            <span>Mode Presensi Tutor</span>
          </Link>

          <button
            type="button"
            onClick={() => showToast("Rekap presensi berhasil diekspor ke Excel!")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Ekspor Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Tingkat Kehadiran Bulan Ini
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-brand-indigo font-headline">96.4%</div>
            <div className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +1.2% di atas target 95%
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Siswa Hadir Hari Ini
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-light-on-surface font-headline">
              128 <span className="text-body-md text-light-on-surface-variant font-normal">/ 134 Siswa</span>
            </div>
            <div className="text-body-sm text-light-on-surface-variant mt-1">4 Izin/Sakit, 2 Alpa</div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Sesi Menunggu Input
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-warning font-headline">1 Sesi</div>
            <div className="text-body-sm text-warning flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Ekonomi Makro (Selesai 17:30)
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Peringatan Kehadiran &lt;80%
            </span>
            <span className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-danger font-headline">2 Siswa</div>
            <div className="text-body-sm text-danger flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">flag</span>
              Perlu follow-up konseling wali murid
            </div>
          </div>
        </div>
      </section>

      {/* Main Operational Area: Session Grid & Detailed Roster Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Sessions List (7 cols) */}
        <div className="xl:col-span-7 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Daftar Sesi Kelas Hari Ini
              </h2>
              <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                Status verifikasi presensi oleh tutor pengampu.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-label-sm font-semibold bg-light-surface-container text-light-on-surface">
              Total: {sessions.length} Sesi
            </span>
          </div>

          <div className="divide-y divide-light-outline-variant">
            {sessions.map((sess) => {
              const isSelected = sess.id === selectedSession.id;
              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-light-primary-container/20 border-l-4 border-light-primary"
                      : "hover:bg-light-surface-container"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-light-primary text-light-on-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">class</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-body-md text-brand-indigo">
                          {sess.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-light-primary-container text-light-primary">
                          {sess.sessionNumber}
                        </span>
                      </div>
                      <div className="text-body-sm text-light-on-surface mt-0.5">
                        {sess.timeSlot} • {sess.room} • Tutor: {sess.tutor}
                      </div>
                      <div className="text-[11px] text-light-on-surface-variant mt-1">
                        {sess.roster.length} Siswa Terdaftar
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-label-sm font-semibold ${sess.statusColor}`}>
                      {sess.status}
                    </span>
                    {sess.submittedAt && (
                      <span className="text-[11px] text-light-on-surface-variant">
                        {sess.submittedAt.split("via")[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Student Attendance Roster Inspector (5 cols) */}
        <div className="xl:col-span-5 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs flex flex-col p-5 sm:p-6 gap-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-light-outline-variant pb-4">
            <div>
              <span className="text-label-sm text-light-primary font-bold uppercase tracking-wider">
                INSPEKTOR PRESENSI SESI
              </span>
              <h3 className="font-headline font-bold text-title-md text-light-on-surface mt-0.5">
                {selectedSession.title}
              </h3>
            </div>
          </div>

          <div className="p-3.5 bg-light-surface-soft rounded-xl border border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-body-sm">
            <div>
              <div className="font-semibold text-light-on-surface">Tutor: {selectedSession.tutor}</div>
              <div className="text-[11px] text-light-on-surface-variant">
                {selectedSession.submittedAt || "Presensi belum disubmit tutor"}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-label-sm font-bold bg-success/15 text-success whitespace-nowrap">
              {hadirCount} / {totalCount} Hadir ({attendanceRate}%)
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-label-sm font-semibold text-light-on-surface">
              Daftar Kehadiran Siswa:
            </span>

            <div className="border border-light-outline-variant rounded-xl overflow-hidden divide-y divide-light-outline-variant">
              {selectedSession.roster.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    setOverrideModalStudent(student);
                    setOverrideStatus(student.status);
                  }}
                  className="p-3 flex items-center justify-between bg-light-surface hover:bg-light-surface-container cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center font-bold text-label-sm">
                      {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-body-sm font-semibold text-light-on-surface">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-light-on-surface-variant">
                        NISN: {student.nisn} {student.note ? `• ${student.note}` : ""}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      student.status === "Hadir"
                        ? "bg-success/15 text-success"
                        : student.status === "Sakit" || student.status === "Izin"
                        ? "bg-warning/15 text-warning"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {student.status} {student.time ? `(${student.time})` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Override Attendance Modal */}
      {overrideModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-md w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                Koreksi Presensi Siswa
              </h3>
              <button
                type="button"
                onClick={() => setOverrideModalStudent(null)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="flex flex-col gap-3 text-body-sm">
              <p className="text-light-on-surface">
                Siswa: <strong>{overrideModalStudent.name}</strong> ({overrideModalStudent.nisn})
              </p>

              <div>
                <label className="font-semibold block mb-1">Status Kehadiran</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as StudentRosterItem["status"])}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline bg-light-surface"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpa">Alpa / Tanpa Keterangan</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Alasan Koreksi Admin</label>
                <input
                  type="text"
                  required
                  defaultValue="Konfirmasi izin via pesan WhatsApp orang tua"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setOverrideModalStudent(null)}
                  className="px-4 py-2 rounded-lg border border-light-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold"
                >
                  Simpan Koreksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
