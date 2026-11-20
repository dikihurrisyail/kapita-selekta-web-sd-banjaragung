import type { Metadata } from "next";
import { Suspense } from "react";
import { PemulihanSandi } from "@/components/admin/pemulihan-sandi";

export const metadata: Metadata = { title: "Lupa Kata Sandi" };

/**
 * Halaman pemulihan kata sandi.
 *
 * Seluruh alur (email -> kode verifikasi -> sandi baru) terjadi di satu halaman.
 * Tidak ada tautan yang diklik dari email, sehingga tidak bergantung pada
 * Site URL, Redirect URLs, maupun perangkat yang dipakai membuka email.
 */
export default function LupaSandiPage() {
  return (
    <Suspense fallback={<Kerangka />}>
      <PemulihanSandi />
    </Suspense>
  );
}

function Kerangka() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white px-6"
      aria-busy="true"
    >
      <div className="flex w-full max-w-[580px] flex-col gap-5">
        <div className="size-8 rounded-btn bg-page-alt" />
        <div className="h-7 w-64 rounded-btn bg-page-alt" />
        <div className="h-4 w-full max-w-[420px] rounded-btn bg-page-alt" />
        <div className="mt-4 h-11 w-full rounded-btn bg-page-alt" />
        <div className="h-11 w-32 rounded-btn bg-page-alt" />
      </div>
    </div>
  );
}
