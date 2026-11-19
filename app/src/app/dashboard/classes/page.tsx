"use client";

import React, { useState } from "react";

interface Classroom {
  id: string;
  name: string;
  code: string;
  grade: "sd" | "smp" | "sma";
  gradeLabel: string;
  gradeBadge: string;
  branch: string;
  room: string;
  tutor: string;
  assistant?: string;
  subject: string;
  scheduleDays: string;
  scheduleTime: string;
  enrolled: number;
  capacity: number;
  status: "Berjalan" | "Segera Mulai" | "Penuh";
  statusBadge: string;
  syllabusTopic: string;
}

const initialClasses: Classroom[] = [
  {
    id: "1",
    name: "SMP-8 Reguler Sudirman A",
    code: "KLS-2026-SMP8A",
    grade: "smp",
    gradeLabel: "SMP Kelas 8",
    gradeBadge: "bg-light-primary-container text-light-primary",
    branch: "Sudirman",
    room: "Ruang Galileo",
    tutor: "Budi Pratama, S.Si.",
    assistant: "Kak Aris",
    subject: "Matematika",
    scheduleDays: "Sen, Rab, Jum",
    scheduleTime: "16:00 - 17:30 WIB",
    enrolled: 7,
    capacity: 8,
    status: "Berjalan",
    statusBadge: "bg-success text-on-success",
    syllabusTopic: "Matematika Aljabar & Teorema Pythagoras",
  },
  {
    id: "2",
    name: "SMP-9 Target UN/ASPD",
    code: "KLS-2026-SMP9B",
    grade: "smp",
    gradeLabel: "SMP Kelas 9",
    gradeBadge: "bg-light-primary-container text-light-primary",
    branch: "Sudirman",
    room: "Ruang Newton",
    tutor: "Siti Rahma, M.Pd.",
    subject: "IPA Terpadu",
    scheduleDays: "Sel, Kam, Sab",
    scheduleTime: "14:00 - 15:30 WIB",
    enrolled: 8,
    capacity: 8,
    status: "Penuh",
    statusBadge: "bg-brand-indigo text-light-on-primary",
    syllabusTopic: "Fisika Listrik Dinamis & Biologi Genetika",
  },
  {
    id: "3",
    name: "UTBK-TPS Penalaran Skolastik",
    code: "KLS-2026-UTBK01",
    grade: "sma",
    gradeLabel: "SMA / UTBK",
    gradeBadge: "bg-accent text-on-accent",
    branch: "Online Live Zoom #1",
    room: "Zoom Live #1",
    tutor: "Budi Pratama, S.Si.",
    subject: "TPS & Penalaran Kuantitatif",
    scheduleDays: "Sen, Rab, Jum",
    scheduleTime: "19:00 - 20:30 WIB",
    enrolled: 15,
    capacity: 15,
    status: "Penuh",
    statusBadge: "bg-brand-indigo text-light-on-primary",
    syllabusTopic: "Penalaran Induktif & Deduktif Lanjutan IRT",
  },
  {
    id: "4",
    name: "SD-6 Persiapan Ujian Sekolah",
    code: "KLS-2026-SD6A",
    grade: "sd",
    gradeLabel: "SD Kelas 6",
    gradeBadge: "bg-success/15 text-success",
    branch: "Sudirman",
    room: "Ruang Archimedes",
    tutor: "Kak Amanda Putri, S.Pd.",
    subject: "Matematika & IPA SD",
    scheduleDays: "Sel, Kam",
    scheduleTime: "15:00 - 16:30 WIB",
    enrolled: 6,
    capacity: 8,
    status: "Berjalan",
    statusBadge: "bg-success text-on-success",
    syllabusTopic: "Operasi Pecahan & Bangun Ruang Campuran",
  },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classroom[]>(initialClasses);
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesGrade = gradeFilter === "all" || cls.grade === gradeFilter;
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleCreateClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCls: Classroom = {
      id: String(Date.now()),
      name: (formData.get("name") as string) || "Kelas Baru 2026",
      code: `KLS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      grade: (formData.get("grade") as Classroom["grade"]) || "smp",
      gradeLabel: "SMP Kelas 8",
      gradeBadge: "bg-light-primary-container text-light-primary",
      branch: (formData.get("branch") as string) || "Sudirman",
      room: (formData.get("room") as string) || "Ruang Pythagoras",
      tutor: (formData.get("tutor") as string) || "Budi Pratama, S.Si.",
      subject: (formData.get("subject") as string) || "Matematika",
      scheduleDays: "Sen, Rab",
      scheduleTime: "16:00 - 17:30 WIB",
      enrolled: 1,
      capacity: 8,
      status: "Segera Mulai",
      statusBadge: "bg-warning text-on-warning",
      syllabusTopic: "Pengenalan Materi Awal",
    };
    setClasses((prev) => [newCls, ...prev]);
    setIsNewClassModalOpen(false);
    showToast(`Rombel kelas baru ${newCls.name} berhasil dibuat!`);
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

      {/* Title & Academic Status Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm text-light-on-surface">
              Manajemen Program, Kelas &amp; Jadwal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-success text-on-success font-bold">
              Tahun Ajaran 2026/2027
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5 leading-relaxed">
            Pantau kapasitas okupansi rombel (maks 8 siswa tatap muka), penetapan tutor pengampu, serta deteksi konflik ruang &amp; jadwal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsNewClassModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Buka Kelas Baru</span>
          </button>
        </div>
      </div>

      {/* Academic KPI Snapshot Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">
              Total Kelas Aktif
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-0.5">
              {classes.length} Rombel
            </p>
            <p className="text-[11.5px] text-light-on-surface-variant mt-0.5">
              Tatap Muka &amp; Live Zoom
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">meeting_room</span>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">
              Rata-rata Okupansi Kelas
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-0.5">
              88% Terisi
            </p>
            <p className="text-[11.5px] text-light-on-surface-variant mt-0.5">
              Maksimal 8 siswa per kelas offline
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success text-on-success flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">person_check</span>
          </div>
        </div>

        <div className="bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow">
          <div>
            <span className="text-[12px] font-label font-medium text-light-on-surface-variant">
              Status Jadwal &amp; Ruang
            </span>
            <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-0.5">
              0 Konflik Jadwal
            </p>
            <p className="text-[11.5px] text-success font-semibold mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Seluruh ruang dan tutor teralokasi valid</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-surface-container text-light-on-surface flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Grade Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-outline-variant pb-px gap-3">
        <div className="flex items-center gap-2">
          {["all", "sd", "smp", "sma"].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setGradeFilter(lvl)}
              className={`px-3.5 py-2 rounded-lg text-body-sm font-label font-semibold transition-colors ${
                gradeFilter === lvl
                  ? "bg-light-primary text-light-on-primary shadow-xs"
                  : "border border-light-outline text-light-on-surface hover:bg-light-surface-container"
              }`}
            >
              {lvl === "all"
                ? "Semua Jenjang"
                : lvl === "sd"
                ? "SD (Kelas 4–6)"
                : lvl === "smp"
                ? "SMP (Kelas 7–9)"
                : "SMA / UTBK"}
            </button>
          ))}
        </div>
      </div>

      {/* Class Roster & Management Table */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Kelas &amp; Kode</th>
                <th className="py-3 px-4">Jenjang &amp; Cabang</th>
                <th className="py-3 px-4">Tutor Pengampu</th>
                <th className="py-3 px-4">Jadwal Sesi</th>
                <th className="py-3 px-4">Kapasitas Siswa</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-outline-variant font-body">
              {filteredClasses.map((cls) => {
                const occupancyPercent = Math.round((cls.enrolled / cls.capacity) * 100);
                return (
                  <tr key={cls.id} className="hover:bg-light-surface-container transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-light-on-surface">{cls.name}</p>
                      <p className="text-[11px] text-light-on-surface-variant font-mono">{cls.code}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-label font-semibold ${cls.gradeBadge}`}>
                        {cls.gradeLabel}
                      </span>
                      <span className="text-[11px] text-light-on-surface-variant block mt-0.5">
                        {cls.branch} • {cls.room}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-light-on-surface">{cls.tutor}</p>
                      <p className="text-[11px] text-light-on-surface-variant">{cls.subject}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-light-on-surface">{cls.scheduleDays}</p>
                      <p className="text-[11px] text-light-on-surface-variant">{cls.scheduleTime}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-light-on-surface text-[12px]">
                          {cls.enrolled} / {cls.capacity}
                        </span>
                        <div className="w-16 bg-light-surface-container rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${occupancyPercent >= 100 ? "bg-brand-indigo" : "bg-success"}`}
                            style={{ width: `${occupancyPercent}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[11px] text-light-on-surface-variant">
                        {cls.capacity - cls.enrolled > 0
                          ? `Sisa ${cls.capacity - cls.enrolled} Kursi`
                          : "Penuh"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${cls.statusBadge}`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedClass(cls)}
                        className="px-3 py-1.5 rounded-lg border border-light-outline text-light-on-surface text-[12px] font-label font-medium hover:bg-light-surface-soft whitespace-nowrap transition-colors shadow-2xs"
                      >
                        Detail Kelas
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  {selectedClass.name}
                </h3>
                <span className="text-[12px] text-light-on-surface-variant font-mono">
                  {selectedClass.code} • {selectedClass.room}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-light-surface-soft rounded-xl border border-light-outline-variant text-body-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Tutor Pengampu:</span>
                <span className="font-semibold text-light-on-surface">{selectedClass.tutor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Jadwal Sesi:</span>
                <span className="font-semibold text-light-on-surface">
                  {selectedClass.scheduleDays} ({selectedClass.scheduleTime})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Topik Pembahasan Terkini:</span>
                <span className="font-medium text-brand-indigo">{selectedClass.syllabusTopic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface-variant">Jumlah Siswa Terdaftar:</span>
                <span className="font-bold text-success">
                  {selectedClass.enrolled} dari {selectedClass.capacity} Kursi
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedClass(null);
                  showToast("Daftar presensi kelas berhasil diunduh!");
                }}
                className="px-4 py-2 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-semibold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                <span>Unduh Presensi Rombel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Class Modal */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                Buka Rombel Kelas Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsNewClassModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="flex flex-col gap-3 text-body-sm">
              <div>
                <label className="font-semibold block mb-1">Nama Kelas / Rombel</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: SMP-8 Reguler Sudirman B"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Jenjang</label>
                  <select name="grade" className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline bg-light-surface">
                    <option value="sd">SD (Kelas 4–6)</option>
                    <option value="smp">SMP (Kelas 7–9)</option>
                    <option value="sma">SMA / UTBK</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mata Pelajaran</label>
                  <input
                    name="subject"
                    type="text"
                    required
                    placeholder="Matematika / IPA"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Cabang / Ruangan</label>
                  <input
                    name="room"
                    type="text"
                    required
                    placeholder="Ruang Galileo / Zoom"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tutor Pengampu</label>
                  <input
                    name="tutor"
                    type="text"
                    required
                    placeholder="Budi Pratama, S.Si."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold"
                >
                  Buat Rombel Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
