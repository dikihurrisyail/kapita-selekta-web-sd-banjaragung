import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Foto } from "@/components/ui/foto";
import type { Album } from "@/lib/data/types";
import { formatTanggal } from "@/lib/utils/format-date";

/**
 * Kartu album galeri (layer "Album dokumentasi", 588×486):
 * foto 358px, keterangan padding 20 (kategori · judul · meta).
 */
export function AlbumCard({ item }: { item: Album }) {
  return (
    <Card as="article" className="flex w-full flex-col overflow-hidden">
      <Foto
        src={item.foto.src}
        label={item.foto.label}
        className="aspect-[16/10] w-full rounded-none"
      />
      <div className="flex flex-col gap-1.5 p-5">
        <p className="text-xs leading-[1.4] text-muted">{item.kategori}</p>
        <h3 className="text-xl font-semibold leading-[1.35] text-brand-ink">
          {item.judul}
        </h3>
        <p className="text-xs leading-[1.4] text-muted">
          {formatTanggal(item.tanggal)} • {item.jumlahFoto} foto
        </p>
        <Link
          href={`/galeri?album=${item.slug}`}
          className="mt-1 text-sm font-semibold leading-[1.5] text-brand hover:underline"
        >
          Lihat album →
        </Link>
      </div>
    </Card>
  );
}
