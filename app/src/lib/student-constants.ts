export type StudentStatus = "active" | "graduated" | "inactive";

export interface StudentItem {
  id: string;
  nisn: string;
  name: string;
  level: "SD" | "SMP" | "SMA";
  school: string;
  grade: string;
  targetUniversity?: string;
  targetMajor?: string;
  parent: string;
  parentPhone: string;
  parentAddress?: string;
  className: string;
  branch: string;
  attendance: string;
  sppStatus: "Lunas" | "Menunggu" | "Tertunda";
  sppBadge: string;
  status: StudentStatus;
  statusLabel: string;
  statusBadge: string;
  createdAt: string;
}

export interface StudentsListResult {
  success: boolean;
  students: StudentItem[];
  stats: {
    total: number;
    active: number;
    graduated: number;
    inactive: number;
    sdCount: number;
    smpCount: number;
    smaCount: number;
  };
  message?: string;
}

export const STUDENT_STATUS_CONFIG: Record<
  StudentStatus,
  { label: string; badge: string; icon: string; description: string }
> = {
  active: {
    label: "Siswa Aktif",
    badge: "bg-success/15 text-success border border-success/30",
    icon: "check_circle",
    description: "Siswa aktif mengikuti program bimbingan belajar dan jadwal kelas.",
  },
  graduated: {
    label: "Lulus",
    badge: "bg-blue-100 text-blue-800 border border-blue-300",
    icon: "school",
    description: "Siswa telah menyelesaikan seluruh program / lulus UTBK/SNBT.",
  },
  inactive: {
    label: "Tidak Selesai",
    badge: "bg-danger/10 text-danger border border-danger/25",
    icon: "cancel",
    description: "Siswa tidak menyelesaikan program bimbingan / mengundurkan diri.",
  },
};
