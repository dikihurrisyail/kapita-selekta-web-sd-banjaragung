import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  catatErrorSupabase,
  fetchDenganBatasWaktu,
  isSupabaseConfigured,
  OPSI_DB_SUPABASE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "@/lib/supabase/config";

/**
 * Proxy (dahulu "middleware") untuk menjaga /admin/*.
 *
 * Catatan Next 16: file ini bernama proxy.ts dan mengekspor fungsi `proxy`.
 *
 * Tiga hal yang dijaga di sini:
 *   1. Belum login            -> dialihkan ke /admin/login
 *   2. Login tapi bukan admin -> tetap di halaman login (tidak boleh masuk)
 *   3. Sudah login sebagai admin yang membuka /admin/login -> dialihkan ke /admin
 *
 * Pemeriksaan keanggotaan admin_users dilakukan di sini (bukan hanya di layout)
 * agar tidak terjadi pengalihan berulang antara layout dan halaman login.
 *
 * Rute publik tidak diproses supaya tidak ada panggilan jaringan tambahan pada
 * setiap kunjungan halaman biasa.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Hanya area admin yang perlu pemeriksaan sesi. */
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  /* Tanpa kredensial Supabase, panel admin tetap bisa dibuka (mode demo). */
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
    db: OPSI_DB_SUPABASE,
    global: { fetch: fetchDenganBatasWaktu },
  });

  const halamanLogin = pathname === "/admin/login";

  try {
    /* getUser() memvalidasi token ke server Supabase (bukan sekadar baca cookie). */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    /* Cek keanggotaan admin. User Auth biasa tidak otomatis boleh masuk panel. */
    let adalahAdmin = false;
    if (user) {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      adalahAdmin = Boolean(admin);
    }

    if (!adalahAdmin && !halamanLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      /* Simpan tujuan agar bisa dilanjutkan setelah login berhasil. */
      if (pathname !== "/admin") url.searchParams.set("lanjut", pathname);
      return NextResponse.redirect(url);
    }

    if (adalahAdmin && halamanLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    /*
     * Supabase tidak dapat dihubungi. Jangan sampai seluruh situs error 500;
     * biarkan permintaan lewat dan biarkan lapisan layout/aksi yang menangani.
     */
    catatErrorSupabase("sesi admin (proxy)", error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Jalankan pada semua rute kecuali aset statis, gambar optimasi,
     * favicon, dan file metadata.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
