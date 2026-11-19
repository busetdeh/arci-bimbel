"use client";

import React, { useState } from "react";

interface BroadcastLog {
  id: string;
  title: string;
  target: string;
  recipientsCount: number;
  sentAt: string;
  status: "Terkirim" | "Diproses";
  deliveredCount: number;
  readCount: number;
  content: string;
}

const initialLogs: BroadcastLog[] = [
  {
    id: "BC-2026-1104",
    title: "Pengingat Tryout Akbar UTBK #4",
    target: "Khusus Peserta Intensif UTBK-SNBT",
    recipientsCount: 64,
    sentAt: "17 Nov 2026, 10:00 WIB",
    status: "Terkirim",
    deliveredCount: 64,
    readCount: 61,
    content:
      "Yth. Bapak/Ibu Wali Siswa, kami mengingatkan pelaksanaan Tryout UTBK-SNBT ke-4 dengan sistem IRT nasional akan dilaksanakan pada Sabtu, 22 November 2026 pukul 08.00 WIB di Aula Sudirman.",
  },
  {
    id: "BC-2026-1101",
    title: "Pengumuman Pembayaran SPP Bulan November",
    target: "Wali dengan Tagihan Belum Lunas",
    recipientsCount: 25,
    sentAt: "05 Nov 2026, 09:30 WIB",
    status: "Terkirim",
    deliveredCount: 25,
    readCount: 23,
    content:
      "Yth. Bapak/Ibu Wali Siswa ARCI Bimbel, invoice SPP periode November 2026 telah terbit. Pembayaran dapat dilakukan via transfer Bank BCA Virtual Account sebelum tanggal 10 November 2026.",
  },
];

