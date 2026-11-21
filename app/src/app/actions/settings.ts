"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  StaffUserItem,
  AuditLogItem,
  SettingsDataResult,
  CreateStaffPayload,
  StaffRoleType,
  STAFF_ROLE_CONFIG,
  DEFAULT_PERMISSIONS,
} from "@/lib/settings-constants";

/**
 * Fetch staff profiles, auth credentials, and audit logs
 */
export async function getSettingsDataAction(): Promise<SettingsDataResult> {
  try {
    const supabase = createAdminClient();

    // 1. Parallel fetch profiles, auth users, and audit logs
    const [profilesRes, authRes, auditRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .in("role", ["super_admin", "admin_akademik", "admin_keuangan", "tutor"])
        .order("created_at", { ascending: true }),
      supabase.auth.admin.listUsers(),
      supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    const profiles = profilesRes.data || [];
    const authUsers = authRes.data?.users || [];
    const authMap = new Map(authUsers.map((u) => [u.id, u]));

    // 2. Format staff users list
    const staffList: StaffUserItem[] = profiles.map((p: any) => {
      const authUser = authMap.get(p.id);
      const role = (p.role as StaffRoleType) || "tutor";
      const roleConf = STAFF_ROLE_CONFIG[role] || STAFF_ROLE_CONFIG.tutor;
      const permissions = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.tutor;

      const lastSignIn = authUser?.last_sign_in_at
        ? new Date(authUser.last_sign_in_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB"
        : "Belum pernah login";

      const createdAtDate = new Date(p.created_at);
      const createdAt = isNaN(createdAtDate.getTime())
        ? "-"
        : createdAtDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

      return {
        id: p.id,
        name: p.full_name || "Staf ARCI",
        email: authUser?.email || `${p.full_name.toLowerCase().replace(/[^a-z0-9]/g, "")}@arcibimbel.id`,
        phone: p.phone || authUser?.user_metadata?.phone || "-",
        role,
        roleLabel: roleConf.label,
        roleBadge: roleConf.badge,
        status: "Aktif",
        createdAt,
        lastLogin: lastSignIn,
        permissions,
      };
    });

    // 3. Format audit logs
    const auditLogs: AuditLogItem[] = (auditRes.data || []).map((a: any) => {
      const d = new Date(a.created_at);
      const formattedDate = isNaN(d.getTime())
        ? "-"
        : d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB";

      return {
        id: a.id,
        action: a.action,
        entityType: a.entity_type,
        entityId: a.entity_id,
        details: a.details,
        createdAt: a.created_at,
        formattedDate,
      };
    });

    return {
      success: true,
      staffList,
      auditLogs,
    };
  } catch (err: any) {
    console.error("Error in getSettingsDataAction:", err);
    return {
      success: false,
      staffList: [],
      auditLogs: [],
      message: err?.message || "Gagal memuat data pengaturan.",
    };
  }
}

/**
 * Create a new staff account in Supabase Auth & profiles
 */
export async function createStaffAccountAction(
  payload: CreateStaffPayload
): Promise<{ success: boolean; message: string }> {
  try {
    if (!payload.email?.trim() || !payload.fullName?.trim() || !payload.role) {
      return { success: false, message: "Email, nama lengkap, dan peran staf wajib diisi." };
    }

    const supabase = createAdminClient();
    const defaultPassword = payload.password?.trim() || "BimbelARCI2026!";

    // Create user in Supabase Auth
    const { data: newUser, error: authErr } = await supabase.auth.admin.createUser({
      email: payload.email.trim(),
      password: defaultPassword,
      email_confirm: true,
      user_metadata: {
        full_name: payload.fullName.trim(),
        phone: payload.phone?.trim() || null,
        role: payload.role,
      },
    });

    if (authErr || !newUser.user) {
      return {
        success: false,
        message: `Gagal membuat akun staf: ${authErr?.message || "Terjadi kesalahan"}`,
      };
    }

    // Upsert into profiles
    await supabase.from("profiles").upsert({
      id: newUser.user.id,
      full_name: payload.fullName.trim(),
      phone: payload.phone?.trim() || null,
      role: payload.role,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      action: "STAFF_ACCOUNT_CREATED",
      entity_type: "profiles",
      entity_id: newUser.user.id,
      details: {
        email: payload.email,
        full_name: payload.fullName,
        role: payload.role,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: `Akun staf ${payload.fullName} (${payload.email}) berhasil dibuat! Password default: ${defaultPassword}`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal membuat akun staf." };
  }
}

/**
 * Update staff role in profiles and Auth metadata
 */
export async function updateStaffRoleAction(
  userId: string,
  newRole: StaffRoleType
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    // Update profile
    const { error: profErr } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (profErr) {
      return { success: false, message: `Gagal memperbarui profil: ${profErr.message}` };
    }

    // Update auth metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      action: "STAFF_ROLE_UPDATED",
      entity_type: "profiles",
      entity_id: userId,
      details: {
        newRole,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: `Peran akun staf berhasil diperbarui menjadi ${newRole}.`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal memperbarui peran akun staf." };
  }
}
