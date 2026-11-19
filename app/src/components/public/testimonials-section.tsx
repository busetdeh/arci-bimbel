import React from "react";
import Image from "next/image";
import { 
  Quote, 
  Star, 
  Sparkles, 
  CheckCircle, 
  Building2 
} from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      type: "Wali Murid",
      name: "Ibu Ratna Dewi",
      role: "Orang Tua dari Farhan Pratama (Siswa Kelas 9 SMP)",
      image: "/images/parent-ratna.jpg",
      achievement: "Lolos Masuk SMAN 8 Jakarta Unggulan",
      content:
        "Sebagai orang tua yang bekerja, saya sangat terbantu dengan Portal Wali Murid dan notifikasi WhatsApp ARCI Bimbel. Saya tahu persis kapan Farhan hadir dan apa materi yang perlu diulang. Nilai matematikanya naik dari 68 menjadi 92!",
      rating: 5,
    },
    {
      type: "Siswa Alumni",
      name: "Ahmad Rizky Pratama",
      role: "Alumni Program Super Intensif UTBK 2025",
      image: "/images/student-success.jpg",
      achievement: "Diterima di Teknik Elektro Universitas Indonesia (UI)",
      content:
        "Tryout di ARCI Bimbel tingkat kesulitannya sangat mirip dengan UTBK asli. Analisis rasionalisasi jurusannya sangat akurat, dan Kak Dimas selalu siap melayani konsultasi soal sulit sampai jam 9 malam. Skor UTBK saya tembus 728!",
      rating: 5,
    },
    {
      type: "Wali Murid",
      name: "Bpk. Haryanto, M.M.",
      role: "Orang Tua dari Nadia Amanda (Siswa Kelas 12)",
      image: "/images/parent-haryanto.jpg",
      achievement: "Diterima di Fakultas Kedokteran Universitas Airlangga (UNAIR)",
      content:
        "Pendekatan tutor ARCI Bimbel sangat personal. Nadia yang awalnya cemas menghadapi kimia dan biologi menjadi sangat percaya diri. Tutornya tidak cuma pintar mengajar, tapi juga membimbing mental dan fokus belajar anak.",
      rating: 5,
    },
  ];

  return (
    <section id="testimoni" className="py-16 md:py-24 bg-white border-b border-light-outline">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Kisah Sukses Nyata</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            Cerita Keberhasilan Siswa & Pengalaman Para Orang Tua
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Kepuasan dan ketenangan hati orang tua melihat putra-putrinya bertumbuh dengan penuh percaya diri adalah prioritas utama kami.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 sm:p-8 border border-light-outline bg-light-surface-soft hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Rating & Quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(testi.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-light-outline text-light-muted">
                    {testi.type}
                  </span>
                </div>

                {/* Outcome Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{testi.achievement}</span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-sm text-light-on-surface leading-relaxed italic">
                  &ldquo;{testi.content}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-5 border-t border-light-outline/70 flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-light-surface-container shrink-0 border border-light-outline">
                  <Image
                    src={testi.image}
                    alt={testi.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-indigo">{testi.name}</h4>
                  <p className="text-xs text-light-muted leading-tight">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
