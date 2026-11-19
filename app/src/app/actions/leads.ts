"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ConsultationPayload {
  parentName: string;
  studentName: string;
  parentPhone: string;
  gradeLevel: string;
  learningMode: string;
  targetSubject?: string;
  notes?: string;
  captchaAnswer?: number;
  captchaExpected?: number;
}

export interface ConsultationResult {
  success: boolean;
  leadNumber?: string;
  message?: string;
}

export interface LeadItem {
  id: string;
  leadNumber: string;
  studentName: string;
  parentName: string;
  phone: string;
  email?: string | null;
  gradeLevel: string;
  branchName: string;
  branchId?: string | null;
  source: string;
  sourceIcon: string;
  stage: "baru" | "dihubungi" | "trial" | "siap" | "batal";
  stageLabel: string;
  stageColor: string;
  notes: string;
  createdAt: string;
  formattedDate: string;
  formattedTime: string;
  activities: { time: string; note: string }[];
}

export interface LeadsDataResult {
  success: boolean;
  leads: LeadItem[];
  stats: {
    total: number;
    baru: number;
    dihubungi: number;
    trial: number;
    siap: number;
    batal: number;
  };
  message?: string;
}

/**
 * Submit consultation request from website homepage into Supabase leads table
 */
export async function submitConsultationAction(
  payload: ConsultationPayload
): Promise<ConsultationResult> {
  try {
    if (!payload.parentName?.trim() || !payload.studentName?.trim() || !payload.parentPhone?.trim()) {
      return {
        success: false,
        message: "Nama orang tua, nama siswa, dan nomor WhatsApp wajib diisi.",
      };
    }

    // Validasi Math Captcha jika disertakan
    if (payload.captchaExpected !== undefined && payload.captchaAnswer !== undefined) {
      if (Number(payload.captchaAnswer) !== Number(payload.captchaExpected)) {
        return {
          success: false,
          message: "Verifikasi keamanan (captcha) tidak sesuai. Silakan hitung kembali.",
        };
      }
    }

    const supabase = createAdminClient();

    // Clean phone number
    let cleanPhone = payload.parentPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("62")) {
      cleanPhone = "62" + cleanPhone;
    }

    // Generate unique sequence lead number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const leadNumber = `LD-2026-${randomSuffix}`;

    // Resolve branch ID based on learningMode
    const { data: branches } = await supabase.from("branches").select("id, code, name");
    let targetBranchId: string | null = null;

    if (branches && branches.length > 0) {
      if (payload.learningMode?.includes("kebayoran")) {
        targetBranchId = branches.find((b) => b.code === "KBY")?.id || branches[0].id;
      } else if (payload.learningMode?.includes("online")) {
        targetBranchId = branches.find((b) => b.code === "ONL")?.id || branches[0].id;
      } else {
        targetBranchId = branches.find((b) => b.code === "SDR")?.id || branches[0].id;
      }
    }

    // Format initial consultation note
    const notesContent = `Permintaan Konsultasi Belajar Gratis:
Metode: ${payload.learningMode || "Offline / Online"}
Fokus Pelajaran: ${payload.targetSubject || "Semua Pelajaran"}
Catatan Wali: ${payload.notes || "Belum ada catatan tambahan"}`;

    const { error: insertErr } = await supabase.from("leads").insert({
      lead_number: leadNumber,
      student_name: payload.studentName.trim(),
      parent_name: payload.parentName.trim(),
      phone: cleanPhone,
      email: null,
      grade_level: payload.gradeLevel || "SMP",
      branch_id: targetBranchId,
      source: "Formulir Konsultasi Gratis",
      stage: "baru",
      notes: notesContent,
    });

    if (insertErr) {
      console.error("Error inserting consultation lead:", insertErr);
      return {
        success: false,
        message: `Gagal menyimpan permintaan konsultasi: ${insertErr.message}`,
      };
    }

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard");

    return {
      success: true,
      leadNumber,
      message: "Permintaan konsultasi berhasil dikirim!",
    };
  } catch (err: any) {
    console.error("Fatal error submitting consultation:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kendala pada server saat memproses konsultasi.",
    };
  }
}

/**
 * Fetch all leads from Supabase with branch join and DESC ordering
 */
