import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/input";
import { NewsCard } from "@/components/public/news-card";
import { PublicSection } from "@/components/public/public-section";
import { getBerita } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Berita dan Kegiatan" };

type Props = { searchParams: Promise<{ q?: string }> };

export default function BeritaPage({ searchParams }: Props) {
  return (
    <>
      <PageIntro
        eyebrow="Berita & kegiatan"
        judul="Cerita dari sekolah"
        deskripsi="Kabar terbaru seputar kegiatan belajar, prestasi, dan keseharian anak-anak di sekolah."
      />

      <PublicSection>
        <div className="flex flex-col gap-8">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchField
              name="q"
              placeholder="Cari judul berita"
              aria-label="Cari berita"
            />
            <Button type="submit" variant="accent" className="sm:w-[141px]">
              Cari
            </Button>
          </form>

          <Suspense fallback={<DaftarKerangka />}>
            <DaftarBerita searchParams={searchParams} />
          </Suspense>
        </div>
      </PublicSection>
    </>
  );
}

async function DaftarBerita({ searchParams }: Props) {
  const { q } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();

  const semua = await getBerita({ hanyaTerbit: true });
  const tampil = kataKunci
    ? semua.filter(
        (b) =>
          b.judul.toLowerCase().includes(kataKunci) ||
          b.ringkasan.toLowerCase().includes(kataKunci) ||
          b.kategori.toLowerCase().includes(kataKunci),
      )
    : semua;

  return (
    <>
      <p className="text-sm leading-[1.5] text-muted">
        {kataKunci
          ? `Menampilkan ${tampil.length} berita untuk “${q}”`
          : `Menampilkan ${tampil.length} berita`}
      </p>

      {tampil.length === 0 ? (
        <p className="rounded-card border border-line bg-white px-6 py-10 text-center text-sm text-muted">
          Tidak ada berita yang cocok dengan pencarian Anda.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tampil.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </>
  );
}

function DaftarKerangka() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-line bg-white">
          <div className="h-[216px] w-full bg-page-alt" />
          <div className="flex flex-col gap-3 p-5">
            <div className="h-3 w-24 rounded-pill bg-page-alt" />
            <div className="h-5 w-4/5 rounded-btn bg-page-alt" />
            <div className="h-3 w-full rounded-pill bg-page-alt" />
          </div>
        </div>
      ))}
    </div>
  );
}
