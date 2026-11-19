"use client";

import React, { useState } from "react";
import Link from "next/link";

interface UrgentTask {
  id: string;
  initials: string;
  title: string;
  desc: string;
  statusBadge: string;
  statusColor: string;
  actionType: "whatsapp" | "review" | "remind";
  waUrl?: string;
}

const initialTasks: UrgentTask[] = [
  {
    id: "1",
    initials: "LD",
    title: "Bunda Hesty • Siswa: Raihan (SMP 8)",
    desc: "Meminta info trial Reguler SMP Cabang Sudirman via WhatsApp",
    statusBadge: "Follow-up 10:00",
    statusColor: "bg-warning text-on-warning",
    actionType: "whatsapp",
    waUrl:
      "https://wa.me/6281234567890?text=Halo%20Bunda%20Hesty,%20saya%20Dani%20dari%20ARCI%20Bimbel",
  },
  {
    id: "2",
    initials: "BY",
    title: "Pak Hermawan • Siswa: Nadia (SMA 11)",
    desc: "Konfirmasi transfer cicilan bimbel UTBK Rp1.450.000",
    statusBadge: "Perlu Verifikasi",
    statusColor: "bg-accent text-on-accent",
    actionType: "review",
  },
  {
    id: "3",
    initials: "PR",
    title: "Presensi Sesi Kemarin Belum Lengkap",
    desc: "Kelas Kimia UTBK-A • Tutor: Kak Siti Rahma",
    statusBadge: "Tertunda",
    statusColor: "bg-danger text-on-danger",
    actionType: "remind",
  },
];

