import { Suspense } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { HeadmasterGreeting } from "@/components/public/headmaster-greeting";
import { HeroSection, SchoolIntroduction } from "@/components/public/hero-section";
import { AnnouncementCard } from "@/components/public/announcement-card";
import { NewsCard } from "@/components/public/news-card";
import { GalleryThumb } from "@/components/public/gallery-thumb";
import { PublicSection } from "@/components/public/public-section";
import { Foto } from "@/components/ui/foto";
import { getAlbum, getBerita, getGuru, getPengumuman, getPpdb, getProfil } from "@/lib/data/queries";

/**
 * Beranda.
 *
 * Seluruh isi bergantung pada data sekolah, jadi pembacaan data dibungkus
 * <Suspense>. Query Supabase memakai cookies()/fetch (data runtime); tanpa
 * boundary ini build produksi gagal begitu kredensial Supabase diisi.
 */
export default function BerandaPage() {
  return (
    <Suspense fallback={<BerandaKerangka />}>
      <IsiBeranda />
    </Suspense>
  );
}

async function IsiBeranda() {
  const [profil, pengumuman, berita, album, guru, ppdb] = await Promise.all([
    getProfil(),
    getPengumuman({ hanyaTerbit: true, limit: 3 }),
    getBerita({ hanyaTerbit: true, limit: 3 }),
    getAlbum(),
    getGuru({ hanyaPublik: true }),
    getPpdb(),
  ]);

  return (
    <>
      <HeroSection profil={profil} />

      <PublicSection className="pt-0">
        <div className="flex flex-col gap-14">
          <SchoolIntroduction profil={profil} />
          <HeadmasterGreeting profil={profil} />

          {/* Pengumuman terbaru */}
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Papan informasi"
              judul="Pengumuman terbaru"
              tautan="Semua pengumuman →"
              href="/pengumuman"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pengumuman.map((item) => (
                <AnnouncementCard key={item.slug} item={item} />
              ))}
            </div>
          </div>

          {/* Berita dan kegiatan */}
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Berita & kegiatan"
              judul="Cerita dari sekolah"
              tautan="Semua berita →"
              href="/berita"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {berita.map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
            <div>
              <ButtonLink href="/berita" variant="outline">
                Lihat semua berita
              </ButtonLink>
            </div>
          </div>

          {/* Lingkungan dan pendidik */}
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="flex flex-col gap-5">
              <Foto
                src={null}
                label="Foto dokumentasi ilustratif — ruang belajar"
                className="h-[280px] w-full"
              />
              <h3 className="text-2xl font-bold leading-[1.25] text-brand-ink">
                Ruang yang mendukung rasa ingin tahu
              </h3>
              <p className="text-sm leading-[1.5] text-body">
                Ruang kelas, perpustakaan, halaman, dan kebun menjadi bagian dari
                lingkungan belajar yang dirawat bersama.
              </p>
              <Link
                href="/profil"
                className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
              >
                Jelajahi fasilitas →
              </Link>
            </article>

            <article className="flex flex-col gap-5">
              <Foto
                src={guru[0]?.foto.src ?? null}
                label={guru[0]?.foto.label ?? "Foto dokumentasi ilustratif — pendidik"}
                className="h-[280px] w-full"
              />
              <h3 className="text-2xl font-bold leading-[1.25] text-brand-ink">
                Guru yang mendampingi dengan hati
              </h3>
              <p className="text-sm leading-[1.5] text-body">
                Kenali para pendidik yang membantu anak bertumbuh melalui
                bimbingan, keteladanan, dan perhatian.
              </p>
              <Link
                href="/guru"
                className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
              >
                Kenali para guru →
              </Link>
            </article>
          </div>

          {/* Cuplikan galeri */}
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Galeri sekolah"
              judul="Momen kebersamaan"
              tautan="Lihat galeri →"
              href="/galeri"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {album.slice(0, 3).map((item) => (
                <GalleryThumb key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </div>
      </PublicSection>

      {/* Undangan SPMB */}
      <section className="bg-brand">
        <div className="container-page flex flex-col gap-6 py-12">
          <p className="text-xs font-bold leading-[1.4] tracking-wide text-white uppercase">
            Penerimaan murid baru
          </p>
          <h2 className="text-[32px] font-bold leading-[1.15] text-white sm:text-[36px]">
            Mari mengenal sekolah lebih dekat.
          </h2>
          <p className="max-w-[900px] text-base leading-[1.6] text-white">
            {ppdb.deskripsi}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/spmb" variant="accent">
              Lihat Informasi SPMB →
            </ButtonLink>
            <ButtonLink href="/kontak" variant="light">
              Kontak Sekolah
            </ButtonLink>
          </div>
          <p className="text-xs leading-[1.4] text-line-soft">
            Jadwal pada halaman ini merupakan contoh, bukan pengumuman penerimaan
            resmi.
          </p>
        </div>
      </section>
    </>
  );
}

/** Kerangka pemuatan beranda — meniru tinggi hero agar tidak ada lompatan. */
function BerandaKerangka() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Memuat beranda…</span>

      {/* Hero */}
      <section className="bg-page-alt">
        <div className="container-page py-12">
          <div className="flex flex-col overflow-hidden bg-brand lg:flex-row">
            <div className="flex w-full flex-col gap-6 p-6 sm:p-10 lg:w-[540px] lg:shrink-0">
              <div className="h-3 w-48 rounded-pill bg-white/25" />
              <div className="h-12 w-full rounded-btn bg-white/20" />
              <div className="h-12 w-4/5 rounded-btn bg-white/20" />
              <div className="h-4 w-full rounded-pill bg-white/15" />
              <div className="flex gap-3">
                <div className="h-11 w-36 rounded-btn bg-white/20" />
                <div className="h-11 w-40 rounded-btn bg-white/20" />
              </div>
            </div>
            <div className="h-[260px] w-full bg-white/10 sm:h-[340px] lg:h-[472px] lg:w-[660px] lg:shrink-0" />
          </div>
          <div className="flex gap-8 py-5">
            <div className="h-3 w-40 rounded-pill bg-line" />
            <div className="h-3 w-48 rounded-pill bg-line" />
            <div className="h-3 w-32 rounded-pill bg-line" />
          </div>
        </div>
      </section>

      {/* Isi */}
      <div className="container-page py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[260px] flex-col gap-4 rounded-card border border-line bg-white p-6"
            >
              <div className="h-3 w-24 rounded-pill bg-page-alt" />
              <div className="h-5 w-4/5 rounded-btn bg-page-alt" />
              <div className="h-3 w-full rounded-pill bg-page-alt" />
              <div className="h-3 w-2/3 rounded-pill bg-page-alt" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
