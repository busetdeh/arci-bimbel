"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  student: string;
  grade: string;
  parent: string;
  phone: string;
  program: string;
  branch: string;
  source: "Website Form" | "WhatsApp Chat" | "Walk-in Cabang" | "Referral";
  sourceIcon: string;
  stage: "baru" | "dihubungi" | "trial" | "siap" | "batal";
  stageLabel: string;
  stageColor: string;
  date: string;
  note: string;
  activities: { time: string; note: string }[];
}

const mockLeads: Lead[] = [
  {
    id: "LD-2026-1189",
    student: "Farhan Pratama (Kls 8)",
    grade: "SMP Kelas 8 (Reguler)",
    parent: "Dra. Nurhayati",
    phone: "0812-3456-7890",
    program: "Reguler SMP",
    branch: "Sudirman (Offline)",
    source: "Website Form",
    sourceIcon: "language",
    stage: "baru",
    stageLabel: "Lead Baru",
    stageColor: "bg-accent text-on-accent",
    date: "18 Nov 2026, 19:42 WIB",
    note: "“Ingin jadwal sore hari. Nilai matematika di sekolah kurang stabil, butuh pemantapan konsep dasar.”",
    activities: [
      {
        time: "19 Nov 2026 • 08:30 WIB • Sistem Web",
        note: "Formulir pendaftaran konsultasi diterima dari website publik.",
      },
      {
        time: "19 Nov 2026 • 09:15 WIB • Ahmad Dani",
        note: "WhatsApp template pengenalan program dan penawaran jadwal trial terkirim.",
      },
    ],
  },
  {
    id: "LD-2026-1185",
    student: "Raihan Syahputra (Kls 9)",
    grade: "SMP Kelas 9 (Reguler)",
    parent: "Bunda Hesty",
    phone: "0813-8899-2211",
    program: "Reguler SMP",
    branch: "Sudirman (Offline)",
    source: "WhatsApp Chat",
    sourceIcon: "chat",
    stage: "dihubungi",
    stageLabel: "Follow-up 10:00",
    stageColor: "bg-warning text-on-warning",
    date: "18 Nov 2026, 17:15 WIB",
    note: "“Meminta perbandingan paket 3 bulan vs 1 tahun dan ketersediaan tutor Kak Budi.”",
    activities: [
      {
        time: "18 Nov 2026 • 17:20 WIB • Ahmad Dani",
        note: "Menjawab pertanyaan harga brosur via chat WhatsApp.",
      },
    ],
  },
  {
    id: "LD-2026-1182",
    student: "Nadia Amanda (Kls 12)",
    grade: "SMA Kelas 12 (UTBK)",
    parent: "Pak Hermawan",
    phone: "0821-1234-5678",
    program: "Intensif UTBK",
    branch: "Online Zoom #1",
    source: "Website Form",
    sourceIcon: "language",
    stage: "siap",
    stageLabel: "Siap Daftar",
    stageColor: "bg-success text-on-success",
    date: "18 Nov 2026, 14:02 WIB",
    note: "“Sudah mantap memilih kelas intensif UTBK dengan target FK UI / Unair.”",
    activities: [
      {
        time: "18 Nov 2026 • 14:30 WIB • Ahmad Dani",
        note: "Mengirimkan rincian invoice cicilan termin 1.",
      },
    ],
  },
  {
    id: "LD-2026-1178",
    student: "Aqila Zahra (Kls 5)",
    grade: "SD Kelas 5 (Reguler)",
    parent: "Ibu Sarah",
    phone: "0856-7788-9900",
    program: "Reguler SD",
    branch: "Sudirman (Offline)",
    source: "Walk-in Cabang",
    sourceIcon: "person",
    stage: "trial",
    stageLabel: "Jadwal Trial",
    stageColor: "bg-light-surface-container text-light-on-surface",
    date: "17 Nov 2026, 11:20 WIB",
    note: "“Ingin mencoba kelas trial Matematika hari Sabtu jam 09.00.”",
    activities: [
      {
        time: "17 Nov 2026 • 11:35 WIB • Front Office",
        note: "Booking kursi ruang trial kelas SD Sabtu pagi.",
      },
    ],
  },
];

