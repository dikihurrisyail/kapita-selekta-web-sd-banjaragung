/**
 * Konfigurasi Supabase.
 *
 * Nilai dibaca dari environment. Bila belum diisi, aplikasi berjalan dalam
 * "mode demo": seluruh query jatuh ke data placeholder di lib/data/fallback.ts
 * sehingga tampilan tetap utuh tanpa koneksi database.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Batas waktu satu permintaan ke Supabase (milidetik). */
const BATAS_WAKTU_MS = 8000;

/**
 * Opsi `db` untuk setiap klien Supabase.
 *
 * `retry: false` penting. Secara default supabase-js mencoba ulang permintaan
 * yang gagal selama ±7 detik. Saat host Supabase tidak dapat dijangkau (mis.
 * DNS gagal, proyek dihapus, atau jaringan sekolah terputus), setiap query
 * tertahan selama itu sebelum akhirnya jatuh ke data cadangan — sehingga satu
 * halaman terasa menggantung 7 detik. Dengan retry dimatikan, kegagalan
 * terdeteksi seketika dan fallback langsung dipakai.
 *
 * `timeout` menjaga agar permintaan yang menggantung (host hidup tapi tidak
 * menjawab) tetap dibatasi, bukan menunggu tanpa batas.
 */
export const OPSI_DB_SUPABASE = {
  retry: false,
  timeout: BATAS_WAKTU_MS,
} as const;

/** True bila URL & anon key sudah diisi dengan nilai yang wajar. */
export function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  if (SUPABASE_URL.includes("xxxxxxxxxxxx")) return false;
  if (SUPABASE_ANON_KEY.includes("ganti-dengan")) return false;
  return SUPABASE_URL.startsWith("http");
}

/**
 * Catat kegagalan Supabase dalam satu baris ringkas.
 *
 * Tanpa ini, setiap kegagalan mencetak objek error berlapis (message, details,
 * hint, code, stack) sehingga satu kunjungan halaman bisa menghasilkan belasan
 * blok log yang menutupi masalah sebenarnya.
 */
export function catatErrorSupabase(label: string, error: unknown): void {
  const pesan =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);

  /* Ringkas: hanya baris pertama, tanpa dump stack. */
  const ringkas = pesan.split("\n")[0].slice(0, 200);
  console.error(`[supabase] gagal memuat ${label}: ${ringkas}`);
}

/**
 * fetch dengan batas waktu.
 *
 * Supabase-js memakai fetch global yang default-nya tanpa timeout. Bila host
 * tidak dapat dijangkau (DNS gagal, jaringan lambat), setiap query bisa
 * menggantung lama dan halaman ikut tertahan. Wrapper ini memastikan kegagalan
 * terjadi cepat sehingga fallback segera dipakai.
 */
export function fetchDenganBatasWaktu(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  /* AbortSignal.timeout tidak tersedia di semua runtime; sediakan cadangan. */
  const sinyal =
    typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
      ? AbortSignal.timeout(BATAS_WAKTU_MS)
      : undefined;

  return fetch(input, { ...init, signal: init?.signal ?? sinyal });
}
