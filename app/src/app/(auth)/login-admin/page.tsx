"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { loginStaffAction } from "@/app/actions/auth";

export default function LoginAdminPage() {
  const [email, setEmail] = useState("ahmad.dani@arcibimbel.id");
  const [password, setPassword] = useState("admin12345");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("super_admin");
  const [roleLabel, setRoleLabel] = useState("Super Admin");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presets = [
    {
      id: "super_admin",
      label: "Super Admin",
      email: "ahmad.dani@arcibimbel.id",
      title: "Pusat & Operasional",
    },
    {
      id: "admin_akademik",
      label: "Akademik",
      email: "siti.rahma@arcibimbel.id",
      title: "Admissions & Roster",
    },
    {
      id: "admin_keuangan",
      label: "Keuangan",
      email: "budi.keuangan@arcibimbel.id",
      title: "Invoice & Pembayaran",
    },
    {
      id: "tutor",
      label: "Tutor",
      email: "tutor.dimas@arcibimbel.id",
      title: "Presensi & Nilai",
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setSelectedRole(p.id);
    setRoleLabel(p.label);
    setEmail(p.email);
    setPassword("admin12345");
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginStaffAction(formData);
      if (res.success && res.redirectTo) {
        window.location.href = res.redirectTo;
      } else {
        setErrorMessage(res.message || "Gagal masuk. Periksa kembali email dan kata sandi.");
      }
    });
  };

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body min-h-screen flex flex-col justify-between selection:bg-brand-indigo selection:text-white">
      {/* Desktop Login Split Card (100% Centerized & Responsive Grid) */}
      <main className="max-w-4xl w-full bg-light-surface rounded-2xl sm:rounded-3xl border border-light-outline-variant shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 my-auto mx-auto transition-all">
        {/* Left Hero Brand Column (Col 5) */}
        <div className="md:col-span-5 bg-brand-indigo text-light-on-primary p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Backdrop Accent Glow */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-light-primary-container/10 blur-xl pointer-events-none" />

          <div className="relative z-10">
            {/* Logo & Header Brand */}
            <Link href="/" className="flex items-center gap-3 mb-6 sm:mb-8 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-accent text-on-accent flex items-center justify-center font-headline font-bold text-headline-sm shadow-sm group-hover:bg-yellow-400 transition-colors">
                A
              </div>
              <div>
                <span className="font-headline font-bold text-title-lg tracking-tight block text-light-on-primary">
                  ARCI Bimbel
                </span>
                <span className="text-[11px] text-light-primary-container font-label">
                  Sistem Operasional Terpadu
                </span>
              </div>
            </Link>

            <h1 className="font-headline text-headline-sm sm:text-headline-md font-bold text-light-on-primary leading-snug">
              Pusat Kendali Akademik, Pendaftaran &amp; Keuangan
            </h1>
            <p className="text-body-sm text-light-primary-container mt-3 leading-relaxed">
              Akses khusus staf internal, koordinator kurikulum, tutor pengampu, dan tim administrasi admissions ARCI Bimbel.
            </p>

            {/* Role Indicator Chips */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium bg-light-primary-container/15 text-light-primary-container border border-light-primary-container/20">
                Super Admin
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium bg-light-primary-container/15 text-light-primary-container border border-light-primary-container/20">
                Admissions &amp; Roster
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium bg-light-primary-container/15 text-light-primary-container border border-light-primary-container/20">
                Finance &amp; SPP
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium bg-light-primary-container/15 text-light-primary-container border border-light-primary-container/20">
                Tutor Presensi
              </span>
            </div>
          </div>

          {/* Left Bottom Security Badges */}
          <div className="pt-6 border-t border-light-primary-container/20 mt-6 sm:mt-8 text-body-sm text-light-primary-container flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-accent">verified_user</span>
              <span className="text-[13px]">Autentikasi Aman Supabase Auth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-accent">history</span>
              <span className="text-[13px]">Audit Log Sesi Terpantau Real-time</span>
            </div>
          </div>
        </div>

        {/* Right Login Form Column (Col 7) */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-light-surface">
          <div>
            {/* Top Action Bar */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-light-outline-variant/50">
              <div>
                <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">
                  Portal Internal Staf
                </span>
                <h2 className="font-headline text-headline-sm font-bold text-light-on-surface mt-0.5">
                  Masuk ke Dashboard
                </h2>
              </div>
              <Link
                href="/"
                className="text-body-sm font-label text-light-on-surface-variant hover:text-light-primary flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-light-surface-container-low transition-colors group"
              >
                <span className="font-medium">Website</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </Link>
            </div>

            {/* Role Quick Autofill Presets */}
            <div className="mb-5 p-3 rounded-xl bg-light-surface-container-low border border-light-outline-variant/60 flex flex-col gap-2">
              <span className="text-[11px] font-label uppercase font-bold text-light-on-surface-variant tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-light-primary">bolt</span>
                Pilih Akun Staf / Demo 1-Klik:
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {presets.map((p) => {
                  const isSelected = selectedRole === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`px-2 py-1.5 rounded-lg border text-[11px] font-label font-semibold transition-all active:scale-95 shadow-xs ${
                        isSelected
                          ? "bg-light-primary text-light-on-primary border-light-primary"
                          : "bg-light-surface hover:bg-light-primary-container text-light-on-surface border-light-outline-variant"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert Box */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl text-body-sm border border-danger/30 bg-danger/10 text-danger flex items-start gap-2.5 animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Field */}
              <label className="flex flex-col gap-1.5">
                <span className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
                  <span>Email Dinas / Akun Staf</span>
                  <span className="text-[11px] font-label text-light-primary font-bold bg-light-primary-container px-2.5 py-0.5 rounded-full">
                    {roleLabel}
                  </span>
                </span>
                <div className="relative flex items-center">
                  <span
                    className="absolute left-3.5 text-light-on-surface-variant material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    mail
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama.staf@arcibimbel.id"
                    required
                    className="w-full min-h-[48px] pl-11 pr-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md transition-colors"
                  />
                </div>
              </label>

              {/* Password Field */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label-md text-light-on-surface font-semibold">
                    Kata Sandi Akun
                  </span>
                  <span className="text-body-sm text-light-on-surface-variant text-[11px]">
                    Default: <code className="bg-light-surface-container px-1 py-0.5 rounded">admin12345</code>
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span
                    className="absolute left-3.5 text-light-on-surface-variant material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi staf"
                    required
                    className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Tampilkan kata sandi"
                    className="absolute right-3.5 text-light-on-surface-variant hover:text-light-on-surface focus:outline-none p-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-body-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-light-on-surface">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-light-primary focus:ring-light-primary"
                  />
                  <span className="text-[13px] text-light-on-surface-variant">
                    Ingat saya di perangkat ini
                  </span>
                </label>
                <span className="text-[11px] text-light-on-surface-variant/70 hidden sm:inline">
                  Supabase Session Active
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full min-h-[48px] py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2 font-bold active:scale-[0.99] disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <span className="inline-block animate-spin mr-1">⟳</span>
                    <span>Memverifikasi Staf...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    <span>Masuk ke Dashboard Operasional</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Portal Switcher */}
          <div className="pt-6 border-t border-light-outline-variant/60 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm text-light-on-surface-variant">
            <span>Bukan staf internal?</span>
            <Link
              href="/login"
              className="text-light-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>Masuk ke Portal Siswa &amp; Orang Tua</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Global Minimal Footer */}
      <footer className="text-center py-4 text-[12px] text-light-on-surface-variant">
        <p>© 2026 ARCI Bimbel — Platform Manajemen Bimbingan Belajar Terpadu. Akses terbatas khusus staf berwenang.</p>
      </footer>
    </div>
  );
}
