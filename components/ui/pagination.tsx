import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Paginasi: keterangan + tombol prev / nomor / next (44px). */
export function Pagination({
  halaman = 1,
  total = 3,
  keterangan,
  className,
}: {
  halaman?: number;
  total?: number;
  keterangan?: ReactNode;
  className?: string;
}) {
  const nomor = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav
      aria-label="Navigasi halaman"
      className={cn("flex flex-wrap items-center justify-between gap-4", className)}
    >
      <p className="text-sm leading-[1.5] text-muted">
        {keterangan ?? `Halaman ${halaman} dari ${total}`}
      </p>
      <div className="flex items-center gap-2">
        <PaginationArrow label="Halaman sebelumnya" disabled={halaman === 1}>
          <ChevronLeft className="size-4" aria-hidden />
        </PaginationArrow>
        {nomor.map((n) => (
          <Link
            key={n}
            href={`?halaman=${n}`}
            aria-current={n === halaman ? "page" : undefined}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-btn border text-sm font-semibold",
              n === halaman
                ? "border-brand bg-brand text-white"
                : "border-line-soft bg-white text-body hover:bg-page-alt",
            )}
          >
            {n}
          </Link>
        ))}
        <PaginationArrow label="Halaman berikutnya" disabled={halaman === total}>
          <ChevronRight className="size-4" aria-hidden />
        </PaginationArrow>
      </div>
    </nav>
  );
}

function PaginationArrow({
  children,
  label,
  disabled,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <span
      aria-label={label}
      aria-disabled={disabled}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-btn border border-line-soft bg-white text-body",
        disabled && "cursor-not-allowed text-line-soft",
      )}
    >
      {children}
    </span>
  );
}
