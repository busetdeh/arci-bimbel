"use client";

import React, { useState } from "react";

interface ProgramPerformance {
  program: string;
  leads: number;
  enrolled: number;
  conversion: string;
  revenue: string;
  satisfaction: string;
}

const programReports: ProgramPerformance[] = [
  {
    program: "Intensif UTBK-SNBT 2026",
    leads: 142,
    enrolled: 64,
    conversion: "45.1%",
    revenue: "Rp92.800.000",
    satisfaction: "4.9 / 5.0",
  },
  {
    program: "Bimbel Reguler SMP (Kelas 7–9)",
    leads: 110,
    enrolled: 48,
    conversion: "43.6%",
    revenue: "Rp33.600.000",
    satisfaction: "4.8 / 5.0",
  },
  {
    program: "Bimbel Reguler SMA (Kelas 10–12)",
    leads: 62,
    enrolled: 24,
    conversion: "38.7%",
    revenue: "Rp22.800.000",
    satisfaction: "4.8 / 5.0",
  },
  {
    program: "Bimbel Reguler SD (Kelas 4–6)",
    leads: 40,
    enrolled: 12,
    conversion: "30.0%",
    revenue: "Rp9.300.000",
    satisfaction: "4.9 / 5.0",
  },
];

export default function ReportsAnalyticsPage() {
  const [period, setPeriod] = useState("m11-2026");
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

      {/* Title & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-light-on-surface-variant">
            <span>Manajemen Eksekutif</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-semibold text-light-primary">Laporan &amp; Analitik KPI</span>
          </div>
          <h1 className="text-headline-sm sm:text-headline-md font-headline font-bold text-light-on-surface mt-1">
            Laporan Kinerja &amp; Analisis Pertumbuhan Bimbel
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Analisis konversi pendaftaran, okupansi kelas, kehadiran siswa, dan proyeksi arus kas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-light-outline text-body-sm bg-light-surface text-light-on-surface font-label"
          >
            <option value="m11-2026">November 2026 (Bulan Berjalan)</option>
            <option value="q4-2026">Kuartal 4 (Okt - Des 2026)</option>
            <option value="ytd">Year to Date 2026</option>
          </select>

          <button
            type="button"
            onClick={() => showToast("Laporan eksekutif berhasil diekspor ke XLSX / CSV!")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Ekspor XLSX / CSV</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Total Pendaftaran Diterima
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-brand-indigo font-headline">148 Siswa</div>
            <div className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              +18.4% vs bulan lalu
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Rasio Konversi Lead (Funnel)
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-light-on-surface font-headline">41.8%</div>
            <div className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              148 siswa dari 354 inquiry
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Tingkat Okupansi Kelas
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">event_seat</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-light-on-surface font-headline">88.5%</div>
            <div className="text-body-sm text-light-on-surface-variant mt-1">
              177 kursi terisi dari 200 kapasitas
            </div>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-light-on-surface-variant font-medium">
              Realisasi Pendapatan SPP
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-headline-md font-bold text-success font-headline">
              Rp148.500.000
            </div>
            <div className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              106% dari target bulanan
            </div>
          </div>
        </div>
      </section>

      {/* Funnel Pipeline Visual Breakdown */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
          Visualisasi Funnel Konversi Calon Siswa (November 2026)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: "1. Website Inquiries", count: 354, percent: "100%", color: "bg-blue-500" },
            { step: "2. Konsultasi / WA Chat", count: 248, percent: "70.1%", color: "bg-indigo-500" },
            { step: "3. Mengikuti Free Trial", count: 182, percent: "51.4%", color: "bg-purple-500" },
            { step: "4. Mendaftar & Lunas", count: 148, percent: "41.8%", color: "bg-emerald-500" },
          ].map((fn, i) => (
            <div key={i} className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-light-on-surface-variant">{fn.step}</span>
              <span className="font-headline font-bold text-headline-sm text-brand-indigo">{fn.count} Calon</span>
              <div className="w-full bg-light-surface-container rounded-full h-2">
                <div className={`${fn.color} h-2 rounded-full`} style={{ width: fn.percent }} />
              </div>
              <span className="text-[11px] text-light-on-surface-variant font-medium">Konversi: {fn.percent}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Program Breakdown Table */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs overflow-hidden">
        <div className="p-5 border-b border-light-outline-variant">
          <h2 className="font-headline font-bold text-title-md text-light-on-surface">
            Performa Finansial &amp; Konversi per Program Belajar
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Program</th>
                <th className="py-3 px-4">Leads Masuk</th>
                <th className="py-3 px-4">Siswa Terdaftar</th>
                <th className="py-3 px-4">Tingkat Konversi</th>
                <th className="py-3 px-4">Omzet Pendapatan</th>
                <th className="py-3 px-4">Kepuasan Siswa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-outline-variant">
              {programReports.map((prg, i) => (
                <tr key={i} className="hover:bg-light-surface-container transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-indigo">{prg.program}</td>
                  <td className="py-3.5 px-4">{prg.leads}</td>
                  <td className="py-3.5 px-4 font-semibold text-light-on-surface">{prg.enrolled}</td>
                  <td className="py-3.5 px-4 font-semibold text-success">{prg.conversion}</td>
                  <td className="py-3.5 px-4 font-bold text-light-on-surface">{prg.revenue}</td>
                  <td className="py-3.5 px-4 text-warning font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">star</span>
                    {prg.satisfaction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
