"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  AttendanceStatus,
  StudentAttendanceItem,
  AttendanceSessionData,
} from "@/lib/attendance-constants";

export type { AttendanceStatus, StudentAttendanceItem, AttendanceSessionData };

/**
 * Fetch available tutor sessions with student rosters
 */
export async function getTutorAttendanceSessionsAction(): Promise<{
  success: boolean;
  sessions: AttendanceSessionData[];
  message?: string;
}> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch classes
    const { data: classes, error: classErr } = await supabase
      .from("classes")
      .select("id, name, code, room, schedule_days, schedule_time, status")
      .eq("status", "active")
      .order("code", { ascending: true });

    if (classErr) {
      console.error("Error fetching classes for attendance:", classErr);
    }

    // 2. Fetch all active students from Supabase
    const { data: allStudents } = await supabase
      .from("students")
      .select("id, full_name, nisn, school_origin, current_grade, status")
      .order("full_name", { ascending: true });

    const studentList = allStudents || [];

    // 3. Fetch existing attendance sessions for today
    const today = new Date().toISOString().slice(0, 10);
    const { data: dbSessions } = await supabase
      .from("attendance_sessions")
      .select(`
        id,
        class_id,
        session_date,
        time_slot,
        topic,
        status,
        submitted_at,
        classes (
          id,
          name,
          code,
          room,
          schedule_time
        ),
        attendance_records (
          id,
          student_id,
          status,
          check_in_time,
          notes,
          students (
            id,
            full_name,
            nisn,
            school_origin
          )
        )
      `)
      .order("session_date", { ascending: false });

    const sessions: AttendanceSessionData[] = [];

    // Fallback default classes if none exist in classes table
    const targetClasses = (classes && classes.length > 0) ? classes : [
      {
        id: "27712c7d-2106-42cc-a714-a80070964922",
        name: "Matematika SMP Kelas 8-A",
        code: "SMP-8A",
        room: "Ruang Galileo",
        schedule_time: "16:00 - 17:30 WIB",
      },
      {
        id: "24ee6038-9002-4a22-9160-182d8d8f9da9",
        name: "Fisika UTBK 12-B",
        code: "SMA-12B",
        room: "Ruang Newton",
        schedule_time: "18:00 - 19:30 WIB",
      },
    ];

    for (let i = 0; i < targetClasses.length; i++) {
      const cls = targetClasses[i];
      const foundDbSession = dbSessions?.find((s: any) => s.class_id === cls.id);

      let sessionId = foundDbSession?.id || `SESSION-${cls.code || i + 1}`;
      let topic =
        foundDbSession?.topic ||
        (i === 0
          ? "Sistem Persamaan Linear Dua Variabel (SPLDV) — Metode Eliminasi"
          : "Gelombang Elektromagnetik & Efek Doppler");
      let isSubmitted = foundDbSession?.status === "completed";
      let submittedAt = foundDbSession?.submitted_at || undefined;

      // Build roster for this session
      const roster: StudentAttendanceItem[] = [];

      if (foundDbSession && foundDbSession.attendance_records?.length > 0) {
        for (const rec of foundDbSession.attendance_records) {
          const st: any = Array.isArray(rec.students) ? rec.students[0] : rec.students;
          roster.push({
            id: rec.student_id,
            name: st?.full_name || "Siswa Bimbel",
            nisn: st?.nisn || "-",
            school: st?.school_origin || "Sekolah",
            status: (rec.status as AttendanceStatus) || "hadir",
            checkInTime: rec.check_in_time || "16:00",
            notes: rec.notes || "",
          });
        }
      } else {
        // Build initial roster from registered students
        const sliceCount = i === 0 ? 6 : Math.min(4, studentList.length);
        const subList = studentList.slice(0, sliceCount);

        for (let j = 0; j < subList.length; j++) {
          const st = subList[j];
          // Default: first few Hadir, then 1 Izin, 1 Sakit
          let defaultStatus: AttendanceStatus = "hadir";
          let defaultNote = "";

          if (j === 2 && i === 0) {
            defaultStatus = "izin";
            defaultNote = "Izin (Lomba Sekolah)";
          } else if (j === 3 && i === 0) {
            defaultStatus = "sakit";
            defaultNote = "Sakit (Demam / Flu)";
          }

          roster.push({
            id: st.id,
            name: st.full_name,
            nisn: st.nisn || "-",
            school: st.school_origin || "Sekolah",
            status: defaultStatus,
            checkInTime: defaultStatus === "hadir" ? "16:02 WIB" : undefined,
            notes: defaultNote,
          });
        }
      }

      sessions.push({
        id: sessionId,
        classId: cls.id,
        className: cls.name,
        classCode: cls.code,
        room: cls.room || (i === 0 ? "Ruang Galileo" : "Ruang Newton"),
        timeSlot: cls.schedule_time || "16:00 - 17:30 WIB",
        day: "Hari ini",
        topic,
        tutorName: "Kak Budi Pratama",
        tutorNotes:
          "Siswa antusias mengerjakan soal latihan mandiri. Latihan nomor 1-5 dijadikan PR mandiri.",
        isLive: !isSubmitted,
        isSubmitted,
        submittedAt,
        roster,
      });
    }

    return {
      success: true,
      sessions,
    };
  } catch (err: any) {
    console.error("Fatal error fetching tutor attendance sessions:", err);
    return {
      success: false,
      sessions: [],
      message: err?.message || "Terjadi kesalahan saat memuat data sesi presensi.",
    };
  }
}

