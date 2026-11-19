import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  fetchDenganBatasWaktu,
  OPSI_DB_SUPABASE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./config";

/**
 * Klien Supabase khusus alur pemulihan kata sandi dengan kode OTP.
 *
 * ---------------------------------------------------------------------------
 * KENAPA TIDAK MEMAKAI createServerClient (lib/supabase/server.ts)
 * ---------------------------------------------------------------------------
 * `@supabase/ssr` MENULIS-PAKSA `flowType: "pkce"` di dalam createServerClient
 * (lihat node_modules/@supabase/ssr/dist/main/createServerClient.js baris 37:
 * `flowType: "pkce"` ditulis SETELAH `...options.auth`, sehingga tidak bisa
 * ditimpa lewat opsi). Akibatnya setiap `resetPasswordForEmail` mengirim
 * `code_challenge` ke /auth/v1/recover.
 *
 * Bila code_challenge ikut terkirim, GoTrue TIDAK menyimpan OTP sebagai hash
 * biasa, melainkan sebagai `pkce_<sha224(email + kode)>`. Token berawalan
 * "pkce_" itu tidak pernah cocok dengan `verifyOtp({ type: "recovery" })`,
 * sehingga kode yang benar sekalipun selalu dijawab "Kode salah atau sudah
 * kedaluwarsa". Inilah penyebab kegagalan alur sebelumnya.
 *
 * Tanpa code_challenge, GoTrue menyimpan `sha224(email + kode)` polos dan
 * `verifyOtp` berhasil. Jadi klien ini sengaja dibuat dengan flowType
 * "implicit" (yang berarti: tidak mengirim code_challenge).
 *
 * Klien ini TIDAK menyimpan sesi sendiri. Setelah kode terverifikasi, sesi
 * pemulihan hasil verifyOtp dipasang ke cookie lewat klien server biasa
 * (createClient) agar proxy dan Server Action lain bisa membacanya.
 */
export function createClientOtp() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      flowType: "implicit",
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: OPSI_DB_SUPABASE,
    global: { fetch: fetchDenganBatasWaktu },
  });
}
