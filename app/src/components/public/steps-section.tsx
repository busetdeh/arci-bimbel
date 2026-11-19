import React from "react";
import Link from "next/link";
import { 
  ClipboardCheck, 
  Compass, 
  CreditCard, 
  GraduationCap, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export function StepsSection() {
  const steps = [
    {
      num: "01",
      icon: ClipboardCheck,
      title: "Konsultasi & Tes Diagnostik",
      desc: "Orang tua dan calon siswa berdiskusi dengan konselor akademik serta mengikuti asesmen gaya belajar dan pemetaan kemampuan awal secara gratis.",
    },
    {
      num: "02",
      icon: Compass,
      title: "Rekomendasi Kelas & Jadwal",
      desc: "Kami merekomendasikan kelompok belajar terbaik (maksimal 8 siswa) dengan jadwal fleksibel yang tidak bentrok dengan kegiatan sekolah.",
    },
    {
      num: "03",
      icon: CreditCard,
      title: "Konfirmasi & Aktivasi Portal",
      desc: "Selesaikan administrasi transparan tanpa biaya tersembunyi, lalu dapatkan akses langsung ke Portal Siswa & Wali Murid.",
    },
    {
      num: "04",
      icon: GraduationCap,
      title: "Mulai Belajar & Monitoring 360°",
      desc: "Siswa memulai sesi dengan modul eksklusif, sementara orang tua menerima pembaruan presensi dan perkembangan belajar otomatis.",
    },
  ];

  return (
    <section id="alur" className="py-16 md:py-24 bg-white border-b border-light-outline">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Alur Mudah & Transparan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            4 Langkah Mudah Memulai Prestasi di ARCI Bimbel
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Proses orientasi yang terarah demi memastikan siswa mendapatkan kelas yang paling pas dengan potensi belajarnya.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-6 sm:p-7 border border-light-outline bg-light-surface-soft hover:border-brand-indigo/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-indigo text-white flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="font-sans font-extrabold text-3xl text-brand-indigo/15">
                      {st.num}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-brand-indigo mb-2">
                    {st.title}
                  </h3>
                  <p className="text-sm text-light-muted leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-light-outline/60 flex items-center gap-1.5 text-xs font-semibold text-brand-indigo">
                  <span>Tahap {st.num} Selesai</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-brand-indigo text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Ingin Mencoba Suasana Belajar Terlebih Dahulu?
            </h4>
            <p className="text-sm text-blue-100/90">
              Daftarkan putra-putri Anda untuk mengikuti 1x Sesi Trial & Tes Diagnostik secara gratis tanpa komitmen.
            </p>
          </div>
          <Link
            href="/pendaftaran"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-on-accent font-bold text-xs sm:text-sm shadow-xs hover:bg-amber-300 transition-colors whitespace-nowrap"
          >
            <span>Daftar Trial Kelas Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
