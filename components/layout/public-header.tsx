"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LinkPending } from "@/components/ui/link-pending";
import { ctaPpdb, menuPublik } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";
import { SchoolIdentity } from "./school-identity";

/**
 * Navigasi utama — tinggi 88px, border-b #E2E8F0.
 * Menu: 14px SemiBold, item aktif #1E3A8A dengan garis bawah 2px.
 * CTA "SPMB Info": bg #D97706, teks #0F172A.
 */
export function PublicHeader({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);

  const aktif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="w-full border-b border-line bg-white">
      <div className="container-page flex h-[84px] items-center justify-between gap-6">
        <SchoolIdentity logoUrl={logoUrl} />

        {/* Menu desktop — tersembunyi di bawah 1280px (frame 390 memakai tombol menu). */}
        <nav aria-label="Navigasi utama" className="hidden items-center gap-5 xl:flex">
          {menuPublik.map((item) => {
            const isAktif = aktif(item.href);
            return (
              <div
                key={item.href}
                className={cn(
                  "flex flex-col items-start border-b-2 py-3",
                  isAktif ? "border-brand" : "border-transparent",
                )}
              >
                <Link
                  href={item.href}
                  aria-current={isAktif ? "page" : undefined}
                  className={cn(
                    "relative text-sm font-semibold leading-[1.5] whitespace-nowrap",
                    isAktif ? "text-brand" : "text-body hover:text-brand",
                  )}
                >
                  {item.label}
                  <LinkPending className="absolute -right-5 top-1/2 size-3 -translate-y-1/2" />
                </Link>
              </div>
            );
          })}
          <Link
            href={ctaPpdb.href}
            className="inline-flex min-h-11 items-center justify-center rounded-btn border border-accent bg-accent px-4 py-2.5 text-sm font-semibold leading-[1.5] text-brand-ink hover:bg-[#c26b05]"
          >
            {ctaPpdb.label}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3 xl:hidden">
          <Link
            href={ctaPpdb.href}
            className="hidden min-h-11 items-center justify-center rounded-btn border border-accent bg-accent px-4 py-2.5 text-sm font-semibold leading-[1.5] text-brand-ink sm:inline-flex"
          >
            {ctaPpdb.label}
          </Link>
          <button
            type="button"
            onClick={() => setBuka((v) => !v)}
            aria-expanded={buka}
            aria-controls="menu-mobile"
            aria-label={buka ? "Tutup menu" : "Buka menu"}
            className="inline-flex size-11 items-center justify-center rounded-btn border border-line-soft text-brand-ink"
          >
            {buka ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {buka ? (
        <nav
          id="menu-mobile"
          aria-label="Navigasi utama (seluler)"
          className="border-t border-line bg-white xl:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {[...menuPublik, ctaPpdb].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setBuka(false)}
                  className={cn(
                    "block rounded-btn px-3 py-3 text-sm font-semibold",
                    aktif(item.href) ? "bg-page-alt text-brand" : "text-body",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
