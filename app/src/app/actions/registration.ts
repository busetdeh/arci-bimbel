"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface BranchOption {
  id: string;
  name: string;
  code: string;
  city: string;
  address?: string | null;
  phone?: string | null;
}

export interface ProgramOption {
  id: string;
  name: string;
  code: string;
  level: "SD" | "SMP" | "SMA" | "UTBK" | "Privat";
  description?: string | null;
  price_monthly: number;
  price_total?: number | null;
  is_featured?: boolean;
}

export interface RegistrationPayload {
  // Step 1: Parent
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentEmail?: string;
  parentCity: string;
  parentAddress?: string;

  // Step 2: Student
  studentName: string;
  studentSchool: string;
  studentGrade: string;
  studentTarget: string;
  studentNotes?: string;

  // Step 3: Program & Branch Selection
  branchId: string;
  programId: string;
  scheduleDays: string;
  scheduleTime: string;

  // Step 4: Confirmation
  agreeTerms: boolean;
  captchaAnswer?: number;
  captchaExpected?: number;
}

export interface RegistrationResult {
  success: boolean;
  registrationNumber?: string;
  invoiceNumber?: string;
  leadNumber?: string;
  studentName?: string;
  parentName?: string;
  programName?: string;
  branchName?: string;
  scheduleTitle?: string;
  totalAmount?: number;
  message?: string;
}

/**
 * Fetch dynamic active branches and programs from Supabase
 */
export async function getRegistrationOptions(): Promise<{
  branches: BranchOption[];
  programs: ProgramOption[];
}> {
  try {
    const supabase = createAdminClient();

    const [branchRes, progRes] = await Promise.all([
      supabase
        .from("branches")
        .select("id, name, code, city, address, phone")
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase
        .from("programs")
        .select("id, name, code, level, description, price_monthly, price_total, is_featured")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true }),
    ]);

    return {
      branches: (branchRes.data as BranchOption[]) || [],
      programs: (progRes.data as ProgramOption[]) || [],
    };
  } catch (err) {
    console.error("Error fetching registration options:", err);
    return { branches: [], programs: [] };
  }
}

/**
 * Submit online registration into Supabase:
 * Creates student, parent, student_parents relationship, lead CRM entry, invoice, and enrollment
 */
