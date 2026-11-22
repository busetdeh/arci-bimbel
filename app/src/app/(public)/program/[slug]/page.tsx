import React from "react";
import { ProgramDetailContent } from "./program-content";

export function generateStaticParams() {
  return [
    { slug: "intensif-utbk-2026" },
    { slug: "utbk-2026" },
    { slug: "utbk" },
    { slug: "smp-reg" },
    { slug: "sma-reg" },
    { slug: "sd-reg" },
    { slug: "program-detail" },
  ];
}

export default function ProgramDetailPage() {
  return <ProgramDetailContent />;
}
