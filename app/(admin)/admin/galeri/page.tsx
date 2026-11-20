import type { Metadata } from "next";
import { Suspense } from "react";
import { Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/card";
import { SearchField } from "@/components/ui/input";
import { Foto } from "@/components/ui/foto";
import { JudulAdmin } from "@/components/admin/kerangka";
import { FormUnggahFoto } from "@/components/admin/form-unggah-foto";
import { FormBuatAlbum } from "@/components/admin/form-buat-album";
import { TombolHapus } from "@/components/admin/form-aksi";
import { hapusAlbum, hapusFoto } from "@/lib/actions/konten";
import { getAlbum, getSemuaFoto } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Galeri Admin" };

/** Kategori album — sama dengan filter di halaman galeri publik. */
const KATEGORI_ALBUM = ["Kegiatan", "Akademik", "Lingkungan", "Lainnya"];

type Props = { searchParams: Promise<{ q?: string }> };

export default function AdminGaleriPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <JudulAdmin
        eyebrow="Pengelolaan"
        judul="Galeri"
        deskripsi="Buat album, unggah dokumentasi kegiatan, dan atur keterangan setiap foto."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel judul="Unggah dokumentasi">
          <Suspense fallback={<FormKerangka />}>
            <FormUnggah searchParams={searchParams} />
          </Suspense>
        </Panel>

        <Panel judul="Buat album baru">
          <FormBuatAlbum kategori={KATEGORI_ALBUM} />
        </Panel>
      </div>

      <Panel judul="Panduan">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            "Album harus dibuat sebelum foto bisa diunggah.",
            "Format JPG, PNG, atau WebP. Maksimal 5 MB per foto.",
            "Foto pertama otomatis menjadi sampul album.",
            "Menghapus album ikut menghapus semua foto di dalamnya.",
          ].map((p) => (
            <li
              key={p}
              className="flex gap-2.5 text-sm leading-[1.5] text-body"
            >
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-pill bg-accent"
              />
              {p}
            </li>
          ))}
        </ul>
      </Panel>

      <Alert>Keterangan foto membantu penelusuran dan aksesibilitas.</Alert>

      <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField
          name="q"
          placeholder="Cari album"
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

/** Ambil daftar album (dengan id) untuk form unggah. */
async function FormUnggah({ searchParams }: Props) {
  await searchParams;
  const album = await getAlbum();

  return (
    <FormUnggahFoto
      album={album.map((a) => ({
        id: a.id,
        judul: a.judul,
        kategori: a.kategori,
      }))}
    />
  );
}

function FormKerangka() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true">
      <span className="sr-only">Memuat form unggah…</span>
      <div className="h-16 rounded-btn bg-page-alt" />
      <div className="h-16 rounded-btn bg-page-alt" />
      <div className="h-11 w-40 rounded-btn bg-page-alt" />
    </div>
  );
}

async function DaftarAlbum({ searchParams }: Props) {
  const { q } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();

  const [semua, semuaFoto] = await Promise.all([getAlbum(), getSemuaFoto()]);
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
          tampil.map((item) => {
            const foto = semuaFoto[item.id] ?? [];
            return (
              <Panel key={item.slug} bodyClassName="px-5 py-5">
                <div className="flex flex-col gap-4">
                  <Foto
                    src={item.foto.src}
                    label={item.foto.label}
                    className="h-[160px] w-full"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="text-sm font-semibold text-brand-ink">
                        {item.judul}
                      </p>
                      <p className="text-xs text-muted">
                        {item.kategori} • {foto.length} foto
                      </p>
                    </div>
                    <TombolHapus
                      action={hapusAlbum}
                      id={item.id}
                      label={
                        foto.length > 0
                          ? `album "${item.judul}" beserta ${foto.length} foto di dalamnya`
                          : `album "${item.judul}"`
                      }
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </TombolHapus>
                  </div>

                  {foto.length > 0 ? (
                    <ul className="flex flex-col gap-2 border-t border-line-soft pt-3">
                      {foto.map((f) => (
                        <li key={f.id} className="flex items-center gap-2">
                          <Foto
                            src={f.url}
                            label={f.keterangan || "Foto galeri"}
                            ringkas
                            className="size-10 shrink-0"
                          />
                          <span className="min-w-0 flex-1 truncate text-xs text-body">
                            {f.keterangan || "(tanpa keterangan)"}
                          </span>
                          <TombolHapus
                            action={hapusFoto}
                            id={f.id}
                            label={`foto "${f.keterangan || "tanpa keterangan"}"`}
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </TombolHapus>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="border-t border-line-soft pt-3 text-xs text-muted">
                      Belum ada foto di album ini.
                    </p>
                  )}
                </div>
              </Panel>
            );
          })
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
