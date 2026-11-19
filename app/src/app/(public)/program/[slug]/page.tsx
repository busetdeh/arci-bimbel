import React from "react";
import { ProgramDetailContent } from "./program-content";

export function generateStaticParams() {
  return [
    { slug: "intensif-utbk-2026" },
    { slug: "utbk" },
    { slug: "program-detail" },
  ];
}

export default function ProgramDetailPage() {
  return <ProgramDetailContent />;
}
