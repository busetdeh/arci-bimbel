"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: "Apakah ada tes diagnostik atau sesi coba gratis (trial) sebelum mendaftar?",
      a: "Ya, betul! Kami menyediakan 1x Sesi Coba Kelas (Trial) dan Tes Diagnostik Gaya Belajar secara cuma-cuma tanpa ikatan komitmen. Orang tua dan siswa dapat melihat langsung metode pengajaran tutor kami serta berkonsultasi mengenai rekomendasi program.",
    },
    {
      q: "Bagaimana jika siswa berhalangan hadir pada sesi kelas terjadwal?",
      a: "Siswa berhak mendapatkan sesi pengganti (make-up class) atau bimbingan klinik privat dengan tutor pengampu materi tersebut. Selain itu, modul pembahasan dan rekaman sesi (jika kelas online) tersedia di Portal Siswa.",
    },
    {
      q: "Bagaimana cara orang tua memantau perkembangan nilai dan kehadiran anak?",
      a: "Setiap wali murid mendapatkan akun khusus 'Portal Wali Murid' serta laporan otomatis via WhatsApp setiap kali siswa check-in presensi di cabang. Di akhir bulan, kami menerbitkan Rapor Perkembangan Belajar 360° yang mencakup skor kuis, pemahaman materi, dan catatan karakter dari tutor.",
    },
    {
      q: "Berapa jumlah maksimal siswa dalam satu kelas?",
      a: "Untuk menjamin interaksi optimal dan perhatian personal, kami membatasi kapasitas maksimal 6 hingga 8 siswa per kelas untuk program reguler dan intensif UTBK. Kami tidak membuka kelas massal puluhan siswa.",
    },
    {
      q: "Apakah ARCI Bimbel menyediakan pendampingan pemilihan jurusan UTBK-SNBT?",
      a: "Tentu! Khusus siswa kelas 12 dan gap year, program UTBK mencakup sesi konseling pemilihan jurusan, analisis rasionalisasi nilai tryout nasional terhadap daya tampung PTN, serta konsultasi portofolio prestasi SNBP.",
    },
    {
      q: "Bagaimana sistem pembayaran biaya bimbingan belajar di ARCI Bimbel?",
      a: "Pembayaran dapat dilakukan per bulan atau paket per semester. Kami mendukung transfer bank (Virtual Account), QRIS, kartu kredit, serta cicilan 0% tanpa bunga. Kuitansi dan invoice resmi langsung diterbitkan secara digital di portal Anda.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-b border-light-outline">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>Pertanyaan Umum (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            Semua yang Perlu Anda Ketahui tentang ARCI Bimbel
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Jawaban lengkap atas pertanyaan yang sering diajukan orang tua dan siswa sebelum bergabung.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-light-outline bg-light-surface-soft overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-light-surface-container/50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-brand-indigo">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg border border-light-outline flex items-center justify-center shrink-0 text-brand-indigo transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-brand-indigo text-white" : "bg-white"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-light-muted leading-relaxed border-t border-light-outline/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
