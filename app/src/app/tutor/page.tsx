// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function TutorDashboardPage() {
  useEffect(() => {
    function openUploadModal() {
      document.getElementById("upload-modal")?.classList.remove("hidden");
    }
    function closeUploadModal() {
      document.getElementById("upload-modal")?.classList.add("hidden");
    }
    function openNotesModal() {
      document.getElementById("notes-modal")?.classList.remove("hidden");
    }
    function closeNotesModal() {
      document.getElementById("notes-modal")?.classList.add("hidden");
    }
    function showToast(msg: string) {
      alert(msg);
    }

    window.openUploadModal = openUploadModal;
    window.closeUploadModal = closeUploadModal;
    window.openNotesModal = openNotesModal;
    window.closeNotesModal = closeNotesModal;
    window.showToast = showToast;
  }, []);

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body antialiased min-h-screen flex flex-col pb-24 selection:bg-brand-indigo selection:text-white">


  {/* Desktop Wrapper Container (Centered Mobile Viewport Frame) */}
  <div className="w-full max-w-xl mx-auto bg-light-surface-soft min-h-screen shadow-md flex flex-col border-x border-light-outline-variant/60 pb-24">

    {/* ============================================================== */}
    {/* MOBILE TOP BAR WITH TUTOR PROFILE                              */}
    {/* ============================================================== */}
    <header className="bg-light-surface border-b border-light-outline-variant px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <img 
          src="assets/images/tutor-budi.jpg" 
          
          alt="Kak Budi Pratama" 
          className="w-10 h-10 rounded-full object-cover border-2 border-light-primary shrink-0 shadow-2xs" />
        <div>
          <h1 className="font-headline font-bold text-title-md text-brand-indigo leading-tight">Kak Budi Pratama</h1>
          <p className="text-[11px] text-light-on-surface-variant font-medium">Tutor Fisika &amp; TPS UTBK &bull; NIP: 2026-T01</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold bg-success/15 text-success border border-success/30 shadow-2xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
          Aktif Mengajar
        </span>
        <a 
          href="/dashboard" 
          className="w-8 h-8 rounded-lg border border-light-outline-variant flex items-center justify-center text-light-on-surface-variant hover:text-brand-indigo hover:bg-light-surface-container transition-colors" 
          title="Buka Dashboard Web Lengkap">
          <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
        </a>
      </div>
    </header>

    {/* ============================================================== */}
    {/* MAIN TUTOR DASHBOARD CONTENT                                   */}
    {/* ============================================================== */}
    <main className="p-4 flex flex-col gap-4 flex-1">
      
      {/* Next Teaching Session Banner (Actionable Presensi CTA) */}
      <section className="bg-gradient-to-br from-brand-indigo via-brand-indigo-dark to-brand-indigo text-light-on-primary rounded-2xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label font-bold bg-accent text-on-accent shadow-2xs">
            SESI BERIKUTNYA HARI INI
          </span>
          <span className="text-[11px] text-white/90 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
            14:00 - 15:30 WIB
          </span>
        </div>

        <div>
          <h2 className="font-headline font-bold text-title-lg text-white">
            UTBK 12-IPA: Fisika Gelombang
          </h2>
          <p className="text-[12px] text-white/80 mt-0.5 leading-relaxed">
            Topik: Gelombang Elektromagnetik, Polarisasi &amp; Efek Doppler
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/15 text-slate-200">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-accent">location_on</span>
            Lab Newton (Sudirman)
          </span>
          <span className="flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[15px] text-accent">groups</span>
            14 Siswa Terdaftar
          </span>
        </div>

        {/* Action Button to Open Mobile Attendance */}
        <a 
          href="/tutor/presensi" 
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-on-accent hover:bg-yellow-400 font-label text-label-md font-bold shadow-sm hover:shadow transition-all mt-1 min-h-[44px]">
          <span className="material-symbols-outlined text-[20px]">fact_check</span>
          <span>Buka Presensi Sesi Ini</span>
        </a>
      </section>

      {/* Monthly Stats & Honorarium Snapshot (2 Cols Grid) */}
      <section className="grid grid-cols-2 gap-3">
        
        {/* Metric 1: Jam Mengajar */}
        <div className="p-3.5 bg-light-surface rounded-xl border border-light-outline-variant shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] text-light-on-surface-variant font-label font-bold uppercase tracking-wider">Jam Mengajar Bulan Ini</span>
          <div className="mt-2">
            <div className="font-headline font-bold text-title-lg text-brand-indigo">42 Jam</div>
            <span className="text-[10px] text-success font-semibold mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
              28 dari 30 sesi selesai
            </span>
            <div className="w-full bg-light-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-brand-indigo h-full rounded-full" style={{ width: "93%" }}></div>
            </div>
          </div>
        </div>

        {/* Metric 2: Estimasi Honorarium */}
        <div className="p-3.5 bg-light-surface rounded-xl border border-light-outline-variant shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] text-light-on-surface-variant font-label font-bold uppercase tracking-wider">Estimasi Honorarium</span>
          <div className="mt-2">
            <div className="font-headline font-bold text-title-lg text-success">Rp6.300.000</div>
            <span className="text-[10px] text-light-on-surface-variant mt-0.5 block font-mono">
              Cair tgl 28 Nov 2026
            </span>
            <div className="w-full bg-light-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>

      </section>

      {/* Today's Teaching Schedule List */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-light-primary text-[20px]">calendar_today</span>
            <span>Jadwal Sesi Hari Ini</span>
          </h2>
          <span className="text-[11px] text-light-primary font-bold bg-light-primary-container px-2 py-0.5 rounded-md">
            2 Sesi Mengajar
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          
          {/* Session 1 (Afternoon) */}
          <div className="p-3.5 bg-light-surface-soft rounded-xl border-l-4 border-light-primary border border-light-outline-variant flex items-center justify-between text-body-sm gap-2">
            <div>
              <div className="font-bold text-brand-indigo">UTBK 12-IPA &bull; Fisika</div>
              <div className="text-[11px] text-light-on-surface-variant mt-0.5 font-mono">
                14:00 - 15:30 WIB &bull; Lab Newton
              </div>
            </div>
            <a 
              href="/tutor/presensi" 
              className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-[11px] font-label font-bold hover:bg-brand-indigo-dark transition-colors shadow-2xs whitespace-nowrap min-h-[36px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">checklist</span>
              <span>Isi Presensi</span>
            </a>
          </div>

          {/* Session 2 (Night Hybrid) */}
          <div className="p-3.5 bg-light-surface-soft rounded-xl border border-light-outline-variant flex items-center justify-between text-body-sm gap-2">
            <div>
              <div className="font-bold text-light-on-surface">ONLINE: Fisika Modern UTBK</div>
              <div className="text-[11px] text-light-on-surface-variant mt-0.5 font-mono">
                19:00 - 20:30 WIB &bull; Zoom Pro 1
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-light-surface-container text-light-on-surface">
                Nanti Malam
              </span>
              <a 
                href="https://zoom.us" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-2.5 py-1.5 rounded-lg border border-light-outline hover:border-light-primary text-[11px] font-semibold text-light-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">videocam</span>
                <span>Zoom</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Upload Teaching Materials / Homework (D8) */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-light-primary text-[20px]">folder</span>
              <span>Materi &amp; Tugas Siswa (D8)</span>
            </h2>
            <p className="text-[11px] text-light-on-surface-variant">Modul dibagikan langsung ke portal siswa &amp; wali</p>
          </div>
          <button 
            type="button" 
            onClick={() => (window as any).openUploadModal?.()} 
            className="text-[11px] text-light-primary font-bold hover:underline bg-light-primary-container/40 px-2.5 py-1 rounded-lg">
            + Unggah File
          </button>
        </div>

        <div className="flex flex-col gap-2 text-body-sm">
          
          {/* File Item 1 */}
          <div className="p-3 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              </div>
              <div>
                <div className="font-bold text-light-on-surface text-[12px]">Modul_Gelombang_Latihan.pdf</div>
                <div className="text-[10px] text-light-on-surface-variant">UTBK 12-IPA &bull; 4.2 MB &bull; Diunggah Kemarin</div>
              </div>
            </div>
            <span className="text-[10px] text-success font-bold bg-success/15 px-2 py-0.5 rounded-md shrink-0">
              Sudah Dibagikan
            </span>
          </div>

          {/* File Item 2 */}
          <div className="p-3 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">assignment</span>
              </div>
              <div>
                <div className="font-bold text-light-on-surface text-[12px]">Tugas Mandiri Fisika #4</div>
                <div className="text-[10px] text-light-on-surface-variant">Tenggat: 22 Nov 2026 &bull; Soal HOTS No. 1–10</div>
              </div>
            </div>
            <a 
              href="/portal/jadwal" 
              className="text-[10px] text-light-primary font-bold bg-light-primary-container px-2 py-0.5 rounded-md shrink-0 hover:underline">
              12/14 Mengumpulkan
            </a>
          </div>

        </div>
      </section>

      {/* Student Attendance Feedback & Quick Note */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-title-md text-light-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-light-primary text-[20px]">edit_note</span>
            <span>Catatan Konsultasi &amp; Wali Murid</span>
          </h3>
          <span className="text-[11px] text-light-on-surface-variant font-mono">Auto-sync WA</span>
        </div>
        <p className="text-[12px] text-light-on-surface-variant leading-relaxed">
          Beri catatan perkembangan siswa setelah sesi selesai. Catatan ini otomatis tampil di <a href="/portal" className="text-light-primary font-semibold hover:underline">portal orang tua murid</a> dan rekapan admin.
        </p>
        <button 
          type="button" 
          onClick={() => {
            const modal = document.getElementById('note-modal');
            if (modal) modal.classList.remove('hidden');
          }} 
          className="w-full py-2.5 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-sm font-semibold transition-colors flex items-center justify-center gap-1.5 min-h-[44px]">
          <span className="material-symbols-outlined text-[18px]">add_comment</span>
          <span>Tulis Catatan Konsultasi Baru</span>
        </button>
      </section>

    </main>

    {/* ============================================================== */}
    {/* STICKY BOTTOM NAVIGATION FOR TUTOR PORTAL MOBILE               */}
    {/* ============================================================== */}
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-light-surface/95 backdrop-blur-md border-t border-light-outline-variant px-6 py-2 shadow-lg pb-safe">
      <div className="w-full max-w-xl mx-auto flex items-center justify-between">
        
        {/* Tab 1: Beranda (Active) */}
        <a 
          href="/tutor" 
          className="flex flex-col items-center gap-0.5 text-light-primary font-label text-[11px] font-bold transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span>Beranda</span>
        </a>

        {/* Tab 2: Jadwal */}
        <a 
          href="/dashboard/schedule" 
          className="flex flex-col items-center gap-0.5 text-light-on-surface-variant hover:text-light-primary font-label text-[11px] font-medium transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          <span>Jadwal</span>
        </a>

        {/* Tab 3: Presensi Sesi */}
        <a 
          href="/tutor/presensi" 
          className="flex flex-col items-center gap-0.5 text-light-on-surface-variant hover:text-light-primary font-label text-[11px] font-medium transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">fact_check</span>
          <span>Presensi</span>
        </a>

        {/* Tab 4: Materi */}
        <a 
          href="/portal/jadwal" 
          className="flex flex-col items-center gap-0.5 text-light-on-surface-variant hover:text-light-primary font-label text-[11px] font-medium transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
          <span>Materi</span>
        </a>

        {/* Tab 5: Akun & Log Out */}
        <a 
          href="/login-admin" 
          className="flex flex-col items-center gap-0.5 text-light-on-surface-variant hover:text-light-primary font-label text-[11px] font-medium transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">badge</span>
          <span>Akun</span>
        </a>

      </div>
    </nav>

  </div>

  {/* ============================================================== */}
  {/* MODAL: UNGGAH MATERI / MODUL AJAR (D8)                         */}
  {/* ============================================================== */}
  <div id="modal-upload-material" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
      
      <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
        <div className="flex items-center gap-2 text-brand-indigo">
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          <h3 className="font-headline font-bold text-title-md text-light-on-surface">Unggah Materi / Modul (D8)</h3>
        </div>
        <button type="button" onClick={() => (window as any).closeUploadModal?.()} className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <form id="form-upload-material"  className="p-5 space-y-3.5 text-body-sm">
        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Rombel / Kelas Sasaran</label>
          <select className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface min-h-[40px]">
            <option selected>UTBK 12-IPA — Fisika Gelombang</option>
            <option>Matematika SMP Kelas 8-A</option>
            <option>ONLINE: Fisika Modern UTBK</option>
          </select>
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Judul Dokumen / Modul</label>
          <input 
            type="text" 
            required 
            placeholder="Contoh: Modul_Interferensi_Cahaya.pdf" 
            className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface min-h-[40px]" />
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Pilih Berkas (PDF / PPT / Video)</label>
          <div className="border-2 border-dashed border-light-outline rounded-xl p-4 text-center hover:border-light-primary transition-colors cursor-pointer bg-light-surface-soft">
            <input type="file" id="material-file-input" className="hidden" onchange="previewMaterialFile(this)" />
            <label htmlFor="material-file-input" className="cursor-pointer flex flex-col items-center gap-1.5">
              <span className="material-symbols-outlined text-[28px] text-light-primary">cloud_upload</span>
              <span id="material-file-name" className="font-semibold text-body-sm text-brand-indigo">Pilih File dari Perangkat</span>
              <span className="text-[11px] text-light-on-surface-variant">Maksimal 25 MB</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button type="button" onClick={() => (window as any).closeUploadModal?.()} className="flex-1 py-2.5 rounded-lg border border-light-outline text-light-on-surface font-semibold text-body-sm min-h-[44px]">
            Batal
          </button>
          <button type="submit" className="flex-1 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-bold text-body-sm hover:bg-brand-indigo-dark min-h-[44px]">
            Bagikan Materi
          </button>
        </div>
      </form>

    </div>
  </div>

  {/* ============================================================== */}
  {/* MODAL: TULIS CATATAN KONSULTASI SISWA                          */}
  {/* ============================================================== */}
  <div id="modal-note" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
      
      <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
        <div className="flex items-center gap-2 text-brand-indigo">
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          <h3 className="font-headline font-bold text-title-md text-light-on-surface">Catatan Perkembangan Siswa</h3>
        </div>
        <button type="button" onclick="closeNoteModal()" className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <form id="form-consultation-note"  className="p-5 space-y-3.5 text-body-sm">
        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Pilih Siswa</label>
          <select className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface min-h-[40px]">
            <option selected>Farhan Pratama (SMP 8-A)</option>
            <option>Ahmad Rizky Pratama (UTBK 12-IPA)</option>
            <option>Nadia Amanda (UTBK 12-IPA)</option>
          </select>
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Ulasan Evaluasi &amp; Catatan</label>
          <textarea rows={3} required placeholder="Tuliskan ulasan pemahaman materi, rekomendasi latihan, atau catatan kebiasaan belajar..." className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface"></textarea>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button type="button" onclick="closeNoteModal()" className="flex-1 py-2.5 rounded-lg border border-light-outline text-light-on-surface font-semibold text-body-sm min-h-[44px]">
            Batal
          </button>
          <button type="submit" className="flex-1 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-bold text-body-sm hover:bg-brand-indigo-dark min-h-[44px]">
            Simpan &amp; Broadcast
          </button>
        </div>
      </form>

    </div>
  </div>

  {/* ============================================================== */}
  {/* TOAST NOTIFICATION CONTAINER                                   */}
  {/* ============================================================== */}
  <div id="toast-container" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-[90%] pointer-events-none"></div>

  {/* ============================================================== */}
  {/* JAVASCRIPT STATE ENGINE                                        */}
  {/* ============================================================== */}
  

    </div>
  );
}
