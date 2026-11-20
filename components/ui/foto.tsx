import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Placeholder foto. Desain memakai layer "Foto dokumentasi ilustratif"
 * (rounded-rectangle) yang belum berisi aset nyata.
 * Setelah aset resmi tersedia, ganti dengan next/image.
 */
export function FotoPlaceholder({
  label,
  className,
  ratio,
  ringkas = false,
}: {
  label: string;
  className?: string;
  ratio?: string;
  /** Untuk thumbnail kecil (avatar tabel): hanya ikon, label jadi aria-label. */
  ringkas?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-img border border-line-soft bg-page-alt text-center",
        ringkas ? "gap-0" : "gap-2",
        className,
      )}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={label}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #e2e8f0 0 1px, transparent 1px 12px)",
        }}
      />
      <ImageIcon
        className={cn("relative text-line-soft", ringkas ? "size-4" : "size-7")}
        aria-hidden
      />
      {ringkas ? null : (
        <span className="relative max-w-[85%] px-3 text-[11px] leading-[1.4] text-muted">
          Foto belum tersedia
        </span>
      )}
    </div>
  );
}

/** Foto dari data: pakai <img> bila src ada, placeholder bila belum. */
export function Foto({
  src,
  label,
  className,
  ratio,
  ringkas,
}: {
  src: string | null;
  label: string;
  className?: string;
  ratio?: string;
  ringkas?: boolean;
}) {
  if (!src)
    return (
      <FotoPlaceholder
        label={label}
        className={className}
        ratio={ratio}
        ringkas={ringkas}
      />
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      className={cn("rounded-img object-cover", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    />
  );
}