export default function CommunicationsPage() {
  const [targetSegment, setTargetSegment] = useState("184|Semua Orang Tua Murid Aktif");
  const [messageContent, setMessageContent] = useState(
    "Yth. Bapak/Ibu Wali Siswa, kami menginfokan bahwa simulasi Tryout UTBK IRT Nasional ke-4 akan diselenggarakan pada Sabtu, 22 November 2026. Mohon pastikan ananda hadir tepat waktu pukul 07.45 WIB."
  );
  const [logs, setLogs] = useState<BroadcastLog[]>(initialLogs);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const applyTemplate = (tpl: "tryout" | "holiday" | "payment" | "schedule") => {
    if (tpl === "tryout") {
      setMessageContent(
        "Yth. Bapak/Ibu Wali Siswa, kami menginfokan bahwa simulasi Tryout UTBK IRT Nasional ke-4 akan diselenggarakan pada Sabtu, 22 November 2026 pukul 08.00 WIB. Mohon pastikan ananda hadir tepat waktu pukul 07.45 WIB."
      );
    } else if (tpl === "holiday") {
      setMessageContent(
        "Pemberitahuan Libur Resmi: Sehubungan dengan agenda libur nasional, kegiatan belajar mengajar tatap muka dan online di seluruh cabang ARCI Bimbel akan diliburkan. Sesi pengganti akan dijadwalkan kemudian."
      );
    } else if (tpl === "payment") {
      setMessageContent(
        "Yth. Bapak/Ibu Wali Siswa, kami menginfokan invoice SPP bulanan ananda telah terbit di portal. Mohon lakukan pelunasan sebelum tanggal jatuh tempo melalui virtual account yang tertera."
      );
    } else if (tpl === "schedule") {
      setMessageContent(
        "Informasi Perubahan Sesi: Jadwal kelas Matematika untuk rombel SMP-8 Sudirman hari ini digeser 30 menit menjadi pukul 16.30 WIB dikarenakan penyesuaian ruang laboratorium. Terima kasih."
      );
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(targetSegment.split("|")[0], 10);
    const targetLabel = targetSegment.split("|")[1];

    const newLog: BroadcastLog = {
      id: `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: "Siaran WhatsApp Massal",
      target: targetLabel,
      recipientsCount: count,
      sentAt: "Baru saja",
      status: "Terkirim",
      deliveredCount: count,
      readCount: 0,
      content: messageContent,
    };

    setLogs((prev) => [newLog, ...prev]);
    showToast(`Pesan broadcast resmi berhasil dikirimkan ke ${count} kontak WhatsApp wali siswa!`);
  };

  return (
    <>
      {toastMsg && (
        <div className="p-3.5 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px] text-success">
              check_circle
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 rounded hover:bg-black/5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Title & Channel Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Pusat Komunikasi &amp; Broadcast Resmi
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-label bg-success text-on-success font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              WhatsApp Resmi Terhubung
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1">
            Kirim pengumuman massal, pengingat jadwal ujian, notifikasi presensi otomatis, dan tagihan SPP ke orang tua.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-light-surface px-3.5 py-1.5 rounded-lg border border-light-outline-variant text-[12px] text-light-on-surface-variant flex items-center gap-2 shadow-2xs">
            <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
            <span>API Kuota: <strong>9.840 / 10.000</strong> pesan tersisa</span>
          </div>
        </div>
      </div>

      {/* Split Layout: Message Composer (Col 5) & Broadcast History (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Section: Message Composer Form (Col 5) */}
        <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-brand-indigo">chat</span>
              <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                Kirim Pengumuman Baru
              </h2>
            </div>
            <span className="text-label-sm font-label font-bold text-light-primary bg-light-primary-container px-2.5 py-0.5 rounded-full">
              Mode Broadcast
            </span>
          </div>

          <form onSubmit={handleSendBroadcast} className="flex flex-col gap-4">
            <div>
              <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1">
                Target Penerima Pesan:
              </label>
              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm bg-light-surface focus:border-light-primary focus:ring-1 focus:ring-light-primary"
              >
                <option value="184|Semua Orang Tua Murid Aktif">Semua Orang Tua Murid Aktif (184 Kontak)</option>
                <option value="72|Khusus Siswa Reguler SMP">Khusus Siswa Reguler SMP (72 Kontak)</option>
                <option value="64|Khusus Peserta Intensif UTBK-SNBT">Khusus Peserta Intensif UTBK-SNBT (64 Kontak)</option>
                <option value="25|Wali dengan Tagihan Belum Lunas">Wali dengan Tagihan Belum Lunas (25 Kontak)</option>
                <option value="48|Orang Tua Siswa Reguler SD">Orang Tua Siswa Reguler SD (48 Kontak)</option>
              </select>
            </div>

            <div>
              <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1.5">
                Pilih Template Standar:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate("tryout")}
                  className="p-2 rounded-lg border border-light-outline hover:border-light-primary text-left text-[11px] font-semibold text-light-on-surface"
                >
                  ✓ Pengingat Tryout
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("holiday")}
                  className="p-2 rounded-lg border border-light-outline hover:border-light-primary text-left text-[11px] font-semibold text-light-on-surface"
                >
                  Libur &amp; Kalender
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("payment")}
                  className="p-2 rounded-lg border border-light-outline hover:border-light-primary text-left text-[11px] font-semibold text-light-on-surface"
                >
                  Tagihan SPP
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("schedule")}
                  className="p-2 rounded-lg border border-light-outline hover:border-light-primary text-left text-[11px] font-semibold text-light-on-surface"
                >
                  Perubahan Sesi
                </button>
              </div>
            </div>

            <div>
              <label className="font-label text-label-md text-light-on-surface font-semibold block mb-1">
                Isi Pesan Siaran WhatsApp:
              </label>
              <textarea
                rows={5}
                required
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-light-outline text-body-sm font-sans focus:border-light-primary focus:ring-1 focus:ring-light-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-success text-on-success hover:bg-success/90 font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Kirim Siaran Sekarang ({targetSegment.split("|")[0]} Wali)</span>
            </button>
          </form>
        </section>

        {/* Right Section: Broadcast History (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant">
            <h2 className="font-headline font-bold text-title-md text-light-on-surface">
              Riwayat Siaran &amp; Status Pengiriman
            </h2>
          </div>

          <div className="divide-y divide-light-outline-variant">
            {logs.map((log) => (
              <div key={log.id} className="p-5 flex flex-col gap-2.5 hover:bg-light-surface-container/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-body-md text-brand-indigo">{log.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success/15 text-success">
                    {log.status}
                  </span>
                </div>
                <p className="text-body-sm text-light-on-surface leading-relaxed">{log.content}</p>
                <div className="flex items-center justify-between text-[11px] text-light-on-surface-variant pt-2 border-t border-light-outline-variant/60">
                  <span>Target: <strong>{log.target}</strong> ({log.recipientsCount} Wali)</span>
                  <span>{log.sentAt} • Terbaca: {log.readCount}/{log.recipientsCount}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
