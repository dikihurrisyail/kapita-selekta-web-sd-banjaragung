import type { Metadata } from "next";
import { Suspense } from "react";
import { io } from "next/cache";
import Link from "next/link";
import { Panel } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Foto } from "@/components/ui/foto";
import { Badge } from "@/components/ui/badge";
import { FormAksi } from "@/components/admin/form-aksi";
import { InputFoto } from "@/components/admin/input-foto";
import { simpanBerita } from "@/lib/actions/konten";
import { getBerita } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Tambah atau Edit Berita" };

type Props = { searchParams: Promise<{ slug?: string }> };

export default function AdminBeritaEditPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/berita"
          className="text-sm font-semibold text-brand hover:underline"
        >
          ← Kembali ke daftar berita
        </Link>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">
          Tambah atau Edit Berita
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Tulis berita sekolah lengkap dengan sampul dan ringkasan.
        </p>
      </div>

      <Suspense fallback={<FormKerangka />}>
        <FormBerita searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FormBerita({ searchParams }: Props) {
  const { slug } = await searchParams;

  /* new Date() adalah nilai tidak stabil; io() menandainya sebagai data runtime. */
  await io();
  const hariIni = new Date().toISOString().slice(0, 10);

  const semua = await getBerita({ hanyaTerbit: false });
  const berita = slug ? semua.find((b) => b.slug === slug) : undefined;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-sm leading-[1.5] text-muted">
          {berita ? `Mengubah: ${berita.judul}` : "Artikel baru"}
        </p>
        <Badge tone={berita?.status === "Terbit" ? "sukses" : "peringatan"}>
          {berita?.status ?? "Draf"}
        </Badge>
      </div>

      <FormAksi
        action={simpanBerita}
        teksSimpan={berita ? "Simpan berita" : "Simpan draf"}
        petunjuk={berita ? "Perubahan belum disimpan." : "Artikel baru belum disimpan."}
      >
        <input type="hidden" name="slug_lama" value={berita?.slug ?? ""} />

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          {/* Editor artikel */}
          <div className="flex flex-col gap-6">
            <Panel judul="Informasi artikel">
              <div className="flex flex-col gap-5">
                <Field label="Judul berita" htmlFor="judul">
                  <Input
                    id="judul"
                    name="judul"
                    defaultValue={berita?.judul ?? ""}
                    required
                  />
                </Field>
                <Field
                  label="Slug"
                  htmlFor="slug"
                  petunjuk="Dipakai pada tautan. Kosongkan untuk dibuat otomatis dari judul."
                >
                  <Input id="slug" name="slug" defaultValue={berita?.slug ?? ""} />
                </Field>

                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-brand-ink">Sampul berita</p>
                  <Foto
                    src={berita?.foto.src ?? null}
                    label="Sampul berita — foto dokumentasi ilustratif"
                    ratio="16 / 9"
                    className="w-full"
                  />
                  <InputFoto
                    name="sampul"
                    id="sampul"
                    petunjuk="Rasio 16:9, JPG/PNG/WebP, maksimal 5 MB. Kosongkan bila tidak ingin mengganti sampul."
                  />
                </div>

                <Field label="Kategori" htmlFor="kategori">
                  <Input
                    id="kategori"
                    name="kategori"
                    defaultValue={berita?.kategori ?? "Kegiatan"}
                  />
                </Field>
              </div>
            </Panel>

            <Panel judul="Isi berita">
              <div className="flex flex-col gap-3">
                <Textarea
                  name="isi"
                  rows={12}
                  aria-label="Isi berita"
                  defaultValue={berita?.isi ?? ""}
                  placeholder="Tulis isi berita di sini. Pisahkan paragraf dengan baris baru."
                />
                <p className="text-xs text-muted">
                  Gunakan paragraf pendek agar mudah dibaca di ponsel.
                </p>
              </div>
            </Panel>
          </div>

          {/* Pengaturan artikel */}
          <div className="flex flex-col gap-6">
            <Panel judul="Publikasi">
              <div className="flex flex-col gap-5">
                <Field label="Status" htmlFor="status">
                  <Select id="status" name="status" defaultValue={berita?.status ?? "Draf"}>
                    <option value="Draf">Draf</option>
                    <option value="Terbit">Terbit</option>
                  </Select>
                </Field>
                <Field label="Tanggal tayang" htmlFor="tanggal">
                  <Input
                    id="tanggal"
                    name="tanggal"
                    type="date"
                    defaultValue={berita?.tanggal ?? hariIni}
                  />
                </Field>
                <Field label="Penulis" htmlFor="penulis">
                  <Input
                    id="penulis"
                    name="penulis"
                    defaultValue={berita?.penulis ?? "Administrator"}
                  />
                </Field>
                <Field label="Menit baca" htmlFor="menit_baca">
                  <Input
                    id="menit_baca"
                    name="menit_baca"
                    type="number"
                    min={1}
                    defaultValue={berita?.menitBaca ?? 3}
                  />
                </Field>
              </div>
            </Panel>

            <Panel judul="Ringkasan berita">
              <Field label="Ringkasan" htmlFor="ringkasan">
                <Textarea
                  id="ringkasan"
                  name="ringkasan"
                  rows={5}
                  defaultValue={berita?.ringkasan ?? ""}
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
            <div className="h-4 w-40 rounded-btn bg-page-alt" />
            <div className="h-11 w-full rounded-btn bg-page-alt" />
            <div className="h-11 w-full rounded-btn bg-page-alt" />
            <div className="h-[200px] w-full rounded-img bg-page-alt" />
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
