import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchField } from "@/components/ui/input";
import { Foto } from "@/components/ui/foto";
import { TombolHapus } from "@/components/admin/form-aksi";
import { JudulAdmin, TabelKerangka } from "@/components/admin/kerangka";
import { hapusGuru } from "@/lib/actions/konten";
import { getGuru } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Data Guru" };

type Props = { searchParams: Promise<{ q?: string }> };

export default function AdminGuruPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <JudulAdmin
        eyebrow="Pengelolaan"
        judul="Data Guru"
        deskripsi="Kelola data pendidik dan tenaga kependidikan yang tayang di website."
      />

      <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField
          name="q"
          placeholder="Cari nama atau jabatan guru"
          aria-label="Cari guru"
        />
        <div className="flex gap-3">
          <ButtonLink href="/admin/guru/edit" variant="accent">
            Tambah guru
          </ButtonLink>
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </div>
      </form>

      <Alert>Data guru tersinkron dengan halaman publik /guru.</Alert>

      <Suspense fallback={<TabelKerangka />}>
        <DaftarGuru searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DaftarGuru({ searchParams }: Props) {
  const { q } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();

  const semua = await getGuru();
  const tampil = kataKunci
    ? semua.filter(
        (g) =>
          g.nama.toLowerCase().includes(kataKunci) ||
          g.jabatan.toLowerCase().includes(kataKunci),
      )
    : semua;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-page">
                {["Guru", "Jabatan", "Status", "Aksi"].map((k) => (
                  <th
                    key={k}
                    scope="col"
                    className="px-6 py-3 text-xs font-semibold tracking-wide text-muted uppercase"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tampil.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-muted">
                    Tidak ada data guru yang cocok.
                  </td>
                </tr>
              ) : (
                tampil.map((g) => (
                  <tr key={g.id} className="border-b border-line last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Foto
                          src={g.foto.src}
                          label={`Foto ${g.nama}`}
                          ringkas
                          className="size-11 shrink-0 rounded-pill"
                        />
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-brand-ink">
                            {g.nama}
                          </span>
                          <span className="text-xs text-muted">{g.nip ?? "—"}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-body">{g.jabatan}</td>
                    <td className="px-6 py-4">
                      <Badge tone={g.publik ? "sukses" : "peringatan"}>
                        {g.publik ? "Tayang" : "Draf"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/guru/edit?id=${g.id}`}
                          aria-label={`Ubah data ${g.nama}`}
                          className="inline-flex size-9 items-center justify-center rounded-btn border border-line-soft text-brand hover:bg-page-alt"
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Link>
                        <TombolHapus action={hapusGuru} id={g.id} label={g.nama}>
                          <Trash2 className="size-4" aria-hidden />
                        </TombolHapus>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-sm text-muted">Menampilkan {tampil.length} guru</p>
    </>
  );
}
