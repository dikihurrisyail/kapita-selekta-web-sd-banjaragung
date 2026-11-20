import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Panel } from "@/components/ui/card";
import { Field, Input, Switch } from "@/components/ui/input";
import { Foto } from "@/components/ui/foto";
import { FormAksi } from "@/components/admin/form-aksi";
import { InputFoto } from "@/components/admin/input-foto";
import { simpanGuru } from "@/lib/actions/konten";
import { getGuru } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Tambah atau Edit Guru" };

type Props = { searchParams: Promise<{ id?: string }> };

export default function AdminGuruEditPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/guru"
          className="text-sm font-semibold text-brand hover:underline"
        >
          ← Kembali ke data guru
        </Link>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">
          Tambah atau Edit Guru
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Lengkapi data pendidik lalu simpan untuk menampilkan di halaman publik.
        </p>
      </div>

      <Suspense fallback={<FormKerangka />}>
        <FormGuru searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FormGuru({ searchParams }: Props) {
  const { id } = await searchParams;
  const semua = await getGuru();
  const guru = id ? semua.find((g) => g.id === id) : undefined;
  const urutanDefault = guru ? semua.findIndex((g) => g.id === guru.id) + 1 : semua.length + 1;

  return (
    <FormAksi action={simpanGuru} teksSimpan={guru ? "Simpan guru" : "Tambah guru"}>
      <input type="hidden" name="id" value={guru?.id ?? ""} />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel judul="Informasi pendidik">
          <div className="flex flex-col gap-5">
            <Field
              label="Nama lengkap"
              htmlFor="nama"
              petunjuk="Tampil di halaman publik /guru."
            >
              <Input id="nama" name="nama" defaultValue={guru?.nama ?? ""} required />
            </Field>
            <Field label="Jabatan" htmlFor="jabatan">
              <Input
                id="jabatan"
                name="jabatan"
                defaultValue={guru?.jabatan ?? ""}
                required
              />
            </Field>
            <Field label="NIP" htmlFor="nip">
              <Input id="nip" name="nip" defaultValue={guru?.nip ?? ""} />
            </Field>
            <Field
              label="Urutan tampil"
              htmlFor="urutan"
              petunjuk="Angka kecil tampil lebih dahulu."
            >
              <Input
                id="urutan"
                name="urutan"
                type="number"
                min={0}
                defaultValue={urutanDefault}
              />
            </Field>
            <Switch
              id="publik"
              name="publik"
              label="Tampilkan di halaman publik"
              defaultChecked={guru?.publik ?? true}
            />
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel judul="Foto guru">
            <div className="flex flex-col gap-4">
              <Foto
                src={guru?.foto.src ?? null}
                label={guru ? `Foto ${guru.nama}` : "Foto guru"}
                ratio="3 / 4"
                className="w-full"
              />
              <InputFoto
                name="foto"
                id="foto"
                petunjuk="Rasio 3:4, minimal 600 × 800 px. JPG, PNG, atau WebP, maksimal 5 MB. Kosongkan bila tidak ingin mengganti foto."
              />
            </div>
          </Panel>

          <Panel judul="Pratinjau identitas">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-brand-ink">
                {guru?.nama ?? "[Nama guru]"}
              </p>
              <p className="text-sm text-muted">{guru?.jabatan ?? "[Jabatan]"}</p>
            </div>
          </Panel>
        </div>
      </div>
    </FormAksi>
  );
}

function FormKerangka() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]" aria-busy="true">
      <div className="rounded-card border border-line bg-white p-6">
        <div className="flex flex-col gap-4">
          <div className="h-4 w-40 rounded-btn bg-page-alt" />
          <div className="h-11 w-full rounded-btn bg-page-alt" />
          <div className="h-11 w-full rounded-btn bg-page-alt" />
          <div className="h-11 w-full rounded-btn bg-page-alt" />
        </div>
      </div>
      <div className="rounded-card border border-line bg-white p-6">
        <div className="flex flex-col gap-4">
          <div className="h-4 w-28 rounded-btn bg-page-alt" />
          <div className="aspect-[3/4] w-full rounded-img bg-page-alt" />
        </div>
      </div>
    </div>
  );
}
