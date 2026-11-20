import type { Metadata } from "next";
import { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { Panel } from "@/components/ui/card";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/input";
import { FormAksi } from "@/components/admin/form-aksi";
import { FormTahapan } from "@/components/admin/form-tahapan";
import { simpanPpdb } from "@/lib/actions/konten";
import { getPpdb } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Informasi PPDB Admin" };

/**
 * Data PPDB dibaca di dalam <Suspense> karena query Supabase memakai
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
          Informasi PPDB
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Perbarui periode, persyaratan, tahapan, dan kontak panitia PPDB.
        </p>
      </div>

      <Alert>Perubahan akan tampil di halaman publik /ppdb.</Alert>

      <FormAksi action={simpanPpdb} teksSimpan="Simpan informasi PPDB">
        <Panel judul="Informasi umum & persyaratan">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tahun ajaran" htmlFor="tahun_ajaran">
                <Input
                  id="tahun_ajaran"
                  name="tahun_ajaran"
                  defaultValue={ppdb.tahunAjaran}
                  required
                />
              </Field>
              <Field label="Periode pendaftaran" htmlFor="periode">
                <Input id="periode" name="periode" defaultValue={ppdb.periode} />
              </Field>
            </div>
            <Field
              label="Judul PPDB"
              htmlFor="judul"
              petunjuk="Tampil sebagai judul di halaman publik."
            >
              <Input id="judul" name="judul" defaultValue={ppdb.judul} required />
            </Field>
            <Field label="Deskripsi" htmlFor="deskripsi">
              <Textarea
                id="deskripsi"
                name="deskripsi"
                rows={4}
                defaultValue={ppdb.deskripsi}
              />
            </Field>
          </div>
        </Panel>

        <Panel judul="Berkas yang diperlukan">
          <Field label="Daftar berkas" htmlFor="berkas" petunjuk="Satu berkas per baris.">
            <Textarea
              id="berkas"
              name="berkas"
              rows={5}
              defaultValue={ppdb.berkas.join("\n")}
            />
          </Field>
        </Panel>

        <Panel judul="Jadwal & tahapan">
          <div className="flex flex-col gap-4">
            <FormTahapan awal={ppdb.tahapan} />
            <p className="text-xs leading-[1.4] text-muted">
              Nomor tahap dibuat otomatis mengikuti urutan di atas.
            </p>
          </div>
        </Panel>

        <Panel judul="Kontak panitia & tautan opsional">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Telepon panitia" htmlFor="telepon">
                <Input id="telepon" name="telepon" defaultValue={ppdb.telepon ?? ""} />
              </Field>
              <Field label="Email panitia" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={ppdb.email ?? ""}
                />
              </Field>
            </div>
            <Field label="Catatan panitia" htmlFor="catatan">
              <Textarea
                id="catatan"
                name="catatan"
                rows={3}
                defaultValue={ppdb.catatan ?? ""}
              />
            </Field>
            <Checkbox
              id="tautan_aktif"
              name="tautan_aktif"
              label="Aktifkan tautan pendaftaran daring"
              defaultChecked={ppdb.tautanAktif}
            />
            <Field
              label="Tautan pendaftaran"
              htmlFor="tautan_url"
              petunjuk="Contoh: https://..."
            >
              <Input
                id="tautan_url"
                name="tautan_url"
                defaultValue={ppdb.tautanUrl ?? ""}
              />
            </Field>
          </div>
        </Panel>
      </FormAksi>
    </div>
  );
}

/** Kerangka pemuatan form PPDB admin. */
function FormKerangka() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">Memuat informasi PPDB…</span>
      <div className="h-3 w-24 rounded-pill bg-page-alt" />
      <div className="h-8 w-64 rounded-btn bg-page-alt" />
      <div className="h-56 rounded-card bg-page-alt" />
      <div className="h-40 rounded-card bg-page-alt" />
    </div>
  );
}
