import type { Metadata } from "next";
import { Suspense } from "react";
import { Panel } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { FormAksi } from "@/components/admin/form-aksi";
import { InputFoto } from "@/components/admin/input-foto";
import { simpanProfil } from "@/lib/actions/konten";
import { getProfil } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Pengelolaan Profil" };

/**
 * Data profil dibaca di dalam <Suspense> karena query Supabase memakai
 * cookies()/fetch (data runtime).
 */
export default function AdminProfilPage() {
  return (
    <Suspense fallback={<FormKerangka />}>
      <FormProfil />
    </Suspense>
  );
}

async function FormProfil() {
  const profil = await getProfil();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold tracking-wide text-accent-ink uppercase">
          Pengelolaan
        </p>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">
          Pengelolaan Profil
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Perbarui identitas, sejarah, visi misi, fasilitas, dan kontak sekolah.
        </p>
      </div>

      <FormAksi action={simpanProfil} teksSimpan="Simpan perubahan">
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel judul="Identitas sekolah">
            <div className="flex flex-col gap-5">
              <Field label="Nama sekolah" htmlFor="nama">
                <Input id="nama" name="nama" defaultValue={profil.nama} required />
              </Field>
              <Field label="Tagline" htmlFor="tagline">
                <Input id="tagline" name="tagline" defaultValue={profil.tagline} />
              </Field>
              <Field label="NPSN" htmlFor="npsn">
                <Input id="npsn" name="npsn" defaultValue={profil.npsn ?? ""} />
              </Field>
              <Field label="Tahun ajaran" htmlFor="tahun_ajaran">
                <Input
                  id="tahun_ajaran"
                  name="tahun_ajaran"
                  defaultValue={profil.tahunAjaran ?? ""}
                  placeholder="2026/2027"
                />
              </Field>
            </div>
          </Panel>

          <Panel judul="Status sekolah">
            <div className="flex flex-col gap-5">
              <Field label="Status" htmlFor="status_sekolah">
                <Input
                  id="status_sekolah"
                  name="status_sekolah"
                  defaultValue={profil.statusSekolah ?? ""}
                  placeholder="Negeri / Swasta"
                />
              </Field>
              <Field label="Akreditasi" htmlFor="akreditasi">
                <Input
                  id="akreditasi"
                  name="akreditasi"
                  defaultValue={profil.akreditasi ?? ""}
                />
              </Field>
              <Field label="Kepala sekolah" htmlFor="kepala_sekolah">
                <Input
                  id="kepala_sekolah"
                  name="kepala_sekolah"
                  defaultValue={profil.kepalaSekolah ?? ""}
                />
              </Field>
            </div>
          </Panel>
        </div>

        <Panel judul="Logo sekolah">
          <div className="flex flex-col gap-4">
            {profil.logoUrl ? (
              <div className="flex items-center gap-4 rounded-card border border-line bg-page px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profil.logoUrl}
                  alt="Logo sekolah saat ini"
                  className="h-14 w-14 shrink-0 object-contain"
                />
                <p className="text-xs leading-[1.4] text-muted">
                  Logo saat ini. Pilih berkas baru untuk menggantinya.
                </p>
              </div>
            ) : null}
            <InputFoto
              name="logo"
              id="logo"
              variant="zona"
              accept="image/png,image/svg+xml"
              teksZona="PNG atau SVG, maksimal 2 MB"
              modePratinjau="contain"
              petunjuk="Logo tampil di header dan footer seluruh halaman website."
            />
          </div>
        </Panel>

        <Panel judul="Sejarah sekolah">
          <Field
            label="Sejarah"
            htmlFor="sejarah"
            petunjuk="Gunakan bahasa yang ringkas dan mudah dipahami."
          >
            <Textarea id="sejarah" name="sejarah" rows={5} defaultValue={profil.sejarah ?? ""} />
          </Field>
        </Panel>

        <Panel judul="Visi & misi">
          <div className="flex flex-col gap-5">
            <Field label="Visi" htmlFor="visi">
              <Textarea id="visi" name="visi" rows={3} defaultValue={profil.visi ?? ""} />
            </Field>
            <Field label="Misi" htmlFor="misi" petunjuk="Satu butir per baris.">
              <Textarea
                id="misi"
                name="misi"
                rows={5}
                defaultValue={profil.misi.join("\n")}
              />
            </Field>
            <Field label="Sambutan kepala sekolah" htmlFor="sambutan_kepala">
              <Textarea
                id="sambutan_kepala"
                name="sambutan_kepala"
                rows={4}
                defaultValue={profil.sambutanKepala ?? ""}
              />
            </Field>
          </div>
        </Panel>

        <Panel judul="Alamat & layanan kontak">
          <div className="flex flex-col gap-5">
            <Field label="Alamat" htmlFor="alamat">
              <Textarea id="alamat" name="alamat" rows={3} defaultValue={profil.alamat ?? ""} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Telepon" htmlFor="telepon">
                <Input id="telepon" name="telepon" defaultValue={profil.telepon ?? ""} />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input id="email" name="email" type="email" defaultValue={profil.email ?? ""} />
              </Field>
            </div>
            <Field label="Jam layanan" htmlFor="jam_layanan">
              <Input
                id="jam_layanan"
                name="jam_layanan"
                defaultValue={profil.jamLayanan ?? ""}
                placeholder="Senin–Jumat • 07.30–14.00 WIB"
              />
            </Field>
            <Field
              label="Tautan peta lokasi"
              htmlFor="peta_url"
              petunjuk="Alamat Google Maps. Bila diisi, tombol “Buka di peta” muncul di halaman Kontak."
            >
              <Input
                id="peta_url"
                name="peta_url"
                type="url"
                defaultValue={profil.petaUrl ?? ""}
                placeholder="https://maps.app.goo.gl/..."
              />
            </Field>
          </div>
        </Panel>
      </FormAksi>
    </div>
  );
}

/** Kerangka pemuatan form profil admin. */
function FormKerangka() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <span className="sr-only">Memuat profil sekolah…</span>
      <div className="h-3 w-24 rounded-pill bg-page-alt" />
      <div className="h-8 w-64 rounded-btn bg-page-alt" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 rounded-card bg-page-alt" />
        <div className="h-72 rounded-card bg-page-alt" />
      </div>
      <div className="h-40 rounded-card bg-page-alt" />
    </div>
  );
}
