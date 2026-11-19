import type { ReactNode } from "react";

/**
 * Kerangka tabel admin (skeleton) — dipakai sebagai fallback <Suspense>
 * pada halaman yang membaca searchParams.
 */
export function TabelKerangka({ kolom = 4 }: { kolom?: number }) {
  return (
    <div
      className="overflow-hidden rounded-card border border-line bg-white"
      aria-busy="true"
    >
      <div className="flex gap-6 border-b border-line bg-page px-6 py-3">
        {Array.from({ length: kolom }).map((_, i) => (
          <div key={i} className="h-3 flex-1 rounded-pill bg-line" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 border-b border-line px-6 py-4 last:border-0">
          <div className="flex flex-1 items-center gap-3">
            <div className="size-11 shrink-0 rounded-pill bg-page-alt" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-32 rounded-pill bg-page-alt" />
              <div className="h-2.5 w-20 rounded-pill bg-page-alt" />
            </div>
          </div>
          <div className="h-3 w-24 flex-1 rounded-pill bg-page-alt" />
          <div className="h-5 w-16 flex-1 rounded-pill bg-page-alt" />
          <div className="h-9 w-20 flex-1 rounded-btn bg-page-alt" />
        </div>
      ))}
    </div>
  );
}

/** Kerangka judul halaman admin. */
export function JudulAdmin({
  eyebrow,
  judul,
  deskripsi,
  aksi,
}: {
  eyebrow: string;
  judul: string;
  deskripsi: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold tracking-wide text-accent-ink uppercase">{eyebrow}</p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">{judul}</h1>
        {aksi}
      </div>
      <p className="text-sm leading-[1.5] text-body">{deskripsi}</p>
    </div>
  );
}
