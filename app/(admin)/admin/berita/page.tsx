import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Badge, toneUntukStatus } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchField } from "@/components/ui/input";
import { Foto } from "@/components/ui/foto";
import { TombolHapus } from "@/components/admin/form-aksi";
import { JudulAdmin, TabelKerangka } from "@/components/admin/kerangka";
import { hapusBerita } from "@/lib/actions/konten";
import { getBerita } from "@/lib/data/queries";
import { formatTanggal } from "@/lib/utils/format-date";

export const metadata: Metadata = { title: "Berita Admin" };

type Props = { searchParams: Promise<{ q?: string; status?: string }> };

export default function AdminBeritaPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <JudulAdmin
        eyebrow="Pengelolaan"
        judul="Berita"
        deskripsi="Kelola berita dan kegiatan sekolah yang tayang di website."
      />

      <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField
          name="q"
          placeholder="Cari judul berita"
          aria-label="Cari berita"
        />
        <div className="flex gap-3">
          <ButtonLink href="/admin/berita/edit" variant="accent">
            Tulis berita
          </ButtonLink>
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </div>
      </form>

      <Suspense fallback={<FilterKerangka />}>
        <FilterStatus searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<TabelKerangka />}>
        <DaftarBerita searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FilterStatus({ searchParams }: Props) {
  const { status } = await searchParams;
  const aktif = status && status !== "Semua" ? status : "Semua";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {["Semua", "Terbit", "Draf"].map((f) => (
        <a
          key={f}
          href={f === "Semua" ? "/admin/berita" : `/admin/berita?status=${f}`}
          aria-current={f === aktif ? "page" : undefined}
          className={
            f === aktif
              ? "inline-flex min-h-9 items-center rounded-pill bg-brand px-3 text-xs font-semibold text-white"
              : "inline-flex min-h-9 items-center rounded-pill bg-page-alt px-3 text-xs font-semibold text-brand hover:bg-line"
          }
        >
          {f}
        </a>
      ))}
    </div>
  );
}

async function DaftarBerita({ searchParams }: Props) {
  const { q, status } = await searchParams;
  const kataKunci = (q ?? "").trim().toLowerCase();
  const filterStatus = status && status !== "Semua" ? status : "Semua";

  const semua = await getBerita({ hanyaTerbit: false });
  const tampil = semua
    .filter((b) =>
      filterStatus === "Semua" ? true : (b.status ?? "Terbit") === filterStatus,
    )
    .filter((b) =>
      kataKunci
        ? b.judul.toLowerCase().includes(kataKunci) ||
          b.kategori.toLowerCase().includes(kataKunci)
        : true,
    );

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-page">
                {["Berita", "Tanggal", "Status", "Aksi"].map((k) => (
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
                    Tidak ada berita yang cocok.
                  </td>
                </tr>
              ) : (
                tampil.map((b) => (
                  <tr key={b.slug} className="border-b border-line last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Foto
                          src={b.foto.src}
                          label={b.foto.label}
                          ringkas
                          className="h-11 w-16 shrink-0"
                        />
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-brand-ink">
                            {b.judul}
                          </span>
                          <span className="text-xs text-muted">{b.kategori}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-body">
                      {formatTanggal(b.tanggal)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={toneUntukStatus(b.status ?? "Terbit")}>
                        {b.status ?? "Terbit"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/berita/edit?slug=${b.slug}`}
                          aria-label={`Ubah ${b.judul}`}
                          className="inline-flex size-9 items-center justify-center rounded-btn border border-line-soft text-brand hover:bg-page-alt"
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Link>
                        <TombolHapus action={hapusBerita} id={b.slug} label={b.judul}>
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

      <p className="text-sm text-muted">Menampilkan {tampil.length} berita</p>
    </>
  );
}

function FilterKerangka() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-9 w-16 rounded-pill bg-page-alt" />
      ))}
    </div>
  );
}
