"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClientOtp } from "@/lib/supabase/otp";
import { catatErrorSupabase, isSupabaseConfigured } from "@/lib/supabase/config";

export type HasilAksi = { ok: boolean; pesan?: string };

/** Panjang minimal kata sandi baru. */
const MIN_SANDI = 8;

/**
 * Cookie penanda bahwa kode OTP sudah terverifikasi.
 *
 * Isinya hanya email yang sudah lolos verifikasi kode, ditandatangani tidak
 * perlu karena cookie HttpOnly dan tidak bisa dibaca JavaScript. Fungsinya:
 * memastikan langkah "buat kata sandi baru" hanya bisa dibuka setelah orang
 * tersebut benar-benar memasukkan kode yang dikirim ke emailnya.
 *
 * Tanpa penanda ini, siapa pun bisa membuka halaman sandi baru dan mengganti
 * kata sandi tanpa pernah menerima kode.
 */
const COOKIE_TERVERIFIKASI = "pemulihan-terverifikasi";

/**
 * Cookie pembawa email yang sedang dipulihkan.
 *
 * Hanya untuk kenyamanan antar-langkah (pengguna tidak perlu mengetik ulang
 * email). Bukan pengaman: verifikasi tetap dilakukan Supabase saat kode
 * dimasukkan.
 */
const COOKIE_EMAIL_PEMULIHAN = "pemulihan-email";

/** Masa berlaku penanda: 15 menit, cukup untuk mengisi form. */
const UMUR_COOKIE = 15 * 60;

/* ----------------------------------------------------------- Login / keluar */

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
/*
 * Alur: email -> kode 6 angka -> verifikasi -> sandi baru.
 *
 * Kenapa kode, bukan tautan:
 *   * Tautan pemulihan harus membawa token yang hanya berlaku sekali dan
 *     bergantung pada alamat redirect yang benar. Kalau admin membuka email di
 *     ponsel sementara tautan diminta dari laptop, atau Site URL masih
 *     localhost, tautan gagal.
 *   * Kode 6 angka tidak butuh redirect sama sekali — pengguna cukup menyalin
 *     angka dari email ke halaman yang sama. Tidak ada perpindahan perangkat,
 *     tidak ada masalah URL.
 */

/** Pesan netral, dipakai baik email terdaftar maupun tidak. */
const PESAN_KODE_DIKIRIM =
  "Bila alamat tersebut terdaftar sebagai administrator, kode 6 angka sudah dikirim ke email itu. Kode berlaku 10 menit.";

/** Terjemahkan galat Supabase menjadi pesan yang bisa ditindaklanjuti. */
function pesanGalatEmail(error: {
  code?: string;
  status?: number;
  message?: string;
}): HasilAksi | null {
  const kode = (error.code ?? "").toLowerCase();
  const status = error.status ?? 0;

  if (kode.includes("rate_limit") || status === 429) {
    return {
      ok: false,
      pesan:
        "Batas pengiriman email tercapai. Tunggu sekitar satu jam, atau minta pengelola memeriksa kuota SMTP.",
    };
  }

  if (
    kode.includes("smtp") ||
    kode.includes("mailer") ||
    kode.includes("email_provider") ||
    kode.includes("email_not_configured")
  ) {
    return {
      ok: false,
      pesan:
        "Pengiriman email belum dikonfigurasi di server. Hubungi pengelola website untuk mengatur SMTP di dashboard Supabase.",
    };
  }

  if (kode.includes("email_address_invalid") || kode.includes("validation_failed")) {
    return { ok: false, pesan: "Format alamat email tidak valid." };
  }

  /* Selain itu: jangan bocorkan apakah email terdaftar. */
  return null;
}

/**
 * Langkah 1 — kirim kode 6 angka ke email.
 *
 * Email yang tidak terdaftar tidak diberi tahu (permintaannya tetap sukses)
 * supaya halaman ini tidak bisa dipakai menebak email administrator mana yang
 * valid. Akun baru juga tidak pernah dibuat — `resetPasswordForEmail` hanya
 * bekerja pada akun yang sudah ada.
 */
