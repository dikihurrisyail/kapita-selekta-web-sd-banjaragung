"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { menuAdmin } from "@/lib/constants/site";
import { logoutAdmin } from "@/lib/actions/auth";

/**
 * Header admin — tinggi 88px, border-b, breadcrumb kiri + akun kanan.
 */
export function AdminHeader({ nama, email }: { nama?: string; email?: string }) {
  const pathname = usePathname();
  const current =
    menuAdmin.find((m) =>
      m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href),
    ) ?? menuAdmin[0];

  const inisial = (nama ?? "Administrator")
    .split(" ")
    .map((k) => k[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line bg-white px-4 sm:px-6 lg:h-[88px] lg:gap-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="min-w-0 text-sm leading-[1.5] text-muted">
        <Link href="/admin" className="hover:text-brand">
          Admin
        </Link>
        <span className="px-2">/</span>
        <span className="font-semibold text-brand-ink">{current.label}</span>
      </nav>

      <div className="flex shrink-0 items-center gap-3 lg:gap-5">
        <Link
          href="/"
          className="hidden items-center gap-1.5 text-sm font-semibold text-brand hover:underline md:flex"
        >
          Lihat website
          <ExternalLink className="size-4" aria-hidden />
        </Link>

        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-pill bg-brand text-xs font-bold text-white"
          >
            {inisial || "AD"}
          </span>
          <span className="hidden flex-col leading-[1.3] sm:flex">
            <span className="text-sm font-semibold text-brand-ink">
              {nama ?? "Administrator"}
            </span>
            <span className="text-[11px] text-muted">{email ?? "—"}</span>
          </span>
        </div>

        <form action={logoutAdmin}>
          <button
            type="submit"
            aria-label="Keluar dari panel admin"
            className="inline-flex size-9 items-center justify-center rounded-btn border border-line-soft text-muted hover:bg-page-alt hover:text-danger"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </form>
      </div>
    </header>
  );
}
