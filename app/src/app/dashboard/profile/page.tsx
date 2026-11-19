"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  getStaffProfileDataAction,
  updateStaffProfileAction,
  updateStaffPasswordAction,
  logoutOtherSessionsAction,
  StaffProfileData,
  BranchOption,
} from "@/app/actions/profile";
import { ROLE_CONFIGS } from "@/lib/rbac";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StaffProfileData | null>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  // Password change form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI status
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    type: "success" | "warning" | "info";
  }>({
    show: false,
    msg: "",
    type: "info",
  });

  const showToast = (
    msg: string,
    type: "success" | "warning" | "info" = "success"
  ) => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast({ show: false, msg: "", type: "info" });
    }, 4000);
  };

  const loadProfile = async () => {
    const res = await getStaffProfileDataAction();
    if (res.success && res.data) {
      setProfile(res.data);
      setFullName(res.data.fullName);
      setPhone(res.data.phone);
      setSelectedBranch(res.data.branchName);
      if (res.branches) {
        setBranches(res.branches);
      }
    } else {
      showToast(res.message || "Gagal memuat profil staf.", "warning");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Handle Profile Update Form
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateStaffProfileAction({
        fullName,
        phone,
        branchName: selectedBranch,
      });

      if (res.success) {
        showToast(res.message || "Profil staf berhasil diperbarui!", "success");
        await loadProfile();
      } else {
        showToast(res.message || "Gagal memperbarui profil.", "warning");
      }
    });
  };

  // Handle Password Change Form
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast("Kata sandi baru minimal 8 karakter.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Konfirmasi kata sandi tidak cocok.", "warning");
      return;
    }

    startTransition(async () => {
      const res = await updateStaffPasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        showToast(res.message, "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(res.message, "warning");
      }
    });
  };

  // Handle Logout Other Sessions
  const handleLogoutOthers = () => {
    startTransition(async () => {
      const res = await logoutOtherSessionsAction();
      if (res.success) {
        showToast(res.message, "success");
      } else {
        showToast(res.message, "warning");
      }
    });
  };

  const roleCfg = profile?.role ? ROLE_CONFIGS[profile.role] : ROLE_CONFIGS.super_admin;
  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  return (
    <>
      {/* Toast Alert Notification */}
      {toast.show && (
        <div
          className={`p-3.5 rounded-xl border text-body-sm flex items-center justify-between gap-3 shadow-md transition-all ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : toast.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-950"
              : "border-light-outline-variant bg-light-surface text-light-on-surface"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${
                toast.type === "success"
                  ? "text-success"
                  : toast.type === "warning"
                  ? "text-warning"
                  : "text-brand-indigo"
              }`}
            >
              {toast.type === "success"
                ? "check_circle"
                : toast.type === "warning"
                ? "warning"
                : "info"}
            </span>
            <span className="font-medium">{toast.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast({ show: false, msg: "", type: "info" })}
            className="p-1 rounded hover:bg-black/5"
            aria-label="Tutup notifikasi"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Title Bar with Breadcrumb and Active Role Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-light-surface p-5 sm:p-6 rounded-2xl border border-light-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-light-on-surface-variant">
            <Link href="/dashboard" className="hover:text-light-primary transition-colors">
              Dashboard Operasional
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-semibold text-light-primary">
              Pengaturan Akun &amp; Profil Staf
            </span>
          </div>
          <h1 className="text-headline-sm sm:text-headline-md font-headline font-bold text-light-on-surface mt-1.5">
            Profil &amp; Keamanan Akun Admin
          </h1>
          <p className="text-body-sm text-light-on-surface-variant mt-0.5">
            Kelola identitas staf, nomor kontak WhatsApp, kredensial password, dan log aktivitas sesi login internal.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-label-sm font-semibold flex items-center gap-1.5 ${roleCfg.badgeClass}`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>Role: {roleCfg.shortLabel}</span>
          </span>
        </div>
      </div>

      {/* Main Layout Grid: Profile Info & Security Column */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Personal Data & Contact Form (7 cols) */}
        <div className="xl:col-span-7 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xs p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-light-outline-variant pb-4">
            <div>
              <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
                Informasi Data Diri Staf
              </h2>
              <p className="text-body-sm text-light-on-surface-variant mt-0.5">
                Data ini digunakan untuk identifikasi operasional internal dan notifikasi sistem ke siswa/orang tua.
              </p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-5 p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-light-primary text-light-on-primary font-headline font-bold text-title-lg sm:text-headline-md flex items-center justify-center shadow-sm shrink-0">
              {loading ? "..." : initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-headline font-bold text-title-md text-light-on-surface truncate">
                {loading ? "Memuat profil..." : profile?.fullName}
              </div>
              <div className="text-[12px] text-light-on-surface-variant mt-0.5">
                NIP: <span className="font-mono font-semibold">{profile?.nip || "ADM-2026-001"}</span> • {selectedBranch}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => showToast("Fitur upload avatar terhubung ke storage Supabase.", "info")}
                  className="px-3 py-1 rounded-lg border border-light-outline hover:bg-light-surface text-light-primary text-[12px] font-semibold transition-colors"
                >
                  Unggah Foto Baru
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Avatar direset ke inisial nama standar.", "info")}
                  className="px-3 py-1 rounded-lg text-danger hover:bg-danger/10 text-[12px] font-medium transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 text-body-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap beserta gelar"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Jabatan Operasional
                </label>
                <input
                  type="text"
                  disabled
                  value={profile?.roleLabel || "Super Admin Operasional"}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline bg-light-surface-container text-light-on-surface-variant cursor-not-allowed text-body-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Email Resmi ARCI
                </label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline bg-light-surface-container text-light-on-surface-variant cursor-not-allowed text-body-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Nomor WhatsApp Kerja
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                Penugasan Cabang / Wilayah
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
              >
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.city})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Cabang Sudirman Utama">Cabang Sudirman Utama (Kampus Pusat)</option>
                    <option value="Cabang Kebayoran Baru">Cabang Kebayoran Baru</option>
                    <option value="Kelas Online Nasional">Kelas Online Nasional</option>
                  </>
                )}
              </select>
            </div>

            <div className="border-t border-light-outline-variant pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[12px] text-light-on-surface-variant">
                Terakhir diubah: {profile?.updatedAt || "19 Nov 2026, 09:30 WIB"}
              </span>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span className={`material-symbols-outlined text-[18px] ${isPending ? "animate-spin" : ""}`}>
                  {isPending ? "progress_activity" : "save"}
                </span>
                <span>{isPending ? "Menyimpan..." : "Simpan Profil"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Password & Security Settings (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Password Change Card */}
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-6 shadow-xs flex flex-col gap-4 text-body-sm">
            <h3 className="font-headline font-bold text-title-md text-light-on-surface border-b border-light-outline-variant pb-3 flex items-center justify-between">
              <span>Keamanan &amp; Kata Sandi</span>
              <span className="material-symbols-outlined text-light-primary text-[20px]">lock</span>
            </h3>

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter kombinasi"
                  className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-light-on-surface mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-3.5 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-lg border border-light-outline hover:bg-light-surface-container font-label text-body-sm font-semibold text-light-on-surface transition-colors mt-1 active:scale-98"
              >
                {isPending ? "Memproses..." : "Perbarui Kata Sandi"}
              </button>
            </form>
          </div>

          {/* Active Sessions & Security Audit */}
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant p-6 shadow-xs flex flex-col gap-3 text-body-sm">
            <h3 className="font-headline font-bold text-title-md text-light-on-surface flex items-center justify-between">
              <span>Sesi Login Aktif</span>
              <span className="text-label-sm text-success font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                2 Perangkat
              </span>
            </h3>

            <div className="flex flex-col gap-2 pt-1">
              {/* Current Device */}
              <div className="p-3 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-light-primary text-[22px]">
                    laptop_mac
                  </span>
                  <div>
                    <div className="font-semibold text-light-on-surface text-[12px]">
                      Chrome di macOS (Laptop Kantor)
                    </div>
                    <div className="text-[11px] text-light-on-surface-variant font-mono">
                      IP: 182.253.110.22 • Sedang Aktif
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/15 text-success">
                  Perangkat Ini
                </span>
              </div>

              {/* Second Device */}
              <div className="p-3 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-light-primary text-[22px]">
                    smartphone
                  </span>
                  <div>
                    <div className="font-semibold text-light-on-surface text-[12px]">
                      Safari di iPhone 14 (Mobile)
                    </div>
                    <div className="text-[11px] text-light-on-surface-variant">
                      Terakhir aktif 1 jam lalu
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Sesi pada perangkat iPhone 14 berhasil dilogout.", "success")}
                  className="text-danger text-[11px] font-semibold hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutOthers}
              disabled={isPending}
              className="w-full mt-2 py-2 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 font-label text-[12px] font-semibold transition-colors"
            >
              Logout dari Semua Perangkat Lain
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
