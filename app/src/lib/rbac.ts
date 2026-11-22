export type StaffRole =
  | "super_admin"
  | "admin_akademik"
  | "admin_keuangan"
  | "tutor";

export interface RoleConfig {
  role: StaffRole;
  label: string;
  shortLabel: string;
  badgeClass: string;
  description: string;
  defaultPath: string;
}

export const ROLE_CONFIGS: Record<StaffRole, RoleConfig> = {
  super_admin: {
    role: "super_admin",
    label: "Super Admin Operasional",
    shortLabel: "Super Admin",
    badgeClass: "bg-brand-indigo text-white",
    description: "Akses penuh ke seluruh modul, sistem keuangan, pendaftaran, dan konfigurasi RBAC.",
    defaultPath: "/dashboard",
  },
  admin_akademik: {
    role: "admin_akademik",
    label: "Koordinator Akademik & Roster",
    shortLabel: "Akademik",
    badgeClass: "bg-blue-100 text-blue-900 border border-blue-200",
    description: "Mengelola pendaftaran masuk, rombel kelas, jadwal pengajar, presensi, dan data siswa.",
    defaultPath: "/dashboard/admissions",
  },
  admin_keuangan: {
    role: "admin_keuangan",
    label: "Staf Keuangan & Pembayaran",
    shortLabel: "Keuangan",
    badgeClass: "bg-emerald-100 text-emerald-900 border border-emerald-200",
    description: "Memantau tagihan SPP, verifikasi bukti bayar kas, dan rekapitulasi invoice pendaftaran.",
    defaultPath: "/dashboard/finance",
  },
  tutor: {
    role: "tutor",
    label: "Tutor & Pengajar",
    shortLabel: "Tutor",
    badgeClass: "bg-amber-100 text-amber-900 border border-amber-200",
    description: "Melihat jadwal mengajar, mengisi presensi sesi kelas, dan memantau progres belajar siswa.",
    defaultPath: "/tutor",
  },
};

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  allowedRoles: StaffRole[];
  description: string;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Ringkasan",
    icon: "dashboard",
    allowedRoles: ["super_admin", "admin_akademik", "admin_keuangan", "tutor"],
    description: "Statistik operasional & ikhtisar harian",
  },
  {
    href: "/dashboard/leads",
    label: "Lead & Pipeline",
    icon: "person_search",
    badge: "8",
    allowedRoles: ["super_admin", "admin_akademik"],
    description: "Manajemen prospek & CRM calon siswa",
  },
  {
    href: "/dashboard/admissions",
    label: "Pendaftaran",
    icon: "how_to_reg",
    badge: "4",
    allowedRoles: ["super_admin", "admin_akademik", "admin_keuangan"],
    description: "Verifikasi berkas formulir & SPP pendaftaran",
  },
  {
    href: "/dashboard/students",
    label: "Siswa & Wali",
    icon: "school",
    allowedRoles: ["super_admin", "admin_akademik", "admin_keuangan", "tutor"],
    description: "Database biodata siswa & kontak wali",
  },
  {
    href: "/dashboard/classes",
    label: "Program & Kelas",
    icon: "class",
    allowedRoles: ["super_admin", "admin_akademik", "tutor"],
    description: "Rombel kelas & alokasi ruang belajar",
  },
  {
    href: "/dashboard/schedule",
    label: "Jadwal Sesi",
    icon: "calendar_month",
    allowedRoles: ["super_admin", "admin_akademik", "tutor"],
    description: "Kalender sesi pembelajaran mingguan",
  },
  {
    href: "/dashboard/attendance",
    label: "Presensi Siswa",
    icon: "fact_check",
    allowedRoles: ["super_admin", "admin_akademik", "tutor"],
    description: "Pencatatan absensi & rekap kehadiran",
  },
  {
    href: "/dashboard/materials",
    label: "Materi & Tugas",
    icon: "folder_open",
    allowedRoles: ["super_admin", "admin_akademik", "tutor"],
    description: "Modul digital, bank soal, dan tugas siswa",
  },
  {
    href: "/dashboard/finance",
    label: "Tagihan & Kas",
    icon: "payments",
    badge: "5 Baru",
    allowedRoles: ["super_admin", "admin_keuangan"],
    description: "Manajemen invoice SPP & verifikasi bukti bayar",
  },
  {
    href: "/dashboard/communications",
    label: "Komunikasi & Broadcast",
    icon: "campaign",
    allowedRoles: ["super_admin", "admin_akademik"],
    description: "Pengumuman siaran WhatsApp & pesan massal",
  },
  {
    href: "/dashboard/reports",
    label: "Laporan KPI",
    icon: "analytics",
    allowedRoles: ["super_admin", "admin_akademik", "admin_keuangan"],
    description: "Analisis performa akademik & metrik keuangan",
  },
  {
    href: "/dashboard/cms",
    label: "Konten Website",
    icon: "article",
    allowedRoles: ["super_admin", "admin_akademik"],
    description: "Pengelolaan artikel, promo & informasi publik",
  },
  {
    href: "/dashboard/settings",
    label: "Pengaturan & Role",
    icon: "manage_accounts",
    allowedRoles: ["super_admin"],
    description: "Konfigurasi akun staf & matriks izin RBAC",
  },
];

/**
 * Filter menu items based on staff role
 */
export function getFilteredNavItems(role: StaffRole): DashboardNavItem[] {
  return DASHBOARD_NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));
}

/**
 * Check if a given route is permitted for the staff role
 */
export function isRouteAllowed(role: StaffRole, pathname: string): boolean {
  if (role === "super_admin") return true;

  // Root dashboard overview and personal profile are always accessible to all staff roles
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/profile")) return true;

  // Check matching nav items
  const matchedItem = DASHBOARD_NAV_ITEMS.find((item) => {
    if (item.href === "/dashboard") return false;
    return pathname.startsWith(item.href);
  });

  if (!matchedItem) {
    // If not in nav items, allow access if part of /dashboard
    return true;
  }

  return matchedItem.allowedRoles.includes(role);
}
