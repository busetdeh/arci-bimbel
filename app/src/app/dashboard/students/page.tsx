"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Student {
  id: string;
  nisn: string;
  name: string;
  level: "SD" | "SMP" | "SMA";
  school: string;
  parent: string;
  phone: string;
  className: string;
  branch: string;
  attendance: string;
  sppStatus: "Lunas" | "Menunggu" | "Tertunda";
  sppBadge: string;
}

const mockStudents: Student[] = [
  {
    id: "STU-2026-001",
    nisn: "0089123456",
    name: "Ahmad Rizky Pratama",
    level: "SMA",
    school: "SMAN 8 Jakarta • Kelas 12 IPA 2",
    parent: "Hendra Pratama",
    phone: "0812-3456-7890",
    className: "Intensif UTBK 2026-A",
    branch: "Cabang Sudirman Utama",
    attendance: "96.2%",
    sppStatus: "Lunas",
    sppBadge: "bg-success/15 text-success",
  },
  {
    id: "STU-2026-002",
    nisn: "0091234567",
    name: "Farhan Pratama",
    level: "SMP",
    school: "SMPN 115 Jakarta • Kelas 8-B",
    parent: "Dra. Nurhayati",
    phone: "0812-3456-7890",
    className: "Reguler SMP Kelas 8",
    branch: "Cabang Sudirman",
    attendance: "92.8%",
    sppStatus: "Lunas",
    sppBadge: "bg-success/15 text-success",
  },
  {
    id: "STU-2026-003",
    nisn: "0078901234",
    name: "Nadia Amanda",
    level: "SMA",
    school: "SMAN 28 Jakarta • Kelas 12",
    parent: "Pak Hermawan",
    phone: "0821-1234-5678",
    className: "Intensif UTBK Online #1",
    branch: "Online Zoom #1",
    attendance: "89.5%",
    sppStatus: "Menunggu",
    sppBadge: "bg-warning/15 text-warning",
  },
  {
    id: "STU-2026-004",
    nisn: "0102345678",
    name: "Aqila Zahra",
    level: "SD",
    school: "SD Al-Azhar • Kelas 5",
    parent: "Ibu Sarah",
    phone: "0856-7788-9900",
    className: "Reguler SD Kelas 5-A",
    branch: "Cabang Sudirman",
    attendance: "98.0%",
    sppStatus: "Lunas",
    sppBadge: "bg-success/15 text-success",
  },
  {
    id: "STU-2026-005",
    nisn: "0088765432",
    name: "Bagas Wicaksono",
    level: "SD",
    school: "SD Cempaka Putih • Kelas 6",
    parent: "Ibu Indah",
    phone: "0819-2233-4455",
    className: "Reguler SD Kelas 6-A",
    branch: "Cabang Kebayoran",
    attendance: "94.5%",
    sppStatus: "Tertunda",
    sppBadge: "bg-danger/15 text-danger",
  },
];

export default function StudentsDirectoryPage() {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(mockStudents[0].id);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedStudent =
    mockStudents.find((s) => s.id === selectedStudentId) || mockStudents[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredStudents = mockStudents.filter((s) => {
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.parent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <>
      {toastMsg && (
        <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px] text-light-primary">
              info
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

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Direktori Data Siswa &amp; Wali
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-success text-on-success font-bold shadow-2xs">
              184 Siswa Aktif
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Kelola profil lengkap siswa, kontak wali, riwayat kelas, rekap presensi, dan status tagihan dalam satu database terpadu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showToast("Data siswa berhasil diekspor ke CSV (siswa-arci-2026.csv)")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-light-on-surface-variant">
              download
            </span>
            <span>Ekspor Data</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Total Siswa Aktif
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-1">
              184 Orang
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Tersebar di 26 rombel kelas
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Jenjang SD
            </span>
            <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-1">
              48 Siswa
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Kelas 4, 5, dan 6 (Reguler/Privat)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-on-accent flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px] text-brand-indigo">
              auto_stories
            </span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Jenjang SMP
            </span>
            <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-1">
              72 Siswa
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Kelas 7, 8, dan 9 (Target UN/ASPD)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">menu_book</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Jenjang SMA &amp; UTBK
            </span>
            <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-1">
              64 Siswa
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Kelas 10–12 • Pejuang SNBT
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-primary text-light-on-primary flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
        </div>
      </section>

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
                Pilih siswa untuk preview atau buka profil 360° selengkapnya.
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: "all", label: "Semua" },
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
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Siswa &amp; NISN</th>
                  <th className="py-3 px-4">Rombel Kelas</th>
                  <th className="py-3 px-4">Presensi</th>
                  <th className="py-3 px-4">SPP</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {filteredStudents.map((student) => {
                  const isSelected = student.id === selectedStudent.id;
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
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${student.sppBadge}`}
                        >
                          {student.sppStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/dashboard/students/${student.id}`}
                          className="px-2.5 py-1 rounded bg-light-primary text-light-on-primary text-[11px] font-label font-semibold shadow-2xs hover:bg-brand-indigo-dark inline-block"
                        >
                          Profil
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant text-[13px]">
              Menampilkan {filteredStudents.length} dari {mockStudents.length} siswa
            </span>
          </div>
        </section>

        {/* Right Section: Student 360 Inspector (Col 5) */}
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
                <span className="text-[12px] text-light-on-surface-variant">
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

          <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2.5 text-body-sm">
            <div className="flex items-center justify-between">
              <span className="text-light-on-surface-variant">Sekolah &amp; Kelas</span>
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
                {selectedStudent.phone}
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
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/62${selectedStudent.phone.replace(/[^0-9]/g, "").slice(1)}`}
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
      </div>
    </>
  );
}
