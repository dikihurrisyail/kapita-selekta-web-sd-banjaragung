import type { StrukturItem } from "@/lib/data/types";

/**
 * Bagan organisasi (layer "Bagan organisasi"):
 * Kepala Sekolah di atas, tiga cabang di bawah (Koordinator Kurikulum,
 * Tim Pendidik, Komite Sekolah).
 */
export function OrganizationChart({ struktur }: { struktur: StrukturItem[] }) {
  const [kepala, ...tim] = struktur;

  if (!kepala) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[360px] flex-col items-center gap-1 rounded-card border border-line bg-white px-6 py-5 text-center">
        <p className="text-xs leading-[1.4] text-muted">{kepala.jabatan}</p>
        <p className="text-base font-bold leading-[1.35] text-brand-ink">{kepala.nama}</p>
      </div>

      {tim.length > 0 ? (
        <>
          <span aria-hidden className="h-6 w-0.5 bg-line" />
          <div className="grid w-full gap-4 sm:grid-cols-3">
            {tim.map((item) => (
              <div
                key={`${item.jabatan}-${item.nama}`}
                className="flex flex-col items-center gap-1 rounded-card border border-line bg-white px-5 py-5 text-center"
              >
                <p className="text-xs leading-[1.4] text-muted">{item.jabatan}</p>
                <p className="text-sm font-semibold leading-[1.35] text-brand-ink">
                  {item.nama}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <p className="text-xs leading-[1.4] text-muted">
        Struktur organisasi bersifat ilustratif dan dapat disesuaikan.
      </p>
    </div>
  );
}
