import React from "react";
import StudentDetailClient from "./student-detail-client";

export function generateStaticParams() {
  return [
    { id: "STU-2026-001" },
    { id: "STU-2026-002" },
    { id: "STU-2026-003" },
    { id: "STU-2026-004" },
    { id: "STU-2026-005" },
    { id: "1" },
  ];
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentDetailClient id={id} />;
}
