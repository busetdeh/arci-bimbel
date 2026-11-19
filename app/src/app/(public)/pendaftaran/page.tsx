import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getRegistrationOptions } from "@/app/actions/registration";
import { RegistrationFunnel } from "./registration-funnel";

export const metadata: Metadata = {
  title: "Pendaftaran Siswa Baru — ARCI Bimbel",
  description:
    "Formulir pendaftaran terpadu bimbingan belajar SD, SMP, SMA, dan Persiapan Intensif UTBK-SNBT 2026.",
};

async function RegistrationLoader({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; step?: string }>;
}) {
  const resolvedParams = await searchParams;
  const { branches, programs } = await getRegistrationOptions();

  return (
    <RegistrationFunnel
      branches={branches}
      programs={programs}
      defaultProgramCode={resolvedParams?.program}
    />
  );
}

export default function PendaftaranPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; step?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-light-surface flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-light-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-body-sm text-light-on-surface-variant font-medium">
              Memuat formulir pendaftaran...
            </p>
          </div>
        </div>
      }
    >
      <RegistrationLoader searchParams={searchParams} />
    </Suspense>
  );
}
