"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalStudentProfile, PortalDataResult } from "@/lib/portal-constants";
import { getPortalDataAction } from "@/app/actions/portal";

export default function PortalJadwalPage() {
  const [viewTab, setViewTab] = useState<"jadwal" | "materi">("jadwal");
  const [selectedDay, setSelectedDay] = useState("19");
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
  const gradeText = student?.grade || "SMP Kelas 8 • Reguler";
  const classText = student?.classCode || "Reguler 8-A";

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

      {/* Top Mobile Bar */}
      <header className="bg-light-surface border-b border-light-outline-variant px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Link
            href="/portal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-light-on-surface hover:bg-light-surface-container transition-colors"
            title="Kembali ke Beranda Portal"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline font-bold text-title-md text-brand-indigo leading-tight">
              Jadwal &amp; Modul Belajar
            </h1>
            <p className="text-[11px] text-light-on-surface-variant font-medium">
              {studentName} &bull; {gradeText.split("•")[0]?.trim()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-light-surface-container border border-light-outline text-[11px] font-label text-light-on-surface font-semibold shadow-2xs">
          <span className="material-symbols-outlined text-[14px] text-light-primary">class</span>
          <span>{classText}</span>
        </div>
      </header>

      {/* Segmented View Tabs */}
      <div className="bg-light-surface border-b border-light-outline-variant px-4 flex gap-4 sticky top-14 z-30 shadow-2xs">
        <button
          type="button"
          onClick={() => setViewTab("jadwal")}
          className={`py-3 border-b-2 font-label text-body-md font-bold flex items-center gap-1.5 transition-colors ${
            viewTab === "jadwal"
              ? "border-light-primary text-light-primary"
              : "border-transparent text-light-on-surface-variant hover:text-light-primary font-medium"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>Jadwal Pekan Ini</span>
        </button>

        <button
          type="button"
          onClick={() => setViewTab("materi")}
          className={`py-3 border-b-2 font-label text-body-md flex items-center gap-1.5 transition-colors ${
            viewTab === "materi"
              ? "border-light-primary text-light-primary font-bold"
              : "border-transparent text-light-on-surface-variant hover:text-light-primary font-medium"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Materi &amp; Tugas ({student?.materials.length || 3})</span>
        </button>
      </div>

      {/* View 1: Jadwal */}
      {viewTab === "jadwal" && (
        <main className="p-4 flex flex-col gap-4 flex-1">
          {/* Day Date Chips */}
          <section className="bg-light-surface p-2.5 rounded-2xl border border-light-outline-variant shadow-2xs">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5">
              {[
                { day: "Sen", date: "16", dot: "bg-success" },
                { day: "Sel", date: "17", dot: "bg-transparent" },
                { day: "Rab", date: "18", dot: "bg-success" },
                { day: "Kam", date: "19", dot: "bg-accent" },
                { day: "Jum", date: "20", dot: "bg-light-primary" },
                { day: "Sab", date: "21", dot: "bg-light-primary" },
              ].map((item) => (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => setSelectedDay(item.date)}
                  className={`flex flex-col items-center p-2 rounded-xl min-w-[50px] text-center transition-all ${
                    selectedDay === item.date
                      ? "bg-light-primary text-light-on-primary shadow-xs"
                      : "border border-light-outline-variant bg-light-surface hover:bg-light-surface-container"
                  }`}
                >
                  <span className="text-[10px] uppercase font-label">{item.day}</span>
                  <span className="font-bold text-title-md">{item.date}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${item.dot}`} />
                </button>
              ))}
            </div>
          </section>

          {/* Featured Class Today */}
          <section className="bg-light-surface rounded-2xl border-2 border-light-primary p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-label bg-accent text-on-accent font-bold shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse"></span>
                Sesi Hari Ini
              </span>
              <span className="text-label-sm text-light-primary font-bold">
                {student?.upcomingClass.timeSlot || "16:00 - 17:30 WIB"}
              </span>
            </div>

            <div>
              <h2 className="font-headline font-bold text-headline-sm text-light-on-surface">
                {student?.upcomingClass.title || "Matematika SMP: Teorema Pythagoras & SPLDV"}
              </h2>
              <p className="text-body-sm text-light-on-surface-variant mt-1">
                Tutor: {student?.upcomingClass.tutor || "Kak Budi Pratama, S.Si."} • {student?.upcomingClass.room || "Ruang Galileo (Sudirman)"}
              </p>
            </div>

            <div className="p-3 bg-light-surface-soft rounded-xl border border-light-outline-variant flex items-center justify-between text-body-sm">
              <span className="text-light-on-surface-variant">Status Presensi:</span>
              <span className="font-bold text-success flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Tercatat Hadir
              </span>
            </div>
          </section>

          {/* Schedule List */}
          <div className="space-y-3">
            {student?.schedules.map((sch) => (
              <div
                key={sch.id}
                className="p-3.5 bg-light-surface rounded-xl border border-light-outline-variant flex flex-col gap-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-light-surface-container text-light-on-surface">
                    {sch.dayLabel}
                  </span>
                  <span className="text-[12px] font-mono font-semibold text-brand-indigo">{sch.timeSlot}</span>
                </div>
                <h3 className="font-bold text-body-sm text-light-on-surface">{sch.title}</h3>
                <p className="text-[12px] text-light-on-surface-variant">Topik: {sch.topic}</p>
                <div className="flex items-center justify-between pt-1 border-t border-light-outline-variant/60 text-[11px] text-light-on-surface-variant">
                  <span>{sch.tutor}</span>
                  <span>{sch.room}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* View 2: Materi & Tugas */}
      {viewTab === "materi" && (
        <main className="p-4 flex flex-col gap-4 flex-1">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-sm space-y-3">
            <h2 className="font-headline font-bold text-title-md text-light-on-surface">
              Modul Pembelajaran Aktif
            </h2>
            {(student?.materials || [
              { title: "Modul 04: Aljabar & Teorema Pythagoras.pdf", fileSize: "3.2 MB", createdAt: "16 Nov 2026" },
              { title: "Drill Soal Persiapan ASPD Matematika.pdf", fileSize: "1.8 MB", createdAt: "14 Nov 2026" },
              { title: "Rangkuman IPA Terpadu Kelas 8.pdf", fileSize: "4.5 MB", createdAt: "10 Nov 2026" },
            ]).map((m, i) => (
              <div key={i} className="p-3 rounded-xl border border-light-outline-variant bg-light-surface-soft flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px] text-light-primary">
                    description
                  </span>
                  <div>
                    <span className="font-semibold text-body-sm text-light-on-surface block">
                      {m.title}
                    </span>
                    <span className="text-[11px] text-light-on-surface-variant">
                      {m.fileSize} • Diunggah {m.createdAt}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Mengunduh ${m.title}...`)}
                  className="p-1.5 rounded-lg border border-light-outline text-light-primary hover:bg-light-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
