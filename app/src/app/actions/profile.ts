"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { ROLE_CONFIGS, StaffRole } from "@/lib/rbac";

export interface StaffProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  roleLabel: string;
  nip: string;
  branchName: string;
  branchId?: string;
  avatarUrl?: string;
  updatedAt: string;
}

export interface BranchOption {
  id: string;
  name: string;
  code: string;
  city: string;
}

export interface ProfileActionResult {
  success: boolean;
  message?: string;
  data?: StaffProfileData;
  branches?: BranchOption[];
}

/**
 * Get current staff profile & active branches from Supabase
 */
export async function getStaffProfileDataAction(): Promise<ProfileActionResult> {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch branches for selection
    const { data: branchRows } = await admin
      .from("branches")
      .select("id, name, code, city")
      .eq("is_active", true)
      .order("name", { ascending: true });

    const branches: BranchOption[] = (branchRows || []).map((b: any) => ({
      id: b.id,
      name: b.name,
      code: b.code,
      city: b.city,
    }));

    let profileRow: any = null;
    let email = "ahmad.dani@arcibimbel.id";

    if (user) {
      email = user.email || email;
      const { data: p } = await admin
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profileRow = p;
    }

    // Fallback to active staff user if no session cookie
    if (!profileRow) {
      const { data: defaultProfile } = await admin
        .from("profiles")
        .select("*")
        .eq("role", "super_admin")
        .limit(1)
        .single();
      profileRow = defaultProfile;
    }

    const role = (
      ["super_admin", "admin_akademik", "admin_keuangan", "tutor"].includes(
        profileRow?.role
      )
        ? profileRow.role
        : "super_admin"
    ) as StaffRole;

    const roleCfg = ROLE_CONFIGS[role];

    // Compute NIP sequence
    const yearPrefix = "2026";
    const nip = `ADM-${yearPrefix}-${profileRow?.id?.slice(0, 4)?.toUpperCase() || "0001"}`;

    const updatedAtFormatted = profileRow?.updated_at
      ? new Date(profileRow.updated_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      : "19 Nov 2026, 09:30 WIB";

    const profileData: StaffProfileData = {
      id: profileRow?.id || "default-id",
      fullName: profileRow?.full_name || "Ahmad Dani, M.Pd.",
      email: email,
      phone: profileRow?.phone || "0812-4455-8899",
      role: role,
      roleLabel: roleCfg?.label || "Super Admin Operasional",
      nip: nip,
      branchName: branches[0]?.name || "Cabang Sudirman Utama",
      branchId: branches[0]?.id,
      avatarUrl: profileRow?.avatar_url || undefined,
      updatedAt: updatedAtFormatted,
    };

    return {
      success: true,
      data: profileData,
      branches,
    };
  } catch (err: any) {
    console.error("Error fetching staff profile data:", err);
    return {
      success: false,
      message: err?.message || "Gagal memuat profil staf.",
    };
  }
}

/**
 * Update staff profile data (Full Name & WhatsApp Phone)
 */
export async function updateStaffProfileAction(payload: {
  fullName: string;
  phone: string;
  branchName?: string;
}): Promise<ProfileActionResult> {
  try {
    if (!payload.fullName?.trim()) {
      return { success: false, message: "Nama lengkap staf wajib diisi." };
    }
    if (!payload.phone?.trim()) {
      return { success: false, message: "Nomor WhatsApp kerja wajib diisi." };
    }

    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let targetId = user?.id;

    if (!targetId) {
      // Find super admin profile
      const { data: defaultProfile } = await admin
        .from("profiles")
        .select("id")
        .eq("role", "super_admin")
        .limit(1)
        .single();
      targetId = defaultProfile?.id;
    }

    if (!targetId) {
      return { success: false, message: "Pengguna tidak terdaftar." };
    }

    // Clean phone number
    let cleanPhone = payload.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("62")) {
      cleanPhone = "62" + cleanPhone;
    }

    // Update in Supabase profiles
    const { error: profileErr } = await admin
      .from("profiles")
      .update({
        full_name: payload.fullName.trim(),
        phone: cleanPhone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetId);

    if (profileErr) {
      return { success: false, message: profileErr.message };
    }

    // Also update auth user metadata if user session exists
    if (user) {
      await supabase.auth.updateUser({
        data: {
          full_name: payload.fullName.trim(),
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Data profil staf berhasil diperbarui di Supabase!",
    };
  } catch (err: any) {
    console.error("Error updating staff profile:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kesalahan saat memperbarui profil.",
    };
  }
}

/**
 * Update staff password in Supabase Auth
 */
export async function updateStaffPasswordAction(payload: {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    if (!payload.newPassword || payload.newPassword.length < 8) {
      return {
        success: false,
        message: "Kata sandi baru minimal 8 karakter.",
      };
    }

    if (payload.newPassword !== payload.confirmPassword) {
      return {
        success: false,
        message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru.",
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Sesi staf tidak ditemukan. Silakan login terlebih dahulu.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: payload.newPassword,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Kata sandi staf berhasil diperbarui dengan aman!",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Gagal memperbarui kata sandi.",
    };
  }
}

/**
 * Logout all other active sessions except current
 */
export async function logoutOtherSessionsAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "others" });

    return {
      success: true,
      message: "Seluruh sesi perangkat lain berhasil dilogout secara aman.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Gagal melakukan logout sesi lain.",
    };
  }
}
