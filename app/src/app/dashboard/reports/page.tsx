"use client";

import React, { useState, useEffect } from "react";
import {
  ProgramPerformanceReport,
  FunnelStepData,
  ExecutiveReportStats,
} from "@/lib/reports-constants";
import { getReportsAnalyticsDataAction } from "@/app/actions/reports";

export default function ReportsAnalyticsPage() {
  const [stats, setStats] = useState<ExecutiveReportStats>({
    totalRegistrations: 0,
    conversionRatePercent: 0,
    occupancyPercent: 0,
    totalSeatsFilled: 0,
    totalSeatsCapacity: 0,
    totalRevenue: 0,
    totalRevenueFormatted: "Rp0",
    averageAttendancePercent: 95,
  });

  const [funnelSteps, setFunnelSteps] = useState<FunnelStepData[]>([]);
  const [programReports, setProgramReports] = useState<ProgramPerformanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("m11-2026");
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getReportsAnalyticsDataAction();
      if (res.success) {
        setStats(res.stats);
        setFunnelSteps(res.funnelSteps);
        setProgramReports(res.programReports);
      } else {
        showToast(res.message || "Gagal memuat laporan performa.", "error");
      }
    } catch {
      showToast("Terjadi kendala saat memuat laporan analitik.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Action: Export Full Executive Report to CSV
  const handleExportCSV = () => {
    if (programReports.length === 0) {
      showToast("Belum ada data laporan untuk diekspor.", "error");
      return;
    }

    const headers = [
      "Nama Program",
      "Jenjang",
      "Leads Masuk",
      "Siswa Terdaftar",
      "Rasio Konversi (%)",
      "Omzet Pendapatan",
      "Rombel Aktif",
      "Kepuasan Siswa",
    ];

    const rows = programReports.map((p) => [
      `"${p.programName}"`,
      `"${p.programLevel}"`,
      p.leadsCount,
      p.enrolledCount,
      `"${p.conversionRate}"`,
      `"${p.revenue}"`,
      p.activeClassesCount,
      `"${p.satisfactionRating}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      `"LAPORAN KINERJA EKSEKUTIF ARCI BIMBEL - TAHUN AJARAN 2026/2027"\n` +
      `"Total Omzet Kas Lunas: ${stats.totalRevenueFormatted} | Total Siswa: ${stats.totalRegistrations} | Okupansi: ${stats.occupancyPercent}%"\n\n` +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `laporan-kinerja-eksekutif-bimbel-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Laporan eksekutif berhasil diekspor ke CSV!");
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

      {/* Title & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-light-surface p-5 sm:p-6 rounded-2xl border border-light-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-light-on-surface-variant">
            <span>Manajemen Eksekutif</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-semibold text-light-primary">Laporan &amp; Analitik KPI</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/15 text-success">
              Live Supabase
            </span>
          </div>
          <h1 className="text-headline-sm sm:text-headline-md font-headline font-bold text-light-on-surface mt-1">
            Laporan Kinerja &amp; Analisis Pertumbuhan Bimbel
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Analisis konversi pendaftaran, okupansi kelas, kehadiran siswa, dan realisasi pendapatan kas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-light-outline text-body-sm bg-light-surface text-light-on-surface font-label shadow-2xs"
          >
            <option value="m11-2026">November 2026 (Bulan Berjalan)</option>
            <option value="q4-2026">Kuartal 4 (Okt - Des 2026)</option>
            <option value="ytd">Year to Date 2026</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            title="Refresh Laporan"
            disabled={loading}
            className="p-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container transition-colors shadow-2xs"
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

      {/* Executive KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Total Siswa Terdaftar
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-brand-indigo font-headline">
              {stats.totalRegistrations} Siswa
            </div>
            <div className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              Aktif Belajar di Seluruh Rombel
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Rasio Konversi Funnel
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-light-on-surface font-headline">
              {stats.conversionRatePercent}%
            </div>
            <div className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              Konversi inquiry menjadi siswa
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Tingkat Okupansi Kursi
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">event_seat</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-light-on-surface font-headline">
              {stats.occupancyPercent}%
            </div>
            <div className="text-body-sm text-light-on-surface-variant mt-1 font-medium">
              {stats.totalSeatsFilled} kursi terisi dari {stats.totalSeatsCapacity} kapasitas
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Total Kas Terverifikasi
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-success font-headline">
              {stats.totalRevenueFormatted}
            </div>
            <div className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Pembayaran lunas terverifikasi
            </div>
          </div>
        </div>
      </section>

      {/* Funnel Pipeline Visual Breakdown */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
            Visualisasi Funnel Konversi Calon Siswa (Live Database)
          </h2>
          <span className="text-[12px] text-light-on-surface-variant">
            Pembaruan otomatis dari CRM Leads &amp; Pendaftaran
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {funnelSteps.map((fn, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2"
            >
              <span className="text-[12px] font-semibold text-light-on-surface-variant">{fn.step}</span>
              <span className="font-headline font-bold text-headline-sm text-brand-indigo">
                {fn.count} Calon
              </span>
              <div className="w-full bg-light-surface-container rounded-full h-2">
                <div className={`${fn.color} h-2 rounded-full`} style={{ width: fn.percent }} />
              </div>
              <span className="text-[11px] text-light-on-surface-variant font-medium">
                Konversi: <strong>{fn.percent}</strong>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Program Breakdown Table */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
        <div className="p-5 border-b border-light-outline-variant flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-title-md text-light-on-surface">
              Performa Finansial &amp; Konversi per Program Belajar
            </h2>
            <p className="text-[12px] text-light-on-surface-variant">
              Tingkat konversi leads dan omzet kas terverifikasi per program
            </p>
          </div>
          {loading && (
            <span className="text-[12px] text-brand-indigo flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
              Memperbarui...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Program</th>
                <th className="py-3 px-4">Jenjang</th>
                <th className="py-3 px-4">Leads Masuk</th>
                <th className="py-3 px-4">Siswa Terdaftar</th>
                <th className="py-3 px-4">Tingkat Konversi</th>
                <th className="py-3 px-4">Omzet Kas Terbayar</th>
                <th className="py-3 px-4">Rombel Aktif</th>
                <th className="py-3 px-4">Kepuasan Siswa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-outline-variant">
              {programReports.map((prg) => (
                <tr key={prg.programId} className="hover:bg-light-surface-container transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-indigo">{prg.programName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-light-primary-container text-light-primary">
                      {prg.programLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-light-on-surface">{prg.leadsCount}</td>
                  <td className="py-3.5 px-4 font-bold text-light-on-surface">{prg.enrolledCount}</td>
                  <td className="py-3.5 px-4 font-bold text-success">{prg.conversionRate}</td>
                  <td className="py-3.5 px-4 font-bold text-light-on-surface">{prg.revenue}</td>
                  <td className="py-3.5 px-4 text-light-on-surface-variant font-medium">
                    {prg.activeClassesCount} Rombel
                  </td>
                  <td className="py-3.5 px-4 text-amber-600 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">star</span>
                    <span>{prg.satisfactionRating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
          <span className="text-light-on-surface-variant text-[13px]">
            Menampilkan data analitik real-time dari {programReports.length} program bimbingan belajar aktif
          </span>
        </div>
      </section>
    </>
  );
}