export default function LeadsPage() {
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string>(mockLeads[0].id);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [newNote, setNewNote] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
    const matchesSearch =
      lead.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    return matchesStage && matchesSearch;
  });

  const handleUpdateStage = (newStage: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? {
              ...l,
              stage: newStage as Lead["stage"],
              stageLabel:
                newStage === "baru"
                  ? "Lead Baru"
                  : newStage === "dihubungi"
                  ? "Dihubungi"
                  : newStage === "trial"
                  ? "Jadwal Trial"
                  : newStage === "siap"
                  ? "Siap Daftar"
                  : "Batal",
              stageColor:
                newStage === "siap"
                  ? "bg-success text-on-success"
                  : newStage === "baru"
                  ? "bg-accent text-on-accent"
                  : "bg-light-surface-container text-light-on-surface",
            }
          : l
      )
    );
    showNotification(`Status pipeline berhasil diubah menjadi: ${newStage}`);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const newEntry = {
      time: "Hari ini • Baru saja • Ahmad Dani",
      note: newNote,
    };
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? { ...l, activities: [newEntry, ...l.activities] }
          : l
      )
    );
    setNewNote("");
    showNotification("Catatan follow-up berhasil ditambahkan!");
  };

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
          <div className="flex items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm text-light-on-surface">
              Manajemen Lead &amp; Pipeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-light-primary-container text-light-primary font-bold">
              {leads.length} Lead Aktif
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Kelola alur calon siswa dari formulir website, konsultasi, trial, hingga konversi pendaftaran resmi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => showNotification("Data lead berhasil diekspor ke CSV (leads-export-2026.csv)")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-medium hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Pipeline Stages Tab Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-light-outline-variant overflow-x-auto no-scrollbar pb-px">
        {[
          { key: "all", label: "Semua Tahapan", count: leads.length },
          { key: "baru", label: "Lead Baru", count: leads.filter((l) => l.stage === "baru").length },
          { key: "dihubungi", label: "Telah Dihubungi", count: leads.filter((l) => l.stage === "dihubungi").length },
          { key: "trial", label: "Jadwal Trial", count: leads.filter((l) => l.stage === "trial").length },
          { key: "siap", label: "Siap Mendaftar", count: leads.filter((l) => l.stage === "siap").length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStageFilter(tab.key)}
            className={`px-4 py-2.5 border-b-2 font-label text-body-md whitespace-nowrap flex items-center gap-2 transition-all ${
              stageFilter === tab.key
                ? "border-light-primary text-light-primary font-bold"
                : "border-transparent text-light-on-surface-variant hover:text-light-primary"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                stageFilter === tab.key
                  ? "bg-light-primary text-light-on-primary"
                  : "bg-light-surface-container text-light-on-surface"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Split Layout: Table Lead Roster (Left 7 cols) & Detail Inspector (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Lead Table Section (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Calon Siswa &amp; Wali</th>
                  <th className="py-3 px-4">Program Minat</th>
                  <th className="py-3 px-4">Sumber</th>
                  <th className="py-3 px-4">Status Pipeline</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {filteredLeads.map((lead) => {
                  const isSelected = lead.id === selectedLead.id;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-light-primary-container/20 border-l-4 border-light-primary"
                          : "hover:bg-light-surface-container"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-light-on-surface">{lead.student}</p>
                        <p className="text-[12px] text-light-on-surface-variant">
                          Wali: {lead.parent}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-light-on-surface">{lead.program}</span>
                        <span className="text-[11px] text-light-on-surface-variant block">
                          {lead.branch}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-light-on-surface-variant font-label">
                          <span className="material-symbols-outlined text-[14px] text-light-primary">
                            {lead.sourceIcon}
                          </span>
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-label font-bold ${lead.stageColor}`}
                        >
                          {lead.stageLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className={`px-2.5 py-1 rounded text-[11px] font-label font-semibold shadow-2xs ${
                            isSelected
                              ? "bg-light-primary text-light-on-primary"
                              : "border border-light-outline text-light-on-surface hover:bg-light-surface"
                          }`}
                        >
                          {isSelected ? "Pilih" : "Lihat"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant">
              Menampilkan <strong>{filteredLeads.length}</strong> lead
            </span>
          </div>
        </section>

        {/* Lead Detail Inspector Panel (Col 5) */}
        <section className="lg:col-span-5 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between pb-4 border-b border-light-outline-variant gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                  {selectedLead.student}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-label-sm font-label font-bold ${selectedLead.stageColor}`}
                >
                  {selectedLead.stageLabel}
                </span>
              </div>
              <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                ID Lead: #{selectedLead.id} • Masuk: {selectedLead.date}
              </p>
            </div>

            <a
              href={`https://wa.me/62${selectedLead.phone.replace(/[^0-9]/g, "").slice(1)}?text=Halo%20${encodeURIComponent(selectedLead.parent)},%20saya%20Dani%20dari%20ARCI%20Bimbel`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success text-on-success font-label text-body-sm font-semibold shadow-xs hover:bg-success/90 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Hubungi</span>
            </a>
          </div>

          {/* Contact & Lead Metadata Card */}
          <div className="grid grid-cols-2 gap-3 text-body-sm bg-light-surface-soft p-4 rounded-xl border border-light-outline-variant">
            <div>
              <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">
                Orang Tua / Wali
              </span>
              <span className="font-semibold text-light-on-surface">
                {selectedLead.parent}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">
                Nomor WhatsApp
              </span>
              <span className="font-semibold text-light-on-surface font-mono">
                {selectedLead.phone}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">
                Jenjang Minat
              </span>
              <span className="font-semibold text-brand-indigo">
                {selectedLead.grade}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">
                Preferensi Lokasi
              </span>
              <span className="font-semibold text-light-on-surface">
                {selectedLead.branch}
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-light-outline-variant">
              <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">
                Catatan Calon Siswa:
              </span>
              <p className="text-body-sm text-light-on-surface mt-0.5 italic leading-relaxed">
                {selectedLead.note}
              </p>
            </div>
          </div>

          {/* Pipeline Stage Selector Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-light-on-surface font-semibold">
              Ubah Tahapan Pipeline
            </label>
            <select
              value={selectedLead.stage}
              onChange={(e) => handleUpdateStage(e.target.value)}
              className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary font-label transition-colors"
            >
              <option value="baru">1. Lead Baru (Perlu Dihubungi)</option>
              <option value="dihubungi">2. Telah Dihubungi (Menunggu Respon)</option>
              <option value="trial">3. Konsultasi / Trial Terjadwal</option>
              <option value="siap">4. Dikonversi Menjadi Pendaftaran</option>
              <option value="batal">5. Tidak Berminat / Batal</option>
            </select>
          </div>

          {/* Activity History Timeline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-label-md text-light-on-surface font-semibold">
                Riwayat Kontak &amp; Aktivitas
              </span>
              <span className="text-[11px] text-light-on-surface-variant font-label font-medium">
                {selectedLead.activities.length} Catatan
              </span>
            </div>
            <div className="flex flex-col gap-3 border-l-2 border-light-primary pl-4 ml-2">
              {selectedLead.activities.map((act, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] text-light-on-surface-variant font-label">
                    {act.time}
                  </span>
                  <p className="text-body-sm text-light-on-surface font-medium">
                    {act.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Note Form */}
          <div className="flex flex-col gap-2">
            <label className="font-label text-label-sm text-light-on-surface font-semibold">
              Tambah Catatan Follow-up
            </label>
            <textarea
              rows={2}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Tulis rangkuman pembicaraan dengan orang tua..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddNote}
                className="px-4 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs"
              >
                Simpan Catatan
              </button>
            </div>
          </div>

          {/* Conversion Primary Action CTA */}
          <div className="pt-4 border-t border-light-outline-variant flex flex-col gap-2">
            <Link
              href={`/pendaftaran?lead=${selectedLead.id}`}
              className="w-full min-h-[48px] py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm text-center transition-all flex items-center justify-center gap-2 font-bold active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              <span>Konversi ke Pendaftaran Resmi Siswa</span>
            </Link>
            <p className="text-[11px] text-light-on-surface-variant text-center leading-tight">
              Data wali dan anak akan otomatis disalin ke formulir pendaftaran tanpa perlu input ulang.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
