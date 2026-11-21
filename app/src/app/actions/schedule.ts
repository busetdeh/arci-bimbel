"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  CalendarSessionItem,
  DayColumnData,
  ScheduleCalendarStats,
  ScheduleDataResult,
  ScheduleClassOption,
  ScheduleBranchOption,
  ScheduleTutorOption,
  CreateSessionPayload,
  SESSION_STATUS_CONFIG,
  INDO_DAYS,
  DayKey,
  SessionStatusType,
} from "@/lib/schedule-constants";

/**
 * Fetch calendar sessions and day columns for the schedule view
 */
export async function getScheduleCalendarDataAction(
  targetDateStr?: string
): Promise<ScheduleDataResult> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch attendance_sessions with classes, branches, programs, tutors, and attendance records
    const { data: rawSessions, error: sessErr } = await supabase
      .from("attendance_sessions")
      .select(`
        id,
        class_id,
        tutor_id,
        session_date,
        time_slot,
        topic,
        status,
        submitted_at,
        created_at,
        classes (
          id,
          code,
          name,
          room,
          capacity,
          branch_id,
          branches (
            id,
            code,
            name
          ),
          programs (
            name,
            level
          ),
          enrollments (
            id,
            status
          )
        ),
        profiles (
          id,
          full_name,
          role
        ),
        attendance_records (
          id,
          status
        )
      `)
      .order("session_date", { ascending: true })
      .order("time_slot", { ascending: true });

    if (sessErr) {
      console.error("Error fetching attendance_sessions from Supabase:", sessErr);
    }

    // 2. Fetch options for creating new sessions
    const [classesRes, branchRes, tutorRes] = await Promise.all([
      supabase
        .from("classes")
        .select(`
          id,
          code,
          name,
          room,
          tutor_id,
          branch_id,
          schedule_time,
          profiles (full_name),
          branches (name)
        `)
        .eq("status", "active"),
      supabase.from("branches").select("id, code, name").eq("is_active", true),
      supabase.from("profiles").select("id, full_name").in("role", ["tutor", "admin_akademik", "super_admin"]),
    ]);

    const classOptions: ScheduleClassOption[] = (classesRes.data || []).map((c: any) => {
      const tutor = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
      const br = Array.isArray(c.branches) ? c.branches[0] : c.branches;
      return {
        id: c.id,
        code: c.code,
        name: c.name,
        room: c.room,
        tutorId: c.tutor_id,
        tutorName: tutor?.full_name || "Tutor",
        branchId: c.branch_id,
        branchName: br?.name || "Cabang",
        scheduleTime: c.schedule_time || "16:00 - 18:00 WIB",
      };
    });

    const branchOptions: ScheduleBranchOption[] = (branchRes.data || []).map((b: any) => ({
      id: b.id,
      code: b.code,
      name: b.name,
    }));

    const tutorOptions: ScheduleTutorOption[] = (tutorRes.data || []).map((t: any) => ({
      id: t.id,
      name: t.full_name,
    }));

    // 3. Compute week anchor date
    const baseDate = targetDateStr ? new Date(targetDateStr) : new Date("2026-11-18");
    // Find Monday of this week
    const currentDayOfWeek = baseDate.getDay(); // 0 is Sun, 1 is Mon
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayDate = new Date(baseDate);
    mondayDate.setDate(baseDate.getDate() + distanceToMonday);

    const todayIso = new Date().toISOString().split("T")[0];

    // Build the 7 day columns (Senin s.d Minggu)
    const days: DayColumnData[] = INDO_DAYS.map((d, index) => {
      const colDate = new Date(mondayDate);
      colDate.setDate(mondayDate.getDate() + index);
      const dateStr = colDate.toISOString().split("T")[0];
      const formattedDate = colDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });

      return {
        dayKey: d.key,
        dayName: d.name,
        dateStr,
        formattedDate,
        isToday: dateStr === todayIso || dateStr === "2026-11-18",
        sessions: [],
      };
    });

    const dayMap = new Map<string, DayColumnData>();
    days.forEach((d) => dayMap.set(d.dateStr, d));

    let completedSessions = 0;
    let inProgressSessions = 0;
    let scheduledSessions = 0;

    const formattedSessions: CalendarSessionItem[] = (rawSessions || []).map((row: any) => {
      const cls = Array.isArray(row.classes) ? row.classes[0] : row.classes;
      const branch = Array.isArray(cls?.branches) ? cls.branches[0] : cls?.branches;
      const prog = Array.isArray(cls?.programs) ? cls.programs[0] : cls?.programs;
      const tutor = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      const enrollList = Array.isArray(cls?.enrollments) ? cls.enrollments : [];
      const recordsList = Array.isArray(row.attendance_records) ? row.attendance_records : [];

      const enrolledStudentsCount = enrollList.filter(
        (e: any) => e.status === "active" || e.status === "pending"
      ).length;
      const attendedStudentsCount = recordsList.filter((r: any) => r.status === "hadir").length;

      const effStatus: SessionStatusType = row.status || "scheduled";
      if (effStatus === "completed") completedSessions++;
      else if (effStatus === "in_progress") inProgressSessions++;
      else if (effStatus === "scheduled") scheduledSessions++;

      const statusConf = SESSION_STATUS_CONFIG[effStatus] || SESSION_STATUS_CONFIG.scheduled;

      // Determine day key & formatted date
      const sDate = new Date(row.session_date);
      const dIndex = sDate.getDay();
      const dayObj = INDO_DAYS.find((d) => d.dayIndex === dIndex) || INDO_DAYS[0];
      const formattedDate = isNaN(sDate.getTime())
        ? "-"
        : sDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

      const attendanceInfo =
        effStatus === "completed"
          ? `${attendedStudentsCount} Siswa Hadir`
          : effStatus === "in_progress"
          ? `${enrolledStudentsCount} Kursi Terisi`
          : `${enrolledStudentsCount} Siswa Terdaftar`;

      const sessionItem: CalendarSessionItem = {
        id: row.id,
        classId: row.class_id,
        classCode: cls?.code || "-",
        className: cls?.name || "Rombel Kelas",
        programName: prog?.name || "Program Bimbel",
        programLevel: prog?.level || "SMP",
        branchId: cls?.branch_id || "",
        branchName: branch?.name || "Cabang Utama",
        branchCode: branch?.code || "-",
        room: cls?.room || "Ruang Kelas",
        tutorId: row.tutor_id,
        tutorName: tutor?.full_name || "Tutor Bimbel",
        sessionDate: row.session_date,
        dayKey: dayObj.key,
        dayLabel: dayObj.name,
        formattedDate,
        timeSlot: row.time_slot,
        topic: row.topic || "Pembahasan Materi Kurikulum & Latihan Soal",
        status: effStatus,
        statusLabel: statusConf.label,
        statusBadge: statusConf.badge,
        colorScheme: statusConf.colorScheme,
        enrolledStudentsCount,
        attendedStudentsCount,
        attendanceInfo,
        submittedAt: row.submitted_at,
      };

      // Place into matching day column if within current week
      if (dayMap.has(row.session_date)) {
        dayMap.get(row.session_date)!.sessions.push(sessionItem);
      }

      return sessionItem;
    });

    const stats: ScheduleCalendarStats = {
      totalSessions: formattedSessions.length,
      completedSessions,
      inProgressSessions,
      scheduledSessions,
      totalHoursTaught: completedSessions * 2,
    };

    return {
      success: true,
      sessions: formattedSessions,
      days,
      stats,
      classOptions,
      branchOptions,
      tutorOptions,
    };
  } catch (err: any) {
    console.error("Unhandled error in getScheduleCalendarDataAction:", err);
    return {
      success: false,
      sessions: [],
      days: [],
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        inProgressSessions: 0,
        scheduledSessions: 0,
        totalHoursTaught: 0,
      },
      classOptions: [],
      branchOptions: [],
      tutorOptions: [],
      message: err?.message || "Terjadi kesalahan saat memuat kalender jadwal sesi.",
    };
  }
}

