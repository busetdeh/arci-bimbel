"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface LoginResult {
  success: boolean;
  message?: string;
  redirectTo?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

/**
 * Login staff / admin / tutor using Supabase Auth with server cookies
 */
export async function loginStaffAction(formData: FormData): Promise<LoginResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return {
      success: false,
      message: "Email dan kata sandi staf wajib diisi.",
    };
  }

  try {
    const supabase = await createClient();

    // 1. Sign in with password using SSR client to persist session cookie
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error("Auth sign-in error:", authError?.message);
      return {
        success: false,
        message: "Email atau kata sandi tidak sesuai. Silakan gunakan kredensial staf yang valid.",
      };
    }

    // 2. Fetch profile from profiles table using admin client to guarantee role reading
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, full_name, role, phone, avatar_url")
      .eq("id", authData.user.id)
      .single();

    const role = profile?.role || "super_admin";
    const fullName = profile?.full_name || authData.user.user_metadata?.full_name || "Staf ARCI Bimbel";

    // 3. Determine redirect path based on role
    let redirectTo = "/dashboard";
    if (role === "tutor") {
      redirectTo = "/tutor";
    } else if (role === "admin_keuangan") {
      redirectTo = "/dashboard/finance";
    } else if (role === "admin_akademik") {
      redirectTo = "/dashboard/admissions";
    }

    return {
      success: true,
      redirectTo,
      user: {
        id: authData.user.id,
        email: authData.user.email || email,
        fullName,
        role,
      },
    };
  } catch (err: any) {
    console.error("Unexpected error in loginStaffAction:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kendala saat melakukan autentikasi staf.",
    };
  }
}

/**
 * Sign out action
 */
export async function logoutStaffAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login-admin");
}

/**
 * Check current logged in staff session
 */
export async function getStaffSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, full_name, role, avatar_url, phone")
      .eq("id", user.id)
      .single();

    return {
      user,
      profile: profile || {
        id: user.id,
        full_name: user.user_metadata?.full_name || "Administrator",
        role: "super_admin",
      },
    };
  } catch {
    return null;
  }
}

/**
 * Switch staff account directly (e.g. for testing role-based views)
 */
export async function switchStaffAccountAction(targetRole: string): Promise<LoginResult> {
  const STAFF_ACCOUNTS: Record<string, { email: string; name: string }> = {
    super_admin: { email: "ahmad.dani@arcibimbel.id", name: "Ahmad Dani, M.Pd." },
    admin_akademik: { email: "siti.rahma@arcibimbel.id", name: "Siti Rahma, S.Si." },
    admin_keuangan: { email: "budi.keuangan@arcibimbel.id", name: "Budi Santoso, S.E." },
    tutor: { email: "tutor.dimas@arcibimbel.id", name: "Dimas Arya, S.Si." },
  };

  const account = STAFF_ACCOUNTS[targetRole];
  if (!account) {
    return { success: false, message: "Peran staf tidak valid." };
  }

  const formData = new FormData();
  formData.append("email", account.email);
  formData.append("password", "admin12345");
  return await loginStaffAction(formData);
}
