"use client";

import { useActionState, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { unggahFoto } from "@/lib/actions/konten";

/** Album yang bisa dipilih sebagai tujuan unggah. */
export type OpsiAlbum = { id: string; judul: string; kategori: string };

/**
 * Form unggah foto galeri.
 *
 * Berkas dikirim ke Server Action (bukan langsung ke Storage dari browser),
 * supaya validasi tipe/ukuran tidak bisa dilewati dan sesi admin ikut
 * diverifikasi di server.
 */
export function FormUnggahFoto({ album }: { album: OpsiAlbum[] }) {
  const [state, formAction, pending] = useActionState(unggahFoto, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [namaBerkas, setNamaBerkas] = useState("");
  const [pratinjau, setPratinjau] = useState<string | null>(null);

  return (
    <form
      ref={formRef}
      action={(fd) => {
        formAction(fd);
        /* Kosongkan form setelah terkirim; pesan hasil tetap ditampilkan. */
        setNamaBerkas("");
        setPratinjau(null);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-5"
    >
      {album.length === 0 ? (
        <Alert tone="bahaya">
          Belum ada album. Buat album terlebih dahulu sebelum mengunggah foto.
        </Alert>
      ) : null}

      <Field label="Album tujuan" htmlFor="album_id">
        <Select id="album_id" name="album_id" required defaultValue="">
          <option value="" disabled>
            Pilih album
          </option>
          {album.map((a) => (
            <option key={a.id} value={a.id}>
              {a.judul} — {a.kategori}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Berkas foto"
        htmlFor="berkas"
        petunjuk="JPG, PNG, atau WebP. Maksimal 5 MB per foto."
      >
        <input
          id="berkas"
          name="berkas"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="block w-full cursor-pointer rounded-btn border border-line-soft bg-white px-4 py-3 text-sm text-body file:mr-4 file:cursor-pointer file:rounded-btn file:border-0 file:bg-page-alt file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand hover:file:bg-line-soft"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setNamaBerkas(f ? f.name : "");
            if (pratinjau) URL.revokeObjectURL(pratinjau);
            setPratinjau(f ? URL.createObjectURL(f) : null);
          }}
        />
      </Field>

      {pratinjau ? (
        <div className="flex flex-col gap-2">
          {/* Pratinjau lokal sebelum diunggah. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pratinjau}
            alt={`Pratinjau ${namaBerkas}`}
            className="h-[180px] w-full rounded-img border border-line object-cover"
          />
          <p className="text-xs text-muted">{namaBerkas}</p>
        </div>
      ) : null}

      <Field label="Keterangan foto" htmlFor="keterangan">
        <Input
          id="keterangan"
          name="keterangan"
          placeholder="Kegiatan literasi kelas 4"
        />
      </Field>

      {state?.pesan ? (
        <Alert tone={state.ok ? "sukses" : "bahaya"}>{state.pesan}</Alert>
      ) : null}

      <div>
        <Button
          type="submit"
          variant="accent"
          disabled={pending || album.length === 0}
        >
          <UploadCloud className="size-4" aria-hidden />
          {pending ? "Mengunggah…" : "Unggah foto"}
        </Button>
      </div>
    </form>
  );
}
