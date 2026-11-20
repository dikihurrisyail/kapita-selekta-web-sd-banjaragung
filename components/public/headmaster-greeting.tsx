import { Foto } from "@/components/ui/foto";
import type { Foto as FotoTipe, ProfilSekolah } from "@/lib/data/types";

/**
 * Sambutan kepala sekolah (layer "Sambutan kepala sekolah"):
 * kartu putih border #E2E8F0, radius 12, padding 32, gap 40.
 * Foto 280×350 radius 8 + pesan (eyebrow, kutipan Newsreader 36, isi, penanda tangan).
 */
export function HeadmasterGreeting({
  profil,
  fotoKepala,
}: {
  profil: ProfilSekolah;
  /** Foto kepala sekolah dari data guru — dipakai agar sama dengan halaman /guru. */
  fotoKepala?: FotoTipe;
}) {
  const nama = profil.kepalaSekolah ?? "Kepala Sekolah";
  const kutipan =
    profil.kutipanKepala ?? "“Setiap anak membawa potensi yang layak kita rawat bersama.”";
  const isi =
    profil.sambutanKepala ??
    "Selamat datang di ruang informasi sekolah. Melalui website ini, kami ingin menjaga komunikasi yang terbuka dengan keluarga dan masyarakat.";

  const foto: FotoTipe = fotoKepala ?? {
    src: profil.fotoKepalaUrl,
    label: `Foto ${nama}`,
  };

  return (
    <section className="flex flex-col gap-6 rounded-card border border-line bg-white p-6 lg:flex-row lg:items-start lg:gap-10 lg:p-8">
      <Foto
        src={foto.src}
        label={foto.label}
        className="h-[340px] w-full shrink-0 lg:aspect-[4/5] lg:h-auto lg:w-[22%] lg:min-w-[280px]"
      />
      <div className="flex flex-1 flex-col gap-5">
        <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
          Sambutan kepala sekolah
        </p>
        <blockquote className="font-display text-[28px] font-semibold leading-[1.15] text-brand-ink sm:text-[36px]">
          {kutipan}
        </blockquote>
        <p className="text-base leading-[1.6] text-body">{isi}</p>
        <div className="flex flex-col gap-1 leading-[1.4]">
          <p className="text-base font-bold text-brand-ink">{nama}</p>
          <p className="text-xs text-muted">Kepala Sekolah</p>
        </div>
      </div>
    </section>
  );
}
