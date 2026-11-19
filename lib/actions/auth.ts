"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type HasilAksi = { ok: boolean; pesan?: string };

/**
 * Login admin dengan email + kata sandi (Supabase Auth).
 * Dipanggil dari form login lewat useActionState.
 */
export async function loginAdmin(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const lanjut = String(formData.get("lanjut") ?? "/admin");

  if (!email || !password) {
    return { ok: false, pesan: "Email dan kata sandi wajib diisi." };
  }

  /* Mode demo: tanpa Supabase, login dilewati agar panel bisa dijelajahi. */
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      pesan:
        "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local untuk mengaktifkan login.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, pesan: "Email atau kata sandi belum sesuai. Silakan periksa kembali." };
  }

  /*
   * Pastikan akun ini benar-benar administrator sekolah. Akun Auth lain
   * (mis. pendaftaran mandiri) tidak boleh masuk panel, jadi sesinya dibatalkan.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: admin } = user
    ? await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  if (!admin) {
    await supabase.auth.signOut();
    return {
      ok: false,
      pesan:
        "Akun ini tidak terdaftar sebagai administrator sekolah. Hubungi pengelola website untuk mendapatkan akses.",
    };
  }

  revalidatePath("/", "layout");
  redirect(lanjut.startsWith("/admin") ? lanjut : "/admin");
}

/** Keluar dari sesi admin. */
export async function logoutAdmin() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
