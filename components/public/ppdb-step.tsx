/**
 * Langkah PPDB (layer "Tahap penerimaan"):
 * penanda angka 44×44 (radius pill, bg brand, teks putih) + rincian
 * (judul, waktu, deskripsi). Di desktop: penanda di kiri, garis penghubung.
 */
export function PpdbStep({
  no,
  judul,
  waktu,
  deskripsi,
  terakhir,
}: {
  no: string;
  judul: string;
  waktu: string;
  deskripsi: string;
  terakhir?: boolean;
}) {
  return (
    <li className="relative flex gap-5 pb-9 last:pb-0">
      {!terakhir ? (
        <span
          aria-hidden
          className="absolute top-12 left-[21px] h-[calc(100%-2.5rem)] w-0.5 bg-line"
        />
      ) : null}
      <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-pill bg-brand text-sm font-bold text-white">
        {no}
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-bold leading-[1.3] text-brand-ink">{judul}</h3>
        <p className="text-xs font-semibold leading-[1.4] text-accent-ink">{waktu}</p>
        <p className="text-sm leading-[1.5] text-body">{deskripsi}</p>
      </div>
    </li>
  );
}
