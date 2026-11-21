/**
 * Pure constants, interfaces, and helpers for Reports & Analytics Module
 * Kept separate from "use server" actions to comply with Next.js export restrictions.
 */

export interface ProgramPerformanceReport {
  programId: string;
  programName: string;
  programLevel: string;
  leadsCount: number;
  enrolledCount: number;
  conversionRate: string;
  conversionPercent: number;
  revenue: string;
  rawRevenue: number;
  satisfactionRating: string;
  activeClassesCount: number;
}

export interface FunnelStepData {
  step: string;
  count: number;
  percent: string;
  color: string;
}

export interface ExecutiveReportStats {
  totalRegistrations: number;
  conversionRatePercent: number;
  occupancyPercent: number;
  totalSeatsFilled: number;
  totalSeatsCapacity: number;
  totalRevenue: number;
  totalRevenueFormatted: string;
  averageAttendancePercent: number;
}

export interface ReportsAnalyticsResult {
  success: boolean;
  stats: ExecutiveReportStats;
  funnelSteps: FunnelStepData[];
  programReports: ProgramPerformanceReport[];
  message?: string;
}

export function formatRupiahReport(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, "");
}
