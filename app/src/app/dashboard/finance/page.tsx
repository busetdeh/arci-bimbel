"use client";

import React, { useState } from "react";

interface Invoice {
  id: string;
  student: string;
  parent: string;
  phone: string;
  program: string;
  method: string;
  amount: string;
  rawAmount: number;
  date: string;
  dueDate: string;
  status: "verify" | "paid" | "overdue";
  statusLabel: string;
  statusBadge: string;
  receiptFile?: string;
}

const initialInvoices: Invoice[] = [
  {
    id: "INV-2026-1189",
    student: "Farhan Pratama",
    parent: "Dra. Nurhayati",
    phone: "0812-3456-7890",
    program: "Reguler SMP Kelas 8 (Sudirman)",
    method: "Transfer Bank BCA Virtual Account",
    amount: "Rp1.100.000",
    rawAmount: 1100000,
    date: "18 Nov 2026",
    dueDate: "20 Nov 2026",
    status: "verify",
    statusLabel: "Menunggu Review",
    statusBadge: "bg-accent text-on-accent",
    receiptFile: "BCA-Transfer_20261118_1942.jpg",
  },
  {
    id: "INV-2026-1182",
    student: "Nadia Amanda",
    parent: "Pak Hermawan",
    phone: "0821-1234-5678",
    program: "Intensif UTBK 2026 (Online #1)",
    method: "Transfer Bank Mandiri",
    amount: "Rp1.450.000",
    rawAmount: 1450000,
    date: "17 Nov 2026",
    dueDate: "19 Nov 2026",
    status: "verify",
    statusLabel: "Menunggu Review",
    statusBadge: "bg-accent text-on-accent",
    receiptFile: "Mandiri_Transfer_Nadia.jpg",
  },
  {
    id: "INV-2026-1105",
    student: "Ahmad Rizky Pratama",
    parent: "Hendra Pratama",
    phone: "0812-3456-7890",
    program: "Intensif UTBK 2026 (Sudirman A)",
    method: "BCA Virtual Account",
    amount: "Rp1.450.000",
    rawAmount: 1450000,
    date: "05 Nov 2026",
    dueDate: "05 Nov 2026",
    status: "paid",
    statusLabel: "Lunas",
    statusBadge: "bg-success/15 text-success",
    receiptFile: "Kwitansi_Resmi_ARCI_1105.pdf",
  },
  {
    id: "INV-2026-1044",
    student: "Bagas Wicaksono",
    parent: "Ibu Indah",
    phone: "0819-2233-4455",
    program: "Reguler SD Kelas 6 (Kebayoran)",
    method: "Transfer Bank BRI",
    amount: "Rp850.000",
    rawAmount: 850000,
    date: "28 Okt 2026",
    dueDate: "05 Nov 2026",
    status: "overdue",
    statusLabel: "Jatuh Tempo",
    statusBadge: "bg-danger/15 text-danger",
  },
];

