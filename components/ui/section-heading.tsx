import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Judul bagian: eyebrow 12px Bold #B45309 + judul 32px Bold #0F172A
 * + tautan kanan 14px SemiBold #1E3A8A. Gap 10px antar elemen.
 */
export function SectionHeading({
  eyebrow,
  judul,
  tautan,
  href,
  className,
  align = "row",
}: {
  eyebrow?: string;
  judul: ReactNode;
  tautan?: string;
  href?: string;
  className?: string;
  align?: "row" | "stack";
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {eyebrow ? (
        <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
          {eyebrow}
        </p>
      ) : null}
      <div
        className={cn(
          "flex gap-4",
          align === "row"
            ? "flex-wrap items-center justify-between"
            : "flex-col items-start",
        )}
      >
        <h2 className="text-[32px] font-bold leading-[1.25] text-brand-ink">
          {judul}
        </h2>
        {tautan && href ? (
          <Link
            href={href}
            className="shrink-0 text-sm font-semibold leading-[1.5] whitespace-nowrap text-brand hover:underline"
          >
            {tautan}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
