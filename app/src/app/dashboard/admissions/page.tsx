"use client";

import React, { useState } from "react";

interface Registration {
  id: string;
  student: string;
  parent: string;
  phone: string;
  school: string;
  program: string;
  branch: string;
  file: string;
  fee: string;
  date: string;
  status: "verify" | "payment" | "active";
  statusLabel: string;
  statusBadge: string;
  checklist: boolean[];
}

const initialRegistrations: Registration[] = [
  {
    id: "REG-2026-1189",
    student: "Farhan Pratama",
    parent: "Dra. Nurhayati",
    phone: "0812-3456-7890",
    school: "SMPN 115 Jakarta (Kelas 8)",
    program: "Reguler SMP",
    branch: "Cabang Sudirman",
    file: "Rapor_Kls7_Farhan.pdf",
    fee: "Rp1.100.000",
    date: "18 Nov 2026",
    status: "verify",
    statusLabel: "Perlu Verifikasi",
    statusBadge: "bg-accent text-on-accent",
    checklist: [true, true, false, false],
  },
  {
    id: "REG-2026-1182",
    student: "Nadia Amanda",
    parent: "Pak Hermawan",
    phone: "0821-1234-5678",
    school: "SMAN 28 Jakarta (Kelas 12)",
    program: "Intensif UTBK",
    branch: "Online Zoom #1",
    file: "Kartu_Pelajar_Nadia.jpg",
    fee: "Rp1.450.000",
    date: "17 Nov 2026",
    status: "payment",
    statusLabel: "Menunggu Pembayaran",
    statusBadge: "bg-warning text-on-warning",
    checklist: [true, true, true, false],
  },
  {
    id: "REG-2026-1175",
    student: "Bagas Wicaksono",
    parent: "Ibu Indah",
    phone: "0819-2233-4455",
    school: "SD Al-Azhar (Kelas 6)",
    program: "Reguler SD",
    branch: "Cabang Kebayoran",
    file: "Rapor_SD_Bagas.pdf",
    fee: "Rp850.000",
    date: "15 Nov 2026",
    status: "active",
    statusLabel: "Diterima & Aktif",
    statusBadge: "bg-success text-on-success",
    checklist: [true, true, true, true],
  },
];

