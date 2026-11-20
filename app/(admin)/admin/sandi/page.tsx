import type { Metadata } from "next";
import { Suspense } from "react";
import { Alert } from "@/components/ui/alert";
import { Panel } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { FormAksi } from "@/components/admin/form-aksi";
import { ubahSandiAdmin } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Ubah Kata Sandi Admin" };

/**
 * Halaman ubah kata sandi admin yang sudah login.
 *
 * Menggunakan Server Action ubahSandiAdmin yang meminta kata sandi lama
 * sebelum mengizinkan perubahan.
 */
export default function AdminSandiPage() {
  return (
    <Suspense fallback={<FormKerangka />}>
      <FormSandi />
    </Suspense>
  );
}

async function FormSandi() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold tracking-wide text-accent-ink uppercase">
          Pengaturan
        </p>
        <h1 className="text-[30px] font-bold leading-[1.25] text-brand-ink">
          Ubah Kata Sandi
        </h1>
        <p className="text-sm leading-[1.5] text-body">
          Masukkan kata sandi lama dan kata sandi baru dua kali untuk
          konfirmasi. Minimal 8 karakter.
        </p>
      </div>

      <Alert>Setelah berhasil, Anda akan keluar otomatis dan harus login ulang dengan kata sandi baru.</Alert>

      <FormAksi
        action={ubahSandiAdmin}
        teksSimpan="Simpan kata sandi baru"
        petunjuk="Kata sandi lama tidak akan disimpan atau ditampilkan."
      >
        <Panel judul="Ubah Kata Sandi">
          <div className="flex flex-col gap-5">
            <Field label="Kata sandi lama" htmlFor="sandi_lama">
              <Input
                id="sandi_lama"
                name="sandi_lama"
                type="password"
                required
                autoComplete="current-password"
              />
            </Field>
            <Field label="Kata sandi baru" htmlFor="sandi_baru">
              <Input
                id="sandi_baru"
                name="sandi_baru"
                type="password"
                required
                autoComplete="new-password"
              />
            </Field>
            <Field label="Konfirmasi kata sandi baru" htmlFor="sandi_ulangi">
              <Input
                id="sandi_ulangi"
                name="sandi_ulangi"
                type="password"
                required
                autoComplete="new-password"
              />
            </Field>
          </div>
        </Panel>
      </FormAksi>
    </div>
  );
}

/** Kerangka pemuatan form ubah kata sandi. */
function FormKerangka() {
  return (
    <div className="flex flex-col gap-6 max-w-xl" aria-busy="true">
      <span className="sr-only">Memuat formulir ubah kata sandi…</span>
      <div className="h-3 w-24 rounded-pill bg-page-alt" />
      <div className="h-8 w-64 rounded-btn bg-page-alt" />
      <div className="h-40 rounded-card bg-page-alt" />
    </div>
  );
}