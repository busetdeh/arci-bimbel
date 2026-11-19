import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARCI Bimbel — Bimbingan Belajar SD, SMP, SMA & UTBK SNBT 2026",
  description:
    "Lembaga bimbingan belajar terpercaya dengan kurikulum terstruktur, tutor berpengalaman, kelas interaktif, dan pemantauan belajar siswa 360°.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-light-surface text-light-on-surface">
        {children}
      </body>
    </html>
  );
}
