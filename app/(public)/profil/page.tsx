import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { Foto } from "@/components/ui/foto";
import { Panel } from "@/components/ui/card";
import { FacilityCard } from "@/components/public/facility-card";
import { PublicSection } from "@/components/public/public-section";
import { getFasilitas, getProfil } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Profil Sekolah" };

/**
 * Halaman profil.
 *
 * Data dibaca di dalam <Suspense> karena query Supabase memakai
 * cookies()/fetch (data runtime). Tanpa boundary ini, build produksi gagal
 * begitu kredensial Supabase diisi.
 */
export default function ProfilPage() {
  return (
    <Suspense fallback={<ProfilKerangka />}>
      <IsiProfil />
    </Suspense>
  );
}

async function IsiProfil() {
  const [profil, fasilitas] = await Promise.all([getProfil(), getFasilitas()]);

  const paragrafSejarah = profil.sejarah?.split("\n").filter(Boolean) ?? [];

  return (
    <>
      <PageIntro
        eyebrow="Profil sekolah"
        judul="Sekolah yang tumbuh bersama warganya."
        deskripsi={`Mengenal sejarah, identitas, visi, dan fasilitas ${profil.nama} sebagai ruang belajar yang aman dan bermakna.`}
      />

      <PublicSection>
        <div className="flex flex-col gap-14">
          <Foto
            src={profil.heroUrl}
            label="Foto dokumentasi ilustratif — gedung sekolah"
            className="h-[260px] w-full lg:h-[clamp(380px,26vw,720px)]"
          />

          {/* Sejarah dan identitas — 720 / 416 */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            <div className="mx-auto flex w-full flex-col gap-4 lg:max-w-[80ch] lg:flex-1">
              <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
                Sejarah sekolah
              </p>
              <h2 className="text-[32px] font-bold leading-[1.25] text-brand-ink">
                Perjalanan sekolah dari masa ke masa.
              </h2>
              {paragrafSejarah.map((p) => (
                <p key={p} className="text-base leading-[1.6] text-body">
                  {p}
                </p>
              ))}
            </div>

            <div className="w-full lg:w-[35%] lg:shrink-0">
              <Panel judul="Identitas sekolah">
                <dl className="flex flex-col gap-3">
                  {[
                    { label: "Nama sekolah", nilai: profil.nama },
                    { label: "NPSN", nilai: profil.npsn ?? "—" },
                    { label: "Status", nilai: profil.statusSekolah ?? "—" },
                    { label: "Akreditasi", nilai: profil.akreditasi ?? "[Akreditasi resmi]" },
                    { label: "Kepala sekolah", nilai: profil.kepalaSekolah ?? "—" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-xs leading-[1.4] text-muted">{item.label}</dt>
                      <dd className="text-right text-sm font-semibold leading-[1.5] text-brand-ink">
                        {item.nilai}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Panel>
            </div>
          </div>

          {/* Visi dan misi — 470 / 698 */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <div className="flex w-full flex-col gap-4 rounded-card border border-line bg-white p-6 lg:w-[40%] lg:shrink-0">
              <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
                Visi
              </p>
              <h2 className="text-2xl font-bold leading-[1.25] text-brand-ink">
                Visi sekolah
              </h2>
              <p className="text-base leading-[1.6] text-body">{profil.visi}</p>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-card border border-line bg-white p-6">
              <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
                Misi
              </p>
              <h2 className="text-2xl font-bold leading-[1.25] text-brand-ink">
                Misi sekolah
              </h2>
              <ol className="flex flex-col gap-3">
                {profil.misi.map((item, i) => (
                  <li key={item} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-page-alt text-[11px] font-bold text-brand">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-[1.5] text-body">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Fasilitas */}
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Fasilitas sekolah" judul="Ruang yang dirawat bersama" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {fasilitas.map((item) => (
                <FacilityCard key={item.judul} item={item} />
              ))}
            </div>
          </div>
        </div>
      </PublicSection>
    </>
  );
}

/** Kerangka pemuatan halaman profil. */
function ProfilKerangka() {
  return (
    <div className="container-page py-14" aria-busy="true">
      <span className="sr-only">Memuat profil sekolah…</span>
      <div className="flex flex-col gap-3">
        <div className="h-3 w-32 rounded-pill bg-page-alt" />
        <div className="h-9 w-full max-w-[560px] rounded-btn bg-page-alt" />
        <div className="h-4 w-full max-w-[680px] rounded-btn bg-page-alt" />
      </div>
      <div className="mt-10 h-[300px] w-full rounded-img bg-page-alt" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <div className="h-4 w-full rounded-pill bg-page-alt" />
          <div className="h-4 w-5/6 rounded-pill bg-page-alt" />
          <div className="h-4 w-2/3 rounded-pill bg-page-alt" />
        </div>
        <div className="h-[240px] rounded-card bg-page-alt" />
      </div>
    </div>
  );
}
