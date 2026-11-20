import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { AlbumCard } from "@/components/public/album-card";
import { PublicSection } from "@/components/public/public-section";
import { getAlbum } from "@/lib/data/queries";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Galeri Kegiatan" };

const kategoriGaleri = ["Semua", "Kegiatan", "Akademik", "Lingkungan"];

type Props = { searchParams: Promise<{ kategori?: string }> };

export default function GaleriPage({ searchParams }: Props) {
  return (
    <>
      <PageIntro
        eyebrow="Galeri kegiatan"
        judul="Dokumentasi kegiatan sekolah."
        deskripsi="Kumpulan momen kegiatan belajar, bermain, dan berkarya anak-anak bersama guru dan keluarga."
      />

      <PublicSection>
        <div className="flex flex-col gap-8">
          <Suspense fallback={<FilterKerangka />}>
            <FilterKategori searchParams={searchParams} />
          </Suspense>

          <Suspense fallback={<DaftarKerangka />}>
            <DaftarAlbum searchParams={searchParams} />
          </Suspense>
        </div>
      </PublicSection>
    </>
  );
}

async function FilterKategori({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const aktif = kategori && kategoriGaleri.includes(kategori) ? kategori : "Semua";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {kategoriGaleri.map((k) => (
        <a
          key={k}
          href={k === "Semua" ? "/galeri" : `/galeri?kategori=${encodeURIComponent(k)}`}
          aria-current={k === aktif ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-btn border px-4 py-2.5 text-sm font-semibold leading-[1.5] transition-colors",
            k === aktif
              ? "border-brand bg-brand text-white"
              : "border-line-soft bg-white text-body hover:bg-page-alt",
          )}
        >
          {k}
        </a>
      ))}
    </div>
  );
}

async function DaftarAlbum({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const aktif = kategori && kategoriGaleri.includes(kategori) ? kategori : "Semua";

  const semua = await getAlbum();
  const tampil = aktif === "Semua" ? semua : semua.filter((a) => a.kategori === aktif);

  return (
    <>
      {tampil.length === 0 ? (
        <p className="rounded-card border border-line bg-white px-6 py-10 text-center text-sm text-muted">
          Belum ada album pada kategori ini.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tampil.map((item) => (
            <AlbumCard key={item.slug} item={item} />
          ))}
        </div>
      )}

      <p className="text-xs leading-[1.4] text-muted">
        Menampilkan {tampil.length} album dokumentasi.
      </p>
    </>
  );
}

function FilterKerangka() {
  return (
    <div className="flex flex-wrap items-center gap-3" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-11 w-24 rounded-btn bg-page-alt" />
      ))}
    </div>
  );
}

function DaftarKerangka() {
  return (
    <div className="grid gap-6 md:grid-cols-2" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-line bg-white">
          <div className="h-[358px] w-full bg-page-alt" />
          <div className="flex flex-col gap-2 p-5">
            <div className="h-3 w-20 rounded-pill bg-page-alt" />
            <div className="h-5 w-3/4 rounded-btn bg-page-alt" />
          </div>
        </div>
      ))}
    </div>
  );
}
