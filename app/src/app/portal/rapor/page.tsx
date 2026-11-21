"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalStudentProfile, PortalDataResult } from "@/lib/portal-constants";
import { getPortalDataAction } from "@/app/actions/portal";

export default function PortalRaporPage() {
  const [period, setPeriod] = useState("ganjil");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [student, setStudent] = useState<PortalStudentProfile | null>(null);

  useEffect(() => {
    async function load() {
      const res: PortalDataResult = await getPortalDataAction();
      if (res.success && res.students.length > 0) {
        setStudent(res.students[0]);
      }
    }
    load();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const studentName = student?.fullName || "Farhan Pratama";
  const gradeText = student?.grade || "Kelas 8 SMP Reguler";

  return (
    <div className="bg-light-surface-soft min-h-screen text-light-on-surface font-body max-w-xl mx-auto flex flex-col pb-safe">
      {/* Toast */}
      {toastMsg && (
        <div className="m-4 p-3 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-xs">
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

      {/* Top Header */}
      <header className="bg-light-surface border-b border-light-outline-variant px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="w-9 h-9 rounded-xl border border-light-outline-variant flex items-center justify-center text-light-on-surface hover:bg-light-surface-container transition-colors"
            title="Kembali ke Beranda Portal"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline font-bold text-title-md text-brand-indigo leading-tight">
              Rapor Perkembangan
            </h1>
            <p className="text-[11px] text-light-on-surface-variant font-medium">
              {studentName} &bull; {gradeText}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => showToast("Tautan rapor berhasil disalin untuk dibagikan via WhatsApp!")}
          className="w-9 h-9 rounded-xl border border-light-outline-variant flex items-center justify-center text-light-on-surface hover:bg-light-surface-container transition-colors shadow-2xs"
          title="Bagikan Ringkasan Rapor"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
        </button>
      </header>

      {/* Period Filter Bar */}
      <div className="bg-light-surface border-b border-light-outline-variant px-4 py-2.5 flex items-center justify-between text-body-sm">
        <div className="flex items-center gap-1.5 text-[12px] font-label font-bold text-light-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-light-primary">
            history_edu
          </span>
          <span>Periode Evaluasi:</span>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-[12px] font-semibold py-1 px-2.5 rounded-lg border border-light-outline bg-light-surface-soft text-brand-indigo focus:border-light-primary"
        >
          <option value="ganjil">Semester Ganjil 2026/2027</option>
          <option value="nov">Bulan November 2026</option>
          <option value="okt">Bulan Oktober 2026</option>
          <option value="baseline">Tes Diagnostik Awal</option>
        </select>
      </div>

      {/* Main Content */}
      <main className="p-4 flex flex-col gap-4 flex-1">
        {/* Highlights Card */}
        <section className="bg-gradient-to-br from-light-primary-container/40 via-light-surface to-light-surface rounded-2xl border border-light-primary/30 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-bold text-light-primary uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              EVALUASI PERIODE BERJALAN
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success/15 text-success border border-success/30 shadow-2xs">
              Predikat: {student?.evaluation.predicate || "Sangat Baik"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-light-surface-soft rounded-xl border border-light-outline-variant shadow-2xs flex flex-col justify-between">
              <span className="text-[11px] text-light-on-surface-variant font-label font-semibold uppercase">
                Rata-rata Skor Kuis
              </span>
              <div className="text-headline-sm font-headline font-bold text-brand-indigo mt-1">
                {student?.evaluation.scoreStr || "86.4 / 100"}
              </div>
              <span className="text-[11px] text-success font-semibold flex items-center gap-0.5 mt-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {student?.evaluation.trendStr || "+4.2 poin dari bulan lalu"}
              </span>
            </div>

            <div className="p-3 bg-light-surface-soft rounded-xl border border-light-outline-variant shadow-2xs flex flex-col justify-between">
              <span className="text-[11px] text-light-on-surface-variant font-label font-semibold uppercase">
                Tingkat Kehadiran
              </span>
              <div className="text-headline-sm font-headline font-bold text-success mt-1">
                {student?.attendance.rateStr || "100%"}
              </div>
              <span className="text-[11px] text-light-on-surface-variant mt-1 font-mono">
                {student?.attendance.detailStr || "12 / 12 Sesi Hadir"}
              </span>
            </div>
          </div>
        </section>

        {/* Subject Mastery Progress Bars */}
        <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Penguasaan Topik Pelajaran
              </h2>
              <p className="text-[11px] text-light-on-surface-variant">
                Penilaian kumulatif pemahaman konsep &amp; kuis
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {(student?.evaluation.subjectScores || [
              { subject: "Matematika", score: 88 },
              { subject: "IPA Terpadu", score: 85 },
              { subject: "Bahasa Inggris", score: 86 },
            ]).map((sub, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="font-bold text-light-on-surface">{sub.subject}</span>
                  <span className="font-bold text-brand-indigo">{sub.score}%</span>
                </div>
                <div className="w-full bg-light-surface-container rounded-full h-2">
                  <div className="bg-light-primary h-2 rounded-full transition-all duration-300" style={{ width: `${sub.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tutor Notes */}
        <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-sm flex flex-col gap-2">
          <h3 className="font-headline font-bold text-title-md text-light-on-surface">
            Catatan Evaluasi Konselor &amp; Tutor
          </h3>
          <p className="text-body-sm text-light-on-surface-variant leading-relaxed italic bg-light-surface-soft p-3 rounded-xl border border-light-outline-variant">
            {student?.evaluation.noteBody || "Farhan menunjukkan kemajuan pesat dalam pemahaman konsep aljabar dan rumus ruang. Ananda sangat aktif bertanya saat sesi klinik PR. Pertahankan ketelitian dalam menghitung soal cerita bertingkat."}
          </p>
          <div className="flex items-center justify-between text-[11px] text-light-on-surface-variant mt-1">
            <span>Tutor: {student?.evaluation.noteAuthor || "Kak Budi Pratama, S.Si."}</span>
            <span>{student?.evaluation.noteDate || "18 Nov 2026"}</span>
          </div>
        </section>

        {/* Download PDF Button */}
        <button
          type="button"
          onClick={() => showToast("Dokumen Rapor Semester PDF berhasil diunduh!")}
          className="w-full py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors mt-2"
        >
          <span className="material-symbols-outlined text-[20px]">print</span>
          <span>Unduh Rapor PDF Lengkap</span>
        </button>
      </main>
    </div>
  );
}
