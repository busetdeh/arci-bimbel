import React from "react";
import Image from "next/image";
import { 
  GraduationCap, 
  Sparkles, 
  Award, 
  BookOpen, 
  Star 
} from "lucide-react";

export function TutorsSection() {
  const tutors = [
    {
      name: "Dimas Arya, S.Si.",
      role: "Master Tutor Matematika & Penalaran UTBK",
      almaMater: "Alumni Matematika Universitas Indonesia (UI)",
      experience: "7+ Tahun Pengalaman",
      image: "/images/tutor-dimas.jpg",
      quote: "Matematika bukan tentang menghafal rumus, melainkan melatih nalar dan kejelian memecah masalah kompleks menjadi langkah sederhana.",
      stats: "98% Siswa Lolos Matematika UTBK",
    },
    {
      name: "Siti Rahma, S.Pd.",
      role: "Master Tutor Kimia & Sains Terpadu",
      almaMater: "Alumni Pendidikan Kimia UNJ",
      experience: "6+ Tahun Pengalaman",
      image: "/images/tutor-siti.jpg",
      quote: "Saya membawa konsep sains abstrak ke dalam analogi keseharian agar siswa paham esensinya dan mencintai proses belajarnya.",
      stats: "Peringkat 1 Tutor Favorit 2025",
    },
    {
      name: "Budi Pratama, S.Si.",
      role: "Master Tutor Fisika SMA & TPS UTBK",
      almaMater: "Alumni Fisika Institut Teknologi Bandung (ITB)",
      experience: "8+ Tahun Pengalaman",
      image: "/images/tutor-budi.jpg",
      quote: "Di kelas fisika saya, siswa diajak menganalisis fenomena secara logis. Sekali konsepnya tertanam, soal variasi apapun bisa ditaklukkan.",
      stats: "Membimbing 1.200+ Siswa Lolos PTN",
    },
    {
      name: "Amanda Putri, M.Hum.",
      role: "Master Tutor Literasi & Bahasa Inggris",
      almaMater: "Alumni Sastra Inggris Universitas Gadjah Mada (UGM)",
      experience: "5+ Tahun Pengalaman",
      image: "/images/tutor-amanda.jpg",
      quote: "Membaca cepat bukan sekadar skimming, melainkan kemampuan menangkap premis logika teks secara tepat dan efektif di bawah tekanan waktu ujian.",
      stats: "Spesialis Literasi Bahasa UTBK",
    },
  ];

  return (
    <section id="tutor" className="py-16 md:py-24 bg-light-surface-soft border-b border-light-outline">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Pendidik Berpengalaman</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            Didampingi oleh Tutor Inspiratif Lulusan Kampus Unggulan
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Tutor kami tidak hanya menguasai materi secara mendalam, tetapi juga terlatih dalam psikologi remaja dan teknik komunikasi yang suportif.
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tut, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-light-outline overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-64 w-full bg-light-surface-container overflow-hidden">
                  <Image
                    src={tut.image}
                    alt={tut.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="inline-block text-[10px] font-semibold bg-accent text-on-accent px-2 py-0.5 rounded">
                      {tut.experience}
                    </span>
                    <h3 className="font-bold text-base mt-1 text-white">{tut.name}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-brand-indigo flex items-start gap-1.5">
                    <GraduationCap className="w-4 h-4 shrink-0 text-brand-indigo mt-0.5" />
                    <span>{tut.almaMater}</span>
                  </div>

                  <div className="text-xs text-light-muted">
                    {tut.role}
                  </div>

                  <p className="text-xs text-light-muted italic leading-relaxed pt-2 border-t border-light-outline/60">
                    &ldquo;{tut.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Card Footer Badge */}
              <div className="p-4 bg-light-surface-soft border-t border-light-outline flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 shrink-0" />
                <span className="truncate">{tut.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
