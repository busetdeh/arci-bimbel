export type AttendanceStatus = "hadir" | "izin" | "sakit" | "alpa";

export interface StudentAttendanceItem {
  id: string; // student_id
  name: string;
  nisn: string;
  school: string;
  status: AttendanceStatus;
  checkInTime?: string;
  notes?: string;
}

export interface AttendanceSessionData {
  id: string;
  classId: string;
  className: string;
  classCode: string;
  room: string;
  timeSlot: string;
  day: string;
  topic: string;
  tutorName: string;
  tutorNotes?: string;
  isLive: boolean;
  isSubmitted: boolean;
  submittedAt?: string;
  roster: StudentAttendanceItem[];
}

export const ATTENDANCE_STATUS_META: Record<
  AttendanceStatus,
  {
    label: string;
    shortLabel: string;
    activeClass: string;
    badgeClass: string;
    icon: string;
  }
> = {
  hadir: {
    label: "Hadir",
    shortLabel: "H",
    activeClass: "bg-success text-on-success border-success shadow-xs",
    badgeClass: "bg-success/15 text-success border border-success/30",
    icon: "check_circle",
  },
  izin: {
    label: "Izin",
    shortLabel: "I",
    activeClass: "bg-warning text-on-warning border-warning shadow-xs",
    badgeClass: "bg-warning/15 text-warning border border-warning/30",
    icon: "assignment",
  },
  sakit: {
    label: "Sakit",
    shortLabel: "S",
    activeClass: "bg-blue-600 text-white border-blue-600 shadow-xs",
    badgeClass: "bg-blue-100 text-blue-800 border border-blue-300",
    icon: "medical_services",
  },
  alpa: {
    label: "Alpa",
    shortLabel: "A",
    activeClass: "bg-danger text-on-danger border-danger shadow-xs",
    badgeClass: "bg-danger/10 text-danger border border-danger/25",
    icon: "cancel",
  },
};

export const QUICK_REASON_PRESETS = [
  "Izin (Lomba Sekolah / OSN)",
  "Izin (Acara Keluarga)",
  "Izin (Kegiatan Ekskul)",
  "Sakit (Demam / Flu)",
  "Sakit (Surat Dokter Terlampir)",
  "Sakit (Rawat Jalan)",
];
