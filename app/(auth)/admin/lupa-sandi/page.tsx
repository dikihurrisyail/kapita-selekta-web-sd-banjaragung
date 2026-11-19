import type { Metadata } from "next";
import { Suspense } from "react";
import { KeyRound } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { PanelAuth } from "@/components/admin/panel-auth";
import { FormLupaSandi } from "@/components/admin/form-lupa-sandi";

export const metadata: Metadata = { title: "Lupa Kata Sandi" };

type Props = { searchParams: Promise<{ galat?: string }> };

/**
 * Halaman permintaan tautan pemulihan kata sandi.
 *
 * `galat` diisi oleh /auth/confirm ketika tautan dari email tidak bisa
 * dipakai (kedaluwarsa, sudah pernah dipakai, atau token rusak).
 */
export default function LupaSandiPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<Kerangka />}>
      <IsiHalaman searchParams={searchParams} />
    </Suspense>
  );
}

async function IsiHalaman({ searchParams }: Props) {
  const { galat } = await searchParams;

  return (
    <PanelAuth
      ikon={<KeyRound className="size-5" aria-hidden />}
      judul="Lupa kata sandi?"
      deskripsi="Masukkan email administrator sekolah. Kami akan mengirim tautan untuk membuat kata sandi baru."
    >
      <div className="flex flex-col gap-5">
        {galat ? (
          <Alert tone="bahaya">
            {galat === "kedaluwarsa"
              ? "Tautan pemulihan sudah kedaluwarsa atau pernah dipakai. Silakan minta tautan baru di bawah ini."
              : "Tautan pemulihan tidak valid. Silakan minta tautan baru di bawah ini."}
          </Alert>
        ) : null}

        <FormLupaSandi />
      </div>
    </PanelAuth>
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
