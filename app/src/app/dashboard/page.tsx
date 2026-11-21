"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DashboardOverviewStats,
  UrgentTaskItem,
  DashboardClassSessionItem,
  formatRupiahShort,
} from "@/lib/overview-constants";
import { getDashboardOverviewAction } from "@/app/actions/overview";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<DashboardOverviewStats>({
    newLeadsCount: 0,
    totalLeadsCount: 0,
    pendingAdmissionsCount: 0,
    activeStudentsCount: 0,
    totalClassesCount: 0,
    occupancyPercent: 0,
    pendingFinanceCount: 0,
    pendingFinanceAmount: 0,
    overdueInvoicesCount: 0,
    overdueInvoicesAmount: 0,
    totalRevenue: 0,
  });

  const [urgentTasks, setUrgentTasks] = useState<UrgentTaskItem[]>([]);
  const [classSessions, setClassSessions] = useState<DashboardClassSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDateString, setCurrentDateString] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getDashboardOverviewAction();
      if (res.success) {
        setStats(res.stats);
        setUrgentTasks(res.urgentTasks);
        setClassSessions(res.classSessions);
      } else {
        showNotification(res.message || "Gagal memuat ringkasan data operasional.");
      }
    } catch {
      showNotification("Terjadi kendala jaringan saat memuat ringkasan dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Format current date on client side to avoid SSR hydration mismatches
    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDateString(formattedDate);
  }, []);

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-success">
              check_circle
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg}</span>
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

      {/* Header Bar & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Ringkasan Operasional Hari Ini
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-light-primary-container text-light-primary font-bold shadow-2xs">
              Live Supabase
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            {currentDateString ? `${currentDateString} • ` : ""}Command Center pantauan penerimaan siswa, kas masuk, dan rombel aktif.
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-semibold transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[17px] text-warning">person_search</span>
            <span>Lead Baru</span>
          </Link>

          <Link
            href="/dashboard/admissions"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-semibold transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[17px] text-light-primary">how_to_reg</span>
            <span>Review Pendaftaran</span>
          </Link>

          <Link
            href="/dashboard/finance"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[17px]">payments</span>
            <span>Verifikasi Tagihan</span>
          </Link>

          <button
            type="button"
            onClick={loadData}
            title="Refresh Ringkasan"
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

      {/* KPI Metrics Cards Grid (Live from Supabase) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Lead Baru */}
        <Link
          href="/dashboard/leads"
          className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-md hover:border-light-primary transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Lead Baru Belum Kontak
            </span>
            <span className="w-9 h-9 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-headline-md text-brand-indigo">
              {stats.newLeadsCount} Lead
            </span>
            <p className="text-body-sm text-light-on-surface-variant flex items-center gap-1 mt-1 font-medium">
              <span>{stats.totalLeadsCount} total lead di database</span>
            </p>
          </div>
        </Link>

        {/* KPI 2: Review Pendaftaran Masuk */}
        <Link
          href="/dashboard/admissions"
          className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-md hover:border-warning transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Pendaftaran Menunggu
            </span>
            <span className="w-9 h-9 rounded-xl bg-accent text-on-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-headline-md text-light-on-surface">
              {stats.pendingAdmissionsCount} Siswa
            </span>
            <p className="text-body-sm text-warning flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              <span>Perlu verifikasi &amp; plot rombel</span>
            </p>
          </div>
        </Link>

        {/* KPI 3: Siswa Aktif & Okupansi Rombel */}
        <Link
          href="/dashboard/students"
          className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-md hover:border-success transition-all group"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Siswa Aktif Berjalan
            </span>
            <div className="w-9 h-9 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-headline-md text-success">
              {stats.activeStudentsCount} Siswa
            </span>
            <p className="text-body-sm text-light-on-surface-variant mt-1 font-medium">
              <span>Okupansi kursi: <strong>{stats.occupancyPercent}%</strong> ({stats.totalClassesCount} Rombel)</span>
            </p>
          </div>
        </Link>

        {/* KPI 4: Tagihan Perlu Verifikasi / Tunggakan */}
        <Link
          href="/dashboard/finance"
          className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-md hover:border-danger transition-all group"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Tagihan &amp; Kas Masuk
            </span>
            <div className="w-9 h-9 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-headline-sm text-brand-indigo block">
              {stats.pendingFinanceCount > 0
                ? `${stats.pendingFinanceCount} Bukti Masuk`
                : "Semua Terverifikasi"}
            </span>
            <p className="text-body-sm text-light-on-surface-variant mt-1 font-medium">
              {stats.pendingFinanceCount > 0 ? (
                <span className="text-brand-indigo font-semibold">
                  Nominal: {formatRupiahShort(stats.pendingFinanceAmount)}
                </span>
              ) : (
                <span className="text-success font-semibold">Kas Lunas: {formatRupiahShort(stats.totalRevenue)}</span>
              )}
            </p>
          </div>
        </Link>
      </section>

      {/* Two Columns: Action Queue (Col 7) & Live Classes (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Action Queue (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-light-primary text-[22px]">
                  assignment_late
                </span>
                <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                  Tindakan Mendesak Hari Ini
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label font-bold bg-accent text-on-accent shrink-0">
                {urgentTasks.length} Tindakan
              </span>
            </div>

            {/* Task List */}
            {urgentTasks.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-light-outline-variant text-center text-light-on-surface-variant bg-light-surface-soft">
                <span className="material-symbols-outlined text-[36px] text-success block mb-1">
                  task_alt
                </span>
                <p className="font-bold text-body-md text-light-on-surface">
                  Semua Antrean Bersih!
                </p>
                <p className="text-[12px] text-light-on-surface-variant mt-0.5">
                  Tidak ada pendaftaran pending, bukti transfer belum diverifikasi, atau lead baru yang terlewat.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-light-outline-variant hover:bg-light-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center text-label-md font-bold shrink-0 shadow-2xs">
                        {task.initials}
                      </div>
                      <div>
                        <p className="text-body-md font-semibold text-light-on-surface">
                          {task.title}
                        </p>
                        <p className="text-body-sm text-light-on-surface-variant line-clamp-1">
                          {task.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-label font-semibold ${task.statusColor}`}
                      >
                        {task.statusBadge}
                      </span>

                      {task.actionType === "whatsapp" ? (
                        <a
                          href={task.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-label font-semibold hover:bg-brand-indigo-dark whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[15px]">chat</span>
                          <span>{task.actionLabel}</span>
                        </a>
                      ) : (
                        <Link
                          href={task.actionUrl}
                          className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-label font-semibold hover:bg-brand-indigo-dark whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span>{task.actionLabel}</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-5 border-t border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between text-body-sm gap-2">
            <span className="text-light-on-surface-variant font-medium text-[13px]">
              Tugas diupdate otomatis dari database pendaftaran &amp; keuangan
            </span>
            <Link
              href="/dashboard/leads"
              className="text-light-primary hover:underline font-label font-semibold text-[13px] flex items-center gap-1"
            >
              <span>Kelola Pipeline Lead</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </Link>
          </div>
        </section>

        {/* Right Column: Today's Class Sessions (Col 5) */}
        <section className="lg:col-span-5 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-light-primary text-[22px]">
                  calendar_month
                </span>
                <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                  Rombel &amp; Sesi Aktif
                </h2>
              </div>
              <span className="text-body-sm text-light-on-surface font-semibold shrink-0">
                {classSessions.length} Rombel
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {classSessions.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-light-outline-variant text-center text-light-on-surface-variant text-body-sm">
                  Belum ada rombel kelas yang terdaftar.
                </div>
              ) : (
                classSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-start justify-between gap-2.5 hover:bg-light-surface-container transition-colors"
                  >
                    <div>
                      <span className="text-label-sm font-label font-semibold text-light-primary block">
                        {session.scheduleTime} • {session.room}
                      </span>
                      <p className="text-body-md font-bold text-light-on-surface mt-0.5">
                        {session.name}
                      </p>
                      <p className="text-[12px] text-light-on-surface-variant font-medium mt-0.5">
                        Tutor: {session.tutorName} • <strong className="text-slate-800">{session.enrolled}/{session.capacity} Siswa</strong>
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-label font-bold shrink-0 ${session.statusBadge}`}
                    >
                      {session.statusLabel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant font-medium text-[13px]">
              Kapasitas kelas terpantau
            </span>
            <Link
              href="/dashboard/classes"
              className="text-light-primary hover:underline font-label font-semibold text-[13px] flex items-center gap-1"
            >
              <span>Buka Manajemen Kelas</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
