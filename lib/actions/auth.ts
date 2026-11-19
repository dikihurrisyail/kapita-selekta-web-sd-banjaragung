"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { catatErrorSupabase, isSupabaseConfigured } from "@/lib/supabase/config";

export type HasilAksi = { ok: boolean; pesan?: string };

/** Panjang minimal kata sandi baru. */
const MIN_SANDI = 8;

/**
 * Alamat asal situs, dipakai untuk menyusun tautan pemulihan.
 *
 * Supabase mengirim email berisi tautan kembali ke aplikasi. Tautan itu harus
 * memakai domain yang benar (localhost saat pengembangan, domain sekolah saat
 * produksi), jadi nilainya diambil dari NEXT_PUBLIC_SITE_URL bila diisi,
 * atau disimpulkan dari header permintaan.
 */
async function asalSitus(): Promise<string> {
  const dariEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (dariEnv) return dariEnv.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

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

/* --------------------------------------------------- Pemulihan kata sandi */

/**
 * Kirim tautan pemulihan kata sandi ke email administrator.
 *
 * Pesan hasil SELALU sama, baik email terdaftar maupun tidak. Kalau aplikasi
 * membedakan keduanya, halaman ini bisa dipakai menebak email administrator
 * mana yang valid. Karena itu kegagalan "email tidak ditemukan" juga
 * dilaporkan sebagai sukses.
 */
export async function mintaResetSandi(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) return { ok: false, pesan: "Alamat email wajib diisi." };

  const pesanSukses: HasilAksi = {
    ok: true,
    pesan:
      "Bila alamat tersebut terdaftar sebagai administrator, tautan pemulihan sudah dikirim. Periksa kotak masuk dan folder spam.",
  };

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      pesan:
        "Supabase belum dikonfigurasi, jadi email pemulihan tidak bisa dikirim.",
    };
  }

  const asal = await asalSitus();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${asal}/admin/sandi-baru`,
  });

  if (error) {
    /*
     * Jangan bocorkan apakah email terdaftar. Cukup catat di log server
     * supaya pengelola tetap bisa menelusuri masalah konfigurasi SMTP.
     */
    catatErrorSupabase("kirim email pemulihan", error);
    return pesanSukses;
  }

  return pesanSukses;
}

/**
 * Simpan kata sandi baru setelah pengguna membuka tautan pemulihan.
 *
 * Wajib memakai sesi pemulihan: tautan dari Supabase membuat sesi sementara
 * lewat /auth/confirm. Tanpa sesi itu, aksi ini menolak — kalau tidak, siapa
 * pun bisa mengganti kata sandi tanpa pernah membuka email.
 */
export async function simpanSandiBaru(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  const sandi = String(formData.get("sandi") ?? "");
  const ulangi = String(formData.get("ulangi") ?? "");

  if (sandi.length < MIN_SANDI) {
    return { ok: false, pesan: `Kata sandi minimal ${MIN_SANDI} karakter.` };
  }
  if (sandi !== ulangi) {
    return { ok: false, pesan: "Kedua kata sandi belum sama." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      pesan: "Supabase belum dikonfigurasi, jadi kata sandi tidak bisa diubah.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      pesan:
        "Sesi pemulihan tidak ditemukan atau sudah kedaluwarsa. Silakan minta tautan baru.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: sandi });

  if (error) {
    catatErrorSupabase("simpan kata sandi baru", error);
    return {
      ok: false,
      pesan:
        error.message ||
        "Kata sandi gagal disimpan. Silakan minta tautan pemulihan baru.",
    };
  }

  /*
   * Setelah kata sandi berganti, sesi pemulihan dipakai untuk keluar lalu
   * login ulang dengan kata sandi baru — supaya tidak ada sesi yang
   * tertinggal dalam keadaan setengah terautentikasi.
   */
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login?pulih=1");
}
