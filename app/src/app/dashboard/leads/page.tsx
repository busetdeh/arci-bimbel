"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  getLeadsDataAction,
  updateLeadStageAction,
  addLeadActivityNoteAction,
  LeadItem,
} from "@/app/actions/leads";

export default function LeadsPage() {
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    baru: 0,
    dihubungi: 0,
    trial: 0,
    siap: 0,
    batal: 0,
  });
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const res = await getLeadsDataAction();
      if (res.success && res.leads) {
        setLeads(res.leads);
        setStats(res.stats);
        if (res.leads.length > 0 && !selectedLeadId) {
          setSelectedLeadId(res.leads[0].id);
        }
      } else {
        showToast(res.message || "Gagal memuat data leads.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Terjadi kesalahan saat memuat leads.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      lead.studentName.toLowerCase().includes(q) ||
      lead.parentName.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.leadNumber.toLowerCase().includes(q) ||
      lead.gradeLevel.toLowerCase().includes(q);
    return matchesStage && matchesSearch;
  });

  const handleUpdateStage = async (newStage: LeadItem["stage"]) => {
    if (!selectedLead) return;

    // Optimistic UI update
    const previousLeads = [...leads];
    const previousStats = { ...stats };

    const stageConfig: Record<string, { label: string; color: string }> = {
      baru: { label: "Lead Baru", color: "bg-accent text-on-accent" },
      dihubungi: { label: "Telah Dihubungi", color: "bg-warning text-on-warning" },
      trial: { label: "Jadwal Trial", color: "bg-blue-100 text-blue-900 border border-blue-200" },
      siap: { label: "Siap Mendaftar", color: "bg-success text-on-success" },
      batal: { label: "Batal / Ditunda", color: "bg-danger/10 text-danger border border-danger/20" },
    };

    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? {
              ...l,
              stage: newStage,
              stageLabel: stageConfig[newStage]?.label || newStage,
              stageColor: stageConfig[newStage]?.color || "bg-light-surface-container text-light-on-surface",
            }
          : l
      )
    );

    // Update stats count
    setStats((prev) => {
      const oldStage = selectedLead.stage;
      return {
        ...prev,
        [oldStage]: Math.max(0, (prev[oldStage as keyof typeof prev] || 1) - 1),
        [newStage]: (prev[newStage as keyof typeof prev] || 0) + 1,
      };
    });

    startTransition(async () => {
      const res = await updateLeadStageAction(selectedLead.id, newStage);
      if (!res.success) {
        setLeads(previousLeads);
        setStats(previousStats);
        showToast(res.message || "Gagal mengubah status pipeline", "error");
      } else {
        showToast(`Tahapan pipeline diperbarui: ${stageConfig[newStage]?.label || newStage}`, "success");
      }
    });
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    const noteText = newNote.trim();
    setNewNote("");

    const nowFormatted = new Date().toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Optimistic activity append
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? {
              ...l,
              activities: [
                {
                  time: `${nowFormatted} • Staf Internal`,
                  note: noteText,
                },
                ...l.activities,
              ],
            }
          : l
      )
    );

    startTransition(async () => {
      const res = await addLeadActivityNoteAction(selectedLead.id, noteText);
      if (!res.success) {
        showToast(res.message || "Gagal menyimpan catatan.", "error");
      } else {
        showToast("Catatan follow-up berhasil disimpan!", "success");
      }
    });
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      showToast("Tidak ada data lead untuk diekspor.", "info");
      return;
    }

    const headers = ["No Lead", "Nama Siswa", "Jenjang", "Wali Murid", "WhatsApp", "Lokasi/Cabang", "Sumber", "Status", "Waktu Masuk", "Catatan"];
    const rows = filteredLeads.map((l) => [
      `"${l.leadNumber}"`,
      `"${l.studentName.replace(/"/g, '""')}"`,
      `"${l.gradeLevel}"`,
      `"${l.parentName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.branchName}"`,
      `"${l.source}"`,
      `"${l.stageLabel}"`,
      `"${l.formattedDate} ${l.formattedTime}"`,
      `"${(l.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads-pipeline-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Data leads berhasil diekspor ke file CSV!", "success");
  };

  // WhatsApp click handler
  const getWhatsAppLink = (lead: LeadItem) => {
    let cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("62")) {
      cleanPhone = "62" + cleanPhone;
    }
    const message = encodeURIComponent(
      `Halo Bapak/Ibu ${lead.parentName}, salam kenal dari ARCI Bimbel. Kami menerima formulir konsultasi/minat belajar untuk ananda ${lead.studentName} (${lead.gradeLevel}). Apakah ada waktu luang untuk berdiskusi mengenai jadwal belajar terbaik?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <>
      {toastMsg && (
        <div
          className={`p-3.5 rounded-xl border text-body-sm flex items-center justify-between gap-3 shadow-xs transition-all ${
            toastMsg.type === "error"
              ? "bg-red-50 border-red-200 text-danger"
              : toastMsg.type === "success"
              ? "bg-green-50 border-green-200 text-success"
              : "border-light-outline-variant bg-light-surface text-light-on-surface"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">
              {toastMsg.type === "error" ? "error" : toastMsg.type === "success" ? "check_circle" : "info"}
            </span>
            <span className="font-medium">{toastMsg.text}</span>
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
              {leads.length} Lead Masuk
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Kelola alur calon siswa dari formulir konsultasi website, online registration, hingga konversi resmi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadLeads}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-medium hover:bg-light-surface-container transition-colors shadow-2xs disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <span className={`material-symbols-outlined text-[18px] ${isLoading ? "animate-spin" : ""}`}>
              sync
            </span>
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-medium hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Stage Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-light-surface p-3.5 rounded-xl border border-light-outline-variant shadow-2xs">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-light-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama calon siswa, wali, no WA, atau ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-light-outline text-body-sm text-light-on-surface bg-light-surface-soft focus:bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-light-on-surface-variant hover:text-light-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <div className="text-body-sm text-light-on-surface-variant shrink-0">
          Total: <strong className="text-light-on-surface font-semibold">{filteredLeads.length}</strong> dari {leads.length} leads
        </div>
      </div>

      {/* Pipeline Stages Tab Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-light-outline-variant overflow-x-auto no-scrollbar pb-px">
        {[
          { key: "all", label: "Semua Tahapan", count: stats.total },
          { key: "baru", label: "Lead Baru", count: stats.baru },
          { key: "dihubungi", label: "Telah Dihubungi", count: stats.dihubungi },
          { key: "trial", label: "Jadwal Trial", count: stats.trial },
          { key: "siap", label: "Siap Mendaftar", count: stats.siap },
          { key: "batal", label: "Batal / Ditunda", count: stats.batal },
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
                  <th className="py-3 px-4">Jenjang &amp; Cabang</th>
                  <th className="py-3 px-4">Sumber</th>
                  <th className="py-3 px-4">Status Pipeline</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      <div className="inline-flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        <span>Memuat data lead dari Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      <span className="material-symbols-outlined text-[32px] text-light-outline block mb-1">
                        folder_off
                      </span>
                      Tidak ada lead yang cocok dengan filter atau pencarian saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSelected = selectedLead && lead.id === selectedLead.id;
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
                          <p className="font-semibold text-light-on-surface">{lead.studentName}</p>
                          <p className="text-[12px] text-light-on-surface-variant">
                            Wali: {lead.parentName}
                          </p>
                          <span className="text-[10px] text-light-on-surface-variant font-mono">
                            {lead.leadNumber} • {lead.formattedDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-light-on-surface">{lead.gradeLevel}</span>
                          <span className="text-[11px] text-light-on-surface-variant block">
                            {lead.branchName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-light-on-surface-variant font-label">
                            <span className="material-symbols-outlined text-[14px] text-light-primary">
                              {lead.sourceIcon}
                            </span>
                            <span className="truncate max-w-[110px]" title={lead.source}>
                              {lead.source}
                            </span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-label font-bold whitespace-nowrap ${lead.stageColor}`}
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
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant">
              Menampilkan <strong>{filteredLeads.length}</strong> dari total {leads.length} calon siswa
            </span>
          </div>
        </section>

        {/* Lead Detail Inspector Panel (Col 5) */}
        {selectedLead ? (
          <section className="lg:col-span-5 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between pb-4 border-b border-light-outline-variant gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                    {selectedLead.studentName}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-label-sm font-label font-bold ${selectedLead.stageColor}`}
                  >
                    {selectedLead.stageLabel}
                  </span>
                </div>
                <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                  ID Lead: #{selectedLead.leadNumber} • Masuk: {selectedLead.formattedDate}, {selectedLead.formattedTime}
                </p>
              </div>

              <a
                href={getWhatsAppLink(selectedLead)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success text-on-success font-label text-body-sm font-semibold shadow-xs hover:bg-success/90 transition-colors shrink-0"
                title="Buka Chat WhatsApp"
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
                  {selectedLead.parentName}
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
                  {selectedLead.gradeLevel}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">
                  Preferensi Lokasi / Cabang
                </span>
                <span className="font-semibold text-light-on-surface">
                  {selectedLead.branchName}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-light-outline-variant">
                <span className="text-[11px] font-label text-light-on-surface-variant uppercase font-semibold block">
                  Sumber / Catatan Permintaan Konsultasi:
                </span>
                <p className="text-body-sm text-light-on-surface mt-1 whitespace-pre-line bg-light-surface p-2.5 rounded-lg border border-light-outline-variant font-mono text-[12px] leading-relaxed">
                  {selectedLead.notes || "Tidak ada catatan khusus."}
                </p>
              </div>
            </div>

            {/* Pipeline Stage Selector Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
                <span>Ubah Tahapan Pipeline</span>
                {isPending && (
                  <span className="text-xs text-light-primary font-normal flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                    Menyimpan...
                  </span>
                )}
              </label>
              <select
                value={selectedLead.stage}
                disabled={isPending}
                onChange={(e) => handleUpdateStage(e.target.value as LeadItem["stage"])}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary font-label transition-colors disabled:opacity-50"
              >
                <option value="baru">1. Lead Baru (Perlu Dihubungi)</option>
                <option value="dihubungi">2. Telah Dihubungi (Menunggu Respon)</option>
                <option value="trial">3. Konsultasi / Trial Terjadwal</option>
                <option value="siap">4. Siap Mendaftar (Follow-up Pembayaran)</option>
                <option value="batal">5. Batal / Tidak Berminat</option>
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
              <div className="flex flex-col gap-3 border-l-2 border-light-primary pl-4 ml-2 max-h-48 overflow-y-auto">
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
                placeholder="Tulis rangkuman pembicaraan dengan orang tua siswa..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!newNote.trim() || isPending}
                  onClick={handleAddNote}
                  className="px-4 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs disabled:opacity-50"
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
                Data wali dan ananda akan otomatis disalin ke formulir pendaftaran tanpa perlu input ulang.
              </p>
            </div>
          </section>
        ) : (
          <section className="lg:col-span-5 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-8 text-center text-light-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-light-outline mb-2">person_search</span>
            <p className="font-medium text-light-on-surface">Pilih salah satu calon siswa pada tabel untuk melihat detail dan mengelola status pipeline.</p>
          </section>
        )}
      </div>
    </>
  );
}
