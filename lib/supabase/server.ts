import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { io } from "next/cache";
import {
  fetchDenganBatasWaktu,
  OPSI_DB_SUPABASE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./config";
import type { Database } from "./types";

/**
 * Klien Supabase untuk Server Component, Server Action, dan Route Handler.
 *
 * Memakai cookies() milik Next.js agar sesi login ikut terbaca di server.
 * `setAll` dibungkus try/catch karena Server Component tidak boleh menulis
 * cookie — penulisan sesi ditangani oleh proxy.ts.
 *
 * `global.fetch` diganti versi berbatas waktu dan `db.retry` dimatikan agar
 * query tidak menggantung ketika Supabase tidak dapat dijangkau.
 *
 * `await io()` WAJIB ada di sini. Saat createServerClient dipanggil, auth-js
 * membaca sesi dari cookie dan membandingkan `expires_at` dengan Date.now().
 * Dengan cacheComponents aktif, Date.now() dianggap nilai tidak stabil sehingga
 * prerender gagal ("Next.js encountered the unstable value `Date.now()`").
 * io() menandai bahwa kode setelahnya adalah runtime, sehingga pemeriksaan itu
 * diizinkan dan halaman tetap bisa dirender sebagian (Partial Prerender).
 */
export async function createClient() {
  /*
   * io() harus dipanggil SEBELUM cookies(). Saat prerender, cookies() baru
   * menolak ketika prerender selesai (Hanging Promise); kalau io() lebih dulu,
   * prerender berhenti di sini dan cookies() tidak pernah dieksekusi pada
   * tahap itu — sehingga tidak ada error "cookies() rejects" di log build.
   */
  await io();
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Dipanggil dari Server Component — abaikan, sesi diurus proxy. */
        }
      },
    },
    db: OPSI_DB_SUPABASE,
    global: { fetch: fetchDenganBatasWaktu },
  });
}

/**
 * Klien dengan hak istimewa (service role). HANYA untuk tugas server:
 * seeding, migrasi, atau operasi administratif. Jangan pakai di halaman.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diisi. Variabel ini hanya diperlukan untuk tugas administratif di server.",
    );
  }
  return createServerClient<Database>(SUPABASE_URL, serviceKey, {
    cookies: { getAll: () => [], setAll: () => {} },
    db: OPSI_DB_SUPABASE,
    global: { fetch: fetchDenganBatasWaktu },
  });
}
