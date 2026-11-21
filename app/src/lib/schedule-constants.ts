/**
 * Pure constants, interfaces, and helpers for Schedule Calendar Module
 * Kept separate from "use server" actions to comply with Next.js export restrictions.
 */

export type DayKey = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";

export type SessionStatusType = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface CalendarSessionItem {
  id: string; // attendance_sessions UUID
  classId: string;
  classCode: string;
  className: string;
  programName: string;
  programLevel: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  room: string;
  tutorId: string | null;
  tutorName: string;
  sessionDate: string; // YYYY-MM-DD
  dayKey: DayKey;
  dayLabel: string;
  formattedDate: string; // e.g. "17 Nov"
  timeSlot: string; // e.g. "16:00 - 18:00"
  topic: string;
  status: SessionStatusType;
  statusLabel: string;
  statusBadge: string;
  colorScheme: "blue" | "emerald" | "purple" | "amber";
  enrolledStudentsCount: number;
  attendedStudentsCount: number;
  attendanceInfo: string;
  submittedAt?: string | null;
}

export interface DayColumnData {
  dayKey: DayKey;
  dayName: string;
  dateStr: string;
  formattedDate: string;
  isToday: boolean;
  sessions: CalendarSessionItem[];
}

export interface ScheduleCalendarStats {
  totalSessions: number;
  completedSessions: number;
  inProgressSessions: number;
  scheduledSessions: number;
  totalHoursTaught: number;
}

export interface ScheduleClassOption {
  id: string;
  code: string;
  name: string;
  room: string;
  tutorId: string | null;
  tutorName: string;
  branchId: string;
  branchName: string;
  scheduleTime: string;
}

export interface ScheduleBranchOption {
  id: string;
  code: string;
  name: string;
}

export interface ScheduleTutorOption {
  id: string;
  name: string;
}

export interface ScheduleDataResult {
  success: boolean;
  sessions: CalendarSessionItem[];
  days: DayColumnData[];
  stats: ScheduleCalendarStats;
  classOptions: ScheduleClassOption[];
  branchOptions: ScheduleBranchOption[];
  tutorOptions: ScheduleTutorOption[];
  message?: string;
}

export interface CreateSessionPayload {
  classId: string;
  sessionDate: string;
  timeSlot: string;
  topic?: string;
  tutorId?: string;
}

export const SESSION_STATUS_CONFIG: Record<
  SessionStatusType,
  { label: string; badge: string; colorScheme: "blue" | "emerald" | "purple" | "amber" }
> = {
  completed: {
    label: "Selesai",
    badge: "bg-light-primary-container text-light-primary",
    colorScheme: "blue",
  },
  in_progress: {
    label: "Sedang Berjalan",
    badge: "bg-success text-on-success",
    colorScheme: "emerald",
  },
  scheduled: {
    label: "Terjadwal",
    badge: "bg-warning/15 text-warning border border-warning/30",
    colorScheme: "amber",
  },
  cancelled: {
    label: "Dibatalkan",
    badge: "bg-danger/15 text-danger",
    colorScheme: "amber",
  },
};

export const INDO_DAYS = [
  { key: "senin" as DayKey, name: "Senin", dayIndex: 1 },
  { key: "selasa" as DayKey, name: "Selasa", dayIndex: 2 },
  { key: "rabu" as DayKey, name: "Rabu", dayIndex: 3 },
  { key: "kamis" as DayKey, name: "Kamis", dayIndex: 4 },
  { key: "jumat" as DayKey, name: "Jumat", dayIndex: 5 },
  { key: "sabtu" as DayKey, name: "Sabtu", dayIndex: 6 },
  { key: "minggu" as DayKey, name: "Minggu", dayIndex: 0 },
];
