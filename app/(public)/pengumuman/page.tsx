import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/input";
import { AnnouncementCard } from "@/components/public/announcement-card";
import { PublicSection } from "@/components/public/public-section";
import { getPengumuman } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Pengumuman" };

type Props = { searchParams: Promise<{ q?: string }> };

export default function PengumumanPage({ searchParams }: Props) {
  return (
    <>
      <PageIntro
        eyebrow="Papan informasi"
        judul="Pengumuman sekolah"
        deskripsi="Informasi resmi seputar kegiatan, jadwal, dan layanan sekolah untuk orang tua dan masyarakat."
      />

      <PublicSection>
        <div className="flex flex-col gap-8">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchField
              name="q"
              placeholder="Cari judul pengumuman"
              aria-label="Cari pengumuman"
            />
            <Button type="submit" variant="accent" className="sm:w-[141px]">
              Cari
            </Button>
          </form>

          <Suspense fallback={<DaftarKerangka />}>
            <DaftarPengumuman searchParams={searchParams} />
          </Suspense>
        </div>
      </PublicSection>
    </>
  );
}

async function DaftarPengumuman({ searchParams }: Props) {
  const { q } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();

  const semua = await getPengumuman({ hanyaTerbit: true });
  const tampil = kataKunci
    ? semua.filter(
        (p) =>
          p.judul.toLowerCase().includes(kataKunci) ||
          p.ringkasan.toLowerCase().includes(kataKunci) ||
          p.kategori.toLowerCase().includes(kataKunci),
      )
    : semua;

  return (
    <>
      <p className="text-sm leading-[1.5] text-muted">
        {kataKunci
          ? `Menampilkan ${tampil.length} pengumuman untuk “${q}”`
          : `Menampilkan ${tampil.length} pengumuman`}
      </p>

      {tampil.length === 0 ? (
        <p className="rounded-card border border-line bg-white px-6 py-10 text-center text-sm text-muted">
          Tidak ada pengumuman yang cocok dengan pencarian Anda.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tampil.map((item) => (
            <AnnouncementCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </>
  );
}

function DaftarKerangka() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex min-h-[300px] flex-col gap-4 rounded-card border border-line bg-white p-6"
        >
          <div className="h-3 w-24 rounded-pill bg-page-alt" />
          <div className="h-5 w-4/5 rounded-btn bg-page-alt" />
          <div className="h-3 w-full rounded-pill bg-page-alt" />
          <div className="h-3 w-2/3 rounded-pill bg-page-alt" />
        </div>
      ))}
    </div>
  );
}
