import { Suspense } from "react";
import { redirect } from "next/navigation";
import { io } from "next/cache";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { getSesiAdmin, type SesiAdmin } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Layout panel admin.
 *
 * Data sesi dibaca lewat cookies (runtime), sehingga bagian dinamis dibungkus
 * <Suspense> + io() agar kompatibel dengan Cache Components Next 16.
 *
 * Proteksi utama ada di proxy.ts. Pemeriksaan di sini adalah lapisan kedua:
 * bila Supabase aktif tetapi sesi tidak valid (mis. sesi kedaluwarsa di tengah
 * perjalanan), pengguna tetap diarahkan ke halaman login.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen bg-page">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<HeaderKerangka />}>
          <HeaderDinamis />
        </Suspense>
        {/* pb 76px di layar kecil agar konten tidak tertutup bottom nav. */}
        <main className="flex-1 px-4 py-6 pb-[calc(76px+1.5rem)] sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          <Suspense fallback={null}>
            <PeringatanDemo />
          </Suspense>
          <Suspense fallback={<KontenKerangka />}>
            <KontenTerjaga>{children}</KontenTerjaga>
          </Suspense>
        </main>
      </div>
      <AdminMobileNav />
    </div>
  );
}

/** Header tanpa data sesi — dipakai sebagai fallback saat Suspense. */
function HeaderKerangka() {
  return <AdminHeader />;
}

async function HeaderDinamis() {
  await io();
  const sesi = await getSesiAdmin();
  return <AdminHeader nama={sesi?.nama} email={sesi?.email} />;
}

/**
 * Lapisan proteksi kedua sebelum konten admin dirender.
 * Dalam mode demo (Supabase belum diisi) konten tetap ditampilkan.
 */
async function KontenTerjaga({ children }: { children: React.ReactNode }) {
  await io();
  if (isSupabaseConfigured()) {
    const sesi = await getSesiAdmin();
    if (!sesi) redirect("/admin/login");
  }
  return <>{children}</>;
}

async function PeringatanDemo() {
  await io();
  const sesi: SesiAdmin | null = await getSesiAdmin();
  if (!sesi?.demo) return null;

  return (
    <div className="mb-6 rounded-card border border-line bg-page-alt px-4 py-3 text-[13px] leading-[1.5] text-brand">
      <strong className="font-semibold">Mode demo.</strong> Supabase belum
      dikonfigurasi — data yang tampil berasal dari placeholder dan perubahan tidak
      akan tersimpan. Isi <code className="font-mono text-xs">.env.local</code> untuk
      mengaktifkan database dan login.
    </div>
  );
}

/** Kerangka isi halaman admin saat konten sedang dimuat. */
function KontenKerangka() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">Memuat konten…</span>
      <div className="h-3 w-24 rounded-pill bg-page-alt" />
      <div className="h-8 w-64 rounded-btn bg-page-alt" />
      <div className="h-4 w-full max-w-[420px] rounded-btn bg-page-alt" />
      <div className="h-40 w-full rounded-card bg-page-alt" />
    </div>
  );
}
