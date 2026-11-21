"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  FinanceInvoice,
  FinanceStats,
  StudentOption,
  formatRupiah,
  terbilang,
} from "@/lib/finance-constants";
import {
  getFinanceDataAction,
  approvePaymentAction,
  rejectPaymentAction,
  createManualInvoiceAction,
  getStudentOptionsAction,
} from "@/app/actions/finance";

export default function FinancePage() {
  const [invoices, setInvoices] = useState<FinanceInvoice[]>([]);
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    paidCount: 0,
    pendingReviewCount: 0,
    pendingReviewAmount: 0,
    unpaidCount: 0,
    unpaidAmount: 0,
    overdueCount: 0,
    overdueAmount: 0,
  });
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals state
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState<boolean>(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState<boolean>(false);

  // Form states
  const [rejectReason, setRejectReason] = useState<string>("Nominal transfer tidak sesuai dengan tagihan.");
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    studentId: "",
    monthPeriod: "SPP Bulan Depan (2026)",
    description: "Tagihan SPP Reguler & Biaya Modul",
    amount: 1200000,
    dueDate: "",
  });

  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Load finance data from Supabase
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getFinanceDataAction();
      if (res.success) {
        setInvoices(res.invoices);
        setStats(res.stats);
        if (res.invoices.length > 0) {
          // Select first 'verify' invoice or first invoice if none selected or not present
          setSelectedInvoiceId((currentId) => {
            if (currentId && res.invoices.some((i) => i.id === currentId)) {
              return currentId;
            }
            const firstVerify = res.invoices.find((i) => i.status === "verify");
            return firstVerify ? firstVerify.id : res.invoices[0].id;
          });
        }
      } else {
        showToast(res.message || "Gagal memuat data keuangan dari Supabase.", "error");
      }
    } catch {
      showToast("Terjadi kendala jaringan saat memuat data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const defaultDue = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    setNewInvoiceForm((prev) => ({ ...prev, dueDate: defaultDue }));

    // Fetch student options for manual invoice modal
    getStudentOptionsAction().then((opts) => {
      setStudentOptions(opts);
      if (opts.length > 0) {
        setNewInvoiceForm((prev) => ({ ...prev, studentId: opts[0].id }));
      }
    });
  }, []);

  const selectedInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0] || null;

  // Filtered list based on active tab & search query
  const filteredInvoices = invoices.filter((inv) => {
    // Tab filter
    if (filterTab !== "all" && inv.status !== filterTab) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInv = inv.invoiceNumber.toLowerCase().includes(q);
      const matchStudent = inv.studentName.toLowerCase().includes(q);
      const matchParent = inv.parentName.toLowerCase().includes(q);
      const matchProgram = inv.program.toLowerCase().includes(q);
      if (!matchInv && !matchStudent && !matchParent && !matchProgram) return false;
    }
    return true;
  });

  // Action: Approve payment
  const handleApprove = () => {
    if (!selectedInvoice) return;
    startTransition(async () => {
      const res = await approvePaymentAction(selectedInvoice.id, selectedInvoice.method);
      if (res.success) {
        showToast(res.message);
        await loadData();
        setIsReceiptModalOpen(true); // Open official receipt immediately
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Reject payment
  const handleRejectConfirm = () => {
    if (!selectedInvoice) return;
    startTransition(async () => {
      const res = await rejectPaymentAction(
        selectedInvoice.id,
        rejectReason,
        selectedInvoice.paymentId
      );
      if (res.success) {
        showToast(res.message);
        setIsRejectModalOpen(false);
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Create manual invoice
  const handleCreateNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceForm.studentId || !newInvoiceForm.amount || !newInvoiceForm.dueDate) {
      showToast("Lengkapi semua kolom formulir invoice.", "error");
      return;
    }
    startTransition(async () => {
      const selectedStudent = studentOptions.find((s) => s.id === newInvoiceForm.studentId);
      const res = await createManualInvoiceAction({
        studentId: newInvoiceForm.studentId,
        parentId: selectedStudent?.parentId,
        amount: Number(newInvoiceForm.amount),
        monthPeriod: newInvoiceForm.monthPeriod,
        description: newInvoiceForm.description,
        dueDate: newInvoiceForm.dueDate,
      });
      if (res.success) {
        showToast(res.message);
        setIsNewInvoiceModalOpen(false);
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Export CSV
  const handleExportCSV = () => {
    if (invoices.length === 0) {
      showToast("Belum ada data transaksi untuk diekspor.", "error");
      return;
    }

    const headers = [
      "No Invoice",
      "Tanggal Terbit",
      "Batas Waktu",
      "Nama Siswa",
      "Tingkat / Kelas",
      "Nama Wali",
      "No Telepon",
      "Program / Uraian",
      "Nominal (Rp)",
      "Status Tagihan",
      "Metode Pembayaran",
    ];

    const rows = invoices.map((i) => [
      `"${i.invoiceNumber}"`,
      `"${i.date}"`,
      `"${i.dueDate}"`,
      `"${i.studentName}"`,
      `"${i.studentGrade}"`,
      `"${i.parentName}"`,
      `"${i.parentPhone}"`,
      `"${i.program.replace(/"/g, '""')}"`,
      i.rawAmount,
      `"${i.statusLabel}"`,
      `"${i.method}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `rekap-keuangan-bimbel-arci-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Rekap Keuangan CSV berhasil diunduh.");
  };

  // Print official receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-[20px] ${
                toastMsg.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {toastMsg.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 rounded hover:bg-black/5 text-light-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Manajemen Tagihan &amp; Verifikasi Pembayaran
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-bold shadow-2xs">
              {stats.pendingReviewCount} Perlu Ditinjau
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Data live Supabase: Kelola tagihan SPP, verifikasi bukti transfer siswa baru, dan terbitkan kuitansi resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-label font-semibold hover:bg-brand-indigo-dark transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Buat Tagihan Baru</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-label font-semibold hover:bg-light-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-light-on-surface-variant">
              download
            </span>
            <span>Rekap Keuangan CSV</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            title="Refresh Data"
            disabled={loading}
            className="p-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                loading ? "animate-spin text-brand-indigo" : "text-light-on-surface-variant"
              }`}
            >
              sync
            </span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards (Live Aggregation) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Kas Masuk */}
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Total Kas Masuk (Lunas)
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-1">
              {formatRupiah(stats.totalRevenue)}
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              {stats.paidCount} Transaksi terverifikasi
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success text-on-success flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
        </div>

        {/* Card 2: Menunggu Verifikasi */}
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Menunggu Verifikasi Admin
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-1">
              {stats.pendingReviewCount} Bukti Masuk
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Total nominal: <strong className="text-brand-indigo">{formatRupiah(stats.pendingReviewAmount)}</strong>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </div>
        </div>

        {/* Card 3: Belum Dibayar */}
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Invoice Belum Dibayar
            </span>
            <p className="font-headline font-bold text-headline-sm text-warning mt-1">
              {formatRupiah(stats.unpaidAmount)}
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              {stats.unpaidCount} invoice masa tenggang
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-warning text-on-warning flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">schedule</span>
          </div>
        </div>

        {/* Card 4: Tunggakan Jatuh Tempo */}
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Tunggakan Jatuh Tempo
            </span>
            <p className="font-headline font-bold text-headline-sm text-danger mt-1">
              {formatRupiah(stats.overdueAmount)}
            </p>
            <p className="text-[11px] text-danger font-semibold mt-0.5">
              {stats.overdueCount} invoice lewat tempo
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-danger text-on-danger flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">priority_high</span>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-light-surface p-3.5 rounded-xl border border-light-outline-variant shadow-2xs">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-light-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no invoice, nama siswa, wali murid..."
            className="w-full pl-9 pr-4 py-1.5 text-body-sm rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "Semua", count: invoices.length },
            { key: "verify", label: "Perlu Verifikasi", count: stats.pendingReviewCount },
            { key: "paid", label: "Lunas", count: stats.paidCount },
            { key: "unpaid", label: "Belum Bayar", count: stats.unpaidCount },
            { key: "overdue", label: "Jatuh Tempo", count: stats.overdueCount },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-label font-semibold whitespace-nowrap transition-colors ${
                filterTab === tab.key
                  ? "bg-light-primary text-light-on-primary shadow-2xs"
                  : "border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Split Layout: Table (Col 7) & Verification Inspector Panel (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Section: Invoice List Table (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Daftar Tagihan &amp; Pembayaran Masuk
              </h2>
              <p className="text-[12px] text-light-on-surface-variant">
                Urutan data DESC: Klik baris untuk memeriksa lampiran dan kuitansi.
              </p>
            </div>
            {loading && (
              <span className="text-[12px] text-brand-indigo flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                Memperbarui...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice &amp; Siswa</th>
                  <th className="py-3 px-4">Program &amp; Wali</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] text-light-outline block mb-2">
                        receipt_long
                      </span>
                      {loading
                        ? "Memuat data invoice dari Supabase..."
                        : "Tidak ada data tagihan yang sesuai dengan filter."}
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isSelected = selectedInvoice?.id === inv.id;
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
                          <span className="font-bold text-light-primary block text-[13px]">
                            {inv.invoiceNumber}
                          </span>
                          <span className="font-semibold text-light-on-surface text-[14px]">
                            {inv.studentName}
                          </span>
                          <span className="text-[11px] text-light-on-surface-variant block">
                            {inv.studentGrade}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-light-on-surface line-clamp-1">
                            {inv.program}
                          </span>
                          <span className="text-[11px] text-light-on-surface-variant block">
                            Wali: {inv.parentName}
                          </span>
                          <span className="text-[11px] text-light-on-surface-variant block">
                            Jatuh tempo: {inv.dueDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-indigo whitespace-nowrap">
                          {inv.amount}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${inv.statusBadge}`}
                          >
                            {inv.statusLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
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
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant text-[13px]">
              Menampilkan {filteredInvoices.length} dari {invoices.length} tagihan (Supabase Live)
            </span>
          </div>
        </section>

        {/* Right Section: Inspector Panel (Col 5) */}
        {selectedInvoice ? (
          <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
            <div className="flex items-start justify-between pb-4 border-b border-light-outline-variant">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                    Pemeriksaan Tagihan
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-label-sm font-label font-bold ${selectedInvoice.statusBadge}`}
                  >
                    {selectedInvoice.statusLabel}
                  </span>
                </div>
                <p className="text-body-sm text-light-on-surface-variant mt-1">
                  {selectedInvoice.invoiceNumber} • {selectedInvoice.studentName}
                </p>
              </div>
            </div>

            {/* Invoice Snapshot Card */}
            <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant flex flex-col gap-2.5 text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Siswa &amp; Kelas</span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedInvoice.studentName} ({selectedInvoice.studentGrade})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Wali &amp; No. WhatsApp</span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedInvoice.parentName} ({selectedInvoice.parentPhone})
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Deskripsi Tagihan</span>
                <span className="font-semibold text-light-on-surface text-right max-w-[200px]">
                  {selectedInvoice.program}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Tanggal Terbit</span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedInvoice.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-light-on-surface-variant">Batas Jatuh Tempo</span>
                <span className="font-semibold text-light-on-surface text-right">
                  {selectedInvoice.dueDate}
                </span>
              </div>
              <div className="pt-2.5 border-t border-light-outline-variant flex items-center justify-between font-bold text-title-md">
                <span className="text-light-on-surface text-body-md">Total Tagihan</span>
                <span className="text-brand-indigo font-headline text-headline-sm">
                  {selectedInvoice.amount}
                </span>
              </div>
            </div>

            {/* Proof of Transfer Box */}
            {selectedInvoice.receiptFile ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label-md text-light-on-surface font-semibold">
                    Lampiran Bukti Transfer:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsImagePreviewOpen(true)}
                    className="text-[12px] text-brand-indigo hover:underline font-label font-medium inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                    <span>Lihat Dokumen</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface-container-low flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-success/10 text-success flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[24px]">receipt</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-body-sm text-light-on-surface truncate">
                      {selectedInvoice.receiptFile}
                    </p>
                    <p className="text-[11px] text-light-on-surface-variant">
                      Metode: {selectedInvoice.method}
                    </p>
                    <p className="text-[11px] text-success font-semibold">
                      ✓ Valid sesuai nominal tagihan: {selectedInvoice.amount}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-light-outline-variant bg-light-surface-soft text-center text-[12px] text-light-on-surface-variant">
                Belum ada lampiran bukti transfer yang diunggah oleh wali murid.
              </div>
            )}

            {/* If previously rejected */}
            {selectedInvoice.rejectionReason && (
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-body-sm">
                <span className="font-bold block text-[12px]">Catatan Penolakan Sebelumnya:</span>
                <span className="text-[13px]">{selectedInvoice.rejectionReason}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-light-outline-variant flex flex-col gap-3">
              {selectedInvoice.status === "verify" ? (
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isPending}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-success text-on-success hover:bg-success/90 font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors min-h-[44px] disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{isPending ? "Memproses..." : "Setujui & Terbitkan Kuitansi"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={isPending}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border border-danger text-danger hover:bg-danger/10 font-label text-label-md font-semibold transition-colors min-h-[44px]"
                  >
                    Tolak Bukti
                  </button>
                </div>
              ) : selectedInvoice.status === "paid" ? (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>Buka / Cetak Kwitansi Resmi</span>
                  </button>

                  <a
                    href={`https://wa.me/${selectedInvoice.parentPhone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(selectedInvoice.parentName)},%20pembayaran%20bimbel%20atas%20nama%20${encodeURIComponent(selectedInvoice.studentName)}%20(${selectedInvoice.invoiceNumber})%20sebesar%20${encodeURIComponent(selectedInvoice.amount)}%20telah%20LUNAS.%20Terima%20kasih.%20-ARCI%20Bimbel`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-success">chat</span>
                    <span>Kirim Konfirmasi Lunas via WA</span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${selectedInvoice.parentPhone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(selectedInvoice.parentName)},%20kami%20mengingatkan%20tagihan%20bimbel%20${encodeURIComponent(selectedInvoice.studentName)}%20(${selectedInvoice.invoiceNumber})%20sebesar%20${encodeURIComponent(selectedInvoice.amount)}%20dengan%20jatuh%20tempo%20${encodeURIComponent(selectedInvoice.dueDate)}.%20Terima%20kasih.%20-ARCI%20Bimbel`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-warning text-on-warning hover:bg-warning/90 font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Kirim Pengingat Tagihan via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isPending}
                    className="w-full py-2.5 rounded-xl border border-success text-success hover:bg-success/10 font-label text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                    <span>{isPending ? "Memproses..." : "Catat Pelunasan Tunai (Kasir)"}</span>
                  </button>
                </div>
              )}

              <p className="text-[11px] text-light-on-surface-variant text-center leading-relaxed">
                Setiap persetujuan pembayaran otomatis mencatat riwayat audit log dan memperbarui checklist onboarding siswa.
              </p>
            </div>
          </section>
        ) : (
          <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-8 text-center text-light-on-surface-variant">
            Pilih tagihan pada tabel untuk melihat detail verifikasi.
          </section>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: OFFICIAL RECEIPT (KWITANSI RESMI ARCI BIMBEL - PRINT READY)      */}
      {/* ========================================================================= */}
      {isReceiptModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-light-surface rounded-2xl max-w-2xl w-full border border-light-outline-variant shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            {/* Modal Actions Header (Hidden when printing) */}
            <div className="p-4 bg-light-surface-soft border-b border-light-outline-variant flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-[20px]">verified</span>
                <span className="font-bold text-title-md text-light-on-surface">
                  Kwitansi Resmi Pelunasan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-3.5 py-1.5 rounded-lg bg-light-primary text-light-on-primary font-label text-body-sm font-semibold hover:bg-brand-indigo-dark flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-light-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper Container */}
            <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-800 font-body">
              {/* Receipt Header */}
              <div className="flex items-start justify-between pb-6 border-b-2 border-brand-indigo">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-indigo flex items-center justify-center text-white font-headline font-bold text-headline-sm shadow-sm">
                    A
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-title-lg text-brand-indigo tracking-tight">
                      ARCI BIMBEL INDONESIA
                    </h2>
                    <p className="text-[12px] text-slate-600">
                      Pusat Bimbingan Belajar SD, SMP, SMA &amp; Intensif UTBK
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Jl. Jend. Sudirman Kav. 24, Jakarta Selatan • Hotline: (021) 555-1234
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded bg-success/15 text-success font-headline font-bold text-label-md tracking-wider border border-success/30">
                    LUNAS / PAID
                  </span>
                  <p className="font-bold text-slate-700 text-body-sm mt-1.5">
                    No. Kwitansi: KWT-{selectedInvoice.invoiceNumber.replace("INV-", "")}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    Tanggal: {selectedInvoice.date}
                  </p>
                </div>
              </div>

              {/* Receipt Body Table */}
              <div className="py-6 flex flex-col gap-3.5 text-body-sm border-b border-slate-200">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 text-slate-500 text-[13px]">Telah Diterima Dari:</span>
                  <span className="col-span-8 font-semibold text-slate-900">
                    {selectedInvoice.parentName} ({selectedInvoice.parentPhone})
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 text-slate-500 text-[13px]">Nama Siswa &amp; Kelas:</span>
                  <span className="col-span-8 font-semibold text-slate-900">
                    {selectedInvoice.studentName} — {selectedInvoice.studentGrade}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 text-slate-500 text-[13px]">Uang Sejumlah:</span>
                  <span className="col-span-8 font-bold italic text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">
                    &ldquo;{terbilang(selectedInvoice.rawAmount)}&rdquo;
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 text-slate-500 text-[13px]">Untuk Pembayaran:</span>
                  <span className="col-span-8 text-slate-800">
                    {selectedInvoice.program}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 text-slate-500 text-[13px]">Metode Pembayaran:</span>
                  <span className="col-span-8 text-slate-800">
                    {selectedInvoice.method}
                  </span>
                </div>
              </div>

              {/* Receipt Footer: Amount Box & Digital Stamp */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                    Total Nominal Terverifikasi:
                  </span>
                  <div className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-headline font-bold text-headline-sm tracking-tight inline-block shadow-sm">
                    {selectedInvoice.amount}
                  </div>
                </div>

                {/* Digital Stamp Signature */}
                <div className="flex items-center gap-4 text-right">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-success/60 flex flex-col items-center justify-center text-success rotate-[-8deg] p-1 select-none">
                    <span className="text-[9px] font-bold tracking-widest uppercase">ARCI BIMBEL</span>
                    <span className="text-[13px] font-extrabold tracking-tight">VERIFIED</span>
                    <span className="text-[8px] font-medium">KASIR RESMI</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Jakarta, {selectedInvoice.date}</p>
                    <p className="font-bold text-slate-800 text-body-sm mt-8">Bagian Keuangan ARCI</p>
                    <p className="text-[11px] text-slate-500">Petugas Administrasi &amp; Kasir</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400">
                Kwitansi ini sah dan diterbitkan secara digital oleh Sistem Informasi Manajemen ARCI Bimbel.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TOLAK BUKTI TRANSFER                                            */}
      {/* ========================================================================= */}
      {isRejectModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-light-surface rounded-2xl max-w-md w-full border border-light-outline-variant shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">cancel</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Tolak Bukti Pembayaran
                </h3>
                <p className="text-[12px] text-light-on-surface-variant">
                  Invoice {selectedInvoice.invoiceNumber} • {selectedInvoice.studentName}
                </p>
              </div>
            </div>

            <p className="text-body-sm text-light-on-surface-variant">
              Status invoice akan dikembalikan ke <strong>Belum Bayar (Unpaid)</strong> dan alasan berikut akan dikirimkan kepada wali murid.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-label font-semibold text-light-on-surface">
                Alasan Penolakan:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-lg border border-light-outline-variant text-body-sm bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-danger"
                placeholder="Contoh: Bukti transfer terpotong, nominal tidak sesuai, nama pengirim tidak jelas..."
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-semibold hover:bg-light-surface-container"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-danger text-on-danger text-body-sm font-semibold hover:bg-danger/90 disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Konfirmasi Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BUAT TAGIHAN BARU (MANUAL INVOICE)                              */}
      {/* ========================================================================= */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-light-surface rounded-2xl max-w-lg w-full border border-light-outline-variant shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-brand-indigo text-[22px]">
                  post_add
                </span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Terbitkan Tagihan Baru (Invoice)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="p-1 rounded hover:bg-black/5 text-light-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewInvoice} className="flex flex-col gap-4 text-body-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-label font-semibold text-light-on-surface">
                  Pilih Siswa: *
                </label>
                <select
                  value={newInvoiceForm.studentId}
                  onChange={(e) =>
                    setNewInvoiceForm((prev) => ({ ...prev, studentId: e.target.value }))
                  }
                  required
                  className="w-full p-2.5 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                >
                  {studentOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} ({opt.grade}) — Wali: {opt.parentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-label font-semibold text-light-on-surface">
                    Periode Tagihan: *
                  </label>
                  <input
                    type="text"
                    value={newInvoiceForm.monthPeriod}
                    onChange={(e) =>
                      setNewInvoiceForm((prev) => ({ ...prev, monthPeriod: e.target.value }))
                    }
                    placeholder="Contoh: SPP Desember 2026"
                    required
                    className="w-full p-2.5 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-label font-semibold text-light-on-surface">
                    Nominal Tagihan (Rp): *
                  </label>
                  <input
                    type="number"
                    value={newInvoiceForm.amount}
                    onChange={(e) =>
                      setNewInvoiceForm((prev) => ({ ...prev, amount: Number(e.target.value) }))
                    }
                    step={50000}
                    required
                    className="w-full p-2.5 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-label font-semibold text-light-on-surface">
                  Uraian / Deskripsi Tagihan:
                </label>
                <input
                  type="text"
                  value={newInvoiceForm.description}
                  onChange={(e) =>
                    setNewInvoiceForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Contoh: SPP Reguler Bulan Desember & Modul Cetak"
                  className="w-full p-2.5 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-label font-semibold text-light-on-surface">
                  Tanggal Batas Pembayaran (Jatuh Tempo): *
                </label>
                <input
                  type="date"
                  value={newInvoiceForm.dueDate}
                  onChange={(e) =>
                    setNewInvoiceForm((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  required
                  className="w-full p-2.5 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-light-on-surface text-body-sm font-semibold hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-semibold hover:bg-brand-indigo-dark disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>{isPending ? "Menerbitkan..." : "Terbitkan Invoice"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PRATINJAU BUKTI TRANSFER                                        */}
      {/* ========================================================================= */}
      {isImagePreviewOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-light-surface rounded-2xl max-w-lg w-full border border-light-outline-variant shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Lampiran Bukti Transfer
                </h3>
                <p className="text-[12px] text-light-on-surface-variant">
                  {selectedInvoice.receiptFile}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImagePreviewOpen(false)}
                className="p-1 rounded hover:bg-black/5 text-light-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="w-full aspect-[4/3] rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center border border-slate-700">
              <span className="material-symbols-outlined text-[54px] text-success mb-2">
                receipt
              </span>
              <p className="font-bold text-body-md text-white">
                {selectedInvoice.receiptFile}
              </p>
              <p className="text-[12px] text-slate-300 mt-1">
                Metode: {selectedInvoice.method} • Jumlah: {selectedInvoice.amount}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Diunggah: {selectedInvoice.date} • Rekening Tujuan: Bank Central Asia (BCA) No. Rek 8820-1234-5678 a.n ARCI Bimbel
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImagePreviewOpen(false)}
                className="px-4 py-2 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-semibold hover:bg-brand-indigo-dark"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
