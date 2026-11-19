"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getAdmissionsDataAction,
  toggleAdmissionChecklistAction,
  approveAdmissionAction,
  assignEnrollmentClassAction,
  requestAdmissionRevisionAction,
  AdmissionItem,
  AvailableClassOption,
} from "@/app/actions/admissions";

export default function AdmissionsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [registrations, setRegistrations] = useState<AdmissionItem[]>([]);
  const [availableClasses, setAvailableClasses] = useState<AvailableClassOption[]>([]);
  const [stats, setStats] = useState({ total: 0, verify: 0, payment: 0, active: 0 });

  const [filterStage, setFilterStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [toastMsg, setToastMsg] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);

  const [isPending, startTransition] = useTransition();

  const showToast = (message: string, type: "success" | "warning" | "info" = "success") => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // 1. Initial Load from Supabase
  const loadData = async (preferredSelectId?: string) => {
    const res = await getAdmissionsDataAction();
    if (res.success) {
      setRegistrations(res.registrations);
      setAvailableClasses(res.availableClasses);
      setStats(res.stats);
      if (res.registrations.length > 0) {
        const found = preferredSelectId
          ? res.registrations.find((r) => r.id === preferredSelectId)
          : null;
        const target = found || res.registrations[0];
        setSelectedId(target.id);
        setSelectedClassId(target.classId || (res.availableClasses[0]?.id ?? ""));
      }
    } else {
      showToast(res.message || "Gagal memuat data pendaftaran dari database.", "warning");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedReg =
    registrations.find((r) => r.id === selectedId) || registrations[0];

  // Keep selectedClassId synced when selected registration changes
  useEffect(() => {
    if (selectedReg) {
      setSelectedClassId(selectedReg.classId || (availableClasses[0]?.id ?? ""));
    }
  }, [selectedId]);

  // Filter registrations based on stage tab & search text
  const filteredRegistrations = registrations.filter((r) => {
    if (filterStage !== "all" && r.stage !== filterStage) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.studentName.toLowerCase().includes(q);
      const matchReg = r.registrationNumber.toLowerCase().includes(q);
      const matchSchool = r.schoolOrigin.toLowerCase().includes(q);
      const matchParent = r.parentName.toLowerCase().includes(q);
      const matchProg = r.programName.toLowerCase().includes(q);
      return matchName || matchReg || matchSchool || matchParent || matchProg;
    }
    return true;
  });

  // Checklist toggle with Supabase persistence
  const handleToggleChecklist = (index: number) => {
    if (!selectedReg) return;
    const currentVal = selectedReg.checklist[index];

    // Optimistic UI update
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id !== selectedReg.id) return r;
        const updatedChecklist = [...r.checklist] as [boolean, boolean, boolean, boolean];
        updatedChecklist[index] = !currentVal;
        return { ...r, checklist: updatedChecklist };
      })
    );

    startTransition(async () => {
      const res = await toggleAdmissionChecklistAction(selectedReg.id, index, currentVal);
      if (res.success) {
        showToast("Checklist onboarding diperbarui di Supabase.", "info");
        await loadData(selectedReg.id);
      } else {
        showToast(res.message || "Gagal menyimpan checklist ke database.", "warning");
        await loadData(selectedReg.id);
      }
    });
  };

  // Change class allocation
  const handleAssignClass = (classId: string) => {
    setSelectedClassId(classId);
    if (!selectedReg) return;

    startTransition(async () => {
      const res = await assignEnrollmentClassAction(selectedReg.id, classId);
      if (res.success) {
        showToast("Rombel kelas berhasil dialokasikan!", "success");
        await loadData(selectedReg.id);
      } else {
        showToast(res.message || "Gagal mengalokasikan kelas.", "warning");
      }
    });
  };

  // Full Approval
  const handleApprove = () => {
    if (!selectedReg) return;

    startTransition(async () => {
      const res = await approveAdmissionAction(selectedReg.id, selectedClassId || undefined);
      if (res.success) {
        showToast(
          `Pendaftaran ${selectedReg.studentName} disetujui! Status aktif & invoice lunas.`,
          "success"
        );
        await loadData(selectedReg.id);
      } else {
        showToast(res.message || "Gagal menyetujui pendaftaran.", "warning");
      }
    });
  };

  // Submit Revision
  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReg) return;

    startTransition(async () => {
      const res = await requestAdmissionRevisionAction(selectedReg.id, revisionNote);
      setIsRevisionModalOpen(false);
      setRevisionNote("");
      if (res.success) {
        showToast(
          "Permintaan revisi berhasil dicatat. Buka WhatsApp wali untuk mengirim arahan.",
          "warning"
        );
        // Prepare WhatsApp link
        const cleanPhone = selectedReg.parentPhone.replace(/[^0-9]/g, "");
        const waText = encodeURIComponent(
          `Halo Bapak/Ibu ${selectedReg.parentName}, kami dari Bagian Admisi ARCI Bimbel terkait pendaftaran ananda ${selectedReg.studentName} (${selectedReg.registrationNumber}). Mohon melengkapi revisi berikut: ${revisionNote}. Terima kasih.`
        );
        window.open(`https://wa.me/${cleanPhone}?text=${waText}`, "_blank");
        await loadData(selectedReg.id);
      } else {
        showToast(res.message || "Gagal mencatat revisi.", "warning");
      }
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      showToast("Tidak ada data pendaftaran untuk diunduh.", "warning");
      return;
    }

    const headers = [
      "No. Registrasi",
      "Nama Siswa",
      "NISN",
      "Sekolah",
      "Kelas",
      "Wali Murid",
      "WhatsApp Wali",
      "Program",
      "Cabang",
      "Kelas Alokasi",
      "Total Tagihan",
      "Status Tagihan",
      "Status Pendaftaran",
      "Tanggal Daftar",
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.registrationNumber}"`,
      `"${r.studentName}"`,
      `"${r.nisn || "-"}"`,
      `"${r.schoolOrigin}"`,
      `"${r.currentGrade}"`,
      `"${r.parentName}"`,
      `"${r.parentPhone}"`,
      `"${r.programName}"`,
      `"${r.branchName}"`,
      `"${r.className}"`,
      `"${r.totalFee}"`,
      `"${r.invoiceStatus}"`,
      `"${r.stageLabel}"`,
      `"${r.enrolledAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pendaftaran-arci-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Laporan CSV berhasil diunduh!", "success");
  };

  const checkedCount = selectedReg ? selectedReg.checklist.filter(Boolean).length : 0;

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`p-3.5 rounded-xl border text-body-sm flex items-center justify-between gap-3 shadow-md transition-all ${
            toastMsg.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : toastMsg.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-950"
              : "border-light-outline-variant bg-light-surface text-light-on-surface"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${
                toastMsg.type === "success"
                  ? "text-success"
                  : toastMsg.type === "warning"
                  ? "text-warning"
                  : "text-brand-indigo"
              }`}
            >
              {toastMsg.type === "success"
                ? "check_circle"
                : toastMsg.type === "warning"
                ? "warning"
                : "info"}
            </span>
            <span className="font-medium">{toastMsg.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 rounded hover:bg-black/5"
            aria-label="Tutup notifikasi"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Data &amp; Verifikasi Pendaftaran Masuk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-bold shadow-2xs">
              {stats.verify} Menunggu Verifikasi
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Terhubung live ke Supabase: Validasi berkas formulir, penempatan rombel kelas, dan checklist onboarding siswa aktif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-light-on-surface-variant">
              download
            </span>
            <span>Unduh Laporan CSV</span>
          </button>
          <button
            type="button"
            onClick={() => loadData(selectedId)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-light-primary-container text-light-primary text-body-sm font-semibold hover:bg-light-primary-container/80 transition-colors"
            title="Refresh Data"
          >
            <span className={`material-symbols-outlined text-[18px] ${loading || isPending ? "animate-spin" : ""}`}>
              sync
            </span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] text-light-on-surface-variant font-label block">Total Formulir</span>
            <span className="text-headline-sm font-headline font-bold text-light-on-surface">{stats.total}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-light-primary-container text-brand-indigo flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] text-light-on-surface-variant font-label block">Perlu Verifikasi</span>
            <span className="text-headline-sm font-headline font-bold text-amber-700">{stats.verify}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">pending_actions</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] text-light-on-surface-variant font-label block">Menunggu SPP</span>
            <span className="text-headline-sm font-headline font-bold text-warning">{stats.payment}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-warning flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">payments</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] text-light-on-surface-variant font-label block">Diterima &amp; Aktif</span>
            <span className="text-headline-sm font-headline font-bold text-success">{stats.active}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-success flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
        </div>
      </div>

      {/* Registration Funnel Stage Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-light-outline-variant pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "Semua Berkas", count: stats.total },
            { key: "verify", label: "Perlu Verifikasi", count: stats.verify },
            { key: "payment", label: "Menunggu Pembayaran", count: stats.payment },
            { key: "active", label: "Diterima & Aktif", count: stats.active },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStage(tab.key)}
              className={`px-3 sm:px-4 py-2 border-b-2 font-label text-body-sm sm:text-body-md whitespace-nowrap flex items-center gap-2 transition-colors ${
                filterStage === tab.key
                  ? "border-light-primary text-light-primary font-bold"
                  : "border-transparent text-light-on-surface hover:text-light-primary font-medium"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  filterStage === tab.key
                    ? "bg-light-primary text-light-on-primary"
                    : "bg-light-surface-container text-light-on-surface"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa, reg, sekolah..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-light-outline text-body-sm focus:border-light-primary focus:ring-1 focus:ring-light-primary"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-light-outline">
            search
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-light-outline hover:text-light-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Split Layout: Registration Table (Col 7) & Review Onboarding Inspector (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Registration Table (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-headline font-bold text-title-md text-light-on-surface block">
                Daftar Formulir Pendaftaran
              </span>
              <span className="text-[12px] text-light-on-surface-variant">
                Klik baris tabel untuk meninjau detail &amp; checklist verifikasi di sisi kanan.
              </span>
            </div>
            <span className="text-[12px] text-light-on-surface-variant font-label bg-light-surface-container-low px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
              Live Supabase DB
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Reg &amp; Nama Calon Siswa</th>
                  <th className="py-3 px-4">Program Pilihan</th>
                  <th className="py-3 px-4">Tanggal Masuk</th>
                  <th className="py-3 px-4">Status Berkas</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      <div className="inline-flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-brand-indigo">progress_activity</span>
                        <span>Memuat data pendaftaran dari database Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] text-light-outline block mb-1">
                        folder_off
                      </span>
                      Tidak ada formulir pendaftaran yang sesuai kriteria pencarian/filter.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => {
                    const isSelected = selectedReg && reg.id === selectedReg.id;
                    return (
                      <tr
                        key={reg.id}
                        onClick={() => setSelectedId(reg.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-light-primary-container/25 border-l-4 border-light-primary"
                            : "hover:bg-light-surface-container"
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-light-primary block font-mono text-[12px]">
                            {reg.registrationNumber}
                          </span>
                          <span className="font-semibold text-light-on-surface">{reg.studentName}</span>
                          <span className="text-[11px] text-light-on-surface-variant block truncate max-w-[200px]">
                            {reg.schoolOrigin}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-light-on-surface">{reg.programName}</span>
                          <span className="text-[11px] text-light-on-surface-variant block">
                            {reg.branchName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-light-on-surface-variant whitespace-nowrap text-[12px]">
                          {reg.enrolledAt}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${reg.stageBadge}`}
                          >
                            {reg.stageLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            className={`px-3 py-1 rounded text-[11px] font-label font-semibold shadow-2xs transition-colors ${
                              isSelected
                                ? "bg-light-primary text-light-on-primary"
                                : "border border-light-outline text-light-on-surface hover:bg-light-surface"
                            }`}
                          >
                            {isSelected ? "Dipilih" : "Tinjau"}
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
            <span className="text-light-on-surface-variant text-[13px]">
              Menampilkan {filteredRegistrations.length} dari {registrations.length} pendaftaran di Supabase
            </span>
          </div>
        </section>

        {/* Registration Review & Onboarding Checklist Inspector (Col 5) */}
        {selectedReg ? (
          <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
            <div className="flex items-start justify-between pb-3.5 border-b border-light-outline-variant">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                    Review: {selectedReg.studentName}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-label-sm font-label font-bold ${selectedReg.stageBadge}`}
                  >
                    {selectedReg.stageLabel}
                  </span>
                </div>
                <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                  No. Reg: <span className="font-mono font-semibold">{selectedReg.registrationNumber}</span> • NISN: {selectedReg.nisn || "-"}
                </p>
              </div>
            </div>

            {/* Applicant & Wali Snapshot Details Card */}
            <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2.5 text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant font-label">
                  Orang Tua / Wali
                </span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedReg.parentName} ({selectedReg.parentRelation})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant font-label">
                  Kontak WhatsApp
                </span>
                <a
                  href={`https://wa.me/${selectedReg.parentPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Halo ${selectedReg.parentName}, kami dari Bagian Admisi ARCI Bimbel terkait pendaftaran ananda ${selectedReg.studentName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">chat</span>
                  <span>{selectedReg.parentPhone}</span>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant font-label">
                  Sekolah Asal Siswa
                </span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedReg.schoolOrigin} ({selectedReg.currentGrade})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant font-label">
                  Target &amp; Catatan Belajar
                </span>
                <span className="font-semibold text-light-on-surface text-right truncate max-w-[220px]" title={selectedReg.targetGoal}>
                  {selectedReg.targetGoal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant font-label">
                  Program &amp; Cabang
                </span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedReg.programName} • {selectedReg.branchName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant font-label">
                  Lampiran Berkas Rapor
                </span>
                <button
                  type="button"
                  onClick={() => showToast(`Membuka berkas dokumen: ${selectedReg.fileName}`, "info")}
                  className="font-medium text-light-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">attach_file</span>
                  <span>{selectedReg.fileName}</span>
                </button>
              </div>

              {/* Fee and Invoice Info */}
              <div className="pt-2 border-t border-light-outline-variant flex items-center justify-between font-bold">
                <div className="flex flex-col">
                  <span className="text-light-on-surface text-body-sm">Tagihan Pendaftaran</span>
                  <span className="text-[11px] font-mono text-light-on-surface-variant font-normal">
                    {selectedReg.invoiceNumber} • {selectedReg.invoiceStatus === "paid" ? "Lunas" : "Belum Lunas"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-brand-indigo font-headline text-headline-sm block">
                    Rp{selectedReg.totalFee.toLocaleString("id-ID")}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                      selectedReg.invoiceStatus === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedReg.invoiceStatus === "paid" ? "Sudah Dibayar" : "Menunggu Pelunasan"}
                  </span>
                </div>
              </div>
            </div>

            {/* Class Placement Allocation Selector */}
            <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-label-sm font-label font-bold text-light-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">class</span>
                  <span>Alokasi Rombel Kelas:</span>
                </label>
                <span className="text-[11px] text-light-on-surface-variant">
                  {selectedReg.className}
                </span>
              </div>
              <select
                value={selectedClassId}
                onChange={(e) => handleAssignClass(e.target.value)}
                disabled={isPending}
                className="w-full px-3 py-2 rounded-lg border border-light-outline bg-light-surface text-body-sm font-medium focus:border-light-primary focus:ring-1 focus:ring-light-primary"
              >
                <option value="">-- Pilih Rombel Kelas --</option>
                {availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.room} • {cls.schedule})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-light-on-surface-variant">
                Jadwal: {selectedReg.classSchedule}
              </span>
            </div>

            {/* Interactive 4-step Onboarding Checklist */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label text-label-sm text-light-on-surface-variant font-bold uppercase tracking-wider">
                  Checklist Onboarding Siswa:
                </span>
                <span className="text-[11px] font-bold text-brand-indigo bg-light-primary-container px-2 py-0.5 rounded-full">
                  {checkedCount} / 4 Selesai
                </span>
              </div>

              {[
                "1. Data identitas siswa & kontak wali lengkap",
                `2. Penempatan kelas: ${selectedReg.className}`,
                `3. Pembayaran awal: ${selectedReg.invoiceStatus === "paid" ? "Sudah Lunas" : "Menunggu Verifikasi"}`,
                "4. Akun portal siswa/wali diterbitkan & dikirim via WA",
              ].map((step, idx) => (
                <label
                  key={idx}
                  className="p-2.5 rounded-lg border border-light-outline-variant bg-light-surface flex items-center gap-3 text-body-sm text-light-on-surface cursor-pointer hover:bg-light-surface-soft transition-colors select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedReg.checklist[idx]}
                    disabled={isPending}
                    onChange={() => handleToggleChecklist(idx)}
                    className="rounded text-light-primary focus:ring-light-primary w-4 h-4 cursor-pointer"
                  />
                  <span className={selectedReg.checklist[idx] ? "font-semibold text-emerald-800" : ""}>
                    {step}
                  </span>
                </label>
              ))}
            </div>

            {/* Approval & Revision Actions */}
            <div className="pt-2 border-t border-light-outline-variant flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isPending || selectedReg.status === "active"}
                  className={`flex-1 py-3 rounded-xl font-label text-label-md font-bold shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
                    selectedReg.status === "active"
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedReg.status === "active" ? "check_circle" : "verified"}
                  </span>
                  <span>
                    {selectedReg.status === "active"
                      ? "Pendaftaran Telah Aktif"
                      : "Setujui & Tempatkan ke Kelas"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(true)}
                  disabled={isPending}
                  className="px-3.5 py-3 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-label-md font-semibold transition-colors min-h-[44px]"
                >
                  Minta Revisi
                </button>
              </div>
              <p className="text-[11px] text-light-on-surface-variant text-center leading-relaxed">
                Persetujuan akan mengaktifkan siswa, menandai invoice sebagai lunas di modul keuangan, dan memperbarui status pendaftaran di Supabase.
              </p>
            </div>
          </section>
        ) : (
          <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant p-8 text-center text-light-on-surface-variant">
            Pilih pendaftaran di tabel untuk melihat detail verifikasi.
          </section>
        )}
      </div>

      {/* Modal: Minta Revisi Berkas */}
      {isRevisionModalOpen && selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-light-outline-variant flex items-center justify-between bg-warning/10">
              <div className="flex items-center gap-2 text-warning">
                <span className="material-symbols-outlined text-[22px]">pending_actions</span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Minta Revisi: {selectedReg.studentName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRequestRevision} className="p-6 flex flex-col gap-4 text-body-sm">
              <div>
                <span className="text-[12px] text-light-on-surface-variant block mb-1">
                  Wali Murid: <strong>{selectedReg.parentName}</strong> ({selectedReg.parentPhone})
                </span>
                <label className="font-semibold text-light-on-surface block mb-1">
                  Catatan Revisi untuk Wali Murid:
                </label>
                <textarea
                  rows={3}
                  required
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Contoh: Lampiran foto rapor buram / halaman nilai semester 2 belum lengkap. Mohon kirim ulang via WA."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-warning text-on-warning hover:bg-warning/90 font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Kirim &amp; Buka WA</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
