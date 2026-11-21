/**
 * Pure constants, interfaces, and helpers for Finance & Billing Module
 * Kept separate from "use server" actions to comply with Next.js export restrictions.
 */

export type InvoiceStatusType = "verify" | "paid" | "overdue" | "unpaid" | "cancelled";

export interface FinanceInvoice {
  id: string; // UUID
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  program: string;
  description: string;
  monthPeriod: string;
  amount: string; // Formatted "Rp1.450.000"
  rawAmount: number;
  date: string; // Formatted created date
  rawCreatedAt: string;
  dueDate: string; // Formatted due date
  rawDueDate: string;
  status: InvoiceStatusType;
  statusLabel: string;
  statusBadge: string;
  method: string;
  receiptFile?: string;
  paymentId?: string;
  paymentStatus?: "pending" | "approved" | "rejected";
  verifiedAt?: string | null;
  rejectionReason?: string | null;
}

export interface FinanceStats {
  totalRevenue: number;
  paidCount: number;
  pendingReviewCount: number;
  pendingReviewAmount: number;
  unpaidCount: number;
  unpaidAmount: number;
  overdueCount: number;
  overdueAmount: number;
}

export interface FinanceDataResult {
  success: boolean;
  invoices: FinanceInvoice[];
  stats: FinanceStats;
  message?: string;
}

export interface StudentOption {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
}

export const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatusType,
  { label: string; badge: string; description: string }
> = {
  verify: {
    label: "Menunggu Review",
    badge: "bg-accent text-on-accent",
    description: "Bukti transfer telah diunggah dan menunggu persetujuan staf keuangan",
  },
  paid: {
    label: "Lunas",
    badge: "bg-success/15 text-success",
    description: "Pembayaran telah diverifikasi dan kuitansi resmi telah diterbitkan",
  },
  overdue: {
    label: "Jatuh Tempo",
    badge: "bg-danger/15 text-danger",
    description: "Telah melewati batas waktu pembayaran, perlu tindak lanjut",
  },
  unpaid: {
    label: "Belum Bayar",
    badge: "bg-warning/15 text-warning",
    description: "Tagihan telah terbit dan masih dalam masa tenggang pembayaran",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "bg-light-outline-variant text-light-on-surface-variant",
    description: "Tagihan dibatalkan oleh pihak manajemen",
  },
};

/**
 * Format number to Indonesian Rupiah (e.g. 1500000 -> "Rp1.500.000")
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, "");
}

/**
 * Konversi angka ke kalimat terbilang Rupiah untuk Kuitansi Resmi
 */
export function terbilang(nominal: number): string {
  const bilangan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  function hitung(n: number): string {
    if (n < 12) return bilangan[n];
    if (n < 20) return hitung(n - 10) + " Belas";
    if (n < 100) return hitung(Math.floor(n / 10)) + " Puluh " + hitung(n % 10);
    if (n < 200) return "Seratus " + hitung(n - 100);
    if (n < 1000) return hitung(Math.floor(n / 100)) + " Ratus " + hitung(n % 100);
    if (n < 2000) return "Seribu " + hitung(n - 1000);
    if (n < 1000000) return hitung(Math.floor(n / 1000)) + " Ribu " + hitung(n % 1000);
    if (n < 1000000000) return hitung(Math.floor(n / 1000000)) + " Juta " + hitung(n % 1000000);
    if (n < 1000000000000) return hitung(Math.floor(n / 1000000000)) + " Miliar " + hitung(n % 1000000000);
    return "";
  }

  const hasil = hitung(Math.floor(Math.abs(nominal))).replace(/\s+/g, " ").trim();
  return (hasil ? hasil : "Nol") + " Rupiah";
}
