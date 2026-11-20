import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { AlbumCard } from "@/components/public/album-card";
import { PublicSection } from "@/components/public/public-section";
import Link from "next/link";
import { Foto } from "@/components/ui/foto";
import { getAlbum, getFotoAlbum } from "@/lib/data/queries";
import type { Album } from "@/lib/data/types";
import { formatTanggal } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Galeri Kegiatan" };

const kategoriGaleri = ["Semua", "Kegiatan", "Akademik", "Lingkungan", "Lainnya"];

type Props = { searchParams: Promise<{ kategori?: string; album?: string }> };

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
  const { kategori, album } = await searchParams;
  if (album) return null;
  const aktif = kategori && kategoriGaleri.includes(kategori) ? kategori : "Semua";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {kategoriGaleri.map((k) => (
        <Link
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
        </Link>
      ))}
    </div>
  );
}

async function DaftarAlbum({ searchParams }: Props) {
  const { kategori, album } = await searchParams;
  const aktif = kategori && kategoriGaleri.includes(kategori) ? kategori : "Semua";

  const semua = await getAlbum();
  if (album) return <DetailAlbum item={semua.find((a) => a.slug === album)} />;
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

async function DetailAlbum({ item }: { item?: Album }) {
  const kembali = (
    <Link href="/galeri" className="text-sm font-semibold text-brand hover:underline">
      ← Semua album
    </Link>
  );

  if (!item) {
    return (
      <div className="flex flex-col gap-4">
        {kembali}
        <p className="rounded-card border border-line bg-white px-6 py-10 text-center text-sm text-muted">
          Album tidak ditemukan.
        </p>
      </div>
    );
  }

  const foto = await getFotoAlbum(item.id);

  return (
    <div className="flex flex-col gap-6">
      {kembali}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs leading-[1.4] text-muted">{item.kategori}</p>
        <h2 className="text-2xl font-semibold leading-[1.35] text-brand-ink">{item.judul}</h2>
        <p className="text-xs leading-[1.4] text-muted">
          {formatTanggal(item.tanggal)} • {foto.length} foto
        </p>
      </div>
      {foto.length === 0 ? (
        <p className="rounded-card border border-line bg-white px-6 py-10 text-center text-sm text-muted">
          Belum ada foto pada album ini.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foto.map((f) => (
            <figure key={f.id} className="flex flex-col gap-2">
              <Foto src={f.url} label={f.keterangan || item.judul} className="h-[260px] w-full" />
              {f.keterangan && (
                <figcaption className="text-xs leading-[1.4] text-muted">{f.keterangan}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
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
