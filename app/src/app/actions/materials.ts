"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface MaterialItem {
  id: string;
  classId: string;
  classCode: string;
  className: string;
  programLevel: string;
  title: string;
  fileUrl: string;
  fileSize: string;
  type: "modul" | "latihan" | "tugas" | "solusi";
  dueDate?: string | null;
  uploaderName: string;
  uploaderId?: string | null;
  createdAt: string;
  formattedDate: string;
}

export interface MaterialClassOption {
  id: string;
  code: string;
  name: string;
  programLevel: string;
}

export interface MaterialStats {
  totalMaterials: number;
  totalModules: number;
  totalTasks: number;
  totalPractices: number;
  totalSolutions: number;
  classesCount: number;
}

export interface GetMaterialsResult {
  success: boolean;
  materials: MaterialItem[];
  classes: MaterialClassOption[];
  stats: MaterialStats;
  message?: string;
}

/**
 * Fetch all materials & assignments from Supabase join classes & profiles
 */
export async function getMaterialsAction(filters?: {
  classId?: string;
  type?: string;
  search?: string;
}): Promise<GetMaterialsResult> {
  try {
    const supabase = createAdminClient();

    // 1. Fetch all active classes for filter dropdown
    const { data: dbClasses, error: classErr } = await supabase
      .from("classes")
      .select("id, code, name, programs(level)")
      .order("code", { ascending: true });

    const classes: MaterialClassOption[] = (dbClasses || []).map((c: any) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      programLevel: c.programs?.level || "Umum",
    }));

    // 2. Query materials with class and uploader profile join
    let query = supabase
      .from("materials")
      .select(`
        id,
        class_id,
        title,
        file_url,
        file_size,
        type,
        due_date,
        uploaded_by,
        created_at,
        classes (
          id,
          code,
          name,
          programs (
            level
          )
        ),
        profiles:uploaded_by (
          id,
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (filters?.classId && filters.classId !== "all") {
      query = query.eq("class_id", filters.classId);
    }

    if (filters?.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }

    const { data: dbMaterials, error: matErr } = await query;

    if (matErr) {
      console.error("Error querying materials:", matErr);
      throw matErr;
    }

    let materials: MaterialItem[] = (dbMaterials || []).map((m: any) => {
      const cls = m.classes;
      const uploader = m.profiles;

      const dateObj = new Date(m.created_at);
      const formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        id: m.id,
        classId: m.class_id,
        classCode: cls?.code || "KLS",
        className: cls?.name || "Rombel Kelas",
        programLevel: cls?.programs?.level || "Reguler",
        title: m.title,
        fileUrl: m.file_url,
        fileSize: m.file_size || "1.5 MB",
        type: m.type || "modul",
        dueDate: m.due_date || null,
        uploaderName: uploader?.full_name || "Tutor Akademik",
        uploaderId: m.uploaded_by,
        createdAt: m.created_at,
        formattedDate,
      };
    });

    // Optional in-memory search filter for title or uploader
    if (filters?.search?.trim()) {
      const q = filters.search.toLowerCase().trim();
      materials = materials.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.className.toLowerCase().includes(q) ||
          m.classCode.toLowerCase().includes(q) ||
          m.uploaderName.toLowerCase().includes(q)
      );
    }

    // Compute stats
    const totalMaterials = materials.length;
    const totalModules = materials.filter((m) => m.type === "modul").length;
    const totalTasks = materials.filter((m) => m.type === "tugas").length;
    const totalPractices = materials.filter((m) => m.type === "latihan").length;
    const totalSolutions = materials.filter((m) => m.type === "solusi").length;
    const uniqueClasses = new Set(materials.map((m) => m.classId));

    return {
      success: true,
      materials,
      classes,
      stats: {
        totalMaterials,
        totalModules,
        totalTasks,
        totalPractices,
        totalSolutions,
        classesCount: uniqueClasses.size,
      },
    };
  } catch (err: any) {
    console.error("Error in getMaterialsAction:", err);
    return {
      success: false,
      materials: [],
      classes: [],
      stats: {
        totalMaterials: 0,
        totalModules: 0,
        totalTasks: 0,
        totalPractices: 0,
        totalSolutions: 0,
        classesCount: 0,
      },
      message: err.message || "Gagal memuat materi dan tugas dari database",
    };
  }
}

/**
 * Create a new material or task in Supabase
 */
export async function createMaterialAction(payload: {
  classId: string;
  title: string;
  fileUrl: string;
  fileSize?: string;
  type: "modul" | "latihan" | "tugas" | "solusi";
  dueDate?: string;
}): Promise<{ success: boolean; message: string; materialId?: string }> {
  try {
    if (!payload.classId || !payload.title?.trim() || !payload.fileUrl?.trim()) {
      return {
        success: false,
        message: "Kelas, judul materi, dan tautan file/URL wajib diisi.",
      };
    }

    const supabase = createAdminClient();

    // Find first active tutor profile as uploader if auth session not resolved
    const { data: tutors } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["tutor", "admin_akademik", "super_admin"])
      .limit(1);

    const uploaderId = tutors && tutors.length > 0 ? tutors[0].id : null;

    const { data, error } = await supabase
      .from("materials")
      .insert({
        class_id: payload.classId,
        title: payload.title.trim(),
        file_url: payload.fileUrl.trim(),
        file_size: payload.fileSize?.trim() || "2.0 MB",
        type: payload.type,
        due_date: payload.type === "tugas" ? payload.dueDate || null : null,
        uploaded_by: uploaderId,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting material:", error);
      throw error;
    }

    // Record in audit log
    await supabase.from("audit_logs").insert({
      action: "MATERIAL_UPLOADED",
      details: {
        material_id: data.id,
        title: payload.title,
        class_id: payload.classId,
        type: payload.type,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/materials");
    revalidatePath("/portal");

    return {
      success: true,
      message: `Materi "${payload.title}" berhasil diunggah dan dibagikan ke kelas!`,
      materialId: data.id,
    };
  } catch (err: any) {
    console.error("Error in createMaterialAction:", err);
    return {
      success: false,
      message: err.message || "Gagal mengunggah materi baru ke database.",
    };
  }
}

/**
 * Update existing material or task in Supabase
 */
export async function updateMaterialAction(
  id: string,
  payload: {
    classId: string;
    title: string;
    fileUrl: string;
    fileSize?: string;
    type: "modul" | "latihan" | "tugas" | "solusi";
    dueDate?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    if (!id || !payload.title?.trim() || !payload.fileUrl?.trim()) {
      return {
        success: false,
        message: "ID, judul materi, dan URL file wajib diisi.",
      };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("materials")
      .update({
        class_id: payload.classId,
        title: payload.title.trim(),
        file_url: payload.fileUrl.trim(),
        file_size: payload.fileSize?.trim() || "2.0 MB",
        type: payload.type,
        due_date: payload.type === "tugas" ? payload.dueDate || null : null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating material:", error);
      throw error;
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      action: "MATERIAL_UPDATED",
      details: {
        material_id: id,
        title: payload.title,
        class_id: payload.classId,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/materials");
    revalidatePath("/portal");

    return {
      success: true,
      message: `Materi "${payload.title}" berhasil diperbarui!`,
    };
  } catch (err: any) {
    console.error("Error in updateMaterialAction:", err);
    return {
      success: false,
      message: err.message || "Gagal memperbarui materi di database.",
    };
  }
}

/**
 * Delete material from Supabase
 */
export async function deleteMaterialAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!id) {
      return { success: false, message: "ID materi tidak valid." };
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("materials").delete().eq("id", id);

    if (error) {
      console.error("Error deleting material:", error);
      throw error;
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      action: "MATERIAL_DELETED",
      details: {
        material_id: id,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/materials");
    revalidatePath("/portal");

    return {
      success: true,
      message: "Materi berhasil dihapus dari sistem.",
    };
  } catch (err: any) {
    console.error("Error in deleteMaterialAction:", err);
    return {
      success: false,
      message: err.message || "Gagal menghapus materi dari database.",
    };
  }
}
