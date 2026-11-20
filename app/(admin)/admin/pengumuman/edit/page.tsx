import type { Metadata } from "next";
import { Suspense } from "react";
import { io } from "next/cache";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { FormAksi } from "@/components/admin/form-aksi";
import { simpanPengumuman } from "@/lib/actions/konten";
import { getPengumuman } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Tambah atau Edit Pengumuman" };

type Props = { searchParams: Promise<{ slug?: string }> };

/**
 * Halaman tambah/ubah pengumuman.
 *
 * Mengikuti pola halaman berita: data dibaca di dalam <Suspense> karena
 * searchParams dan query Supabase adalah data runtime.
 */
export default function AdminPengumumanEditPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/pengumuman"
          className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
        >
          ← Kembali ke daftar pengumuman
        </Link>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">
          Tambah atau Edit Pengumuman
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Tulis pengumuman yang tayang di papan informasi sekolah.
        </p>
      </div>

      <Suspense fallback={<FormKerangka />}>
        <FormPengumuman searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FormPengumuman({ searchParams }: Props) {
  const { slug } = await searchParams;

  /* new Date() adalah nilai tidak stabil; io() menandainya sebagai data runtime. */
  await io();
  const hariIni = new Date().toISOString().slice(0, 10);

  const semua = await getPengumuman({ hanyaTerbit: false });
  const item = slug ? semua.find((p) => p.slug === slug) : undefined;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-sm leading-[1.5] text-muted">
          {item ? `Mengubah: ${item.judul}` : "Pengumuman baru"}
        </p>
        <Badge tone={item?.status === "Terbit" ? "sukses" : "peringatan"}>
          {item?.status ?? "Draf"}
        </Badge>
      </div>

      <FormAksi
        action={simpanPengumuman}
        teksSimpan={item ? "Simpan pengumuman" : "Simpan draf"}
        petunjuk={item ? "Perubahan belum disimpan." : "Pengumuman baru belum disimpan."}
      >
        <input type="hidden" name="id" value={item?.id ?? ""} />

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          {/* Isi pengumuman */}
          <div className="flex flex-col gap-6">
            <Panel judul="Informasi pengumuman">
              <div className="flex flex-col gap-5">
                <Field label="Judul pengumuman" htmlFor="judul">
                  <Input
                    id="judul"
                    name="judul"
                    defaultValue={item?.judul ?? ""}
                    required
                  />
                </Field>
                <Field
                  label="Slug"
                  htmlFor="slug"
                  petunjuk="Dipakai pada tautan. Kosongkan untuk dibuat otomatis dari judul."
                >
                  <Input id="slug" name="slug" defaultValue={item?.slug ?? ""} />
                </Field>
                <Field label="Kategori" htmlFor="kategori">
                  <Input
                    id="kategori"
                    name="kategori"
                    defaultValue={item?.kategori ?? "Umum"}
                  />
                </Field>
              </div>
            </Panel>

            <Panel judul="Isi pengumuman">
              <div className="flex flex-col gap-3">
                <Textarea
                  name="isi"
                  rows={10}
                  aria-label="Isi pengumuman"
                  defaultValue={item?.isi ?? ""}
                  placeholder="Tulis isi pengumuman di sini. Pisahkan paragraf dengan baris baru."
                />
                <p className="text-xs text-muted">
                  Gunakan kalimat singkat dan jelas agar mudah dibaca orang tua.
                </p>
              </div>
            </Panel>
          </div>

          {/* Pengaturan publikasi */}
          <div className="flex flex-col gap-6">
            <Panel judul="Publikasi">
              <div className="flex flex-col gap-5">
                <Field label="Status" htmlFor="status">
                  <Select id="status" name="status" defaultValue={item?.status ?? "Draf"}>
                    <option value="Draf">Draf</option>
                    <option value="Terbit">Terbit</option>
                  </Select>
                </Field>
                <Field label="Tanggal tayang" htmlFor="tanggal">
                  <Input
                    id="tanggal"
                    name="tanggal"
                    type="date"
                    defaultValue={item?.tanggal ?? hariIni}
                  />
                </Field>
              </div>
            </Panel>

            <Panel judul="Ringkasan pengumuman">
              <Field
                label="Ringkasan"
                htmlFor="ringkasan"
                petunjuk="Tampil pada kartu pengumuman di beranda dan halaman Pengumuman."
              >
                <Textarea
                  id="ringkasan"
                  name="ringkasan"
                  rows={5}
                  defaultValue={item?.ringkasan ?? ""}
                />
              </Field>
            </Panel>
          </div>
        </div>
      </FormAksi>
    </>
  );
}

function FormKerangka() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]" aria-busy="true">
      <div className="flex flex-col gap-6">
        <div className="rounded-card border border-line bg-white p-6">
          <div className="flex flex-col gap-4">
            <div className="h-4 w-44 rounded-btn bg-page-alt" />
            <div className="h-11 w-full rounded-btn bg-page-alt" />
            <div className="h-11 w-full rounded-btn bg-page-alt" />
            <div className="h-11 w-full rounded-btn bg-page-alt" />
          </div>
        </div>
      </div>
      <div className="rounded-card border border-line bg-white p-6">
        <div className="flex flex-col gap-4">
          <div className="h-4 w-32 rounded-btn bg-page-alt" />
          <div className="h-11 w-full rounded-btn bg-page-alt" />
          <div className="h-11 w-full rounded-btn bg-page-alt" />
        </div>
      </div>
    </div>
  );
}
