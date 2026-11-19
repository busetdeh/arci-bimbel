"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    goToStep?: (step: number) => void;
    updateBranchSelection?: (radio: HTMLInputElement) => void;
    updateProgramSelection?: (radio: HTMLInputElement) => void;
    submitFinalRegistration?: () => void;
  }
}

export default function PendaftaranPage() {
  useEffect(() => {
    let currentStep = 1;
    let selectedProgramPrice = 950000;
    let registrationFee = 150000;
    let selectedProgramTitle = "Program Reguler SMP Kelas 8";
    let selectedBranchTitle = "Cabang Sudirman (Tatap Muka)";

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("step")) {
      const stepParam = parseInt(urlParams.get("step") || "1");
      if (stepParam >= 1 && stepParam <= 4) {
        currentStep = stepParam;
      }
    }

    function formatRupiah(amount: number) {
      return "Rp" + amount.toLocaleString("id-ID");
    }

    function syncReviewData() {
      const pName = (document.getElementById("parent-name") as HTMLInputElement)?.value || "Dra. Hj. Nurhayati";
      const pRelation = document.getElementById("parent-relation") as HTMLSelectElement;
      const pRelationText = pRelation?.options[pRelation.selectedIndex]?.text || "Ibu Kandung";
      const pPhone = (document.getElementById("parent-whatsapp") as HTMLInputElement)?.value || "812-9876-5432";
      const pCity = (document.getElementById("parent-city") as HTMLInputElement)?.value || "Jakarta Selatan";

      const sName = (document.getElementById("student-name") as HTMLInputElement)?.value || "Farhan Pratama";
      const sSchool = (document.getElementById("student-school") as HTMLInputElement)?.value || "SMP Labschool Kebayoran";
      const sGrade = document.getElementById("student-grade") as HTMLSelectElement;
      const sGradeText = sGrade?.options[sGrade.selectedIndex]?.text || "Kelas 8 SMP";
      const sTarget = document.getElementById("student-target") as HTMLSelectElement;
      const sTargetText = sTarget?.options[sTarget.selectedIndex]?.text || "Masuk SMA Unggulan (Target SMAN 8 / Lab)";

      const scheduleDays = document.getElementById("schedule-days") as HTMLSelectElement;
      const scheduleDaysText = scheduleDays?.options[scheduleDays.selectedIndex]?.text || "Senin, Rabu, Jumat (3x Seminggu)";
      const scheduleTime = document.getElementById("schedule-time") as HTMLSelectElement;
      const scheduleTimeText = scheduleTime?.options[scheduleTime.selectedIndex]?.text || "Sesi Sore: 16.00 - 17.30 WIB";

      const setEl = (id: string, text: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setEl("review-parent-name", pName);
      setEl("review-parent-relation", pRelationText);
      setEl("review-parent-phone", "+62 " + pPhone);
      setEl("review-parent-city", pCity);

      setEl("review-student-name", sName);
      setEl("review-student-school", sSchool);
      setEl("review-student-grade", sGradeText);
      setEl("review-student-target", sTargetText);

      setEl("review-program-title", selectedProgramTitle);
      setEl("review-branch-title", selectedBranchTitle);
      setEl("review-schedule-title", `${scheduleDaysText} (${scheduleTimeText})`);

      setEl("review-price-program", formatRupiah(selectedProgramPrice));
      setEl("review-price-total", formatRupiah(selectedProgramPrice + registrationFee));

      setEl("summary-student-header", sName);
      setEl("summary-grade-header", sGradeText);
    }

    function goToStep(step: number) {
      if (step < 1 || step > 4) return;
      currentStep = step;

      document.querySelectorAll(".step-section").forEach((sec) => {
        sec.classList.add("hidden");
        sec.classList.remove("flex");
      });
      const targetSec = document.getElementById(`step-${step}-content`);
      if (targetSec) {
        targetSec.classList.remove("hidden");
        targetSec.classList.add("flex");
      }

      const mainContainer = document.getElementById("registration-main-container");
      if (mainContainer) {
        mainContainer.classList.remove("max-w-xl");
        mainContainer.classList.add("max-w-4xl");
      }
      const mainCard = document.getElementById("registration-main-card");
      if (mainCard) {
        mainCard.classList.remove("items-center", "text-center");
      }
      const stepperNav = document.getElementById("stepper-nav") || document.querySelector("nav[aria-label=\"Progress Pendaftaran\"]");
      if (stepperNav) stepperNav.classList.remove("hidden");

      const progressBar = document.getElementById("step-progress-bar");
      const progressWidths = [25, 50, 75, 100];
      if (progressBar) {
        progressBar.style.width = `${progressWidths[step - 1]}%`;
      }

      const navItems = document.querySelectorAll(".step-nav-item");
      navItems.forEach((btn, idx) => {
        const itemStep = idx + 1;
        const indicator = btn.querySelector(".step-indicator");
        const label = btn.querySelector(".step-label");

        if (indicator && label) {
          if (itemStep < step) {
            indicator.className = "step-indicator w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-success text-on-success flex items-center justify-center text-label-sm font-bold shadow-xs transition-all";
            indicator.innerHTML = "<span class=\"material-symbols-outlined text-[16px]\">check</span>";
            label.className = "step-label text-[11px] sm:text-label-sm font-label font-semibold text-success truncate max-w-[75px] sm:max-w-none";
          } else if (itemStep === step) {
            indicator.className = "step-indicator w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-light-primary text-light-on-primary ring-4 ring-light-primary-container flex items-center justify-center text-label-sm font-bold shadow-xs transition-all";
            indicator.innerHTML = `${itemStep}`;
            label.className = "step-label text-[11px] sm:text-label-sm font-label font-bold text-light-primary truncate max-w-[75px] sm:max-w-none";
          } else {
            indicator.className = "step-indicator w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-light-surface-container text-light-on-surface-variant flex items-center justify-center text-label-sm font-bold transition-all";
            indicator.innerHTML = `${itemStep}`;
            label.className = "step-label text-[11px] sm:text-label-sm font-label text-light-on-surface-variant truncate max-w-[75px] sm:max-w-none";
          }
        }
      });

      if (step === 4) {
        syncReviewData();
      }

      window.scrollTo({ top: 80, behavior: "smooth" });
    }

    function updateBranchSelection(radio: HTMLInputElement) {
      document.querySelectorAll(".branch-option").forEach((el) => {
        el.classList.remove("border-2", "border-light-primary", "bg-light-primary-container/20");
        el.classList.add("border", "border-light-outline", "bg-light-surface");
      });
      const selectedLabel = radio.closest(".branch-option");
      if (selectedLabel) {
        selectedLabel.classList.remove("border", "border-light-outline", "bg-light-surface");
        selectedLabel.classList.add("border-2", "border-light-primary", "bg-light-primary-container/20");
      }

      if (radio.value === "sudirman") {
        selectedBranchTitle = "Cabang Sudirman (Tatap Muka)";
      } else {
        selectedBranchTitle = "Cabang Bintaro (Tatap Muka)";
      }
    }

    function updateProgramSelection(radio: HTMLInputElement) {
      document.querySelectorAll(".program-option").forEach((el) => {
        el.classList.remove("border-2", "border-light-primary", "bg-light-primary-container/20");
        el.classList.add("border", "border-light-outline", "bg-light-surface");
      });
      const selectedLabel = radio.closest(".program-option");
      if (selectedLabel) {
        selectedLabel.classList.remove("border", "border-light-outline", "bg-light-surface");
        selectedLabel.classList.add("border-2", "border-light-primary", "bg-light-primary-container/20");
      }

      if (radio.value === "smp-8-reguler") {
        selectedProgramTitle = "Program Reguler SMP Kelas 8";
        selectedProgramPrice = 950000;
      } else if (radio.value === "smp-8-intensif") {
        selectedProgramTitle = "Program Intensif Juara SMP Kelas 8";
        selectedProgramPrice = 1350000;
      }
    }

    function submitFinalRegistration() {
      const consentCheck = document.getElementById("consent-check") as HTMLInputElement;
      if (consentCheck && !consentCheck.checked) {
        alert("Silakan setujui Syarat & Ketentuan serta Kebijakan Privasi terlebih dahulu.");
        consentCheck.focus();
        return;
      }

      const submitBtn = document.getElementById("btn-submit-registration") as HTMLButtonElement;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="inline-block animate-spin mr-2">⟳</span>
          Menyimpan &amp; Memproses...
        `;
      }

      setTimeout(() => {
        document.querySelectorAll(".step-section").forEach((sec) => {
          sec.classList.add("hidden");
          sec.classList.remove("flex");
        });
        const successSec = document.getElementById("step-success-content");
        if (successSec) {
          successSec.classList.remove("hidden");
          successSec.classList.add("flex");
        }

        const mainContainer = document.getElementById("registration-main-container");
        if (mainContainer) {
          mainContainer.classList.remove("max-w-4xl");
          mainContainer.classList.add("max-w-xl");
        }
        const mainCard = document.getElementById("registration-main-card");
        if (mainCard) {
          mainCard.classList.add("items-center", "text-center");
        }

        const sName = (document.getElementById("student-name") as HTMLInputElement)?.value || "Farhan Pratama";
        const setEl = (id: string, text: string) => {
          const el = document.getElementById(id);
          if (el) el.textContent = text;
        };
        setEl("success-student-name", sName);
        setEl("success-program-name", selectedProgramTitle);
        setEl("success-branch-name", selectedBranchTitle);

        const stepperNav = document.getElementById("stepper-nav") || document.querySelector("nav[aria-label=\"Progress Pendaftaran\"]");
        if (stepperNav) stepperNav.classList.add("hidden");

        window.scrollTo({ top: 40, behavior: "smooth" });
      }, 1000);
    }

    window.goToStep = goToStep;
    window.updateBranchSelection = updateBranchSelection;
    window.updateProgramSelection = updateProgramSelection;
    window.submitFinalRegistration = submitFinalRegistration;

    goToStep(currentStep);
  }, []);

  return (
    <div className="bg-light-surface text-light-on-surface font-body antialiased min-h-screen flex flex-col justify-between">


  {/* Header Ringkas Alur Task-Flow (Sticky, Focused, Non-Distracting) */}
  <header className="bg-light-surface border-b border-light-outline-variant px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-xs">
    <div className="flex items-center gap-3">
      <a href="/" className="flex items-center gap-1.5 sm:gap-2 text-light-on-surface hover:text-light-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-light-surface-container-low group">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        <span className="text-body-sm font-label font-semibold">Beranda</span>
      </a>
    </div>

    {/* Center Brand Badge */}
    <a href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-lg bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-label-md group-hover:bg-brand-indigo-dark transition-colors shadow-xs">
        A
      </div>
      <div className="flex flex-col">
        <span className="font-headline font-bold text-title-md text-brand-indigo leading-tight">ARCI Bimbel</span>
        <span className="text-[10px] text-light-on-surface-variant font-label leading-tight">Pendaftaran Siswa Baru</span>
      </div>
    </a>

    {/* Right Trust Security Indicator */}
    <div className="flex items-center gap-1.5 text-body-sm text-light-on-surface-variant bg-light-surface-container-low/70 px-2.5 py-1 rounded-full border border-light-outline-variant/60">
      <span className="material-symbols-outlined text-[17px] text-success">verified_user</span>
      <span className="hidden md:inline font-label text-label-sm font-medium">Terenkripsi Aman</span>
    </div>
  </header>

  {/* Main Multi-step Container */}
  <main id="registration-main-container" className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 md:py-10 transition-all duration-300">
    
    {/* Stepper Navigation Header (Fully Interactive & Responsive) */}
    <nav id="stepper-nav" aria-label="Progress Pendaftaran" className="bg-light-surface rounded-2xl border border-light-outline-variant p-3.5 sm:p-5 mb-6 md:mb-8 shadow-xs">
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3 text-center" id="stepper-container">
        
        {/* Step 1 Button/Item */}
        <button type="button" onClick={() => (window as any).goToStep?.(1)} className="step-nav-item flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none group transition-all" data-step="1">
          <div className="step-indicator w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-success text-on-success flex items-center justify-center text-label-sm font-bold shadow-xs transition-all">
            <span className="material-symbols-outlined text-[16px]">check</span>
          </div>
          <span className="step-label text-[11px] sm:text-label-sm font-label font-semibold text-success truncate max-w-[75px] sm:max-w-none">
            1. Data Wali
          </span>
        </button>

        {/* Step 2 Button/Item */}
        <button type="button" onClick={() => (window as any).goToStep?.(2)} className="step-nav-item flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none group transition-all" data-step="2">
          <div className="step-indicator w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-success text-on-success flex items-center justify-center text-label-sm font-bold shadow-xs transition-all">
            <span className="material-symbols-outlined text-[16px]">check</span>
          </div>
          <span className="step-label text-[11px] sm:text-label-sm font-label font-semibold text-success truncate max-w-[75px] sm:max-w-none">
            2. Data Siswa
          </span>
        </button>

        {/* Step 3 Button/Item (Active by Default as Requested) */}
        <button type="button" onClick={() => (window as any).goToStep?.(3)} className="step-nav-item flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none group transition-all" data-step="3">
          <div className="step-indicator w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-light-primary text-light-on-primary ring-4 ring-light-primary-container flex items-center justify-center text-label-sm font-bold shadow-xs transition-all">
            3
          </div>
          <span className="step-label text-[11px] sm:text-label-sm font-label font-bold text-light-primary truncate max-w-[75px] sm:max-w-none">
            3. Pilih Program
          </span>
        </button>

        {/* Step 4 Button/Item */}
        <button type="button" onClick={() => (window as any).goToStep?.(4)} className="step-nav-item flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none group transition-all" data-step="4">
          <div className="step-indicator w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-light-surface-container text-light-on-surface-variant flex items-center justify-center text-label-sm font-bold transition-all">
            4
          </div>
          <span className="step-label text-[11px] sm:text-label-sm font-label text-light-on-surface-variant truncate max-w-[75px] sm:max-w-none">
            4. Konfirmasi
          </span>
        </button>

      </div>

      {/* Linear Progress Bar */}
      <div className="w-full bg-light-surface-container-low h-1.5 rounded-full mt-4 overflow-hidden">
        <div id="step-progress-bar" className="bg-light-primary h-full rounded-full transition-all duration-300" style={{ width: "75%" }}></div>
      </div>
    </nav>

    {/* Main Registration Form Card */}
    <div id="registration-main-card" className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-sm p-5 sm:p-8 md:p-10 flex flex-col gap-6 md:gap-8 transition-all duration-300">
      
      {/* ============================================================== */}
      {/* STEP 1: DATA WALI / ORANG TUA                                  */}
      {/* ============================================================== */}
      <section id="step-1-content" className="step-section hidden flex flex-col gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-light-primary-container text-light-on-primary-container mb-2 font-semibold">
            Langkah 1 dari 4
          </span>
          <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
            Informasi Data Orang Tua / Wali Siswa
          </h1>
          <p className="text-body-md text-light-on-surface-variant mt-1">
            Data kontak wali diperlukan untuk konfirmasi pendaftaran, pengiriman jadwal, serta pelaporan progres belajar berkala.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Nama Lengkap Wali */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="parent-name" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Nama Lengkap Orang Tua / Wali</span>
              <span className="text-danger">*</span>
            </label>
            <input type="text" id="parent-name" name="parent_name" value="Bambang Pratama, S.E." required
              placeholder="Contoh: Bambang Pratama"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary" />
          </div>

          {/* Hubungan dengan Siswa */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="parent-relation" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Hubungan dengan Calon Siswa</span>
              <span className="text-danger">*</span>
            </label>
            <select id="parent-relation" name="parent_relation"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary">
              <option value="ayah" >Ayah Kandung</option>
              <option value="ibu">Ibu Kandung</option>
              <option value="wali">Wali / Keluarga</option>
            </select>
          </div>

          {/* Nomor WhatsApp Aktif */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="parent-whatsapp" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Nomor WhatsApp Aktif</span>
              <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-body-sm font-semibold text-light-on-surface-variant">
                +62
              </span>
              <input type="tel" id="parent-whatsapp" name="parent_whatsapp" value="81298765432" required
                placeholder="812-3456-7890"
                className="w-full min-h-[48px] pl-14 pr-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary" />
            </div>
            <span className="text-[11px] text-light-on-surface-variant">Digunakan untuk verifikasi OTP dan notifikasi laporan bimbingan.</span>
          </div>

          {/* Email Aktif */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="parent-email" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Alamat Email</span>
              <span className="text-light-on-surface-variant font-normal text-[11px]">(Opsional)</span>
            </label>
            <input type="email" id="parent-email" name="parent_email" value="bambang.pratama@gmail.com"
              placeholder="bambang@contoh.com"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary" />
          </div>

          {/* Alamat Kota Domisili */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="parent-city" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Kota / Wilayah Tinggal</span>
              <span className="text-danger">*</span>
            </label>
            <input type="text" id="parent-city" name="parent_city" value="Jakarta Selatan" required
              placeholder="Contoh: Jakarta Selatan, Kebayoran Baru"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary" />
          </div>
        </div>

        {/* Navigation Buttons Step 1 */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-light-outline-variant">
          <a href="/" className="px-5 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors">
            ← Batal
          </a>
          <button type="button" onClick={() => (window as any).goToStep?.(2)} className="px-7 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm font-semibold transition-all">
            Lanjut ke Data Siswa →
          </button>
        </div>
      </section>


      {/* ============================================================== */}
      {/* STEP 2: DATA CALON SISWA                                       */}
      {/* ============================================================== */}
      <section id="step-2-content" className="step-section hidden flex flex-col gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-light-primary-container text-light-on-primary-container mb-2 font-semibold">
            Langkah 2 dari 4
          </span>
          <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
            Informasi Calon Siswa
          </h1>
          <p className="text-body-md text-light-on-surface-variant mt-1">
            Informasi profil pendidikan siswa agar kami dapat menyesuaikan silabus belajar dan modul awal dengan tepat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Nama Lengkap Siswa */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="student-name" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Nama Lengkap Calon Siswa</span>
              <span className="text-danger">*</span>
            </label>
            <input type="text" id="student-name" name="student_name" value="Farhan Pratama" required
              placeholder="Contoh: Farhan Pratama"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary" />
          </div>

          {/* Asal Sekolah */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="student-school" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Asal Sekolah Saat Ini</span>
              <span className="text-danger">*</span>
            </label>
            <input type="text" id="student-school" name="student_school" value="SMP Labschool Kebayoran" required
              placeholder="Contoh: SMP Labschool Kebayoran"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary" />
          </div>

          {/* Jenjang & Kelas */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="student-grade" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
              <span>Jenjang &amp; Kelas</span>
              <span className="text-danger">*</span>
            </label>
            <select id="student-grade" name="student_grade"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary">
              <optgroup label="Sekolah Menengah Pertama (SMP)">
                <option value="smp-7">SMP Kelas 7</option>
                <option value="smp-8" >SMP Kelas 8</option>
                <option value="smp-9">SMP Kelas 9 (Persiapan SMA)</option>
              </optgroup>
              <optgroup label="Sekolah Dasar (SD)">
                <option value="sd-4">SD Kelas 4</option>
                <option value="sd-5">SD Kelas 5</option>
                <option value="sd-6">SD Kelas 6 (Ujian Akhir)</option>
              </optgroup>
              <optgroup label="Sekolah Menengah Atas (SMA / UTBK)">
                <option value="sma-10">SMA Kelas 10 (Fase E)</option>
                <option value="sma-11">SMA Kelas 11 (Fase F)</option>
                <option value="sma-12">SMA Kelas 12 (Persiapan UTBK SNBT)</option>
                <option value="gap-year">Alumni / Gap Year (Fokus PTN)</option>
              </optgroup>
            </select>
          </div>

          {/* Target & Peminatan Belajar */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="student-target" className="font-label text-label-md text-light-on-surface font-semibold">
              Target Utama Bimbingan Belajar
            </label>
            <select id="student-target" name="student_target"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary">
              <option >Peningkatan Nilai Rapor &amp; Pemahaman Konsep Dasar</option>
              <option>Persiapan Masuk SMA Unggulan / Asrama Taruna</option>
              <option>Fokus Sukses UTBK SNBT &amp; Ujian Mandiri PTN</option>
              <option>Bimbingan Olimpiade Sains Nasional (OSN)</option>
            </select>
          </div>

          {/* Catatan / Kebutuhan Khusus */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="student-notes" className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
              <span>Catatan / Mata Pelajaran yang Perlu Perhatian Khusus</span>
              <span className="text-[11px] text-light-on-surface-variant font-normal">Opsional</span>
            </label>
            <textarea id="student-notes" name="student_notes" rows={2}
              placeholder="Contoh: Butuh bantuan ekstra pada rumus Aljabar Matematika dan Fisika gerak..."
              className="w-full px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary">Perlu pendalaman ekstra di materi Matematika Aljabar dan IPA Fisika.</textarea>
          </div>
        </div>

        {/* Navigation Buttons Step 2 */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-light-outline-variant">
          <button type="button" onClick={() => (window as any).goToStep?.(1)} className="px-5 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors">
            ← Kembali ke Data Wali
          </button>
          <button type="button" onClick={() => (window as any).goToStep?.(3)} className="px-7 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm font-semibold transition-all">
            Lanjut ke Pilih Program →
          </button>
        </div>
      </section>


      {/* ============================================================== */}
      {/* STEP 3: PILIH PROGRAM & JADWAL BELAJAR (AS REQUESTED)          */}
      {/* ============================================================== */}
      <section id="step-3-content" className="step-section flex flex-col gap-6 md:gap-8">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-light-primary-container text-light-on-primary-container mb-2 font-semibold">
            Langkah 3 dari 4
          </span>
          <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
            Pilih Program &amp; Jadwal Belajar Siswa
          </h1>
          <p className="text-body-md text-light-on-surface-variant mt-1">
            Pendaftaran untuk calon siswa: <strong id="summary-student-header" className="text-light-on-surface">Farhan Pratama</strong> (Jenjang: <span id="summary-grade-header" className="text-brand-indigo font-medium">SMP Kelas 8</span>).
          </p>
        </div>

        {/* Multi-Step Form Execution */}
        <form id="registration-form"  className="flex flex-col gap-6 md:gap-8">
          
          {/* Pilihan Cabang / Lokasi */}
          <div className="flex flex-col gap-3">
            <label className="font-label text-label-md text-light-on-surface font-semibold">Pilih Lokasi Cabang Belajar</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cabang Tatap Muka Sudirman */}
              <label className="branch-option p-4 rounded-xl border-2 border-light-primary bg-light-primary-container/20 flex items-start gap-3 cursor-pointer transition-all hover:shadow-xs">
                <input type="radio" name="cabang" value="sudirman" defaultChecked onChange={(e) => (window as any).updateBranchSelection?.(e.target as HTMLInputElement)} className="mt-1 text-light-primary focus:ring-light-primary" />
                <div>
                  <span className="font-headline font-semibold text-title-md text-light-on-surface block">Cabang Sudirman (Tatap Muka)</span>
                  <span className="text-body-sm text-light-on-surface-variant block mt-0.5">Jl. Pendidikan No. 42, Kebayoran Baru, Jakarta Selatan</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-label bg-success text-on-success mt-2 font-medium">Kelas Maks 8 Siswa</span>
                </div>
              </label>

              {/* Cabang Online Daring */}
              <label className="branch-option p-4 rounded-xl border border-light-outline hover:border-light-primary bg-light-surface flex items-start gap-3 cursor-pointer transition-all hover:shadow-xs">
                <input type="radio" name="cabang" value="online" onChange={(e) => (window as any).updateBranchSelection?.(e.target as HTMLInputElement)} className="mt-1 text-light-primary focus:ring-light-primary" />
                <div>
                  <span className="font-headline font-semibold text-title-md text-light-on-surface block">Kelas Daring Interaktif (Online)</span>
                  <span className="text-body-sm text-light-on-surface-variant block mt-0.5">Live Zoom dengan tutor, rekaman kelas, dan modul digital</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-label bg-light-primary-container text-light-primary mt-2 font-medium">Akses Se-Indonesia</span>
                </div>
              </label>

            </div>
          </div>

          {/* Pilihan Paket Program */}
          <div className="flex flex-col gap-3">
            <label className="font-label text-label-md text-light-on-surface font-semibold">Pilih Paket Program</label>
            <div className="flex flex-col gap-3">
              
              {/* Paket 1 Selected (Reguler) */}
              <label className="program-option p-4 rounded-xl border-2 border-light-primary bg-light-primary-container/20 flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer transition-all hover:shadow-xs">
                <div className="flex items-start gap-3">
                  <input type="radio" name="program" value="reguler" defaultChecked onChange={(e) => (window as any).updateProgramSelection?.(e.target as HTMLInputElement, 950000, 'Program Reguler SMP Kelas 8')} className="mt-1 text-light-primary focus:ring-light-primary" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-headline font-bold text-title-md text-light-on-surface">Program Reguler SMP Kelas 8</span>
                      <span className="px-2 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-semibold">Rekomendasi</span>
                    </div>
                    <p className="text-body-sm text-light-on-surface-variant mt-1">Mata Pelajaran: Matematika, IPA Terpadu, dan Bahasa Inggris (3 sesi / minggu).</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-body-sm text-light-on-surface font-medium">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-success">check</span> Modul Cetak Lengkap</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-success">check</span> Evaluasi Bulanan ke Ortu</span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 pl-7 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-light-outline-variant/60">
                  <span className="font-headline font-bold text-title-lg text-brand-indigo block">Rp950.000</span>
                  <span className="text-[11px] text-light-on-surface-variant block">per bulan</span>
                </div>
              </label>

              {/* Paket 2 (Intensif + Privat) */}
              <label className="program-option p-4 rounded-xl border border-light-outline hover:border-light-primary bg-light-surface flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer transition-all hover:shadow-xs">
                <div className="flex items-start gap-3">
                  <input type="radio" name="program" value="intensif" onChange={(e) => (window as any).updateProgramSelection?.(e.target as HTMLInputElement, 1650000, 'Paket Intensif + Privat 1-on-1')} className="mt-1 text-light-primary focus:ring-light-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-title-md text-light-on-surface">Paket Intensif + Privat 1-on-1</span>
                    </div>
                    <p className="text-body-sm text-light-on-surface-variant mt-1">Kelas reguler 3 sesi/minggu ditambah 2 sesi privat khusus pembedahan PR &amp; ujian sekolah.</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-body-sm text-light-on-surface font-medium">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-success">check</span> 2x Sesi Privat / Minggu</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-success">check</span> Konseling Akademik 1-on-1</span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 pl-7 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-light-outline-variant/60">
                  <span className="font-headline font-bold text-title-lg text-brand-indigo block">Rp1.650.000</span>
                  <span className="text-[11px] text-light-on-surface-variant block">per bulan</span>
                </div>
              </label>

            </div>
          </div>

          {/* Pilihan Preferensi Sesi Jadwal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Pilihan Hari Sesi</span>
              <select id="schedule-days" name="schedule_days" className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary">
                <option value="senin-rabu-jumat" >Senin, Rabu, Jumat</option>
                <option value="selasa-kamis-sabtu">Selasa, Kamis, Sabtu</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Pilihan Waktu Belajar</span>
              <select id="schedule-time" name="schedule_time" className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary">
                <option value="siang" >Sesi Siang (14:00 - 15:30 WIB)</option>
                <option value="sore">Sesi Sore (16:00 - 17:30 WIB)</option>
                <option value="malam">Sesi Malam (18:30 - 20:00 WIB)</option>
              </select>
            </label>
          </div>

          {/* Upload Berkas Rapor / Dokumen Pendukung (Opsional) */}
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashed border-light-outline bg-light-surface-soft">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-light-primary text-[20px]">upload_file</span>
              <span className="font-label text-label-md text-light-on-surface font-semibold">Unggah Salinan Rapor Terakhir (Opsional)</span>
            </div>
            <p className="text-body-sm text-light-on-surface-variant">
              Membantu tutor memetakan materi yang perlu pendalaman ekstra sebelum sesi orientasi dimulai. Format PDF, JPG, atau PNG (maks. 5MB).
            </p>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <input type="file" id="report-file" name="report_file" className="text-body-sm text-light-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-body-sm file:font-label file:font-semibold file:bg-light-primary-container file:text-light-primary hover:file:bg-light-primary hover:file:text-light-on-primary file:cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Ringkasan Biaya Awal */}
          <div className="p-4 sm:p-5 rounded-xl bg-light-surface-container border border-light-outline-variant flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-light-on-surface-variant">Biaya Program Bulan Pertama</span>
              <span id="price-program" className="font-medium text-light-on-surface">Rp950.000</span>
            </div>
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-light-on-surface-variant">Biaya Pendaftaran &amp; Modul Belajar</span>
              <span id="price-registration" className="font-medium text-light-on-surface">Rp150.000</span>
            </div>
            <div className="pt-2.5 border-t border-light-outline flex items-center justify-between font-bold text-title-md">
              <span className="text-light-on-surface">Total Tagihan Awal</span>
              <span id="price-total" className="text-brand-indigo font-headline text-title-lg font-bold">Rp1.100.000</span>
            </div>
          </div>

          {/* Form Navigation Buttons Step 3 */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-light-outline-variant">
            <button type="button" onClick={() => (window as any).goToStep?.(2)} className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors">
              ← Kembali ke Data Siswa
            </button>

            <button type="button" onClick={() => (window as any).goToStep?.(4)} className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm text-center transition-all whitespace-nowrap font-semibold">
              Lanjut ke Konfirmasi →
            </button>
          </div>
        </form>
      </section>


      {/* ============================================================== */}
      {/* STEP 4: KONFIRMASI & REVIEW AKHIR                              */}
      {/* ============================================================== */}
      <section id="step-4-content" className="step-section hidden flex flex-col gap-6 md:gap-8">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-accent text-on-accent mb-2 font-semibold">
            Langkah Terakhir (4 dari 4)
          </span>
          <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
            Tinjau &amp; Ajukan Pendaftaran
          </h1>
          <p className="text-body-md text-light-on-surface-variant mt-1">
            Pastikan seluruh data yang Anda cantumkan telah sesuai sebelum mengajukan pendaftaran resmi.
          </p>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card Data Wali */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/60 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/60">
              <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-light-primary">person</span>
                Data Orang Tua / Wali
              </span>
              <button type="button" onClick={() => (window as any).goToStep?.(1)} className="text-[12px] text-light-primary hover:underline font-semibold">
                Ubah
              </button>
            </div>
            <div className="text-body-sm space-y-1">
              <p><span className="text-light-on-surface-variant">Nama:</span> <strong id="review-parent-name" className="text-light-on-surface">Bambang Pratama, S.E.</strong></p>
              <p><span className="text-light-on-surface-variant">Hubungan:</span> <span id="review-parent-relation">Ayah Kandung</span></p>
              <p><span className="text-light-on-surface-variant">WhatsApp:</span> <span id="review-parent-phone">+62 812-9876-5432</span></p>
              <p><span className="text-light-on-surface-variant">Domisili:</span> <span id="review-parent-city">Jakarta Selatan</span></p>
            </div>
          </div>

          {/* Card Data Siswa */}
          <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/60 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/60">
              <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-light-primary">school</span>
                Data Calon Siswa
              </span>
              <button type="button" onClick={() => (window as any).goToStep?.(2)} className="text-[12px] text-light-primary hover:underline font-semibold">
                Ubah
              </button>
            </div>
            <div className="text-body-sm space-y-1">
              <p><span className="text-light-on-surface-variant">Nama Siswa:</span> <strong id="review-student-name" className="text-light-on-surface">Farhan Pratama</strong></p>
              <p><span className="text-light-on-surface-variant">Asal Sekolah:</span> <span id="review-student-school">SMP Labschool Kebayoran</span></p>
              <p><span className="text-light-on-surface-variant">Jenjang:</span> <span id="review-student-grade" className="font-medium text-brand-indigo">SMP Kelas 8</span></p>
              <p><span className="text-light-on-surface-variant">Fokus Target:</span> <span id="review-student-target">Nilai Rapor &amp; Konsep</span></p>
            </div>
          </div>

          {/* Card Program & Lokasi (Span 2 cols on md) */}
          <div className="md:col-span-2 p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/60 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/60">
              <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-light-primary">menu_book</span>
                Program &amp; Sesi Terpilih
              </span>
              <button type="button" onClick={() => (window as any).goToStep?.(3)} className="text-[12px] text-light-primary hover:underline font-semibold">
                Ubah
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-body-sm pt-1">
              <div>
                <span className="text-light-on-surface-variant block text-[11px]">Paket Program:</span>
                <strong id="review-program-title" className="text-brand-indigo font-headline">Program Reguler SMP Kelas 8</strong>
              </div>
              <div>
                <span className="text-light-on-surface-variant block text-[11px]">Lokasi Belajar:</span>
                <span id="review-branch-title" className="font-medium text-light-on-surface">Cabang Sudirman (Tatap Muka)</span>
              </div>
              <div>
                <span className="text-light-on-surface-variant block text-[11px]">Jadwal Pilihan:</span>
                <span id="review-schedule-title" className="font-medium text-light-on-surface">Senin, Rabu, Jumat (14:00 - 15:30)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Rincian Tagihan Awal Review */}
        <div className="p-4 sm:p-5 rounded-xl bg-light-primary-container/30 border border-light-primary/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant">Biaya Program Bulan Pertama</span>
            <span id="review-price-program" className="font-medium text-light-on-surface">Rp950.000</span>
          </div>
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant">Biaya Pendaftaran &amp; Modul Pembelajaran</span>
            <span className="font-medium text-light-on-surface">Rp150.000</span>
          </div>
          <div className="pt-2.5 border-t border-light-outline/40 flex items-center justify-between font-bold text-title-md">
            <div>
              <span className="text-light-on-surface block">Total Tagihan Awal</span>
              <span className="text-[11px] text-light-on-surface-variant font-normal">Pembayaran dilakukan setelah verifikasi jadwal oleh admin.</span>
            </div>
            <span id="review-price-total" className="text-brand-indigo font-headline text-headline-sm font-bold">Rp1.100.000</span>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" id="consent-check" required defaultChecked className="mt-1 rounded text-light-primary focus:ring-light-primary" />
            <span className="text-body-sm text-light-on-surface">
              Saya menyatakan bahwa data yang diisi adalah benar dan menyetujui <a href="#terms" className="text-light-primary underline font-medium">Syarat &amp; Ketentuan</a> serta <a href="#privacy" className="text-light-primary underline font-medium">Kebijakan Privasi</a> ARCI Bimbel.
            </span>
          </label>
        </div>

        {/* Navigation Buttons Step 4 */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-light-outline-variant">
          <button type="button" onClick={() => (window as any).goToStep?.(3)} className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors">
            ← Kembali ke Pilih Program
          </button>

          <button type="button" id="btn-submit-registration" onClick={() => (window as any).submitFinalRegistration?.()} className="w-full sm:w-auto min-h-[50px] px-8 py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm text-center transition-all whitespace-nowrap font-bold flex items-center justify-center gap-2">
            <span>Ajukan Pendaftaran Sekarang</span>
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SUCCESS STATE / MODAL (SHOWN AFTER SUBMISSION - CENTERED)      */}
      {/* ============================================================== */}
      <section id="step-success-content" className="step-section hidden flex flex-col items-center justify-center text-center py-6 sm:py-10 gap-6 w-full max-w-lg mx-auto">
        {/* Animated Check Icon (Centered) */}
        <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center text-title-lg shadow-inner mx-auto self-center ring-8 ring-success/5 animate-pulse">
          <span className="material-symbols-outlined text-[44px]">verified</span>
        </div>
        
        {/* Text Group (Centered) */}
        <div className="w-full flex flex-col items-center text-center">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-label-sm font-label bg-success text-on-success mb-3 font-semibold shadow-xs mx-auto">
            Pendaftaran Diterima
          </span>
          <h2 className="font-headline text-headline-sm sm:text-headline-md font-bold text-light-on-surface text-center">
            Selamat! Pendaftaran Siswa Berhasil Diajukan
          </h2>
          <p className="text-body-md text-light-on-surface-variant mt-2 text-center leading-relaxed">
            Nomor Registrasi Anda: <strong className="text-brand-indigo font-headline text-title-md">ARC-2026-0849</strong>.<br className="hidden sm:inline" /> Konfirmasi jadwal serta invoice awal telah kami kirimkan ke nomor WhatsApp orang tua.
          </p>
        </div>

        {/* Detail Box (Centered with mx-auto) */}
        <div className="w-full bg-light-surface-container-low rounded-xl p-4 sm:p-5 border border-light-outline-variant text-left text-body-sm space-y-2.5 shadow-xs mx-auto">
          <div className="flex justify-between items-center">
            <span className="text-light-on-surface-variant">Calon Siswa:</span>
            <strong id="success-student-name" className="text-light-on-surface font-semibold">Farhan Pratama</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-light-on-surface-variant">Program:</span>
            <span id="success-program-name" className="font-medium text-brand-indigo">Program Reguler SMP Kelas 8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-light-on-surface-variant">Lokasi Belajar:</span>
            <span id="success-branch-name" className="font-medium text-light-on-surface">Cabang Sudirman (Tatap Muka)</span>
          </div>
          <div className="flex justify-between items-center pt-2.5 border-t border-light-outline-variant">
            <span className="text-light-on-surface-variant">Estimasi Orientasi:</span>
            <span className="font-semibold text-success">Sabtu, 28 November 2026</span>
          </div>
        </div>

        {/* Action Buttons Success (Centered with mx-auto) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mx-auto mt-2">
          <a href="https://wa.me/6281234567890?text=Halo%20Admin%20ARCI%20Bimbel,%20saya%20sudah%20mendaftar%20dengan%20nomor%20ARC-2026-0849" target="_blank" rel="noopener noreferrer" className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-success text-on-success font-label text-label-md font-semibold hover:bg-success/90 transition-colors shadow-xs">
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Konfirmasi WhatsApp</span>
          </a>
          <a href="/" className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-label-md font-medium transition-colors">
            <span>Kembali ke Beranda</span>
          </a>
        </div>
      </section>

    </div>
  </main>

  {/* Global Simple Clean Footer */}
  <footer className="bg-light-surface border-t border-light-outline-variant py-6 mt-auto text-center text-body-sm text-light-on-surface-variant">
    <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p>© 2026 ARCI Bimbel. Bantuan pendaftaran WhatsApp: +62 812-3456-7890</p>
      <div className="flex gap-4">
        <a href="index.html#program" className="hover:underline">Daftar Program</a>
        <a href="index.html#faq" className="hover:underline">Tanya Jawab (FAQ)</a>
        <a href="#privacy" className="hover:underline">Kebijakan Privasi</a>
      </div>
    </div>
  </footer>

  {/* Interactive Multi-Step Form Logic */}
  

    </div>
  );
}
