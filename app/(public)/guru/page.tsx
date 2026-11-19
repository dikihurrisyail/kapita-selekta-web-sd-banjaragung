import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/input";
import { TeacherCard } from "@/components/public/teacher-card";
import { PublicSection } from "@/components/public/public-section";
import { getGuru } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Informasi Guru" };

type Props = { searchParams: Promise<{ q?: string }> };

export default function GuruPage({ searchParams }: Props) {
  return (
    <>
      <PageIntro
        eyebrow="Informasi guru"
        judul="Pendidik yang mendampingi setiap anak."
        deskripsi="Kenali para guru dan tenaga kependidikan yang mengajar, membimbing, dan merawat proses belajar anak di sekolah."
      />

      <PublicSection>
        <div className="flex flex-col gap-8">
          {/* Pencarian */}
          <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchField
              name="q"
              placeholder="Cari nama atau jabatan guru"
              aria-label="Cari guru"
            />
            <Button type="submit" variant="accent" className="sm:w-[141px]">
              Cari
            </Button>
          </form>

          <Alert>
            Data guru pada halaman ini akan diperbarui dengan data resmi sekolah.
          </Alert>

          <Suspense fallback={<DaftarKerangka />}>
            <DaftarGuru searchParams={searchParams} />
          </Suspense>
        </div>
      </PublicSection>
    </>
  );
}

async function DaftarGuru({ searchParams }: Props) {
  const { q } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();

  const semua = await getGuru({ hanyaPublik: true });
  const tampil = kataKunci
    ? semua.filter(
        (g) =>
          g.nama.toLowerCase().includes(kataKunci) ||
          g.jabatan.toLowerCase().includes(kataKunci),
      )
    : semua;

  return (
    <>
      <p className="text-sm leading-[1.5] text-muted">
        {kataKunci
          ? `Menampilkan ${tampil.length} pendidik untuk “${q}”`
          : `Menampilkan ${tampil.length} pendidik`}
      </p>

      {tampil.length === 0 ? (
        <p className="rounded-card border border-line bg-white px-6 py-10 text-center text-sm text-muted">
          Tidak ada pendidik yang cocok dengan pencarian Anda.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tampil.map((item) => (
            <TeacherCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}

function DaftarKerangka() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-line bg-white">
          <div className="aspect-[3/4] w-full bg-page-alt" />
          <div className="flex flex-col gap-2 p-5">
            <div className="h-4 w-3/4 rounded-pill bg-page-alt" />
            <div className="h-3 w-1/2 rounded-pill bg-page-alt" />
          </div>
        </div>
      ))}
    </div>
  );
}
