"use client";

import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { PanelAuth } from "@/components/admin/panel-auth";
import { FormSandiBaru } from "@/components/admin/form-sandi-baru";
import { createClient } from "@/lib/supabase/client";

type Keadaan =
  | { tahap: "memeriksa" }
  | { tahap: "siap"; email: string }
  | { tahap: "galat"; pesan: string };

/** Hasil penukaran token, dipakai bersama oleh semua pemanggil. */
type HasilTukar = { email: string } | { pesan: string };

/**
 * Penukaran token disimpan di tingkat modul, bukan di dalam komponen.
 *
 * Alasannya: pada mode pengembangan React menjalankan useEffect dua kali
 * (StrictMode). Kalau penukaran dijalankan dua kali dengan token yang sama,
 * panggilan kedua gagal — Supabase memutar (rotate) token setiap kali dipakai,
 * dan kode PKCE hanya boleh ditukar sekali. Dengan satu promise bersama, kedua
 * jalankan menunggu hasil yang sama dan hanya ada satu permintaan ke Supabase.
 */
let janjiTukar: Promise<HasilTukar> | null = null;

/**
 * Tukar tautan pemulihan menjadi sesi.
 *
 * Supabase bisa mengirim DUA bentuk tautan, tergantung alur yang dipakai:
 *
 *   1. PKCE (yang dipakai aplikasi ini, karena @supabase/ssr memakai
 *      flowType "pkce" untuk Server Action):
 *        /admin/sandi-baru?code=xxxxxxxx
 *      Kode ditukar memakai code_verifier yang tersimpan di cookie browser.
 *
 *   2. Implicit (tautan bawaan dashboard / template email lama):
 *        /admin/sandi-baru#access_token=...&refresh_token=...
 *      Token ada di fragment, ditukar langsung lewat setSession().
 *
 * Keduanya ditangani supaya alur tidak bergantung pada template email mana
 * yang sedang dipakai di dashboard.
 */
async function tukarToken(): Promise<HasilTukar> {
  const supabase = createClient();

  /* ---------------------------------------------------------- Bentuk PKCE */
  const kode = new URLSearchParams(window.location.search).get("code");

  if (kode) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(kode);

    /* Bersihkan ?code= dari address bar agar tidak ikut tersalin/dibagikan. */
    window.history.replaceState(null, "", window.location.pathname);

    if (error || !data.user) {
      return {
        pesan:
          "Tautan pemulihan gagal diproses. Kemungkinan sudah kedaluwarsa atau dibuka di browser/perangkat yang berbeda dari saat meminta tautan. Silakan minta tautan baru dari browser ini.",
      };
    }

    return { email: data.user.email ?? "" };
  }

  /* ------------------------------------------------------ Bentuk implicit */
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const galat = params.get("error_description") ?? params.get("error");

  if (galat) {
    window.history.replaceState(null, "", window.location.pathname);
    return {
      pesan:
        "Tautan pemulihan tidak berlaku atau sudah kedaluwarsa. Silakan minta tautan baru.",
    };
  }

  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    /*
     * Fragment baru dibersihkan setelah penukaran berhasil. Kalau dibersihkan
     * lebih dulu dan penukaran gagal, tokennya hilang tanpa pernah terpakai.
     */
    window.history.replaceState(null, "", window.location.pathname);

    if (error || !data.user) {
      return {
        pesan:
          "Sesi pemulihan gagal dibuat. Tautan mungkin sudah kedaluwarsa — silakan minta tautan baru.",
      };
    }

    return { email: data.user.email ?? "" };
  }

  /*
   * Tidak ada kode maupun token. Bisa jadi halaman dimuat ulang setelah sesi
   * terbentuk, jadi periksa sesi yang sudah ada di cookie.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return { email: user.email ?? "" };

  return {
    pesan:
      "Sesi pemulihan tidak ditemukan. Buka tautan dari email pemulihan, atau minta tautan baru.",
  };
}

/**
 * Penangkap sesi dari tautan pemulihan kata sandi.
 *
 * Verifikasi sesi yang sesungguhnya tetap dilakukan di server, di dalam
 * Server Action `simpanSandiBaru`. Komponen ini hanya menyiapkan sesi.
 */
export function PenangkapPemulihan() {
  const [keadaan, setKeadaan] = useState<Keadaan>({ tahap: "memeriksa" });

  useEffect(() => {
    let dibatalkan = false;

    /* Satu penukaran untuk semua jalankan (aman terhadap StrictMode). */
    janjiTukar ??= tukarToken();

    janjiTukar
      .then((hasil) => {
        if (dibatalkan) return;
        setKeadaan(
          "email" in hasil
            ? { tahap: "siap", email: hasil.email }
            : { tahap: "galat", pesan: hasil.pesan },
        );
      })
      .catch(() => {
        if (dibatalkan) return;
        setKeadaan({
          tahap: "galat",
          pesan: "Terjadi kendala saat memeriksa tautan. Silakan minta tautan baru.",
        });
      });

    return () => {
      dibatalkan = true;
    };
  }, []);

  if (keadaan.tahap === "memeriksa") {
    return (
      <PanelAuth
        ikon={<KeyRound className="size-5" aria-hidden />}
        judul="Memeriksa tautan pemulihan"
        deskripsi="Mohon tunggu sebentar, kami sedang memverifikasi tautan dari email Anda."
      >
        <div className="flex flex-col gap-4" aria-busy="true">
          <div className="h-11 w-full rounded-btn bg-page-alt" />
          <div className="h-11 w-full rounded-btn bg-page-alt" />
          <div className="h-11 w-48 rounded-btn bg-page-alt" />
        </div>
      </PanelAuth>
    );
  }

  if (keadaan.tahap === "galat") {
    return (
      <PanelAuth
        ikon={<KeyRound className="size-5" aria-hidden />}
        judul="Tautan tidak berlaku"
        deskripsi="Tautan pemulihan hanya bisa dipakai sekali dan berlaku terbatas."
      >
        <div className="flex flex-col gap-5">
          <Alert tone="bahaya">{keadaan.pesan}</Alert>
          <a
            href="/admin/lupa-sandi"
            className="inline-flex min-h-11 items-center justify-center rounded-btn border border-accent bg-accent px-6 py-2.5 text-sm font-semibold leading-[1.5] text-brand-ink hover:bg-[#c26b05]"
          >
            Minta tautan baru
          </a>
        </div>
      </PanelAuth>
    );
  }

  return (
    <PanelAuth
      ikon={<KeyRound className="size-5" aria-hidden />}
      judul="Buat kata sandi baru"
      deskripsi="Masukkan kata sandi baru untuk akun administrator Anda, lalu masuk kembali."
    >
      <FormSandiBaru email={keadaan.email} />
    </PanelAuth>
  );
}