export async function submitRegistrationAction(
  payload: RegistrationPayload
): Promise<RegistrationResult> {
  try {
    // 1. Strict validation: All fields are required
    if (
      !payload.parentName?.trim() ||
      !payload.parentPhone?.trim() ||
      !payload.parentEmail?.trim() ||
      !payload.parentCity?.trim() ||
      !payload.parentRelation?.trim()
    ) {
      return {
        success: false,
        message: "Seluruh kolom Data Orang Tua / Wali wajib diisi lengkap.",
      };
    }

    if (
      !payload.studentName?.trim() ||
      !payload.studentSchool?.trim() ||
      !payload.studentGrade?.trim() ||
      !payload.studentTarget?.trim() ||
      !payload.studentNotes?.trim()
    ) {
      return {
        success: false,
        message: "Seluruh kolom Data Calon Siswa dan Catatan Belajar wajib diisi lengkap.",
      };
    }

    if (!payload.branchId || !payload.programId || !payload.scheduleDays || !payload.scheduleTime) {
      return {
        success: false,
        message: "Silakan pilih lokasi cabang, paket program, dan preferensi jadwal belajar.",
      };
    }

    if (!payload.agreeTerms) {
      return {
        success: false,
        message: "Silakan setujui syarat dan ketentuan pendaftaran terlebih dahulu.",
      };
    }

    // Validasi Math Captcha jika dikirimkan
    if (payload.captchaExpected !== undefined && payload.captchaAnswer !== undefined) {
      if (Number(payload.captchaAnswer) !== Number(payload.captchaExpected)) {
        return {
          success: false,
          message: "Verifikasi keamanan (captcha) tidak valid. Silakan hitung kembali.",
        };
      }
    }

    const supabase = createAdminClient();

    // 2. Fetch selected program & branch details for accurate pricing and titles
    const [progRes, branchRes] = await Promise.all([
      supabase.from("programs").select("*").eq("id", payload.programId).single(),
      supabase.from("branches").select("*").eq("id", payload.branchId).single(),
    ]);

    if (!progRes.data) {
      return { success: false, message: "Paket program yang dipilih tidak valid." };
    }
    if (!branchRes.data) {
      return { success: false, message: "Cabang yang dipilih tidak valid." };
    }

    const program = progRes.data;
    const branch = branchRes.data;

    // Pricing calculation
    const registrationFee = 150000;
    const monthlyPrice = Number(program.price_monthly) || 950000;
    const totalAmount = monthlyPrice + registrationFee;

    // Generate unique registration sequence numbers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regCode = `ARC-2026-${randomSuffix}`;
    const invNumber = `INV-2026-${randomSuffix}`;
    const leadNumber = `LEAD-2026-${randomSuffix}`;
    const generatedNisn = `26${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Normalize phone number (strip whitespace and formatting)
    let cleanPhone = payload.parentPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("62")) {
      cleanPhone = "62" + cleanPhone;
    }

    // 3. Insert Parent Record
    const { data: parent, error: parentErr } = await supabase
      .from("parents")
      .insert({
        full_name: payload.parentName.trim(),
        phone: cleanPhone,
        address: `${payload.parentCity}${payload.parentAddress ? `, ${payload.parentAddress}` : ""}`,
        occupation: payload.parentRelation || "Orang Tua / Wali",
      })
      .select("id")
      .single();

    if (parentErr || !parent) {
      console.error("Error creating parent record:", parentErr);
      return { success: false, message: `Gagal menyimpan data orang tua: ${parentErr?.message}` };
    }

    // 4. Insert Student Record
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .insert({
        nisn: generatedNisn,
        full_name: payload.studentName.trim(),
        school_origin: payload.studentSchool.trim(),
        current_grade: payload.studentGrade || "SMP Kelas 8",
        target_university: payload.studentTarget || null,
        target_major: payload.studentNotes || null,
        status: "active",
      })
      .select("id")
      .single();

    if (studentErr || !student) {
      console.error("Error creating student record:", studentErr);
      return { success: false, message: `Gagal menyimpan data siswa: ${studentErr?.message}` };
    }

    // 5. Link Student & Parent
    await supabase.from("student_parents").insert({
      student_id: student.id,
      parent_id: parent.id,
      relationship: payload.parentRelation || "Orang Tua / Wali",
      is_primary_contact: true,
    });

    // 6. Insert CRM Lead Record (Instantly visible in Admissions & Leads Dashboard)
    const leadNotes = `Pendaftaran Baru Online:
Program: ${program.name} (${program.code})
Cabang: ${branch.name}
Jadwal: ${payload.scheduleDays} - ${payload.scheduleTime}
Target: ${payload.studentTarget}
Catatan Tambahan: ${payload.studentNotes || "-"}`;

    await supabase.from("leads").insert({
      lead_number: leadNumber,
      student_name: payload.studentName.trim(),
      parent_name: payload.parentName.trim(),
      phone: cleanPhone,
      email: payload.parentEmail?.trim() || null,
      grade_level: payload.studentGrade || program.level,
      branch_id: branch.id,
      source: "Website Pendaftaran Online",
      stage: "baru",
      notes: leadNotes,
    });

    // 7. Insert Initial Invoice (Registration fee + First month tuition)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3); // 3 days payment window

    await supabase.from("invoices").insert({
      invoice_number: invNumber,
      student_id: student.id,
      parent_id: parent.id,
      amount: totalAmount,
      month_period: "Pendaftaran 2026/2027 & SPP Awal",
      description: `Biaya Pendaftaran + SPP Pertama (${program.name} - ${branch.name})`,
      due_date: dueDate.toISOString().split("T")[0],
      status: "unpaid",
    });

    // 8. Insert Enrollment Record (Pending verification)
    await supabase.from("enrollments").insert({
      registration_number: regCode,
      student_id: student.id,
      status: "pending",
      onboarding_checklist: {
        identity_verified: true,
        class_assigned: false,
        payment_verified: false,
        portal_account_created: false,
      },
    });

    // Revalidate dashboard pipelines so new registration appears in real-time
    revalidatePath("/dashboard/admissions");
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard/finance");

    return {
      success: true,
      registrationNumber: regCode,
      invoiceNumber: invNumber,
      leadNumber: leadNumber,
      studentName: payload.studentName.trim(),
      parentName: payload.parentName.trim(),
      programName: program.name,
      branchName: branch.name,
      scheduleTitle: `${payload.scheduleDays} (${payload.scheduleTime})`,
      totalAmount: totalAmount,
    };
  } catch (err: any) {
    console.error("Unhandled error in submitRegistrationAction:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kendala saat memproses pendaftaran. Silakan coba kembali.",
    };
  }
}
