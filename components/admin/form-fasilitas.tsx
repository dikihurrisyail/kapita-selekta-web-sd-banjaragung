"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Panel } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { InputFoto } from "@/components/admin/input-foto";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TombolHapus } from "@/components/admin/form-aksi";
import { simpanFasilitas, hapusFasilitas } from "@/lib/actions/konten";
import type { Fasilitas } from "@/lib/data/types";

/**
 * Panel fasilitas sekolah di halaman /admin/fasilitas.
 *
 * Menampilkan daftar fasilitas yang sudah ada dan form tambah baru.
 * Setiap fasilitas memiliki tombol hapus (ikon tempat sampah).
 */
export function FormFasilitas({ awal }: { awal: Fasilitas[] }) {
  const [state, formAction, pending] = useActionState(simpanFasilitas, null);

  return (
    <Panel judul="Fasilitas sekolah">
      <div className="flex flex-col gap-5">
        {/* Daftar fasilitas yang sudah ada */}
        {awal.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {awal.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-card border border-line bg-page px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {item.foto.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.foto.src}
                      alt={item.foto.label}
                      className="h-10 w-14 shrink-0 rounded-btn object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-btn bg-page-alt text-[10px] text-muted">
                      Foto
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-brand-ink">
                      {item.judul}
                    </span>
                    <span className="text-xs text-muted line-clamp-1">
                      {item.deskripsi}
                    </span>
                  </div>
                </div>
                <TombolHapus
                  action={hapusFasilitas}
                  id={item.id}
                  label={item.judul}
                  className="size-8"
                >
                  <Trash2 className="size-4" aria-hidden />
                </TombolHapus>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Belum ada fasilitas yang ditambahkan.
          </p>
        )}

        {state?.pesan ? (
          <Alert tone={state.ok ? "sukses" : "bahaya"}>{state.pesan}</Alert>
        ) : null}

        {/* Form tambah fasilitas baru */}
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama fasilitas" htmlFor="judul">
              <Input
                id="judul"
                name="judul"
                placeholder="Perpustakaan"
                required
              />
            </Field>
            <Field label="Deskripsi singkat" htmlFor="deskripsi">
              <Input
                id="deskripsi"
                name="deskripsi"
                placeholder="Koleksi buku dan ruang baca"
              />
            </Field>
          </div>
          <InputFoto
            name="foto"
            id="foto"
            accept="image/jpeg,image/png,image/webp"
            teksZona="JPG, PNG, atau WebP, maksimal 5 MB"
            petunjuk="Foto fasilitas bersifat opsional."
          />
          <div>
            <Button type="submit" variant="accent" size="sm" disabled={pending}>
              {pending ? "Menyimpan…" : "Tambah fasilitas"}
            </Button>
          </div>
        </form>
      </div>
    </Panel>
  );
}
