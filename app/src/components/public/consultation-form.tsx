"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema, LeadFormData } from "@/lib/validations/lead";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Phone, 
  User, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck2 
} from "lucide-react";

export function ConsultationForm() {
  const [submittedData, setSubmittedData] = useState<LeadFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      parentName: "",
      studentName: "",
      parentPhone: "",
      gradeLevel: "SMA",
      learningMode: "Tatap Muka (Offline)",
      targetSubject: "",
      notes: "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    // Simulating async submission or API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmittedData(data);
    setIsSubmitting(false);
    reset();
  };

  return (
    <section id="konsultasi" className="py-16 md:py-24 bg-light-surface-soft border-b border-light-outline">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Jadwalkan Konsultasi Gratis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            Konsultasikan Kebutuhan Belajar Putra-Putri Anda Bersama Konselor Ahli
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Isi formulir singkat di bawah ini. Tim konselor kami akan menghubungi Anda melalui WhatsApp dalam 1x24 jam untuk mengatur jadwal tes diagnostik atau sesi coba kelas gratis.
          </p>
        </div>

        {/* Card Form Container */}
        <div className="rounded-2xl bg-white border border-light-outline p-6 sm:p-10 shadow-lg">
          {submittedData ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-indigo">
                Terima Kasih, {submittedData.parentName}!
              </h3>
              <p className="text-sm text-light-muted max-w-md mx-auto leading-relaxed">
                Permohonan konsultasi untuk ananda <strong className="text-light-on-surface">{submittedData.studentName}</strong> (Jenjang: {submittedData.gradeLevel}) telah kami terima. Tim konselor akademik kami akan segera menghubungi via WhatsApp ke nomor <strong className="text-light-on-surface">{submittedData.parentPhone}</strong>.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setSubmittedData(null)}
                  className="px-6 py-2.5 rounded-xl border border-light-outline text-brand-indigo hover:bg-light-surface-soft font-semibold text-xs"
                >
                  Kirim Formulir Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Nama Orang Tua */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-light-on-surface flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>Nama Lengkap Orang Tua / Wali *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dra. Nurhayati"
                    {...register("parentName")}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      errors.parentName
                        ? "border-danger focus:ring-1 focus:ring-danger"
                        : "border-light-outline focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
                    }`}
                  />
                  {errors.parentName && (
                    <p className="text-[11px] font-medium text-danger">{errors.parentName.message}</p>
                  )}
                </div>

                {/* Nama Siswa */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-light-on-surface flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>Nama Siswa *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Farhan Pratama"
                    {...register("studentName")}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      errors.studentName
                        ? "border-danger focus:ring-1 focus:ring-danger"
                        : "border-light-outline focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
                    }`}
                  />
                  {errors.studentName && (
                    <p className="text-[11px] font-medium text-danger">{errors.studentName.message}</p>
                  )}
                </div>

                {/* Nomor WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-light-on-surface flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>Nomor WhatsApp Aktif *</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="Contoh: 081234567890"
                    {...register("parentPhone")}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      errors.parentPhone
                        ? "border-danger focus:ring-1 focus:ring-danger"
                        : "border-light-outline focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
                    }`}
                  />
                  {errors.parentPhone && (
                    <p className="text-[11px] font-medium text-danger">{errors.parentPhone.message}</p>
                  )}
                </div>

                {/* Jenjang Pendidikan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-light-on-surface flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>Jenjang Pendidikan Saat Ini *</span>
                  </label>
                  <select
                    {...register("gradeLevel")}
                    className="w-full px-4 py-3 rounded-xl border border-light-outline text-sm bg-white focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo outline-none"
                  >
                    <option value="SD">SD (Kelas 4–6)</option>
                    <option value="SMP">SMP (Kelas 7–9)</option>
                    <option value="SMA">SMA (Kelas 10–12)</option>
                    <option value="UTBK">Intensif UTBK SNBT / Gap Year</option>
                  </select>
                </div>

                {/* Mode Belajar */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-light-on-surface">
                    Preferensi Mode Belajar
                  </label>
                  <select
                    {...register("learningMode")}
                    className="w-full px-4 py-3 rounded-xl border border-light-outline text-sm bg-white focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo outline-none"
                  >
                    <option value="Tatap Muka (Offline)">Tatap Muka di Cabang (Offline)</option>
                    <option value="Online Interaktif">Kelas Online Interaktif (Live Zoom)</option>
                    <option value="Hybrid">Hybrid (Kombinasi Offline & Online)</option>
                    <option value="Privat 1-on-1">Privat Eksklusif 1-on-1</option>
                  </select>
                </div>

                {/* Target Mata Pelajaran */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-light-on-surface">
                    Mata Pelajaran yang Ingin Ditingkatkan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Matematika & Fisika"
                    {...register("targetSubject")}
                    className="w-full px-4 py-3 rounded-xl border border-light-outline text-sm focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo outline-none"
                  />
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-light-on-surface">
                  Catatan atau Kebutuhan Khusus Siswa (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan target nilai rapor anak, sekolah impian, atau topik pelajaran yang dirasa paling sulit..."
                  {...register("notes")}
                  className="w-full px-4 py-3 rounded-xl border border-light-outline text-sm focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-light-muted text-center sm:text-left">
                  🔒 Data Anda terlindungi dan hanya digunakan oleh konselor ARCI Bimbel.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-dark font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Mengirim Permohonan...</span>
                  ) : (
                    <>
                      <span>Kirim Jadwal Konsultasi</span>
                      <Send className="w-4 h-4 text-accent" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
