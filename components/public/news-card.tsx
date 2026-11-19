import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Foto } from "@/components/ui/foto";
import type { Berita } from "@/lib/data/types";
import { formatTanggal } from "@/lib/utils/format-date";

/**
 * Kartu berita (layer "Kartu berita"):
 * min-h 468, radius 12, border #E2E8F0, gambar 216px radius 8,
 * ringkasan padding 20 gap 12.
 */
export function NewsCard({ item }: { item: Berita }) {
  return (
    <Card as="article" className="flex min-h-[468px] w-full flex-col overflow-hidden">
      <Foto
        src={item.foto.src}
        label={item.foto.label}
        className="h-[216px] w-full rounded-none rounded-t-[11px]"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs leading-[1.4] text-muted">
          {item.kategori} <span className="px-1">/</span> {formatTanggal(item.tanggal)}
        </p>
        <h3 className="text-xl font-semibold leading-[1.35] text-brand-ink">
          {item.judul}
        </h3>
        <p className="text-sm leading-[1.5] text-body">{item.ringkasan}</p>
        <div className="mt-auto flex items-start justify-between gap-3">
          <p className="text-xs leading-[1.4] whitespace-nowrap text-muted">
            {item.menitBaca} menit baca
          </p>
          <Link
            href={`/berita/${item.slug}`}
            className="text-sm font-semibold leading-[1.5] whitespace-nowrap text-brand hover:underline"
          >
            Baca berita →
          </Link>
        </div>
      </div>
    </Card>
  );
}
