import { createBrowserClient } from "@supabase/ssr";
import { OPSI_DB_SUPABASE, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { Database } from "./types";

/**
 * Klien Supabase untuk komponen client ("use client").
 * Dipakai untuk: login, logout, upload file langsung dari browser.
 */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: OPSI_DB_SUPABASE,
  });
}
