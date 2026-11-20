"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Input pilih berkas gambar untuk form admin (logo, foto guru, sampul berita).
 *
 * Berkas TIDAK diunggah dari browser. Ia ikut terkirim bersama form ke Server
 * Action, yang memvalidasi tipe/ukuran di server lalu menyimpannya ke Storage.
 * Komponen ini hanya menampilkan nama berkas + pratinjau lokal sebagai
 * penanda bahwa berkas sudah terpilih.
 */
export function InputFoto({
  name,
  id,
  accept = "image/jpeg,image/png,image/webp",
  petunjuk,
  variant = "baris",
  teksZona = "Pilih berkas gambar dari perangkat",
  modePratinjau = "cover",
}: {
  name: string;
  id: string;
  accept?: string;
  petunjuk?: React.ReactNode;
  /** "baris" = input berkas biasa, "zona" = kotak putus-putus (mendukung tarik-lepas). */
  variant?: "baris" | "zona";
  teksZona?: string;
  modePratinjau?: "cover" | "contain";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [namaBerkas, setNamaBerkas] = useState("");
  const [pratinjau, setPratinjau] = useState<string | null>(null);

  const pasangBerkas = (berkas: File) => {
    setNamaBerkas(berkas.name);
    if (pratinjau) URL.revokeObjectURL(pratinjau);
    setPratinjau(URL.createObjectURL(berkas));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Input asli tetap ada di DOM agar nilai ikut terkirim saat form disimpan. */}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        className={cn(
          variant === "zona"
            ? "sr-only"
            : "block w-full cursor-pointer rounded-btn border border-line-soft bg-white px-4 py-3 text-sm text-body file:mr-4 file:cursor-pointer file:rounded-btn file:border-0 file:bg-page-alt file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand hover:file:bg-line-soft",
        )}
        onChange={(e) => {
          const berkas = e.target.files?.[0];
          if (berkas) pasangBerkas(berkas);
        }}
      />

      {variant === "zona" ? (
        <label
          htmlFor={id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const berkas = e.dataTransfer.files?.[0];
            if (!berkas || !inputRef.current) return;
            /* Salin berkas hasil tarik-lepas ke input supaya ikut terkirim. */
            const dt = new DataTransfer();
            dt.items.add(berkas);
            inputRef.current.files = dt.files;
            pasangBerkas(berkas);
          }}
          className="flex cursor-pointer flex-col items-center gap-3 rounded-card border border-dashed border-line-soft bg-page px-6 py-10 text-center hover:bg-page-alt"
        >
          <UploadCloud className="size-7 text-line-soft" aria-hidden />
          <span className="text-sm font-semibold text-brand-ink">
            Tarik berkas ke sini atau pilih dari perangkat
          </span>
          <span className="text-xs text-muted">
            {namaBerkas || teksZona}
          </span>
        </label>
      ) : null}

      {pratinjau ? (
        <div className="flex flex-col gap-1.5">
          {/* Pratinjau lokal — belum tersimpan sampai form dikirim. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pratinjau}
            alt={`Pratinjau ${namaBerkas}`}
            className={cn(
              "h-[160px] w-full rounded-img border border-line",
              modePratinjau === "contain" ? "object-contain" : "object-cover",
            )}
          />
          <p className="text-xs text-muted">{namaBerkas}</p>
        </div>
      ) : null}

      {petunjuk ? (
        <p className="text-xs leading-[1.4] text-muted">{petunjuk}</p>
      ) : null}
    </div>
  );
}
