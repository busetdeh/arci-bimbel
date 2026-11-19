import React from "react";
import { 
  Target, 
  GraduationCap, 
  Smartphone, 
  BookMarked, 
  CheckCircle, 
  Sparkles 
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Target,
      badge: "Personalisasi",
      title: "Diagnostik Gaya Belajar & Pemetaan Karakter Siswa",
      description:
        "Setiap siswa memulai dengan tes diagnostik awal untuk mengukur penguasaan konsep dasar dan tipe belajar. Tutor menyusun strategi bimbingan yang tepat sasaran.",
      points: [
        "Analisis kelemahan per sub-topik mata pelajaran",
        "Rekomendasi kelas berdasarkan tingkat pemahaman",
        "Target capaian belajar individual",
      ],
      color: "text-brand-indigo",
      bg: "bg-light-primary-container",
    },
    {
      icon: GraduationCap,
      badge: "Kualitas Pengajar",
      title: "Tutor Terpilih Alumni PTN Terkemuka (UI, ITB, UGM)",
      description:
        "Tutor melalui proses seleksi ketat dengan standar pengajaran ramah, interaktif, dan berorientasi pada pemahaman konsep nalar, bukan sekadar hafalan rumus cepat.",
      points: [
        "Metode 'Active Dialogue' dua arah di kelas",
        "Tutor standby untuk sesi tanya-jawab privat",
        "Bimbingan motivasi & manajemen stres belajar",
      ],
      color: "text-amber-800",
      bg: "bg-amber-100",
    },
    {
      icon: Smartphone,
      badge: "Keterbukaan Informasi",
      title: "Pemantauan Belajar 360° Terhubung ke Orang Tua",
      description:
        "Orang tua dapat memantau presensi kelas, skor tryout berkala, evaluasi perkembangan tutor, dan pembayaran melalui Portal Wali Murid serta notifikasi WhatsApp otomatis.",
      points: [
        "Notifikasi kehadiran siswa tepat waktu",
        "Grafik tren nilai rapor dan tryout berkala",
        "Catatan konsultasi perkembangan bulanan",
      ],
      color: "text-emerald-800",
      bg: "bg-emerald-100",
    },
    {
      icon: BookMarked,
      badge: "Materi & Modul",
      title: "Bank Soal Prediktif & Modul Eksklusif Terkini",
      description:
        "Modul belajar disusun oleh tim riset kurikulum ARCI Bimbel mengacu pada Kurikulum Merdeka dan pola soal UTBK-SNBT terbaru dengan tingkat prediksi tinggi.",
      points: [
        "Ringkasan rumus & peta konsep visual",
        "Latihan soal berjenjang: Dasar, Menengah, HOTS",
        "Akses pembahasan video & modul digital",
      ],
      color: "text-blue-800",
      bg: "bg-blue-100",
    },
  ];

  return (
    <section id="keunggulan" className="py-16 md:py-24 bg-white border-b border-light-outline">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Keunggulan ARCI Bimbel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            Mengapa Ratusan Orang Tua Mempercayakan Prestasi Anak kepada Kami?
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Kami memadukan disiplin akademik, kenyamanan psikologis anak, serta teknologi pemantauan terpadu untuk hasil yang nyata dan berkelanjutan.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-light-outline p-6 sm:p-8 bg-light-surface-soft hover:border-brand-indigo/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-light-outline text-light-muted">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-brand-indigo mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-light-muted leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-light-outline/70 pt-4 space-y-2">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-light-on-surface">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
