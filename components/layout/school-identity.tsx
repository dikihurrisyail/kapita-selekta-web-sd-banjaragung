import Link from "next/link";
import { BookOpen } from "lucide-react";
import { site } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

/**
 * Identitas sekolah — logo 44×48 (radius 6, bg #1E3A8A, ikon book-open 26)
 * + nama 20px Bold + tagline 11px. Gap 12px.
 */
export function SchoolIdentity({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3", className)}
      aria-label={`${site.nama} — beranda`}
    >
      <span
        className={cn(
          "flex h-12 w-11 shrink-0 items-center justify-center rounded-btn",
          dark ? "bg-brand-deep" : "bg-brand",
        )}
      >
        <BookOpen className="size-[26px] text-white" aria-hidden />
      </span>
      <span className="flex flex-col gap-0.5">
        <span
          className={cn(
            "text-xl font-bold leading-[1.35] whitespace-nowrap",
            dark ? "text-white" : "text-brand",
          )}
        >
          {site.nama}
        </span>
        <span
          className={cn(
            "text-[11px] leading-[1.4] whitespace-nowrap",
            dark ? "text-line-soft" : "text-muted",
          )}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
