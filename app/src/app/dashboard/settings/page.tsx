"use client";

import React, { useState } from "react";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin Akademik" | "Admin Keuangan" | "Tutor Pengajar";
  roleBadge: string;
  status: "Aktif" | "Nonaktif";
  lastLogin: string;
  permissions: {
    viewFinance: boolean;
    manageClasses: boolean;
    verifyAdmissions: boolean;
    inputAttendance: boolean;
  };
}

const initialStaff: StaffUser[] = [
  {
    id: "USR-01",
    name: "Ahmad Dani",
    email: "dani@arcibimbel.id",
    role: "Super Admin",
    roleBadge: "bg-light-primary text-light-on-primary",
    status: "Aktif",
    lastLogin: "Hari ini, 08:30 WIB",
    permissions: {
      viewFinance: true,
      manageClasses: true,
      verifyAdmissions: true,
      inputAttendance: true,
    },
  },
  {
    id: "USR-02",
    name: "Siti Rahma, M.Pd.",
    email: "siti.rahma@arcibimbel.id",
    role: "Admin Akademik",
    roleBadge: "bg-purple-100 text-purple-800",
    status: "Aktif",
    lastLogin: "Kemarin, 16:45 WIB",
    permissions: {
      viewFinance: false,
      manageClasses: true,
      verifyAdmissions: true,
      inputAttendance: true,
    },
  },
  {
    id: "USR-03",
    name: "Dewi Lestari, S.E.",
    email: "finance@arcibimbel.id",
    role: "Admin Keuangan",
    roleBadge: "bg-emerald-100 text-emerald-800",
    status: "Aktif",
    lastLogin: "18 Nov 2026, 11:20 WIB",
    permissions: {
      viewFinance: true,
      manageClasses: false,
      verifyAdmissions: true,
      inputAttendance: false,
    },
  },
  {
    id: "USR-04",
    name: "Budi Pratama, S.Si.",
    email: "budi.tutor@arcibimbel.id",
    role: "Tutor Pengajar",
    roleBadge: "bg-accent text-on-accent",
    status: "Aktif",
    lastLogin: "Hari ini, 14:02 WIB",
    permissions: {
      viewFinance: false,
      manageClasses: false,
      verifyAdmissions: false,
      inputAttendance: true,
    },
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "rbac" | "audit">("users");
  const [staffList, setStaffList] = useState<StaffUser[]>(initialStaff);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("USR-01");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedStaff =
    staffList.find((s) => s.id === selectedStaffId) || staffList[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTogglePermission = (key: keyof StaffUser["permissions"]) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id !== selectedStaff.id) return s;
        return {
          ...s,
          permissions: {
            ...s.permissions,
            [key]: !s.permissions[key],
          },
        };
      })
    );
  };

  const handleSavePermissions = () => {
    showToast(`Matriks izin untuk ${selectedStaff.name} berhasil diperbarui di server RBAC!`);
  };

  return (
    <>
      {toastMsg && (
        <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px] text-success">
              check_circle
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 rounded hover:bg-black/5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Manajemen Pengguna, Peran &amp; Audit Keamanan
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-light-primary-container text-light-primary font-bold shadow-2xs">
              {staffList.length} Akun Staf Aktif
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Konfigurasi hak akses berbasis peran (RBAC) untuk menjaga kerahasiaan data siswa, keuangan, dan rekam audit log perubahan.
          </p>
        </div>
      </div>

      {/* Settings Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-light-outline-variant overflow-x-auto pb-px">
        {[
          { key: "users", label: `Pengguna Internal & Tutor (${staffList.length})` },
          { key: "rbac", label: "Matriks Izin Role (RBAC)" },
          { key: "audit", label: "Audit Log Aktivitas Keamanan" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2.5 border-b-2 font-label text-body-md font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "border-light-primary text-light-primary"
                : "border-transparent text-light-on-surface hover:text-light-primary font-medium"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Pengguna Internal */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Staff List Table (Col 7) */}
          <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 border-b border-light-outline-variant flex items-center justify-between">
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Daftar Akun Pengguna Internal
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Nama Staf &amp; Email</th>
                    <th className="py-3 px-4">Peran (Role)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-outline-variant font-body">
                  {staffList.map((user) => {
                    const isSelected = user.id === selectedStaff.id;
                    return (
                      <tr
                        key={user.id}
                        onClick={() => setSelectedStaffId(user.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-light-primary-container/20 border-l-4 border-light-primary"
                            : "hover:bg-light-surface-container"
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-light-on-surface block">
                            {user.name}
                          </span>
                          <span className="text-[12px] text-light-on-surface-variant">
                            {user.email}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${user.roleBadge}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-success/15 text-success">
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            className={`px-3 py-1 rounded text-[11px] font-semibold ${
                              isSelected
                                ? "bg-light-primary text-light-on-primary"
                                : "border border-light-outline hover:bg-light-surface"
                            }`}
                          >
                            {isSelected ? "Dipilih" : "Ubah"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Right Inspector: Permissions Matrix (Col 5) */}
          <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
            <div className="flex items-start justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Izin Akses: {selectedStaff.name}
                </h3>
                <span className="text-[12px] text-light-on-surface-variant">
                  {selectedStaff.email} • {selectedStaff.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-body-sm">
              <label className="p-3 rounded-lg border border-light-outline-variant flex items-center justify-between cursor-pointer hover:bg-light-surface-soft">
                <div>
                  <span className="font-semibold block text-light-on-surface">
                    Akses Data Finansial &amp; Kas
                  </span>
                  <span className="text-[11px] text-light-on-surface-variant">
                    Melihat invoice, verifikasi pembayaran, laporan kas
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStaff.permissions.viewFinance}
                  onChange={() => handleTogglePermission("viewFinance")}
                  className="rounded text-light-primary focus:ring-light-primary w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-lg border border-light-outline-variant flex items-center justify-between cursor-pointer hover:bg-light-surface-soft">
                <div>
                  <span className="font-semibold block text-light-on-surface">
                    Manajemen Kelas &amp; Ruangan
                  </span>
                  <span className="text-[11px] text-light-on-surface-variant">
                    Plot jadwal sesi, rombel kelas, alokasi tutor
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStaff.permissions.manageClasses}
                  onChange={() => handleTogglePermission("manageClasses")}
                  className="rounded text-light-primary focus:ring-light-primary w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-lg border border-light-outline-variant flex items-center justify-between cursor-pointer hover:bg-light-surface-soft">
                <div>
                  <span className="font-semibold block text-light-on-surface">
                    Verifikasi Pendaftaran &amp; Berkas
                  </span>
                  <span className="text-[11px] text-light-on-surface-variant">
                    Validasi rapor calon siswa, onboarding rombel
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStaff.permissions.verifyAdmissions}
                  onChange={() => handleTogglePermission("verifyAdmissions")}
                  className="rounded text-light-primary focus:ring-light-primary w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-lg border border-light-outline-variant flex items-center justify-between cursor-pointer hover:bg-light-surface-soft">
                <div>
                  <span className="font-semibold block text-light-on-surface">
                    Input &amp; Koreksi Presensi
                  </span>
                  <span className="text-[11px] text-light-on-surface-variant">
                    Mengisi log presensi kelas &amp; catatan belajar
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStaff.permissions.inputAttendance}
                  onChange={() => handleTogglePermission("inputAttendance")}
                  className="rounded text-light-primary focus:ring-light-primary w-4 h-4"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleSavePermissions}
              className="w-full py-2.5 rounded-xl bg-light-primary text-light-on-primary font-semibold shadow-xs hover:bg-brand-indigo-dark transition-colors"
            >
              Simpan Matriks Izin
            </button>
          </section>
        </div>
      )}

      {/* Tab 2: Matriks RBAC Standar */}
      {activeTab === "rbac" && (
        <div className="bg-light-surface rounded-xl border border-light-outline-variant p-6 shadow-xs">
          <h2 className="font-headline font-bold text-title-lg text-light-on-surface mb-4">
            Matriks Default Peran &amp; Hak Akses (RBAC)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-container text-label-sm font-bold text-light-on-surface">
                <tr>
                  <th className="p-3.5">Modul Sistem</th>
                  <th className="p-3.5 text-center">Super Admin</th>
                  <th className="p-3.5 text-center">Akademik</th>
                  <th className="p-3.5 text-center">Keuangan</th>
                  <th className="p-3.5 text-center">Tutor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant">
                {[
                  { module: "Dashboard Ringkasan Operasional", sa: true, ak: true, ke: true, tu: false },
                  { module: "CRM & Pipeline Calon Siswa", sa: true, ak: true, ke: false, tu: false },
                  { module: "Verifikasi Pendaftaran & Berkas", sa: true, ak: true, ke: true, tu: false },
                  { module: "Direktori Siswa & Profil 360°", sa: true, ak: true, ke: true, tu: true },
                  { module: "Jadwal & Ruang Kelas", sa: true, ak: true, ke: false, tu: true },
                  { module: "Rekap Presensi & Koreksi", sa: true, ak: true, ke: false, tu: true },
                  { module: "Tagihan, Invoice & Kas Masuk", sa: true, ak: false, ke: true, tu: false },
                  { module: "Broadcast Pengumuman WhatsApp", sa: true, ak: true, ke: true, tu: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-light-surface-soft">
                    <td className="p-3.5 font-medium">{row.module}</td>
                    <td className="p-3.5 text-center">{row.sa ? "✓" : "—"}</td>
                    <td className="p-3.5 text-center">{row.ak ? "✓" : "—"}</td>
                    <td className="p-3.5 text-center">{row.ke ? "✓" : "—"}</td>
                    <td className="p-3.5 text-center">{row.tu ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Log */}
      {activeTab === "audit" && (
        <div className="bg-light-surface rounded-xl border border-light-outline-variant p-6 shadow-xs flex flex-col gap-4">
          <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
            Rekam Jejak Audit Keamanan (Security Audit Trail)
          </h2>
          <div className="divide-y divide-light-outline-variant border border-light-outline-variant rounded-xl overflow-hidden">
            {[
              { time: "18 Nov 2026, 15:30 WIB", user: "Ahmad Dani", action: "Menyetujui verifikasi bukti pembayaran INV-2026-1189 (Rp1.100.000)" },
              { time: "18 Nov 2026, 14:02 WIB", user: "Budi Pratama", action: "Login ke Tablet Presensi Tutor dari IP 182.253.110.12" },
              { time: "17 Nov 2026, 10:00 WIB", user: "Dewi Lestari", action: "Mengirimkan siaran pengingat tagihan SPP ke 25 wali murid" },
              { time: "16 Nov 2026, 09:15 WIB", user: "Siti Rahma", action: "Membuat rombel baru: SMP-8 Reguler Sudirman A" },
            ].map((log, i) => (
              <div key={i} className="p-4 flex items-start justify-between gap-4 text-body-sm hover:bg-light-surface-soft">
                <div>
                  <p className="font-semibold text-light-on-surface">{log.action}</p>
                  <p className="text-[12px] text-light-on-surface-variant">Oleh: <strong>{log.user}</strong></p>
                </div>
                <span className="text-[11px] text-light-on-surface-variant shrink-0 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
