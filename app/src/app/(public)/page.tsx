"use client";

import React, { useEffect } from "react";
import { submitConsultationAction } from "@/app/actions/leads";

declare global {
  interface Window {
    reworkMissingImageAI: (img: HTMLImageElement, options?: { title?: string; subtitle?: string; width?: number; height?: number }) => void;
  }
}

export default function HomePage() {
  useEffect(() => {
    // 0. AI Image Rework Fallback Generator
    window.reworkMissingImageAI = function(img: HTMLImageElement, options: { title?: string; subtitle?: string; width?: number; height?: number } = {}) {
      if (!img) return;
      img.onerror = null;
      
      const title = options.title || img.getAttribute("data-ai-title") || img.alt || "Asset Visual ARCI Bimbel";
      const subtitle = options.subtitle || img.getAttribute("data-ai-subtitle") || "Bimbingan Belajar Terpadu";
      const width = options.width || Number(img.getAttribute("width")) || 600;
      const height = options.height || Number(img.getAttribute("height")) || 400;

      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#172653"/>
            <stop offset="60%" stop-color="#243B7A"/>
            <stop offset="100%" stop-color="#1E3166"/>
          </linearGradient>
          <pattern id="aiPattern" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aiGrad)"/>
        <rect width="100%" height="100%" fill="url(#aiPattern)"/>
        <circle cx="${width/2}" cy="${height/2 - 24}" r="38" fill="rgba(246, 196, 83, 0.16)" stroke="#F6C453" stroke-width="2"/>
        <text x="${width/2}" y="${height/2 - 16}" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="bold" fill="#F6C453" text-anchor="middle">ARCI</text>
        <text x="${width/2}" y="${height/2 + 32}" font-family="Plus Jakarta Sans, sans-serif" font-size="13.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">${title}</text>
        <text x="${width/2}" y="${height/2 + 50}" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="400" fill="#CBD5E1" text-anchor="middle">${subtitle}</text>
        <rect x="${width/2 - 75}" y="${height/2 + 64}" width="150" height="22" rx="11" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(246, 196, 83, 0.4)" stroke-width="1"/>
        <text x="${width/2}" y="${height/2 + 78}" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="600" fill="#F6C453" text-anchor="middle">✨ AI Rework Active</text>
      </svg>
      `.trim();

      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      img.classList.add("ai-reworked-image");
      img.setAttribute("data-ai-reworked", "true");
    };

    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", function() {
        window.reworkMissingImageAI(this);
      });
    });

    // 1. Mobile Menu Drawer Toggle
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const toggleMenu = (e: MouseEvent) => {
      e.stopPropagation();
      mobileMenu?.classList.toggle("hidden");
    };
    const closeOnLink = () => mobileMenu?.classList.add("hidden");
    const closeOnClickOutside = (e: MouseEvent) => {
      if (mobileMenu && !mobileMenu.contains(e.target as Node) && e.target !== mobileBtn) {
        mobileMenu.classList.add("hidden");
      }
    };

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener("click", toggleMenu);
      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeOnLink);
      });
      document.addEventListener("click", closeOnClickOutside);
    }

    // 2. Program Belajar Category Filtering
    const tabs = document.querySelectorAll(".program-tab");
    const cards = document.querySelectorAll(".program-card");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.remove("bg-light-primary", "text-light-on-primary", "active");
          t.classList.add("text-light-on-surface-variant");
        });
        tab.classList.add("bg-light-primary", "text-light-on-primary", "active");
        tab.classList.remove("text-light-on-surface-variant");

        const filter = tab.getAttribute("data-filter");
        cards.forEach((card) => {
          const c = card as HTMLElement;
          if (filter === "all" || card.getAttribute("data-category") === filter) {
            c.style.display = "flex";
          } else {
            c.style.display = "none";
          }
        });
      });
    });

    // 3. FAQ Accordion Interaction
    const faqButtons = document.querySelectorAll(".faq-btn");
    faqButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const content = btn.nextElementSibling as HTMLElement;
        const icon = btn.querySelector(".material-symbols-outlined") as HTMLElement;
        const isOpen = !content.classList.contains("hidden");

        document.querySelectorAll(".faq-content").forEach((c) => c.classList.add("hidden"));
        document.querySelectorAll(".faq-btn .material-symbols-outlined").forEach((i) => {
          (i as HTMLElement).style.transform = "rotate(0deg)";
        });

        if (!isOpen && content && icon) {
          content.classList.remove("hidden");
          icon.style.transform = "rotate(180deg)";
        }
      });
    });

    // 4. Consultation Form Handling with Supabase CRM Integration & Simple Math Captcha
    let consultN1 = Math.floor(Math.random() * 9) + 1;
    let consultN2 = Math.floor(Math.random() * 9) + 1;

    const num1El = document.getElementById("consult-num1");
    const num2El = document.getElementById("consult-num2");
    const captchaInput = document.getElementById("consult-captcha-input") as HTMLInputElement;
    const captchaErr = document.getElementById("consult-captcha-error");
    const refreshBtn = document.getElementById("refresh-consult-captcha");

    const refreshConsultCaptcha = () => {
      consultN1 = Math.floor(Math.random() * 9) + 1;
      consultN2 = Math.floor(Math.random() * 9) + 1;
      if (num1El) num1El.textContent = String(consultN1);
      if (num2El) num2El.textContent = String(consultN2);
      if (captchaInput) {
        captchaInput.value = "";
        captchaInput.classList.remove("border-danger");
      }
      if (captchaErr) captchaErr.classList.add("hidden");
    };

    // Generate random values on client mount
    refreshConsultCaptcha();

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        refreshConsultCaptcha();
      });
    }

    if (captchaInput) {
      captchaInput.addEventListener("input", () => {
        if (captchaErr) captchaErr.classList.add("hidden");
        captchaInput.classList.remove("border-danger");
      });
    }

    const consultForm = document.getElementById("consultation-form") as HTMLFormElement;
    const successBox = document.getElementById("form-success");
    const successTitle = document.getElementById("form-success-title");
    const successDesc = document.getElementById("form-success-desc");

    if (consultForm && successBox) {
      consultForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Validasi Math Captcha
        const expected = consultN1 + consultN2;
        const userVal = parseInt(captchaInput?.value || "", 10);
        if (isNaN(userVal) || userVal !== expected) {
          if (captchaErr) {
            captchaErr.classList.remove("hidden");
            captchaErr.innerHTML = `
              <span class="material-symbols-outlined text-[15px]">error</span>
              Jawaban verifikasi keamanan salah (${consultN1} + ${consultN2} = ?). Silakan coba lagi.
            `;
          }
          if (captchaInput) {
            captchaInput.classList.add("border-danger");
            captchaInput.focus();
          }
          refreshConsultCaptcha();
          return;
        }

        const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;

        const parentName = (document.getElementById("parent-name") as HTMLInputElement)?.value;
        const studentName = (document.getElementById("student-name") as HTMLInputElement)?.value;
        const parentPhone = (document.getElementById("parent-phone") as HTMLInputElement)?.value;
        const gradeLevel = (document.getElementById("grade-level") as HTMLSelectElement)?.value;
        const learningMode = (document.getElementById("learning-mode") as HTMLSelectElement)?.value;
        const targetSubject = (document.getElementById("target-subject") as HTMLInputElement)?.value;
        const notes = (document.getElementById("notes") as HTMLTextAreaElement)?.value;

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span class="inline-block animate-spin mr-2">⟳</span>
            Menyimpan ke Sistem CRM...
          `;
        }

        try {
          const res = await submitConsultationAction({
            parentName,
            studentName,
            parentPhone,
            gradeLevel,
            learningMode,
            targetSubject,
            notes,
            captchaAnswer: userVal,
            captchaExpected: expected,
          });

          if (res.success) {
            consultForm.reset();
            refreshConsultCaptcha();
            if (successTitle) {
              successTitle.textContent = `Terima Kasih! No. Referensi: ${res.leadNumber}`;
            }
            if (successDesc) {
              successDesc.innerHTML = `
                Data ananda <strong>${studentName}</strong> berhasil terhubung langsung ke Dashboard Konselor ARCI Bimbel. Kami akan segera menghubungi nomor WhatsApp <strong>${parentPhone}</strong> untuk rekomendasi kelas &amp; jadwal free trial.
              `;
            }
            successBox.classList.remove("hidden");
            successBox.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            alert(res.message || "Gagal mengirim permintaan konsultasi.");
            refreshConsultCaptcha();
          }
        } catch {
          alert("Terjadi kendala saat menghubungkan ke database. Silakan coba kembali.");
          refreshConsultCaptcha();
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Kirim Permintaan Konsultasi";
          }
        }
      });
    }

    // 5. Smooth Anchor Scroll Navigation with Exact Header Offset Compensation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#" || href === "#!") return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        // Close mobile drawer if open
        if (mobileMenu) {
          mobileMenu.classList.add("hidden");
        }
        
        // Compensate for sticky header (80px on desktop, 64px on mobile)
        const isDesktop = window.innerWidth >= 1024;
        const headerOffset = isDesktop ? 80 : 64;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });

        if (window.history.pushState) {
          window.history.pushState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      if (mobileBtn) mobileBtn.removeEventListener("click", toggleMenu);
      document.removeEventListener("click", closeOnClickOutside);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <div className="bg-light-surface text-light-on-surface font-body antialiased min-h-screen flex flex-col pb-24 lg:pb-0 selection:bg-brand-indigo selection:text-white">


  {/* 1. Top Announcement Bar (Responsive Mobile to Desktop) */}
  <aside className="bg-light-primary-container text-light-on-primary-container px-3 py-1.5 md:py-2.5 text-center text-label-sm md:text-body-sm border-b border-light-outline-variant transition-all">
    <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-1.5 md:gap-3">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-semibold shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse"></span>
        Pendaftaran 2026/2027
      </span>
      <span className="font-medium text-brand-indigo-dark text-[11.5px] sm:text-body-sm">
        Gelombang 1 dibuka! Dapatkan gratis tes diagnostik gaya belajar &amp; voucher modul pembelajaran.
      </span>
      <a href="/pendaftaran" className="hover:text-brand-indigo-dark font-label font-bold text-brand-indigo ml-1 inline-flex items-center gap-1 text-label-sm whitespace-nowrap group">
        <span className="underline">Daftar Sekarang</span>
        <span className="material-symbols-outlined text-[16px] leading-none transition-transform group-hover:translate-x-0.5 select-none no-underline">arrow_forward</span>
      </a>
    </div>
  </aside>

  {/* 2. Global Header (Responsive Sticky Header with 1440px Desktop & Smooth Mobile Drawer) */}
  <header className="sticky top-0 z-50 bg-light-surface/95 backdrop-blur-md border-b border-light-outline-variant transition-all duration-200">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
      {/* Logo & Brand Info */}
      <div className="flex items-center gap-4 xl:gap-8">
        <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-title-md lg:text-headline-sm shadow-sm group-hover:bg-brand-indigo-dark transition-colors">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-title-md lg:text-title-lg tracking-tight text-brand-indigo group-hover:text-brand-indigo-dark transition-colors whitespace-nowrap">
              ARCI Bimbel
            </span>
            <span className="hidden sm:inline-block text-[10px] lg:text-label-sm text-light-on-surface-variant font-label whitespace-nowrap">
              Bimbingan Belajar Terpadu
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Compact, 1-Line, Whitespace-Nowrap) */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6">
          <a href="#program" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
            Program
          </a>
          <a href="#keunggulan" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
            Keunggulan
          </a>
          <a href="#tutor" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
            Tutor
          </a>
          <a href="#testimoni" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
            Testimoni
          </a>
          <a href="#lokasi" className="text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
            Cabang &amp; Fasilitas
          </a>

          {/* Dropdown Menu for Secondary Info: Alur & FAQ */}
          <div className="relative group/dropdown py-2">
            <button type="button" className="inline-flex items-center gap-1 text-body-md font-label text-light-on-surface-variant group-hover/dropdown:text-brand-indigo font-medium hover:font-semibold transition-colors whitespace-nowrap px-1 py-1">
              <span>Informasi</span>
              <span className="material-symbols-outlined text-[18px] group-hover/dropdown:rotate-180 transition-transform duration-200">expand_more</span>
            </button>
            <div className="absolute top-full left-0 w-52 bg-light-surface rounded-xl border border-light-outline-variant shadow-lg py-2 hidden group-hover/dropdown:block animate-in fade-in zoom-in-95 duration-150">
              <a href="#alur" className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-light-on-surface hover:bg-light-surface-container-low hover:text-brand-indigo transition-colors font-medium">
                <span className="material-symbols-outlined text-[18px] text-light-primary">trending_up</span>
                <span>Alur Belajar &amp; Seleksi</span>
              </a>
              <a href="#faq" className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-light-on-surface hover:bg-light-surface-container-low hover:text-brand-indigo transition-colors font-medium">
                <span className="material-symbols-outlined text-[18px] text-light-primary">help</span>
                <span>Tanya Jawab (FAQ)</span>
              </a>
              <a href="/pendaftaran" className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-brand-indigo bg-light-primary-container/30 hover:bg-light-primary-container hover:text-brand-indigo-dark transition-colors font-semibold border-t border-light-outline-variant/60">
                <span className="material-symbols-outlined text-[18px] text-brand-indigo">how_to_reg</span>
                <span>Pendaftaran Siswa Baru</span>
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
        <a href="/login" className="inline-flex items-center gap-1.5 sm:gap-2 text-body-sm sm:text-body-md font-label text-light-on-surface-variant hover:text-brand-indigo px-2.5 py-1.5 rounded-lg hover:bg-light-surface-container-low transition-colors whitespace-nowrap font-medium group">
          <span className="material-symbols-outlined text-[20px] text-light-on-surface-variant group-hover:text-brand-indigo leading-none shrink-0">account_circle</span>
          <span>Masuk</span>
        </a>
        <a href="#konsultasi" className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md lg:text-label-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-[0.98] font-semibold">
          <span className="material-symbols-outlined text-[17px]">calendar_today</span>
          <span>Konsultasi Gratis</span>
        </a>

        {/* Mobile Menu Toggle Button (Touch Friendly) */}
        <button id="mobile-menu-btn" type="button" className="lg:hidden w-10 h-10 rounded-lg border border-light-outline flex items-center justify-center text-light-on-surface hover:bg-light-surface-container-low active:bg-light-surface-container transition-colors" aria-label="Buka Menu Navigasi">
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
      </div>
    </div>

    {/* Mobile Navigation Drawer (Smooth Slide-Down) */}
    <div id="mobile-menu" className="hidden lg:hidden border-t border-light-outline-variant bg-light-surface px-5 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
      <a href="/pendaftaran" className="flex items-center justify-between text-body-md font-semibold text-brand-indigo py-2.5 border-b border-light-outline-variant/60 bg-light-primary-container/20 px-2 rounded-lg">
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-light-primary">how_to_reg</span>
          <span>Pendaftaran Siswa Baru</span>
        </span>
        <span className="material-symbols-outlined text-[18px] text-light-primary">chevron_right</span>
      </a>
      <a href="/program/intensif-utbk-2026" className="flex items-center justify-between text-body-md font-semibold text-brand-indigo py-2.5 border-b border-light-outline-variant/60 bg-accent/15 px-2 rounded-lg">
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-brand-indigo">school</span>
          <span>Program Intensif UTBK 2026</span>
        </span>
        <span className="text-xs bg-accent text-on-accent font-bold px-2 py-0.5 rounded-full">Unggulan</span>
      </a>
      <a href="#program" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
        <span>Program Belajar</span>
        <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
      </a>
      <a href="#keunggulan" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
        <span>Keunggulan ARCI</span>
        <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
      </a>
      <a href="#alur" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
        <span>Alur Belajar &amp; Pendaftaran</span>
        <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
      </a>
      <a href="#tutor" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
        <span>Tutor Pilihan</span>
        <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
      </a>
      <a href="#testimoni" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
        <span>Hasil &amp; Testimoni</span>
        <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
      </a>
      <a href="#lokasi" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
        <span>Cabang &amp; Fasilitas</span>
        <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
      </a>
      <a href="#faq" className="flex items-center justify-between text-body-md font-medium text-light-on-surface py-2.5 border-b border-light-outline-variant/60">
        <span>Tanya Jawab (FAQ)</span>
        <span className="material-symbols-outlined text-[18px] text-light-outline">chevron_right</span>
      </a>
      <div className="pt-2">
        <a href="#konsultasi" className="w-full min-h-[46px] flex items-center justify-center gap-2 py-2.5 rounded-lg bg-light-primary text-light-on-primary font-label text-label-md font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>Daftar Konsultasi Gratis</span>
        </a>
      </div>
    </div>
  </header>

  <main id="home" className="flex-1">
    {/* 3. Hero Section (Truly Responsive: Clean Mobile Stack to 1440px 2-Column Grid) */}
    <section className="py-10 md:py-16 lg:py-24 bg-gradient-to-b from-light-surface-soft via-light-surface-soft to-light-surface border-b border-light-outline-variant relative overflow-hidden">
      {/* Geometric blur background accents */}
      <div className="absolute -top-32 -right-32 w-80 md:w-96 h-80 md:h-96 bg-light-primary-container/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 md:w-96 h-80 md:h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
        {/* Left Hero Content */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-light-primary-container text-light-on-primary-container w-fit text-label-sm font-label border border-light-outline-variant shadow-xs">
            <span className="w-2 h-2 rounded-full bg-light-primary animate-pulse"></span>
            <span className="font-semibold text-brand-indigo">Metode Belajar Personal • Terbukti Sejak 2018</span>
          </div>

          <h1 className="font-headline text-display-lg-mobile md:text-headline-lg lg:text-display-lg text-light-on-surface text-balance tracking-tight">
            Bantu Anak Belajar Nyaman, Nilai Meningkat, dan Siap Ujian Impian
          </h1>

          <p className="text-body-md sm:text-body-lg text-light-on-surface-variant max-w-2xl text-pretty leading-relaxed">
            ARCI Bimbel mendampingi siswa jenjang SD, SMP, SMA, hingga persiapan intensif UTBK-SNBT dengan kelas interaktif kelompok kecil (maksimal 8 siswa), kurikulum adaptif terstruktur, dan tutor spesialis lulusan UI, ITB, &amp; UGM.
          </p>

          {/* Mobile Hero Image (Visible on mobile/tablet before CTAs for higher visual impact) */}
          <div className="lg:hidden relative rounded-2xl overflow-hidden border border-light-outline-variant shadow-md bg-light-surface aspect-[16/10] my-2">
            <img src="assets/images/hero-classroom.jpg" 
                 data-ai-title="Sesi Belajar Kelas ARCI Bimbel" data-ai-subtitle="Pendampingan Interaktif &amp; Personal"
                 alt="Sesi bimbingan belajar tatap muka interaktif di kelas ARCI Bimbel" 
                 className="w-full h-full object-cover" />
            
            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-light-surface/95 backdrop-blur-md rounded-xl p-2.5 border border-light-outline-variant shadow-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <div>
                <p className="text-[12px] font-headline font-bold text-light-on-surface">Kelas Maksimal 8 Siswa</p>
                <p className="text-[10.5px] text-light-on-surface-variant">Fokus pendampingan individual terjaga optimal.</p>
              </div>
            </div>
          </div>

          {/* CTAs (Full Width on Mobile, Inline on Desktop) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <a href="#konsultasi" className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label shadow-sm text-label-lg transition-all active:scale-[0.98] whitespace-nowrap font-semibold">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>Daftar Trial Belajar Gratis</span>
            </a>

            <a href="https://wa.me/6281234567890?text=Halo%20ARCI%20Bimbel,%20saya%20ingin%20konsultasi%20program%20belajar" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md sm:text-label-lg transition-colors whitespace-nowrap bg-white shadow-xs font-semibold">
              <span className="material-symbols-outlined text-[20px] text-success">chat</span>
              <span>Tanya via WhatsApp</span>
            </a>
          </div>

          {/* Trust Signals Metrics Bar (Responsive Card on Mobile, Border Columns on Desktop) */}
          <div className="mt-2 lg:mt-6 grid grid-cols-3 gap-2 sm:gap-6 py-3 px-3 lg:p-0 bg-light-surface lg:bg-transparent rounded-xl border lg:border-0 border-light-outline-variant text-center lg:text-left lg:pt-8 lg:border-t lg:border-light-outline-variant max-w-xl shadow-xs lg:shadow-none">
            <div className="flex flex-col">
              <p className="font-headline font-bold text-title-md sm:text-headline-sm lg:text-headline-md text-brand-indigo">1.450+</p>
              <p className="text-[11px] sm:text-body-sm text-light-on-surface-variant">Siswa Terbimbing</p>
            </div>
            <div className="flex flex-col border-x lg:border-x-0 lg:border-l border-light-outline-variant lg:pl-6">
              <p className="font-headline font-bold text-title-md sm:text-headline-sm lg:text-headline-md text-brand-indigo">92%</p>
              <p className="text-[11px] sm:text-body-sm text-light-on-surface-variant">Lolos PTN &amp; SMA</p>
            </div>
            <div className="flex flex-col lg:border-l border-light-outline-variant lg:pl-6">
              <p className="font-headline font-bold text-title-md sm:text-headline-sm lg:text-headline-md text-brand-indigo">4.9 / 5.0</p>
              <p className="text-[11px] sm:text-body-sm text-light-on-surface-variant">Kepuasan Ortu</p>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Card (Desktop Only View) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-light-outline-variant bg-light-surface group">
            <img src="assets/images/hero-classroom.jpg" 
                 data-ai-title="Sesi Belajar Kelas ARCI Bimbel" data-ai-subtitle="Pendampingan Interaktif &amp; Personal"
                 alt="Sesi bimbingan belajar tatap muka interaktif di kelas ARCI Bimbel" 
                 className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
            
            {/* Floating Tag Top Right */}
            <div className="absolute top-4 right-4 bg-light-surface/95 backdrop-blur-md rounded-xl px-3.5 py-1.5 border border-light-outline-variant shadow-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-accent text-[20px]">star</span>
              <span className="text-label-sm font-label text-light-on-surface font-semibold">Tutor Terakreditasi UI &amp; ITB</span>
            </div>

            {/* Bottom Information Card Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-light-surface/95 backdrop-blur-md rounded-xl p-4 border border-light-outline-variant shadow-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">groups</span>
              </div>
              <div>
                <p className="text-title-md font-headline font-semibold text-light-on-surface">Kelas Maksimal 8 Siswa</p>
                <p className="text-body-sm text-light-on-surface-variant">Fokus pendampingan individual terjaga optimal tanpa distorsi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 4. Keunggulan Section (2-Col Mobile Grid to 4-Col Desktop Grid) */}
    <section id="keunggulan" className="py-12 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
        <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Keunggulan ARCI Bimbel</span>
        <h2 className="font-headline text-headline-sm md:text-headline-lg-mobile lg:text-headline-lg text-light-on-surface mt-1.5 tracking-tight">
          Kenapa Mempercayakan Masa Depan Anak di Sini?
        </h2>
        <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-2 text-pretty">
          Kami mengintegrasikan kualitas pengajar terbaik, kurikulum tepat sasaran, dan sistem komunikasi transparan.
        </p>
      </div>

      {/* 2-col on Mobile, 4-col on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {/* Pilar 1 */}
        <div className="bg-light-surface rounded-xl p-4 sm:p-6 border border-light-outline-variant shadow-xs hover:shadow-md hover:border-light-primary transition-all group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-brand-indigo group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px] sm:text-[26px]">groups</span>
            </div>
            <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface mb-1 sm:mb-2 font-semibold">Maks. 8 Siswa</h3>
            <p className="text-[12px] sm:text-body-sm text-light-on-surface-variant leading-relaxed">
              Interaksi aktif dua arah. Setiap anak dipastikan paham sebelum lanjut bab berikutnya.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center gap-1.5 text-[11px] sm:text-label-sm font-label text-light-primary">
            <span className="material-symbols-outlined text-[15px]">check</span> Interaksi Personal
          </div>
        </div>

        {/* Pilar 2 */}
        <div className="bg-light-surface rounded-xl p-4 sm:p-6 border border-light-outline-variant shadow-xs hover:shadow-md hover:border-light-primary transition-all group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-brand-indigo group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px] sm:text-[26px]">school</span>
            </div>
            <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface mb-1 sm:mb-2 font-semibold">Tutor PTN Top</h3>
            <p className="text-[12px] sm:text-body-sm text-light-on-surface-variant leading-relaxed">
              Lulusan UI, ITB, &amp; UGM tersertifikasi pedagogik, ramah, dan memotivasi belajar.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center gap-1.5 text-[11px] sm:text-label-sm font-label text-light-primary">
            <span className="material-symbols-outlined text-[15px]">check</span> Lulusan Unggulan
          </div>
        </div>

        {/* Pilar 3 */}
        <div className="bg-light-surface rounded-xl p-4 sm:p-6 border border-light-outline-variant shadow-xs hover:shadow-md hover:border-light-primary transition-all group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-brand-indigo group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px] sm:text-[26px]">psychology</span>
            </div>
            <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface mb-1 sm:mb-2 font-semibold">Paham Konsep</h3>
            <p className="text-[12px] sm:text-body-sm text-light-on-surface-variant leading-relaxed">
              Bukan menghafal rumus buta. Siswa diajak paham logika penyelesaian soal HOTS.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center gap-1.5 text-[11px] sm:text-label-sm font-label text-light-primary">
            <span className="material-symbols-outlined text-[15px]">check</span> Bedah Soal HOTS
          </div>
        </div>

        {/* Pilar 4 */}
        <div className="bg-light-surface rounded-xl p-4 sm:p-6 border border-light-outline-variant shadow-xs hover:shadow-md hover:border-light-primary transition-all group flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-brand-indigo group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px] sm:text-[26px]">monitoring</span>
            </div>
            <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface mb-1 sm:mb-2 font-semibold">Pantau di HP</h3>
            <p className="text-[12px] sm:text-body-sm text-light-on-surface-variant leading-relaxed">
              Orang tua menerima pembaruan presensi, tugas, dan grafik tryout berkala via WA.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center gap-1.5 text-[11px] sm:text-label-sm font-label text-light-primary">
            <span className="material-symbols-outlined text-[15px]">check</span> Laporan Transparan
          </div>
        </div>
      </div>
    </section>

    {/* 5. Program Unggulan Section (Interactive Filters & Single to 3-Col Grid) */}
    <section id="program" className="py-12 md:py-20 bg-light-surface-soft border-y border-light-outline-variant">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 sm:gap-6">
          <div>
            <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Pilihan Belajar</span>
            <h2 className="font-headline text-headline-sm md:text-headline-lg-mobile lg:text-headline-lg text-light-on-surface mt-1 tracking-tight">Program Belajar Unggulan</h2>
            <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-1">Tersedia pilihan kelas tatap muka (offline) di cabang dan daring interaktif (online).</p>
          </div>

          {/* Filter Tab Buttons (Horizontal Scrollable on Mobile) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-light-surface border border-light-outline-variant shadow-xs overflow-x-auto no-scrollbar max-w-full">
            <button type="button" data-filter="all" className="program-tab active px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-light-primary text-light-on-primary text-[12px] sm:text-body-sm font-label whitespace-nowrap transition-colors font-medium">
              Semua Jenjang
            </button>
            <button type="button" data-filter="sd" className="program-tab px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-light-on-surface-variant hover:text-light-on-surface text-[12px] sm:text-body-sm font-label whitespace-nowrap transition-colors font-medium">
              SD
            </button>
            <button type="button" data-filter="smp" className="program-tab px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-light-on-surface-variant hover:text-light-on-surface text-[12px] sm:text-body-sm font-label whitespace-nowrap transition-colors font-medium">
              SMP
            </button>
            <button type="button" data-filter="sma" className="program-tab px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-light-on-surface-variant hover:text-light-on-surface text-[12px] sm:text-body-sm font-label whitespace-nowrap transition-colors font-medium">
              SMA &amp; UTBK
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1: SD */}
          <article data-category="sd" className="group program-card bg-light-surface border border-light-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="relative h-40 sm:h-44 bg-light-surface-container overflow-hidden">
              <img src="assets/images/program-sd.jpg" 
                   data-ai-title="Program Reguler SD Juara" data-ai-subtitle="Matematika, IPA &amp; B. Indonesia"
                   alt="Program Reguler SD Juara ARCI Bimbel" 
                   className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-label-sm font-label bg-light-surface/95 backdrop-blur-xs text-brand-indigo font-bold shadow-xs">
                SD Kelas 4–6
              </span>
            </div>
            <div className="p-5 sm:p-7 flex flex-col gap-4 flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-sm font-label text-success flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-success"></span> Tersedia 4 Kursi
                  </span>
                </div>
                <h3 className="font-headline text-headline-sm text-light-on-surface font-semibold">Reguler SD Juara</h3>
                <p className="text-body-sm text-light-on-surface-variant mt-1.5 leading-relaxed">
                  Fondasi Matematika, IPA, dan Bahasa Indonesia yang kuat dengan pendekatan visual aplikatif dan menyenangkan.
                </p>
                <ul className="text-body-sm text-light-on-surface flex flex-col gap-2.5 pt-4 mt-4 border-t border-light-outline-variant">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>2 sesi per minggu (90 menit/sesi)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Modul ringkas bergambar &amp; latihan berkala</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Bantuan PR harian &amp; persiapan ujian semester</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Laporan perkembangan bulanan ke orang tua</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-light-outline-variant flex items-center justify-between">
                <div>
                  <span className="text-[11px] sm:text-label-sm text-light-on-surface-variant block leading-tight">Mulai dari</span>
                  <span className="font-headline font-bold text-title-md sm:text-title-lg text-brand-indigo">
                    Rp750.000<span className="text-body-sm font-normal text-light-on-surface-variant">/bln</span>
                  </span>
                </div>
                <a href="#konsultasi" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark text-label-md font-label transition-colors font-medium">
                  Pilih Program
                </a>
              </div>
            </div>
          </article>

          {/* Card 2: SMP (Featured) */}
          <article data-category="smp" className="group program-card bg-light-surface border-2 border-light-primary rounded-2xl overflow-hidden shadow-md relative flex flex-col justify-between">
            <div className="absolute top-3 right-3 z-10 bg-accent text-on-accent text-label-sm font-label px-3 py-0.5 rounded-full shadow-sm font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              <span>Paling Diminati</span>
            </div>
            <div className="relative h-40 sm:h-44 bg-light-surface-container overflow-hidden">
              <img src="assets/images/program-smp.jpg" 
                   data-ai-title="Target Sukses Ujian SMP" data-ai-subtitle="Persiapan Ujian &amp; Asesmen Nasional"
                   alt="Program Target Sukses Ujian SMP ARCI Bimbel" 
                   className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-label-sm font-label bg-light-surface/95 backdrop-blur-xs text-brand-indigo font-bold shadow-xs">
                SMP Kelas 7–9
              </span>
            </div>
            <div className="p-5 sm:p-7 flex flex-col gap-4 flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-sm font-label text-success flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-success"></span> Sisa 2 Kursi
                  </span>
                </div>
                <h3 className="font-headline text-headline-sm text-light-on-surface font-semibold">Target Sukses Ujian SMP</h3>
                <p className="text-body-sm text-light-on-surface-variant mt-1.5 leading-relaxed">
                  Persiapan matang ulangan harian, Asesmen Nasional (ANBK), dan seleksi masuk SMA unggulan favorit.
                </p>
                <ul className="text-body-sm text-light-on-surface flex flex-col gap-2.5 pt-4 mt-4 border-t border-light-outline-variant">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>3 sesi per minggu (Matematika, IPA, B. Inggris)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Bank soal variatif HOTS &amp; bedah rumus konsep</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Bimbingan klinik PR &amp; tugas sekolah intensif</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Simulasi tryout berkala berbasis komputer</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-light-outline-variant flex items-center justify-between">
                <div>
                  <span className="text-[11px] sm:text-label-sm text-light-on-surface-variant block leading-tight">Mulai dari</span>
                  <span className="font-headline font-bold text-title-md sm:text-title-lg text-brand-indigo">
                    Rp950.000<span className="text-body-sm font-normal text-light-on-surface-variant">/bln</span>
                  </span>
                </div>
                <a href="#konsultasi" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark text-label-md font-label transition-colors font-semibold shadow-xs">
                  Pilih Program
                </a>
              </div>
            </div>
          </article>

          {/* Card 3: SMA / UTBK */}
          <article data-category="sma" className="group program-card bg-light-surface border-2 border-light-primary/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <a href="/program/intensif-utbk-2026" className="block relative h-40 sm:h-44 bg-light-surface-container overflow-hidden">
              <img src="assets/images/program-sma.jpg" 
                   data-ai-title="Intensif UTBK-SNBT 2026" data-ai-subtitle="Drill Soal TPS &amp; IRT Nasional"
                   alt="Program Intensif UTBK-SNBT ARCI Bimbel" 
                   className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-label-sm font-label bg-light-surface/95 backdrop-blur-xs text-brand-indigo font-bold shadow-xs">
                SMA / Alumni
              </span>
              <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent text-on-accent shadow-xs">
                Unggulan
              </span>
            </a>
            <div className="p-5 sm:p-7 flex flex-col gap-4 flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-sm font-label text-warning flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-warning"></span> Hampir Penuh (Sisa 4 Kursi)
                  </span>
                </div>
                <a href="/program/intensif-utbk-2026" className="hover:text-brand-indigo transition-colors block">
                  <h3 className="font-headline text-headline-sm text-light-on-surface hover:text-brand-indigo font-bold">Intensif UTBK-SNBT 2026</h3>
                </a>
                <p className="text-body-sm text-light-on-surface-variant mt-1.5 leading-relaxed">
                  Spesialisasi Tes Potensi Skolastik (TPS), Literasi Bahasa, dan Penalaran Matematika dengan sistem IRT nasional.
                </p>
                <ul className="text-body-sm text-light-on-surface flex flex-col gap-2.5 pt-4 mt-4 border-t border-light-outline-variant">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>4 sesi per minggu + Tryout IRT Mingguan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Konseling pemetaan peluang jurusan &amp; PTN</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Akses rekaman kelas &amp; drill soal digital 24/7</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">check_circle</span>
                    <span>Mentor pribadi untuk strategi pemilihan kampus</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-light-outline-variant flex items-center justify-between">
                <div>
                  <span className="text-[11px] sm:text-label-sm text-light-on-surface-variant block leading-tight">Mulai dari</span>
                  <span className="font-headline font-bold text-title-md sm:text-title-lg text-brand-indigo">
                    Rp1.450.000<span className="text-body-sm font-normal text-light-on-surface-variant">/bln</span>
                  </span>
                </div>
                <a href="/program/intensif-utbk-2026" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark text-label-md font-label transition-colors font-medium">
                  Detail Program
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    {/* 6. 3 Langkah Memulai Section (Responsive Vertical to Grid) */}
    <section id="alur" className="py-12 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
        <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Alur Pendaftaran Mudah</span>
        <h2 className="font-headline text-headline-sm md:text-headline-lg-mobile lg:text-headline-lg text-light-on-surface mt-1 tracking-tight">
          3 Langkah Cepat Memulai Belajar di ARCI
        </h2>
        <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-2 text-pretty">
          Proses transparan tanpa repot. Kebutuhan unik belajar anak Anda terpetakan dengan tepat sejak hari pertama.
        </p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-4 sm:gap-8 relative">
        {/* Step 1 */}
        <div className="bg-light-surface border border-light-outline-variant rounded-2xl p-5 sm:p-8 text-left md:text-center flex md:flex-col items-center md:items-center gap-4 md:gap-0 shadow-xs hover:shadow-md transition-shadow relative">
          <div className="md:absolute md:-top-4 bg-light-primary text-light-on-primary w-8 h-8 rounded-full font-headline font-bold text-title-md flex items-center justify-center shadow-sm shrink-0">
            1
          </div>
          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-light-primary-container text-light-primary items-center justify-center mb-5 mt-2">
            <span className="material-symbols-outlined text-[34px]">edit_note</span>
          </div>
          <div>
            <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface mb-1 sm:mb-2 font-semibold">Konsultasi &amp; Free Trial</h3>
            <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
              Isi formulir singkat untuk mengikuti sesi uji coba gratis serta asesmen diagnostik gaya belajar anak tanpa pungutan biaya.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-light-surface border border-light-outline-variant rounded-2xl p-5 sm:p-8 text-left md:text-center flex md:flex-col items-center md:items-center gap-4 md:gap-0 shadow-xs hover:shadow-md transition-shadow relative">
          <div className="md:absolute md:-top-4 bg-light-primary text-light-on-primary w-8 h-8 rounded-full font-headline font-bold text-title-md flex items-center justify-center shadow-sm shrink-0">
            2
          </div>
          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-light-primary-container text-light-primary items-center justify-center mb-5 mt-2">
            <span className="material-symbols-outlined text-[34px]">diversity_3</span>
          </div>
          <div>
            <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface mb-1 sm:mb-2 font-semibold">Penempatan Kelas Tepat</h3>
            <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
              Siswa dikelompokkan secara homogen berdasarkan tingkat pemahaman dan target nilai, menjaga dinamika kelas tetap harmonis.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-light-surface border border-light-outline-variant rounded-2xl p-5 sm:p-8 text-left md:text-center flex md:flex-col items-center md:items-center gap-4 md:gap-0 shadow-xs hover:shadow-md transition-shadow relative">
          <div className="md:absolute md:-top-4 bg-light-primary text-light-on-primary w-8 h-8 rounded-full font-headline font-bold text-title-md flex items-center justify-center shadow-sm shrink-0">
            3
          </div>
          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-light-primary-container text-light-primary items-center justify-center mb-5 mt-2">
            <span className="material-symbols-outlined text-[34px]">trending_up</span>
          </div>
          <div>
            <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface mb-1 sm:mb-2 font-semibold">Pantau Progres Real-Time</h3>
            <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
              Orang tua secara mudah memantau kehadiran harian, grafik nilai tryout, modul pembelajaran, dan administrasi lewat portal ARCI.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* 7. Tutor Pilihan (Mobile Snap-Scroll Carousel to Desktop 4-Col Grid) */}
    <section id="tutor" className="py-12 md:py-20 bg-light-surface-soft border-t border-light-outline-variant">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-12 gap-4">
          <div>
            <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Pengajar Berpengalaman</span>
            <h2 className="font-headline text-headline-sm md:text-headline-lg-mobile lg:text-headline-lg text-light-on-surface mt-1 tracking-tight">Belajar Bersama Tutor Ahli</h2>
            <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-1 hidden sm:block">Lulusan universitas top nasional dengan sertifikasi pedagogik yang ramah dan sabar.</p>
          </div>
          <span className="lg:hidden text-[11px] text-light-on-surface-variant font-medium shrink-0">Geser →</span>
          <a href="#konsultasi" className="hidden lg:inline-flex text-body-md font-label text-light-primary hover:text-brand-indigo font-semibold items-center gap-1">
            Lihat Seluruh Tutor <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>

        {/* Snap-Scroll on Mobile, Grid on Desktop */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-4 pb-2 lg:pb-0">
          {/* Tutor 1: Budi Pratama (AI Photo) */}
          <div className="w-64 sm:w-72 lg:w-auto shrink-0 snap-start bg-light-surface border border-light-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="relative rounded-xl overflow-hidden mb-4 bg-light-surface-container aspect-square">
                <img src="assets/images/tutor-budi.jpg" 
                     data-ai-title="Budi Pratama, S.Si." data-ai-subtitle="Tutor Senior Matematika • UI"
                     alt="Foto Budi Pratama, S.Si." 
                     className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-light-surface/90 backdrop-blur-xs text-[11px] font-semibold text-brand-indigo">
                  7 Th Pengalaman
                </span>
              </div>
              <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface font-semibold">Budi Pratama, S.Si.</h3>
              <p className="text-[12px] sm:text-label-sm text-light-primary font-label font-medium mt-0.5">Tutor Matematika • UI</p>
              <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
                Pakar trik penalaran analitis dan aljabar tanpa rumus yang rumit.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center justify-between text-body-sm text-light-on-surface-variant">
              <span className="flex items-center gap-1 text-[12px] sm:text-label-sm">
                <span className="material-symbols-outlined text-accent text-[16px]">star</span> 4.95 / 5.0
              </span>
              <span className="text-[11px] sm:text-label-sm text-brand-indigo font-medium">SMA/UTBK</span>
            </div>
          </div>

          {/* Tutor 2: Siti Rahma (AI Photo) */}
          <div className="w-64 sm:w-72 lg:w-auto shrink-0 snap-start bg-light-surface border border-light-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="relative rounded-xl overflow-hidden mb-4 bg-light-surface-container aspect-square">
                <img src="assets/images/tutor-siti.jpg" 
                     data-ai-title="Siti Rahma, M.Pd." data-ai-subtitle="Tutor Sains &amp; Kimia • ITB"
                     alt="Foto Siti Rahma, M.Pd." 
                     className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-light-surface/90 backdrop-blur-xs text-[11px] font-semibold text-brand-indigo">
                  6 Th Pengalaman
                </span>
              </div>
              <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface font-semibold">Siti Rahma, M.Pd.</h3>
              <p className="text-[12px] sm:text-label-sm text-light-primary font-label font-medium mt-0.5">Tutor Sains &amp; Kimia • ITB</p>
              <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
                Menyederhanakan konsep reaksi sains ke analogi dunia nyata yang seru.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center justify-between text-body-sm text-light-on-surface-variant">
              <span className="flex items-center gap-1 text-[12px] sm:text-label-sm">
                <span className="material-symbols-outlined text-accent text-[16px]">star</span> 4.92 / 5.0
              </span>
              <span className="text-[11px] sm:text-label-sm text-brand-indigo font-medium">SMP &amp; SMA</span>
            </div>
          </div>

          {/* Tutor 3: Amanda Putri (AI Photo) */}
          <div className="w-64 sm:w-72 lg:w-auto shrink-0 snap-start bg-light-surface border border-light-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="relative rounded-xl overflow-hidden mb-4 bg-light-surface-container aspect-square">
                <img src="assets/images/tutor-amanda.jpg" 
                     data-ai-title="Amanda Putri, S.Si." data-ai-subtitle="Tutor Fisika &amp; Skolastik • UGM"
                     alt="Foto Amanda Putri, S.Si." 
                     className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-light-surface/90 backdrop-blur-xs text-[11px] font-semibold text-brand-indigo">
                  5 Th Pengalaman
                </span>
              </div>
              <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface font-semibold">Amanda Putri, S.Si.</h3>
              <p className="text-[12px] sm:text-label-sm text-light-primary font-label font-medium mt-0.5">Fisika &amp; Skolastik • UGM</p>
              <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
                Pendekatan interaktif dengan visualisasi grafis untuk pemecahan masalah.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center justify-between text-body-sm text-light-on-surface-variant">
              <span className="flex items-center gap-1 text-[12px] sm:text-label-sm">
                <span className="material-symbols-outlined text-accent text-[16px]">star</span> 4.97 / 5.0
              </span>
              <span className="text-[11px] sm:text-label-sm text-brand-indigo font-medium">UTBK &amp; OSN</span>
            </div>
          </div>

          {/* Tutor 4: Dimas Arya (AI Photo) */}
          <div className="w-64 sm:w-72 lg:w-auto shrink-0 snap-start bg-light-surface border border-light-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="relative rounded-xl overflow-hidden mb-4 bg-light-surface-container aspect-square">
                <img src="assets/images/tutor-dimas.jpg" 
                     data-ai-title="Dimas Arya, S.Pd." data-ai-subtitle="Tutor Literasi &amp; B. Inggris • UNJ"
                     alt="Foto Dimas Arya, S.Pd." 
                     className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-light-surface/90 backdrop-blur-xs text-[11px] font-semibold text-brand-indigo">
                  6 Th Pengalaman
                </span>
              </div>
              <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface font-semibold">Dimas Arya, S.Pd.</h3>
              <p className="text-[12px] sm:text-label-sm text-light-primary font-label font-medium mt-0.5">Literasi &amp; B. Inggris • UNJ</p>
              <p className="text-body-sm text-light-on-surface-variant mt-2 leading-relaxed">
                Metode membaca kritis cepat dan bedah struktur teks ujian literasi.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-light-outline-variant/60 flex items-center justify-between text-body-sm text-light-on-surface-variant">
              <span className="flex items-center gap-1 text-[12px] sm:text-label-sm">
                <span className="material-symbols-outlined text-accent text-[16px]">star</span> 4.90 / 5.0
              </span>
              <span className="text-[11px] sm:text-label-sm text-brand-indigo font-medium">SD &amp; SMP</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 8. Testimoni & Bukti Prestasi Section */}
    <section id="testimoni" className="py-12 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
        <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Kisah Sukses Siswa</span>
        <h2 className="font-headline text-headline-sm md:text-headline-lg-mobile lg:text-headline-lg text-light-on-surface mt-1 tracking-tight">
          Apa Kata Orang Tua &amp; Siswa Berprestasi Kami?
        </h2>
        <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-2 text-pretty">
          Kepercayaan orang tua adalah amanah terbesar bagi tim pengajar ARCI Bimbel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        {/* Testimoni 1: Ibu Ratna */}
        <div className="bg-light-surface border border-light-outline-variant rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-accent mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
            </div>
            <p className="text-body-sm sm:text-body-md text-light-on-surface leading-relaxed italic">
              "Sebelumnya anak saya sering stres kalau ada PR matematika. Sejak ikut kelas reguler ARCI, nilainya melonjak dari 65 ke 92. Tutornya sangat sabar dan laporannya transparan sekali."
            </p>
          </div>
          <div className="pt-4 mt-5 border-t border-light-outline-variant flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-light-outline-variant shadow-xs">
              <img src="assets/images/parent-ratna.jpg" 
                   data-ai-title="Ibu Ratna Dewi" data-ai-subtitle="Orang Tua Siswa SMP"
                   alt="Foto Ibu Ratna Dewi" 
                   className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-headline font-semibold text-title-md text-light-on-surface">Ibu Ratna Dewi</p>
              <p className="text-[12px] text-light-on-surface-variant">Orang Tua Siswa Kelas 8 — SMP Labschool</p>
            </div>
          </div>
        </div>

        {/* Testimoni 2: Ahmad Fauzan (AI Photo of High Achiever Student) */}
        <div className="bg-light-surface border-2 border-brand-indigo/30 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative bg-gradient-to-b from-white to-light-surface-soft">
          <div className="absolute -top-3.5 right-4 sm:right-6 bg-brand-indigo text-white text-[10.5px] font-label px-3 py-1 rounded-full font-semibold shadow-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">school</span>
            <span>Lolos PTN 2026</span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-accent mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
            </div>
            <p className="text-body-sm sm:text-body-md text-light-on-surface leading-relaxed italic">
              "Drilling soal TPS dan pembahasan IRT di program UTBK ARCI bener-bener mirip dengan tipe soal aslinya. Konseling pemetaan jurusannya juga akurat banget sampai saya lolos ke FTTM ITB!"
            </p>
          </div>
          <div className="pt-4 mt-5 border-t border-light-outline-variant flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-brand-indigo/30 shadow-xs">
              <img src="assets/images/student-success.jpg" 
                   data-ai-title="Ahmad Fauzan" data-ai-subtitle="Lolos FTTM ITB"
                   alt="Foto Ahmad Fauzan" 
                   className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-headline font-semibold text-title-md text-light-on-surface">Ahmad Fauzan</p>
              <p className="text-[12px] text-success font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span> Lolos SNBT FTTM ITB 2026
              </p>
            </div>
          </div>
        </div>

        {/* Testimoni 3: drg. Haryanto */}
        <div className="bg-light-surface border border-light-outline-variant rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-accent mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
            </div>
            <p className="text-body-sm sm:text-body-md text-light-on-surface leading-relaxed italic">
              "Format kelas maksimal 8 orang sangat efektif. Anak saya yang biasanya pendiam di sekolah jadi aktif bertanya. Ruang belajarnya juga nyaman, bersih, dan ber-AC dingin."
            </p>
          </div>
          <div className="pt-4 mt-5 border-t border-light-outline-variant flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-light-outline-variant shadow-xs">
              <img src="assets/images/parent-haryanto.jpg" 
                   data-ai-title="drg. Haryanto W." data-ai-subtitle="Orang Tua Siswa SD"
                   alt="Foto drg. Haryanto W." 
                   className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-headline font-semibold text-title-md text-light-on-surface">drg. Haryanto W.</p>
              <p className="text-[12px] text-light-on-surface-variant">Orang Tua Siswa Kelas 5 SD Mentari</p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Banner */}
      <div className="mt-8 md:mt-12 bg-light-primary text-light-on-primary rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent text-on-accent flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px] sm:text-[32px]">emoji_events</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-title-md sm:text-title-lg text-white">Garansi Peningkatan Nilai &amp; Pemahaman</h4>
            <p className="text-[12px] sm:text-body-sm text-light-surface-container-low mt-0.5">
              Evaluasi berkala setiap bulan. Tersedia klinik bimbingan tambahan gratis jika anak membutuhkan penguatan konsep.
            </p>
          </div>
        </div>
        <a href="#konsultasi" className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-accent text-on-accent hover:bg-yellow-400 font-label text-label-md sm:text-label-lg font-bold transition-colors whitespace-nowrap shadow-xs">
          Konsultasi Sekarang
        </a>
      </div>
    </section>

    {/* 9. Lokasi & Fasilitas Belajar Section (Responsive 1-Col to 3-Col) */}
    <section id="lokasi" className="py-12 md:py-20 bg-light-surface-soft border-t border-light-outline-variant">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
          <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Cabang &amp; Fasilitas</span>
          <h2 className="font-headline text-headline-sm md:text-headline-lg-mobile lg:text-headline-lg text-light-on-surface mt-1 tracking-tight">
            Lokasi Belajar Nyaman &amp; Strategis
          </h2>
          <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-2 text-pretty">
            Tersedia pilihan lokasi tatap muka di lokasi utama atau kelas daring interaktif dari rumah Anda.
          </p>
        </div>

        {/* 3 Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-14">
          {/* Cabang 1: Kebayoran Baru (With AI Interior Image) */}
          <div className="bg-light-surface border border-light-outline-variant rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="relative h-40 sm:h-44 bg-light-surface-container overflow-hidden">
              <img src="assets/images/branch-kebayoran.jpg" 
                   data-ai-title="Cabang Kebayoran Baru" data-ai-subtitle="Ruang Belajar Modern Ber-AC"
                   alt="Interior Kelas Cabang Kebayoran Baru ARCI Bimbel" 
                   className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-light-surface/90 backdrop-blur-xs text-[11px] font-bold text-brand-indigo uppercase tracking-wider">
                Cabang Pusat
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface font-semibold mb-2">Kebayoran Baru, Jakarta Selatan</h3>
              <p className="text-body-sm text-light-on-surface-variant leading-relaxed mb-4">
                Jl. Pendidikan No. 42, Kebayoran Baru, Jakarta Selatan 12130 (Dekat Stasiun MRT Blok M).
              </p>
              <div className="space-y-1.5 text-body-sm text-light-on-surface">
                <p className="flex items-center gap-2 text-light-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">schedule</span> Senin – Sabtu: 08.00 – 19.30 WIB
                </p>
                <p className="flex items-center gap-2 text-light-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">call</span> (021) 720-4567 / 0812-3456-7890
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-light-outline-variant/60 flex items-center justify-between">
              <span className="text-[12px] sm:text-label-sm text-success font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Kelas Offline Buka
              </span>
              <a href="#konsultasi" className="text-body-sm font-label text-light-primary hover:underline font-semibold">
                Lihat Jadwal →
              </a>
            </div>
          </div>

          {/* Cabang 2: Rawamangun (With AI Image) */}
          <div className="bg-light-surface border border-light-outline-variant rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="relative h-40 sm:h-44 bg-light-surface-container overflow-hidden">
              <img src="assets/images/branch-rawamangun.jpg" 
                   data-ai-title="Cabang Rawamangun" data-ai-subtitle="Smartboard &amp; Ruang Belajar Nyaman"
                   alt="Interior Kelas Cabang Rawamangun ARCI Bimbel" 
                   className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-light-surface/90 backdrop-blur-xs text-[11px] font-bold text-brand-indigo uppercase tracking-wider">
                Cabang Timur
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface font-semibold mb-2">Rawamangun, Jakarta Timur</h3>
              <p className="text-body-sm text-light-on-surface-variant leading-relaxed mb-4">
                Jl. Paus No. 18, Rawamangun, Pulo Gadung, Jakarta Timur 13220 (Dekat Halte TransJakarta UNJ).
              </p>
              <div className="space-y-1.5 text-body-sm text-light-on-surface">
                <p className="flex items-center gap-2 text-light-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">schedule</span> Senin – Sabtu: 08.00 – 19.30 WIB
                </p>
                <p className="flex items-center gap-2 text-light-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">call</span> (021) 478-8901 / 0812-9876-5432
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-light-outline-variant/60 flex items-center justify-between">
              <span className="text-[12px] sm:text-label-sm text-success font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Kelas Offline Buka
              </span>
              <a href="#konsultasi" className="text-body-sm font-label text-light-primary hover:underline font-semibold">
                Lihat Jadwal →
              </a>
            </div>
          </div>

          {/* Cabang 3: Online Interaktif (With AI Image) */}
          <div className="bg-light-surface border border-light-outline-variant rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="relative h-40 sm:h-44 bg-light-surface-container overflow-hidden">
              <img src="assets/images/class-online.jpg" 
                   data-ai-title="Live Interactive Virtual Class" data-ai-subtitle="Jangkauan Seluruh Indonesia"
                   alt="Kelas Online Interaktif ARCI Bimbel" 
                   className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-light-surface/90 backdrop-blur-xs text-[11px] font-bold text-brand-indigo uppercase tracking-wider">
                Kelas Online Nasional
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="font-headline text-title-md sm:text-title-lg text-light-on-surface font-semibold mb-2">Live Interactive Virtual Class</h3>
              <p className="text-body-sm text-light-on-surface-variant leading-relaxed mb-4">
                Kelas Zoom/Google Meet premium dengan fitur interaktif, rekaman per sesi HD, dan pengiriman modul fisik langsung ke rumah.
              </p>
              <div className="space-y-1.5 text-body-sm text-light-on-surface">
                <p className="flex items-center gap-2 text-light-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">schedule</span> Jadwal Fleksibel (Sore &amp; Malam)
                </p>
                <p className="flex items-center gap-2 text-light-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">public</span> Menjangkau Seluruh Wilayah Indonesia
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-light-outline-variant/60 flex items-center justify-between">
              <span className="text-[12px] sm:text-label-sm text-success font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Pendaftaran Aktif
              </span>
              <a href="#konsultasi" className="text-body-sm font-label text-light-primary hover:underline font-semibold">
                Lihat Jadwal →
              </a>
            </div>
          </div>
        </div>

        {/* 5 Key Facilities Feature Bar */}
        <div className="bg-light-surface rounded-2xl p-5 sm:p-8 border border-light-outline-variant shadow-xs">
          <h4 className="font-headline font-semibold text-title-md sm:text-title-lg text-light-on-surface mb-5 text-center">
            Fasilitas Standar di Setiap Cabang ARCI
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[24px]">ac_unit</span>
              </div>
              <p className="text-body-sm font-semibold text-light-on-surface">Ruang Ber-AC Sejuk</p>
              <p className="text-[11px] text-light-on-surface-variant">Kondusif &amp; higienis</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[24px]">tv</span>
              </div>
              <p className="text-body-sm font-semibold text-light-on-surface">Smart TV &amp; Proyektor</p>
              <p className="text-[11px] text-light-on-surface-variant">Visual materi interaktif</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[24px]">wifi</span>
              </div>
              <p className="text-body-sm font-semibold text-light-on-surface">Wi-Fi Cepat 100 Mbps</p>
              <p className="text-[11px] text-light-on-surface-variant">Drill soal digital lancar</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[24px]">menu_book</span>
              </div>
              <p className="text-body-sm font-semibold text-light-on-surface">Mini Perpustakaan</p>
              <p className="text-[11px] text-light-on-surface-variant">Bank soal &amp; referensi</p>
            </div>
            <div className="flex flex-col items-center col-span-2 sm:col-span-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[24px]">local_cafe</span>
              </div>
              <p className="text-body-sm font-semibold text-light-on-surface">Lounge &amp; Free Water</p>
              <p className="text-[11px] text-light-on-surface-variant">Ruang tunggu orang tua</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 10. FAQ Section (Responsive Accordion) */}
    <section id="faq" className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 md:mb-12">
        <span className="text-label-sm font-label text-light-primary uppercase tracking-wider font-semibold">Tanya Jawab</span>
        <h2 className="font-headline text-headline-sm md:text-headline-lg-mobile lg:text-headline-lg text-light-on-surface mt-1 tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-1.5 text-pretty">
          Semua yang perlu Anda ketahui mengenai pendaftaran, metode belajar, dan sistem pemantauan di ARCI Bimbel.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4" id="faq-container">
        {/* FAQ Item 1 */}
        <div className="border border-light-outline-variant rounded-xl bg-light-surface overflow-hidden transition-colors">
          <button type="button" className="faq-btn w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-headline font-semibold text-body-md sm:text-title-md text-light-on-surface hover:text-brand-indigo">
            <span>Bagaimana cara mengikuti uji coba (free trial) belajar?</span>
            <span className="material-symbols-outlined text-[20px] sm:text-[22px] transition-transform duration-200">expand_more</span>
          </button>
          <div className="faq-content px-4 sm:px-6 pb-4 pt-1 text-body-sm sm:text-body-md text-light-on-surface-variant hidden border-t border-light-outline-variant/50">
            Anda cukup mengisi formulir pada halaman ini atau menghubungi tim admin kami via WhatsApp. Tim kami akan menjadwalkan tes diagnostik dan satu sesi kelas trial gratis sesuai jenjang anak Anda tanpa kewajiban pendaftaran.
          </div>
        </div>

        {/* FAQ Item 2 */}
        <div className="border border-light-outline-variant rounded-xl bg-light-surface overflow-hidden transition-colors">
          <button type="button" className="faq-btn w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-headline font-semibold text-body-md sm:text-title-md text-light-on-surface hover:text-brand-indigo">
            <span>Berapa kapasitas maksimal siswa dalam satu kelas?</span>
            <span className="material-symbols-outlined text-[20px] sm:text-[22px] transition-transform duration-200">expand_more</span>
          </button>
          <div className="faq-content px-4 sm:px-6 pb-4 pt-1 text-body-sm sm:text-body-md text-light-on-surface-variant hidden border-t border-light-outline-variant/50">
            Kami membatasi maksimal 8 siswa per kelas untuk program reguler dan intensif. Ini dirancang agar tutor dapat memberikan perhatian penuh kepada setiap anak dan memastikan interaksi aktif dua arah.
          </div>
        </div>

        {/* FAQ Item 3 */}
        <div className="border border-light-outline-variant rounded-xl bg-light-surface overflow-hidden transition-colors">
          <button type="button" className="faq-btn w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-headline font-semibold text-body-md sm:text-title-md text-light-on-surface hover:text-brand-indigo">
            <span>Apakah ada sesi konsultasi PR di luar jadwal les?</span>
            <span className="material-symbols-outlined text-[20px] sm:text-[22px] transition-transform duration-200">expand_more</span>
          </button>
          <div className="faq-content px-4 sm:px-6 pb-4 pt-1 text-body-sm sm:text-body-md text-light-on-surface-variant hidden border-t border-light-outline-variant/50">
            Ya! Siswa dapat mengikuti Klinik PR yang dibuka setiap sore sebelum jam kelas dimulai atau bertanya via grup konsultasi digital bersama tutor pendamping.
          </div>
        </div>

        {/* FAQ Item 4 */}
        <div className="border border-light-outline-variant rounded-xl bg-light-surface overflow-hidden transition-colors">
          <button type="button" className="faq-btn w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-headline font-semibold text-body-md sm:text-title-md text-light-on-surface hover:text-brand-indigo">
            <span>Bagaimana orang tua memantau perkembangan nilai dan kehadiran?</span>
            <span className="material-symbols-outlined text-[20px] sm:text-[22px] transition-transform duration-200">expand_more</span>
          </button>
          <div className="faq-content px-4 sm:px-6 pb-4 pt-1 text-body-sm sm:text-body-md text-light-on-surface-variant hidden border-t border-light-outline-variant/50">
            Orang tua mendapatkan akun Portal ARCI untuk melihat presensi real-time, nilai tugas, dan grafik tryout. Selain itu, kami juga mengirimkan rekap bulanan lewat WhatsApp wali siswa.
          </div>
        </div>

        {/* FAQ Item 5 */}
        <div className="border border-light-outline-variant rounded-xl bg-light-surface overflow-hidden transition-colors">
          <button type="button" className="faq-btn w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-headline font-semibold text-body-md sm:text-title-md text-light-on-surface hover:text-brand-indigo">
            <span>Bagaimana jika anak berhalangan hadir pada sesi kelas?</span>
            <span className="material-symbols-outlined text-[20px] sm:text-[22px] transition-transform duration-200">expand_more</span>
          </button>
          <div className="faq-content px-4 sm:px-6 pb-4 pt-1 text-body-md text-light-on-surface-variant hidden border-t border-light-outline-variant/50">
            Siswa dapat mengajukan kelas pengganti (make-up class) di sesi paralel lain atau mengakses rekaman materi dan rangkuman modul melalui portal siswa kami.
          </div>
        </div>
      </div>
    </section>

    {/* 11. Form Konsultasi & Trial Gratis Section (Touch-Friendly Responsive Form) */}
    <section id="konsultasi" className="py-12 md:py-20 bg-light-surface-soft border-t border-light-outline-variant">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-md p-5 sm:p-8 md:p-12">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-light-primary text-light-on-primary mb-2.5 font-semibold shadow-xs">
              Formulir Pendaftaran &amp; Konsultasi
            </span>
            <h2 className="font-headline text-headline-sm md:text-headline-md lg:text-headline-lg text-light-on-surface tracking-tight">
              Jadwalkan Konsultasi Belajar Gratis
            </h2>
            <p className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-1.5 text-pretty">
              Konselor akademik kami akan menghubungi Anda dalam 1 hari kerja untuk rekomendasi kelas dan jadwal free trial.
            </p>
          </div>

          <form id="consultation-form" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Nama Ortu */}
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Nama Lengkap Orang Tua / Wali <span className="text-danger">*</span></span>
              <input type="text" id="parent-name" placeholder="Contoh: Dra. Nurhayati" className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md" required />
            </label>

            {/* Nama Siswa */}
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Nama Siswa <span className="text-danger">*</span></span>
              <input type="text" id="student-name" placeholder="Contoh: Farhan Pratama" className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md" required />
            </label>

            {/* WhatsApp */}
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Nomor WhatsApp Aktif <span className="text-danger">*</span></span>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-light-on-surface-variant material-symbols-outlined text-[20px]" aria-hidden="true">phone_android</span>
                <input type="tel" id="parent-phone" inputMode="numeric" placeholder="0812-3456-7890" className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md" required />
              </div>
            </label>

            {/* Jenjang */}
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Jenjang Pendidikan Siswa <span className="text-danger">*</span></span>
              <select id="grade-level" className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md bg-light-surface" required>
                <option value="SD">SD (Kelas 4–6)</option>
                <option value="SMP" selected>SMP (Kelas 7–9)</option>
                <option value="SMA">SMA (Kelas 10–12)</option>
                <option value="UTBK">Alumni / Persiapan UTBK-SNBT</option>
              </select>
            </label>

            {/* Preferensi Belajar */}
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Pilihan Metode Belajar</span>
              <select id="learning-mode" className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md bg-light-surface">
                <option value="offline-kebayoran">Offline — Cabang Kebayoran Baru (Jaksel)</option>
                <option value="offline-rawamangun">Offline — Cabang Rawamangun (Jaktim)</option>
                <option value="online">Online Live Interaktif (Zoom / Meet)</option>
              </select>
            </label>

            {/* Mata Pelajaran yang Dibutuhkan */}
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Fokus Pelajaran yang Perlu Bantuan</span>
              <input type="text" id="target-subject" placeholder="Contoh: Matematika &amp; Fisika" className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md" />
            </label>

            {/* Catatan Tambahan */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <span className="font-label text-label-md text-light-on-surface font-semibold">Catatan Tambahan atau Target Khusus (Opsional)</span>
              <textarea id="notes" rows={3} placeholder="Contoh: Ingin persiapan ujian kenaikan kelas dan pemantapan materi aljabar." className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md"></textarea>
            </div>

            {/* Simple Math Captcha */}
            <div className="md:col-span-2 flex flex-col gap-2 p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/70">
              <div className="flex items-center justify-between">
                <span className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-light-primary">verified_user</span>
                  Verifikasi Keamanan (Captcha) <span className="text-danger">*</span>
                </span>
                <button
                  type="button"
                  id="refresh-consult-captcha"
                  className="text-[12px] font-label text-light-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  title="Ganti Soal Captcha"
                >
                  <span className="material-symbols-outlined text-[15px]">refresh</span>
                  Ganti Soal
                </button>
              </div>
              <p className="text-[12px] text-light-on-surface-variant">
                Berapa hasil penjumlahan berikut untuk memastikan Anda bukan robot:
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 bg-light-surface px-4 py-2.5 rounded-lg border border-light-outline font-headline font-bold text-title-md text-light-primary select-none tracking-wider shrink-0 shadow-2xs">
                  <span id="consult-num1">1</span>
                  <span>+</span>
                  <span id="consult-num2">7</span>
                  <span>=</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    id="consult-captcha-input"
                    placeholder="Ketikkan jawaban angka..."
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-light-outline text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-1 focus:ring-light-primary text-body-md bg-light-surface"
                    required
                  />
                </div>
              </div>
              <p id="consult-captcha-error" className="hidden text-[12px] text-danger font-medium flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px]">error</span>
                Jawaban verifikasi keamanan belum tepat. Silakan hitung kembali.
              </p>
            </div>

            {/* Submit Section */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-light-outline-variant">
              <span className="text-body-sm text-light-on-surface-variant flex items-center gap-1.5 text-center sm:text-left">
                <span className="material-symbols-outlined text-[16px] text-success shrink-0">lock</span>
                Data Anda aman, terenkripsi, dan tidak pernah dibagikan ke pihak ketiga.
              </span>
              <button type="submit" id="submit-btn" className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label shadow-sm text-label-lg transition-all font-semibold whitespace-nowrap active:scale-[0.98]">
                Kirim Permintaan Konsultasi
              </button>
            </div>
          </form>

          {/* Success Notification Card (Hidden by default) */}
          <div id="form-success" className="hidden mt-6 p-5 sm:p-6 rounded-xl bg-light-primary-container border border-brand-indigo/30 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <span className="material-symbols-outlined text-[28px]">check</span>
            </div>
            <h4 id="form-success-title" className="font-headline font-bold text-headline-sm text-brand-indigo-dark">
              Terima Kasih! Permintaan Terkirim
            </h4>
            <p id="form-success-desc" className="text-body-sm sm:text-body-md text-light-on-surface-variant mt-1.5 max-w-md mx-auto leading-relaxed">
              Konselor akademik kami akan menghubungi Anda melalui WhatsApp dalam waktu 1 hari kerja untuk mengatur jadwal trial gratis.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>

  {/* 12. Global Footer (Responsive 1-Col Mobile to 4-Col Desktop Grid) */}
  <footer className="bg-light-surface border-t border-light-outline-variant py-10 md:py-14">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
      {/* Col 1: Brand Info */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-title-lg">
            A
          </div>
          <span className="font-headline font-bold text-title-lg text-brand-indigo">ARCI Bimbel</span>
        </div>
        <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
          Lembaga bimbingan belajar berkualitas tinggi dengan tutor berdedikasi lulusan perguruan tinggi terkemuka, kurikulum adaptif, dan sistem pemantauan siswa transparan.
        </p>
        <div className="flex items-center gap-3 pt-2 text-light-on-surface-variant">
          <a href="#" className="w-9 h-9 rounded-lg bg-light-surface-container flex items-center justify-center hover:text-brand-indigo transition-colors" aria-label="Instagram ARCI Bimbel">
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </a>
          <a href="#" className="w-9 h-9 rounded-lg bg-light-surface-container flex items-center justify-center hover:text-brand-indigo transition-colors" aria-label="YouTube ARCI Bimbel">
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
          </a>
          <a href="https://wa.me/6281234567890" className="w-9 h-9 rounded-lg bg-light-surface-container flex items-center justify-center hover:text-success transition-colors" aria-label="WhatsApp ARCI Bimbel">
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </a>
        </div>
      </div>

      {/* Col 2: Program Belajar */}
      <div>
        <p className="font-label font-bold text-light-on-surface mb-3 md:mb-4 text-label-lg">Program Belajar</p>
        <ul className="flex flex-col gap-2.5 text-body-sm text-light-on-surface-variant">
          <li><a href="/program/intensif-utbk-2026" className="hover:text-light-primary text-brand-indigo font-bold flex items-center gap-1 transition-colors">Intensif UTBK-SNBT 2026 <span className="material-symbols-outlined text-[14px]">arrow_forward</span></a></li>
          <li><a href="#program" className="hover:text-light-primary transition-colors">Bimbel Reguler SD (Kelas 4–6)</a></li>
          <li><a href="#program" className="hover:text-light-primary transition-colors">Bimbel Reguler SMP (Kelas 7–9)</a></li>
          <li><a href="#program" className="hover:text-light-primary transition-colors">Bimbel Reguler SMA (Kelas 10–12)</a></li>
          <li><a href="#program" className="hover:text-light-primary transition-colors">Program Privat 1-on-1</a></li>
        </ul>
      </div>

      {/* Col 3: Akses & Layanan */}
      <div>
        <p className="font-label font-bold text-light-on-surface mb-3 md:mb-4 text-label-lg">Akses &amp; Layanan</p>
        <ul className="flex flex-col gap-2.5 text-body-sm text-light-on-surface-variant">
          <li><a href="#konsultasi" className="hover:text-light-primary transition-colors">Daftar Free Trial &amp; Diagnostik</a></li>
          <li><a href="/program/intensif-utbk-2026" className="hover:text-light-primary transition-colors">Cek Biaya &amp; Jadwal Sesi</a></li>
          <li><a href="#lokasi" className="hover:text-light-primary transition-colors">Katalog Fasilitas Cabang</a></li>
          <li><a href="/login" className="hover:text-light-primary transition-colors font-medium text-brand-indigo">Login Portal Siswa &amp; Orang Tua</a></li>
          <li><a href="/portal" className="hover:text-light-primary transition-colors">Portal Akademik Siswa Aktif</a></li>
          <li><a href="/login-admin" className="hover:text-light-primary transition-colors">Dashboard Internal Staf &amp; Tutor</a></li>
        </ul>
      </div>

      {/* Col 4: Kontak Resmi */}
      <div>
        <p className="font-label font-bold text-light-on-surface mb-3 md:mb-4 text-label-lg">Kontak &amp; Kantor</p>
        <p className="text-body-sm text-light-on-surface-variant leading-relaxed">
          Jl. Pendidikan No. 42, Kebayoran Baru, Jakarta Selatan 12130
        </p>
        <p className="text-body-sm text-light-on-surface-variant mt-2.5">
          <strong>WhatsApp:</strong> +62 812-3456-7890
        </p>
        <p className="text-body-sm text-light-on-surface-variant mt-1">
          <strong>Email:</strong> halo@arcibimbel.id
        </p>
        <p className="text-body-sm text-light-on-surface-variant mt-1">
          <strong>Jam Operasional:</strong> Sen – Sab: 08.00 – 19.30 WIB
        </p>
      </div>
    </div>

    {/* Bottom Copyright & Legal */}
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-light-outline-variant flex flex-col sm:flex-row items-center justify-between text-body-sm text-light-on-surface-variant gap-3 sm:gap-4 text-center sm:text-left">
      <p>© 2026 ARCI Bimbel. Seluruh hak cipta dilindungi undang-undang.</p>
      <div className="flex gap-4 sm:gap-6 justify-center">
        <a href="#privacy" className="hover:underline hover:text-light-primary">Kebijakan Privasi</a>
        <a href="#terms" className="hover:underline hover:text-light-primary">Syarat &amp; Ketentuan</a>
        <a href="#sitemap" className="hover:underline hover:text-light-primary">Peta Situs</a>
      </div>
    </div>
  </footer>

  {/* 13. Sticky Bottom Quick Contact Bar (Mobile Only: lg:hidden, 48px Touch Target, Safe Area Padded) */}
  <aside className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-light-surface/98 backdrop-blur-md border-t border-light-outline-variant px-4 py-2.5 shadow-lg flex items-center gap-3 pb-safe">
    <a href="https://wa.me/6281234567890?text=Halo%20ARCI%20Bimbel,%20saya%20ingin%20tanya%20program%20belajar" target="_blank" rel="noopener noreferrer" className="flex-1 min-h-[46px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-success text-on-success font-label text-label-md font-semibold active:opacity-90 shadow-xs">
      <span className="material-symbols-outlined text-[19px]">chat</span>
      <span>WhatsApp</span>
    </a>
    <a href="#konsultasi" className="flex-1 min-h-[46px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-light-primary text-light-on-primary font-label text-label-md font-semibold active:opacity-90 shadow-xs">
      <span className="material-symbols-outlined text-[19px]">how_to_reg</span>
      <span>Daftar Trial</span>
    </a>
  </aside>

  {/* Interactive JavaScript Engine */}
  

    </div>
  );
}
