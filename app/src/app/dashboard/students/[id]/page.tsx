import React from "react";
import StudentDetailClient from "./student-detail-client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateStaticParams() {
  const defaultParams = [
    { id: "STU-2026-001" },
    { id: "STU-2026-002" },
    { id: "STU-2026-003" },
    { id: "STU-2026-004" },
    { id: "STU-2026-005" },
    { id: "1" },
  ];

  try {
    const supabase = createAdminClient();
    const { data: students } = await supabase.from("students").select("id, nisn");
    if (students && students.length > 0) {
      const dbParams = students.flatMap((s) => [
        { id: s.id },
        ...(s.nisn ? [{ id: s.nisn }] : []),
      ]);
      return [...defaultParams, ...dbParams];
    }
  } catch (e) {
    console.error("Error generating static params for students:", e);
  }

  return defaultParams;
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentDetailClient id={id} />;
}
