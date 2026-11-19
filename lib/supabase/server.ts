import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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
 */
export async function createClient() {
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
