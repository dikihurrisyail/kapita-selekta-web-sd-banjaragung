import type { Metadata } from "next";
import { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { Panel } from "@/components/ui/card";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/input";
import { FormAksi } from "@/components/admin/form-aksi";
import { FormTahapan } from "@/components/admin/form-tahapan";
import { InputFoto } from "@/components/admin/input-foto";
import { simpanPpdb } from "@/lib/actions/konten";
import { getPpdb } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Informasi SPMB Admin" };

/**
 * Data SPMB dibaca di dalam <Suspense> karena query Supabase memakai
 * cookies()/fetch (data runtime).
 */
export default function AdminPpdbPage() {
  return (
    <Suspense fallback={<FormKerangka />}>
      <FormPpdb />
    </Suspense>
  );
}

async function FormPpdb() {
  const ppdb = await getPpdb();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold tracking-wide text-accent-ink uppercase">
          Pengelolaan
        </p>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">
          Informasi SPMB
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Seluruh teks halaman SPMB dapat diubah dari sini: judul, pengantar,
          persyaratan, berkas, tahapan, hingga kontak panitia.
        </p>
      </div>

      <Alert>Perubahan akan tampil di halaman publik /spmb.</Alert>

      {ppdb.skemaLengkap ? null : (
        <Alert tone="bahaya">
          Kolom teks baru belum ada di database. Jalankan berkas
          <code className="font-mono text-xs"> supabase/migrations/0002_ppdb_konten_lengkap.sql </code>
          lewat SQL Editor Supabase. Sebelum migrasi dijalankan, hanya kolom lama
          yang dapat disimpan.
        </Alert>
      )}

      <FormAksi action={simpanPpdb} teksSimpan="Simpan informasi SPMB">
        <Panel judul="Judul halaman">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Teks kecil di atas judul" htmlFor="eyebrow">
                <Input id="eyebrow" name="eyebrow" defaultValue={ppdb.eyebrow} />
              </Field>
              <Field label="Tahun ajaran" htmlFor="tahun_ajaran">
                <Input
                  id="tahun_ajaran"
                  name="tahun_ajaran"
                  defaultValue={ppdb.tahunAjaran}
                  required
                />
              </Field>
            </div>
            <Field label="Judul halaman" htmlFor="judul">
              <Input id="judul" name="judul" defaultValue={ppdb.judul} required />
            </Field>
            <Field label="Deskripsi singkat di bawah judul" htmlFor="intro_deskripsi">
              <Textarea
                id="intro_deskripsi"
                name="intro_deskripsi"
                rows={3}
                defaultValue={ppdb.introDeskripsi}
              />
            </Field>
          </div>
        </Panel>

        <Panel judul="Pengantar">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Teks kecil pengantar" htmlFor="pengantar_eyebrow">
                <Input
                  id="pengantar_eyebrow"
                  name="pengantar_eyebrow"
                  defaultValue={ppdb.pengantarEyebrow}
                />
              </Field>
              <Field label="Judul pengantar" htmlFor="pengantar_judul">
                <Input
                  id="pengantar_judul"
                  name="pengantar_judul"
                  defaultValue={ppdb.pengantarJudul}
                />
              </Field>
            </div>
            <Field label="Paragraf pengantar" htmlFor="deskripsi">
              <Textarea
                id="deskripsi"
                name="deskripsi"
                rows={4}
                defaultValue={ppdb.deskripsi}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Periode pendaftaran" htmlFor="periode">
                <Input id="periode" name="periode" defaultValue={ppdb.periode} />
              </Field>
              <Field
                label="Keterangan periode"
                htmlFor="periode_catatan"
                petunjuk="Lanjutan kalimat setelah periode."
              >
                <Input
                  id="periode_catatan"
                  name="periode_catatan"
                  defaultValue={ppdb.periodeCatatan}
                />
              </Field>
            </div>
            <InputFoto
              name="foto"
              id="foto"
              variant="zona"
              accept="image/jpeg,image/png,image/webp"
              teksZona="JPG, PNG, atau WebP, maksimal 5 MB"
              petunjuk={
                ppdb.fotoUrl
                  ? "Foto saat ini dipakai. Pilih berkas baru untuk menggantinya."
                  : "Foto pengantar bersifat opsional."
              }
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Label tombol utama" htmlFor="tombol_kontak_label">
                <Input
                  id="tombol_kontak_label"
                  name="tombol_kontak_label"
                  defaultValue={ppdb.tombolKontakLabel}
                />
              </Field>
              <Field
                label="Tujuan tombol utama"
                htmlFor="tombol_kontak_url"
                petunjuk="Contoh: /kontak"
              >
                <Input
                  id="tombol_kontak_url"
                  name="tombol_kontak_url"
                  defaultValue={ppdb.tombolKontakUrl}
                />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel judul="Persyaratan calon peserta didik">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Judul panel" htmlFor="syarat_judul">
                <Input
                  id="syarat_judul"
                  name="syarat_judul"
                  defaultValue={ppdb.syaratJudul}
                />
              </Field>
              <Field label="Catatan kecil di bawah daftar" htmlFor="syarat_catatan">
                <Input
                  id="syarat_catatan"
                  name="syarat_catatan"
                  defaultValue={ppdb.syaratCatatan}
                />
              </Field>
            </div>
            <Field label="Paragraf pembuka" htmlFor="syarat_deskripsi">
              <Textarea
                id="syarat_deskripsi"
                name="syarat_deskripsi"
                rows={3}
                defaultValue={ppdb.syaratDeskripsi}
              />
            </Field>
            <Field
              label="Butir persyaratan"
              htmlFor="syarat_butir"
              petunjuk="Satu butir per baris."
            >
              <Textarea
                id="syarat_butir"
                name="syarat_butir"
                rows={4}
                defaultValue={ppdb.syaratButir.join("\n")}
              />
            </Field>
          </div>
        </Panel>

        <Panel judul="Berkas yang diperlukan">
          <div className="flex flex-col gap-5">
            <Field label="Judul panel" htmlFor="berkas_judul">
              <Input
                id="berkas_judul"
                name="berkas_judul"
                defaultValue={ppdb.berkasJudul}
              />
            </Field>
            <Field label="Daftar berkas" htmlFor="berkas" petunjuk="Satu berkas per baris.">
              <Textarea
                id="berkas"
                name="berkas"
                rows={5}
                defaultValue={ppdb.berkas.join("\n")}
              />
            </Field>
            <Field label="Catatan panitia" htmlFor="catatan">
              <Textarea
                id="catatan"
                name="catatan"
                rows={3}
                defaultValue={ppdb.catatan ?? ""}
              />
            </Field>
          </div>
        </Panel>

        <Panel judul="Jadwal & tahapan">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Teks kecil bagian tahapan" htmlFor="tahapan_eyebrow">
                <Input
                  id="tahapan_eyebrow"
                  name="tahapan_eyebrow"
                  defaultValue={ppdb.tahapanEyebrow}
                />
              </Field>
              <Field label="Judul bagian tahapan" htmlFor="tahapan_judul">
                <Input
                  id="tahapan_judul"
                  name="tahapan_judul"
                  defaultValue={ppdb.tahapanJudul}
                />
              </Field>
            </div>
            <FormTahapan awal={ppdb.tahapan} />
            <p className="text-xs leading-[1.4] text-muted">
              Nomor tahap dibuat otomatis mengikuti urutan di atas.
            </p>
          </div>
        </Panel>

        <Panel judul="Kontak panitia & tautan pendaftaran">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Judul bagian layanan" htmlFor="layanan_judul">
                <Input
                  id="layanan_judul"
                  name="layanan_judul"
                  defaultValue={ppdb.layananJudul}
                />
              </Field>
              <Field label="Telepon panitia" htmlFor="telepon">
                <Input id="telepon" name="telepon" defaultValue={ppdb.telepon ?? ""} />
              </Field>
            </div>
            <Field label="Penjelasan layanan panitia" htmlFor="layanan_deskripsi">
              <Textarea
                id="layanan_deskripsi"
                name="layanan_deskripsi"
                rows={3}
                defaultValue={ppdb.layananDeskripsi}
              />
            </Field>
            <Field label="Email panitia" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={ppdb.email ?? ""}
              />
            </Field>
            <Checkbox
              id="tautan_aktif"
              name="tautan_aktif"
              label="Aktifkan tautan pendaftaran daring"
              defaultChecked={ppdb.tautanAktif}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tautan pendaftaran" htmlFor="tautan_url" petunjuk="Contoh: https://...">
                <Input
                  id="tautan_url"
                  name="tautan_url"
                  defaultValue={ppdb.tautanUrl ?? ""}
                />
              </Field>
              <Field label="Label tombol pendaftaran" htmlFor="tombol_daftar_label">
                <Input
                  id="tombol_daftar_label"
                  name="tombol_daftar_label"
                  defaultValue={ppdb.tombolDaftarLabel}
                />
              </Field>
            </div>
          </div>
        </Panel>
      </FormAksi>
    </div>
  );
}

/** Kerangka pemuatan form SPMB admin. */
function FormKerangka() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">Memuat informasi SPMB…</span>
      <div className="h-3 w-24 rounded-pill bg-page-alt" />
      <div className="h-8 w-64 rounded-btn bg-page-alt" />
      <div className="h-56 rounded-card bg-page-alt" />
      <div className="h-40 rounded-card bg-page-alt" />
    </div>
  );
}
