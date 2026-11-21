/**
 * Pure constants, interfaces, and helpers for Classes & Academic Management Module
 * Kept separate from "use server" actions to comply with Next.js export restrictions.
 */

export type ClassGradeFilter = "all" | "sd" | "smp" | "sma" | "utbk";

export type ClassStatusType = "active" | "upcoming" | "full" | "archived";

export interface ClassStudentItem {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  nisn: string;
  grade: string;
  schoolOrigin: string;
  enrollmentStatus: string;
  enrolledAt: string;
}

export interface ClassroomItem {
  id: string; // UUID
  code: string;
  name: string;
  programId: string;
  programName: string;
  programCode: string;
  level: "SD" | "SMP" | "SMA" | "UTBK" | "Privat";
  levelFilter: "sd" | "smp" | "sma" | "utbk";
  levelLabel: string;
  levelBadge: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  branchCity: string;
  tutorId: string | null;
  tutorName: string;
  tutorPhone?: string | null;
  room: string;
  capacity: number;
  enrolled: number;
  occupancyPercent: number;
  scheduleDays: string;
  scheduleTime: string;
  status: ClassStatusType;
  statusLabel: string;
  statusBadge: string;
  students: ClassStudentItem[];
  createdAt: string;
}

export interface ClassAcademicStats {
  totalClasses: number;
  totalStudentsEnrolled: number;
  totalCapacity: number;
  avgOccupancyPercent: number;
  totalFullClasses: number;
  scheduleConflictsCount: number;
}

export interface ProgramOption {
  id: string;
  code: string;
  name: string;
  level: string;
}

export interface BranchOption {
  id: string;
  code: string;
  name: string;
  city: string;
}

export interface TutorOption {
  id: string;
  name: string;
  role: string;
  phone?: string | null;
}

export interface ClassesDataResult {
  success: boolean;
  classes: ClassroomItem[];
  stats: ClassAcademicStats;
  programOptions: ProgramOption[];
  branchOptions: BranchOption[];
  tutorOptions: TutorOption[];
  message?: string;
}

export interface CreateClassPayload {
  name: string;
  code?: string;
  programId: string;
  branchId: string;
  tutorId?: string | null;
  room: string;
  capacity: number;
  scheduleDays: string;
  scheduleTime: string;
  status?: ClassStatusType;
}

export interface UpdateClassPayload {
  id: string;
  name: string;
  programId: string;
  branchId: string;
  tutorId?: string | null;
  room: string;
  capacity: number;
  scheduleDays: string;
  scheduleTime: string;
  status: ClassStatusType;
}

export const CLASS_STATUS_CONFIG: Record<
  ClassStatusType,
  { label: string; badge: string; description: string }
> = {
  active: {
    label: "Berjalan",
    badge: "bg-success text-on-success",
    description: "Kelas aktif berlangsung sesuai jadwal kalender sesi",
  },
  upcoming: {
    label: "Segera Mulai",
    badge: "bg-warning text-on-warning",
    description: "Pendaftaran dibuka, sesi pembelajaran perdana segera dimulai",
  },
  full: {
    label: "Penuh",
    badge: "bg-brand-indigo text-light-on-primary",
    description: "Kapasitas kuota kursi telah terpenuhi maksimal",
  },
  archived: {
    label: "Diarsipkan",
    badge: "bg-light-outline-variant text-light-on-surface-variant",
    description: "Program telah selesai atau rombel dipindahkan",
  },
};

export const GRADE_BADGES: Record<
  string,
  { filter: "sd" | "smp" | "sma" | "utbk"; label: string; badge: string }
> = {
  SD: {
    filter: "sd",
    label: "SD (Kelas 4–6)",
    badge: "bg-success/15 text-success border border-success/30",
  },
  SMP: {
    filter: "smp",
    label: "SMP (Kelas 7–9)",
    badge: "bg-light-primary-container text-light-primary border border-light-primary/30",
  },
  SMA: {
    filter: "sma",
    label: "SMA (Kelas 10–12)",
    badge: "bg-accent/20 text-on-accent border border-accent/40",
  },
  UTBK: {
    filter: "utbk",
    label: "Intensif UTBK",
    badge: "bg-accent text-on-accent",
  },
  Privat: {
    filter: "sma",
    label: "Privat 1-on-1",
    badge: "bg-light-surface-container text-light-on-surface border border-light-outline",
  },
};
