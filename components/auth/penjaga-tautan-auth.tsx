"use client";

import { useEffect } from "react";

/**
 * Penjaga tautan autentikasi dari email.
 *
 * MASALAH YANG DISELESAIKAN
 * Supabase mengarahkan tautan pemulihan ke **Site URL** yang diatur di
 * dashboard (biasanya alamat root situs), bukan ke halaman aplikasi. Kalau
 * beranda tidak memproses parameter itu, sesinya terbuang dan pengguna hanya
 * melihat beranda. Bila nanti ia membuka /admin/sandi-baru secara manual,
 * halaman itu tidak menemukan token sehingga muncul "Tautan tidak berlaku".
 *
 * ADA DUA BENTUK TAUTAN
 *   1. PKCE (dipakai aplikasi ini):  /?code=xxxxxxxx
 *   2. Implicit:                     /#access_token=...&refresh_token=...
 *
 * Komponen ini dipasang di root layout, jadi berjalan di halaman mana pun.
 * Begitu mendeteksi salah satu bentuk di atas, ia meneruskan ke
 * /admin/sandi-baru dengan membawa serta query (?code=) atau fragment
 * (#access_token=) apa adanya.
 *
 * Penukaran token sengaja TIDAK dilakukan di sini: kode PKCE dan refresh token
 * hanya bisa dipakai sekali, jadi kalau dua tempat mencoba menukarnya, salah
 * satunya pasti gagal.
 */
export function PenjagaTautanAuth() {
  useEffect(() => {
    const TUJUAN = "/admin/sandi-baru";

    /* Sudah di halaman penukar — biarkan halaman itu yang menangani. */
    if (window.location.pathname === TUJUAN) return;

    /* ------------------------------------------------------- Bentuk PKCE */
    const kode = new URLSearchParams(window.location.search).get("code");
    if (kode) {
      window.location.replace(`${TUJUAN}${window.location.search}`);
      return;
    }

    /* --------------------------------------------------- Bentuk implicit */
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const adaToken = params.get("access_token") && params.get("refresh_token");
    const adaGalat = params.get("error") || params.get("error_description");
    const tipe = params.get("type");

    if (!adaToken && !adaGalat) return;

    /*
     * Selain pemulihan (mis. undangan), tidak ada halaman yang menanganinya.
     * Cukup bersihkan fragment agar tidak tertinggal di riwayat browser.
     */
    if (tipe && tipe !== "recovery" && tipe !== "invite") {
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    /* Teruskan token apa adanya (fragment tetap utuh) ke halaman penukar. */
    window.location.replace(`${TUJUAN}${window.location.hash}`);
  }, []);

  return null;
}
