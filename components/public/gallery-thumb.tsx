import { Foto } from "@/components/ui/foto";
import type { Album } from "@/lib/data/types";

/** Cuplikan galeri beranda: 3 thumbnail dengan caption 12px. */
export function GalleryThumb({
  item,
  className,
}: {
  item: Album;
  className?: string;
}) {
  return (
    <figure className={`flex flex-col gap-2.5 ${className ?? ""}`}>
      <Foto
        src={item.foto.src}
        label={item.foto.label}
        className="aspect-[16/10] w-full"
      />
      <figcaption className="text-xs leading-[1.4] text-muted">
        {item.judul}
      </figcaption>
    </figure>
  );
}
