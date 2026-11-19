"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  BranchOption,
  ProgramOption,
  RegistrationPayload,
  RegistrationResult,
  submitRegistrationAction,
} from "@/app/actions/registration";

interface Props {
  branches: BranchOption[];
  programs: ProgramOption[];
  defaultProgramCode?: string;
}

export function RegistrationFunnel({
  branches,
  programs,
  defaultProgramCode,
}: Props) {
  // Find matching initial program or fallback to first
  const initialProgram =
    programs.find((p) => p.code === defaultProgramCode || p.id === defaultProgramCode) ||
    programs[0] || {
      id: "demo-prog",
      code: "SMP-REG",
      name: "Bimbel Reguler SMP (Kelas 7–9)",
      level: "SMP" as const,
      price_monthly: 750000,
    };

  const initialBranch = branches[0] || {
    id: "demo-branch",
    code: "SDR",
    name: "Cabang Sudirman Utama",
    city: "Jakarta",
  };

  const [step, setStep] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RegistrationResult | null>(null);

  // Simple Math Captcha (contoh: 1 + 7 = 8)
  const [captcha, setCaptcha] = useState<{ num1: number; num2: number }>({ num1: 1, num2: 7 });
  const [captchaAnswer, setCaptchaAnswer] = useState<string>("");

  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ num1: n1, num2: n2 });
    setCaptchaAnswer("");
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated.captcha;
      return updated;
    });
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  // Form State: Semua text field dimulai dalam keadaan kosong agar wajib diisi oleh pengguna
  const [formData, setFormData] = useState({
    // Step 1: Parent
    parentName: "",
    parentRelation: "Ayah Kandung",
    parentPhone: "",
    parentEmail: "",
    parentCity: "",

    // Step 2: Student
    studentName: "",
    studentSchool: "",
    studentGrade: "SMP Kelas 8",
    studentTarget: "Persiapan Masuk SMA Unggulan (Target SMAN 8 / Lab)",
    studentNotes: "",

    // Step 3: Selection
    branchId: initialBranch.id,
    programId: initialProgram.id,
    scheduleDays: "Senin, Rabu, Jumat (3x Seminggu)",
    scheduleTime: "Sesi Sore (16:00 - 17:30 WIB)",

    // Step 4: Consent
    agreeTerms: false,
  });

  const selectedProgram =
    programs.find((p) => p.id === formData.programId) || initialProgram;
  const selectedBranch =
    branches.find((b) => b.id === formData.branchId) || initialBranch;

  const registrationFee = 150000;
  const programPrice = Number(selectedProgram.price_monthly) || 950000;
  const totalAmount = programPrice + registrationFee;

  const formatRupiah = (val: number) => "Rp" + val.toLocaleString("id-ID");

  // Helper untuk update field dan membersihkan pesan error pada field tersebut
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  // Validasi ketat per langkah: Jika ada field kosong, dilarang next
  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.parentName.trim()) {
        errors.parentName = "Nama lengkap orang tua / wali wajib diisi.";
      }
      if (!formData.parentRelation.trim()) {
        errors.parentRelation = "Hubungan dengan calon siswa wajib dipilih.";
      }
      if (!formData.parentPhone.trim()) {
        errors.parentPhone = "Nomor WhatsApp aktif wajib diisi.";
      } else if (formData.parentPhone.replace(/[^0-9]/g, "").length < 9) {
        errors.parentPhone = "Nomor WhatsApp minimal 9 digit angka.";
      }
      if (!formData.parentEmail.trim()) {
        errors.parentEmail = "Alamat email orang tua / wali wajib diisi.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail.trim())) {
        errors.parentEmail = "Format email tidak valid (contoh: nama@email.com).";
      }
      if (!formData.parentCity.trim()) {
        errors.parentCity = "Kota / wilayah tinggal wajib diisi.";
      }
    } else if (currentStep === 2) {
      if (!formData.studentName.trim()) {
        errors.studentName = "Nama lengkap calon siswa wajib diisi.";
      }
      if (!formData.studentSchool.trim()) {
        errors.studentSchool = "Asal sekolah calon siswa saat ini wajib diisi.";
      }
      if (!formData.studentGrade.trim()) {
        errors.studentGrade = "Jenjang & kelas siswa wajib dipilih.";
      }
      if (!formData.studentTarget.trim()) {
        errors.studentTarget = "Target utama bimbingan belajar wajib dipilih.";
      }
      if (!formData.studentNotes.trim()) {
        errors.studentNotes = "Catatan mata pelajaran / materi yang perlu perhatian wajib diisi.";
      }
    } else if (currentStep === 3) {
      if (!formData.branchId) {
        errors.branchId = "Silakan pilih salah satu cabang / lokasi belajar.";
      }
      if (!formData.programId) {
        errors.programId = "Silakan pilih salah satu paket program belajar.";
      }
      if (!formData.scheduleDays) {
        errors.scheduleDays = "Silakan pilih hari belajar.";
      }
      if (!formData.scheduleTime) {
        errors.scheduleTime = "Silakan pilih waktu belajar.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Semua kolom bertanda bintang (*) wajib diisi lengkap sebelum melanjutkan ke tahap berikutnya.");
      
      // Auto-focus ke input pertama yang bermasalah
      const firstErrorField = Object.keys(errors)[0];
      const elementIdMap: Record<string, string> = {
        parentName: "parent-name",
        parentRelation: "parent-relation",
        parentPhone: "parent-whatsapp",
        parentEmail: "parent-email",
        parentCity: "parent-city",
        studentName: "student-name",
        studentSchool: "student-school",
        studentGrade: "student-grade",
        studentTarget: "student-target",
        studentNotes: "student-notes",
      };
      const targetId = elementIdMap[firstErrorField];
      if (targetId) {
        setTimeout(() => {
          document.getElementById(targetId)?.focus();
        }, 50);
      }
      return false;
    }

    setFieldErrors({});
    setErrorMessage(null);
    return true;
  };

  const handleNextStep = (nextStep: number) => {
    // Jika mundur ke step sebelumnya, izinkan tanpa blokir
    if (nextStep < step) {
      setErrorMessage(null);
      setStep(nextStep);
      window.scrollTo({ top: 80, behavior: "smooth" });
      return;
    }

    // Jika maju ke step berikutnya, wajib validasi semua field pada step saat ini
    const isValid = validateStep(step);
    if (!isValid) {
      return;
    }

    setStep(nextStep);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  const handleSubmit = () => {
    // Validasi ulang seluruh langkah sebelum submit
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setErrorMessage("Mohon lengkapi seluruh field yang belum terisi di langkah sebelumnya.");
      return;
    }

    if (!formData.agreeTerms) {
      setFieldErrors((prev) => ({
        ...prev,
        agreeTerms: "Anda wajib mencentang persetujuan Syarat & Ketentuan serta Kebijakan Privasi.",
      }));
      setErrorMessage("Silakan setujui Syarat & Ketentuan serta Kebijakan Privasi terlebih dahulu.");
      return;
    }

    // Validasi Math Captcha
    const expectedAnswer = captcha.num1 + captcha.num2;
    const userAnswer = parseInt(captchaAnswer.trim(), 10);
    if (isNaN(userAnswer) || userAnswer !== expectedAnswer) {
      setFieldErrors((prev) => ({
        ...prev,
        captcha: `Jawaban verifikasi keamanan belum tepat (${captcha.num1} + ${captcha.num2} = ?). Silakan hitung kembali.`,
      }));
      setErrorMessage("Jawaban verifikasi keamanan (captcha) belum tepat. Silakan hitung kembali.");
      refreshCaptcha();
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      const payload: RegistrationPayload = {
        parentName: formData.parentName,
        parentRelation: formData.parentRelation,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        parentCity: formData.parentCity,

        studentName: formData.studentName,
        studentSchool: formData.studentSchool,
        studentGrade: formData.studentGrade,
        studentTarget: formData.studentTarget,
        studentNotes: formData.studentNotes,

        branchId: formData.branchId,
        programId: formData.programId,
        scheduleDays: formData.scheduleDays,
        scheduleTime: formData.scheduleTime,

        agreeTerms: formData.agreeTerms,
        captchaAnswer: userAnswer,
        captchaExpected: expectedAnswer,
      };

      const res = await submitRegistrationAction(payload);
      if (res.success) {
        setResult(res);
        setStep(5); // Success step
        window.scrollTo({ top: 40, behavior: "smooth" });
      } else {
        setErrorMessage(res.message || "Gagal mengirim pendaftaran.");
        refreshCaptcha();
      }
    });
  };

  return (
    <div className="bg-light-surface text-light-on-surface font-body antialiased min-h-screen flex flex-col justify-between">
      {/* Header Alur Pendaftaran */}
      <header className="bg-light-surface border-b border-light-outline-variant px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-light-on-surface hover:text-light-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-light-surface-container-low group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <span className="text-body-sm font-label font-semibold">Beranda</span>
          </Link>
        </div>

        {/* Center Brand Badge */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-light-primary flex items-center justify-center text-light-on-primary font-headline font-bold text-label-md group-hover:bg-brand-indigo-dark transition-colors shadow-xs">
            A
          </div>
          <span className="font-headline font-bold text-title-md text-brand-indigo tracking-tight">
            ARCI Bimbel
          </span>
        </Link>

        {/* Right Help / Contact */}
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/6281234567890?text=Halo%20ARCI%20Bimbel,%20saya%20butuh%20bantuan%20pendaftaran"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-light-on-surface-variant hover:text-light-primary font-medium px-2 py-1"
          >
            <span className="material-symbols-outlined text-[16px] text-success">chat</span>
            <span>Bantuan WA</span>
          </a>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs text-light-on-surface-variant hover:text-brand-indigo font-medium px-2 py-1 rounded-lg hover:bg-light-surface-container-low"
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            <span>Masuk</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`flex-1 w-full mx-auto px-4 py-6 sm:py-8 md:py-10 transition-all duration-300 ${
          step === 5 ? "max-w-xl" : "max-w-4xl"
        }`}
      >
        {/* Stepper Navigation (Steps 1 to 4) */}
        {step <= 4 && (
          <nav
            aria-label="Progress Pendaftaran"
            className="bg-light-surface rounded-2xl border border-light-outline-variant p-3.5 sm:p-5 mb-6 md:mb-8 shadow-xs"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3 text-center">
              {[
                { s: 1, label: "1. Data Wali" },
                { s: 2, label: "2. Data Siswa" },
                { s: 3, label: "3. Pilih Program" },
                { s: 4, label: "4. Konfirmasi" },
              ].map(({ s, label }) => {
                const isPassed = s < step;
                const isCurrent = s === step;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (s < step) {
                        handleNextStep(s);
                      } else if (s > step) {
                        handleNextStep(s);
                      }
                    }}
                    className={`flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none group transition-all ${
                      s > step ? "cursor-pointer hover:opacity-80" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-label-sm font-bold shadow-xs transition-all ${
                        isPassed
                          ? "bg-success text-on-success"
                          : isCurrent
                          ? "bg-light-primary text-light-on-primary ring-4 ring-light-primary-container"
                          : "bg-light-surface-container text-light-on-surface-variant"
                      }`}
                    >
                      {isPassed ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        s
                      )}
                    </div>
                    <span
                      className={`text-[11px] sm:text-label-sm font-label truncate max-w-[75px] sm:max-w-none ${
                        isPassed
                          ? "font-semibold text-success"
                          : isCurrent
                          ? "font-bold text-light-primary"
                          : "text-light-on-surface-variant"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full bg-light-surface-container-low h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-light-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${step * 25}%` }}
              />
            </div>
          </nav>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-body-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Main Card */}
        <div
          className={`bg-light-surface rounded-2xl border border-light-outline-variant shadow-sm p-5 sm:p-8 md:p-10 flex flex-col gap-6 md:gap-8 transition-all duration-300 ${
            step === 5 ? "items-center text-center" : ""
          }`}
        >
          {/* ============================================================== */}
          {/* STEP 1: DATA WALI / ORANG TUA (SEMUA FIELD WAJIB DIISI)        */}
          {/* ============================================================== */}
          {step === 1 && (
            <section className="flex flex-col gap-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-light-primary-container text-light-on-primary-container mb-2 font-semibold">
                  Langkah 1 dari 4
                </span>
                <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
                  Informasi Data Orang Tua / Wali Siswa
                </h1>
                <p className="text-body-md text-light-on-surface-variant mt-1">
                  Seluruh kolom data kontak wali wajib diisi lengkap untuk penerbitan invoice resmi dan konfirmasi bimbingan belajar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Nama Lengkap Wali */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="parent-name" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Nama Lengkap Orang Tua / Wali</span>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="parent-name"
                    value={formData.parentName}
                    onChange={(e) => updateField("parentName", e.target.value)}
                    required
                    placeholder="Contoh: Bambang Pratama, S.E."
                    className={`w-full min-h-[48px] px-4 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.parentName
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  />
                  {fieldErrors.parentName && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.parentName}
                    </p>
                  )}
                </div>

                {/* Hubungan dengan Siswa */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="parent-relation" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Hubungan dengan Calon Siswa</span>
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    id="parent-relation"
                    value={formData.parentRelation}
                    onChange={(e) => updateField("parentRelation", e.target.value)}
                    className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.parentRelation
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  >
                    <option value="Ayah Kandung">Ayah Kandung</option>
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Wali / Keluarga">Wali / Keluarga</option>
                  </select>
                  {fieldErrors.parentRelation && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.parentRelation}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="parent-whatsapp" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Nomor WhatsApp Aktif</span>
                    <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-body-sm font-semibold text-light-on-surface-variant">
                      +62
                    </span>
                    <input
                      type="tel"
                      id="parent-whatsapp"
                      value={formData.parentPhone}
                      onChange={(e) => updateField("parentPhone", e.target.value)}
                      required
                      placeholder="812-3456-7890"
                      className={`w-full min-h-[48px] pl-14 pr-4 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                        fieldErrors.parentPhone
                          ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                          : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                      }`}
                    />
                  </div>
                  {fieldErrors.parentPhone ? (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.parentPhone}
                    </p>
                  ) : (
                    <span className="text-[11px] text-light-on-surface-variant">
                      Digunakan untuk konfirmasi pendaftaran dan laporan rapor belajar siswa.
                    </span>
                  )}
                </div>

                {/* Email (Wajib Diisi) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="parent-email" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Alamat Email Orang Tua / Wali</span>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="parent-email"
                    value={formData.parentEmail}
                    onChange={(e) => updateField("parentEmail", e.target.value)}
                    required
                    placeholder="contoh: bambang.pratama@gmail.com"
                    className={`w-full min-h-[48px] px-4 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.parentEmail
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  />
                  {fieldErrors.parentEmail && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.parentEmail}
                    </p>
                  )}
                </div>

                {/* Domisili (Wajib Diisi) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="parent-city" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Kota / Wilayah Tinggal</span>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="parent-city"
                    value={formData.parentCity}
                    onChange={(e) => updateField("parentCity", e.target.value)}
                    required
                    placeholder="Contoh: Jakarta Selatan, Kebayoran Baru"
                    className={`w-full min-h-[48px] px-4 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.parentCity
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  />
                  {fieldErrors.parentCity && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.parentCity}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons Step 1 */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-light-outline-variant">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors"
                >
                  ← Batal
                </Link>
                <button
                  type="button"
                  onClick={() => handleNextStep(2)}
                  className="px-7 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm font-semibold transition-all active:scale-[0.98]"
                >
                  Lanjut ke Data Siswa →
                </button>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* STEP 2: DATA CALON SISWA (SEMUA FIELD WAJIB DIISI)             */}
          {/* ============================================================== */}
          {step === 2 && (
            <section className="flex flex-col gap-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-light-primary-container text-light-on-primary-container mb-2 font-semibold">
                  Langkah 2 dari 4
                </span>
                <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
                  Informasi Calon Siswa
                </h1>
                <p className="text-body-md text-light-on-surface-variant mt-1">
                  Seluruh profil pendidikan dan catatan belajar siswa wajib diisi agar silabus dan modul belajar dapat dipersiapkan secara tepat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Nama Lengkap Siswa */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="student-name" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Nama Lengkap Calon Siswa</span>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="student-name"
                    value={formData.studentName}
                    onChange={(e) => updateField("studentName", e.target.value)}
                    required
                    placeholder="Contoh: Farhan Pratama"
                    className={`w-full min-h-[48px] px-4 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.studentName
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  />
                  {fieldErrors.studentName && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.studentName}
                    </p>
                  )}
                </div>

                {/* Asal Sekolah */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="student-school" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Asal Sekolah Saat Ini</span>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="student-school"
                    value={formData.studentSchool}
                    onChange={(e) => updateField("studentSchool", e.target.value)}
                    required
                    placeholder="Contoh: SMP Labschool Kebayoran"
                    className={`w-full min-h-[48px] px-4 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.studentSchool
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  />
                  {fieldErrors.studentSchool && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.studentSchool}
                    </p>
                  )}
                </div>

                {/* Jenjang & Kelas */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="student-grade" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Jenjang &amp; Kelas Siswa</span>
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    id="student-grade"
                    value={formData.studentGrade}
                    onChange={(e) => updateField("studentGrade", e.target.value)}
                    className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.studentGrade
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  >
                    <optgroup label="Sekolah Menengah Pertama (SMP)">
                      <option value="SMP Kelas 7">SMP Kelas 7</option>
                      <option value="SMP Kelas 8">SMP Kelas 8</option>
                      <option value="SMP Kelas 9">SMP Kelas 9 (Persiapan SMA)</option>
                    </optgroup>
                    <optgroup label="Sekolah Dasar (SD)">
                      <option value="SD Kelas 4">SD Kelas 4</option>
                      <option value="SD Kelas 5">SD Kelas 5</option>
                      <option value="SD Kelas 6">SD Kelas 6 (Ujian Akhir)</option>
                    </optgroup>
                    <optgroup label="Sekolah Menengah Atas (SMA / UTBK)">
                      <option value="SMA Kelas 10">SMA Kelas 10 (Fase E)</option>
                      <option value="SMA Kelas 11">SMA Kelas 11 (Fase F)</option>
                      <option value="SMA Kelas 12">SMA Kelas 12 (Persiapan UTBK SNBT)</option>
                      <option value="Alumni / Gap Year">Alumni / Gap Year (Fokus PTN)</option>
                    </optgroup>
                  </select>
                  {fieldErrors.studentGrade && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.studentGrade}
                    </p>
                  )}
                </div>

                {/* Target Belajar */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="student-target" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Target Utama Bimbingan Belajar</span>
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    id="student-target"
                    value={formData.studentTarget}
                    onChange={(e) => updateField("studentTarget", e.target.value)}
                    className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.studentTarget
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  >
                    <option value="Peningkatan Nilai Rapor & Pemahaman Konsep Dasar">
                      Peningkatan Nilai Rapor &amp; Pemahaman Konsep Dasar
                    </option>
                    <option value="Persiapan Masuk SMA Unggulan (Target SMAN 8 / Lab)">
                      Persiapan Masuk SMA Unggulan / Asrama Taruna
                    </option>
                    <option value="Fokus Sukses UTBK SNBT & Ujian Mandiri PTN">
                      Fokus Sukses UTBK SNBT &amp; Ujian Mandiri PTN
                    </option>
                    <option value="Bimbingan Olimpiade Sains Nasional (OSN)">
                      Bimbingan Olimpiade Sains Nasional (OSN)
                    </option>
                  </select>
                  {fieldErrors.studentTarget && (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.studentTarget}
                    </p>
                  )}
                </div>

                {/* Catatan / Kebutuhan Khusus (Wajib Diisi) */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="student-notes" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Catatan / Mata Pelajaran yang Perlu Perhatian Khusus</span>
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="student-notes"
                    rows={3}
                    value={formData.studentNotes}
                    onChange={(e) => updateField("studentNotes", e.target.value)}
                    required
                    placeholder="Contoh: Butuh perhatian khusus pada aljabar Matematika dan Fisika mekanika, target lolos seleksi SMA 8."
                    className={`w-full px-4 py-2.5 rounded-lg border text-light-on-surface text-body-md bg-light-surface transition-colors focus:ring-1 ${
                      fieldErrors.studentNotes
                        ? "border-danger ring-1 ring-danger bg-danger/5 focus:border-danger focus:ring-danger"
                        : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                    }`}
                  />
                  {fieldErrors.studentNotes ? (
                    <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {fieldErrors.studentNotes}
                    </p>
                  ) : (
                    <span className="text-[11px] text-light-on-surface-variant">
                      Tuliskan materi pelajaran yang dirasa paling menantang atau target khusus siswa.
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Buttons Step 2 */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => handleNextStep(1)}
                  className="px-5 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors"
                >
                  ← Kembali ke Data Wali
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(3)}
                  className="px-7 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm font-semibold transition-all active:scale-[0.98]"
                >
                  Lanjut ke Pilih Program →
                </button>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* STEP 3: PILIH PROGRAM & CABANG DARI SUPABASE                   */}
          {/* ============================================================== */}
          {step === 3 && (
            <section className="flex flex-col gap-6 md:gap-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-light-primary-container text-light-on-primary-container mb-2 font-semibold">
                  Langkah 3 dari 4
                </span>
                <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
                  Pilih Program &amp; Lokasi Belajar
                </h1>
                <p className="text-body-md text-light-on-surface-variant mt-1">
                  Pendaftaran untuk calon siswa: <strong className="text-light-on-surface">{formData.studentName || "Siswa Baru"}</strong> (Jenjang: <span className="text-brand-indigo font-medium">{formData.studentGrade}</span>).
                </p>
              </div>

              {/* Pilihan Cabang Dinamis dari Supabase */}
              <div className="flex flex-col gap-3">
                <label className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Pilih Lokasi Cabang Belajar</span>
                    <span className="text-danger">*</span>
                  </span>
                  <span className="text-[11px] text-success font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    Live dari Supabase
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {branches.map((b) => {
                    const isSelected = formData.branchId === b.id;
                    const isOnline = b.code === "ONL" || b.name.toLowerCase().includes("online");
                    return (
                      <label
                        key={b.id}
                        className={`p-4 rounded-xl flex flex-col justify-between gap-3 cursor-pointer transition-all hover:shadow-xs ${
                          isSelected
                            ? "border-2 border-light-primary bg-light-primary-container/20 shadow-xs"
                            : "border border-light-outline hover:border-light-primary bg-light-surface"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="cabang"
                            value={b.id}
                            checked={isSelected}
                            onChange={() => updateField("branchId", b.id)}
                            className="mt-1 text-light-primary focus:ring-light-primary"
                          />
                          <div>
                            <span className="font-headline font-semibold text-title-md text-light-on-surface block">
                              {b.name}
                            </span>
                            <span className="text-body-sm text-light-on-surface-variant block mt-0.5">
                              {b.address || `${b.city}, Indonesia`}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-block self-start px-2.5 py-0.5 rounded-full text-[11px] font-label font-medium ${
                            isOnline
                              ? "bg-light-primary-container text-light-primary"
                              : "bg-success text-on-success"
                          }`}
                        >
                          {isOnline ? "Akses Se-Indonesia" : "Maks 8 Siswa / Kelas"}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {fieldErrors.branchId && (
                  <p className="text-[11px] text-danger font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {fieldErrors.branchId}
                  </p>
                )}
              </div>

              {/* Pilihan Paket Program Dinamis dari Supabase */}
              <div className="flex flex-col gap-3">
                <label className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Pilih Paket Program Belajar</span>
                    <span className="text-danger">*</span>
                  </span>
                  <span className="text-[11px] text-light-muted">Kurikulum terstruktur & bergaransi</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {programs.map((prog) => {
                    const isSelected = formData.programId === prog.id;
                    return (
                      <label
                        key={prog.id}
                        className={`p-4.5 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer transition-all hover:shadow-xs ${
                          isSelected
                            ? "border-2 border-light-primary bg-light-primary-container/20 shadow-xs"
                            : "border border-light-outline hover:border-light-primary bg-light-surface"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="radio"
                            name="program"
                            value={prog.id}
                            checked={isSelected}
                            onChange={() => updateField("programId", prog.id)}
                            className="mt-1 text-light-primary focus:ring-light-primary"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-headline font-bold text-title-md text-light-on-surface">
                                {prog.name}
                              </span>
                              {prog.is_featured && (
                                <span className="px-2 py-0.5 rounded-full text-label-sm font-label bg-accent text-on-accent font-semibold shadow-xs">
                                  Unggulan
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-label font-bold bg-light-surface-container text-brand-indigo">
                                {prog.level}
                              </span>
                            </div>
                            <p className="text-body-sm text-light-on-surface-variant mt-1.5 leading-relaxed">
                              {prog.description ||
                                "3 sesi tatap muka per minggu, modul cetak lengkap, drilling soal berkala & laporan rapor 360°."}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-body-sm text-light-on-surface font-medium">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-success">check</span>
                                Modul Cetak & Digital
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-success">check</span>
                                Rapor Evaluasi Bulanan
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0 pl-7 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-light-outline-variant/60">
                          <span className="font-headline font-bold text-title-lg text-brand-indigo block">
                            {formatRupiah(Number(prog.price_monthly))}
                          </span>
                          <span className="text-[11px] text-light-on-surface-variant block">per bulan</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {fieldErrors.programId && (
                  <p className="text-[11px] text-danger font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {fieldErrors.programId}
                  </p>
                )}
              </div>

              {/* Sesi Jadwal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Pilihan Hari Sesi</span>
                    <span className="text-danger">*</span>
                  </span>
                  <select
                    id="schedule-days"
                    value={formData.scheduleDays}
                    onChange={(e) => updateField("scheduleDays", e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  >
                    <option value="Senin, Rabu, Jumat (3x Seminggu)">Senin, Rabu, Jumat (3x Seminggu)</option>
                    <option value="Selasa, Kamis, Sabtu (3x Seminggu)">Selasa, Kamis, Sabtu (3x Seminggu)</option>
                    <option value="Sabtu & Minggu Intensif (Weekend)">Sabtu &amp; Minggu Intensif (Weekend)</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Pilihan Waktu Belajar</span>
                    <span className="text-danger">*</span>
                  </span>
                  <select
                    id="schedule-time"
                    value={formData.scheduleTime}
                    onChange={(e) => updateField("scheduleTime", e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  >
                    <option value="Sesi Siang (14:00 - 15:30 WIB)">Sesi Siang (14:00 - 15:30 WIB)</option>
                    <option value="Sesi Sore (16:00 - 17:30 WIB)">Sesi Sore (16:00 - 17:30 WIB)</option>
                    <option value="Sesi Malam (18:30 - 20:00 WIB)">Sesi Malam (18:30 - 20:00 WIB)</option>
                  </select>
                </label>
              </div>

              {/* Ringkasan Biaya Awal */}
              <div className="p-4 sm:p-5 rounded-xl bg-light-surface-container border border-light-outline-variant flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-light-on-surface-variant">Biaya Program ({selectedProgram.name})</span>
                  <span className="font-medium text-light-on-surface">{formatRupiah(programPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-light-on-surface-variant">Biaya Registrasi &amp; Modul Pembelajaran</span>
                  <span className="font-medium text-light-on-surface">{formatRupiah(registrationFee)}</span>
                </div>
                <div className="pt-2.5 border-t border-light-outline flex items-center justify-between font-bold text-title-md">
                  <span className="text-light-on-surface">Total Tagihan Awal</span>
                  <span className="text-brand-indigo font-headline text-title-lg font-bold">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Navigation Buttons Step 3 */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => handleNextStep(2)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors"
                >
                  ← Kembali ke Data Siswa
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(4)}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm text-center transition-all whitespace-nowrap font-semibold active:scale-[0.98]"
                >
                  Lanjut ke Konfirmasi →
                </button>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* STEP 4: KONFIRMASI & SUBMIT KE SUPABASE                        */}
          {/* ============================================================== */}
          {step === 4 && (
            <section className="flex flex-col gap-6 md:gap-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-label-sm font-label bg-accent text-on-accent mb-2 font-semibold">
                  Langkah Terakhir (4 dari 4)
                </span>
                <h1 className="font-headline text-headline-sm md:text-headline-md font-bold text-light-on-surface">
                  Tinjau &amp; Ajukan Pendaftaran
                </h1>
                <p className="text-body-md text-light-on-surface-variant mt-1">
                  Pastikan seluruh data yang Anda cantumkan telah sesuai sebelum mengajukan pendaftaran resmi ke database ARCI Bimbel.
                </p>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Wali */}
                <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/60">
                    <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-light-primary">person</span>
                      Data Orang Tua / Wali
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNextStep(1)}
                      className="text-[12px] text-light-primary hover:underline font-semibold"
                    >
                      Ubah
                    </button>
                  </div>
                  <div className="text-body-sm space-y-1">
                    <p>
                      <span className="text-light-on-surface-variant">Nama:</span>{" "}
                      <strong className="text-light-on-surface">{formData.parentName}</strong>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">Hubungan:</span>{" "}
                      <span>{formData.parentRelation}</span>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">WhatsApp:</span>{" "}
                      <span>+62 {formData.parentPhone}</span>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">Email:</span>{" "}
                      <span>{formData.parentEmail}</span>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">Domisili:</span>{" "}
                      <span>{formData.parentCity}</span>
                    </p>
                  </div>
                </div>

                {/* Data Siswa */}
                <div className="p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/60">
                    <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-light-primary">school</span>
                      Data Calon Siswa
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNextStep(2)}
                      className="text-[12px] text-light-primary hover:underline font-semibold"
                    >
                      Ubah
                    </button>
                  </div>
                  <div className="text-body-sm space-y-1">
                    <p>
                      <span className="text-light-on-surface-variant">Nama Siswa:</span>{" "}
                      <strong className="text-light-on-surface">{formData.studentName}</strong>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">Asal Sekolah:</span>{" "}
                      <span>{formData.studentSchool}</span>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">Jenjang:</span>{" "}
                      <span className="font-medium text-brand-indigo">{formData.studentGrade}</span>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">Fokus Target:</span>{" "}
                      <span>{formData.studentTarget}</span>
                    </p>
                    <p>
                      <span className="text-light-on-surface-variant">Catatan Belajar:</span>{" "}
                      <span className="italic text-light-on-surface">{formData.studentNotes}</span>
                    </p>
                  </div>
                </div>

                {/* Program & Lokasi */}
                <div className="md:col-span-2 p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/60 flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/60">
                    <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-light-primary">menu_book</span>
                      Program &amp; Sesi Terpilih
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNextStep(3)}
                      className="text-[12px] text-light-primary hover:underline font-semibold"
                    >
                      Ubah
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-body-sm pt-1">
                    <div>
                      <span className="text-light-on-surface-variant block text-[11px]">Paket Program:</span>
                      <strong className="text-brand-indigo font-headline">{selectedProgram.name}</strong>
                    </div>
                    <div>
                      <span className="text-light-on-surface-variant block text-[11px]">Lokasi Belajar:</span>
                      <span className="font-medium text-light-on-surface">{selectedBranch.name}</span>
                    </div>
                    <div>
                      <span className="text-light-on-surface-variant block text-[11px]">Jadwal Sesi:</span>
                      <span className="font-medium text-light-on-surface">
                        {formData.scheduleDays} - {formData.scheduleTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Tagihan Awal */}
              <div className="p-4 sm:p-5 rounded-xl bg-light-primary-container/30 border border-light-primary/30 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-light-on-surface-variant">Biaya Program Bulan Pertama</span>
                  <span className="font-medium text-light-on-surface">{formatRupiah(programPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-light-on-surface-variant">Biaya Pendaftaran &amp; Modul Pembelajaran</span>
                  <span className="font-medium text-light-on-surface">{formatRupiah(registrationFee)}</span>
                </div>
                <div className="pt-2.5 border-t border-light-outline/40 flex items-center justify-between font-bold text-title-md">
                  <div>
                    <span className="text-light-on-surface block">Total Tagihan Awal</span>
                    <span className="text-[11px] text-light-on-surface-variant font-normal">
                      Invoice resmi akan dicatat otomatis di sistem keuangan & dikonfirmasi admin.
                    </span>
                  </div>
                  <span className="text-brand-indigo font-headline text-headline-sm font-bold">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className={`p-4 rounded-xl border transition-colors ${
                fieldErrors.agreeTerms ? "bg-danger/5 border-danger" : "bg-light-surface-container-low border-light-outline-variant"
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={formData.agreeTerms}
                    onChange={(e) => updateField("agreeTerms", e.target.checked)}
                    className="mt-1 rounded text-light-primary focus:ring-light-primary"
                  />
                  <span className="text-body-sm text-light-on-surface">
                    Saya menyatakan bahwa data yang diisi adalah benar dan menyetujui{" "}
                    <a href="#terms" className="text-light-primary underline font-medium">
                      Syarat &amp; Ketentuan
                    </a>{" "}
                    serta{" "}
                    <a href="#privacy" className="text-light-primary underline font-medium">
                      Kebijakan Privasi
                    </a>{" "}
                    ARCI Bimbel. <span className="text-danger font-bold">*</span>
                  </span>
                </label>
                {fieldErrors.agreeTerms && (
                  <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1 pl-7">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {fieldErrors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Math Captcha Verification */}
              <div
                className={`p-4 rounded-xl border transition-colors ${
                  fieldErrors.captcha
                    ? "bg-danger/5 border-danger"
                    : "bg-light-surface-container-low border-light-outline-variant"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label text-label-md font-bold text-light-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-light-primary">
                      verified_user
                    </span>
                    Verifikasi Keamanan (Captcha) <span className="text-danger">*</span>
                  </span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-[12px] font-label text-light-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    title="Ganti Soal Captcha"
                  >
                    <span className="material-symbols-outlined text-[15px]">refresh</span>
                    Ganti Soal
                  </button>
                </div>
                <p className="text-body-sm text-light-on-surface-variant mb-3">
                  Selesaikan perhitungan matematika sederhana di bawah untuk memverifikasi pendaftaran Anda:
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-light-surface px-4 py-2.5 rounded-lg border border-light-outline font-headline font-bold text-title-md text-light-primary select-none tracking-wider shrink-0 shadow-2xs">
                    <span>{captcha.num1}</span>
                    <span>+</span>
                    <span>{captcha.num2}</span>
                    <span>=</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={captchaAnswer}
                      onChange={(e) => {
                        setCaptchaAnswer(e.target.value);
                        if (fieldErrors.captcha) {
                          setFieldErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.captcha;
                            return updated;
                          });
                          setErrorMessage(null);
                        }
                      }}
                      placeholder="Tuliskan hasil penjumlahan..."
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-lg border text-light-on-surface placeholder:text-light-on-surface-variant focus:ring-1 text-body-md bg-light-surface ${
                        fieldErrors.captcha
                          ? "border-danger focus:border-danger focus:ring-danger"
                          : "border-light-outline focus:border-light-primary focus:ring-light-primary"
                      }`}
                    />
                  </div>
                </div>
                {fieldErrors.captcha && (
                  <p className="text-[11px] text-danger font-medium flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {fieldErrors.captcha}
                  </p>
                )}
              </div>

              {/* Navigation Buttons Step 4 */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => handleNextStep(3)}
                  disabled={isPending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-body-md text-center transition-colors disabled:opacity-50"
                >
                  ← Kembali ke Pilih Program
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full sm:w-auto min-h-[50px] px-8 py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm text-center transition-all whitespace-nowrap font-bold flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
                >
                  {isPending ? (
                    <>
                      <span className="inline-block animate-spin mr-1">⟳</span>
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Ajukan Pendaftaran Sekarang</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* STEP 5: SUCCESS STATE (DATA DIRECT DARI SUPABASE INSERT)       */}
          {/* ============================================================== */}
          {step === 5 && result && (
            <section className="flex flex-col items-center justify-center text-center py-6 sm:py-10 gap-6 w-full max-w-lg mx-auto">
              {/* Check Icon */}
              <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center text-title-lg shadow-inner mx-auto ring-8 ring-success/5 animate-pulse">
                <span className="material-symbols-outlined text-[44px]">verified</span>
              </div>

              {/* Headline */}
              <div className="w-full flex flex-col items-center text-center">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-label-sm font-label bg-success text-on-success mb-3 font-semibold shadow-xs mx-auto">
                  Pendaftaran Berhasil Tersimpan di Supabase
                </span>
                <h2 className="font-headline text-headline-sm sm:text-headline-md font-bold text-light-on-surface text-center">
                  Selamat! Pendaftaran Siswa Berhasil Diajukan
                </h2>
                <p className="text-body-md text-light-on-surface-variant mt-2 text-center leading-relaxed">
                  Nomor Registrasi Anda:{" "}
                  <strong className="text-brand-indigo font-headline text-title-md">
                    {result.registrationNumber}
                  </strong>
                  .<br className="hidden sm:inline" /> Nomor Invoice:{" "}
                  <strong className="text-brand-indigo font-headline text-title-sm">
                    {result.invoiceNumber}
                  </strong>
                  . Data telah masuk ke antrean admissions &amp; finance bimbel.
                </p>
              </div>

              {/* Detail Box */}
              <div className="w-full bg-light-surface-container-low rounded-xl p-4 sm:p-5 border border-light-outline-variant text-left text-body-sm space-y-2.5 shadow-xs mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-light-on-surface-variant">Calon Siswa:</span>
                  <strong className="text-light-on-surface font-semibold">{result.studentName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-on-surface-variant">Program:</span>
                  <span className="font-medium text-brand-indigo">{result.programName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-on-surface-variant">Lokasi Belajar:</span>
                  <span className="font-medium text-light-on-surface">{result.branchName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-on-surface-variant">Total Tagihan Awal:</span>
                  <strong className="font-bold text-brand-indigo">
                    {formatRupiah(result.totalAmount || 1100000)}
                  </strong>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-light-outline-variant">
                  <span className="text-light-on-surface-variant">Estimasi Orientasi:</span>
                  <span className="font-semibold text-success">Sabtu, 28 November 2026</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mx-auto mt-2">
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Admin ARCI Bimbel, saya sudah mendaftar secara online dengan Nomor Registrasi ${result.registrationNumber} atas nama siswa ${result.studentName} untuk program ${result.programName} (${result.branchName}). Mohon konfirmasi jadwal & nomor rekening pembayarannya.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-success text-on-success font-label text-label-md font-semibold hover:bg-success/90 transition-colors shadow-xs active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Konfirmasi WhatsApp</span>
                </a>
                <Link
                  href="/"
                  className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container font-label text-label-md font-medium transition-colors"
                >
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-light-surface border-t border-light-outline-variant py-6 mt-auto text-center text-body-sm text-light-on-surface-variant">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 ARCI Bimbel. Bantuan pendaftaran WhatsApp: +62 812-3456-7890</p>
          <div className="flex gap-4">
            <Link href="/#program" className="hover:underline">
              Daftar Program
            </Link>
            <Link href="/#faq" className="hover:underline">
              Tanya Jawab (FAQ)
            </Link>
            <a href="#privacy" className="hover:underline">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
