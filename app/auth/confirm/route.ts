import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  catatErrorSupabase,
  fetchDenganBatasWaktu,
  isSupabaseConfigured,
  OPSI_DB_SUPABASE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "@/lib/supabase/config";

/**
 * Penangkap tautan pemulihan kata sandi (format token_hash).
 *
 * Route ini dipakai bila template email Supabase memakai bentuk:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
 *
 * Template bawaan Supabase TIDAK memakai bentuk ini — ia mengarahkan ke
 * {{ .SiteURL }} dengan token di fragment URL (#access_token=...). Fragment
 * tidak pernah sampai ke server, jadi bentuk itu ditangani di sisi browser
 * oleh komponen PenangkapPemulihan di /admin/sandi-baru.
 *
 * Keduanya didukung supaya alur tetap berjalan baik sebelum maupun sesudah
 * template email disesuaikan.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const tipe = searchParams.get("type");

  const keLupa = (alasan: string) =>
    NextResponse.redirect(
      new URL(`/admin/lupa-sandi?galat=${encodeURIComponent(alasan)}`, origin),
    );

  /* Tanpa token_hash: biarkan halaman sandi-baru yang menangani fragment. */
  if (!tokenHash) {
    return NextResponse.redirect(new URL("/admin/sandi-baru", origin));
  }

  if (!isSupabaseConfigured()) return keLupa("konfigurasi");

  if (tipe && tipe !== "recovery" && tipe !== "email") return keLupa("tipe");

  const response = NextResponse.redirect(new URL("/admin/sandi-baru", origin));

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
    db: OPSI_DB_SUPABASE,
    global: { fetch: fetchDenganBatasWaktu },
  });

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: (tipe === "email" ? "email" : "recovery") as "recovery" | "email",
  });

  if (error) {
    catatErrorSupabase("verifikasi tautan pemulihan", error);
    return keLupa("kedaluwarsa");
  }

  return response;
}
