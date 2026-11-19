"use client";

import { useActionState, useEffect, useRef } from "react";
import { FolderPlus } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { simpanAlbum } from "@/lib/actions/konten";

/**
 * Form pembuatan album galeri baru.
 *
 * Terhubung ke Server Action `simpanAlbum`. Slug dibuat otomatis di server
 * dari judul, jadi admin tidak perlu memikirkan URL album.
 */
export function FormBuatAlbum({ kategori }: { kategori: string[] }) {
  const [state, formAction, pending] = useActionState(simpanAlbum, null);
  const formRef = useRef<HTMLFormElement>(null);

  /*
   * Kosongkan form hanya setelah penyimpanan BERHASIL. Kalau dikosongkan
   * saat gagal (mis. judul kosong), admin kehilangan isian yang sudah diketik.
   */
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <Field label="Judul album" htmlFor="judul">
        <Input
          id="judul"
          name="judul"
          required
          placeholder="Pekan Literasi"
          autoComplete="off"
        />
      </Field>

      <Field label="Kategori" htmlFor="kategori">
        <Select id="kategori" name="kategori" defaultValue={kategori[0]}>
          {kategori.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Tanggal kegiatan"
        htmlFor="tanggal"
        petunjuk="Kosongkan untuk memakai tanggal hari ini."
      >
        <Input id="tanggal" name="tanggal" type="date" />
      </Field>

      {state?.pesan ? (
        <Alert tone={state.ok ? "sukses" : "bahaya"}>{state.pesan}</Alert>
      ) : null}

      <div>
        <Button type="submit" variant="accent" disabled={pending}>
          <FolderPlus className="size-4" aria-hidden />
          {pending ? "Membuat…" : "Buat album"}
        </Button>
      </div>
    </form>
  );
}
