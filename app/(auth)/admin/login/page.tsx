import type { Metadata } from "next";
import { Suspense } from "react";
import { getProfil } from "@/lib/data/queries";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Masuk Admin" };

type Props = { searchParams: Promise<{ lanjut?: string; pulih?: string }> };

/**
 * Halaman login admin.
 *
 * `searchParams` dibaca di dalam <Suspense> (bukan di komponen halaman) agar
 * navigasi tetap instan dan prerender tidak terblokir — syarat Cache Components
 * pada Next 16.
 */
export default function LoginPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<LoginKerangka />}>
      <LoginDinamis searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginDinamis({ searchParams }: Props) {
  const { lanjut, pulih } = await searchParams;

  /* Hanya izinkan tujuan internal /admin untuk mencegah open redirect. */
  const tujuan = lanjut?.startsWith("/admin") ? lanjut : "/admin";

  const profil = await getProfil();

  return (
    <LoginForm lanjut={tujuan} baruDipulihkan={pulih === "1"} logoUrl={profil.logoUrl} />
  );;
}

/** Kerangka dua kolom dengan proporsi sama seperti form asli. */
function LoginKerangka() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row" aria-busy="true">
      <div className="w-full bg-brand lg:w-[660px] lg:shrink-0" />
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="flex w-full max-w-[580px] flex-col gap-5">
          <div className="size-8 rounded-btn bg-page-alt" />
          <div className="h-7 w-64 rounded-btn bg-page-alt" />
          <div className="h-4 w-full max-w-[420px] rounded-btn bg-page-alt" />
          <div className="mt-4 h-11 w-full rounded-btn bg-page-alt" />
          <div className="h-11 w-full rounded-btn bg-page-alt" />
          <div className="h-11 w-32 rounded-btn bg-page-alt" />
        </div>
      </div>
    </div>
  );
}
