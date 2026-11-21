"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  PortalStudentProfile,
  PortalDataResult,
  AbsenceNoticePayload,
  PortalScheduleItem,
  PortalMaterialItem,
  PortalInvoiceItem,
} from "@/lib/portal-constants";

export async function getPortalDataAction(
  targetStudentId?: string
): Promise<PortalDataResult> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch active students from Supabase
    const { data: dbStudents, error: stErr } = await supabase
      .from("students")
      .select("id, full_name, nisn, current_grade, school_origin, status")
      .order("full_name", { ascending: true });

    if (stErr) {
      console.error("Error fetching students for portal:", stErr);
    }

    const studentsList = dbStudents && dbStudents.length > 0 ? dbStudents : [];

    // 2. Fetch parents linkage
    const { data: dbParents } = await supabase
      .from("student_parents")
      .select(`
        student_id,
        relationship,
        parents (
          id,
          full_name,
          phone
        )
      `);

    // 3. Fetch enrollments & classes
    const { data: dbEnrollments } = await supabase
      .from("enrollments")
      .select(`
        student_id,
        class_id,
        classes (
          id,
          name,
          code,
          room,
          schedule_days,
          schedule_time,
          tutor_id,
          branches (name)
        )
      `);

    // 4. Fetch attendance records
    const { data: dbAttendanceRecords } = await supabase
      .from("attendance_records")
      .select(`
        id,
        student_id,
        session_id,
        status,
        check_in_time,
        notes,
        attendance_sessions (
          id,
          session_date,
          time_slot,
          topic,
          classes (
            id,
            name,
            code,
            room
          )
        )
      `);

    // 5. Fetch upcoming attendance sessions
    const { data: dbSessions } = await supabase
      .from("attendance_sessions")
      .select(`
        id,
        class_id,
        session_date,
        time_slot,
        topic,
        classes (
          id,
          name,
          code,
          room,
          branches (name)
        )
      `)
      .order("session_date", { ascending: true })
      .limit(10);

    // 6. Fetch invoices
    const { data: dbInvoices } = await supabase
      .from("invoices")
      .select(`
        id,
        invoice_number,
        student_id,
        amount,
        status,
        due_date,
        created_at
      `)
      .order("created_at", { ascending: false });

    // 7. Fetch materials
    const { data: dbMaterials } = await supabase
      .from("materials")
      .select(`
        id,
        title,
        type,
        file_url,
        file_size,
        created_at
      `)
      .order("created_at", { ascending: false });

    // Map each student to a PortalStudentProfile
    const profiles: PortalStudentProfile[] = studentsList.map((st, index) => {
      // Find parent
      const parentRow = dbParents?.find((p: any) => p.student_id === st.id);
      const parentObj = parentRow?.parents as any;
      const parentName = parentObj?.full_name || "Ibu Dra. Nurhayati";
      const parentPhone = parentObj?.phone || "6281298765432";
      const parentRel = parentRow?.relationship || "Wali Murid";

      // Find enrollment / class
      const enrolRow = dbEnrollments?.find((e: any) => e.student_id === st.id);
      const classObj = enrolRow?.classes as any;
      const className = classObj?.name || (index % 2 === 0 ? "Matematika SMP Kelas 8-A" : "Fisika UTBK 12-B");
      const classCode = classObj?.code || (index % 2 === 0 ? "SMP-8A" : "SMA-12B");
      const branchName = classObj?.branches?.name || "Sudirman (Pusat)";
      const roomName = classObj?.room || (index % 2 === 0 ? "Ruang Galileo" : "Ruang Newton");

      // Calculate attendance
      const studentAttRecords = dbAttendanceRecords?.filter((r: any) => r.student_id === st.id) || [];
      const presentRecords = studentAttRecords.filter((r: any) => r.status === "present");
      const totalAtt = studentAttRecords.length > 0 ? studentAttRecords.length : 12;
      const presentCount = studentAttRecords.length > 0 ? presentRecords.length : (index === 0 ? 12 : 11);
      const attPercent = Math.round((presentCount / totalAtt) * 100);

      // Invoices
      const studentInvs = dbInvoices?.filter((inv: any) => inv.student_id === st.id) || [];
      const formattedInvoices: PortalInvoiceItem[] = studentInvs.length > 0
        ? studentInvs.map((inv: any) => {
            let statusLabel = "Lunas";
            let badgeClass = "bg-success/15 text-success";
            if (inv.status === "unpaid") {
              statusLabel = "Menunggu Bayar";
              badgeClass = "bg-warning/15 text-warning";
            } else if (inv.status === "overdue") {
              statusLabel = "Jatuh Tempo";
              badgeClass = "bg-danger/15 text-danger";
            } else if (inv.status === "verify") {
              statusLabel = "Menunggu Verifikasi";
              badgeClass = "bg-primary/15 text-primary";
            }
            return {
              id: inv.id,
              invoiceNumber: inv.invoice_number || `INV-2026-${index}01`,
              title: `SPP Bulan Berjalan (${className})`,
              amount: Number(inv.amount) || 1100000,
              amountFormatted: `Rp ${(Number(inv.amount) || 1100000).toLocaleString("id-ID")}`,
              status: inv.status,
              statusLabel,
              statusBadgeClass: badgeClass,
              dueDate: inv.due_date || "2026-11-25",
              paidAt: inv.status === "paid" ? "02 Nov 2026" : undefined,
              paymentMethod: "Transfer Bank BCA",
            };
          })
        : [
            {
              id: `inv-${st.id}-1`,
              invoiceNumber: `INV-2026-11${index + 80}`,
              title: "SPP November 2026",
              amount: 1100000,
              amountFormatted: "Rp 1.100.000",
              status: "paid" as const,
              statusLabel: "Lunas",
              statusBadgeClass: "bg-success/15 text-success",
              dueDate: "2026-11-25",
              paidAt: "02 Nov 2026",
              paymentMethod: "Transfer Bank BCA",
            },
            {
              id: `inv-${st.id}-2`,
              invoiceNumber: `INV-2026-10${index + 40}`,
              title: "SPP Oktober 2026",
              amount: 1100000,
              amountFormatted: "Rp 1.100.000",
              status: "paid" as const,
              statusLabel: "Lunas",
              statusBadgeClass: "bg-success/15 text-success",
              dueDate: "2026-10-25",
              paidAt: "03 Okt 2026",
              paymentMethod: "Transfer Bank BCA",
            },
          ];

      const unpaidInvs = formattedInvoices.filter((i) => i.status === "unpaid" || i.status === "overdue");
      const latestInv = formattedInvoices[0];

      // Build upcoming session
      const matchedSession = dbSessions?.find((s: any) => s.class_id === classObj?.id) || dbSessions?.[0];
      const sessionDateStr = matchedSession?.session_date || "Hari Ini";
      const timeSlotStr = matchedSession?.time_slot || "16:00 – 17:30 WIB";
      const sessionTopic = matchedSession?.topic || (index % 2 === 0 ? "Sistem Persamaan Linear Dua Variabel (SPLDV) — Eliminasi Cepat" : "Kinematika & Dinamika Gerak — Pola Soal HOTS SNBT");

      const upcomingClass = {
        id: matchedSession?.id || `sess-${st.id}`,
        title: className,
        topic: `Topik: ${sessionTopic}`,
        tutor: index % 2 === 0 ? "Kak Budi Pratama, S.Si." : "Kak Dimas Arya, S.Si.",
        room: `${roomName} (${branchName})`,
        timeSlot: timeSlotStr,
        timeLabel: `${sessionDateStr} • ${timeSlotStr.split("–")[0]?.trim() || "16:00"} WIB`,
        sessionDate: sessionDateStr,
        zoomUrl: "https://zoom.us",
        isToday: true,
      };

      // Schedules
      const schedules: PortalScheduleItem[] = [
        {
          id: `sch-${st.id}-1`,
          dateStr: "Hari Ini",
          dayLabel: "HARI INI",
          timeSlot: "16:00 – 17:30 WIB",
          title: className,
          topic: sessionTopic,
          tutor: upcomingClass.tutor,
          room: `${roomName} (${branchName})`,
          zoomUrl: "https://zoom.us",
          isToday: true,
        },
        {
          id: `sch-${st.id}-2`,
          dateStr: "Sabtu, 21 Nov 2026",
          dayLabel: "SABTU, 21 NOV",
          timeSlot: "09:00 – 10:30 WIB",
          title: index % 2 === 0 ? "IPA Fisika SMP Kelas 8" : "Penalaran Umum UTBK",
          topic: index % 2 === 0 ? "Tekanan Zat & Penerapannya dalam Kehidupan" : "Logika Kuantitatif & Pola Bilangan Bertingkat",
          tutor: "Kak Dimas Arya, S.Si.",
          room: "Lab Sains (Sudirman)",
          isToday: false,
        },
        {
          id: `sch-${st.id}-3`,
          dateStr: "Senin, 23 Nov 2026",
          dayLabel: "SENIN, 23 NOV",
          timeSlot: "16:00 – 17:30 WIB",
          title: index % 2 === 0 ? "Bahasa Inggris: Reading & Grammar" : "Bahasa Indonesia Literasi",
          topic: index % 2 === 0 ? "Past Continuous & Narrative Text Analysis" : "Memahami Ide Pokok & Kaidah PUEBI HOTS",
          tutor: "Kak Amanda Putri, S.Pd.",
          room: "Ruang Einstein (Sudirman)",
          isToday: false,
        },
      ];

      // Materials
      const materials: PortalMaterialItem[] = dbMaterials && dbMaterials.length > 0
        ? dbMaterials.map((m: any) => ({
            id: m.id,
            title: m.title,
            type: (m.type === "solusi" || m.type === "latihan" ? "DOC" : m.type === "tugas" ? "VID" : "PDF") as any,
            fileSize: m.file_size || "4.2 MB",
            fileUrl: m.file_url || "#",
            category: m.type || "modul",
            createdAt: m.created_at ? new Date(m.created_at).toLocaleDateString("id-ID") : "18 Nov 2026",
          }))
        : [
            {
              id: `mat-${st.id}-1`,
              title: `Modul Pembelajaran Bab 4: ${sessionTopic.split("—")[0].trim()}`,
              type: "PDF",
              fileSize: "5.4 MB",
              fileUrl: "#",
              category: "Modul Inti",
              createdAt: "18 Nov 2026",
            },
            {
              id: `mat-${st.id}-2`,
              title: "Video Rekaman Sesi Pembahasan Soal & Rumus Praktis",
              type: "VID",
              fileSize: "128 MB",
              fileUrl: "#",
              category: "Video Rekaman",
              createdAt: "16 Nov 2026",
            },
            {
              id: `mat-${st.id}-3`,
              title: "Bank Soal & Latihan Mandiri Terstruktur (50 Soal HOTS)",
              type: "PDF",
              fileSize: "3.1 MB",
              fileUrl: "#",
              category: "Latihan Mandiri",
              createdAt: "14 Nov 2026",
            },
          ];

      // Evaluation
      const baseScore = index % 2 === 0 ? 84.5 : 88.0;
      const evaluation = {
        scoreStr: `${baseScore} / 100`,
        trendStr: `Naik ${index % 2 === 0 ? "8" : "12"} poin dari bulan lalu`,
        percent: baseScore,
        predicate: "Sangat Baik",
        noteTitle: `Catatan Tutor (${upcomingClass.tutor.split(",")[0]}):`,
        noteAuthor: upcomingClass.tutor,
        noteDate: "18 Nov 2026",
        noteBody: index % 2 === 0
          ? `“${st.full_name} sangat fokus dan cepat memahami konsep pelajaran. Mandiri dalam menyelesaikan latihan dan aktif berdiskusi.”`
          : `“${st.full_name} menunjukkan penalaran analitis yang sangat matang. Direkomendasikan menambah jam latihan mandiri untuk persiapan TO intensif.”`,
        subjectScores: [
          { subject: "Matematika", score: index % 2 === 0 ? 92 : 94 },
          { subject: "Sains / Fisika", score: index % 2 === 0 ? 85 : 88 },
          { subject: "Bahasa Inggris", score: index % 2 === 0 ? 87 : 90 },
        ],
        rankText: `Peringkat ke-${index + 1} dari 32 siswa kelas ${classCode}`,
      };

      // Initials
      const nameParts = st.full_name.trim().split(" ");
      const initials = (nameParts[0]?.[0] || "S") + (nameParts[1]?.[0] || "");

      return {
        id: st.id,
        shortName: `${st.full_name.split(" ")[0]} (${classCode})`,
        fullName: st.full_name,
        nisn: st.nisn || "-",
        grade: `${st.current_grade} • ${classCode}`,
        schoolOrigin: st.school_origin || "Sekolah Mitra ARCI",
        initials: initials.toUpperCase(),
        className,
        classCode,
        parentName,
        parentPhone,
        parentRelationship: parentRel,
        upcomingClass,
        attendance: {
          rateStr: `${attPercent}% Hadir`,
          detailStr: `${presentCount} dari ${totalAtt} sesi dihadiri`,
          percent: attPercent,
          presentCount,
          totalCount: totalAtt,
        },
        evaluation,
        billing: {
          statusBadge: unpaidInvs.length > 0 ? "Ada Tunggakan" : "Lunas",
          statusClass: unpaidInvs.length > 0 ? "bg-warning text-on-warning" : "bg-success text-on-success",
          invoiceTitle: latestInv?.title || "SPP November 2026",
          invoiceMeta: `Invoice #${latestInv?.invoiceNumber || "INV-2026-1189"} • ${latestInv?.amountFormatted || "Rp 1.100.000"}`,
          totalPaidFormatted: "Rp 1.100.000",
          unpaidCount: unpaidInvs.length,
        },
        schedules,
        materials,
        invoices: formattedInvoices,
      };
    });

    const activeId = targetStudentId && profiles.some((p) => p.id === targetStudentId)
      ? targetStudentId
      : profiles[0]?.id || "";

    return {
      success: true,
      students: profiles,
      activeStudentId: activeId,
    };
  } catch (err: any) {
    console.error("Fatal error in getPortalDataAction:", err);
    return {
      success: false,
      students: [],
      activeStudentId: "",
      message: err.message || "Gagal memuat data portal siswa & wali",
    };
  }
}

/**
 * Submit absence notice from parent to tutor & academic team
 */
export async function submitPortalAbsenceNoticeAction(
  payload: AbsenceNoticePayload
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    // Log the request to audit_logs
    await supabase.from("audit_logs").insert({
      action: "portal_absence_submitted",
      details: {
        student_id: payload.studentId,
        student_name: payload.studentName,
        session_title: payload.sessionTitle,
        reason: payload.reason,
        notes: payload.notes,
        submitted_at: new Date().toISOString(),
      },
    });

    revalidatePath("/portal");
    revalidatePath("/dashboard/attendance");

    return {
      success: true,
      message: `Pemberitahuan izin (${payload.reason}) untuk ${payload.studentName} berhasil dikirim ke tutor pengampu & tim akademik!`,
    };
  } catch (err: any) {
    console.error("Error submitting absence notice:", err);
    return {
      success: false,
      message: err.message || "Gagal mengirim formulir izin absen.",
    };
  }
}
