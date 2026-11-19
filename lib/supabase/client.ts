import { createBrowserClient } from "@supabase/ssr";
import { OPSI_DB_SUPABASE, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { Database } from "./types";

/**
 * Klien Supabase untuk komponen client ("use client").
 *
 * flowType "implicit" dipilih dengan sengaja.
 *
 * Secara bawaan @supabase/ssr memakai PKCE: permintaan reset kata sandi
 * mengirim code_challenge, dan tautan di email berbentuk `?code=...`. Kode itu
 * harus ditukar memakai `code_verifier` yang tersimpan sebagai cookie di
 * browser yang meminta tautan. Akibatnya tautan menjadi rapuh:
 *
 *   * gagal bila email dibuka di perangkat/browser lain (kasus yang sangat
 *     umum: minta tautan di laptop, buka email di ponsel);
 *   * gagal bila cookie terhapus atau mode penyamaran ditutup;
 *   * sulit diuji karena bergantung pada cookie yang tidak terlihat.
 *
 * Dengan implicit, tautan membawa token di fragment URL. Fragment hanya
 * terbaca oleh JavaScript di halaman kita, tidak pernah dikirim ke server
 * mana pun, dan bisa ditukar menjadi sesi dari perangkat mana saja. Untuk
 * alur pemulihan kata sandi ini jauh lebih andal.
 *
 * Catatan: Server Action tetap memakai PKCE (lib/supabase/server.ts) karena
 * di sanalah cookie HttpOnly tersedia dan tidak ada perpindahan perangkat.
 */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: OPSI_DB_SUPABASE,
    auth: { flowType: "implicit" },
  });
}
