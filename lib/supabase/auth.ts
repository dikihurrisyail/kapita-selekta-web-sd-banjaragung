import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { catatErrorSupabase, isSupabaseConfigured } from "@/lib/supabase/config";

export type SesiAdmin = {
  userId: string;
  email: string;
  nama: string;
  /** True bila Supabase belum dikonfigurasi — aplikasi dalam mode demo. */
  demo: boolean;
};

/**
 * Ambil sesi admin yang sedang login.
 *
 * Mengembalikan null bila:
 *   * belum login, atau
 *   * user login tetapi tidak terdaftar di tabel admin_users, atau
 *   * terjadi kegagalan koneksi ke Supabase.
 *
 * Pemeriksaan keanggotaan admin_users penting: Supabase Auth bisa berisi user
 * lain (mis. pendaftaran mandiri). Tanpa cek ini, siapa pun yang punya akun
 * bisa membuka panel dan membaca konten draf.
 *
 * Dibungkus cache() agar layout, header, dan guard dalam satu request berbagi
 * hasil yang sama — tidak menembak Supabase berkali-kali per halaman.
 */
export const getSesiAdmin = cache(async (): Promise<SesiAdmin | null> => {
  if (!isSupabaseConfigured()) {
    return { userId: "demo", email: "demo@sekolah.example", nama: "Administrator", demo: true };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("nama")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      catatErrorSupabase("admin_users", error);
      return null;
    }

    /* Login tetapi bukan admin sekolah -> tolak. */
    if (!admin) return null;

    return {
      userId: user.id,
      email: user.email ?? "",
      nama: admin.nama ?? "Administrator",
      demo: false,
    };
  } catch (error) {
    catatErrorSupabase("sesi admin", error);
    return null;
  }
});

/**
 * Wajib login sebagai admin. Dipakai di setiap Server Action yang mengubah
 * data, karena proxy saja tidak cukup (Server Action tidak selalu lewat proxy).
 */
export async function wajibLogin(): Promise<SesiAdmin> {
  const sesi = await getSesiAdmin();
  if (!sesi) redirect("/admin/login");
  return sesi;
}
