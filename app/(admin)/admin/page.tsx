import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge, toneUntukStatus } from "@/components/ui/badge";
import { Card, Panel } from "@/components/ui/card";
import { getBerita, getPengumuman, getRingkasanDashboard } from "@/lib/data/queries";
import { formatTanggal } from "@/lib/utils/format-date";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardKerangka />}>
      <IsiDashboard />
    </Suspense>
  );
}

async function IsiDashboard() {
  const [ringkasan, pengumuman, berita] = await Promise.all([
    getRingkasanDashboard(),
    getPengumuman({ hanyaTerbit: false, limit: 4 }),
    getBerita({ hanyaTerbit: false, limit: 2 }),
  ]);

  const metrik = [
    {
      label: "Pengumuman",
      jumlah: String(ringkasan.pengumuman),
      catatan: `${ringkasan.pengumumanTerbit} terbit • ${ringkasan.pengumumanDraf} draf`,
    },
    {
      label: "Berita",
      jumlah: String(ringkasan.berita),
      catatan: `${ringkasan.beritaTerbit} terbit`,
    },
    {
      label: "Guru",
      jumlah: String(ringkasan.guru),
      catatan: `${ringkasan.guruPublik} tayang publik`,
    },
    {
      label: "Foto galeri",
      jumlah: String(ringkasan.foto),
      catatan: `${ringkasan.album || "—"} album`,
    },
  ];

  /* Aktivitas digabung dari konten terbaru, diurutkan menurut tanggal. */
  const aktivitas = [
    ...pengumuman.map((p) => ({
      judul: `Pengumuman “${p.judul}”`,
      tanggal: p.tanggal,
      status: p.status ?? "Draf",
      href: `/admin/pengumuman`,
    })),
    ...berita.map((b) => ({
      judul: `Berita “${b.judul}”`,
      tanggal: b.tanggal,
      status: b.status ?? "Terbit",
      href: `/admin/berita`,
    })),
  ]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* Judul pengelolaan */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold tracking-wide text-accent-ink uppercase">
          Ringkasan
        </p>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">Dashboard</h1>
        <p className="text-sm leading-[1.5] text-body">
          Ringkasan pengelolaan konten dan aktivitas terbaru.
        </p>
      </div>

      {/* Sapaan administrator */}
      <section className="flex flex-col gap-3 rounded-card bg-brand p-6">
        <h2 className="text-xl font-bold leading-[1.35] text-white">
          Selamat datang kembali, Administrator
        </h2>
        <p className="max-w-[760px] text-sm leading-[1.6] text-white">
          Kelola konten website sekolah dari satu tempat. Pastikan informasi yang
          tayang sudah sesuai data resmi sekolah.
        </p>
      </section>

      {/* Ringkasan jumlah konten — 4 metrik */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrik.map((m) => (
          <Card key={m.label} className="flex flex-col gap-3 p-6">
            <p className="text-sm font-semibold leading-[1.4] text-muted">{m.label}</p>
            <p className="text-[40px] font-bold leading-[1.1] text-brand-ink">
              {m.jumlah}
            </p>
            <p className="text-xs leading-[1.4] text-muted">{m.catatan}</p>
          </Card>
        ))}
      </div>

      {/* Aktivitas dan pintasan */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel judul="Aktivitas terbaru" bodyClassName="px-0 py-0">
          <ul className="flex flex-col">
            {aktivitas.map((a) => (
              <li
                key={`${a.judul}-${a.tanggal}`}
                className="flex flex-col gap-2 border-b border-line px-6 py-4 last:border-0"
              >
                <p className="text-sm font-semibold leading-[1.45] text-brand-ink">
                  {a.judul}
                </p>
                <p className="text-xs leading-[1.4] text-muted">
                  {formatTanggal(a.tanggal)}
                </p>
                <Badge tone={toneUntukStatus(a.status)} className="w-fit">
                  {a.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel judul="Aksi cepat" bodyClassName="px-0 py-0">
            <ul className="flex flex-col">
              {[
                { label: "Tulis berita baru", href: "/admin/berita/edit" },
                { label: "Buat pengumuman", href: "/admin/pengumuman/edit" },
                { label: "Unggah foto galeri", href: "/admin/galeri" },
                { label: "Perbarui info PPDB", href: "/admin/ppdb" },
              ].map((p) => (
                <li key={p.href} className="border-b border-line last:border-0">
                  <Link
                    href={p.href}
                    className="flex items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-brand-ink hover:bg-page"
                  >
                    {p.label}
                    <ArrowUpRight className="size-4 text-brand" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Alert>
            Semua perubahan tersimpan otomatis sebagai draf sampai Anda menekan
            Terbitkan.
          </Alert>
        </div>
      </div>

      {/* Sebelum memublikasikan */}
      <Panel judul="Sebelum memublikasikan">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <p className="text-sm leading-[1.6] text-body">
            Periksa kembali nama, tanggal, dan tautan. Pastikan konten tidak memuat
            data pribadi siswa. Publikasikan hanya informasi yang sudah disetujui
            sekolah.
          </p>
        </div>
      </Panel>
    </div>
  );
}

/** Kerangka pemuatan dashboard admin. */
function DashboardKerangka() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">Memuat dashboard…</span>
      <div className="h-3 w-24 rounded-pill bg-page-alt" />
      <div className="h-8 w-48 rounded-btn bg-page-alt" />
      <div className="h-24 w-full rounded-card bg-page-alt" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-card bg-page-alt" />
        ))}
      </div>
    </div>
  );
}
