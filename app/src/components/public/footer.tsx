import React from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-light-surface-soft border-t border-light-outline text-light-on-surface pt-12 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-light-outline">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <span className="font-sans font-bold text-lg text-brand-indigo tracking-tight block">
                  ARCI BIMBEL
                </span>
                <span className="text-xs text-light-muted block -mt-0.5 font-medium">
                  Bimbingan Belajar Unggulan
                </span>
              </div>
            </Link>
            <p className="text-sm text-light-muted max-w-sm leading-relaxed">
              Lembaga bimbingan belajar personal dan adaptif untuk jenjang SD, SMP, SMA, serta persiapan intensif UTBK-SNBT dengan pendampingan tutor terbaik alumni PTN terkemuka.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white border border-light-outline flex items-center justify-center text-light-muted hover:text-brand-indigo hover:border-brand-indigo transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white border border-light-outline flex items-center justify-center text-light-muted hover:text-brand-indigo hover:border-brand-indigo transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terakreditasi A</span>
              </div>
            </div>
          </div>

          {/* Col 2: Program Belajar */}
          <div>
            <h4 className="font-semibold text-sm text-brand-indigo mb-4 uppercase tracking-wider">
              Program Belajar
            </h4>
            <ul className="space-y-2.5 text-sm text-light-muted">
              <li>
                <a href="#program" className="hover:text-brand-indigo transition-colors">
                  Reguler SD (Kelas 4–6)
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-brand-indigo transition-colors">
                  Prestasi SMP (Kelas 7–9)
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-brand-indigo transition-colors">
                  Unggulan SMA (Kelas 10–12)
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-brand-indigo transition-colors">
                  Super Intensif UTBK-SNBT
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-brand-indigo transition-colors">
                  Privat 1-on-1 Fleksibel
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Navigasi */}
          <div>
            <h4 className="font-semibold text-sm text-brand-indigo mb-4 uppercase tracking-wider">
              Akses Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-light-muted">
              <li>
                <Link href="/portal" className="hover:text-brand-indigo transition-colors">
                  Portal Siswa & Wali Murid
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-indigo transition-colors">
                  Dashboard Manajemen / Admin
                </Link>
              </li>
              <li>
                <Link href="/tutor" className="hover:text-brand-indigo transition-colors">
                  Presensi & Sesi Tutor
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-brand-indigo transition-colors">
                  Pendaftaran Siswa Baru
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-indigo transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Layanan & Jam Buka */}
          <div>
            <h4 className="font-semibold text-sm text-brand-indigo mb-4 uppercase tracking-wider">
              Kontak & Operasional
            </h4>
            <ul className="space-y-3 text-sm text-light-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
                <span>Rawamangun (Pusat) & Kebayoran Baru, Jakarta</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-indigo shrink-0" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-indigo shrink-0" />
                <span>halo@arcibimbel.id</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
                <span>Senin – Sabtu: 08:00 – 19:30 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-light-muted">
          <p>© 2026 ARCI Bimbel. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-light-on-surface cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-light-on-surface cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-light-on-surface cursor-pointer">Pedoman Keamanan Data</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
