"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  FinanceInvoice,
  FinanceStats,
  FinanceDataResult,
  StudentOption,
  INVOICE_STATUS_CONFIG,
  formatRupiah,
  InvoiceStatusType,
} from "@/lib/finance-constants";

/**
 * Fetch all invoices with students, parents, and payments from Supabase
 * Ordered chronologically DESC
 */
export async function getFinanceDataAction(): Promise<FinanceDataResult> {
  try {
    const supabase = createAdminClient();

    // Query invoices with joined student, parent, and payment data
    const { data: rawInvoices, error: invError } = await supabase
      .from("invoices")
      .select(`
        id,
        invoice_number,
        student_id,
        parent_id,
        amount,
        month_period,
        description,
        due_date,
        status,
        created_at,
        students (
          id,
          full_name,
          current_grade,
          school_origin
        ),
        parents (
          id,
          full_name,
          phone,
          address
        ),
        payments (
          id,
          amount,
          payment_method,
          receipt_url,
          status,
          verified_by,
          verified_at,
          rejection_reason,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (invError) {
      console.error("Error fetching finance invoices from Supabase:", invError);
      return {
        success: false,
        invoices: [],
        stats: {
          totalRevenue: 0,
          paidCount: 0,
          pendingReviewCount: 0,
          pendingReviewAmount: 0,
          unpaidCount: 0,
          unpaidAmount: 0,
          overdueCount: 0,
          overdueAmount: 0,
        },
        message: invError.message,
      };
    }

    const todayStr = new Date().toISOString().split("T")[0];

    let totalRevenue = 0;
    let paidCount = 0;
    let pendingReviewCount = 0;
    let pendingReviewAmount = 0;
    let unpaidCount = 0;
    let unpaidAmount = 0;
    let overdueCount = 0;
    let overdueAmount = 0;

    const formattedInvoices: FinanceInvoice[] = (rawInvoices || []).map((row: any) => {
      const student = Array.isArray(row.students) ? row.students[0] : row.students;
      const parent = Array.isArray(row.parents) ? row.parents[0] : row.parents;
      const paymentsList = Array.isArray(row.payments) ? row.payments : [];

      // Sort payments newest first
      paymentsList.sort(
        (a: any, b: any) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      const latestPayment = paymentsList[0];

      const rawAmount = Number(row.amount) || 0;
      const rawDueDate = row.due_date || "";

      // Determine effective invoice status
      let effectiveStatus: InvoiceStatusType = "unpaid";
      if (row.status === "paid") {
        effectiveStatus = "paid";
      } else if (
        row.status === "verify" ||
        (latestPayment && latestPayment.status === "pending")
      ) {
        effectiveStatus = "verify";
      } else if (row.status === "cancelled") {
        effectiveStatus = "cancelled";
      } else if (rawDueDate && rawDueDate < todayStr) {
        effectiveStatus = "overdue";
      } else {
        effectiveStatus = "unpaid";
      }

      // Aggregate Stats
      if (effectiveStatus === "paid") {
        totalRevenue += rawAmount;
        paidCount++;
      } else if (effectiveStatus === "verify") {
        pendingReviewAmount += rawAmount;
        pendingReviewCount++;
      } else if (effectiveStatus === "overdue") {
        overdueAmount += rawAmount;
        overdueCount++;
      } else if (effectiveStatus === "unpaid") {
        unpaidAmount += rawAmount;
        unpaidCount++;
      }

      // Date formatting (Indonesian Locale)
      const createdAtDate = new Date(row.created_at);
      const formattedCreated = isNaN(createdAtDate.getTime())
        ? "-"
        : createdAtDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

      const dueDateObj = new Date(rawDueDate);
      const formattedDue = isNaN(dueDateObj.getTime())
        ? "-"
        : dueDateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

      const statusConf =
        INVOICE_STATUS_CONFIG[effectiveStatus] || INVOICE_STATUS_CONFIG.unpaid;

      const paymentMethod =
        latestPayment?.payment_method ||
        (effectiveStatus === "paid"
          ? "Transfer Bank"
          : "Transfer Bank BCA / Mandiri");

      return {
        id: row.id,
        invoiceNumber: row.invoice_number,
        studentId: row.student_id,
        studentName: student?.full_name || "Siswa Bimbel",
        studentGrade: student?.current_grade || "Reguler",
        parentId: row.parent_id,
        parentName: parent?.full_name || "Wali Murid",
        parentPhone: parent?.phone || "0812-0000-0000",
        program: row.description || row.month_period || "Paket Bimbel Reguler",
        description: row.description || "-",
        monthPeriod: row.month_period || "-",
        amount: formatRupiah(rawAmount),
        rawAmount,
        date: formattedCreated,
        rawCreatedAt: row.created_at,
        dueDate: formattedDue,
        rawDueDate,
        status: effectiveStatus,
        statusLabel: statusConf.label,
        statusBadge: statusConf.badge,
        method: paymentMethod,
        receiptFile: latestPayment?.receipt_url || undefined,
        paymentId: latestPayment?.id || undefined,
        paymentStatus: latestPayment?.status || undefined,
        verifiedAt: latestPayment?.verified_at || null,
        rejectionReason: latestPayment?.rejection_reason || null,
      };
    });

    const stats: FinanceStats = {
      totalRevenue,
      paidCount,
      pendingReviewCount,
      pendingReviewAmount,
      unpaidCount,
      unpaidAmount,
      overdueCount,
      overdueAmount,
    };

    return {
      success: true,
      invoices: formattedInvoices,
      stats,
    };
  } catch (err: any) {
    console.error("Unhandled error in getFinanceDataAction:", err);
    return {
      success: false,
      invoices: [],
      stats: {
        totalRevenue: 0,
        paidCount: 0,
        pendingReviewCount: 0,
        pendingReviewAmount: 0,
        unpaidCount: 0,
        unpaidAmount: 0,
        overdueCount: 0,
        overdueAmount: 0,
      },
      message: err?.message || "Terjadi kendala saat memuat data keuangan.",
    };
  }
}

/**
 * Approve payment and mark invoice as paid, sync to enrollment checklist and audit log
 */
export async function approvePaymentAction(
  invoiceId: string,
  paymentMethod?: string,
  verifiedNotes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch current invoice
    const { data: inv, error: fetchErr } = await supabase
      .from("invoices")
      .select("id, invoice_number, student_id, amount")
      .eq("id", invoiceId)
      .single();

    if (fetchErr || !inv) {
      return { success: false, message: "Tagihan tidak ditemukan di database." };
    }

    const nowIso = new Date().toISOString();

    // 2. Update invoice status to 'paid'
    const { error: updateInvErr } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", invoiceId);

    if (updateInvErr) {
      return {
        success: false,
        message: `Gagal memperbarui status invoice: ${updateInvErr.message}`,
      };
    }

    // 3. Update or Insert Payment Record
    const { data: existingPayments } = await supabase
      .from("payments")
      .select("id, status")
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: false });

    if (existingPayments && existingPayments.length > 0) {
      // Update pending payment
      await supabase
        .from("payments")
        .update({
          status: "approved",
          verified_at: nowIso,
          rejection_reason: null,
        })
        .eq("id", existingPayments[0].id);
    } else {
      // Create approved payment record
      await supabase.from("payments").insert({
        invoice_id: invoiceId,
        amount: inv.amount,
        payment_method: paymentMethod || "Transfer Bank",
        receipt_url: `Kwitansi_Resmi_ARCI_${inv.invoice_number}.pdf`,
        status: "approved",
        verified_at: nowIso,
      });
    }

    // 4. Update enrollment payment checklist if applicable
    if (inv.student_id) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id, onboarding_checklist")
        .eq("student_id", inv.student_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (enrollment) {
        const currentChecklist = enrollment.onboarding_checklist || {};
        await supabase
          .from("enrollments")
          .update({
            onboarding_checklist: {
              ...currentChecklist,
              payment_verified: true,
            },
          })
          .eq("id", enrollment.id);
      }
    }

    // 5. Audit Log
    await supabase.from("audit_logs").insert({
      action: "PAYMENT_APPROVED",
      entity_type: "invoices",
      entity_id: invoiceId,
      details: {
        invoice_number: inv.invoice_number,
        amount: inv.amount,
        notes: verifiedNotes || "Pembayaran diverifikasi oleh Staf Keuangan",
        timestamp: nowIso,
      },
    });

    // Revalidate affected routes
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/admissions");
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Pembayaran ${inv.invoice_number} berhasil disetujui & kuitansi resmi telah diterbitkan.`,
    };
  } catch (err: any) {
    console.error("Error in approvePaymentAction:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kesalahan saat memverifikasi pembayaran.",
    };
  }
}