export default function FinancePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filterTab, setFilterTab] = useState<string>("all");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(initialInvoices[0].id);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filterTab === "all") return true;
    return inv.status === filterTab;
  });

  const handleApprove = () => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              status: "paid",
              statusLabel: "Lunas",
              statusBadge: "bg-success/15 text-success",
            }
          : inv
      )
    );
    showToast(`Pembayaran ${selectedInvoice.student} (${selectedInvoice.amount}) berhasil disetujui & kuitansi terkirim!`);
  };

  const handleReject = () => {
    showToast(`Bukti pembayaran untuk ${selectedInvoice.id} ditolak dan notifikasi perbaikan dikirim ke wali murid.`);
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

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Manajemen Tagihan &amp; Verifikasi Pembayaran
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-bold shadow-2xs">
              {invoices.filter((i) => i.status === "verify").length} Perlu Ditinjau
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Kelola paket biaya, invoice berkala siswa, dan verifikasi bukti transfer bank masuk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showToast("Laporan keuangan CSV berhasil diunduh (rekap-kas-arci-2026.csv)")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-light-on-surface-variant">
              download
            </span>
            <span>Rekap Keuangan CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Total Kas Masuk (Bulan Ini)
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-1">
              Rp148.500.000
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              142 Siswa terbayar lunas
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success text-on-success flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Menunggu Verifikasi Admin
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-1">
              {invoices.filter((i) => i.status === "verify").length} Bukti Masuk
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Total nominal: <strong className="text-brand-indigo">Rp2.550.000</strong>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Invoice Belum Dibayar
            </span>
            <p className="font-headline font-bold text-headline-sm text-warning mt-1">
              Rp18.200.000
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              16 invoice dalam masa tenggang
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-warning text-on-warning flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">schedule</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Tunggakan Jatuh Tempo
            </span>
            <p className="font-headline font-bold text-headline-sm text-danger mt-1">
              Rp12.450.000
            </p>
            <p className="text-[11px] text-danger font-semibold mt-0.5">
              9 invoice lewat jatuh tempo
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-danger text-on-danger flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">priority_high</span>
          </div>
        </div>
      </section>

      {/* Split Layout: Table (Col 7) & Verification Review Inspector (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Section: Invoice List Table (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Antrean Pembayaran Masuk
              </h2>
              <p className="text-[12px] text-light-on-surface-variant">
                Klik baris untuk meninjau bukti transfer dan kuitansi.
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: "all", label: "Semua", count: invoices.length },
                { key: "verify", label: "Perlu Verifikasi", count: invoices.filter((i) => i.status === "verify").length },
                { key: "paid", label: "Lunas", count: invoices.filter((i) => i.status === "paid").length },
                { key: "overdue", label: "Jatuh Tempo", count: invoices.filter((i) => i.status === "overdue").length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-label font-semibold whitespace-nowrap transition-colors ${
                    filterTab === tab.key
                      ? "bg-light-primary text-light-on-primary shadow-2xs"
                      : "border border-light-outline text-light-on-surface hover:bg-light-surface-container"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice &amp; Siswa</th>
                  <th className="py-3 px-4">Program / Paket</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Status Tagihan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {filteredInvoices.map((inv) => {
                  const isSelected = inv.id === selectedInvoice.id;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoiceId(inv.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-light-primary-container/20 border-l-4 border-light-primary"
                          : "hover:bg-light-surface-container"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-light-primary block">{inv.id}</span>
                        <span className="font-semibold text-light-on-surface">{inv.student}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-light-on-surface">{inv.program}</span>
                        <span className="text-[11px] text-light-on-surface-variant block">
                          Wali: {inv.parent}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-indigo">{inv.amount}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${inv.statusBadge}`}
                        >
                          {inv.statusLabel}
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
              Menampilkan {filteredInvoices.length} dari {invoices.length} transaksi
            </span>
          </div>
        </section>

        {/* Right Section: Payment Verification Inspector Panel (Col 5) */}
        <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-6 sticky top-24">
          <div className="flex items-start justify-between pb-4 border-b border-light-outline-variant">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                  Verifikasi Bukti Bayar
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-label-sm font-label font-bold ${selectedInvoice.statusBadge}`}
                >
                  {selectedInvoice.statusLabel}
                </span>
              </div>
              <p className="text-body-sm text-light-on-surface-variant mt-1">
                Invoice #{selectedInvoice.id} • {selectedInvoice.student}
              </p>
            </div>
          </div>

          {/* Invoice Snapshot Details Card */}
          <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2.5 text-body-sm">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-light-on-surface-variant">Nama Siswa / Wali</span>
              <span className="font-semibold text-light-on-surface text-right">
                {selectedInvoice.student} / {selectedInvoice.parent}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-light-on-surface-variant">Program Dipilih</span>
              <span className="font-semibold text-light-on-surface text-right">
                {selectedInvoice.program}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-light-on-surface-variant">Metode Pembayaran</span>
              <span className="font-semibold text-light-on-surface text-right">
                {selectedInvoice.method}
              </span>
            </div>
            <div className="pt-2.5 border-t border-light-outline-variant flex items-center justify-between font-bold text-title-md">
              <span className="text-light-on-surface text-body-md">Total Nominal Tagihan</span>
              <span className="text-brand-indigo font-headline text-headline-sm">
                {selectedInvoice.amount}
              </span>
            </div>
          </div>

          {/* Transfer Receipt Preview Box */}
          {selectedInvoice.receiptFile && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label text-label-md text-light-on-surface font-semibold">
                  Lampiran Bukti Transfer:
                </span>
                <button
                  type="button"
                  onClick={() => showToast(`Membuka lampiran gambar: ${selectedInvoice.receiptFile}`)}
                  className="text-[12px] text-brand-indigo hover:underline font-label font-medium inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                  <span>Perbesar Gambar</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low flex flex-col items-center justify-center gap-2.5 text-center">
                <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[28px]">receipt</span>
                </div>
                <div>
                  <p className="font-bold text-body-sm text-light-on-surface">
                    {selectedInvoice.receiptFile}
                  </p>
                  <p className="text-[11px] text-light-on-surface-variant mt-0.5">
                    Waktu: {selectedInvoice.date} • Metode: {selectedInvoice.method}
                  </p>
                  <p className="text-[11px] text-success font-semibold mt-1">
                    ✓ Nominal di bukti transfer valid: {selectedInvoice.amount}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Approval Buttons */}
          <div className="pt-4 border-t border-light-outline-variant flex flex-col gap-3">
            {selectedInvoice.status === "verify" ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-success text-on-success hover:bg-success/90 font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Setujui &amp; Terbitkan Kuitansi</span>
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-danger text-danger hover:bg-danger/10 font-label text-label-md font-semibold transition-colors min-h-[44px]"
                >
                  Tolak Bukti
                </button>
              </div>
            ) : selectedInvoice.status === "overdue" ? (
              <a
                href={`https://wa.me/62${selectedInvoice.phone.replace(/[^0-9]/g, "").slice(1)}?text=Halo%20${encodeURIComponent(selectedInvoice.parent)},%20ini%20pengingat%20tagihan%20bimbel%20${encodeURIComponent(selectedInvoice.student)}%20sebesar%20${encodeURIComponent(selectedInvoice.amount)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-warning text-on-warning hover:bg-warning/90 font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Kirim Pengingat Tagihan via WhatsApp</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => showToast(`Kwitansi resmi untuk ${selectedInvoice.id} berhasil dicetak!`)}
                className="w-full py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Ulang Kwitansi Lunas</span>
              </button>
            )}

            <p className="text-[11px] text-light-on-surface-variant text-center leading-relaxed">
              Setelah disetujui, kuitansi resmi otomatis dikirimkan ke nomor WhatsApp wali siswa.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
