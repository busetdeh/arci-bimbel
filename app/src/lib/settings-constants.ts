/**
 * Pure constants, interfaces, and helpers for Settings & Staff RBAC Module
 * Kept separate from "use server" actions to comply with Next.js export restrictions.
 */

export type StaffRoleType = "super_admin" | "admin_akademik" | "admin_keuangan" | "tutor";

export interface StaffUserItem {
  id: string; // UUID
  name: string;
  email: string;
  phone?: string | null;
  role: StaffRoleType;
  roleLabel: string;
  roleBadge: string;
  status: "Aktif" | "Nonaktif";
  createdAt: string;
  lastLogin: string;
  permissions: {
    viewFinance: boolean;
    manageClasses: boolean;
    verifyAdmissions: boolean;
    inputAttendance: boolean;
    manageSettings: boolean;
  };
}

export interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: any;
  createdAt: string;
  formattedDate: string;
}

export interface SettingsDataResult {
  success: boolean;
  staffList: StaffUserItem[];
  auditLogs: AuditLogItem[];
  message?: string;
}

export interface CreateStaffPayload {
  email: string;
  fullName: string;
  role: StaffRoleType;
  phone?: string;
  password?: string;
}

export const STAFF_ROLE_CONFIG: Record<
  StaffRoleType,
  { label: string; badge: string; description: string }
> = {
  super_admin: {
    label: "Super Admin",
    badge: "bg-light-primary text-light-on-primary",
    description: "Akses penuh ke seluruh sistem, audit log, konfigurasi staf, dan data sensitif",
  },
  admin_akademik: {
    label: "Admin Akademik",
    badge: "bg-purple-100 text-purple-800 border border-purple-200",
    description: "Mengelola pendaftaran siswa, rombel kelas, jadwal sesi, dan kurikulum",
  },
  admin_keuangan: {
    label: "Admin Keuangan",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    description: "Verifikasi bukti transfer, tagihan SPP, kuitansi pelunasan, dan rekap kas",
  },
  tutor: {
    label: "Tutor Pengajar",
    badge: "bg-accent text-on-accent",
    description: "Input presensi kehadiran siswa, catatan materi sesi belajar, dan penilaian",
  },
};

export const DEFAULT_PERMISSIONS: Record<StaffRoleType, StaffUserItem["permissions"]> = {
  super_admin: {
    viewFinance: true,
    manageClasses: true,
    verifyAdmissions: true,
    inputAttendance: true,
    manageSettings: true,
  },
  admin_akademik: {
    viewFinance: false,
    manageClasses: true,
    verifyAdmissions: true,
    inputAttendance: true,
    manageSettings: false,
  },
  admin_keuangan: {
    viewFinance: true,
    manageClasses: false,
    verifyAdmissions: true,
    inputAttendance: false,
    manageSettings: false,
  },
  tutor: {
    viewFinance: false,
    manageClasses: false,
    verifyAdmissions: false,
    inputAttendance: true,
    manageSettings: false,
  },
};
