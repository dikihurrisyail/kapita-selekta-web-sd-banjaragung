import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Pembuka halaman (layer "Pembuka halaman", 1440×197):
 * eyebrow 12px @y36 · judul halaman @y69 · deskripsi @y131.
 * Padding vertikal 36px atas dan 40px bawah.
 */
export function PageIntro({
  eyebrow,
  judul,
  deskripsi,
  aksi,
  className,
}: {
  eyebrow?: string;
  judul: ReactNode;
  deskripsi?: ReactNode;
  aksi?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line bg-white", className)}>
      <div className="container-page flex flex-col gap-3 py-9 pb-10">
        {eyebrow ? (
          <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="max-w-[900px] text-[40px] font-bold leading-[1.15] text-brand-ink">
            {judul}
          </h1>
          {aksi}
        </div>
        {deskripsi ? (
          <p className="max-w-[760px] text-base leading-[1.6] text-body">
            {deskripsi}
          </p>
        ) : null}
      </div>
    </section>
  );
}
