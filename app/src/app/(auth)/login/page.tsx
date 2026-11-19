"use client";

import React, { useEffect } from "react";
import Link from "next/link";

declare global {
  interface Window {
    switchPersona?: (persona: string) => void;
    togglePasswordVisibility?: () => void;
    requestOtp?: () => void;
  }
}

export default function LoginPage() {
  useEffect(() => {
    let currentPersona = "parent";

    function switchPersona(persona: string) {
      currentPersona = persona;
      const tabParent = document.getElementById("tab-parent");
      const tabStudent = document.getElementById("tab-student");
      const label = document.getElementById("identifier-label");
      const input = document.getElementById("identifier-input") as HTMLInputElement;
      const hint = document.getElementById("identifier-hint");
      const banner = document.getElementById("persona-banner");

      if (persona === "parent") {
        if (tabParent) {
          tabParent.className = "flex-1 py-2.5 px-4 rounded-xl text-label-md font-semibold font-label bg-light-primary text-light-on-primary shadow-xs transition-all flex items-center justify-center gap-2";
        }
        if (tabStudent) {
          tabStudent.className = "flex-1 py-2.5 px-4 rounded-xl text-label-md font-medium font-label text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container transition-all flex items-center justify-center gap-2";
        }
        if (label) label.textContent = "Nomor WhatsApp Orang Tua / Wali";
        if (input) input.placeholder = "0812-3456-7890";
        if (hint) hint.textContent = "Gunakan nomor WhatsApp aktif yang terdaftar saat pendaftaran.";
        if (banner) banner.textContent = "Portal Pemantauan Belajar & Rapor Orang Tua";
      } else {
        if (tabStudent) {
          tabStudent.className = "flex-1 py-2.5 px-4 rounded-xl text-label-md font-semibold font-label bg-light-primary text-light-on-primary shadow-xs transition-all flex items-center justify-center gap-2";
        }
        if (tabParent) {
          tabParent.className = "flex-1 py-2.5 px-4 rounded-xl text-label-md font-medium font-label text-light-on-surface-variant hover:text-light-on-surface hover:bg-light-surface-container transition-all flex items-center justify-center gap-2";
        }
        if (label) label.textContent = "Nomor Induk Siswa (NIS) atau WhatsApp Siswa";
        if (input) input.placeholder = "Contoh: 2026-SMP-0812";
        if (hint) hint.textContent = "NIS tertera pada kartu pelajar digital atau konfirmasi pendaftaran.";
        if (banner) banner.textContent = "Portal Jadwal Kelas, Modul & Hasil Tryout Siswa";
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

    function requestOtp() {
      const btn = document.getElementById("btn-otp") as HTMLButtonElement;
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Mengirim Kode OTP...";
        setTimeout(() => {
          btn.textContent = "OTP Terkirim ke WhatsApp ✓";
          setTimeout(() => {
            btn.disabled = false;
            btn.textContent = "Kirim Ulang OTP";
          }, 30000);
        }, 1200);
      }
    }

    window.switchPersona = switchPersona;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.requestOtp = requestOtp;

    const form = document.getElementById("login-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = document.getElementById("btn-login-submit") as HTMLButtonElement;
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Masuk ke Portal...`;
        }
        setTimeout(() => {
          window.location.href = "/portal";
        }, 800);
      });
    }
  }, []);

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body min-h-screen flex flex-col justify-between selection:bg-brand-indigo selection:text-white">


  {/* Top Simple Navigation (Centered Header Bar) */}
  <header className="w-full max-w-md mx-auto py-2.5 flex items-center justify-between border-b border-light-outline-variant/70">
    <a href="/" className="flex items-center gap-1.5 text-light-on-surface text-body-sm font-label hover:text-light-primary transition-colors py-1 px-1.5 rounded-lg hover:bg-light-surface-container-low group">
      <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
      <span className="font-semibold">Beranda</span>
    </a>
    
    <a href="/" className="flex items-center gap-2 group">
      <div className="w-7 h-7 rounded-lg bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-label-md group-hover:bg-brand-indigo-dark transition-colors shadow-xs">
        A
      </div>
      <span className="font-headline font-bold text-title-md text-brand-indigo">ARCI Bimbel</span>
    </a>

    <div className="w-16 flex justify-end">
      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-light-primary-container text-light-primary">
        Portal
      </span>
    </div>
  </header>

  {/* Login Card Centered Container (Vertical & Horizontal Centering) */}
  <main className="my-auto py-6 sm:py-8 w-full flex flex-col items-center justify-center">
    <div className="w-full max-w-md bg-light-surface rounded-2xl border border-light-outline-variant p-6 sm:p-8 shadow-sm flex flex-col gap-6 mx-auto">
      
      {/* Card Title & Description (Centered) */}
      <div className="text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-3 shadow-xs">
          <span className="material-symbols-outlined text-[26px]">school</span>
        </div>
        <h1 className="font-headline text-headline-sm font-bold text-light-on-surface">Masuk ke Portal Belajar</h1>
        <p className="text-body-sm text-light-on-surface-variant mt-1.5 leading-relaxed">
          Pantau jadwal kelas, presensi harian, nilai tryout, dan tagihan SPP ananda secara terpadu.
        </p>
      </div>

      {/* Segmented Persona Tabs (Wali vs Siswa) */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-light-surface-container gap-1" role="tablist">
        <button type="button" id="tab-parent" onClick={() => (window as any).switchPersona?.("parent")} className="py-2.5 rounded-lg bg-light-surface text-light-primary font-label text-body-sm font-bold shadow-xs transition-all flex items-center justify-center gap-1.5" role="tab" aria-selected="true">
          <span className="material-symbols-outlined text-[17px]">family_restroom</span>
          <span>Orang Tua / Wali</span>
        </button>
        <button type="button" id="tab-student" onClick={() => (window as any).switchPersona?.("student")} className="py-2.5 rounded-lg text-light-on-surface-variant hover:text-light-on-surface font-label text-body-sm font-medium transition-all flex items-center justify-center gap-1.5" role="tab" aria-selected="false">
          <span className="material-symbols-outlined text-[17px]">person</span>
          <span>Siswa Murid</span>
        </button>
      </div>

      {/* Login Notification / Toast (Hidden by default) */}
      <div id="login-alert" className="hidden p-3.5 rounded-xl text-body-sm border items-start gap-2.5 transition-all">
        <span id="login-alert-icon" className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">info</span>
        <span id="login-alert-text">Pesan notifikasi</span>
      </div>

      {/* Form Inputs */}
      <form id="login-form"  className="flex flex-col gap-4">
        
        {/* Input WhatsApp / Identifier */}
        <label className="flex flex-col gap-1.5">
          <span id="identifier-label" className="font-label text-label-md text-light-on-surface font-semibold">Nomor WhatsApp Terdaftar</span>
          <div className="relative flex items-center">
            <span id="identifier-icon" className="absolute left-3.5 text-light-on-surface-variant material-symbols-outlined text-[20px]" aria-hidden="true">phone_android</span>
            <input type="text" id="identifier-input" inputMode="tel" placeholder="0812-3456-7890" value="0812-3456-7890" required
              className="w-full min-h-[48px] pl-11 pr-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md transition-colors" />
          </div>
          <span id="identifier-hint" className="text-[11.5px] text-light-on-surface-variant">Gunakan nomor yang dicantumkan saat formulir pendaftaran.</span>
        </label>

        {/* Input Password / PIN */}
        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-label text-label-md text-light-on-surface font-semibold">Kata Sandi / PIN Portal</span>
            <button type="button" onClick={() => (window as any).showForgotPinModal?.()} className="text-[11.5px] text-light-primary font-label font-semibold hover:underline">
              Lupa PIN?
            </button>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-light-on-surface-variant material-symbols-outlined text-[20px]" aria-hidden="true">lock</span>
            <input type="password" id="password-input" placeholder="Masukkan 6 digit PIN akun" value="123456" required
              className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md transition-colors" />
            <button type="button" id="toggle-password-btn" onClick={() => (window as any).togglePasswordVisibility?.()} aria-label="Lihat kata sandi" className="absolute right-3.5 text-light-on-surface-variant hover:text-light-on-surface focus:outline-none p-1">
              <span id="toggle-password-icon" className="material-symbols-outlined text-[20px]">visibility</span>
            </button>
          </div>
        </label>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between text-body-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="remember-me" defaultChecked className="rounded text-light-primary focus:ring-light-primary" />
            <span className="text-light-on-surface-variant text-[13px]">Ingat saya di perangkat ini</span>
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" id="btn-login-submit" className="w-full min-h-[48px] py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm transition-all mt-2 font-semibold active:scale-[0.99] flex items-center justify-center gap-2">
          <span>Masuk ke Portal Belajar</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>

      {/* OTP / WhatsApp Alternative */}
      <div className="pt-4 border-t border-light-outline-variant text-center flex flex-col gap-3">
        <span className="text-[11px] text-light-on-surface-variant font-label tracking-wider font-semibold">ATAU MASUK LEBIH CEPAT</span>
        <button type="button" onClick={() => (window as any).requestOtp?.()} className="w-full min-h-[46px] py-2.5 px-4 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.99]">
          <span className="material-symbols-outlined text-[19px] text-success">chat</span>
          <span>Kirim Kode OTP Masuk via WhatsApp</span>
        </button>
      </div>
    </div>
  </main>

  {/* Mobile & Desktop Footer Helper (Centered) */}
  <footer className="w-full max-w-md mx-auto py-3 text-center text-body-sm text-light-on-surface-variant flex flex-col gap-2">
    <p>Belum punya akun? <a href="/pendaftaran" className="text-light-primary font-bold hover:underline">Daftar Bimbingan Belajar</a></p>
    <p className="text-[11.5px] text-light-on-surface-variant/80">© 2026 ARCI Bimbel • Butuh bantuan? WhatsApp: +62 812-3456-7890</p>
    <div className="pt-2 border-t border-light-outline-variant/50 flex justify-center">
      <a href="/login-admin" className="text-[12px] text-light-on-surface-variant hover:text-brand-indigo font-label flex items-center gap-1 font-medium transition-colors">
        <span className="material-symbols-outlined text-[15px]">badge</span>
        <span>Akses Staf &amp; Tutor Internal →</span>
      </a>
    </div>
  </footer>

  {/* Modal Dialog: Lupa PIN / Bantuan Masuk */}
  <div id="forgot-pin-modal" className="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-light-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-light-outline-variant flex flex-col gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-[24px]">key</span>
      </div>
      <div>
        <h3 className="font-headline font-bold text-title-lg text-light-on-surface">Bantuan Reset PIN Portal</h3>
        <p className="text-body-sm text-light-on-surface-variant mt-1.5">
          PIN akun baru secara otomatis dikirimkan ke nomor WhatsApp orang tua saat pendaftaran disetujui. Hubungi nomor admin atau klik tombol di bawah untuk verifikasi ulang.
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <a href="https://wa.me/6281234567890?text=Halo%20Admin%20ARCI%20Bimbel,%20saya%20butuh%20bantuan%20reset%20PIN%20portal%20belajar" target="_blank" rel="noopener noreferrer" className="min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-success text-on-success font-label text-body-sm font-semibold hover:bg-success/90 transition-colors shadow-xs">
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>Hubungi Admin via WhatsApp</span>
        </a>
        <button type="button" onClick={() => (window as any).closeForgotPinModal?.()} className="min-h-[44px] py-2 px-4 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-medium transition-colors">
          Tutup
        </button>
      </div>
    </div>
  </div>

  {/* Interactive JavaScript Logic */}
  

    </div>
  );
}