export default function AdmissionsPage() {
  const [filterStage, setFilterStage] = useState<string>("all");
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [selectedId, setSelectedId] = useState<string>(initialRegistrations[0].id);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedReg =
    registrations.find((r) => r.id === selectedId) || registrations[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (filterStage === "all") return true;
    return r.status === filterStage;
  });

  const handleToggleChecklist = (index: number) => {
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id !== selectedReg.id) return r;
        const newChecklist = [...r.checklist];
        newChecklist[index] = !newChecklist[index];
        return { ...r, checklist: newChecklist };
      })
    );
  };

  const handleApprove = () => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === selectedReg.id
          ? {
              ...r,
              status: "active",
              statusLabel: "Diterima & Aktif",
              statusBadge: "bg-success text-on-success",
              checklist: [true, true, true, true],
            }
          : r
      )
    );
    showToast(`Pendaftaran ${selectedReg.student} berhasil disetujui & rombel kelas dialokasikan!`);
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRevisionModalOpen(false);
    showToast("Permintaan revisi berkas telah dikirimkan via WhatsApp ke wali murid.");
  };

  const checkedCount = selectedReg.checklist.filter(Boolean).length;

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

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Data &amp; Verifikasi Pendaftaran Masuk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-bold shadow-2xs">
              {registrations.filter((r) => r.status === "verify").length} Menunggu Verifikasi
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Validasi berkas pendaftaran calon siswa, penempatan rombel kelas, dan checklist onboarding siswa aktif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showToast("Laporan berkas pendaftaran berhasil diunduh (pendaftaran-2026.csv)")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-light-on-surface-variant">
              download
            </span>
            <span>Unduh Laporan CSV</span>
          </button>
        </div>
      </div>

      {/* Registration Funnel Stage Filters */}
      <div className="flex items-center gap-2 border-b border-light-outline-variant overflow-x-auto pb-px">
        {[
          { key: "all", label: "Semua Berkas", count: registrations.length },
          { key: "verify", label: "Perlu Verifikasi", count: registrations.filter((r) => r.status === "verify").length },
          { key: "payment", label: "Menunggu Pembayaran", count: registrations.filter((r) => r.status === "payment").length },
          { key: "active", label: "Diterima & Aktif", count: registrations.filter((r) => r.status === "active").length },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterStage(tab.key)}
            className={`px-4 py-2 border-b-2 font-label text-body-md whitespace-nowrap flex items-center gap-2 transition-colors ${
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

      {/* Split Layout: Registration Table (Col 7) & Review Onboarding Inspector (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Registration Table (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="font-headline font-bold text-title-md text-light-on-surface">
              Daftar Formulir Pendaftaran
            </span>
            <span className="text-[12px] text-light-on-surface-variant font-label bg-light-surface-container-low px-2.5 py-1 rounded-md">
              Bulan: November 2026
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
                {filteredRegistrations.map((reg) => {
                  const isSelected = reg.id === selectedReg.id;
                  return (
                    <tr
                      key={reg.id}
                      onClick={() => setSelectedId(reg.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-light-primary-container/20 border-l-4 border-light-primary"
                          : "hover:bg-light-surface-container"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-light-primary block">{reg.id}</span>
                        <span className="font-semibold text-light-on-surface">{reg.student}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-light-on-surface">{reg.program}</span>
                        <span className="text-[11px] text-light-on-surface-variant block">
                          {reg.branch}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-light-on-surface-variant">{reg.date}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${reg.statusBadge}`}
                        >
                          {reg.statusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className={`px-3 py-1 rounded text-[11px] font-label font-semibold shadow-2xs ${
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
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant text-[13px]">
              Menampilkan {filteredRegistrations.length} dari {registrations.length} pendaftaran
            </span>
          </div>
        </section>

        {/* Registration Review & Onboarding Checklist Inspector (Col 5) */}
        <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-6 sticky top-24">
          <div className="flex items-start justify-between pb-4 border-b border-light-outline-variant">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                  Review: {selectedReg.student}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-label-sm font-label font-bold ${selectedReg.statusBadge}`}
                >
                  {selectedReg.statusLabel}
                </span>
              </div>
              <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                No. Reg: {selectedReg.id} • Sumber: Formulir Web Funnel
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
                {selectedReg.parent} ({selectedReg.phone})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-light-on-surface-variant font-label">
                Sekolah Asal Siswa
              </span>
              <span className="font-semibold text-light-on-surface text-right">
                {selectedReg.school}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-light-on-surface-variant font-label">
                Program &amp; Cabang
              </span>
              <span className="font-semibold text-light-on-surface text-right">
                {selectedReg.program} • {selectedReg.branch}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-light-on-surface-variant font-label">
                Lampiran Berkas Rapor
              </span>
              <button
                type="button"
                onClick={() => showToast(`Membuka lampiran berkas: ${selectedReg.file}`)}
                className="font-medium text-light-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">attach_file</span>
                <span>{selectedReg.file}</span>
              </button>
            </div>
            <div className="pt-2 border-t border-light-outline-variant flex items-center justify-between font-bold text-title-md">
              <span className="text-light-on-surface text-body-md">Total Tagihan Awal</span>
              <span className="text-brand-indigo font-headline text-headline-sm">
                {selectedReg.fee}
              </span>
            </div>
          </div>

          {/* Onboarding Checklist */}
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
              "2. Penempatan kelas & rombel terverifikasi",
              "3. Pembayaran awal diverifikasi admin keuangan",
              "4. Akun portal siswa/wali diterbitkan & dikirim via WA",
            ].map((step, idx) => (
              <label
                key={idx}
                className="p-2.5 rounded-lg border border-light-outline-variant bg-light-surface flex items-center gap-3 text-body-sm text-light-on-surface cursor-pointer hover:bg-light-surface-soft transition-colors select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedReg.checklist[idx]}
                  onChange={() => handleToggleChecklist(idx)}
                  className="rounded text-light-primary focus:ring-light-primary w-4 h-4"
                />
                <span className={selectedReg.checklist[idx] ? "font-semibold" : ""}>
                  {step}
                </span>
              </label>
            ))}
          </div>

          {/* Approval Actions */}
          <div className="pt-3 border-t border-light-outline-variant flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleApprove}
                className="flex-1 py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md font-bold shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Setujui &amp; Tempatkan ke Kelas</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(true)}
                className="px-3.5 py-3 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-label-md font-semibold transition-colors min-h-[44px]"
              >
                Minta Revisi
              </button>
            </div>
            <p className="text-[11px] text-light-on-surface-variant text-center leading-relaxed">
              Setelah disetujui, invoice diterbitkan dan notifikasi WhatsApp konfirmasi orientasi dikirim ke wali murid.
            </p>
          </div>
        </section>
      </div>

      {/* Modal: Minta Revisi Berkas */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-light-outline-variant flex items-center justify-between bg-warning/10">
              <div className="flex items-center gap-2 text-warning">
                <span className="material-symbols-outlined text-[22px]">pending_actions</span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Minta Revisi Berkas
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
                <label className="font-semibold text-light-on-surface block mb-1">
                  Catatan Revisi untuk Wali Murid:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Lampiran foto rapor buram / halaman nilai semester 2 belum terfoto lengkap..."
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
                  className="px-5 py-2 rounded-lg bg-warning text-on-warning hover:bg-warning/90 font-semibold shadow-xs"
                >
                  Kirim Notifikasi Revisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
