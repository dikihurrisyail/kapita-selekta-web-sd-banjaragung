import type { Metadata } from "next";
import { Suspense } from "react";
import { FormFasilitas } from "@/components/admin/form-fasilitas";
import { getFasilitas } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Fasilitas Sekolah" };

export default function AdminFasilitasPage() {
  return (
    <Suspense fallback={<FasilitasKerangka />}>
      <IsiFasilitas />
    </Suspense>
  );
}

async function IsiFasilitas() {
  const fasilitas = await getFasilitas();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold tracking-wide text-accent-ink uppercase">
          Pengelolaan
        </p>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">
          Fasilitas Sekolah
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Tambah atau hapus fasilitas yang tampil di halaman Profil sekolah.
        </p>
      </div>

      <FormFasilitas awal={fasilitas} />
    </div>
  );
}

function FasilitasKerangka() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">Memuat fasilitas…</span>
      <div className="h-3 w-24 rounded-pill bg-page-alt" />
      <div className="h-8 w-64 rounded-btn bg-page-alt" />
      <div className="h-72 rounded-card bg-page-alt" />
    </div>
  );
}
