import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Pengumuman } from "@/lib/data/types";
import { formatTanggal } from "@/lib/utils/format-date";

/**
 * Kartu pengumuman (layer "Kartu pengumuman"):
 * min-h 300, padding 24, gap 16, radius 12, border #E2E8F0.
 * Aksen 48×3 bg #D97706 menempel di tepi atas (left 23, top -1).
 */
export function AnnouncementCard({ item }: { item: Pengumuman }) {
  return (
    <Card
      as="article"
      className="relative flex min-h-[300px] w-full flex-col gap-4 p-6"
    >
      <span
        aria-hidden
        className="absolute -top-px left-[23px] h-[3px] w-12 bg-accent"
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-[1.4] whitespace-nowrap text-muted">
          {formatTanggal(item.tanggal)}
        </p>
        <Badge>{item.kategori}</Badge>
      </div>
      <h3 className="text-xl font-semibold leading-[1.35] text-brand-ink">
        {item.judul}
      </h3>
      <p className="text-sm leading-[1.5] text-body">{item.ringkasan}</p>
      <Link
        href={`/pengumuman/${item.slug}`}
        className="mt-auto text-sm font-semibold leading-[1.5] text-brand hover:underline"
      >
        Baca Selengkapnya →
      </Link>
    </Card>
  );
}
