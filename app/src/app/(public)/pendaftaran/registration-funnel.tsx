"use client";

import React, { useState, useTransition } from "react";
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
  const [result, setResult] = useState<RegistrationResult | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Parent
    parentName: "Bambang Pratama, S.E.",
    parentRelation: "Ayah Kandung",
    parentPhone: "81298765432",
    parentEmail: "bambang.pratama@gmail.com",
    parentCity: "Jakarta Selatan",

    // Step 2: Student
    studentName: "Farhan Pratama",
    studentSchool: "SMP Labschool Kebayoran",
    studentGrade: "SMP Kelas 8",
    studentTarget: "Persiapan Masuk SMA Unggulan (Target SMAN 8 / Lab)",
    studentNotes: "Perlu pendalaman ekstra di materi Matematika Aljabar dan IPA Fisika.",

    // Step 3: Selection
    branchId: initialBranch.id,
    programId: initialProgram.id,
    scheduleDays: "Senin, Rabu, Jumat (3x Seminggu)",
    scheduleTime: "Sesi Sore (16:00 - 17:30 WIB)",

    // Step 4: Consent
    agreeTerms: true,
  });

  const selectedProgram =
    programs.find((p) => p.id === formData.programId) || initialProgram;
  const selectedBranch =
    branches.find((b) => b.id === formData.branchId) || initialBranch;

  const registrationFee = 150000;
  const programPrice = Number(selectedProgram.price_monthly) || 950000;
  const totalAmount = programPrice + registrationFee;

  const formatRupiah = (val: number) => "Rp" + val.toLocaleString("id-ID");

  const handleNextStep = (nextStep: number) => {
    setErrorMessage(null);

    // Step 1 validations
    if (step === 1) {
      if (!formData.parentName.trim()) {
        setErrorMessage("Nama lengkap orang tua/wali wajib diisi.");
        return;
      }
      if (!formData.parentPhone.trim() || formData.parentPhone.length < 9) {
        setErrorMessage("Nomor WhatsApp orang tua tidak valid (minimal 9 digit).");
        return;
      }
      if (!formData.parentCity.trim()) {
        setErrorMessage("Kota/wilayah tinggal wajib diisi.");
        return;
      }
    }

    // Step 2 validations
    if (step === 2) {
      if (!formData.studentName.trim()) {
        setErrorMessage("Nama calon siswa wajib diisi.");
        return;
      }
      if (!formData.studentSchool.trim()) {
        setErrorMessage("Asal sekolah siswa wajib diisi.");
        return;
      }
    }

    setStep(nextStep);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!formData.agreeTerms) {
      setErrorMessage("Silakan setujui Syarat & Ketentuan serta Kebijakan Privasi terlebih dahulu.");
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
      };

      const res = await submitRegistrationAction(payload);
      if (res.success) {
        setResult(res);
        setStep(5); // Success step
        window.scrollTo({ top: 40, behavior: "smooth" });
      } else {
        setErrorMessage(res.message || "Gagal mengirim pendaftaran.");
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
                    onClick={() => s < step && handleNextStep(s)}
                    disabled={s > step}
                    className="flex flex-col items-center gap-1 sm:gap-1.5 focus:outline-none group transition-all disabled:cursor-not-allowed"
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

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-body-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Main Card */}
        <div
          className={`bg-light-surface rounded-2xl border border-light-outline-variant shadow-sm p-5 sm:p-8 md:p-10 flex flex-col gap-6 md:gap-8 transition-all duration-300 ${
            step === 5 ? "items-center text-center" : ""
          }`}
        >
          {/* ============================================================== */}
          {/* STEP 1: DATA WALI / ORANG TUA                                  */}
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
                  <input
                    type="text"
                    id="parent-name"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    required
                    placeholder="Contoh: Bambang Pratama"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
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
                    onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value })}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  >
                    <option value="Ayah Kandung">Ayah Kandung</option>
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Wali / Keluarga">Wali / Keluarga</option>
                  </select>
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
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      required
                      placeholder="812-3456-7890"
                      className="w-full min-h-[48px] pl-14 pr-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                    />
                  </div>
                  <span className="text-[11px] text-light-on-surface-variant">
                    Digunakan untuk pengiriman invoice dan laporan rapor belajar.
                  </span>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="parent-email" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Alamat Email</span>
                    <span className="text-light-on-surface-variant font-normal text-[11px]">(Opsional)</span>
                  </label>
                  <input
                    type="email"
                    id="parent-email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    placeholder="bambang@contoh.com"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </div>

                {/* Domisili */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="parent-city" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Kota / Wilayah Tinggal</span>
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="parent-city"
                    value={formData.parentCity}
                    onChange={(e) => setFormData({ ...formData, parentCity: e.target.value })}
                    required
                    placeholder="Contoh: Jakarta Selatan, Kebayoran Baru"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
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
                  className="px-7 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm font-semibold transition-all"
                >
                  Lanjut ke Data Siswa →
                </button>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* STEP 2: DATA CALON SISWA                                       */}
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
                  <input
                    type="text"
                    id="student-name"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    required
                    placeholder="Contoh: Farhan Pratama"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
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
                    onChange={(e) => setFormData({ ...formData, studentSchool: e.target.value })}
                    required
                    placeholder="Contoh: SMP Labschool Kebayoran"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
                </div>

                {/* Jenjang & Kelas */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="student-grade" className="font-label text-label-md text-light-on-surface font-semibold flex items-center gap-1">
                    <span>Jenjang &amp; Kelas</span>
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    id="student-grade"
                    value={formData.studentGrade}
                    onChange={(e) => setFormData({ ...formData, studentGrade: e.target.value })}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
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
                </div>

                {/* Target Belajar */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="student-target" className="font-label text-label-md text-light-on-surface font-semibold">
                    Target Utama Bimbingan Belajar
                  </label>
                  <select
                    id="student-target"
                    value={formData.studentTarget}
                    onChange={(e) => setFormData({ ...formData, studentTarget: e.target.value })}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
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
                </div>

                {/* Catatan / Kebutuhan Khusus */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="student-notes" className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
                    <span>Catatan / Mata Pelajaran yang Perlu Perhatian Khusus</span>
                    <span className="text-[11px] text-light-on-surface-variant font-normal">Opsional</span>
                  </label>
                  <textarea
                    id="student-notes"
                    rows={2}
                    value={formData.studentNotes}
                    onChange={(e) => setFormData({ ...formData, studentNotes: e.target.value })}
                    placeholder="Contoh: Butuh bantuan ekstra pada rumus Aljabar Matematika dan Fisika gerak..."
                    className="w-full px-4 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  />
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
                  className="px-7 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm font-semibold transition-all"
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
                  Pendaftaran untuk calon siswa: <strong className="text-light-on-surface">{formData.studentName}</strong> (Jenjang: <span className="text-brand-indigo font-medium">{formData.studentGrade}</span>).
                </p>
              </div>

              {/* Pilihan Cabang Dinamis dari Supabase */}
              <div className="flex flex-col gap-3">
                <label className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
                  <span>Pilih Lokasi Cabang Belajar</span>
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
                            onChange={() => setFormData({ ...formData, branchId: b.id })}
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
              </div>

              {/* Pilihan Paket Program Dinamis dari Supabase */}
              <div className="flex flex-col gap-3">
                <label className="font-label text-label-md text-light-on-surface font-semibold flex items-center justify-between">
                  <span>Pilih Paket Program Belajar</span>
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
                            onChange={() => setFormData({ ...formData, programId: prog.id })}
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
              </div>

              {/* Sesi Jadwal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-label text-label-md text-light-on-surface font-semibold">
                    Pilihan Hari Sesi
                  </span>
                  <select
                    id="schedule-days"
                    value={formData.scheduleDays}
                    onChange={(e) => setFormData({ ...formData, scheduleDays: e.target.value })}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-light-outline text-light-on-surface text-body-md bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
                  >
                    <option value="Senin, Rabu, Jumat (3x Seminggu)">Senin, Rabu, Jumat (3x Seminggu)</option>
                    <option value="Selasa, Kamis, Sabtu (3x Seminggu)">Selasa, Kamis, Sabtu (3x Seminggu)</option>
                    <option value="Sabtu & Minggu Intensif (Weekend)">Sabtu &amp; Minggu Intensif (Weekend)</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-label text-label-md text-light-on-surface font-semibold">
                    Pilihan Waktu Belajar
                  </span>
                  <select
                    id="schedule-time"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
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
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-lg shadow-sm text-center transition-all whitespace-nowrap font-semibold"
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
              <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
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
                    ARCI Bimbel.
                  </span>
                </label>
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
                  disabled={isPending || !formData.agreeTerms}
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
