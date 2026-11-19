import type { Metadata } from "next";
import { Suspense } from "react";
import { UploadCloud } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/card";
import { Field, Input, SearchField } from "@/components/ui/input";
import { Foto } from "@/components/ui/foto";
import { JudulAdmin } from "@/components/admin/kerangka";
import { getAlbum } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Galeri Admin" };

type Props = { searchParams: Promise<{ q?: string }> };

export default function AdminGaleriPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <JudulAdmin
        eyebrow="Pengelolaan"
        judul="Galeri"
        deskripsi="Unggah dokumentasi kegiatan dan atur keterangan setiap foto."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel judul="Unggah dokumentasi">
          <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line-soft bg-page px-6 py-10 text-center">
            <UploadCloud className="size-7 text-line-soft" aria-hidden />
            <p className="text-sm font-semibold text-brand-ink">
              Tarik berkas ke sini atau pilih dari perangkat
            </p>
            <p className="text-xs text-muted">JPG atau PNG, maksimal 5 MB per foto.</p>
            <Button type="button" variant="outline" size="sm" disabled>
              Pilih berkas
            </Button>
            <p className="text-[11px] text-muted">
              Unggah foto aktif setelah Supabase Storage terhubung.
            </p>
          </div>
        </Panel>

        <Panel judul="Album tujuan">
          <div className="flex flex-col gap-5">
            <Field label="Album" htmlFor="album">
              <Input id="album" placeholder="Pekan Literasi" disabled />
            </Field>
            <Field label="Kategori" htmlFor="kategori">
              <Input id="kategori" placeholder="Kegiatan" disabled />
            </Field>
            <p className="text-xs text-muted">
              Pilih album yang sudah ada atau buat album baru. Form ini aktif setelah
              Supabase terhubung.
            </p>
          </div>
        </Panel>
      </div>

      <Alert>Keterangan foto membantu penelusuran dan aksesibilitas.</Alert>

      <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField
          name="q"
          placeholder="Cari keterangan foto"
          aria-label="Cari album"
        />
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      <Suspense fallback={<DaftarKerangka />}>
        <DaftarAlbum searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DaftarAlbum({ searchParams }: Props) {
  const { q } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();

  const semua = await getAlbum();
  const tampil = kataKunci
    ? semua.filter(
        (a) =>
          a.judul.toLowerCase().includes(kataKunci) ||
          a.kategori.toLowerCase().includes(kataKunci),
      )
    : semua;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tampil.length === 0 ? (
          <p className="rounded-card border border-line bg-white px-6 py-10 text-center text-sm text-muted md:col-span-2 xl:col-span-3">
            Tidak ada album yang cocok.
          </p>
        ) : (
          tampil.map((item) => (
            <Panel key={item.slug} bodyClassName="px-5 py-5">
              <div className="flex flex-col gap-4">
                <Foto
                  src={item.foto.src}
                  label={item.foto.label}
                  className="h-[160px] w-full"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-brand-ink">{item.judul}</p>
                  <p className="text-xs text-muted">
                    {item.kategori} • {item.jumlahFoto} foto
                  </p>
                </div>
              </div>
            </Panel>
          ))
        )}
      </div>

      <p className="text-sm text-muted">Menampilkan {tampil.length} album</p>
    </>
  );
}

function DaftarKerangka() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-card border border-line bg-white p-5">
          <div className="flex flex-col gap-4">
            <div className="h-[160px] w-full rounded-img bg-page-alt" />
            <div className="h-4 w-3/4 rounded-btn bg-page-alt" />
            <div className="h-3 w-1/2 rounded-pill bg-page-alt" />
          </div>
        </div>
      ))}
    </div>
  );
}
