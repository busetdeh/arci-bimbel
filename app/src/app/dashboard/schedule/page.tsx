"use client";

import React, { useState } from "react";

interface ScheduleSession {
  id: string;
  day: "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu";
  dayDate: string;
  timeSlot: "14:00 - 15:30" | "16:00 - 17:30" | "19:00 - 20:30";
  slotLabel: string;
  badge: string;
  title: string;
  tutor: string;
  room: string;
  attendanceInfo: string;
  colorScheme: "blue" | "emerald" | "purple" | "amber";
  status: "Aktif" | "Terjadwal" | "Selesai";
}

const mockSessions: ScheduleSession[] = [
  {
    id: "ses-101",
    day: "senin",
    dayDate: "17 Nov",
    timeSlot: "14:00 - 15:30",
    slotLabel: "Sesi 1",
    badge: "SMA 10",
    title: "Matematika Wajib",
    tutor: "Siti Nurhaliza, M.Pd.",
    room: "R. Einstein (Sudirman)",
    attendanceInfo: "12 Siswa Hadir",
    colorScheme: "blue",
    status: "Selesai",
  },
  {
    id: "ses-102",
    day: "selasa",
    dayDate: "18 Nov (Hari Ini)",
    timeSlot: "14:00 - 15:30",
    slotLabel: "Sesi 1",
    badge: "UTBK 12-IPA",
    title: "Fisika: Gelombang & Optik",
    tutor: "Budi Pratama, S.Si.",
    room: "Lab Newton (Sudirman)",
    attendanceInfo: "14 / 15 Kursi",
    colorScheme: "emerald",
    status: "Aktif",
  },
  {
    id: "ses-103",
    day: "rabu",
    dayDate: "19 Nov",
    timeSlot: "14:00 - 15:30",
    slotLabel: "Sesi 1",
    badge: "PRIVAT",
    title: "Kimia Organik (Aiko)",
    tutor: "Dimas Anggara, S.Si.",
    room: "Online Live GMeet",
    attendanceInfo: "Online VIP",
    colorScheme: "purple",
    status: "Terjadwal",
  },
  {
    id: "ses-104",
    day: "kamis",
    dayDate: "20 Nov",
    timeSlot: "14:00 - 15:30",
    slotLabel: "Sesi 1",
    badge: "SMP 9",
    title: "IPA Terpadu",
    tutor: "Siti Rahma, M.Pd.",
    room: "R. Galileo (Sudirman)",
    attendanceInfo: "10 Siswa",
    colorScheme: "blue",
    status: "Terjadwal",
  },
  {
    id: "ses-105",
    day: "sabtu",
    dayDate: "22 Nov",
    timeSlot: "14:00 - 15:30",
    slotLabel: "Sesi 1",
    badge: "TRYOUT #4",
    title: "Simulasi UTBK SNBT",
    tutor: "Budi Pratama, S.Si.",
    room: "Aula Sudirman Utama",
    attendanceInfo: "42 Siswa Terdaftar",
    colorScheme: "amber",
    status: "Terjadwal",
  },
  {
    id: "ses-201",
    day: "senin",
    dayDate: "17 Nov",
    timeSlot: "16:00 - 17:30",
    slotLabel: "Sesi 2",
    badge: "SMP 8",
    title: "Matematika Aljabar",
    tutor: "Budi Pratama, S.Si.",
    room: "R. Galileo (Sudirman)",
    attendanceInfo: "7 Siswa Hadir",
    colorScheme: "emerald",
    status: "Selesai",
  },
  {
    id: "ses-202",
    day: "selasa",
    dayDate: "18 Nov (Hari Ini)",
    timeSlot: "16:00 - 17:30",
    slotLabel: "Sesi 2",
    badge: "SMA 11",
    title: "Bahasa Inggris Lanjutan",
    tutor: "Sarah Priscillia, M.Pd.",
    room: "R. Newton (Sudirman)",
    attendanceInfo: "11 Siswa",
    colorScheme: "blue",
    status: "Aktif",
  },
  {
    id: "ses-301",
    day: "selasa",
    dayDate: "18 Nov (Hari Ini)",
    timeSlot: "19:00 - 20:30",
    slotLabel: "Sesi 3",
    badge: "LIVE ZOOM",
    title: "TPS Penalaran Matematika",
    tutor: "Budi Pratama, S.Si.",
    room: "Zoom Live #1",
    attendanceInfo: "15 Siswa Online",
    colorScheme: "purple",
    status: "Terjadwal",
  },
];

