import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Foto } from "@/components/ui/foto";
import type { ProfilSekolah } from "@/lib/data/types";

/**
 * Hero beranda (layer "Hero sekolah"):
 * kontainer bg #1E3A8A, 2 kolom — pesan 540px (padding 40, gap 24)
 * dan foto 660×472 radius 8. Di bawahnya baris info layanan utama.
 */
export function HeroSection({ profil }: { profil: ProfilSekolah }) {
  const infoLayanan = [
    "Informasi terbuka untuk semua",
    `Layanan sekolah • ${profil.jamLayanan ?? "Senin–Jumat"}`,
    `Tahun ajaran ${profil.tahunAjaran ?? "—"}`,
  ];

  return (
    <section className="bg-page-alt">
      <div className="container-page py-12">
        <div className="flex flex-col overflow-hidden rounded-none bg-brand lg:flex-row">
          <div className="flex w-full flex-col gap-6 p-6 sm:p-10 lg:w-[540px] lg:shrink-0">
            <p className="text-xs font-bold leading-[1.4] tracking-wide text-white uppercase">
              Selamat datang di {profil.nama}
            </p>
            <h1 className="font-display text-[36px] font-bold leading-[1.15] text-white sm:text-[48px]">
              Tempat tumbuh, belajar, dan menjadi berarti.
            </h1>
            <p className="text-base leading-[1.6] text-white">
              {profil.tagline ||
                "Mendampingi setiap anak dengan pembelajaran yang bermakna, karakter yang kuat, dan lingkungan yang peduli."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/profil" variant="light">
                Kenali Sekolah
              </ButtonLink>
              <ButtonLink href="/ppdb" variant="accent">
                Informasi PPDB →
              </ButtonLink>
            </div>
          </div>
          <Foto
            src={profil.heroUrl}
            label="Foto dokumentasi ilustratif — suasana sekolah"
            className="h-[260px] w-full rounded-none sm:h-[340px] lg:h-[472px] lg:w-[660px] lg:shrink-0"
          />
        </div>

        <ul className="flex flex-col gap-2 border-b border-line-soft py-5 text-xs font-semibold leading-[1.4] text-brand sm:flex-row sm:flex-wrap sm:gap-8">
          {infoLayanan.map((item) => (
            <li key={item} className="whitespace-nowrap">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Blok perkenalan sekolah: judul 380px + ringkasan, gap 64. */
export function SchoolIntroduction({ profil }: { profil: ProfilSekolah }) {
  const paragraf = profil.sejarah?.split("\n").filter(Boolean) ?? [];

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
      <div className="flex w-full flex-col gap-2.5 lg:w-[380px] lg:shrink-0">
        <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
          Mengenal sekolah
        </p>
        <h2 className="text-[32px] font-bold leading-[1.25] text-brand-ink">
          Pendidikan yang dekat dengan kehidupan.
        </h2>
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <p className="text-base leading-[1.6] text-body">
          {paragraf[0] ??
            `${profil.nama} adalah sekolah dasar yang menempatkan karakter, rasa ingin tahu, dan kebersamaan sebagai fondasi belajar.`}
        </p>
        {paragraf[1] ? (
          <p className="text-sm leading-[1.5] text-body">{paragraf[1]}</p>
        ) : null}
        <Link
          href="/profil"
          className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
        >
          Baca profil sekolah →
        </Link>
      </div>
    </div>
  );
}
