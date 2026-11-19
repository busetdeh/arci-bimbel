"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface AdmissionItem {
  id: string; // enrollment id
  registrationNumber: string;
  studentId: string;
  studentName: string;
  nisn?: string | null;
  schoolOrigin: string;
  currentGrade: string;
  targetGoal: string;
  targetNotes: string;
  parentName: string;
  parentPhone: string;
  parentAddress: string;
  parentRelation: string;
  programName: string;
  programCode: string;
  branchName: string;
  branchCode: string;
  classId: string | null;
  className: string;
  classSchedule: string;
  invoiceNumber: string;
  totalFee: number;
  invoiceStatus: "unpaid" | "paid" | "cancelled";
  createdAt: string;
  enrolledAt: string;
  enrolledTime: string;
  status: "pending" | "active" | "completed" | "dropped";
  stage: "verify" | "payment" | "active";
  stageLabel: string;
  stageBadge: string;
  checklist: [boolean, boolean, boolean, boolean]; // [identity, class, payment, portal]
  fileName: string;
}

export interface AvailableClassOption {
  id: string;
  code: string;
  name: string;
  programName: string;
  branchName: string;
  schedule: string;
  room: string;
  capacity: number;
}

export interface AdmissionsDataResult {
  success: boolean;
  registrations: AdmissionItem[];
  availableClasses: AvailableClassOption[];
  stats: {
    total: number;
    verify: number;
    payment: number;
    active: number;
  };
  message?: string;
}

/**
 * Fetch all admissions & registration funnel entries from Supabase
 */