export async function getLeadsDataAction(): Promise<LeadsDataResult> {
  try {
    const supabase = createAdminClient();

    const { data: leadsRows, error } = await supabase
      .from("leads")
      .select(`
        id,
        lead_number,
        student_name,
        parent_name,
        phone,
        email,
        grade_level,
        source,
        stage,
        notes,
        created_at,
        updated_at,
        branches (
          id,
          name,
          code,
          city
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
      return {
        success: false,
        leads: [],
        stats: { total: 0, baru: 0, dihubungi: 0, trial: 0, siap: 0, batal: 0 },
        message: error.message,
      };
    }

    const stageConfig: Record<
      string,
      { label: string; color: string }
    > = {
      baru: { label: "Lead Baru", color: "bg-accent text-on-accent" },
      dihubungi: { label: "Telah Dihubungi", color: "bg-warning text-on-warning" },
      trial: { label: "Jadwal Trial", color: "bg-blue-100 text-blue-900 border border-blue-200" },
      siap: { label: "Siap Mendaftar", color: "bg-success text-on-success" },
      batal: { label: "Batal / Ditunda", color: "bg-danger/10 text-danger border border-danger/20" },
    };

    const sourceIconMap: Record<string, string> = {
      "Formulir Konsultasi Gratis": "contact_support",
      "Website Pendaftaran Online": "language",
      "WhatsApp Chat": "chat",
      "Walk-in Cabang": "storefront",
      Referral: "group",
    };

    const leads: LeadItem[] = (leadsRows || []).map((row: any) => {
      const createdDate = row.created_at ? new Date(row.created_at) : new Date();
      const formattedDate = createdDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const formattedTime = createdDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).replace(".", ":") + " WIB";

      const branch = row.branches;
      const stageKey = (row.stage in stageConfig ? row.stage : "baru") as LeadItem["stage"];
      const stageMeta = stageConfig[stageKey];

      // Parse structured notes and activities
      const rawNotes = row.notes || "";
      const noteLines = rawNotes.split("\n");
      const activities: { time: string; note: string }[] = [];

      activities.push({
        time: `${formattedDate} • ${formattedTime} • Sistem Otomatis`,
        note: `Calon siswa masuk melalui ${row.source || "Website"}.`,
      });

      for (const line of noteLines) {
        if (line.startsWith("[") && line.includes("]")) {
          const match = line.match(/^\[(.*?)\]\s*(.*)$/);
          if (match) {
            activities.unshift({
              time: `${match[1]} • Staf Internal`,
              note: match[2],
            });
          }
        }
      }

      return {
        id: row.id,
        leadNumber: row.lead_number,
        studentName: row.student_name,
        parentName: row.parent_name,
        phone: row.phone,
        email: row.email,
        gradeLevel: row.grade_level,
        branchName: branch ? branch.name : "Cabang Pusat",
        branchId: branch?.id || null,
        source: row.source || "Website",
        sourceIcon: sourceIconMap[row.source] || "contact_support",
        stage: stageKey,
        stageLabel: stageMeta.label,
        stageColor: stageMeta.color,
        notes: rawNotes,
        createdAt: row.created_at || new Date().toISOString(),
        formattedDate,
        formattedTime,
        activities,
      };
    });

    // Ensure sorted strictly DESC by created_at
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const stats = {
      total: leads.length,
      baru: leads.filter((l) => l.stage === "baru").length,
      dihubungi: leads.filter((l) => l.stage === "dihubungi").length,
      trial: leads.filter((l) => l.stage === "trial").length,
      siap: leads.filter((l) => l.stage === "siap").length,
      batal: leads.filter((l) => l.stage === "batal").length,
    };

    return {
      success: true,
      leads,
      stats,
    };
  } catch (err: any) {
    console.error("Fatal error fetching leads:", err);
    return {
      success: false,
      leads: [],
      stats: { total: 0, baru: 0, dihubungi: 0, trial: 0, siap: 0, batal: 0 },
      message: err?.message || "Terjadi kesalahan saat memuat data leads.",
    };
  }
}

/**
 * Update lead pipeline stage in Supabase
 */
export async function updateLeadStageAction(
  leadId: string,
  newStage: "baru" | "dihubungi" | "trial" | "siap" | "batal"
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("leads")
      .update({
        stage: newStage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

/**
 * Add a follow-up activity note to lead
 */
export async function addLeadActivityNoteAction(
  leadId: string,
  noteText: string
): Promise<{ success: boolean; message?: string }> {
  try {
    if (!noteText?.trim()) {
      return { success: false, message: "Catatan tidak boleh kosong." };
    }

    const supabase = createAdminClient();

    const { data: lead } = await supabase
      .from("leads")
      .select("notes")
      .eq("id", leadId)
      .single();

    const timestamp = new Date().toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedNotes = `${lead?.notes || ""}\n[${timestamp}] ${noteText.trim()}`;

    const { error } = await supabase
      .from("leads")
      .update({
        notes: updatedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}
