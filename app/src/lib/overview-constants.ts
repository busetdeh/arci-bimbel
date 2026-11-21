/**
 * Pure constants, interfaces, and helpers for Dashboard Overview
 * Kept separate from "use server" actions to comply with Next.js export restrictions.
 */

export interface UrgentTaskItem {
  id: string;
  category: "lead" | "admission" | "finance" | "attendance";
  initials: string;
  title: string;
  desc: string;
  statusBadge: string;
  statusColor: string;
  actionType: "whatsapp" | "link";
  actionLabel: string;
  actionUrl: string;
}

export interface DashboardClassSessionItem {
  id: string;
  code: string;
  name: string;
  room: string;
  scheduleDays: string;
  scheduleTime: string;
  tutorName: string;
  enrolled: number;
  capacity: number;
  occupancyPercent: number;
  statusLabel: string;
  statusBadge: string;
}

export interface DashboardOverviewStats {
  newLeadsCount: number;
  totalLeadsCount: number;
  pendingAdmissionsCount: number;
  activeStudentsCount: number;
  totalClassesCount: number;
  occupancyPercent: number;
  pendingFinanceCount: number;
  pendingFinanceAmount: number;
  overdueInvoicesCount: number;
  overdueInvoicesAmount: number;
  totalRevenue: number;
}

export interface DashboardOverviewResult {
  success: boolean;
  stats: DashboardOverviewStats;
  urgentTasks: UrgentTaskItem[];
  classSessions: DashboardClassSessionItem[];
  message?: string;
}

/**
 * Format number to Indonesian Rupiah (e.g. 1500000 -> "Rp1.500.000")
 */
export function formatRupiahShort(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp${(amount / 1000000000).toFixed(1)} Miliar`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, "");
}