export default function ScheduleCalendarPage() {
  const [sessions, setSessions] = useState<ScheduleSession[]>(mockSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("ses-102");
  const [branchFilter, setBranchFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"week" | "day" | "month">("week");
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[1];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePlotSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSession: ScheduleSession = {
      id: `ses-${Date.now()}`,
      day: (formData.get("day") as ScheduleSession["day"]) || "rabu",
      dayDate: "19 Nov",
      timeSlot: (formData.get("timeSlot") as ScheduleSession["timeSlot"]) || "16:00 - 17:30",
      slotLabel: "Sesi Baru",
      badge: (formData.get("level") as string) || "REGULER",
      title: (formData.get("title") as string) || "Sesi Belajar Terjadwal",
      tutor: (formData.get("tutor") as string) || "Budi Pratama, S.Si.",
      room: (formData.get("room") as string) || "Ruang Newton",
      attendanceInfo: "8 Siswa Terdaftar",
      colorScheme: "blue",
      status: "Terjadwal",
    };
    setSessions((prev) => [...prev, newSession]);
    setIsPlotModalOpen(false);
    setSelectedSessionId(newSession.id);
    showToast("Plot sesi baru berhasil dijadwalkan tanpa konflik ruangan!");
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

      {/* Top Title and Calendar Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-light-surface p-5 rounded-2xl border border-light-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-light-on-surface-variant">
            <span>Operasional Akademik</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-semibold text-light-primary">Jadwal Kalender Sesi</span>
          </div>
          <h1 className="text-headline-sm sm:text-headline-md font-headline font-bold text-light-on-surface mt-1">
            Kalender Jadwal Sesi Kelas
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Pemetaan waktu tutor, ruang kelas offline &amp; link Google Meet tanpa konflik bentrok.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-light-outline text-body-sm bg-light-surface text-light-on-surface font-label"
          >
            <option value="all">Semua Cabang (Sudirman &amp; Online)</option>
            <option value="sudirman">Cabang Sudirman (Offline)</option>
            <option value="online">Kelas Online (Zoom / GMeet)</option>
          </select>

          <div className="inline-flex p-1 bg-light-surface-container rounded-xl shadow-2xs">
            {(["week", "day", "month"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-body-sm font-semibold transition-all ${
                  viewMode === mode
                    ? "bg-light-surface text-light-primary shadow-xs"
                    : "text-light-on-surface-variant hover:text-light-on-surface"
                }`}
              >
                {mode === "week" ? "Mingguan" : mode === "day" ? "Harian" : "Bulanan"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPlotModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors whitespace-nowrap min-h-[40px]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Plot Sesi Baru</span>
          </button>
        </div>
      </div>

      {/* Date Navigator Banner */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-headline font-bold text-title-md text-light-on-surface">
              17 — 22 November 2026
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm bg-success/15 text-success font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              Bebas Bentrok Jadwal
            </span>
          </div>

          <div className="flex items-center gap-4 text-body-sm font-label">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-100 border border-blue-400"></span> UTBK Intensif
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400"></span> Reguler SMP/SMA
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-100 border border-purple-400"></span> Privat 1-on-1
            </span>
          </div>
        </div>

        <div className="bg-light-surface p-4 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <div className="text-label-sm text-light-on-surface-variant font-medium">Total Sesi Minggu Ini</div>
            <div className="text-headline-sm font-bold text-brand-indigo mt-0.5">{sessions.length} Sesi Aktif</div>
          </div>
          <div className="text-right">
            <div className="text-label-sm text-light-on-surface-variant font-medium">Kapasitas Ruang</div>
            <div className="text-title-md font-bold text-success mt-0.5">88% Optimal</div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid with Right Details Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Weekly Calendar Matrix */}
        <div className="xl:col-span-8 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              {/* Header Days */}
              <div className="grid grid-cols-7 border-b border-light-outline-variant bg-light-surface-container text-center text-label-sm font-bold text-light-on-surface">
                <div className="p-3 text-body-sm text-light-on-surface border-r border-light-outline-variant">WAKTU</div>
                {[
                  { day: "Senin", date: "17 Nov" },
                  { day: "Selasa", date: "18 Nov (Hari Ini)" },
                  { day: "Rabu", date: "19 Nov" },
                  { day: "Kamis", date: "20 Nov" },
                  { day: "Jumat", date: "21 Nov" },
                  { day: "Sabtu", date: "22 Nov" },
                ].map((d, i) => (
                  <div
                    key={i}
                    className={`p-3 border-r border-light-outline-variant ${
                      d.day.includes("Selasa") ? "bg-light-primary-container/40 text-light-primary" : ""
                    }`}
                  >
                    <div>{d.day}</div>
                    <div className="text-label-sm font-normal text-light-on-surface-variant">{d.date}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {(["14:00 - 15:30", "16:00 - 17:30", "19:00 - 20:30"] as const).map((slot, slotIdx) => (
                <div key={slot} className="grid grid-cols-7 border-b border-light-outline-variant min-h-[130px]">
                  <div className="p-3 border-r border-light-outline-variant text-body-sm font-semibold text-light-on-surface bg-light-surface-soft flex flex-col justify-start">
                    <span>{slot.split(" - ")[0]}</span>
                    <span className="text-[11px] text-light-on-surface-variant font-normal">
                      {slot.split(" - ")[1]} WIB
                    </span>
                    <span className="mt-3 px-1.5 py-0.5 rounded text-[10px] bg-light-surface border border-light-outline text-light-on-surface text-center font-bold">
                      Sesi {slotIdx + 1}
                    </span>
                  </div>

                  {(["senin", "selasa", "rabu", "kamis", "jumat", "sabtu"] as const).map((d) => {
                    const match = sessions.find((s) => s.day === d && s.timeSlot === slot);
                    return (
                      <div
                        key={d}
                        className={`p-2 border-r border-light-outline-variant flex flex-col gap-1.5 ${
                          d === "selasa" ? "bg-light-primary-container/10" : "bg-light-surface"
                        }`}
                      >
                        {match && (
                          <div
                            onClick={() => setSelectedSessionId(match.id)}
                            className={`p-2 rounded-lg border cursor-pointer text-left transition-all ${
                              match.id === selectedSession.id
                                ? "border-2 border-brand-indigo shadow-md bg-light-primary-container/30"
                                : match.colorScheme === "emerald"
                                ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400"
                                : match.colorScheme === "blue"
                                ? "bg-blue-50 border-blue-200 hover:border-blue-400"
                                : match.colorScheme === "purple"
                                ? "bg-purple-50 border-purple-200 hover:border-purple-400"
                                : "bg-amber-50 border-amber-200 hover:border-amber-400"
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase block text-brand-indigo">
                              {match.badge}
                            </span>
                            <div className="font-semibold text-body-sm text-light-on-surface leading-tight mt-0.5">
                              {match.title}
                            </div>
                            <div className="text-[11px] text-light-on-surface-variant mt-1">
                              {match.tutor} • {match.room.split(" ")[0]}
                            </div>
                            <div className="text-[10px] text-success font-semibold mt-0.5">
                              {match.attendanceInfo}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details Inspector Panel */}
        <div className="xl:col-span-4 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
          <div className="flex items-start justify-between pb-3 border-b border-light-outline-variant">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-light-primary block">
                Detail Sesi Terpilih
              </span>
              <h2 className="font-headline font-bold text-title-lg text-light-on-surface mt-0.5">
                {selectedSession.title}
              </h2>
              <span className="text-[12px] text-light-on-surface-variant font-mono">
                {selectedSession.dayDate} • {selectedSession.timeSlot} WIB
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-success text-on-success">
              {selectedSession.status}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant space-y-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-light-on-surface-variant">Tutor Pengajar:</span>
              <span className="font-semibold text-light-on-surface">{selectedSession.tutor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-on-surface-variant">Lokasi / Ruangan:</span>
              <span className="font-semibold text-light-on-surface">{selectedSession.room}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-on-surface-variant">Kapasitas Siswa:</span>
              <span className="font-bold text-brand-indigo">{selectedSession.attendanceInfo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-on-surface-variant">Status Validasi Ruang:</span>
              <span className="text-success font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Tidak ada konflik
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => showToast(`Link Google Meet / Zoom untuk ${selectedSession.title} telah disalin!`)}
              className="w-full py-2.5 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-semibold text-body-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              <span>Buka Tautan Online Meet</span>
            </button>
            <button
              type="button"
              onClick={() => showToast("Pengingat jadwal otomatis dikirim via WhatsApp ke seluruh siswa kelas.")}
              className="w-full py-2.5 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-semibold text-body-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Kirim Pengingat Sesi ke Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plot Sesi Baru Modal */}
      {isPlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                Plot Sesi Jadwal Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsPlotModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePlotSession} className="flex flex-col gap-3 text-body-sm">
              <div>
                <label className="font-semibold block mb-1">Mata Pelajaran &amp; Topik</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Contoh: Kimia: Reaksi Asam Basa"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Hari</label>
                  <select name="day" className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline bg-light-surface">
                    <option value="senin">Senin</option>
                    <option value="selasa">Selasa</option>
                    <option value="rabu">Rabu</option>
                    <option value="kamis">Kamis</option>
                    <option value="jumat">Jumat</option>
                    <option value="sabtu">Sabtu</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Waktu Sesi</label>
                  <select name="timeSlot" className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline bg-light-surface">
                    <option value="14:00 - 15:30">14:00 - 15:30 WIB</option>
                    <option value="16:00 - 17:30">16:00 - 17:30 WIB</option>
                    <option value="19:00 - 20:30">19:00 - 20:30 WIB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Tutor Pengajar</label>
                  <input
                    name="tutor"
                    type="text"
                    required
                    placeholder="Budi Pratama, S.Si."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Ruang Kelas / Online</label>
                  <input
                    name="room"
                    type="text"
                    required
                    placeholder="Lab Newton / Zoom"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsPlotModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold"
                >
                  Simpan Jadwal Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
