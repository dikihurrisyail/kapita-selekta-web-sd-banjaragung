"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  Images,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  Newspaper,
  School,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LinkPending } from "@/components/ui/link-pending";
import { logoutAdmin } from "@/lib/actions/auth";
import { menuAdmin, site } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

const ikonMenu: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  school: School,
  building: Building2,
  users: Users,
  megaphone: Megaphone,
  newspaper: Newspaper,
  images: Images,
  "clipboard-list": ClipboardList,
  lock: Lock,
};

/**
 * Sidebar admin — lebar 240px, bg #0F172A.
 * Logo 200×69 @ (20,28) · menu 200×45 gap 8 · blok bantuan + keluar di bawah.
 */
export function AdminSidebar({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();

  const aktif = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col justify-between bg-brand-ink px-5 py-7 lg:flex">
      <div className="flex flex-col gap-9">
        <Link href="/admin" className="flex items-center gap-3">
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

        <nav aria-label="Navigasi admin" className="flex flex-col gap-2">
          {menuAdmin.map((item) => {
            const Icon = ikonMenu[item.icon] ?? LayoutDashboard;
            const isAktif = aktif(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isAktif ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-btn px-3 text-sm font-semibold leading-[1.5] transition-colors",
                  isAktif
                    ? "bg-brand text-white"
                    : "text-line-soft hover:bg-brand-deep hover:text-white",
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                {item.label}
                <LinkPending className="ml-auto" />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-[11px] leading-[1.5] text-line-soft">
          Konten yang tayang di website dikelola dari panel ini. Pastikan data
          sudah disetujui sekolah.
        </p>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-btn px-3 text-sm font-semibold text-line-soft hover:bg-brand-deep hover:text-white"
          >
            <LogOut className="size-5" aria-hidden />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
