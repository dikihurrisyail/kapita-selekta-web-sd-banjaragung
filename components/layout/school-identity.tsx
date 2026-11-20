import Link from "next/link";
import { BookOpen } from "lucide-react";
import { site } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

/**
 * Identitas sekolah — logo 44×48 (radius 6, bg #1E3A8A, ikon book-open 26)
 * + nama 20px Bold + tagline 11px. Gap 12px.
 *
 * Bila admin sudah mengunggah logo resmi, gambar logo menggantikan ikon
 * bawaan pada kotak yang sama sehingga tata letak tidak berubah.
 */
export function SchoolIdentity({
  variant = "light",
  logoUrl,
  className,
}: {
  variant?: "light" | "dark";
  logoUrl?: string | null;
  className?: string;
}) {
  const dark = variant === "dark";
  return (
    <Link
      href="/"
      className={cn("flex min-w-0 items-center gap-3", className)}
      aria-label={`${site.nama} — beranda`}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`Logo ${site.nama}`}
          className="h-12 w-11 shrink-0 rounded-btn object-contain"
        />
      ) : (
        <span
          className={cn(
            "flex h-12 w-11 shrink-0 items-center justify-center rounded-btn",
            dark ? "bg-brand-deep" : "bg-brand",
          )}
        >
          <BookOpen className="size-[26px] text-white" aria-hidden />
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            "text-base font-bold leading-[1.35] sm:text-xl sm:whitespace-nowrap",
            dark ? "text-white" : "text-brand",
          )}
        >
          {site.nama}
        </span>
        <span
          className={cn(
            "line-clamp-2 text-[11px] leading-[1.4] sm:line-clamp-none sm:whitespace-nowrap",
            dark ? "text-line-soft" : "text-muted",
          )}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
