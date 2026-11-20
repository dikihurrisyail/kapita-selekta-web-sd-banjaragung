"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";import {
  ClipboardList,
  Images,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Newspaper,
  School,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";
import { menuAdmin, site } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

const ikonMenu: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  school: School,
  users: Users,
  megaphone: Megaphone,
  newspaper: Newspaper,
  images: Images,
  "clipboard-list": ClipboardList,
};

/** Item yang tampil langsung di bottom nav (4 menu + tombol Menu). */
const pintasanMobile = ["/admin", "/admin/guru", "/admin/berita", "/admin/galeri"];

/**
 * Navigasi admin ringkas untuk layar < 1024px.
 * Mengikuti frame "Responsif — Dashboard Admin Mobile 390":
 * bottom nav 76px ("Navigasi admin ringkas") + panel akun 76px ("Akun admin mobile").
 */
export function AdminMobileNav({
  nama,
  email,
  logoUrl,
}: {
  nama?: string;
  email?: string;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);

  const aktif = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  /* Kunci scroll latar saat drawer terbuka. */
  useEffect(() => {
    if (!buka) return;
    const sebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = sebelumnya;
    };
  }, [buka]);

  const itemPintasan = menuAdmin.filter((m) => pintasanMobile.includes(m.href));

  return (
    <div className="lg:hidden">
      {/* Navigasi admin ringkas — 76px */}
      <nav
        aria-label="Navigasi admin ringkas"
        className="fixed inset-x-0 bottom-0 z-40 flex h-[76px] items-stretch border-t border-line bg-white pb-[env(safe-area-inset-bottom)]"
      >
        {itemPintasan.map((item) => {
          const Icon = ikonMenu[item.icon] ?? LayoutDashboard;
          const isAktif = aktif(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isAktif ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold leading-[1.2]",
                isAktif ? "text-brand" : "text-muted",
              )}
            >
              <Icon className="size-[22px]" aria-hidden />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setBuka(true)}
          aria-expanded={buka}
          aria-controls="menu-admin-mobile"
          className="flex flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold leading-[1.2] text-muted"
        >
          <Menu className="size-[22px]" aria-hidden />
          <span>Menu</span>
        </button>
      </nav>

      {/* Drawer menu lengkap */}
      {buka ? (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setBuka(false)}
            className="absolute inset-0 cursor-default bg-brand-ink/50"
          />
          <div
            id="menu-admin-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu admin"
            className="relative flex w-[280px] max-w-[85%] flex-col justify-between overflow-y-auto bg-brand-ink px-5 py-6"
          >
            <div className="flex flex-col gap-7">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href="/admin"
                  onClick={() => setBuka(false)}
                  className="flex items-center gap-3"
                >
                  {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo sekolah" className="h-11 w-11 shrink-0 rounded-btn object-contain" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-brand">
              <School className="size-[22px] text-white" aria-hidden />
            </span>
          )}
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-bold leading-[1.3] text-white">
                      {site.nama}
                    </span>
                    <span className="text-[11px] leading-[1.4] text-line-soft">
                      Panel administrator
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setBuka(false)}
                  aria-label="Tutup menu"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-btn text-line-soft hover:bg-brand-deep hover:text-white"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <nav aria-label="Navigasi admin (seluler)" className="flex flex-col gap-2">
                {menuAdmin.map((item) => {
                  const Icon = ikonMenu[item.icon] ?? LayoutDashboard;
                  const isAktif = aktif(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setBuka(false)}
                      aria-current={isAktif ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-btn px-3 text-sm font-semibold leading-[1.5]",
                        isAktif
                          ? "bg-brand text-white"
                          : "text-line-soft hover:bg-brand-deep hover:text-white",
                      )}
                    >
                      <Icon className="size-5 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Akun admin mobile — 76px */}
            <div className="mt-6 flex h-[76px] items-center justify-between gap-3 border-t border-line-dark pt-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-brand text-xs font-bold text-white"
                >
                  AD
                </span>
                <span className="flex min-w-0 flex-col leading-[1.3]">
                  <span className="truncate text-sm font-semibold text-white">
                    {nama ?? "Administrator"}
                  </span>
                  <span className="truncate text-[11px] text-line-soft">
                    {email ?? "—"}
                  </span>
                </span>
              </div>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  aria-label="Keluar"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-btn text-line-soft hover:bg-brand-deep hover:text-white"
                >
                  <LogOut className="size-5" aria-hidden />
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