/**
 * Save and lock attendance session records in Supabase
 */
export async function saveTutorAttendanceAction(payload: {
  sessionId: string;
  classId?: string;
  topic?: string;
  tutorNotes?: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    notes?: string;
    checkInTime?: string;
  }[];
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    let targetSessionId = payload.sessionId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      targetSessionId
    );

    // If not a valid UUID session yet, create one in attendance_sessions
    if (!isUuid) {
      // Find class ID
      let classId = payload.classId;
      if (!classId) {
        const { data: cls } = await supabase.from("classes").select("id").limit(1).single();
        classId = cls?.id;
      }

      if (!classId) {
        return { success: false, message: "ID Rombel Kelas tidak ditemukan." };
      }

      const { data: newSession, error: sessErr } = await supabase
        .from("attendance_sessions")
        .insert({
          class_id: classId,
          session_date: new Date().toISOString().slice(0, 10),
          time_slot: "16:00 - 17:30 WIB",
          topic: payload.topic || "Sesi Pembelajaran Kelas",
          status: "completed",
          submitted_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (sessErr || !newSession) {
        console.error("Error creating attendance session:", sessErr);
        return { success: false, message: "Gagal membuat sesi presensi di database." };
      }

      targetSessionId = newSession.id;
    } else {
      // Update existing session
      await supabase
        .from("attendance_sessions")
        .update({
          status: "completed",
          topic: payload.topic,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", targetSessionId);
    }

    // Upsert student attendance records
    for (const rec of payload.records) {
      const isStudentUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rec.studentId);

      if (isStudentUuid) {
        await supabase.from("attendance_records").upsert(
          {
            session_id: targetSessionId,
            student_id: rec.studentId,
            status: rec.status,
            notes: rec.notes || null,
          },
          { onConflict: "session_id, student_id" }
        );
      }
    }

    // Record audit log
    await supabase.from("audit_logs").insert({
      action: "SUBMIT_TUTOR_ATTENDANCE",
      entity_type: "attendance_sessions",
      entity_id: targetSessionId,
      details: {
        topic: payload.topic,
        total_students: payload.records.length,
        hadir_count: payload.records.filter((r) => r.status === "hadir").length,
        izin_count: payload.records.filter((r) => r.status === "izin").length,
        sakit_count: payload.records.filter((r) => r.status === "sakit").length,
        alpa_count: payload.records.filter((r) => r.status === "alpa").length,
        tutor_notes: payload.tutorNotes,
      },
    });

    revalidatePath("/tutor/presensi");
    revalidatePath("/tutor");
    revalidatePath("/dashboard/attendance");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Presensi sesi berhasil disimpan & dikunci ke sistem ARCI Bimbel!",
    };
  } catch (err: any) {
    console.error("Fatal error saving tutor attendance:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kesalahan saat menyimpan data presensi.",
    };
  }
}
