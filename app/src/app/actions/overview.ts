"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  DashboardOverviewResult,
  DashboardOverviewStats,
  UrgentTaskItem,
  DashboardClassSessionItem,
  formatRupiahShort,
} from "@/lib/overview-constants";

/**
 * Fetch executive dashboard overview data, live KPIs, and urgent task queues
 */
export async function getDashboardOverviewAction(): Promise<DashboardOverviewResult> {
  try {
    const supabase = createAdminClient();

    // 1. Parallel fetch from all live modules
    const [leadsRes, enrollRes, studentsRes, invRes, classesRes] = await Promise.all([
      // A. Leads CRM
      supabase
        .from("leads")
        .select("id, lead_number, student_name, parent_name, phone, stage, grade_level, created_at")
        .order("created_at", { ascending: false }),

      // B. Enrollments / Admissions Pending
      supabase
        .from("enrollments")
        .select(`
          id,
          registration_number,
          status,
          created_at,
          students (
            id,
            full_name,
            current_grade,
            school_origin
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false }),

      // C. Students
      supabase.from("students").select("id, status"),

      // D. Invoices & Payments
      supabase
        .from("invoices")
        .select(`
          id,
          invoice_number,
          amount,
          status,
          due_date,
          created_at,
          students (
            full_name
          ),
          parents (
            full_name,
            phone
          ),
          payments (
            id,
            status,
            amount,
            payment_method
          )
        `)
        .order("created_at", { ascending: false }),

      // E. Classes & Enrollments
      supabase
        .from("classes")
        .select(`
          id,
          code,
          name,
          room,
          schedule_days,
          schedule_time,
          capacity,
          status,
          profiles (
            full_name
          ),
          enrollments (
            id,
            status
          )
        `)
        .order("created_at", { ascending: false }),
    ]);

    // 2. Process Leads Stats & Urgent Tasks
    const allLeads = leadsRes.data || [];
    const newLeads = allLeads.filter((l) => l.stage === "baru");

    // 3. Process Admissions Pending
    const pendingAdmissions = enrollRes.data || [];

    // 4. Process Students
    const allStudents = studentsRes.data || [];
    const activeStudentsCount = allStudents.filter((s) => s.status === "active").length;

    // 5. Process Invoices
    const allInvoices = invRes.data || [];
    let pendingFinanceCount = 0;
    let pendingFinanceAmount = 0;
    let overdueInvoicesCount = 0;
    let overdueInvoicesAmount = 0;
    let totalRevenue = 0;

    const todayStr = new Date().toISOString().split("T")[0];

    allInvoices.forEach((inv: any) => {
      const amt = Number(inv.amount) || 0;
      const payments = Array.isArray(inv.payments) ? inv.payments : [];
      const hasPendingPay = payments.some((p: any) => p.status === "pending");

      if (inv.status === "paid") {
        totalRevenue += amt;
      } else if (inv.status === "verify" || hasPendingPay) {
        pendingFinanceCount++;
        pendingFinanceAmount += amt;
      } else if (inv.status === "overdue" || (inv.due_date && inv.due_date < todayStr)) {
        overdueInvoicesCount++;
        overdueInvoicesAmount += amt;
      }
    });

    // 6. Process Classes & Occupancy
    const allClasses = classesRes.data || [];
    const activeClasses = allClasses.filter((c) => c.status !== "archived");
    let totalCapacity = 0;
    let totalEnrolled = 0;

    const classSessions: DashboardClassSessionItem[] = activeClasses.slice(0, 4).map((c: any) => {
      const tutor = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
      const enr = Array.isArray(c.enrollments) ? c.enrollments : [];
      const enrolledCount = enr.filter((e: any) => e.status === "active" || e.status === "pending").length;
      const cap = Number(c.capacity) || 8;

      totalCapacity += cap;
      totalEnrolled += enrolledCount;

      const occPercent = cap > 0 ? Math.round((enrolledCount / cap) * 100) : 0;

      let statusBadge = "bg-light-surface-container text-light-on-surface";
      let statusLabel = "Segera Mulai";
      if (c.status === "active") {
        statusBadge = occPercent >= 100 ? "bg-brand-indigo text-light-on-primary" : "bg-success text-on-success";
        statusLabel = occPercent >= 100 ? "Penuh" : "Berjalan";
      }

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        room: c.room || "Ruang Kelas",
        scheduleDays: c.schedule_days || "Senin & Rabu",
        scheduleTime: c.schedule_time || "16:00 - 18:00 WIB",
        tutorName: tutor?.full_name || "Tutor Bimbel",
        enrolled: enrolledCount,
        capacity: cap,
        occupancyPercent: occPercent,
        statusLabel,
        statusBadge,
      };
    });

    // Accumulate the rest of capacity/enrolled from remaining active classes
    activeClasses.slice(4).forEach((c: any) => {
      const enr = Array.isArray(c.enrollments) ? c.enrollments : [];
      totalEnrolled += enr.filter((e: any) => e.status === "active" || e.status === "pending").length;
      totalCapacity += Number(c.capacity) || 8;
    });

    const occupancyPercent = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    // 7. Build Dynamic Urgent Tasks Queue
    const urgentTasks: UrgentTaskItem[] = [];

    // Urgent Task 1: Pending Admissions (Registrations)
    if (pendingAdmissions.length > 0) {
      const topAd = pendingAdmissions[0];
      const st = Array.isArray(topAd.students) ? topAd.students[0] : topAd.students;
      urgentTasks.push({
        id: `ad-${topAd.id}`,
        category: "admission",
        initials: "AD",
        title: `Pendaftaran Baru: ${st?.full_name || "Siswa Baru"}`,
        desc: `${pendingAdmissions.length} berkas pendaftaran baru menunggu penempatan rombel & verifikasi`,
        statusBadge: "Perlu Review",
        statusColor: "bg-light-primary-container text-light-primary font-bold",
        actionType: "link",
        actionLabel: "Review Admissions",
        actionUrl: "/dashboard/admissions",
      });
    }

    // Urgent Task 2: Pending Finance Verification
    const verifyInvoices = allInvoices.filter(
      (i: any) => i.status === "verify" || (Array.isArray(i.payments) && i.payments.some((p: any) => p.status === "pending"))
    );
    if (verifyInvoices.length > 0) {
      const topInv: any = verifyInvoices[0];
      const stObj = Array.isArray(topInv.students) ? topInv.students[0] : topInv.students;
      const prObj = Array.isArray(topInv.parents) ? topInv.parents[0] : topInv.parents;
      const studentName = stObj?.full_name || "Siswa Bimbel";
      const parentName = prObj?.full_name || "Wali Murid";
      urgentTasks.push({
        id: `fin-${topInv.id}`,
        category: "finance",
        initials: "BY",
        title: `${parentName} • Siswa: ${studentName}`,
        desc: `Bukti transfer ${topInv.invoice_number} (${formatRupiahShort(topInv.amount)}) perlu verifikasi admin kasir`,
        statusBadge: "Verifikasi Bayar",
        statusColor: "bg-accent text-on-accent font-bold",
        actionType: "link",
        actionLabel: "Tinjau Bukti",
        actionUrl: "/dashboard/finance",
      });
    }

    // Urgent Task 3: New Leads Waiting for WhatsApp Contact
    if (newLeads.length > 0) {
      const topLead: any = newLeads[0];
      let cleanPhone = (topLead.phone || "").replace(/[^0-9]/g, "");
      if (cleanPhone.startsWith("0")) cleanPhone = "62" + cleanPhone.slice(1);
      const waText = encodeURIComponent(
        `Halo ${topLead.parent_name}, saya staf administrasi dari ARCI Bimbel. Kami menerima permintaan konsultasi belajar untuk ananda ${topLead.student_name}. Apakah ada yang bisa kami bantu?`
      );

      urgentTasks.push({
        id: `lead-${topLead.id}`,
        category: "lead",
        initials: "LD",
        title: `${topLead.parent_name} • Siswa: ${topLead.student_name}`,
        desc: `Permintaan konsultasi program ${topLead.grade_level} via Website Form belum dihubungi`,
        statusBadge: "Follow-up Segera",
        statusColor: "bg-warning text-on-warning font-bold",
        actionType: "whatsapp",
        actionLabel: "Hubungi WA",
        actionUrl: `https://wa.me/${cleanPhone}?text=${waText}`,
      });
    }

    // Urgent Task 4: Overdue Invoices
    if (overdueInvoicesCount > 0) {
      const topOverdue: any = allInvoices.find((i: any) => i.status === "overdue" || (i.due_date && i.due_date < todayStr));
      if (topOverdue) {
        const stObj = Array.isArray(topOverdue.students) ? topOverdue.students[0] : topOverdue.students;
        const prObj = Array.isArray(topOverdue.parents) ? topOverdue.parents[0] : topOverdue.parents;
        const studentName = stObj?.full_name || "Siswa";
        const parentName = prObj?.full_name || "Wali Murid";
        let cleanPhone = (prObj?.phone || "").replace(/[^0-9]/g, "");
        if (cleanPhone.startsWith("0")) cleanPhone = "62" + cleanPhone.slice(1);
        const waText = encodeURIComponent(
          `Halo ${parentName}, kami mengingatkan kembali tagihan bimbel ananda ${studentName} (${topOverdue.invoice_number}) sebesar ${formatRupiahShort(topOverdue.amount)} telah melewati batas jatuh tempo. Mohon konfirmasinya. Terima kasih.`
        );

        urgentTasks.push({
          id: `ovd-${topOverdue.id}`,
          category: "finance",
          initials: "TG",
          title: `Tunggakan: ${studentName} (${parentName})`,
          desc: `${overdueInvoicesCount} tagihan melewati jatuh tempo (${formatRupiahShort(overdueInvoicesAmount)})`,
          statusBadge: "Jatuh Tempo",
          statusColor: "bg-danger text-on-danger font-bold",
          actionType: "whatsapp",
          actionLabel: "Kirim Pengingat",
          actionUrl: `https://wa.me/${cleanPhone}?text=${waText}`,
        });
      }
    }

    const stats: DashboardOverviewStats = {
      newLeadsCount: newLeads.length,
      totalLeadsCount: allLeads.length,
      pendingAdmissionsCount: pendingAdmissions.length,
      activeStudentsCount,
      totalClassesCount: activeClasses.length,
      occupancyPercent,
      pendingFinanceCount,
      pendingFinanceAmount,
      overdueInvoicesCount,
      overdueInvoicesAmount,
      totalRevenue,
    };

    return {
      success: true,
      stats,
      urgentTasks,
      classSessions,
    };
  } catch (err: any) {
    console.error("Unhandled error in getDashboardOverviewAction:", err);
    return {
      success: false,
      stats: {
        newLeadsCount: 0,
        totalLeadsCount: 0,
        pendingAdmissionsCount: 0,
        activeStudentsCount: 0,
        totalClassesCount: 0,
        occupancyPercent: 0,
        pendingFinanceCount: 0,
        pendingFinanceAmount: 0,
        overdueInvoicesCount: 0,
        overdueInvoicesAmount: 0,
        totalRevenue: 0,
      },
      urgentTasks: [],
      classSessions: [],
      message: err?.message || "Terjadi kesalahan saat memuat ringkasan dashboard.",
    };
  }
}
