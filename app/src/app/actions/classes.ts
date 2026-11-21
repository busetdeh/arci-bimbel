"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  ClassroomItem,
  ClassStudentItem,
  ClassAcademicStats,
  ClassesDataResult,
  CreateClassPayload,
  UpdateClassPayload,
  ProgramOption,
  BranchOption,
  TutorOption,
  CLASS_STATUS_CONFIG,
  GRADE_BADGES,
  ClassStatusType,
} from "@/lib/class-constants";

/**
 * Fetch all classes, student rosters, and options from Supabase
 */
export async function getClassesDataAction(): Promise<ClassesDataResult> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch classes with joined program, branch, tutor profile, and enrollments
    const { data: rawClasses, error: clsErr } = await supabase
      .from("classes")
      .select(`
        id,
        code,
        name,
        program_id,
        branch_id,
        tutor_id,
        room,
        capacity,
        schedule_days,
        schedule_time,
        status,
        created_at,
        programs (
          id,
          code,
          name,
          level
        ),
        branches (
          id,
          code,
          name,
          city
        ),
        profiles (
          id,
          full_name,
          role,
          phone
        ),
        enrollments (
          id,
          registration_number,
          status,
          enrolled_at,
          students (
            id,
            nisn,
            full_name,
            current_grade,
            school_origin
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (clsErr) {
      console.error("Error fetching classes from Supabase:", clsErr);
      return {
        success: false,
        classes: [],
        stats: {
          totalClasses: 0,
          totalStudentsEnrolled: 0,
          totalCapacity: 0,
          avgOccupancyPercent: 0,
          totalFullClasses: 0,
          scheduleConflictsCount: 0,
        },
        programOptions: [],
        branchOptions: [],
        tutorOptions: [],
        message: clsErr.message,
      };
    }

    // 2. Fetch dropdown options (programs, branches, tutors)
    const [progRes, branchRes, tutorRes] = await Promise.all([
      supabase.from("programs").select("id, code, name, level").eq("is_active", true),
      supabase.from("branches").select("id, code, name, city").eq("is_active", true),
      supabase
        .from("profiles")
        .select("id, full_name, role, phone")
        .in("role", ["tutor", "admin_akademik", "super_admin"]),
    ]);

    const programOptions: ProgramOption[] = (progRes.data || []).map((p: any) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      level: p.level,
    }));

    const branchOptions: BranchOption[] = (branchRes.data || []).map((b: any) => ({
      id: b.id,
      code: b.code,
      name: b.name,
      city: b.city,
    }));

    const tutorOptions: TutorOption[] = (tutorRes.data || []).map((t: any) => ({
      id: t.id,
      name: t.full_name,
      role: t.role,
      phone: t.phone,
    }));

    // 3. Format classes
    let totalStudentsEnrolled = 0;
    let totalCapacity = 0;
    let totalFullClasses = 0;

    const formattedClasses: ClassroomItem[] = (rawClasses || []).map((row: any) => {
      const prog = Array.isArray(row.programs) ? row.programs[0] : row.programs;
      const branch = Array.isArray(row.branches) ? row.branches[0] : row.branches;
      const tutor = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      const enrollList = Array.isArray(row.enrollments) ? row.enrollments : [];

      // Valid enrollments (active or pending)
      const validEnrollments = enrollList.filter(
        (e: any) => e.status === "active" || e.status === "pending"
      );
      const enrolledCount = validEnrollments.length;
      const capacityCount = Number(row.capacity) || 8;

      totalStudentsEnrolled += enrolledCount;
      totalCapacity += capacityCount;

      const occupancyPercent =
        capacityCount > 0 ? Math.round((enrolledCount / capacityCount) * 100) : 0;

      // Status determination
      let effStatus: ClassStatusType = row.status || "active";
      if (effStatus === "active" && enrolledCount >= capacityCount) {
        effStatus = "full";
        totalFullClasses++;
      } else if (effStatus === "full") {
        totalFullClasses++;
      }

      const statusConf = CLASS_STATUS_CONFIG[effStatus] || CLASS_STATUS_CONFIG.active;

      const levelStr = prog?.level || "SMP";
      const gradeConf = GRADE_BADGES[levelStr] || GRADE_BADGES.SMP;

      // Students list inside class
      const studentsList: ClassStudentItem[] = validEnrollments.map((enr: any) => {
        const st = Array.isArray(enr.students) ? enr.students[0] : enr.students;
        return {
          enrollmentId: enr.id,
          studentId: st?.id || "",
          studentName: st?.full_name || "Siswa Bimbel",
          nisn: st?.nisn || "-",
          grade: st?.current_grade || levelStr,
          schoolOrigin: st?.school_origin || "-",
          enrollmentStatus: enr.status,
          enrolledAt: enr.enrolled_at || "-",
        };
      });

      return {
        id: row.id,
        code: row.code,
        name: row.name,
        programId: row.program_id,
        programName: prog?.name || "Program Bimbel",
        programCode: prog?.code || "-",
        level: levelStr as any,
        levelFilter: gradeConf.filter,
        levelLabel: gradeConf.label,
        levelBadge: gradeConf.badge,
        branchId: row.branch_id,
        branchName: branch?.name || "Cabang Utama",
        branchCode: branch?.code || "-",
        branchCity: branch?.city || "Jakarta",
        tutorId: row.tutor_id,
        tutorName: tutor?.full_name || "Belum Ditugaskan",
        tutorPhone: tutor?.phone || null,
        room: row.room || "Ruang Kelas",
        capacity: capacityCount,
        enrolled: enrolledCount,
        occupancyPercent,
        scheduleDays: row.schedule_days || "Senin & Rabu",
        scheduleTime: row.schedule_time || "16:00 - 18:00 WIB",
        status: effStatus,
        statusLabel: statusConf.label,
        statusBadge: statusConf.badge,
        students: studentsList,
        createdAt: row.created_at,
      };
    });

    // Check for potential room or tutor collisions
    let scheduleConflictsCount = 0;
    const scheduleSlots = new Set<string>();
    for (const c of formattedClasses) {
      if (c.status !== "archived") {
        const slotKey = `${c.branchId}_${c.room}_${c.scheduleDays}_${c.scheduleTime}`;
        if (scheduleSlots.has(slotKey)) {
          scheduleConflictsCount++;
        } else {
          scheduleSlots.add(slotKey);
        }
      }
    }

    const avgOccupancyPercent =
      totalCapacity > 0 ? Math.round((totalStudentsEnrolled / totalCapacity) * 100) : 0;

    const stats: ClassAcademicStats = {
      totalClasses: formattedClasses.filter((c) => c.status !== "archived").length,
      totalStudentsEnrolled,
      totalCapacity,
      avgOccupancyPercent,
      totalFullClasses,
      scheduleConflictsCount,
    };

    return {
      success: true,
      classes: formattedClasses,
      stats,
      programOptions,
      branchOptions,
      tutorOptions,
    };
  } catch (err: any) {
    console.error("Unhandled error in getClassesDataAction:", err);
    return {
      success: false,
      classes: [],
      stats: {
        totalClasses: 0,
        totalStudentsEnrolled: 0,
        totalCapacity: 0,
        avgOccupancyPercent: 0,
        totalFullClasses: 0,
        scheduleConflictsCount: 0,
      },
      programOptions: [],
      branchOptions: [],
      tutorOptions: [],
      message: err?.message || "Terjadi kendala saat memuat data kelas.",
    };
  }
}

/**
 * Create a new class / rombel
 */
export async function createClassAction(
  payload: CreateClassPayload
): Promise<{ success: boolean; message: string }> {
  try {
    if (!payload.name?.trim() || !payload.programId || !payload.branchId || !payload.room) {
      return { success: false, message: "Nama kelas, program, cabang, dan ruangan wajib diisi." };
    }

    const supabase = createAdminClient();

    // Generate class code if not provided
    let classCode = payload.code?.trim();
    if (!classCode) {
      const { data: prog } = await supabase
        .from("programs")
        .select("code")
        .eq("id", payload.programId)
        .single();
      const { data: br } = await supabase
        .from("branches")
        .select("code")
        .eq("id", payload.branchId)
        .single();
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      classCode = `${prog?.code || "KLS"}-${br?.code || "ARCI"}-${randomSuffix}`;
    }

    const { error: insErr } = await supabase.from("classes").insert({
      code: classCode,
      name: payload.name.trim(),
      program_id: payload.programId,
      branch_id: payload.branchId,
      tutor_id: payload.tutorId || null,
      room: payload.room.trim(),
      capacity: Number(payload.capacity) || 8,
      schedule_days: payload.scheduleDays || "Senin & Rabu",
      schedule_time: payload.scheduleTime || "16:00 - 18:00 WIB",
      status: payload.status || "active",
    });

    if (insErr) {
      return { success: false, message: `Gagal membuat kelas: ${insErr.message}` };
    }

    // Audit Log
    await supabase.from("audit_logs").insert({
      action: "CLASS_CREATED",
      entity_type: "classes",
      entity_id: classCode,
      details: {
        name: payload.name,
        code: classCode,
        capacity: payload.capacity,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/classes");
    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard/admissions");
    revalidatePath("/tutor/presensi");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Rombel kelas ${payload.name} (${classCode}) berhasil dibuat!`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal membuat kelas." };
  }
}