export async function kirimKodeReset(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) return { ok: false, pesan: "Alamat email wajib diisi." };

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      pesan: "Supabase belum dikonfigurasi, jadi kode tidak bisa dikirim.",
    };
  }

  /*
   * PENTING: klien di sini HARUS tanpa PKCE.
   *
   * Bila permintaan /recover membawa code_challenge (yang selalu dilakukan
   * @supabase/ssr), GoTrue menyimpan token sebagai "pkce_<hash>" dan
   * verifyOtp(type=recovery) tidak akan pernah cocok — kode yang benar pun
   * ditolak. Lihat penjelasan lengkap di lib/supabase/otp.ts.
   *
   * Tanpa redirectTo: alur ini tidak memakai tautan sama sekali, jadi tidak
   * bergantung pada Site URL maupun Redirect URLs.
   */
  const supabase = createClientOtp();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    catatErrorSupabase("kirim kode pemulihan", error);
    const khusus = pesanGalatEmail(error);
    if (khusus) return khusus;
  }

  /*
   * Simpan email yang sedang diproses agar langkah 2 tidak perlu meminta
   * pengguna mengetik ulang. Cookie ini bukan pengaman — verifikasi kode tetap
   * dilakukan di langkah 2 — hanya untuk kenyamanan.
   */
  const jar = await cookies();
  jar.set(COOKIE_TERVERIFIKASI, "", { maxAge: 0, path: "/" });
  jar.set(COOKIE_EMAIL_PEMULIHAN, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: UMUR_COOKIE,
    path: "/",
  });

  return { ok: true, pesan: PESAN_KODE_DIKIRIM };
}

/**
 * Langkah 2 — verifikasi kode OTP.
 *
 * Verifikasi memakai klien tanpa PKCE (createClientOtp). Hasilnya berupa
 * sesi Supabase (access + refresh token). Sesi itu harus dipasang ke cookie
 * HttpOnly lewat klien server biasa, karena langkah 3 (updateUser) berjalan
 * di Server Action yang membaca sesi dari cookie — bukan dari memori proses.
 */
export async function verifikasiKodeReset(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  const kode = String(formData.get("kode") ?? "").replace(/\D/g, "");

  /*
   * Panjang kode mengikuti setelan proyek Supabase (OTP Length), bukan
   * diasumsikan 6. Proyek ini mengirim 8 digit. Menerima rentang 6–10 membuat
   * alur tetap benar bila setelan itu diubah di dashboard.
   */
  if (kode.length < 6 || kode.length > 10) {
    return { ok: false, pesan: "Kode terdiri dari 6–8 angka." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, pesan: "Supabase belum dikonfigurasi." };
  }

  const jar = await cookies();
  const email = jar.get(COOKIE_EMAIL_PEMULIHAN)?.value ?? "";

  if (!email) {
    return {
      ok: false,
      pesan: "Sesi pemulihan tidak ditemukan. Silakan mulai lagi dari awal.",
    };
  }

  const otp = createClientOtp();

  const { data, error } = await otp.auth.verifyOtp({
    email,
    token: kode,
    type: "recovery",
  });

  if (error || !data.session) {
    catatErrorSupabase("verifikasi kode pemulihan", error);
    return {
      ok: false,
      pesan:
        "Kode salah atau sudah kedaluwarsa. Periksa kembali email Anda, atau minta kode baru.",
    };
  }

  /*
   * Pindahkan sesi hasil verifikasi ke cookie agar Server Action langkah 3
   * (dan proxy) melihat pengguna yang sama. Nama cookie & format harus sama
   * dengan yang dipakai @supabase/ssr, karena createClient() membacanya.
   */
  const supabase = await createClient();
  const { error: galatSesi } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });

  if (galatSesi) {
    catatErrorSupabase("menyimpan sesi pemulihan", galatSesi);
    return {
      ok: false,
      pesan:
        "Kode benar, tetapi sesi pemulihan gagal dibuat. Silakan minta kode baru.",
    };
  }

  /* Tandai terverifikasi; langkah 3 memeriksa penanda ini. */
  jar.set(COOKIE_TERVERIFIKASI, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: UMUR_COOKIE,
    path: "/",
  });

  revalidatePath("/admin/lupa-sandi");
  return { ok: true, pesan: "Kode benar. Silakan buat kata sandi baru." };
}

/**
 * Langkah 3 — simpan kata sandi baru.
 *
 * Hanya boleh dijalankan bila langkah 2 sudah lolos (cookie penanda ada) DAN
 * sesi pemulihan Supabase masih aktif.
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

  const jar = await cookies();
  const terverifikasi = jar.get(COOKIE_TERVERIFIKASI)?.value ?? "";

  if (!terverifikasi) {
    return {
      ok: false,
      pesan:
        "Sesi pemulihan tidak ditemukan atau sudah kedaluwarsa. Silakan minta kode baru.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== terverifikasi) {
    return {
      ok: false,
      pesan:
        "Sesi pemulihan tidak ditemukan atau sudah kedaluwarsa. Silakan minta kode baru.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: sandi });

  if (error) {
    catatErrorSupabase("simpan kata sandi baru", error);
    return {
      ok: false,
      pesan:
        error.message ||
        "Kata sandi gagal disimpan. Silakan minta kode pemulihan baru.",
    };
  }

  /* Bersihkan penanda, lalu keluar supaya login ulang dengan sandi baru. */
  jar.set(COOKIE_TERVERIFIKASI, "", { maxAge: 0, path: "/" });
  jar.set(COOKIE_EMAIL_PEMULIHAN, "", { maxAge: 0, path: "/" });

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login?pulih=1");
}
