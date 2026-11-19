import React from "react";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Wifi, 
  Tv, 
  ShieldCheck, 
  Sparkles, 
  Car, 
  BookOpen 
} from "lucide-react";

export function BranchesSection() {
  const branches = [
    {
      name: "Cabang Utama Rawamangun",
      city: "Jakarta Timur",
      address: "Jl. Pemuda No. 45, Rawamangun, Pulo Gadung, Jakarta Timur 13220",
      phone: "0812-3456-7890",
      image: "/images/branch-rawamangun.jpg",
      isHQ: true,
      facilities: [
        "6 Ruang Kelas Ber-AC (Kapasitas Maks. 8 Siswa)",
        "Lab Komputer CBT Standar UTBK SNBT",
        "Mini Library & Ruang Belajar Mandiri",
        "Musholla Nyaman & Area Parkir Kendaraan",
      ],
    },
    {
      name: "Cabang Kebayoran Baru",
      city: "Jakarta Selatan",
      address: "Jl. Wolter Monginsidi No. 18, Kebayoran Baru, Jakarta Selatan 12180",
      phone: "0813-8899-1234",
      image: "/images/branch-kebayoran.jpg",
      isHQ: false,
      facilities: [
        "5 Ruang Kelas Interaktif Smart Display",
        "Koneksi Internet Fiber Optic 100 Mbps",
        "Student Discussion Lounge & Cafe Corner",
        "Keamanan CCTV 24 Jam & Akses Fingerprint",
      ],
    },
  ];

  return (
    <section id="lokasi" className="py-16 md:py-24 bg-light-surface-soft border-b border-light-outline">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-primary-container text-brand-indigo text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Lokasi Cabang & Fasilitas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
            Lingkungan Belajar yang Nyaman, Aman, dan Kondusif
          </h2>
          <p className="text-sm sm:text-base text-light-muted">
            Kunjungi cabang terdekat kami untuk berkonsultasi langsung atau merasakan suasana kelas belajar secara gratis.
          </p>
        </div>

        {/* Branches Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {branches.map((br, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-light-outline overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 w-full bg-light-surface-container overflow-hidden">
                  <Image
                    src={br.image}
                    alt={br.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-indigo text-white shadow-xs">
                      {br.city}
                    </span>
                    {br.isHQ && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent text-on-accent shadow-xs">
                        Kantor Pusat
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl">{br.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2 text-xs sm:text-sm text-light-muted">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
                      <span className="text-light-on-surface">{br.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-brand-indigo shrink-0" />
                      <span className="font-medium text-light-on-surface">{br.phone}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-light-outline/70">
                    <h4 className="text-xs font-bold text-brand-indigo uppercase tracking-wider mb-2.5">
                      Fasilitas Pendukung:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-light-on-surface">
                      {br.facilities.map((fac, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={`https://wa.me/${br.phone.replace(/[^0-9]/g, '')}?text=Halo%20ARCI%20Bimbel,%20saya%20ingin%20jadwal%20kunjungan%20ke%20${encodeURIComponent(br.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-light-outline text-brand-indigo hover:bg-light-primary-container font-semibold text-xs transition-colors"
                >
                  Jadwalkan Kunjungan ke Cabang Ini
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