/**
 * Create a new schedule session in attendance_sessions
 */
export async function createScheduleSessionAction(
  payload: CreateSessionPayload
): Promise<{ success: boolean; message: string }> {
  try {
    if (!payload.classId || !payload.sessionDate || !payload.timeSlot) {
      return { success: false, message: "Rombel kelas, tanggal sesi, dan jam belajar wajib diisi." };
    }

    const supabase = createAdminClient();

    // Look up tutor from class if not provided
    let tutorId = payload.tutorId;
    if (!tutorId) {
      const { data: cls } = await supabase
        .from("classes")
        .select("tutor_id")
        .eq("id", payload.classId)
        .single();
      tutorId = cls?.tutor_id;
    }

    const { error: insErr } = await supabase.from("attendance_sessions").insert({
      class_id: payload.classId,
      tutor_id: tutorId || null,
      session_date: payload.sessionDate,
      time_slot: payload.timeSlot,
      topic: payload.topic?.trim() || "Sesi Pembahasan Kurikulum",
      status: "scheduled",
    });

    if (insErr) {
      return { success: false, message: `Gagal membuat jadwal sesi: ${insErr.message}` };
    }

    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard");
    revalidatePath("/tutor/presensi");

    return {
      success: true,
      message: "Jadwal sesi baru berhasil ditambahkan ke kalender!",
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal membuat sesi." };
  }
}

/**
 * Cancel a schedule session
 */
export async function cancelScheduleSessionAction(
  sessionId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    const { error: updErr } = await supabase
      .from("attendance_sessions")
      .update({ status: "cancelled" })
      .eq("id", sessionId);

    if (updErr) {
      return { success: false, message: `Gagal membatalkan sesi: ${updErr.message}` };
    }

    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard");
    revalidatePath("/tutor/presensi");

    return {
      success: true,
      message: "Sesi berhasil dibatalkan.",
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal membatalkan sesi." };
  }
}
