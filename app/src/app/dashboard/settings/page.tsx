"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  StaffUserItem,
  AuditLogItem,
  StaffRoleType,
  STAFF_ROLE_CONFIG,
} from "@/lib/settings-constants";
import {
  getSettingsDataAction,
  createStaffAccountAction,
  updateStaffRoleAction,
} from "@/app/actions/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "rbac" | "audit">("users");
  const [staffList, setStaffList] = useState<StaffUserItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUserItem | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [newStaffForm, setNewStaffForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "tutor" as StaffRoleType,
    password: "BimbelARCI2026!",
  });

  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getSettingsDataAction();
      if (res.success) {
        setStaffList(res.staffList);
        setAuditLogs(res.auditLogs);
      } else {
        showToast(res.message || "Gagal memuat data staf.", "error");
      }
    } catch {
      showToast("Terjadi kendala jaringan saat memuat pengaturan.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Action: Create Staff
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.fullName.trim() || !newStaffForm.email.trim()) {
      showToast("Nama lengkap dan email staf wajib diisi.", "error");
      return;
    }

    startTransition(async () => {
      const res = await createStaffAccountAction(newStaffForm);
      if (res.success) {
        showToast(res.message);
        setIsNewStaffModalOpen(false);
        setNewStaffForm({
          fullName: "",
          email: "",
          phone: "",
          role: "tutor",
          password: "BimbelARCI2026!",
        });
        await loadData();
      } else {
        showToast(res.message, "error");
      }
    });
  };

  // Action: Update Role
  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    startTransition(async () => {
      const res = await updateStaffRoleAction(editingStaff.id, editingStaff.role);
      if (res.success) {
        showToast(res.message);
        setEditingStaff(null);
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
              Manajemen Pengguna, Peran &amp; Audit Keamanan
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label bg-light-primary-container text-light-primary font-bold shadow-2xs">
              {staffList.length} Akun Staf Aktif
            </span>
          </div>
          <p className="text-body-sm text-light-on-surface-variant mt-1 leading-relaxed">
            Data live Supabase: Konfigurasi akun staf, peran akses (RBAC), serta rekam jejak audit keamanan seluruh aktivitas dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsNewStaffModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-light-primary text-light-on-primary hover:bg-brand-indigo-dark font-label text-body-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Tambah Akun Staf</span>
          </button>

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

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-light-outline-variant pb-px">
        {[
          { key: "users", label: "Daftar Akun Staf", icon: "badge" },
          { key: "rbac", label: "Matriks Hak Akses (RBAC)", icon: "security" },
          { key: "audit", label: "Log Audit Keamanan", icon: "history" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-t-xl text-body-sm font-label font-semibold transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-light-surface text-light-primary border-t-2 border-x border-light-primary shadow-xs"
                : "text-light-on-surface-variant hover:text-light-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DAFTAR AKUN STAF                                                   */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <section className="bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Staf &amp; Kontak</th>
                  <th className="py-3 px-4">Email Login</th>
                  <th className="py-3 px-4">Peran Hak Akses</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4">Login Terakhir</th>
                  <th className="py-3 px-4 text-right">Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {staffList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-light-on-surface-variant">
                      Memuat daftar staf dari Supabase...
                    </td>
                  </tr>
                ) : (
                  staffList.map((staf) => (
                    <tr key={staf.id} className="hover:bg-light-surface-container transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center font-bold text-[13px] shadow-2xs">
                            {staf.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-light-on-surface text-[14px]">{staf.name}</p>
                            <p className="text-[11px] text-light-on-surface-variant">{staf.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[12px] text-light-primary font-medium">
                        {staf.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-label font-bold ${staf.roleBadge}`}
                        >
                          {staf.roleLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-success font-semibold text-[12px]">
                          <span className="w-2 h-2 rounded-full bg-success"></span>
                          {staf.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[12px] text-light-on-surface-variant">
                        {staf.lastLogin}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingStaff(staf)}
                          className="px-3 py-1.5 rounded-lg border border-light-outline text-light-on-surface text-[12px] font-label font-medium hover:bg-light-surface-container shadow-2xs"
                        >
                          Ubah Peran
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
              Menampilkan {staffList.length} akun staf terdaftar di Supabase Auth &amp; Profiles
            </span>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MATRIKS HAK AKSES (RBAC)                                           */}
      {/* ========================================================================= */}
      {activeTab === "rbac" && (
        <section className="bg-light-surface rounded-xl border border-light-outline-variant shadow-xs p-5 sm:p-6 flex flex-col gap-5">
          <div>
            <h2 className="font-headline font-bold text-title-lg text-light-on-surface">
              Matriks Izin Akses Berbasis Peran (RBAC)
            </h2>
            <p className="text-body-sm text-light-on-surface-variant mt-0.5">
              Pembagian kewenangan sistem untuk menjaga integritas data operasional bimbel.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-light-outline-variant">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Modul / Menu Dashboard</th>
                  <th className="py-3 px-4 text-center">Super Admin</th>
                  <th className="py-3 px-4 text-center">Admin Akademik</th>
                  <th className="py-3 px-4 text-center">Admin Keuangan</th>
                  <th className="py-3 px-4 text-center">Tutor Pengajar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {[
                  {
                    module: "Ringkasan Eksekutif (Dashboard)",
                    desc: "Melihat metrik KPI bisnis, keuangan, dan antrean tugas",
                    super: true,
                    akademik: true,
                    keuangan: true,
                    tutor: false,
                  },
                  {
                    module: "CRM Leads & Pipeline Konsultasi",
                    desc: "Follow-up calon siswa, update status prospek",
                    super: true,
                    akademik: true,
                    keuangan: false,
                    tutor: false,
                  },
                  {
                    module: "Pendaftaran Siswa Baru (Admissions)",
                    desc: "Verifikasi berkas, penerimaan, dan penempatan rombel",
                    super: true,
                    akademik: true,
                    keuangan: false,
                    tutor: false,
                  },
                  {
                    module: "Direktori Siswa & Wali Murid",
                    desc: "Melihat profil siswa, catatan akademik, update status",
                    super: true,
                    akademik: true,
                    keuangan: true,
                    tutor: true,
                  },
                  {
                    module: "Manajemen Program, Rombel & Kelas",
                    desc: "Buka rombel baru, edit kuota kursi, jadwal",
                    super: true,
                    akademik: true,
                    keuangan: false,
                    tutor: false,
                  },
                  {
                    module: "Kalender Jadwal Sesi",
                    desc: "Lihat dan atur jadwal sesi mingguan & harian",
                    super: true,
                    akademik: true,
                    keuangan: false,
                    tutor: true,
                  },
                  {
                    module: "Presensi Siswa Mobile-First",
                    desc: "Input kehadiran sesi (Hadir/Izin/Sakit/Alpa) dan materi",
                    super: true,
                    akademik: true,
                    keuangan: false,
                    tutor: true,
                  },
                  {
                    module: "Keuangan, Tagihan & Kwitansi",
                    desc: "Verifikasi bukti transfer, cetak kwitansi, SPP",
                    super: true,
                    akademik: false,
                    keuangan: true,
                    tutor: false,
                  },
                  {
                    module: "Pusat Komunikasi & Siaran Pengumuman",
                    desc: "Kirim pesan siaran massal ke grup orang tua",
                    super: true,
                    akademik: true,
                    keuangan: true,
                    tutor: false,
                  },
                  {
                    module: "Laporan Kinerja & Analitik",
                    desc: "Melihat laporan konversi program & rekap kehadiran",
                    super: true,
                    akademik: true,
                    keuangan: true,
                    tutor: false,
                  },
                  {
                    module: "Pengaturan Akun Staf & RBAC",
                    desc: "Tambah staf baru, ganti peran akses, audit log",
                    super: true,
                    akademik: false,
                    keuangan: false,
                    tutor: false,
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-light-surface-soft transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-light-on-surface">{row.module}</p>
                      <p className="text-[11px] text-light-on-surface-variant">{row.desc}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="material-symbols-outlined text-[20px] text-success">
                        check_circle
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          row.akademik ? "text-success" : "text-light-outline"
                        }`}
                      >
                        {row.akademik ? "check_circle" : "cancel"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          row.keuangan ? "text-success" : "text-light-outline"
                        }`}
                      >
                        {row.keuangan ? "check_circle" : "cancel"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          row.tutor ? "text-success" : "text-light-outline"
                        }`}
                      >
                        {row.tutor ? "check_circle" : "cancel"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LOG AUDIT KEAMANAN                                                 */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <section className="bg-light-surface rounded-xl border border-light-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b border-light-outline-variant flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-title-md text-light-on-surface">
                Rekam Jejak Audit Keamanan Sistem
              </h2>
              <p className="text-[12px] text-light-on-surface-variant">
                Pencatatan otomatis seluruh perubahan pendaftaran, keuangan, kelas, dan status siswa
              </p>
            </div>
            <span className="text-[11px] text-light-on-surface-variant font-mono">
              Tabel: audit_logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-light-surface-soft border-b border-light-outline-variant text-[11px] font-label text-light-on-surface-variant uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Waktu Kejadian</th>
                  <th className="py-3 px-4">Aksi / Aktivitas</th>
                  <th className="py-3 px-4">Entitas Terkait</th>
                  <th className="py-3 px-4">Rincian Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-outline-variant font-body">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-light-on-surface-variant">
                      Belum ada catatan log audit.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-light-surface-container transition-colors">
                      <td className="py-3 px-4 text-[12px] text-light-on-surface-variant whitespace-nowrap">
                        {log.formattedDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-indigo font-mono text-[12px]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-[12px] text-light-on-surface">
                        <span className="px-2 py-0.5 rounded bg-light-surface-container font-mono text-[11px]">
                          {log.entityType}
                        </span>
                        {log.entityId && (
                          <span className="text-light-on-surface-variant text-[11px] block mt-0.5">
                            ID: {log.entityId}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[11.5px] font-mono text-slate-700 max-w-[320px] truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH AKUN STAF BARU                                            */}
      {/* ========================================================================= */}
      {isNewStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-indigo text-[22px]">
                  person_add
                </span>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Tambah Akun Staf Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewStaffModalOpen(false)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="flex flex-col gap-3.5 text-body-sm">
              <div>
                <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                  Nama Lengkap Staf *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffForm.fullName}
                  onChange={(e) => setNewStaffForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Contoh: Rian Pratama, M.Pd."
                  className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Email Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaffForm.email}
                    onChange={(e) => setNewStaffForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="nama@arcibimbel.id"
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="0812-3456-7890"
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary text-body-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Peran Hak Akses (Role) *
                  </label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) =>
                      setNewStaffForm((prev) => ({ ...prev, role: e.target.value as StaffRoleType }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  >
                    <option value="tutor">Tutor Pengajar</option>
                    <option value="admin_akademik">Admin Akademik</option>
                    <option value="admin_keuangan">Admin Keuangan</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                    Password Awal *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.password}
                    onChange={(e) =>
                      setNewStaffForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft font-mono text-[12px] focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsNewStaffModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold text-body-sm hover:bg-brand-indigo-dark disabled:opacity-50 shadow-2xs"
                >
                  {isPending ? "Membuat Akun..." : "Buat Akun Staf"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UBAH ROLE STAF                                                   */}
      {/* ========================================================================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-light-surface rounded-2xl border border-light-outline-variant shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-light-outline-variant">
              <div>
                <h3 className="font-headline font-bold text-title-md text-light-on-surface">
                  Ubah Peran Hak Akses
                </h3>
                <p className="text-[12px] text-light-on-surface-variant font-mono">
                  {editingStaff.name} ({editingStaff.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="p-1 rounded-lg text-light-on-surface-variant hover:bg-light-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="flex flex-col gap-3.5 text-body-sm">
              <div>
                <label className="font-semibold block mb-1 text-[12px] text-light-on-surface">
                  Pilih Peran Baru (Role): *
                </label>
                <select
                  value={editingStaff.role}
                  onChange={(e) =>
                    setEditingStaff((prev) =>
                      prev ? { ...prev, role: e.target.value as StaffRoleType } : null
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-light-outline-variant bg-light-surface-soft text-body-sm focus:bg-light-surface focus:outline-none focus:ring-2 focus:ring-light-primary"
                >
                  <option value="super_admin">Super Admin (Akses Penuh)</option>
                  <option value="admin_akademik">Admin Akademik</option>
                  <option value="admin_keuangan">Admin Keuangan</option>
                  <option value="tutor">Tutor Pengajar</option>
                </select>
                <p className="text-[11px] text-light-on-surface-variant mt-1.5">
                  {STAFF_ROLE_CONFIG[editingStaff.role]?.description}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-light-outline-variant">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-lg border border-light-outline text-body-sm font-semibold hover:bg-light-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-light-primary text-light-on-primary font-semibold text-body-sm hover:bg-brand-indigo-dark disabled:opacity-50 shadow-2xs"
                >
                  {isPending ? "Menyimpan..." : "Simpan Peran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
