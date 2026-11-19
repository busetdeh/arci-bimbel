"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStaffSession, logoutStaffAction } from "@/app/actions/auth";

const navItems = [
  { href: "/dashboard", label: "Ringkasan", icon: "dashboard" },
  { href: "/dashboard/leads", label: "Lead & Pipeline", icon: "person_search", badge: "8" },
  { href: "/dashboard/admissions", label: "Pendaftaran", icon: "how_to_reg", badge: "3" },
  { href: "/dashboard/students", label: "Siswa & Wali", icon: "school" },
  { href: "/dashboard/classes", label: "Program & Kelas", icon: "class" },
  { href: "/dashboard/schedule", label: "Jadwal Sesi", icon: "calendar_month" },
  { href: "/dashboard/attendance", label: "Presensi Siswa", icon: "fact_check" },
  { href: "/dashboard/finance", label: "Tagihan & Kas", icon: "payments", badge: "5 Baru" },
  { href: "/dashboard/communications", label: "Komunikasi & Broadcast", icon: "campaign" },
  { href: "/dashboard/settings", label: "Pengaturan & Role", icon: "manage_accounts" },
  { href: "/dashboard/reports", label: "Laporan KPI", icon: "analytics" },
  { href: "/dashboard/cms", label: "Konten Website", icon: "article" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<{
    name: string;
    roleLabel: string;
    initials: string;
  }>({
    name: "Ahmad Dani, M.Pd.",
    roleLabel: "Super Admin Operasional",
    initials: "AD",
  });
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "warning" | "info" }>({
    show: false,
    msg: "",
    type: "info",
  });

  useEffect(() => {
    async function loadStaff() {
      const session = await getStaffSession();
      if (session?.profile) {
        const p = session.profile;
        const roleMap: Record<string, string> = {
          super_admin: "Super Admin Operasional",
          admin_akademik: "Koordinator Akademik & Roster",
          admin_keuangan: "Staf Keuangan & Pembayaran",
          tutor: "Tutor & Pengajar",
        };
        const initials = p.full_name
          .split(" ")
          .map((w: string) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        setCurrentStaff({
          name: p.full_name,
          roleLabel: roleMap[p.role] || "Staf ARCI Bimbel",
          initials: initials || "ST",
        });
      }
    }
    loadStaff();
  }, []);

  const showToast = (msg: string, type: "success" | "warning" | "info" = "info") => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast({ show: false, msg: "", type: "info" });
    }, 4000);
  };

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLeadModalOpen(false);
    showToast("Data calon siswa berhasil disimpan ke sistem CRM!", "success");
  };

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body antialiased min-h-screen flex flex-col lg:flex-row pb-safe">
      {/* Mobile Backdrop Overlay for Drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Navigation (Desktop Fixed & Mobile Slide-Out Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-light-surface border-r border-light-outline-variant flex flex-col justify-between shrink-0 transition-transform duration-200 lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Identity Header */}
          <div className="h-16 lg:h-20 px-5 sm:px-6 flex items-center justify-between border-b border-light-outline-variant shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-headline-sm shadow-sm group-hover:bg-brand-indigo-dark transition-colors">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-title-md tracking-tight text-brand-indigo">
                  ARCI Bimbel
                </span>
                <span className="text-[11px] text-light-on-surface-variant font-label">
                  Dashboard Operasional
                </span>
              </div>
            </Link>

            {/* Mobile Drawer Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              aria-label="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 sm:p-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-label text-body-md transition-colors group ${
                    isActive
                      ? "bg-light-primary text-light-on-primary shadow-xs font-semibold"
                      : "text-light-on-surface hover:bg-light-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive
                          ? "text-light-on-primary"
                          : "text-light-on-surface-variant group-hover:text-brand-indigo"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-label font-bold shadow-2xs ${
                        isActive
                          ? "bg-accent text-on-accent"
                          : "bg-accent text-on-accent"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Admin Profile Block with Dropdown Menu */}
        <div className="p-4 border-t border-light-outline-variant relative">
          <div
            className="flex items-center justify-between p-2 rounded-xl hover:bg-light-surface-container transition-colors cursor-pointer group"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center font-bold text-label-md shadow-xs">
                {currentStaff.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm font-semibold text-light-on-surface leading-tight truncate max-w-[130px]">
                  {currentStaff.name}
                </span>
                <span className="text-[11px] text-light-on-surface-variant font-label leading-tight truncate max-w-[130px]">
                  {currentStaff.roleLabel}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-light-outline group-hover:text-light-on-surface">
              more_vert
            </span>
          </div>

          {/* Quick Profile Popup Menu */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-light-surface rounded-xl border border-light-outline-variant shadow-lg py-1.5 z-50 text-body-sm">
              <Link
                href="/"
                className="flex items-center gap-2 px-3.5 py-2 hover:bg-light-surface-container text-light-on-surface"
              >
                <span className="material-symbols-outlined text-[17px] text-light-primary">
                  open_in_new
                </span>
                <span>Buka Website Publik</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logoutStaffAction();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-danger/10 text-danger border-t border-light-outline-variant/50 text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">logout</span>
                <span>Keluar Sesi (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Operational Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Bar (Responsive Header) */}
        <header className="h-16 lg:h-20 bg-light-surface border-b border-light-outline-variant px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Mobile Hamburger Button & Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg border border-light-outline flex items-center justify-center text-light-on-surface hover:bg-light-surface-container shrink-0"
              aria-label="Buka Menu Navigasi"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-light-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="search"
                placeholder="Cari lead, siswa, invoice..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-outline text-body-sm sm:text-body-md focus:border-light-primary focus:ring-1 focus:ring-light-primary bg-light-surface text-light-on-surface placeholder:text-light-on-surface-variant transition-colors"
              />
            </div>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Notification Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="Notifikasi"
                className="relative w-10 h-10 rounded-lg border border-light-outline flex items-center justify-center text-light-on-surface hover:bg-light-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger ring-2 ring-light-surface"></span>
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-light-surface rounded-xl border border-light-outline-variant shadow-xl p-3 z-50 text-body-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant mb-2">
                    <span className="font-bold text-light-on-surface">
                      Notifikasi Sistem
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] text-light-primary font-semibold hover:underline"
                    >
                      Tandai Dibaca
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-light-surface-container-low text-[12px]">
                      <strong className="text-brand-indigo block">
                        Lead Baru Masuk
                      </strong>
                      <span>Bunda Hesty mengisi form konsultasi Cabang Sudirman.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-light-surface-container-low text-[12px]">
                      <strong className="text-success block">
                        Pembayaran Diterima
                      </strong>
                      <span>Pak Hermawan mengunggah bukti bayar UTBK.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add Lead Button */}
            <button
              type="button"
              onClick={() => setIsLeadModalOpen(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm sm:text-body-md shadow-xs transition-all whitespace-nowrap active:scale-95 font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Tambah Lead</span>
            </button>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toast.show && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-xl border text-body-sm flex items-center justify-between gap-3 shadow-xs bg-light-surface border-light-outline-variant">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[19px] ${
                  toast.type === "success"
                    ? "text-success"
                    : toast.type === "warning"
                    ? "text-warning"
                    : "text-light-primary"
                }`}
              >
                {toast.type === "success"
                  ? "check_circle"
                  : toast.type === "warning"
                  ? "warning"
                  : "info"}
              </span>
              <span className="font-medium text-light-on-surface">{toast.msg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast({ show: false, msg: "", type: "info" })}
              className="p-1 rounded hover:bg-black/5 text-light-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Page Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8 flex-1">
          {children}
        </main>
      </div>

      {/* Modal: Tambah Lead Baru */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-light-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-light-outline-variant flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">
                    person_add
                  </span>
                </div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Tambah Data Lead Calon Siswa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeadModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddLead} className="flex flex-col gap-4">
              <div>
                <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1">
                  Nama Calon Siswa
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dimas Setiawan"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-md focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1">
                    Nama Orang Tua
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibu Rina"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-md focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </div>
                <div>
                  <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-md focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1">
                    Pilihan Jenjang
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-md focus:border-light-primary focus:ring-1 focus:ring-light-primary bg-light-surface">
                    <option>SD Kelas 4-6</option>
                    <option defaultValue="smp">SMP Kelas 7-9</option>
                    <option>SMA Kelas 10-12</option>
                    <option>Persiapan UTBK SNBT</option>
                  </select>
                </div>
                <div>
                  <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1">
                    Sumber Lead
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-md focus:border-light-primary focus:ring-1 focus:ring-light-primary bg-light-surface">
                    <option defaultValue="web">Formulir Website</option>
                    <option>Chat WhatsApp</option>
                    <option>Walk-in Cabang</option>
                    <option>Referral Siswa</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-light-outline-variant mt-2">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-label font-medium hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs"
                >
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
