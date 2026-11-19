"use client";

import React, { useEffect } from "react";
import Link from "next/link";

declare global {
  interface Window {
    setRolePreset?: (roleKey: string) => void;
    togglePasswordVisibility?: () => void;
  }
}

export default function LoginAdminPage() {
  useEffect(() => {
    let currentRole = "admin";

    const roles: Record<string, { email: string; badge: string; title: string }> = {
      admin: {
        email: "ahmad.dani@arcibimbel.id",
        badge: "Super Admin",
        title: "Operasional & Lead Management"
      },
      academic: {
        email: "siti.rahma@arcibimbel.id",
        badge: "Koordinator Akademik",
        title: "Penjadwalan & Roster Siswa"
      },
      finance: {
        email: "budi.keuangan@arcibimbel.id",
        badge: "Staf Keuangan",
        title: "Kas, Tagihan & Pembayaran"
      },
      tutor: {
        email: "tutor.dimas@arcibimbel.id",
        badge: "Tutor / Pengajar",
        title: "Presensi & Input Nilai"
      }
    };

    function setRolePreset(roleKey: string) {
      currentRole = roleKey;
      const data = roles[roleKey];
      if (!data) return;

      const emailInput = document.getElementById("email-input") as HTMLInputElement;
      const pwdInput = document.getElementById("password-input") as HTMLInputElement;
      const badge = document.getElementById("role-badge");
      const info = document.getElementById("role-info");

      if (emailInput) emailInput.value = data.email;
      if (pwdInput) pwdInput.value = "admin12345";
      if (badge) badge.textContent = data.badge;
      if (info) info.textContent = data.title;

      document.querySelectorAll(".role-preset-btn").forEach((btn) => {
        btn.classList.remove("ring-2", "ring-light-primary", "bg-light-primary-container/40");
      });
      const activeBtn = document.getElementById(`btn-role-${roleKey}`);
      if (activeBtn) {
        activeBtn.classList.add("ring-2", "ring-light-primary", "bg-light-primary-container/40");
      }
    }

    function togglePasswordVisibility() {
      const pwd = document.getElementById("password-input") as HTMLInputElement;
      const icon = document.getElementById("password-toggle-icon");
      if (pwd && icon) {
        if (pwd.type === "password") {
          pwd.type = "text";
          icon.textContent = "visibility_off";
        } else {
          pwd.type = "password";
          icon.textContent = "visibility";
        }
      }
    }

    window.setRolePreset = setRolePreset;
    window.togglePasswordVisibility = togglePasswordVisibility;

    const form = document.getElementById("login-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = document.getElementById("btn-login-submit") as HTMLButtonElement;
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Masuk ke Sistem...`;
        }
        setTimeout(() => {
          if (currentRole === "tutor") {
            window.location.href = "/tutor";
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
      });
    }
  }, []);

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body min-h-screen flex flex-col justify-between selection:bg-brand-indigo selection:text-white">


  {/* Desktop Login Split Card (100% Centerized & Responsive Grid) */}
  <main className="max-w-4xl w-full bg-light-surface rounded-2xl sm:rounded-3xl border border-light-outline-variant shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 my-auto mx-auto transition-all">
    
    {/* Left Hero Brand Column (Col 5) */}
    <div className="md:col-span-5 bg-brand-indigo text-light-on-primary p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Backdrop Accent Glow */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-accent/20 blur-2xl pointer-events-none"></div>
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-light-primary-container/10 blur-xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Logo & Header Brand */}
        <a href="/" className="flex items-center gap-3 mb-6 sm:mb-8 group w-fit">
          <div className="w-10 h-10 rounded-xl bg-accent text-on-accent flex items-center justify-center font-headline font-bold text-headline-sm shadow-sm group-hover:bg-yellow-400 transition-colors">
            A
          </div>
          <div>
            <span className="font-headline font-bold text-title-lg tracking-tight block text-light-on-primary">ARCI Bimbel</span>
            <span className="text-[11px] text-light-primary-container font-label">Sistem Operasional Terpadu</span>
          </div>
        </a>

        <h1 className="font-headline text-headline-sm sm:text-headline-md font-bold text-light-on-primary leading-snug">
          Pusat Kendali Akademik, Lead &amp; Keuangan Lembaga
        </h1>
        <p className="text-body-sm text-light-primary-container mt-3 leading-relaxed">
          Akses aman khusus staf internal, koordinator kurikulum, tutor pengampu, dan tim administrasi keuangan ARCI Bimbel.
        </p>

        {/* Role Indicator Chips */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium bg-light-primary-container/15 text-light-primary-container border border-light-primary-container/20">
            Operations Admin
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium bg-light-primary-container/15 text-light-primary-container border border-light-primary-container/20">
            Akademik &amp; Tutor
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium bg-light-primary-container/15 text-light-primary-container border border-light-primary-container/20">
            Finance &amp; SPP
          </span>
        </div>
      </div>

      {/* Left Bottom Security Badges */}
      <div className="pt-6 border-t border-light-primary-container/20 mt-6 sm:mt-8 text-body-sm text-light-primary-container flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-accent">verified_user</span>
          <span className="text-[13px]">Autentikasi Aman &amp; Terenkripsi</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-accent">history</span>
          <span className="text-[13px]">Audit Log Aktivitas Terpantau Real-time</span>
        </div>
      </div>
    </div>

    {/* Right Login Form Column (Col 7) */}
    <div className="md:col-span-7 p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-light-surface">
      <div>
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-light-outline-variant/50">
          <div>
            <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Portal Internal</span>
            <h2 className="font-headline text-headline-sm font-bold text-light-on-surface mt-0.5">Masuk ke Dashboard</h2>
          </div>
          <a href="/" className="text-body-sm font-label text-light-on-surface-variant hover:text-light-primary flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-light-surface-container-low transition-colors group">
            <span className="font-medium">Website</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">open_in_new</span>
          </a>
        </div>

        {/* Role Quick Autofill Presets */}
        <div className="mb-5 p-3 rounded-xl bg-light-surface-container-low border border-light-outline-variant/60 flex flex-col gap-2">
          <span className="text-[11px] font-label uppercase font-bold text-light-on-surface-variant tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-light-primary">bolt</span>
            Pilih Akun Demo / Presets:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button type="button" onClick={() => (window as any).setRolePreset?.("admin")} className="role-btn px-2 py-1.5 rounded-lg border border-light-outline-variant text-[11.5px] font-label font-semibold bg-light-surface hover:bg-light-primary hover:text-light-on-primary transition-colors text-light-on-surface active:scale-95 shadow-xs">
              Super Admin
            </button>
            <button type="button" onClick={() => (window as any).setRolePreset?.("academic")} className="role-btn px-2 py-1.5 rounded-lg border border-light-outline-variant text-[11.5px] font-label font-semibold bg-light-surface hover:bg-light-primary hover:text-light-on-primary transition-colors text-light-on-surface active:scale-95 shadow-xs">
              Akademik
            </button>
            <button type="button" onClick={() => (window as any).setRolePreset?.("finance")} className="role-btn px-2 py-1.5 rounded-lg border border-light-outline-variant text-[11.5px] font-label font-semibold bg-light-surface hover:bg-light-primary hover:text-light-on-primary transition-colors text-light-on-surface active:scale-95 shadow-xs">
              Keuangan
            </button>
          </div>
        </div>

        {/* Alert Toast Box */}
        <div id="login-alert" className="hidden mb-4 p-3.5 rounded-xl text-body-sm border items-start gap-2.5 transition-all">
          <span id="login-alert-icon" className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">info</span>
          <span id="login-alert-text">Pesan notifikasi</span>
        </div>

        {/* Form Body */}
        <form id="staff-login-form"  className="flex flex-col gap-4">
          {/* Email Field */}
          <label className="flex flex-col gap-1.5">
            <span className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
              <span>Email Dinas / Akun Staf</span>
              <span id="role-badge" className="text-[11px] font-label text-light-primary font-bold bg-light-primary-container px-2 py-0.5 rounded-full">Admin Operasional</span>
            </span>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-light-on-surface-variant material-symbols-outlined text-[20px]" aria-hidden="true">mail</span>
              <input type="email" id="staff-email" placeholder="nama.staf@arcibimbel.id" value="ahmad.dani@arcibimbel.id" required
                className="w-full min-h-[48px] pl-11 pr-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md transition-colors" />
            </div>
          </label>

          {/* Password Field */}
          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Kata Sandi Akun</span>
              <button type="button" onClick={() => (window as any).showItSupportModal?.()} className="text-body-sm text-light-primary font-label font-semibold hover:underline">
                Lupa Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-light-on-surface-variant material-symbols-outlined text-[20px]" aria-hidden="true">lock</span>
              <input type="password" id="staff-password" placeholder="Masukkan kata sandi staf" value="Password123#" required
                className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md transition-colors" />
              <button type="button" id="toggle-pwd-btn" onClick={() => (window as any).togglePasswordVisibility?.()} aria-label="Tampilkan kata sandi" className="absolute right-3.5 text-light-on-surface-variant hover:text-light-on-surface focus:outline-none p-1">
                <span id="toggle-pwd-icon" className="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
          </label>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-body-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-light-on-surface">
              <input type="checkbox" defaultChecked className="rounded text-light-primary focus:ring-light-primary" />
              <span className="text-[13px] text-light-on-surface-variant">Ingat saya di perangkat dinas ini</span>
            </label>
            <span className="text-[11px] text-light-on-surface-variant/70 hidden sm:inline">2FA Aktif</span>
          </div>

          {/* Submit Button */}
          <button type="submit" id="btn-submit-staff" className="w-full min-h-[48px] py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2 font-bold active:scale-[0.99]">
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Masuk ke Dashboard Operasional</span>
          </button>
        </form>
      </div>

      {/* Footer Help Desk & Portal Switcher */}
      <div className="pt-5 mt-6 border-t border-light-outline-variant/70 flex flex-col sm:flex-row sm:items-center justify-between text-body-sm gap-2">
        <div className="text-[12px] text-light-on-surface-variant flex items-center gap-3">
          <button type="button" onClick={() => (window as any).showItSupportModal?.()} className="text-light-primary font-semibold hover:underline">
            Bantuan IT Support
          </button>
          <span>&bull;</span>
          <a href="/tutor" className="text-brand-indigo font-bold hover:underline">Mode Tutor Mobile</a>
        </div>
        <a href="/login" className="text-[12px] text-light-primary font-semibold hover:underline flex items-center gap-1">
          <span>Portal Orang Tua &amp; Siswa</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
      </div>
    </div>
  </main>

  {/* Modal Dialog: Bantuan IT Support */}
  <div id="it-modal" className="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-light-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-light-outline-variant flex flex-col gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center mx-auto shadow-xs">
        <span className="material-symbols-outlined text-[24px]">support_agent</span>
      </div>
      <div>
        <h3 className="font-headline font-bold text-title-lg text-light-on-surface">Pusat Bantuan IT &amp; Reset Sandi</h3>
        <p className="text-body-sm text-light-on-surface-variant mt-1.5 leading-relaxed">
          Akun internal ARCI Bimbel terikat dengan email institusi resmi (@arcibimbel.id). Jika lupa kata sandi atau terkunci 2FA, silakan hubungi tim Helpdesk IT melalui saluran darurat berikut:
        </p>
      </div>
      <div className="bg-light-surface-container-low p-3.5 rounded-xl border border-light-outline-variant text-left text-body-sm space-y-1">
        <p><span className="text-light-on-surface-variant">Helpdesk IT:</span> <strong>it-helpdesk@arcibimbel.id</strong></p>
        <p><span className="text-light-on-surface-variant">Hotline Internal:</span> <strong>Ext. 104 / WhatsApp: +62 811-2233-4455</strong></p>
        <p><span className="text-light-on-surface-variant">Jam Operasional:</span> <strong>07:30 - 21:00 WIB</strong></p>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <a href="https://wa.me/6281122334455?text=Halo%20IT%20Support%20ARCI%20Bimbel,%20saya%20butuh%20bantuan%20reset%20kata%20sandi%20akun%20staf" target="_blank" rel="noopener noreferrer" className="min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-success text-on-success font-label text-body-sm font-semibold hover:bg-success/90 transition-colors shadow-xs">
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>Hubungi IT Support WhatsApp</span>
        </a>
        <button type="button" onClick={() => (window as any).closeItSupportModal?.()} className="min-h-[44px] py-2 px-4 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-medium transition-colors">
          Tutup
        </button>
      </div>
    </div>
  </div>

  {/* Interactive JavaScript Logic */}
  

    </div>
  );
}
