"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";

type Tahapan = { nomor: string; judul: string; waktu: string; deskripsi: string };

/** Satu baris isian tahapan. `kunci` hanya dipakai React, tidak dikirim ke server. */
type Baris = { kunci: string; judul: string; waktu: string; deskripsi: string };

/**
 * Penyunting daftar tahapan PPDB.
 *
 * Berupa kumpulan isian berulang di dalam form PPDB induk. Setiap baris
 * mengirim tiga kolom: `tahapan_judul`, `tahapan_waktu`, `tahapan_deskripsi`.
 * Nomor tahap (01, 02, …) dibuat otomatis di server mengikuti urutan baris,
 * sehingga admin tidak perlu mengisinya sendiri.
 */
export function FormTahapan({ awal }: { awal: Tahapan[] }) {
  const [baris, setBaris] = useState<Baris[]>(() =>
    awal.map((t, i) => ({
      kunci: `awal-${i}-${t.nomor}`,
      judul: t.judul,
      waktu: t.waktu,
      deskripsi: t.deskripsi,
    })),
  );

  const ubah = (
    kunci: string,
    kolom: "judul" | "waktu" | "deskripsi",
    nilai: string,
  ) => {
    setBaris((daftar) =>
      daftar.map((b) => (b.kunci === kunci ? { ...b, [kolom]: nilai } : b)),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {baris.length === 0 ? (
        <p className="text-sm leading-[1.5] text-muted">
          Belum ada tahapan. Tekan <strong>Tambah tahapan</strong> untuk membuat
          tahap pertama.
        </p>
      ) : null}

      {baris.map((b, i) => (
        <fieldset
          key={b.kunci}
          className="flex flex-col gap-4 rounded-card border border-line bg-page p-4"
        >
          <legend className="px-1 text-xs font-bold tracking-wide text-accent-ink uppercase">
            Tahap {String(i + 1).padStart(2, "0")}
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Judul tahap" htmlFor={`tahapan-judul-${b.kunci}`}>
              <Input
                id={`tahapan-judul-${b.kunci}`}
                name="tahapan_judul"
                value={b.judul}
                onChange={(e) => ubah(b.kunci, "judul", e.target.value)}
                placeholder="Pendaftaran"
              />
            </Field>
            <Field label="Waktu" htmlFor={`tahapan-waktu-${b.kunci}`}>
              <Input
                id={`tahapan-waktu-${b.kunci}`}
                name="tahapan_waktu"
                value={b.waktu}
                onChange={(e) => ubah(b.kunci, "waktu", e.target.value)}
                placeholder="1–12 Juni 2026"
              />
            </Field>
          </div>

          <Field label="Deskripsi" htmlFor={`tahapan-deskripsi-${b.kunci}`}>
            <Textarea
              id={`tahapan-deskripsi-${b.kunci}`}
              name="tahapan_deskripsi"
              rows={2}
              value={b.deskripsi}
              onChange={(e) => ubah(b.kunci, "deskripsi", e.target.value)}
              placeholder="Ringkasan kegiatan pada tahap ini."
            />
          </Field>

          <div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() =>
                setBaris((daftar) => daftar.filter((x) => x.kunci !== b.kunci))
              }
            >
              <Trash2 className="size-4" aria-hidden />
              Hapus tahap
            </Button>
          </div>
        </fieldset>
      ))}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setBaris((daftar) => [
              ...daftar,
              { kunci: `baru-${Date.now()}`, judul: "", waktu: "", deskripsi: "" },
            ])
          }
        >
          <Plus className="size-4" aria-hidden />
          Tambah tahapan
        </Button>
      </div>
    </div>
  );
}