export async function getAdmissionsDataAction(): Promise<AdmissionsDataResult> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch enrollments with student, class, branch, program
    const { data: enrollments, error: enrollErr } = await supabase
      .from("enrollments")
      .select(`
        id,
        registration_number,
        student_id,
        class_id,
        enrolled_at,
        status,
        onboarding_checklist,
        created_at,
        students (
          id,
          nisn,
          full_name,
          school_origin,
          current_grade,
          target_university,
          target_major,
          student_parents (
            relationship,
            is_primary_contact,
            parents (
              id,
              full_name,
              phone,
              address
            )
          )
        ),
        classes (
          id,
          code,
          name,
          room,
          capacity,
          schedule_days,
          schedule_time,
          programs (
            id,
            name,
            code,
            price_monthly
          ),
          branches (
            id,
            name,
            code,
            city
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (enrollErr) {
      console.error("Error fetching enrollments:", enrollErr);
      return {
        success: false,
        registrations: [],
        availableClasses: [],
        stats: { total: 0, verify: 0, payment: 0, active: 0 },
        message: enrollErr.message,
      };
    }

    // 2. Fetch all invoices for fee details
    const { data: invoices } = await supabase
      .from("invoices")
      .select("id, invoice_number, student_id, amount, status, due_date");

    const invoiceMap = new Map<string, { invoice_number: string; amount: number; status: string }>();
    if (invoices) {
      for (const inv of invoices) {
        invoiceMap.set(inv.student_id, {
          invoice_number: inv.invoice_number,
          amount: Number(inv.amount),
          status: inv.status,
        });
      }
    }

    // 3. Fetch available active classes for assignment dropdown
    const { data: classesData } = await supabase
      .from("classes")
      .select(`
        id,
        code,
        name,
        room,
        capacity,
        schedule_days,
        schedule_time,
        programs ( name ),
        branches ( name )
      `)
      .eq("status", "active")
      .order("name", { ascending: true });

    const availableClasses: AvailableClassOption[] = (classesData || []).map((c: any) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      programName: c.programs?.name || "Program Reguler",
      branchName: c.branches?.name || "Cabang Pusat",
      schedule: `${c.schedule_days} (${c.schedule_time})`,
      room: c.room,
      capacity: c.capacity,
    }));

    // 4. Map enrollments into unified AdmissionItem array
    const registrations: AdmissionItem[] = (enrollments || []).map((e: any) => {
      const student = e.students;
      const primaryParentRelation = student?.student_parents?.[0];
      const parent = primaryParentRelation?.parents;

      const cls = e.classes;
      const program = cls?.programs;
      const branch = cls?.branches;

      const invoice = student?.id ? invoiceMap.get(student.id) : undefined;
      const invStatus = (invoice?.status as "unpaid" | "paid" | "cancelled") || "unpaid";
      const totalAmount = invoice?.amount || 1100000;
      const invNumber = invoice?.invoice_number || `INV-${e.registration_number.replace("ARC-", "")}`;

      const checklistObj = e.onboarding_checklist || {};
      const c1 = Boolean(checklistObj.identity_verified ?? true);
      const c2 = Boolean(checklistObj.class_assigned ?? Boolean(e.class_id));
      const c3 = Boolean(checklistObj.payment_verified ?? (invStatus === "paid"));
      const c4 = Boolean(checklistObj.portal_account_created ?? (e.status === "active"));

      // Determine stage
      let stage: "verify" | "payment" | "active" = "verify";
      let stageLabel = "Perlu Verifikasi";
      let stageBadge = "bg-accent text-on-accent";

      if (e.status === "active") {
        stage = "active";
        stageLabel = "Diterima & Aktif";
        stageBadge = "bg-success text-on-success";
      } else if (c1 && c2 && !c3) {
        stage = "payment";
        stageLabel = "Menunggu Pembayaran";
        stageBadge = "bg-warning text-on-warning";
      } else if (!c1 || !c2) {
        stage = "verify";
        stageLabel = "Perlu Verifikasi";
        stageBadge = "bg-accent text-on-accent";
      }

      // Format enrolled date and time (WIB / Local Indonesia)
      const createdDate = e.created_at ? new Date(e.created_at) : new Date();
      const dateStr = createdDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timeStr = createdDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).replace(".", ":") + " WIB";

      // File name display
      const cleanStudentName = student?.full_name?.split(" ")[0] || "Siswa";
      const fileName = `Rapor_${cleanStudentName}_2026.pdf`;

      return {
        id: e.id,
        registrationNumber: e.registration_number,
        studentId: student?.id || "",
        studentName: student?.full_name || "Calon Siswa",
        nisn: student?.nisn || null,
        schoolOrigin: student?.school_origin || "Belum dicantumkan",
        currentGrade: student?.current_grade || "SMP/SMA",
        targetGoal: student?.target_university || "Target Nilai Optimal",
        targetNotes: student?.target_major || "-",
        parentName: parent?.full_name || "Wali Murid",
        parentPhone: parent?.phone || "0812-0000-0000",
        parentAddress: parent?.address || "Jakarta",
        parentRelation: primaryParentRelation?.relationship || "Orang Tua / Wali",
        programName: program?.name || "Program Bimbingan Belajar",
        programCode: program?.code || "ARCI-REG",
        branchName: branch?.name || "Cabang Terdekat",
        branchCode: branch?.code || "CAB",
        classId: e.class_id || null,
        className: cls?.name || "Belum Ditempatkan",
        classSchedule: cls ? `${cls.schedule_days} (${cls.schedule_time})` : "Menunggu Alokasi",
        invoiceNumber: invNumber,
        totalFee: totalAmount,
        invoiceStatus: invStatus,
        createdAt: e.created_at || new Date().toISOString(),
        enrolledAt: dateStr,
        enrolledTime: timeStr,
        status: e.status,
        stage,
        stageLabel,
        stageBadge,
        checklist: [c1, c2, c3, c4],
        fileName,
      };
    });

    // Explicitly guarantee sorting DESC by created_at (most recent first)
    registrations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const stats = {
      total: registrations.length,
      verify: registrations.filter((r) => r.stage === "verify").length,
      payment: registrations.filter((r) => r.stage === "payment").length,
      active: registrations.filter((r) => r.stage === "active").length,
    };

    return {
      success: true,
      registrations,
      availableClasses,
      stats,
    };
  } catch (err: any) {
    console.error("Fatal error in getAdmissionsDataAction:", err);
    return {
      success: false,
      registrations: [],
      availableClasses: [],
      stats: { total: 0, verify: 0, payment: 0, active: 0 },
      message: err?.message || "Terjadi kesalahan internal server.",
    };
  }
}

/**
 * Toggle individual onboarding checklist item on enrollment
 */
export async function toggleAdmissionChecklistAction(
  enrollmentId: string,
  index: number,
  currentValue: boolean
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createAdminClient();

    // 1. Get current checklist
    const { data: enrollment, error: fetchErr } = await supabase
      .from("enrollments")
      .select("id, status, onboarding_checklist, student_id")
      .eq("id", enrollmentId)
      .single();

    if (fetchErr || !enrollment) {
      return { success: false, message: "Pendaftaran tidak ditemukan." };
    }

    const currentChecklist = enrollment.onboarding_checklist || {
      identity_verified: true,
      class_assigned: false,
      payment_verified: false,
      portal_account_created: false,
    };

    const keys = [
      "identity_verified",
      "class_assigned",
      "payment_verified",
      "portal_account_created",
    ] as const;

    const targetKey = keys[index];
    const newValue = !currentValue;
    currentChecklist[targetKey] = newValue;

    // Check if all 4 are true
    const allChecked =
      currentChecklist.identity_verified &&
      currentChecklist.class_assigned &&
      currentChecklist.payment_verified &&
      currentChecklist.portal_account_created;

    const newStatus = allChecked ? "active" : enrollment.status === "active" ? "pending" : enrollment.status;

    // 2. Update enrollment
    const { error: updateErr } = await supabase
      .from("enrollments")
      .update({
        onboarding_checklist: currentChecklist,
        status: newStatus,
      })
      .eq("id", enrollmentId);

    if (updateErr) {
      return { success: false, message: updateErr.message };
    }

    // If payment verified was checked, update invoice status
    if (targetKey === "payment_verified") {
      await supabase
        .from("invoices")
        .update({ status: newValue ? "paid" : "unpaid" })
        .eq("student_id", enrollment.student_id);
    }

    revalidatePath("/dashboard/admissions");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/finance");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

/**
 * Approve registration: Assigns class, verifies checklist, sets status to 'active' & invoice to 'paid'
 */
export async function approveAdmissionAction(
  enrollmentId: string,
  classId?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createAdminClient();

    const { data: enrollment, error: fetchErr } = await supabase
      .from("enrollments")
      .select("id, student_id, class_id")
      .eq("id", enrollmentId)
      .single();

    if (fetchErr || !enrollment) {
      return { success: false, message: "Pendaftaran tidak ditemukan." };
    }

    const assignedClassId = classId || enrollment.class_id;

    // Update enrollment to active with full checklist
    const { error: enrollErr } = await supabase
      .from("enrollments")
      .update({
        status: "active",
        class_id: assignedClassId,
        onboarding_checklist: {
          identity_verified: true,
          class_assigned: true,
          payment_verified: true,
          portal_account_created: true,
        },
      })
      .eq("id", enrollmentId);

    if (enrollErr) {
      return { success: false, message: enrollErr.message };
    }

    // Mark invoice as paid
    if (enrollment.student_id) {
      await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("student_id", enrollment.student_id);

      await supabase
        .from("students")
        .update({ status: "active" })
        .eq("id", enrollment.student_id);
    }

    revalidatePath("/dashboard/admissions");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

/**
 * Assign or change class allocation for an enrollment
 */
export async function assignEnrollmentClassAction(
  enrollmentId: string,
  classId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createAdminClient();

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("onboarding_checklist")
      .eq("id", enrollmentId)
      .single();

    const currentChecklist = enrollment?.onboarding_checklist || {};
    currentChecklist.class_assigned = true;

    const { error } = await supabase
      .from("enrollments")
      .update({
        class_id: classId,
        onboarding_checklist: currentChecklist,
      })
      .eq("id", enrollmentId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/admissions");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

/**
 * Record a revision request note on the student's lead / enrollment
 */
export async function requestAdmissionRevisionAction(
  enrollmentId: string,
  revisionNote: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createAdminClient();

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("student_id, registration_number")
      .eq("id", enrollmentId)
      .single();

    if (enrollment?.student_id) {
      // Find matching lead and append note
      const { data: student } = await supabase
        .from("students")
        .select("full_name")
        .eq("id", enrollment.student_id)
        .single();

      if (student?.full_name) {
        const { data: lead } = await supabase
          .from("leads")
          .select("id, notes")
          .eq("student_name", student.full_name)
          .maybeSingle();

        if (lead) {
          const timestamp = new Date().toLocaleString("id-ID");
          const updatedNotes = `${lead.notes || ""}\n[${timestamp}] REVISI BERKAS DIMINTA: ${revisionNote}`;
          await supabase
            .from("leads")
            .update({ notes: updatedNotes, stage: "kontak" })
            .eq("id", lead.id);
        }
      }
    }

    revalidatePath("/dashboard/admissions");
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}
