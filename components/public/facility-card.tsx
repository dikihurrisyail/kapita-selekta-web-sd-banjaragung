import Link from "next/link";
import { Foto } from "@/components/ui/foto";
import type { Fasilitas } from "@/lib/data/types";

/** Kartu fasilitas: foto + judul 20px + deskripsi 14px + tautan. */
export function FacilityCard({ item }: { item: Fasilitas }) {
  return (
    <article className="flex w-full flex-col gap-5">
      <Foto
        src={item.foto.src}
        label={item.foto.label}
        className="aspect-video w-full"
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold leading-[1.25] text-brand-ink">
          {item.judul}
        </h3>
        <p className="text-sm leading-[1.5] text-body">{item.deskripsi}</p>
        <Link
          href="/profil"
          className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
        >
          Lihat detail →
        </Link>
      </div>
    </article>
  );
}
