import type { ReactNode } from "react";

/**
 * Kerangka halaman autentikasi satu kolom.
 *
 * Memakai token desain yang sama dengan panel kanan halaman masuk
 * (radius, warna, ukuran teks) supaya halaman pemulihan kata sandi terasa
 * bagian dari alur yang sama, bukan halaman tempelan.
 */
export function PanelAuth({
  ikon,
  judul,
  deskripsi,
  children,
}: {
  ikon: ReactNode;
  judul: string;
  deskripsi: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="flex w-full max-w-[580px] flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="flex size-8 items-center justify-center rounded-btn bg-page-alt text-brand">
            {ikon}
          </span>
          <h1 className="text-2xl font-bold leading-[1.3] text-brand-ink lg:text-[28px]">
            {judul}
          </h1>
          <p className="text-sm leading-[1.5] text-body">{deskripsi}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