/**
 * Reject payment proof and set invoice back to unpaid
 */
export async function rejectPaymentAction(
  invoiceId: string,
  rejectionReason: string,
  paymentId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!rejectionReason?.trim()) {
      return { success: false, message: "Silakan masukkan alasan penolakan bukti bayar." };
    }

    const supabase = createAdminClient();

    // 1. Update invoice status back to 'unpaid'
    const { data: inv, error: invErr } = await supabase
      .from("invoices")
      .update({ status: "unpaid" })
      .eq("id", invoiceId)
      .select("invoice_number")
      .single();

    if (invErr || !inv) {
      return { success: false, message: "Gagal memperbarui status invoice." };
    }

    // 2. Update payment status to rejected
    if (paymentId) {
      await supabase
        .from("payments")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason.trim(),
        })
        .eq("id", paymentId);
    } else {
      await supabase
        .from("payments")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason.trim(),
        })
        .eq("invoice_id", invoiceId);
    }

    // 3. Audit Log
    await supabase.from("audit_logs").insert({
      action: "PAYMENT_REJECTED",
      entity_type: "invoices",
      entity_id: invoiceId,
      details: {
        invoice_number: inv.invoice_number,
        reason: rejectionReason.trim(),
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/finance");

    return {
      success: true,
      message: `Bukti transfer ${inv.invoice_number} ditolak. Notifikasi perbaikan telah dikirim ke wali murid.`,
    };
  } catch (err: any) {
    console.error("Error in rejectPaymentAction:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kesalahan saat menolak bukti pembayaran.",
    };
  }
}

/**
 * Fetch active students list to create new manual invoices
 */
export async function getStudentOptionsAction(): Promise<StudentOption[]> {
  try {
    const supabase = createAdminClient();

    const { data: students, error } = await supabase
      .from("students")
      .select(`
        id,
        full_name,
        current_grade,
        student_parents (
          parent_id,
          parents (
            id,
            full_name,
            phone
          )
        )
      `)
      .order("full_name", { ascending: true });

    if (error || !students) return [];

    return students.map((s: any) => {
      const sp = Array.isArray(s.student_parents) ? s.student_parents[0] : s.student_parents;
      const parent = Array.isArray(sp?.parents) ? sp.parents[0] : sp?.parents;
      return {
        id: s.id,
        name: s.full_name,
        grade: s.current_grade || "Siswa Aktif",
        parentId: parent?.id || "",
        parentName: parent?.full_name || "Wali Murid",
        parentPhone: parent?.phone || "-",
      };
    });
  } catch {
    return [];
  }
}

/**
 * Create a new manual invoice (e.g. SPP Bulan Depan, Modul Buku, Ujian Try Out)
 */
export async function createManualInvoiceAction(payload: {
  studentId: string;
  parentId?: string;
  amount: number;
  monthPeriod: string;
  description: string;
  dueDate: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    if (!payload.studentId || !payload.amount || !payload.dueDate) {
      return { success: false, message: "Siswa, nominal tagihan, dan tanggal jatuh tempo wajib diisi." };
    }

    const supabase = createAdminClient();

    // If parentId not provided, look it up
    let pId = payload.parentId;
    if (!pId) {
      const { data: sp } = await supabase
        .from("student_parents")
        .select("parent_id")
        .eq("student_id", payload.studentId)
        .limit(1)
        .single();
      pId = sp?.parent_id;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-2026-${randomSuffix}`;

    const { error: insErr } = await supabase.from("invoices").insert({
      invoice_number: invoiceNumber,
      student_id: payload.studentId,
      parent_id: pId || null,
      amount: payload.amount,
      month_period: payload.monthPeriod || "Tagihan Berkala 2026",
      description: payload.description || "SPP Bimbel ARCI",
      due_date: payload.dueDate,
      status: "unpaid",
    });

    if (insErr) {
      return { success: false, message: `Gagal membuat invoice: ${insErr.message}` };
    }

    revalidatePath("/dashboard/finance");
    return {
      success: true,
      message: `Invoice baru ${invoiceNumber} berhasil diterbitkan sebesar ${formatRupiah(payload.amount)}.`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal membuat invoice baru." };
  }
}
