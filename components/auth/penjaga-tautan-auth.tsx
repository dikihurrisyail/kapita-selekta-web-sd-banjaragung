"use client";

import { useEffect } from "react";

/**
 * Penjaga tautan autentikasi dari email.
 *
 * MASALAH YANG DISELESAIKAN
 * Supabase mengarahkan tautan pemulihan kata sandi ke **Site URL** yang diatur
 * di dashboard (biasanya alamat root situs), lalu menempelkan token sebagai
 * fragment: `https://situs/#access_token=...&type=recovery`. Fragment tidak
 * pernah dikirim ke server, jadi kalau halaman root hanya berisi beranda,
 * token itu terbuang dan pengguna melihat beranda biasa — bukan form sandi
 * baru. Bila nanti ia membuka /admin/sandi-baru secara manual, halaman itu
 * sudah tidak menemukan token sehingga muncul "Tautan tidak berlaku".
 *
 * Komponen ini dipasang di root layout, jadi berjalan di halaman mana pun.
 * Begitu mendeteksi fragment autentikasi, ia meneruskan token ke
 * /admin/sandi-baru (menjaga fragment tetap utuh), dan halaman itulah yang
 * menukarnya menjadi sesi.
 *
 * Penukaran sengaja TIDAK dilakukan di sini: refresh token hanya bisa dipakai
 * sekali, jadi kalau dua tempat mencoba menukarnya, salah satunya gagal.
 */
export function PenjagaTautanAuth() {
  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const adaToken = params.get("access_token") && params.get("refresh_token");
    const adaGalat = params.get("error") || params.get("error_description");
    const tipe = params.get("type");

    /* Hanya tangani fragment autentikasi; fragment lain abaikan. */
    if (!adaToken && !adaGalat) return;

    const tujuan = "/admin/sandi-baru";

    /* Sudah di halaman tujuan — biarkan halaman itu yang menangani. */
    if (window.location.pathname === tujuan) return;

    /*
     * Tautan selain pemulihan (mis. undangan atau konfirmasi email) tetap
     * diarahkan ke halaman sandi baru? Tidak — hanya pemulihan yang punya
     * halaman. Untuk tipe lain, cukup bersihkan fragment agar tidak
     * tertinggal di riwayat browser.
     */
    if (tipe && tipe !== "recovery" && tipe !== "invite") {
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    /* Teruskan token apa adanya (termasuk fragment) ke halaman penukar. */
    window.location.replace(`${tujuan}${window.location.hash}`);
  }, []);

  return null;
}
