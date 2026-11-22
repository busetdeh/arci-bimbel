import React, { Suspense } from "react";
import { BlogDetailContent } from "./blog-content";

export function generateStaticParams() {
  return [
    { slug: "strategi-tps-penalaran-matematika-utbk-2026" },
    { slug: "panduan-memilih-jurusan-kuliah-snbt" },
    { slug: "5-kebiasaan-belajar-siswa-smp" },
    { slug: "bedah-kisi-kisi-aspd-smp-diy" },
  ];
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-light-surface flex items-center justify-center font-headline text-brand-indigo">Memuat artikel...</div>}>
      <BlogDetailContent slug={slug} />
    </Suspense>
  );
}
