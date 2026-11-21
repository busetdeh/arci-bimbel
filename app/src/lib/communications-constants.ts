/**
 * Pure constants, interfaces, and helpers for Communications & Broadcast Module
 * Kept separate from "use server" actions to comply with Next.js export restrictions.
 */

export interface AnnouncementItem {
  id: string; // UUID
  title: string;
  content: string;
  targetSegment: string;
  recipientsCount: number;
  status: "draft" | "sending" | "sent" | "failed";
  statusLabel: string;
  statusBadge: string;
  deliveredCount: number;
  readCount: number;
  sentAt: string; // formatted date
  rawCreatedAt: string;
}

export interface TargetSegmentOption {
  id: string;
  label: string;
  count: number;
  description: string;
}

export interface CommunicationsStats {
  totalSent: number;
  totalRecipientsReached: number;
  activeBroadcastsThisMonth: number;
  averageReadRatePercent: number;
}

export interface CommunicationsDataResult {
  success: boolean;
  announcements: AnnouncementItem[];
  segments: TargetSegmentOption[];
  stats: CommunicationsStats;
  message?: string;
}

export interface SendBroadcastPayload {
  title: string;
  content: string;
  targetSegmentId: string;
  targetSegmentLabel: string;
  recipientsCount: number;
}

export const BROADCAST_TEMPLATES = [
  {
    key: "tryout",
    title: "Pengingat Tryout Akbar UTBK",
    label: "Simulasi Tryout",
    text: "Yth. Bapak/Ibu Wali Siswa, kami menginfokan bahwa simulasi Tryout UTBK IRT Nasional ke-4 akan diselenggarakan pada Sabtu, 22 November 2026 pukul 08.00 WIB. Mohon pastikan ananda hadir tepat waktu pukul 07.45 WIB.",
  },
  {
    key: "holiday",
    title: "Pemberitahuan Libur Resmi",
    label: "Hari Libur Nasional",
    text: "Pemberitahuan Libur Resmi: Sehubungan dengan agenda libur nasional, kegiatan belajar mengajar tatap muka dan online di seluruh cabang ARCI Bimbel akan diliburkan. Sesi pengganti akan dijadwalkan oleh admin cabang.",
  },
  {
    key: "payment",
    title: "Pengingat Tagihan SPP Bulanan",
    label: "Tagihan SPP",
    text: "Yth. Bapak/Ibu Wali Siswa, kami menginfokan invoice SPP bulanan ananda telah terbit di portal. Mohon lakukan pelunasan sebelum tanggal jatuh tempo melalui virtual account yang tertera di kwitansi.",
  },
  {
    key: "schedule",
    title: "Penyesuaian Jadwal & Ruangan",
    label: "Perubahan Sesi",
    text: "Informasi Perubahan Sesi: Jadwal kelas bimbingan belajar untuk hari ini digeser 30 menit dikarenakan penyesuaian ruang laboratorium dan persiapan modul materi. Terima kasih atas pengertiannya.",
  },
];
