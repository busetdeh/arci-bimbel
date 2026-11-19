"use client";

import React, { useState } from "react";
import Link from "next/link";

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
  const [activeTab, setActiveTab] = useState<"academic" | "attendance" | "billing" | "documents">("academic");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

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

      {/* Navigation Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-semibold transition-colors shadow-2xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Direktori Siswa</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          <span>Edit Data Siswa</span>
        </button>
      </div>

      {/* Top Student Header Card */}
      <div className="bg-light-surface p-5 sm:p-6 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-light-primary text-light-on-primary font-headline font-bold text-headline-sm sm:text-headline-md flex items-center justify-center shadow-xs shrink-0">
            AR
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className="text-headline-sm font-headline font-bold text-light-on-surface">
                Ahmad Rizky Pratama
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-success/15 text-success">
                Siswa Aktif
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800">
                NISN: 0089123456
              </span>
            </div>
            <p className="text-body-sm text-light-on-surface-variant mt-1">
              SMAN 8 Jakarta • Kelas 12 IPA 2 • Target: Kedokteran UI / STEI ITB
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[12px] text-light-on-surface-variant mt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-light-primary">
                  person
                </span>{" "}
                Wali: Hendra Pratama (Ayah)
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">
                  call
                </span>{" "}
                0812-3456-7890
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-light-primary">
                  domain
                </span>{" "}
                Cabang Sudirman Utama
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions & SPP Status */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-light-outline-variant">
          <div className="text-left lg:text-right">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Status Tagihan SPP:
            </span>
            <div className="text-title-md font-bold text-success flex items-center gap-1 lg:justify-end mt-0.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Lunas (Nov 2026)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/6281234567890"
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
          { key: "attendance", label: "Riwayat Presensi (96.2%)", icon: "fact_check" },
          { key: "billing", label: "Tagihan & Invoice SPP", icon: "receipt_long" },
          { key: "documents", label: "Berkas & Dokumen Siswa", icon: "folder_shared" },
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
                  Riwayat Skor Tryout UTBK SNBT
                </h2>
                <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                  Grafik skor rata-rata berdasarkan sistem penilaian IRT Nasional.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-label-sm text-light-on-surface-variant font-medium">
                  Skor Terakhir (TO #4)
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
                      <th className="p-3.5">STATUS KELULUSAN PTN</th>
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
                        <td className="p-3.5 text-success font-semibold text-[12px]">
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
          <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
            Log Presensi Kelas Terakhir
          </h2>
          <div className="divide-y divide-light-outline-variant border border-light-outline-variant rounded-xl overflow-hidden">
            {[
              { date: "18 Nov 2026", subject: "Matematika UTBK", status: "Hadir", tutor: "Kak Budi Pratama" },
              { date: "16 Nov 2026", subject: "Fisika UTBK", status: "Hadir", tutor: "Kak Dimas Arya" },
              { date: "14 Nov 2026", subject: "Kimia UTBK", status: "Izin (Sakit)", tutor: "Kak Siti Rahma" },
              { date: "11 Nov 2026", subject: "TPS Penalaran", status: "Hadir", tutor: "Kak Budi Pratama" },
            ].map((att, i) => (
              <div key={i} className="p-4 flex items-center justify-between text-body-sm hover:bg-light-surface-soft">
                <div>
                  <span className="font-semibold text-light-on-surface block">{att.subject}</span>
                  <span className="text-[12px] text-light-on-surface-variant">{att.date} • Tutor: {att.tutor}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${att.status === "Hadir" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
            Riwayat Tagihan &amp; Pembayaran SPP
          </h2>
          <div className="divide-y divide-light-outline-variant border border-light-outline-variant rounded-xl overflow-hidden">
            {[
              { inv: "INV-2026-1102", month: "November 2026", amount: "Rp1.450.000", status: "Lunas", date: "05 Nov 2026" },
              { inv: "INV-2026-1002", month: "Oktober 2026", amount: "Rp1.450.000", status: "Lunas", date: "04 Okt 2026" },
              { inv: "INV-2026-0902", month: "September 2026", amount: "Rp1.450.000", status: "Lunas", date: "03 Sep 2026" },
            ].map((inv, i) => (
              <div key={i} className="p-4 flex items-center justify-between text-body-sm hover:bg-light-surface-soft">
                <div>
                  <span className="font-semibold text-light-on-surface block">{inv.month} ({inv.inv})</span>
                  <span className="text-[12px] text-light-on-surface-variant">Dibayar: {inv.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-brand-indigo">{inv.amount}</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-success/15 text-success">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
            Arsip Berkas Siswa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Kartu Pelajar SMAN 8.jpg", size: "1.2 MB", date: "15 Jul 2026" },
              { name: "Rapor Semester 1-4.pdf", size: "4.8 MB", date: "15 Jul 2026" },
              { name: "Sertifikat Tryout Nasional #3.pdf", size: "2.1 MB", date: "02 Nov 2026" },
            ].map((doc, i) => (
              <div key={i} className="p-4 rounded-xl border border-light-outline-variant bg-light-surface-soft flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-light-primary">description</span>
                  <div>
                    <span className="font-semibold text-body-sm text-light-on-surface block">{doc.name}</span>
                    <span className="text-[11px] text-light-on-surface-variant">{doc.size} • {doc.date}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Mengunduh berkas ${doc.name}...`)}
                  className="p-1.5 rounded-lg border border-light-outline hover:bg-light-surface text-light-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                Edit Profil Siswa
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditModalOpen(false);
                showToast("Data siswa berhasil diperbarui!");
              }}
              className="flex flex-col gap-3 text-body-sm"
            >
              <div>
                <label className="font-semibold text-light-on-surface block mb-1">Nama Siswa</label>
                <input
                  type="text"
                  defaultValue="Ahmad Rizky Pratama"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-light-on-surface block mb-1">Sekolah</label>
                  <input
                    type="text"
                    defaultValue="SMAN 8 Jakarta"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                  />
                </div>
                <div>
                  <label className="font-semibold text-light-on-surface block mb-1">Target Kampus</label>
                  <input
                    type="text"
                    defaultValue="Kedokteran UI"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold"
                >
                  Simpan Perubahan
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
              <p className="text-light-on-surface-variant">Siswa: Ahmad Rizky Pratama (NISN: 0089123456)</p>
              <p className="text-light-on-surface-variant">Rata-rata Skor Tryout: <strong>712.5</strong> (Kenaikan +42 poin dari TO sebelumnya)</p>
              <p className="text-light-on-surface-variant">Kehadiran Kelas: <strong>96.2%</strong> (24 dari 25 sesi)</p>
              <p className="text-success font-medium">Catatan Konselor: Peluang lolos SNBT Pilihan 1 sangat tinggi dengan pemantapan konsisten.</p>
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
                  showToast("Dokumen Rapor PDF berhasil dicetak!");
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
