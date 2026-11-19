import type { Metadata } from "next";
import { Suspense } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge, toneUntukStatus } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchField } from "@/components/ui/input";
import { TombolHapus } from "@/components/admin/form-aksi";
import { JudulAdmin, TabelKerangka } from "@/components/admin/kerangka";
import { hapusPengumuman } from "@/lib/actions/konten";
import { getPengumuman } from "@/lib/data/queries";
import { formatTanggal } from "@/lib/utils/format-date";

export const metadata: Metadata = { title: "Pengumuman Admin" };

type Props = { searchParams: Promise<{ q?: string }> };

export default function AdminPengumumanPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <JudulAdmin
        eyebrow="Pengelolaan"
        judul="Pengumuman"
        deskripsi="Kelola pengumuman yang tayang di papan informasi sekolah."
      />

      <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField
          name="q"
          placeholder="Cari judul pengumuman"
          aria-label="Cari pengumuman"
        />
        <Button type="submit" variant="accent">
          Cari
        </Button>
      </form>

      <Alert>Pengumuman berstatus draf tidak akan tampil di website publik.</Alert>

      <Suspense fallback={<TabelKerangka />}>
        <DaftarPengumuman searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DaftarPengumuman({ searchParams }: Props) {
  const { q } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();

  const semua = await getPengumuman({ hanyaTerbit: false });
  const tampil = kataKunci
    ? semua.filter(
        (p) =>
          p.judul.toLowerCase().includes(kataKunci) ||
          p.kategori.toLowerCase().includes(kataKunci),
      )
    : semua;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-page">
                {["Pengumuman", "Tanggal tayang", "Status", "Aksi"].map((k) => (
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
                    Tidak ada pengumuman yang cocok.
                  </td>
                </tr>
              ) : (
                tampil.map((p) => (
                  <tr key={p.slug} className="border-b border-line last:border-0">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-brand-ink">{p.judul}</p>
                      <p className="mt-0.5 text-xs text-muted">{p.kategori}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-body">
                      {formatTanggal(p.tanggal)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={toneUntukStatus(p.status ?? "Draf")}>
                        {p.status ?? "Draf"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/pengumuman/${p.slug}`}
                          aria-label={`Lihat ${p.judul}`}
                          className="inline-flex size-9 items-center justify-center rounded-btn border border-line-soft text-brand hover:bg-page-alt"
                        >
                          <Pencil className="size-4" aria-hidden />
                        </a>
                        <TombolHapus action={hapusPengumuman} id={p.slug} label={p.judul}>
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

      <p className="text-sm text-muted">Menampilkan {tampil.length} pengumuman</p>
    </>
  );
}
