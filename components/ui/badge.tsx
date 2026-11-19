import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "netral" | "sukses" | "peringatan" | "bahaya" | "brand";

const toneClass: Record<BadgeTone, string> = {
  netral: "bg-page-alt text-brand",
  brand: "bg-brand text-white",
  sukses: "bg-success-bg text-success",
  peringatan: "bg-warning-bg text-warning",
  bahaya: "bg-danger-bg text-danger",
};

/**
 * Chip/status — radius 100px, padding 4px 9px, teks 12px SemiBold.
 * Sesuai layer "Status" / "Label status" di Figma.
 */
export function Badge({
  children,
  tone = "netral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-pill px-[9px] py-1 text-xs font-semibold leading-[1.4] whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Pemetaan status konten ke nada badge. */
export function toneUntukStatus(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (s.includes("terbit") || s.includes("sukses") || s.includes("aktif")) return "sukses";
  if (s.includes("draf") || s.includes("peringatan") || s.includes("menunggu")) return "peringatan";
  if (s.includes("hapus") || s.includes("gagal") || s.includes("error")) return "bahaya";
  return "netral";
}
