// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function AttendanceMobilePage() {
  useEffect(() => {
    function setAllPresent() {
      document.querySelectorAll("input[type=radio][value=H]").forEach((radio) => {
        (radio as HTMLInputElement).checked = true;
      });
      alert("Semua siswa ditandai Hadir ✓");
    }

    function submitAttendance() {
      const btn = document.getElementById("btn-submit-attendance") as HTMLButtonElement;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Menyimpan Presensi...`;
      }
      setTimeout(() => {
        alert("Presensi Sesi Berhasil Disimpan & Dikunci!");
        window.location.href = "/tutor";
      }, 1000);
    }

    window.setAllPresent = setAllPresent;
    window.submitAttendance = submitAttendance;
  }, []);

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body antialiased min-h-screen flex flex-col pb-28 selection:bg-brand-indigo selection:text-white">


  {/* Desktop Wrapper Container (Centered Mobile Viewport Frame) */}
  <div className="w-full max-w-xl mx-auto bg-light-surface-soft min-h-screen shadow-md flex flex-col border-x border-light-outline-variant/60 pb-28">

    {/* ============================================================== */}
    {/* MOBILE TOP APP BAR                                             */}
    {/* ============================================================== */}
    <header className="bg-light-surface border-b border-light-outline-variant px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <a 
          href="/tutor" 
          className="w-9 h-9 rounded-lg flex items-center justify-center text-light-on-surface hover:bg-light-surface-container transition-colors"
          title="Kembali ke Dashboard Tutor">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </a>
        <div>
          <h1 className="font-headline font-bold text-title-md text-light-on-surface leading-tight">Presensi Sesi Kelas</h1>
          <p className="text-[11px] text-light-on-surface-variant font-medium">Portal Tutor &bull; Mode Mobile Presensi</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-label bg-success text-on-success font-bold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          Live Sesi
        </span>
        <button 
          type="button" 
          onclick="toggleSessionSelector()" 
          className="w-9 h-9 rounded-lg border border-light-outline flex items-center justify-center text-light-on-surface hover:bg-light-surface-container transition-colors" 
          title="Pilih Sesi Lain">
          <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
        </button>
      </div>
    </header>

    {/* Session Quick Switcher Drawer (Expandable) */}
    <div id="session-switcher" className="hidden bg-light-surface px-4 py-3 border-b border-light-outline-variant space-y-2 text-body-sm animate-in slide-in-from-top duration-150">
      <label className="block text-[11px] font-label font-bold text-light-on-surface-variant uppercase">Pilih Rombel / Jadwal Aktif Hari Ini:</label>
      <div className="grid grid-cols-1 gap-2">
        <button type="button" onClick={() => (window as any).switchSession?.("SMP-8A")} className="p-2.5 rounded-lg border-2 border-light-primary bg-light-primary-container/30 text-left flex items-center justify-between">
          <div>
            <p className="font-bold text-brand-indigo">Matematika SMP 8-A (Ruang Galileo)</p>
            <p className="text-[11px] text-light-on-surface-variant">16:00 - 17:30 WIB &bull; 8 Siswa</p>
          </div>
          <span className="material-symbols-outlined text-light-primary text-[20px]">check_circle</span>
        </button>
        <button type="button" onClick={() => (window as any).switchSession?.("SMA-12B")} className="p-2.5 rounded-lg border border-light-outline hover:bg-light-surface-container text-left flex items-center justify-between">
          <div>
            <p className="font-semibold text-light-on-surface">Fisika UTBK 12-B (Ruang Newton)</p>
            <p className="text-[11px] text-light-on-surface-variant">18:00 - 19:30 WIB &bull; 14 Siswa</p>
          </div>
          <span className="text-xs text-light-on-surface-variant">Mulai 18:00</span>
        </button>
      </div>
    </div>

    {/* ============================================================== */}
    {/* SESSION CONTEXT HEADER                                         */}
    {/* ============================================================== */}
    <div className="p-4 bg-light-surface border-b border-light-outline-variant shadow-2xs">
      
      {/* Session Badge Card */}
      <div className="bg-gradient-to-br from-light-primary-container/60 via-light-surface-soft to-light-surface p-4 rounded-xl border border-light-primary/30 flex flex-col gap-2 relative">
        <div className="flex items-center justify-between">
          <span id="session-class-name" className="text-label-sm font-label text-brand-indigo font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Matematika SMP Kelas 8-A
          </span>
          <span id="session-room" className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-light-surface border border-light-outline-variant text-light-on-surface font-semibold">
            Ruang Galileo
          </span>
        </div>

        <p id="session-topic" className="text-body-sm font-bold text-light-on-surface leading-snug">
          Materi: Sistem Persamaan Linear Dua Variabel (SPLDV) — Metode Eliminasi
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant/60 text-[12px] text-light-on-surface">
          <span className="flex items-center gap-1 text-light-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-light-primary">person</span>
            Tutor: <strong className="text-light-on-surface font-semibold">Kak Budi Pratama</strong>
          </span>
          <span className="flex items-center gap-1 text-light-on-surface-variant font-mono">
            <span className="material-symbols-outlined text-[16px] text-light-primary">schedule</span>
            Kamis, 16:00 - 17:30 WIB
          </span>
        </div>
      </div>

      {/* Quick Attendance Summary Counters Bar (Real-Time Dynamic Sync) */}
      <div className="grid grid-cols-5 gap-1.5 mt-3 text-center text-body-sm">
        
        {/* Counter 1: Hadir */}
        <div className="p-2 rounded-xl bg-success text-on-success flex flex-col justify-center shadow-2xs transition-transform active:scale-95">
          <span id="count-present" className="font-bold font-headline text-title-lg leading-tight">6</span>
          <span className="text-[10px] font-label font-semibold uppercase tracking-wider">Hadir</span>
        </div>

        {/* Counter 2: Telat */}
        <div className="p-2 rounded-xl bg-amber-500 text-white flex flex-col justify-center shadow-2xs transition-transform active:scale-95">
          <span id="count-late" className="font-bold font-headline text-title-lg leading-tight">0</span>
          <span className="text-[10px] font-label font-semibold uppercase tracking-wider">Telat</span>
        </div>

        {/* Counter 3: Izin */}
        <div className="p-2 rounded-xl bg-warning text-on-warning flex flex-col justify-center shadow-2xs transition-transform active:scale-95">
          <span id="count-permission" className="font-bold font-headline text-title-lg leading-tight">1</span>
          <span className="text-[10px] font-label font-semibold uppercase tracking-wider">Izin</span>
        </div>

        {/* Counter 4: Sakit */}
        <div className="p-2 rounded-xl bg-blue-600 text-white flex flex-col justify-center shadow-2xs transition-transform active:scale-95">
          <span id="count-sick" className="font-bold font-headline text-title-lg leading-tight">1</span>
          <span className="text-[10px] font-label font-semibold uppercase tracking-wider">Sakit</span>
        </div>

        {/* Counter 5: Alpa */}
        <div className="p-2 rounded-xl bg-danger text-on-danger flex flex-col justify-center shadow-2xs transition-transform active:scale-95">
          <span id="count-absent" className="font-bold font-headline text-title-lg leading-tight">0</span>
          <span className="text-[10px] font-label font-semibold uppercase tracking-wider">Alpa</span>
        </div>

      </div>

    </div>

    {/* ============================================================== */}
    {/* STUDENT ATTENDANCE ROSTER (MOBILE TOUCH TARGETS)                */}
    {/* ============================================================== */}
    <main className="p-4 flex flex-col gap-3 flex-1">
      
      {/* List Header Actions */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span id="roster-count-label" className="text-label-sm font-label text-light-on-surface font-bold uppercase tracking-wider">
            Daftar Siswa (8 Rombel)
          </span>
          <span className="text-[11px] text-light-on-surface-variant block font-normal">Ketuk status untuk mengubah kehadiran</span>
        </div>
        <button 
          type="button" 
          onclick="markAllPresent()" 
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark text-label-sm font-label font-bold shadow-2xs transition-colors min-h-[36px]">
          <span className="material-symbols-outlined text-[16px]">done_all</span>
          <span>Semua Hadir</span>
        </button>
      </div>

      {/* Roster Container */}
      <div id="roster-container" className="space-y-3">
        {/* Rendered dynamically via JavaScript */}
      </div>

      {/* ============================================================ */}
      {/* TUTOR PEDAGOGIC & HOMEWORK NOTES                             */}
      {/* ============================================================ */}
      <section className="p-4 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between">
          <label htmlFor="session-notes" className="text-label-sm font-label text-brand-indigo font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            Catatan Perkembangan Kelas &amp; PR
          </label>
          <span className="text-[11px] text-light-on-surface-variant font-medium">Auto-sync ke Wali Murid</span>
        </div>

        <textarea 
          id="session-notes" 
          rows={3} 
          placeholder="Tuliskan materi bahasan, pemahaman siswa, kendala umum, dan tugas PR rumah..." 
          className="w-full px-3.5 py-2.5 rounded-xl border border-light-outline text-body-sm text-light-on-surface bg-light-surface-soft focus:bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary leading-relaxed transition-colors">Siswa antusias mengerjakan soal SPLDV metode eliminasi. Latihan hal 42 nomor 1-5 dijadikan PR mandiri.</textarea>
        
        <div className="flex items-center justify-between text-[11px] text-light-on-surface-variant pt-1">
          <span className="flex items-center gap-1 text-success font-medium">
            <span className="material-symbols-outlined text-[14px]">send</span>
            Notifikasi WA akan dikirim otomatis ke orang tua
          </span>
          <span id="char-counter" className="font-mono text-light-outline">87/250</span>
        </div>
      </section>

      {/* Quick Guidance Box for Tutor */}
      <div className="p-3.5 rounded-xl bg-light-primary-container/40 border border-light-primary/20 flex items-start gap-2.5 text-body-sm">
        <span className="material-symbols-outlined text-light-primary text-[20px] shrink-0 mt-0.5">info</span>
        <p className="text-[12px] text-light-on-primary-container leading-relaxed">
          Tutor wajib mengonfirmasi presensi maksimal <strong>15 menit setelah sesi berakhir</strong> agar rekap honorarium dan pesan WhatsApp ke wali murid terbit tepat waktu.
        </p>
      </div>

    </main>

    {/* ============================================================== */}
    {/* STICKY BOTTOM SAVE & SUBMIT BAR (MOBILE TOUCH OPTIMIZED)        */}
    {/* ============================================================== */}
    <aside className="fixed bottom-0 left-0 right-0 z-50 bg-light-surface/95 backdrop-blur-md border-t border-light-outline-variant p-3 sm:p-4 shadow-xl pb-safe">
      <div className="w-full max-w-xl mx-auto flex items-center gap-3">
        
        {/* Cancel / Secondary */}
        <a 
          href="/tutor" 
          className="px-4 py-3 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md font-semibold transition-colors flex items-center justify-center min-h-[48px] shrink-0" 
          title="Tutup Presensi">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </a>

        {/* Main Submit Button */}
        <button 
          type="button" 
          id="btn-save-attendance" 
          onClick={() => (window as any).submitAttendance?.()} 
          className="flex-1 py-3 px-4 rounded-xl bg-light-primary text-light-on-primary font-label text-label-lg font-bold shadow-sm hover:bg-brand-indigo-dark active:bg-brand-indigo-dark flex items-center justify-center gap-2 transition-all min-h-[48px]">
          <span className="material-symbols-outlined text-[22px]">save</span>
          <span>Simpan &amp; Kirim Presensi Sesi</span>
        </button>

      </div>
    </aside>

  </div>

  {/* ============================================================== */}
  {/* MODAL: KETERANGAN IZIN / SAKIT SISWA                           */}
  {/* ============================================================== */}
  <div id="modal-reason" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
      
      <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
        <h3 id="modal-reason-title" className="font-headline font-bold text-title-md text-light-on-surface">Keterangan Izin / Sakit</h3>
        <button type="button" onclick="closeReasonModal()" className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p id="modal-reason-student" className="font-bold text-body-md text-light-on-surface">Farhan Pratama</p>
          <p className="text-[12px] text-light-on-surface-variant">Pilih alasan tidak hadir sesi tatap muka:</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onclick="applyQuickReason('Izin (Lomba Sekolah)')" className="p-2.5 text-left rounded-lg border border-light-outline hover:border-light-primary text-xs font-medium">Lomba Sekolah</button>
          <button type="button" onclick="applyQuickReason('Izin (Acara Keluarga)')" className="p-2.5 text-left rounded-lg border border-light-outline hover:border-light-primary text-xs font-medium">Acara Keluarga</button>
          <button type="button" onclick="applyQuickReason('Sakit (Demam / Flu)')" className="p-2.5 text-left rounded-lg border border-light-outline hover:border-light-primary text-xs font-medium">Demam / Flu</button>
          <button type="button" onclick="applyQuickReason('Sakit (Surat Dokter)')" className="p-2.5 text-left rounded-lg border border-light-outline hover:border-light-primary text-xs font-medium">Surat Dokter</button>
        </div>

        <div>
          <label htmlFor="custom-reason-input" className="block text-label-sm font-semibold text-light-on-surface mb-1">Catatan Tambahan</label>
          <input 
            type="text" 
            id="custom-reason-input" 
            placeholder="Contoh: Mengikuti seleksi OSN Matematika" 
            className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface focus:border-light-primary min-h-[44px]" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button 
            type="button" 
            onclick="closeReasonModal()" 
            className="flex-1 py-2.5 rounded-lg border border-light-outline text-light-on-surface font-semibold text-body-sm min-h-[44px]">
            Batal
          </button>
          <button 
            type="button" 
            onclick="saveReasonModal()" 
            className="flex-1 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-bold text-body-sm hover:bg-brand-indigo-dark min-h-[44px]">
            Simpan Alasan
          </button>
        </div>
      </div>

    </div>
  </div>

  {/* ============================================================== */}
  {/* TOAST NOTIFICATION CONTAINER                                   */}
  {/* ============================================================== */}
  <div id="toast-container" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-[90%] pointer-events-none"></div>

  {/* ============================================================== */}
  {/* JAVASCRIPT LOGIC & STATE ENGINE                                */}
  {/* ============================================================== */}
  

    </div>
  );
}
