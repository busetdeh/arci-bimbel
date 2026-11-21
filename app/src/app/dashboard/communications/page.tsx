"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  AnnouncementItem,
  TargetSegmentOption,
  CommunicationsStats,
  BROADCAST_TEMPLATES,
} from "@/lib/communications-constants";
import {
  getCommunicationsDataAction,
  sendBroadcastAnnouncementAction,
} from "@/app/actions/communications";

export default function CommunicationsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [segments, setSegments] = useState<TargetSegmentOption[]>([]);
  const [stats, setStats] = useState<CommunicationsStats>({
    totalSent: 0,
    totalRecipientsReached: 0,
    activeBroadcastsThisMonth: 0,
    averageReadRatePercent: 94,
  });

  const [loading, setLoading] = useState(true);

  // Form State
  const [broadcastTitle, setBroadcastTitle] = useState("Pengumuman Resmi Bimbel");
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [messageContent, setMessageContent] = useState(
    "Yth. Bapak/Ibu Wali Siswa, kami menginfokan bahwa simulasi Tryout UTBK IRT Nasional ke-4 akan diselenggarakan pada Sabtu, 22 November 2026 pukul 08.00 WIB. Mohon pastikan ananda hadir tepat waktu pukul 07.45 WIB."
  );

  // Modals & toasts
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getCommunicationsDataAction();
      if (res.success) {
        setAnnouncements(res.announcements);
        setSegments(res.segments);
        setStats(res.stats);
        if (res.segments.length > 0 && !selectedSegmentId) {
          setSelectedSegmentId(res.segments[0].id);
        }
      } else {
        showToast(res.message || "Gagal memuat riwayat pengumuman.", "error");
      }
    } catch {
      showToast("Terjadi kendala jaringan saat memuat komunikasi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeSegment = segments.find((s) => s.id === selectedSegmentId) || segments[0];

  // Apply quick templates
  const handleApplyTemplate = (tplKey: string) => {
    const tpl = BROADCAST_TEMPLATES.find((t) => t.key === tplKey);
    if (tpl) {
      setBroadcastTitle(tpl.title);
      setMessageContent(tpl.text);
      showToast(`Template "${tpl.label}" diterapkan.`);
    }
  };

  // Submit broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !broadcastTitle.trim() || !activeSegment) {
      showToast("Judul, segmen penerima, dan isi pesan wajib diisi.", "error");
      return;
    }

    startTransition(async () => {
      const res = await sendBroadcastAnnouncementAction({
        title: broadcastTitle,
        content: messageContent,
        targetSegmentId: activeSegment.id,
        targetSegmentLabel: activeSegment.label,
        recipientsCount: activeSegment.count,
      });

      if (res.success) {
        showToast(res.message);
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl border border-light-outline-variant bg-light-surface text-body-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-[20px] ${
                toastMsg.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {toastMsg.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-medium text-light-on-surface">{toastMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 rounded hover:bg-black/5 text-light-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline font-bold text-headline-sm sm:text-headline-md text-light-on-surface">
              Pusat Komunikasi &amp; Siaran Pengumuman
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-label bg-success text-on-success font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              WhatsApp Resmi Terhubung
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1 leading-relaxed">
            Data live Supabase: Kirim siaran pengumuman resmi, jadwal tryout, dan notifikasi ke grup wali murid &amp; siswa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            title="Refresh Data"
            disabled={loading}
            className="p-2 rounded-lg border border-light-outline text-light-on-surface hover:bg-light-surface-container transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                loading ? "animate-spin text-brand-indigo" : "text-light-on-surface-variant"
              }`}
            >
              sync
            </span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Total Siaran Terkirim
            </span>
            <p className="font-headline font-bold text-headline-sm text-brand-indigo mt-0.5">
              {stats.totalSent} Pesan
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Tersimpan di Supabase
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">campaign</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Kontak Terjangkau
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-0.5">
              {stats.totalRecipientsReached} Kontak
            </p>
            <p className="text-[11px] text-success font-semibold mt-0.5">
              Wali Murid &amp; Siswa Aktif
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success text-on-success flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">mark_chat_read</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Rata-rata Terbaca (Read)
            </span>
            <p className="font-headline font-bold text-headline-sm text-light-on-surface mt-0.5">
              {stats.averageReadRatePercent}%
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Tingkat interaksi sangat tinggi
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-light-surface-container text-light-on-surface flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
          </div>
        </div>

        <div className="bg-light-surface p-4 sm:p-5 rounded-xl border border-light-outline-variant shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-label text-light-on-surface-variant font-medium">
              Status Gateway WhatsApp
            </span>
            <p className="font-headline font-bold text-headline-sm text-success mt-0.5">
              Aktif 24/7
            </p>
            <p className="text-[11px] text-light-on-surface-variant mt-0.5">
              Koneksi API Resmi Bimbel
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success/15 text-success flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
        </div>
      </section>

      {/* Split Layout: Composer Form (Col 5) & Broadcast History (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Section: Message Composer (Col 5) */}
        <section className="lg:col-span-5 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-brand-indigo">chat</span>
              <h2 className="font-headline text-title-lg font-bold text-light-on-surface">
                Tulis Siaran Baru
              </h2>
            </div>
            {activeSegment && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold bg-light-primary-container text-light-primary">
                {activeSegment.count} Penerima
              </span>
            )}
          </div>

          <form onSubmit={handleSendBroadcast} className="flex flex-col gap-4 text-body-sm">
            {/* Quick Templates Buttons */}
            <div>
              <span className="font-label text-[12px] font-semibold text-light-on-surface-variant block mb-1.5">
                Template Cepat Pengumuman:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {BROADCAST_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl.key)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-label font-medium border border-light-outline-variant hover:bg-light-surface-soft transition-colors"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                Judul Siaran / Topik: *
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Contoh: Pengumuman Simulasi Tryout UTBK ke-4"
                className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                Target Segmen Penerima: *
              </label>
              <select
                value={selectedSegmentId}
                onChange={(e) => setSelectedSegmentId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
              >
                {segments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.count} Kontak)
                  </option>
                ))}
              </select>
              {activeSegment && (
                <span className="text-[11px] text-light-on-surface-variant mt-1 block">
                  {activeSegment.description}
                </span>
              )}
            </div>

            <div>
              <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                Isi Pesan Siaran: *
              </label>
              <textarea
                rows={5}
                required
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full p-3 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm leading-relaxed"
                placeholder="Tuliskan pesan siaran yang akan dikirimkan..."
              />
              <span className="text-[11px] text-light-on-surface-variant block mt-0.5 text-right">
                {messageContent.length} karakter
              </span>
            </div>

            {/* WhatsApp Live Preview Box */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 text-[12px] flex flex-col gap-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Pratinjau Pesan WhatsApp</span>
              </div>
              <p className="italic text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100 whitespace-pre-wrap leading-relaxed">
                *{broadcastTitle.trim()}*{"\n\n"}
                {messageContent}
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-label-md font-bold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{isPending ? "Mengirimkan Siaran..." : `Kirim Siaran ke ${activeSegment?.count || 0} Penerima`}</span>
            </button>
          </form>
        </section>

        {/* Right Section: Broadcast History (Col 7) */}
        <section className="lg:col-span-7 bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Riwayat Siaran Pengumuman
              </h2>
              <p className="text-[12px] text-light-on-surface-variant">
                Daftar pesan broadcast yang tersimpan di Supabase
              </p>
            </div>
            {loading && (
              <span className="text-[12px] text-brand-indigo flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                Memperbarui...
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Judul &amp; Waktu Kirim</th>
                  <th className="py-3 px-4">Sasaran Penerima</th>
                  <th className="py-3 px-4">Terkirim / Dibaca</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {announcements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-light-on-surface-variant">
                      Belum ada riwayat siaran pengumuman.
                    </td>
                  </tr>
                ) : (
                  announcements.map((log) => (
                    <tr key={log.id} className="hover:bg-light-surface-container transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-light-on-surface text-[13px]">{log.title}</p>
                        <p className="text-[11px] text-light-on-surface-variant">{log.sentAt}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-light-on-surface text-[12px] block">
                          {log.targetSegment}
                        </span>
                        <span className="text-[11px] text-light-on-surface-variant">
                          {log.recipientsCount} Kontak WhatsApp
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-success text-[12px] block">
                          ✓ {log.deliveredCount} Terkirim
                        </span>
                        <span className="text-[11px] text-light-on-surface-variant">
                          {log.readCount} Dibaca
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${log.statusBadge}`}
                        >
                          {log.statusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAnnouncement(log)}
                          className="px-3 py-1 rounded text-[11px] font-label font-semibold border border-light-outline text-light-on-surface hover:bg-light-surface shadow-2xs"
                        >
                          Lihat Pesan
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-light-outline-variant flex items-center justify-between text-body-sm">
            <span className="text-light-on-surface-variant text-[13px]">
              Menampilkan {announcements.length} riwayat siaran broadcast
            </span>
          </div>
        </section>
      </div>

      {/* Modal View Broadcast Detail */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  {selectedAnnouncement.title}
                </h3>
                <p className="text-[12px] text-light-on-surface-variant mt-0.5">
                  Terkirim: {selectedAnnouncement.sentAt} • {selectedAnnouncement.recipientsCount} Penerima
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-light-surface-soft border border-light-outline-variant text-body-sm space-y-2">
              <span className="text-[11px] font-bold text-light-on-surface-variant block uppercase tracking-wider">
                Sasaran: {selectedAnnouncement.targetSegment}
              </span>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedAnnouncement.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-light-outline-variant">
              <span className="text-[12px] text-success font-medium">
                ✓ {selectedAnnouncement.deliveredCount} Terkirim • {selectedAnnouncement.readCount} Dibaca
              </span>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-lg bg-light-primary text-light-on-primary text-body-sm font-semibold hover:bg-brand-indigo-dark"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
