"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Menu, 
  X, 
  ChevronDown, 
  LogIn, 
  MessageCircle, 
  UserCheck, 
  BriefcaseBusiness 
} from "lucide-react";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Beranda", href: "#home" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "Program", href: "#program" },
    { label: "Alur", href: "#alur" },
    { label: "Tutor", href: "#tutor" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "Cabang", href: "#lokasi" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-light-outline transition-all duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-indigo flex items-center justify-center text-white shadow-sm group-hover:bg-brand-indigo-dark transition-colors">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg sm:text-xl text-brand-indigo tracking-tight block">
                ARCI BIMBEL
              </span>
              <span className="text-[11px] sm:text-xs text-light-muted block -mt-0.5 font-medium">
                Bimbingan Belajar Unggulan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-light-on-surface hover:text-brand-indigo transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* WhatsApp Consultation Quick CTA */}
            <a
              href="https://wa.me/6281234567890?text=Halo%20ARCI%20Bimbel,%20saya%20ingin%20konsultasi%20program%20belajar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Konsultasi WA</span>
            </a>

            {/* Login Menu with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-light-on-surface hover:bg-light-surface-soft border border-light-outline transition-colors"
              >
                <LogIn className="w-4 h-4 text-brand-indigo" />
                <span>Masuk Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-light-muted" />
              </button>

              {loginDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLoginDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-light-outline shadow-xl py-2 z-50">
                    <Link
                      href="/portal"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-light-on-surface hover:bg-light-primary-container hover:text-brand-indigo transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-brand-indigo" />
                      <div>
                        <div className="font-semibold">Portal Siswa & Ortu</div>
                        <div className="text-[10px] text-light-muted">Pantau rapor & jadwal</div>
                      </div>
                    </Link>
                    <div className="border-t border-light-outline my-1" />
                    <Link
                      href="/dashboard"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-light-on-surface hover:bg-light-primary-container hover:text-brand-indigo transition-colors"
                    >
                      <BriefcaseBusiness className="w-4 h-4 text-brand-indigo" />
                      <div>
                        <div className="font-semibold">Portal Staf & Tutor</div>
                        <div className="text-[10px] text-light-muted">Presensi & administrasi</div>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Main Primary CTA */}
            <Link
              href="/pendaftaran"
              className="inline-flex items-center justify-center px-4.5 py-2.5 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-dark font-semibold text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/pendaftaran"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-indigo text-white font-semibold text-xs"
            >
              Daftar
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl border border-light-outline flex items-center justify-center text-light-on-surface hover:bg-light-surface-soft active:bg-light-surface-container transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-light-outline bg-white px-5 py-4 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-light-on-surface hover:bg-light-surface-soft transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="pt-3 border-t border-light-outline space-y-2">
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-light-outline text-xs font-semibold text-light-on-surface hover:bg-light-surface-soft"
            >
              <UserCheck className="w-4 h-4 text-brand-indigo" />
              <span>Masuk Portal Siswa & Ortu</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-light-outline text-xs font-semibold text-light-on-surface hover:bg-light-surface-soft"
            >
              <BriefcaseBusiness className="w-4 h-4 text-brand-indigo" />
              <span>Masuk Mode Staf / Tutor</span>
            </Link>
            <Link
              href="/pendaftaran"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-3 rounded-xl bg-brand-indigo text-white font-semibold text-sm shadow-sm"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