/**
 * Update an existing class / rombel
 */
export async function updateClassAction(
  payload: UpdateClassPayload
): Promise<{ success: boolean; message: string }> {
  try {
    if (!payload.id || !payload.name?.trim()) {
      return { success: false, message: "ID kelas dan nama kelas wajib diisi." };
    }

    const supabase = createAdminClient();

    const { error: updErr } = await supabase
      .from("classes")
      .update({
        name: payload.name.trim(),
        program_id: payload.programId,
        branch_id: payload.branchId,
        tutor_id: payload.tutorId || null,
        room: payload.room.trim(),
        capacity: Number(payload.capacity) || 8,
        schedule_days: payload.scheduleDays,
        schedule_time: payload.scheduleTime,
        status: payload.status,
      })
      .eq("id", payload.id);

    if (updErr) {
      return { success: false, message: `Gagal memperbarui kelas: ${updErr.message}` };
    }

    // Audit Log
    await supabase.from("audit_logs").insert({
      action: "CLASS_UPDATED",
      entity_type: "classes",
      entity_id: payload.id,
      details: {
        name: payload.name,
        status: payload.status,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/classes");
    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard/admissions");
    revalidatePath("/tutor/presensi");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Perubahan rombel kelas ${payload.name} berhasil disimpan.`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal memperbarui kelas." };
  }
}

/**
 * Delete or archive a class
 */
export async function deleteClassAction(
  classId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    // Check if students enrolled
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("id, status")
      .eq("class_id", classId)
      .in("status", ["active", "pending"]);

    if (enrollments && enrollments.length > 0) {
      // Archive instead of hard delete to protect student records
      await supabase.from("classes").update({ status: "archived" }).eq("id", classId);
      revalidatePath("/dashboard/classes");
      return {
        success: true,
        message: `Kelas memiliki ${enrollments.length} siswa aktif. Status kelas telah diubah menjadi "Diarsipkan" demi menjaga integritas data akademik.`,
      };
    }

    const { error: delErr } = await supabase.from("classes").delete().eq("id", classId);

    if (delErr) {
      return { success: false, message: `Gagal menghapus kelas: ${delErr.message}` };
    }

    revalidatePath("/dashboard/classes");
    revalidatePath("/dashboard/schedule");
    revalidatePath("/tutor/presensi");
    return {
      success: true,
      message: "Kelas berhasil dihapus.",
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal menghapus kelas." };
  }
}
