// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import Link from "next/link";

declare global {
  interface Window {
    switchChild?: (childKey: string) => void;
    switchTab?: (tabKey: string, e?: React.MouseEvent) => void;
    showToast?: (msg: string, type: string) => void;
    downloadReceipt?: (id: string) => void;
    openSessionDetailModal?: () => void;
    closeSessionDetailModal?: () => void;
    openAbsenceNoticeModal?: () => void;
    closeAbsenceNoticeModal?: () => void;
    toggleChildDropdown?: () => void;
    openChatTutor?: () => void;
  }
}

export default function StudentPortalPage() {
  useEffect(() => {

    // Children Dataset State
    const childrenProfiles = {
      farhan: {
        shortName: 'Farhan (SMP 8)',
        fullName: 'Farhan Pratama',
        grade: 'SMP Kelas 8-A • Reguler',
        initials: 'FP',
        upcomingClass: {
          time: 'Hari Ini • 16:00 WIB',
          title: 'Matematika SMP Kelas 8-A',
          topic: 'Topik: Sistem Persamaan Linear Dua Variabel (SPLDV) — Eliminasi Cepat',
          tutor: 'Kak Budi Pratama',
          room: 'Ruang Galileo (Sudirman)'
        },
        attendanceRate: '100% Hadir',
        attendanceDetail: '12 dari 12 sesi dihadiri',
        attendancePercent: '100%',
        tryoutScore: '84.5 / 100',
        tryoutTrend: 'Naik 8 poin dari bln lalu',
        tryoutPercent: '84.5%',
        tutorNote: {
          title: 'Catatan Tutor Terakhir (Kak Budi):',
          date: '17 Nov 2026',
          body: '“Farhan sangat fokus dan cepat memahami metode eliminasi SPLDV. Sudah mandiri menyelesaikan latihan di kelas dan aktif mengajukan pertanyaan.”'
        },
        billing: {
          status: 'Lunas',
          statusClass: 'bg-success text-on-success',
          invoiceTitle: 'SPP November 2026',
          invoiceMeta: 'Invoice #INV-2026-1189 • Rp1.100.000'
        }
      },
      nadia: {
        shortName: 'Nadia (SMA 12)',
        fullName: 'Nadia Amanda',
        grade: 'SMA Kelas 12 • Intensif UTBK',
        initials: 'NA',
        upcomingClass: {
          time: 'Besok • 18:00 WIB',
          title: 'Fisika Intensif UTBK 12',
          topic: 'Topik: Kinematika & Dinamika Gerak — Pola Soal HOTS SNBT',
          tutor: 'Kak Dimas Arya',
          room: 'Ruang Newton (Sudirman)'
        },
        attendanceRate: '96.2% Hadir',
        attendanceDetail: '25 dari 26 sesi dihadiri',
        attendancePercent: '96.2%',
        tryoutScore: '692.5 / 1000',
        tryoutTrend: 'Naik 42 poin dari TO-03',
        tryoutPercent: '69.2%',
        tutorNote: {
          title: 'Catatan Tutor Terakhir (Kak Dimas):',
          date: '18 Nov 2026',
          body: '“Nadia menunjukkan perkembangan pesat pada penalaran analitis fisika. Disarankan perbanyak latihan rumus usaha-energi untuk persiapan TO-05.”'
        },
        billing: {
          status: 'Lunas',
          statusClass: 'bg-success text-on-success',
          invoiceTitle: 'SPP November 2026 (Intensif)',
          invoiceMeta: 'Invoice #INV-2026-1192 • Rp1.850.000'
        }
      }
    };

    let activeChildKey = 'farhan';

    // Switch Tab View (Home, Jadwal, Materi, Tagihan)
    function switchTab(tabId, e) {
      if (e) {
        e.preventDefault();
        window.location.hash = `portal-${tabId}`;
      }

      // Hide all tabs
      ['home', 'jadwal', 'materi', 'tagihan'].forEach(t => {
        const el = document.getElementById(`tab-content-${t}`);
        const btn = document.getElementById(`nav-btn-${t}`);
        if (el) el.classList.add('hidden');
        if (btn) {
          btn.classList.remove('text-light-primary', 'font-bold');
          btn.classList.add('text-light-on-surface-variant', 'font-medium');
        }
      });

      // Show active tab
      const activeEl = document.getElementById(`tab-content-${tabId}`);
      const activeBtn = document.getElementById(`nav-btn-${tabId}`);
      if (activeEl) activeEl.classList.remove('hidden');
      if (activeBtn) {
        activeBtn.classList.add('text-light-primary', 'font-bold');
        activeBtn.classList.remove('text-light-on-surface-variant', 'font-medium');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Hash sync on load & hashchange
    function handleHashRouting() {
      const rawHash = window.location.hash.replace('#portal-', '').replace('#', '');
      if (['home', 'jadwal', 'materi', 'tagihan'].includes(rawHash)) {
        switchTab(rawHash);
      }
    }
    window.addEventListener('hashchange', handleHashRouting);
    document.addEventListener('DOMContentLoaded', handleHashRouting);

    // Toggle Child Dropdown
    function toggleChildDropdown() {
      const dropdown = document.getElementById('dropdown-child-switcher');
      dropdown.classList.toggle('hidden');
    }

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const btn = document.getElementById('btn-child-switcher');
      const dropdown = document.getElementById('dropdown-child-switcher');
      if (btn && dropdown && !btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    // Switch Active Child Profile
    function switchChild(childKey) {
      if (!childrenProfiles[childKey]) return;
      activeChildKey = childKey;
      const data = childrenProfiles[childKey];

      // Update button label
      document.getElementById('active-child-name').textContent = data.shortName;

      // Update dropdown selection indicators
      const itemFarhan = document.getElementById('item-child-farhan');
      const itemNadia = document.getElementById('item-child-nadia');

      if (childKey === 'farhan') {
        itemFarhan.className = "w-full text-left p-2.5 rounded-xl bg-light-primary-container/40 border border-light-primary/30 flex items-center justify-between transition-colors";
        itemFarhan.querySelector('.material-symbols-outlined').className = "material-symbols-outlined text-light-primary text-[18px]";
        itemNadia.className = "w-full text-left p-2.5 rounded-xl hover:bg-light-surface-container flex items-center justify-between transition-colors";
        itemNadia.querySelector('.material-symbols-outlined').className = "material-symbols-outlined text-transparent text-[18px]";
      } else {
        itemNadia.className = "w-full text-left p-2.5 rounded-xl bg-light-primary-container/40 border border-light-primary/30 flex items-center justify-between transition-colors";
        itemNadia.querySelector('.material-symbols-outlined').className = "material-symbols-outlined text-light-primary text-[18px]";
        itemFarhan.className = "w-full text-left p-2.5 rounded-xl hover:bg-light-surface-container flex items-center justify-between transition-colors";
        itemFarhan.querySelector('.material-symbols-outlined').className = "material-symbols-outlined text-transparent text-[18px]";
      }

      // Update Home Card Elements
      document.getElementById('card-session-time').textContent = data.upcomingClass.time;
      document.getElementById('card-session-title').textContent = data.upcomingClass.title;
      document.getElementById('card-session-topic').textContent = data.upcomingClass.topic;
      document.getElementById('card-session-tutor').textContent = data.upcomingClass.tutor;
      document.getElementById('card-session-room').textContent = data.upcomingClass.room;

      document.getElementById('stat-attendance-rate').textContent = data.attendanceRate;
      document.getElementById('stat-attendance-detail').textContent = data.attendanceDetail;
      document.getElementById('stat-attendance-bar').style.width = data.attendancePercent;

      document.getElementById('stat-tryout-score').textContent = data.tryoutScore;
      document.getElementById('stat-tryout-trend').innerHTML = `<span class="material-symbols-outlined text-[14px]">trending_up</span> ${data.tryoutTrend}`;
      document.getElementById('stat-tryout-bar').style.width = data.tryoutPercent;

      document.getElementById('tutor-note-title').textContent = data.tutorNote.title;
      document.getElementById('tutor-note-date').textContent = data.tutorNote.date;
      document.getElementById('tutor-note-body').textContent = data.tutorNote.body;

      document.getElementById('billing-invoice-title').textContent = data.billing.invoiceTitle;
      document.getElementById('billing-invoice-meta').textContent = data.billing.invoiceMeta;

      document.getElementById('absence-student-name').value = `${data.fullName} (${data.grade.split('•')[0].trim()})`;

      toggleChildDropdown();
      showToast(`Beralih ke profil siswa: ${data.fullName}`, 'info');
    }

    // Modal Session Detail
    function openSessionDetailModal() {
      const data = childrenProfiles[activeChildKey];
      document.getElementById('modal-class-title').textContent = data.upcomingClass.title;
      document.getElementById('modal-session-detail').classList.remove('hidden');
    }

    function closeSessionDetailModal() {
      document.getElementById('modal-session-detail').classList.add('hidden');
    }

    // Modal Absence Notice
    function openAbsenceNoticeModal() {
      document.getElementById('modal-absence').classList.remove('hidden');
    }

    function closeAbsenceNoticeModal() {
      document.getElementById('modal-absence').classList.add('hidden');
    }

    function handleAbsenceSubmit(e) {
      e.preventDefault();
      const reason = document.getElementById('absence-reason-select').value;
      const data = childrenProfiles[activeChildKey];
      closeAbsenceNoticeModal();
      showToast(`Pemberitahuan izin (${reason}) untuk ${data.fullName} berhasil dikirim ke tutor pengampu & tim akademik!`, 'success');
    }

    // Download Receipt Simulation
    function downloadReceipt(invNumber) {
      showToast(`Mengunduh Kuitansi Resmi #${invNumber} (PDF)...`, 'success');
    }

    // Open WhatsApp Chat with Tutor
    function openChatTutor() {
      const data = childrenProfiles[activeChildKey];
      const text = encodeURIComponent(`Halo Kak ${data.upcomingClass.tutor}, saya Ibu Dra. Nurhayati (wali murid ${data.fullName}). Ingin bertanya perkembangan materi belajar.`);
      window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
    }

    // Toast Notification System
    function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `p-3.5 rounded-xl shadow-xl border text-body-sm font-medium flex items-center gap-2.5 pointer-events-auto transform transition-all duration-200 translate-y-[-10px] opacity-0 ${
        type === 'success' 
          ? 'bg-light-surface text-light-on-surface border-success border-l-4 border-l-success' 
          : 'bg-light-surface text-light-on-surface border-brand-indigo border-l-4 border-l-brand-indigo'
      }`;

      const iconName = type === 'success' ? 'check_circle' : 'info';
      const iconColor = type === 'success' ? 'text-success' : 'text-brand-indigo';

      toast.innerHTML = `
        <span class="material-symbols-outlined ${iconColor} text-[20px] shrink-0">${iconName}</span>
        <span class="text-body-sm text-light-on-surface flex-1">${message}</span>
        <button type="button" onclick="this.parentElement.remove()" class="text-light-on-surface-variant hover:text-light-on-surface p-1">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      `;

      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-10px]', 'opacity-0');
      });

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => toast.remove(), 250);
      }, 4000);
    }
  

    window.switchChild = switchChild;
    window.switchTab = switchTab;
    window.showToast = showToast;
    window.downloadReceipt = downloadReceipt;
    window.openSessionDetailModal = openSessionDetailModal;
    window.closeSessionDetailModal = closeSessionDetailModal;
    window.openAbsenceNoticeModal = openAbsenceNoticeModal;
    window.closeAbsenceNoticeModal = closeAbsenceNoticeModal;
    window.toggleChildDropdown = toggleChildDropdown;
    window.openChatTutor = openChatTutor;
  }, []);

  return (
    <div className="bg-light-surface-soft text-light-on-surface font-body antialiased min-h-screen flex flex-col pb-24 lg:pb-0 selection:bg-brand-indigo selection:text-white">


  {/* Desktop Wrapper Container (Centered Mobile Viewport Frame) */}
  <div className="w-full max-w-xl mx-auto bg-light-surface-soft min-h-screen shadow-md flex flex-col border-x border-light-outline-variant/60 pb-24">

    {/* ============================================================== */}
    {/* MOBILE TOP BAR WITH CHILD SWITCHER                             */}
    {/* ============================================================== */}
    <header className="bg-light-surface border-b border-light-outline-variant px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-2.5">
        <a href="/" className="flex items-center gap-2.5 group focus:outline-hidden" title="Kembali ke Beranda">
          <div className="w-9 h-9 rounded-xl bg-light-primary text-light-on-primary flex items-center justify-center font-headline font-bold text-title-md shadow-xs group-hover:bg-brand-indigo-dark transition-colors">
            A
          </div>
        </a>
        <div>
          <h1 className="font-headline font-bold text-title-md text-brand-indigo leading-tight">Portal ARCI Bimbel</h1>
          <p id="portal-parent-greeting" className="text-[11px] text-light-on-surface-variant font-medium">Selamat datang, Ibu Dra. Nurhayati</p>
        </div>
      </div>

      {/* Student Switcher Trigger (For parents with 1+ enrolled children) */}
      <div className="relative">
        <button 
          type="button" 
          id="btn-child-switcher" 
          onClick={() => (window as any).toggleChildDropdown?.()} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-light-surface-container-low border border-light-outline-variant hover:border-light-primary text-[11px] font-label font-bold text-light-on-surface shadow-2xs transition-colors min-h-[38px]">
          <span className="material-symbols-outlined text-[15px] text-light-primary">face</span>
          <span id="active-child-name">Farhan (SMP 8)</span>
          <span className="material-symbols-outlined text-[15px] text-light-on-surface-variant">expand_more</span>
        </button>

        {/* Child Switcher Dropdown Menu */}
        <div id="dropdown-child-switcher" className="hidden absolute right-0 mt-1.5 w-60 bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <p className="px-2.5 py-1 text-[10px] font-label font-bold text-light-on-surface-variant uppercase tracking-wider">Pilih Profil Siswa</p>
          
          {/* Child 1 */}
          <button 
            type="button" 
            onClick={() => (window as any).switchChild?.("farhan")} 
            id="item-child-farhan" 
            className="w-full text-left p-2.5 rounded-xl bg-light-primary-container/40 border border-light-primary/30 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-light-primary text-light-on-primary text-[11px] font-bold flex items-center justify-center">FP</div>
              <div>
                <p className="font-bold text-body-sm text-light-on-surface">Farhan Pratama</p>
                <p className="text-[10px] text-light-on-surface-variant">SMP Kelas 8-A &bull; Reguler</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-light-primary text-[18px]">check_circle</span>
          </button>

          {/* Child 2 */}
          <button 
            type="button" 
            onClick={() => (window as any).switchChild?.("nadia")} 
            id="item-child-nadia" 
            className="w-full text-left p-2.5 rounded-xl hover:bg-light-surface-container flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent text-on-accent text-[11px] font-bold flex items-center justify-center">NA</div>
              <div>
                <p className="font-semibold text-body-sm text-light-on-surface">Nadia Amanda</p>
                <p className="text-[10px] text-light-on-surface-variant">SMA Kelas 12 &bull; Intensif UTBK</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-transparent text-[18px]">check_circle</span>
          </button>

          <div className="pt-1 border-t border-light-outline-variant/60 flex items-center justify-between px-2 text-[11px]">
            <a href="/login" className="text-danger font-semibold hover:underline flex items-center gap-1 py-1">
              <span className="material-symbols-outlined text-[14px]">logout</span>
              Keluar Akun
            </a>
            <a href="/" className="text-light-primary font-semibold hover:underline py-1">Beranda Web</a>
          </div>
        </div>
      </div>
    </header>

    {/* ============================================================== */}
    {/* TAB CONTENT SECTIONS (BERANDA, JADWAL, MATERI, TAGIHAN)         */}
    {/* ============================================================== */}

    {/* ============================================================== */}
    {/* SECTION 1: BERANDA / OVERVIEW                                  */}
    {/* ============================================================== */}
    <main id="tab-content-home" className="p-4 flex flex-col gap-4 flex-1">
      
      {/* Next Upcoming Class Hero Card */}
      <section className="bg-gradient-to-br from-light-primary-container/70 via-light-surface-soft to-light-surface rounded-2xl border-2 border-light-primary/40 p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-light-primary text-light-on-primary font-bold shadow-2xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Sesi Belajar Berikutnya
          </span>
          <span id="card-session-time" className="text-[11px] text-brand-indigo font-bold bg-light-surface px-2 py-0.5 rounded-md border border-light-outline-variant font-mono">
            Hari Ini &bull; 16:00 WIB
          </span>
        </div>

        <div>
          <h2 id="card-session-title" className="font-headline text-headline-sm font-bold text-light-on-surface">
            Matematika SMP Kelas 8-A
          </h2>
          <p id="card-session-topic" className="text-body-sm text-light-on-surface-variant mt-0.5 font-medium">
            Topik: Sistem Persamaan Linear Dua Variabel (SPLDV) — Eliminasi Cepat
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-light-outline-variant text-body-sm text-light-on-surface">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-light-on-surface">
              <span className="material-symbols-outlined text-[18px] text-light-primary">person</span>
              <span id="card-session-tutor">Kak Budi Pratama</span>
            </span>
            <span className="flex items-center gap-1.5 text-light-on-surface">
              <span className="material-symbols-outlined text-[18px] text-light-primary">location_on</span>
              <span id="card-session-room">Ruang Galileo (Sudirman)</span>
            </span>
          </div>
          
          <button 
            type="button" 
            onClick={() => (window as any).openSessionDetailModal?.()} 
            className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-label-sm font-label font-bold hover:bg-brand-indigo-dark shadow-2xs transition-colors self-start sm:self-auto min-h-[36px]">
            Detail Sesi &amp; Zoom
          </button>
        </div>
      </section>

      {/* Academic & Attendance Snapshot (2 Cols Grid) */}
      <section className="grid grid-cols-2 gap-3">
        
        {/* Attendance Metric Card */}
        <div className="p-3.5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-label font-bold text-light-on-surface-variant uppercase tracking-wider">Kehadiran Siswa</span>
            <span className="w-6 h-6 rounded-md bg-success/15 text-success flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            </span>
          </div>
          <div className="mt-2.5">
            <span id="stat-attendance-rate" className="font-headline font-bold text-title-lg text-success">100% Hadir</span>
            <p id="stat-attendance-detail" className="text-[11px] text-light-on-surface-variant mt-0.5">12 dari 12 sesi dihadiri</p>
            <div className="w-full bg-light-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
              <div id="stat-attendance-bar" className="bg-success h-full rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>

        {/* Tryout Average Metric Card */}
        <div className="p-3.5 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-label font-bold text-light-on-surface-variant uppercase tracking-wider">Rata-rata Tryout</span>
            <span className="w-6 h-6 rounded-md bg-light-primary-container text-light-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">analytics</span>
            </span>
          </div>
          <div className="mt-2.5">
            <span id="stat-tryout-score" className="font-headline font-bold text-title-lg text-brand-indigo">84.5 / 100</span>
            <p id="stat-tryout-trend" className="text-[11px] text-success font-semibold mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              Naik 8 poin dari bln lalu
            </p>
            <div className="w-full bg-light-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
              <div id="stat-tryout-bar" className="bg-brand-indigo h-full rounded-full" style={{ width: "84.5%" }}></div>
            </div>
          </div>
        </div>

      </section>

      {/* Latest Tutor Note to Parent */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-2xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-label-sm font-label text-brand-indigo font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            <span id="tutor-note-title">Catatan Tutor Terakhir (Kak Budi):</span>
          </span>
          <span id="tutor-note-date" className="text-[11px] text-light-on-surface-variant font-mono">17 Nov 2026</span>
        </div>
        <p id="tutor-note-body" className="text-body-sm text-light-on-surface italic bg-light-surface-soft p-3.5 rounded-xl border border-light-outline-variant/70 leading-relaxed">
          “Farhan sangat fokus dan cepat memahami metode eliminasi SPLDV. Sudah mandiri menyelesaikan latihan di kelas dan aktif mengajukan pertanyaan.”
        </p>
        <div className="flex items-center justify-between pt-1 text-[11px] text-light-on-surface-variant">
          <span className="flex items-center gap-1 text-success font-medium">
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            Terbaca oleh wali murid
          </span>
          <button type="button" onClick={() => (window as any).openChatTutor?.()} className="text-light-primary font-semibold hover:underline flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[13px]">chat</span>
            Balas via WhatsApp
          </button>
        </div>
      </section>

      {/* Financial Status & Billing Card */}
      <section className="bg-light-surface rounded-2xl border border-light-outline-variant p-4 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-light-primary text-[20px]">receipt_long</span>
            <span className="font-headline font-bold text-title-md text-light-on-surface">Tagihan &amp; SPP Belajar</span>
          </div>
          <span id="billing-status-badge" className="px-2.5 py-0.5 rounded-full text-[11px] font-label bg-success text-on-success font-bold shadow-2xs">
            Lunas
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-light-surface-soft border border-light-outline-variant flex items-center justify-between text-body-sm gap-2">
          <div>
            <p id="billing-invoice-title" className="font-semibold text-light-on-surface">SPP November 2026</p>
            <p id="billing-invoice-meta" className="text-[11px] text-light-on-surface-variant font-mono">Invoice #INV-2026-1189 &bull; Rp1.100.000</p>
          </div>
          <button 
            type="button" 
            onClick={() => (window as any).downloadReceipt?.("INV-2026-1189")} 
            className="px-3 py-1.5 rounded-lg border border-light-outline text-light-on-surface text-[11px] font-label font-semibold hover:bg-light-surface shadow-2xs transition-colors shrink-0 flex items-center gap-1 min-h-[36px]">
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>Unduh Kuitansi</span>
          </button>
        </div>
      </section>

      {/* Quick Action Utilities Grid */}
      <section className="grid grid-cols-2 gap-3 pt-1">
        <button 
          type="button" 
          onClick={() => (window as any).openAbsenceNoticeModal?.()} 
          className="p-3 rounded-xl bg-light-surface border border-light-outline-variant hover:border-light-primary shadow-2xs flex items-center gap-2.5 text-left transition-colors min-h-[44px]">
          <span className="material-symbols-outlined text-amber-600 text-[22px]">event_busy</span>
          <div>
            <p className="font-bold text-body-sm text-light-on-surface">Ajukan Izin Absen</p>
            <p className="text-[10px] text-light-on-surface-variant">Sakit / keperluan dinas</p>
          </div>
        </button>

        <a 
          href="portal-jadwal-materi.html" 
          className="p-3 rounded-xl bg-light-surface border border-light-outline-variant hover:border-light-primary shadow-2xs flex items-center gap-2.5 text-left transition-colors min-h-[44px]">
          <span className="material-symbols-outlined text-brand-indigo text-[22px]">menu_book</span>
          <div>
            <p className="font-bold text-body-sm text-light-on-surface">Jadwal &amp; Tugas PR</p>
            <p className="text-[10px] text-light-on-surface-variant">Unduh modul &amp; tugas</p>
          </div>
        </a>
      </section>

    </main>

    {/* ============================================================== */}
    {/* SECTION 2: JADWAL KELAS LENGKAP                                */}
    {/* ============================================================== */}
    <main id="tab-content-jadwal" className="hidden p-4 flex flex-col gap-4 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-title-lg text-brand-indigo">Jadwal Sesi Belajar</h2>
          <p className="text-[12px] text-light-on-surface-variant">Kalender sesi mingguan &amp; link siaran langsung</p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-light-primary-container text-light-primary font-bold text-[11px] font-mono">
          Pekan ke-3 Nov 2026
        </span>
      </div>

      {/* Schedule Timeline Cards */}
      <div className="space-y-3">
        
        {/* Sesi Hari Ini */}
        <div className="p-4 rounded-2xl bg-light-surface border-2 border-light-primary shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success text-on-success">HARI INI</span>
            <span className="text-body-sm font-bold text-brand-indigo font-mono">16:00 – 17:30 WIB</span>
          </div>
          <div>
            <h3 className="font-bold text-body-md text-light-on-surface">Matematika SMP Kelas 8-A</h3>
            <p className="text-body-sm text-light-on-surface-variant">Materi: Sistem Persamaan Linear Dua Variabel (SPLDV)</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant text-[12px] text-light-on-surface-variant">
            <span>Tutor: Kak Budi Pratama</span>
            <span className="font-medium text-brand-indigo">Ruang Galileo (Lantai 2)</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-light-primary text-light-on-primary text-center text-label-sm font-bold shadow-2xs hover:bg-brand-indigo-dark transition-colors flex items-center justify-center gap-1.5 min-h-[38px]">
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              <span>Akses Zoom Hybrid</span>
            </a>
            <button type="button" onClick={() => (window as any).openAbsenceNoticeModal?.()} className="px-3 py-2 rounded-lg border border-light-outline text-light-on-surface text-label-sm font-medium hover:bg-light-surface-container transition-colors min-h-[38px]">
              Izin Sesi Ini
            </button>
          </div>
        </div>

        {/* Sesi Berikutnya: Sabtu */}
        <div className="p-4 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-light-surface-container text-light-on-surface">SABTU, 21 NOV</span>
            <span className="text-body-sm font-bold text-light-on-surface font-mono">09:00 – 10:30 WIB</span>
          </div>
          <div>
            <h3 className="font-bold text-body-md text-light-on-surface">IPA Fisika SMP Kelas 8</h3>
            <p className="text-body-sm text-light-on-surface-variant">Materi: Tekanan Zat &amp; Penerapannya dalam Kehidupan</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant text-[12px] text-light-on-surface-variant">
            <span>Tutor: Kak Dimas Arya</span>
            <span>Lab Sains Sudirman</span>
          </div>
        </div>

        {/* Sesi Berikutnya: Senin */}
        <div className="p-4 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-light-surface-container text-light-on-surface">SENIN, 23 NOV</span>
            <span className="text-body-sm font-bold text-light-on-surface font-mono">16:00 – 17:30 WIB</span>
          </div>
          <div>
            <h3 className="font-bold text-body-md text-light-on-surface">Bahasa Inggris: Reading &amp; Grammar</h3>
            <p className="text-body-sm text-light-on-surface-variant">Materi: Past Continuous &amp; Narrative Text Analysis</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant text-[12px] text-light-on-surface-variant">
            <span>Tutor: Kak Amanda Putri</span>
            <span>Ruang Einstein (Lantai 1)</span>
          </div>
        </div>

      </div>
    </main>

    {/* ============================================================== */}
    {/* SECTION 3: MATERI, MODUL & RAPOR                               */}
    {/* ============================================================== */}
    <main id="tab-content-materi" className="hidden p-4 flex flex-col gap-4 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-bold text-title-lg text-brand-indigo">Materi &amp; Rapor Akademik</h2>
          <p className="text-[12px] text-light-on-surface-variant">Modul ajar, rekaman video &amp; perkembangan tryout</p>
        </div>
        <a href="portal-rapor.html" className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-label-sm font-bold shadow-2xs hover:bg-brand-indigo-dark transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">analytics</span>
          <span>Buka Rapor</span>
        </a>
      </div>

      {/* Tryout Performance Card */}
      <div className="p-4 rounded-2xl bg-light-surface border border-light-outline-variant shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline font-bold text-title-md text-light-on-surface">Hasil Tryout Terakhir (TO-04)</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success text-on-success">Nilai: 88</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-body-sm">
          <div className="p-2 rounded-xl bg-light-surface-soft border border-light-outline-variant">
            <p className="text-[11px] text-light-on-surface-variant font-medium">Matematika</p>
            <p className="font-headline font-bold text-title-md text-brand-indigo mt-0.5">92</p>
          </div>
          <div className="p-2 rounded-xl bg-light-surface-soft border border-light-outline-variant">
            <p className="text-[11px] text-light-on-surface-variant font-medium">IPA Fisika</p>
            <p className="font-headline font-bold text-title-md text-brand-indigo mt-0.5">85</p>
          </div>
          <div className="p-2 rounded-xl bg-light-surface-soft border border-light-outline-variant">
            <p className="text-[11px] text-light-on-surface-variant font-medium">B. Inggris</p>
            <p className="font-headline font-bold text-title-md text-brand-indigo mt-0.5">87</p>
          </div>
        </div>

        <p className="text-[12px] text-light-on-surface-variant italic">
          *Peringkat ke-3 dari 32 siswa rombel SMP 8 Sudirman.
        </p>
      </div>

      {/* Downloadable Modul & Video */}
      <div className="space-y-2.5">
        <p className="font-label text-label-sm font-bold text-light-on-surface uppercase tracking-wider">Modul Pembelajaran Tersedia</p>
        
        {/* Modul 1 */}
        <div className="p-3 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
              PDF
            </div>
            <div>
              <p className="font-bold text-body-sm text-light-on-surface">Modul Matematika Bab 4 — SPLDV</p>
              <p className="text-[11px] text-light-on-surface-variant">24 Halaman &bull; Rangkuman Rumus &amp; Bank Soal</p>
            </div>
          </div>
          <button type="button" onClick={() => (window as any).showToast?.("Mengunduh Modul Matematika SPLDV (PDF)...", "success")} className="p-2 rounded-lg hover:bg-light-surface-container text-light-primary" title="Unduh Modul">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>

        {/* Modul 2 */}
        <div className="p-3 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              VID
            </div>
            <div>
              <p className="font-bold text-body-sm text-light-on-surface">Video Rekaman Sesi 11: Trik Cepat Eliminasi</p>
              <p className="text-[11px] text-light-on-surface-variant">Durasi: 42 Menit &bull; Tutor Budi Pratama</p>
            </div>
          </div>
          <button type="button" onClick={() => (window as any).showToast?.("Membuka video rekaman sesi kelas...", "info")} className="p-2 rounded-lg hover:bg-light-surface-container text-light-primary" title="Tonton Video">
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
          </button>
        </div>

        {/* Modul 3 */}
        <div className="p-3 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
              PDF
            </div>
            <div>
              <p className="font-bold text-body-sm text-light-on-surface">Bank Soal Tryout Mandiri SMP Semester Ganjil</p>
              <p className="text-[11px] text-light-on-surface-variant">50 Soal HOTS + Kunci Jawaban Lengkap</p>
            </div>
          </div>
          <button type="button" onClick={() => (window as any).showToast?.("Mengunduh Bank Soal Tryout (PDF)...", "success")} className="p-2 rounded-lg hover:bg-light-surface-container text-light-primary" title="Unduh Modul">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>

      </div>
    </main>

    {/* ============================================================== */}
    {/* SECTION 4: TAGIHAN & INVOICE SPP                               */}
    {/* ============================================================== */}
    <main id="tab-content-tagihan" className="hidden p-4 flex flex-col gap-4 flex-1">
      <div>
        <h2 className="font-headline font-bold text-title-lg text-brand-indigo">Status Keuangan &amp; Tagihan SPP</h2>
        <p className="text-[12px] text-light-on-surface-variant">Rincian invoice bulanan, kuitansi resmi, dan pembayaran</p>
      </div>

      {/* Current Billing Summary Card */}
      <div className="p-4 rounded-2xl bg-light-surface border-2 border-success/40 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label text-label-sm font-bold text-light-on-surface uppercase">Bulan Berjalan</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success text-on-success">
            Semua Tagihan Lunas
          </span>
        </div>
        <div>
          <span className="text-[11px] text-light-on-surface-variant font-label">Total Dibayarkan (Nov 2026):</span>
          <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-0.5">Rp1.100.000</p>
        </div>
        <p className="text-[12px] text-light-on-surface-variant">
          Tagihan berikutnya (SPP Desember 2026) akan diterbitkan pada tanggal <strong>1 Desember 2026</strong>.
        </p>
      </div>

      {/* Invoice History Table */}
      <div className="space-y-2.5">
        <p className="font-label text-label-sm font-bold text-light-on-surface uppercase tracking-wider">Riwayat Pembayaran</p>

        {/* Invoice 1 */}
        <div className="p-3.5 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-body-sm text-light-on-surface">SPP November 2026</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-success/15 text-success">Lunas</span>
            </div>
            <p className="text-[11px] text-light-on-surface-variant font-mono mt-0.5">INV-2026-1189 &bull; Dibayar 02 Nov 2026 (Transfer BCA)</p>
          </div>
          <button type="button" onClick={() => (window as any).downloadReceipt?.("INV-2026-1189")} className="px-2.5 py-1.5 rounded-lg border border-light-outline text-xs font-semibold hover:bg-light-surface-container flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">receipt</span>
            <span>Kuitansi</span>
          </button>
        </div>

        {/* Invoice 2 */}
        <div className="p-3.5 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-body-sm text-light-on-surface">SPP Oktober 2026</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-success/15 text-success">Lunas</span>
            </div>
            <p className="text-[11px] text-light-on-surface-variant font-mono mt-0.5">INV-2026-1044 &bull; Dibayar 03 Okt 2026 (Transfer BCA)</p>
          </div>
          <button type="button" onClick={() => (window as any).downloadReceipt?.("INV-2026-1044")} className="px-2.5 py-1.5 rounded-lg border border-light-outline text-xs font-semibold hover:bg-light-surface-container flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">receipt</span>
            <span>Kuitansi</span>
          </button>
        </div>

        {/* Invoice 3 */}
        <div className="p-3.5 rounded-xl bg-light-surface border border-light-outline-variant shadow-2xs flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-body-sm text-light-on-surface">Registrasi &amp; Modul Awal</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-success/15 text-success">Lunas</span>
            </div>
            <p className="text-[11px] text-light-on-surface-variant font-mono mt-0.5">INV-2026-0891 &bull; Dibayar 15 Agu 2026 (QRIS)</p>
          </div>
          <button type="button" onClick={() => (window as any).downloadReceipt?.("INV-2026-0891")} className="px-2.5 py-1.5 rounded-lg border border-light-outline text-xs font-semibold hover:bg-light-surface-container flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">receipt</span>
            <span>Kuitansi</span>
          </button>
        </div>

      </div>

      {/* Payment Support Card */}
      <div className="p-4 rounded-xl bg-light-primary-container/40 border border-light-primary/20 flex items-center justify-between text-body-sm">
        <div>
          <p className="font-bold text-brand-indigo">Butuh Bantuan Tagihan?</p>
          <p className="text-[11px] text-light-on-primary-container">Konfirmasi mutasi &amp; konsultasi bagian keuangan</p>
        </div>
        <a href="https://wa.me/6281234567890?text=Halo%20Admin%20Keuangan%20ARCI,%20saya%20ingin%20konfirmasi%20SPP" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-light-primary text-light-on-primary text-xs font-bold hover:bg-brand-indigo-dark transition-colors shrink-0">
          Chat Kasir
        </a>
      </div>

    </main>

    {/* ============================================================== */}
    {/* STICKY BOTTOM MOBILE NAVIGATION FOR PORTAL                     */}
    {/* ============================================================== */}
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-light-surface/95 backdrop-blur-md border-t border-light-outline-variant px-6 py-2 shadow-lg pb-safe">
      <div className="w-full max-w-xl mx-auto flex items-center justify-between">
        
        {/* Tab 1: Home */}
        <a 
          href="#portal-home" 
          id="nav-btn-home" 
          onClick={(e) => (window as any).switchTab?.("home", e)} 
          className="flex flex-col items-center gap-0.5 text-light-primary font-label text-[11px] font-bold transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span>Beranda</span>
        </a>

        {/* Tab 2: Jadwal */}
        <a 
          href="#portal-jadwal" 
          id="nav-btn-jadwal" 
          onClick={(e) => (window as any).switchTab?.("jadwal", e)} 
          className="flex flex-col items-center gap-0.5 text-light-on-surface-variant hover:text-light-primary font-label text-[11px] font-medium transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          <span>Jadwal</span>
        </a>

        {/* Tab 3: Materi */}
        <a 
          href="#portal-materi" 
          id="nav-btn-materi" 
          onClick={(e) => (window as any).switchTab?.("materi", e)} 
          className="flex flex-col items-center gap-0.5 text-light-on-surface-variant hover:text-light-primary font-label text-[11px] font-medium transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">book</span>
          <span>Materi</span>
        </a>

        {/* Tab 4: Tagihan */}
        <a 
          href="#portal-tagihan" 
          id="nav-btn-tagihan" 
          onClick={(e) => (window as any).switchTab?.("tagihan", e)} 
          className="flex flex-col items-center gap-0.5 text-light-on-surface-variant hover:text-light-primary font-label text-[11px] font-medium transition-colors min-h-[44px] min-w-[56px] justify-center">
          <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          <span>Tagihan</span>
        </a>

      </div>
    </nav>

  </div>

  {/* ============================================================== */}
  {/* MODAL: AJUKAN IZIN KETIDAKHADIRAN                              */}
  {/* ============================================================== */}
  <div id="modal-absence" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
      
      <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
        <div className="flex items-center gap-2 text-brand-indigo">
          <span className="material-symbols-outlined text-[20px]">event_busy</span>
          <h3 className="font-headline font-bold text-title-md text-light-on-surface">Ajukan Izin Absen Siswa</h3>
        </div>
        <button type="button" onClick={() => (window as any).closeAbsenceNoticeModal?.()} className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <form id="form-absence-notice"  className="p-5 space-y-3 text-body-sm">
        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Nama Siswa</label>
          <input type="text" id="absence-student-name" readOnly value="Farhan Pratama (SMP 8-A)" className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-light-on-surface font-medium min-h-[40px]" />
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Sesi Kelas yang Diizinkan</label>
          <select className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface min-h-[40px]">
            <option selected>Hari Ini — Matematika (16:00 - 17:30 WIB)</option>
            <option>Sabtu, 21 Nov — IPA Fisika (09:00 - 10:30 WIB)</option>
            <option>Senin, 23 Nov — Bahasa Inggris (16:00 - 17:30 WIB)</option>
          </select>
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Alasan Tidak Hadir</label>
          <select id="absence-reason-select" className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface min-h-[40px]">
            <option value="Sakit">Sakit (Demam / Kurang Enak Badan)</option>
            <option value="Lomba">Mengikuti Lomba / Acara Sekolah</option>
            <option value="Keluarga">Acara Keluarga / Kepentingan Mendesak</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-label-sm font-semibold text-light-on-surface mb-1">Pesan / Catatan untuk Tutor</label>
          <textarea rows={2} placeholder="Mohon izin tidak dapat hadir tatap muka. Minta link rekaman kelas..." className="w-full px-3 py-2 rounded-lg border border-light-outline text-body-sm bg-light-surface text-light-on-surface"></textarea>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button type="button" onClick={() => (window as any).closeAbsenceNoticeModal?.()} className="flex-1 py-2.5 rounded-lg border border-light-outline text-light-on-surface font-semibold text-body-sm min-h-[44px]">
            Batal
          </button>
          <button type="submit" className="flex-1 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-bold text-body-sm hover:bg-brand-indigo-dark min-h-[44px]">
            Kirim Izin
          </button>
        </div>
      </form>

    </div>
  </div>

  {/* ============================================================== */}
  {/* MODAL: DETAIL SESI KELAS & HYBRID ZOOM LINK                    */}
  {/* ============================================================== */}
  <div id="modal-session-detail" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
      
      <div className="px-5 py-4 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-soft">
        <h3 className="font-headline font-bold text-title-md text-light-on-surface">Rincian Sesi Belajar</h3>
        <button type="button" onClick={() => (window as any).closeSessionDetailModal?.()} className="text-light-on-surface-variant hover:text-light-on-surface p-1 rounded-lg">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="p-5 space-y-3 text-body-sm">
        <div className="p-3 rounded-xl bg-light-primary-container/40 border border-light-primary/20">
          <p className="font-bold text-brand-indigo" id="modal-class-title">Matematika SMP Kelas 8-A</p>
          <p className="text-[12px] text-light-on-surface-variant mt-0.5">Topik: Sistem Persamaan Linear Dua Variabel (SPLDV)</p>
        </div>

        <div className="space-y-1.5 text-body-sm text-light-on-surface">
          <div className="flex items-center justify-between py-1 border-b border-light-outline-variant/60">
            <span className="text-light-on-surface-variant">Jadwal Sesi</span>
            <span className="font-semibold font-mono">Kamis, 16:00 – 17:30 WIB</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-light-outline-variant/60">
            <span className="text-light-on-surface-variant">Lokasi / Ruang</span>
            <span className="font-semibold">Ruang Galileo (Lantai 2)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-light-outline-variant/60">
            <span className="text-light-on-surface-variant">Tutor Pengampu</span>
            <span className="font-semibold">Kak Budi Pratama, S.Si.</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-light-on-surface-variant">Format Sesi</span>
            <span className="font-semibold text-success">Tatap Muka &amp; Hybrid Zoom</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-light-primary text-light-on-primary font-bold text-center hover:bg-brand-indigo-dark transition-colors flex items-center justify-center gap-2 min-h-[44px]">
            <span className="material-symbols-outlined text-[18px]">videocam</span>
            <span>Buka Tautan Zoom Kelas</span>
          </a>
          <button type="button" onClick={() => (window as any).closeSessionDetailModal?.()} className="w-full py-2.5 rounded-xl border border-light-outline text-light-on-surface font-semibold text-center hover:bg-light-surface-container transition-colors min-h-[44px]">
            Tutup
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
  {/* JAVASCRIPT STATE ENGINE                                        */}
  {/* ============================================================== */}
  

    </div>
  );
}