export default function DashboardOverviewPage() {
  const [period, setPeriod] = useState("month");
  const [tasks, setTasks] = useState<UrgentTask[]>(initialTasks);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewApproved, setReviewApproved] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleApprovePayment = () => {
    setIsReviewOpen(false);
    setReviewApproved(true);
    setTasks((prev) => prev.filter((t) => t.id !== "2"));
    showNotification("Pembayaran Pak Hermawan Rp1.450.000 berhasil disetujui & kwitansi dikirim via WA!");
  };

  return (
    <>
      {/* Toast */}
      {toastMsg && (
        <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-150">
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

      {/* Title & Filter Quickbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-headline font-bold text-headline-sm text-light-on-surface">
            Ringkasan Operasional Hari Ini
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Kamis, 19 November 2026 • Pantau metrik utama, follow-up, dan jadwal aktif.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-body-sm text-light-on-surface-variant font-medium">
            Periode:
          </span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-light-outline text-body-sm bg-light-surface font-label text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
          >
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini (November 2026)</option>
          </select>
        </div>
      </div>

      {/* KPI Metrics Cards Grid (Responsive 1-col -> 2-col -> 4-col) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Lead Baru */}
        <article className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Lead Baru Hari Ini
            </span>
            <span className="w-8 h-8 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-headline-md text-brand-indigo">
              8 Lead
            </span>
            <p className="text-body-sm text-success flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+3 dari kemarin</span>
            </p>
          </div>
        </article>

        {/* KPI 2: Review Pendaftaran */}
        <article className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Pendaftaran Menunggu
            </span>
            <span className="w-8 h-8 rounded-lg bg-accent text-on-accent flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                pending_actions
              </span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-headline-md text-light-on-surface">
              {reviewApproved ? "2 Berkas" : "3 Berkas"}
            </span>
            <p className="text-body-sm text-warning flex items-center gap-1 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">
                priority_high
              </span>
              <span>Perlu verifikasi admin</span>
            </p>
          </div>
        </article>

        {/* KPI 3: Siswa Aktif & Okupansi */}
        <article className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Siswa Aktif Berjalan
            </span>
            <div className="w-8 h-8 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-headline-md text-light-on-surface">
              184 Siswa
            </span>
            <p className="text-body-sm text-light-on-surface-variant mt-1 font-medium">
              <span>Okupansi kelas 86%</span>
            </p>
          </div>
        </article>

        {/* KPI 4: Tagihan Belum Lunas */}
        <article className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-sm font-label font-medium text-light-on-surface-variant">
              Invoice Jatuh Tempo
            </span>
            <div className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                receipt_long
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-headline font-bold text-title-lg text-danger block">
              {reviewApproved ? "Rp11.000.000" : "Rp12.450.000"}
            </span>
            <p className="text-body-sm text-light-on-surface-variant mt-1 font-medium">
              <span>{reviewApproved ? "8 invoice tertunda" : "9 invoice tertunda"}</span>
            </p>
          </div>
        </article>
      </section>

      {/* Two Columns: Action Queue & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Action Queue: Lead Follow-up & Pending Registrations (Col 7) */}
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
                {tasks.length} Tugas
              </span>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-light-outline-variant hover:bg-light-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center text-label-md font-bold shrink-0">
                      {task.initials}
                    </div>
                    <div>
                      <p className="text-body-md font-semibold text-light-on-surface">
                        {task.title}
                      </p>
                      <p className="text-body-sm text-light-on-surface-variant">
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
                    {task.actionType === "whatsapp" && (
                      <a
                        href={task.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-label font-semibold hover:bg-brand-indigo-dark whitespace-nowrap transition-colors"
                      >
                        Follow-up
                      </a>
                    )}
                    {task.actionType === "review" && (
                      <button
                        type="button"
                        onClick={() => setIsReviewOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-label font-semibold hover:bg-brand-indigo-dark whitespace-nowrap transition-colors"
                      >
                        Tinjau
                      </button>
                    )}
                    {task.actionType === "remind" && (
                      <button
                        type="button"
                        onClick={() =>
                          showNotification(
                            "Pesan pengingat presensi otomatis telah dikirimkan ke Kak Siti Rahma."
                          )
                        }
                        className="px-3 py-1.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-soft text-body-sm font-label font-semibold whitespace-nowrap transition-colors"
                      >
                        Ingatkan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between text-body-sm gap-2">
            <span className="text-light-on-surface-variant font-medium">
              SLA penanganan lead: rata-rata 38 menit
            </span>
            <Link
              href="/dashboard/leads"
              className="text-light-primary hover:underline font-label font-semibold"
            >
              Lihat Semua Tugas Lead →
            </Link>
          </div>
        </section>

        {/* Today's Schedule & Attendance Overview (Col 5) */}
        <section className="lg:col-span-5 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-light-primary text-[22px]">
                  calendar_today
                </span>
                <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                  Jadwal Kelas Hari Ini
                </h2>
              </div>
              <span className="text-body-sm text-light-on-surface font-semibold shrink-0">
                4 Sesi Aktif
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Sesi 1 */}
              <div className="p-3.5 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-start justify-between gap-2">
                <div>
                  <span className="text-label-sm font-label font-semibold text-light-primary">
                    14:00 - 15:30 • Ruang Galileo
                  </span>
                  <p className="text-body-md font-semibold text-light-on-surface mt-0.5">
                    Matematika SD Kelas 6-A
                  </p>
                  <p className="text-body-sm text-light-on-surface-variant font-medium">
                    Tutor: Kak Budi Pratama • 7/8 Siswa Hadir
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-label font-bold bg-success text-on-success shrink-0">
                  Berjalan
                </span>
              </div>

              {/* Sesi 2 */}
              <div className="p-3.5 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-start justify-between gap-2">
                <div>
                  <span className="text-label-sm font-label font-semibold text-light-on-surface-variant">
                    16:00 - 17:30 • Ruang Newton
                  </span>
                  <p className="text-body-md font-semibold text-light-on-surface mt-0.5">
                    IPA Terpadu SMP Kelas 9
                  </p>
                  <p className="text-body-sm text-light-on-surface-variant font-medium">
                    Tutor: Kak Siti Rahma • 8/8 Siswa Terdaftar
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-label bg-light-surface-container text-light-on-surface font-semibold shrink-0">
                  Segera Mulai
                </span>
              </div>

              {/* Sesi 3 */}
              <div className="p-3.5 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-start justify-between gap-2">
                <div>
                  <span className="text-label-sm font-label font-semibold text-light-on-surface-variant">
                    19:00 - 20:30 • Online Zoom #1
                  </span>
                  <p className="text-body-md font-semibold text-light-on-surface mt-0.5">
                    TPS Penalaran Matematika UTBK
                  </p>
                  <p className="text-body-sm text-light-on-surface-variant font-medium">
                    Tutor: Kak Budi Pratama • 15 Siswa Online
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-label bg-light-surface-container text-light-on-surface font-semibold shrink-0">
                  Jadwal Malam
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant font-medium">
              Presensi terisi 95% tepat waktu
            </span>
            <Link
              href="/dashboard/schedule"
              className="text-light-primary hover:underline font-label font-semibold"
            >
              Buka Kalender Lengkap →
            </Link>
          </div>
        </section>
      </div>

      {/* MODAL: TINJAU BUKTI PEMBAYARAN */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-light-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-light-outline-variant flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                Verifikasi Pembayaran Pendaftaran
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-light-surface-container-low border border-light-outline-variant text-body-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Pembayar:</span>{" "}
                <strong className="text-light-on-surface">Pak Hermawan</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Siswa:</span>{" "}
                <span>Nadia (SMA 11)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Nominal:</span>{" "}
                <strong className="text-brand-indigo font-headline">
                  Rp1.450.000
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Metode:</span>{" "}
                <span>Transfer Bank Mandiri</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-label font-medium hover:bg-light-surface-container"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleApprovePayment}
                className="px-5 py-2 rounded-lg bg-success text-on-success hover:bg-success/90 font-label text-body-sm font-semibold shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">
                  check_circle
                </span>
                <span>Setujui &amp; Terbitkan Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
