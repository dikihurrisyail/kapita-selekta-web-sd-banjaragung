import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/card";
import { Foto } from "@/components/ui/foto";
import { SectionHeading } from "@/components/ui/section-heading";
import { PpdbStep } from "@/components/public/ppdb-step";
import { RequirementChecklist } from "@/components/public/requirement-checklist";
import { PublicSection } from "@/components/public/public-section";
import { getPpdb } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Informasi SPMB" };

/**
 * Halaman SPMB.
 *
 * Data dibaca di dalam <Suspense> karena query Supabase memakai
 * cookies()/fetch (data runtime). Tanpa boundary ini, build produksi gagal
 * begitu kredensial Supabase diisi.
 */
export default function PpdbPage() {
  return (
    <Suspense fallback={<PpdbKerangka />}>
      <IsiPpdb />
    </Suspense>
  );
}

async function IsiPpdb() {
  const ppdb = await getPpdb();

  return (
    <>
      <PageIntro
        eyebrow={ppdb.eyebrow}
        judul={ppdb.judul}
        deskripsi={ppdb.introDeskripsi}
      />

      <PublicSection>
        <div className="flex flex-col gap-14">
          {/* Pengantar SPMB — 560 / 608 */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
            <div className="flex w-full flex-col gap-5 lg:w-[46%] lg:shrink-0">
              <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
                {ppdb.pengantarEyebrow}
              </p>
              <h2 className="text-[32px] font-bold leading-[1.25] text-brand-ink">
                {ppdb.pengantarJudul}
              </h2>
              <p className="text-base leading-[1.6] text-body">{ppdb.deskripsi}</p>
              <p className="text-sm leading-[1.5] text-body">
                Periode pendaftaran: {ppdb.periode}.
                {ppdb.periodeCatatan ? ` ${ppdb.periodeCatatan}` : null}
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={ppdb.tombolKontakUrl} variant="accent">
                  {ppdb.tombolKontakLabel} →
                </ButtonLink>
                {ppdb.tautanAktif && ppdb.tautanUrl ? (
                  <ButtonLink href={ppdb.tautanUrl} variant="outline">
                    {ppdb.tombolDaftarLabel}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <Foto
              src={ppdb.fotoUrl}
              label={`Foto ${ppdb.judul}`}
              className="h-[240px] w-full lg:h-[clamp(320px,22vw,640px)] lg:flex-1"
            />
          </div>

          {/* Persyaratan dan berkas — 588 / 588 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel judul={ppdb.syaratJudul}>
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-[1.5] text-body">
                  {ppdb.syaratDeskripsi}
                </p>
                <ul className="flex flex-col gap-2">
                  {ppdb.syaratButir.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm leading-[1.5] text-body">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-pill bg-accent"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                {ppdb.syaratCatatan ? (
                  <p className="text-xs leading-[1.4] text-muted">
                    {ppdb.syaratCatatan}
                  </p>
                ) : null}
              </div>
            </Panel>

            <Panel judul={ppdb.berkasJudul}>
              <div className="flex flex-col gap-4">
                <RequirementChecklist butir={ppdb.berkas} />
                {ppdb.catatan ? (
                  <p className="text-xs leading-[1.4] text-muted">{ppdb.catatan}</p>
                ) : null}
              </div>
            </Panel>
          </div>

          {/* Tahapan SPMB */}
          {ppdb.tahapan.length > 0 ? (
            <div className="flex flex-col gap-8">
              <SectionHeading eyebrow={ppdb.tahapanEyebrow} judul={ppdb.tahapanJudul} />
              <ol className="flex flex-col">
                {ppdb.tahapan.map((t, i) => (
                  <PpdbStep
                    key={t.nomor}
                    no={t.nomor}
                    judul={t.judul}
                    waktu={t.waktu}
                    deskripsi={t.deskripsi}
                    terakhir={i === ppdb.tahapan.length - 1}
                  />
                ))}
              </ol>
            </div>
          ) : null}

          {/* Layanan panitia */}
          <div className="flex flex-col gap-3 rounded-card border border-line bg-page-alt p-8">
            <h2 className="text-xl font-bold leading-[1.4] text-brand-ink">
              {ppdb.layananJudul}
            </h2>
            <p className="text-sm leading-[1.6] text-body">
              {ppdb.layananDeskripsi}
            </p>
            {ppdb.telepon ? (
              <p className="text-sm leading-[1.5] text-body">Telepon: {ppdb.telepon}</p>
            ) : null}
            {ppdb.email ? (
              <p className="text-sm leading-[1.5] text-body">Email: {ppdb.email}</p>
            ) : null}
          </div>
        </div>
      </PublicSection>
    </>
  );
}

/** Kerangka pemuatan halaman SPMB. */
function PpdbKerangka() {
  return (
    <div className="container-page py-14" aria-busy="true">
      <span className="sr-only">Memuat informasi SPMB…</span>
      <div className="flex flex-col gap-3">
        <div className="h-3 w-40 rounded-pill bg-page-alt" />
        <div className="h-9 w-full max-w-[520px] rounded-btn bg-page-alt" />
        <div className="h-4 w-full max-w-[680px] rounded-btn bg-page-alt" />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="h-[280px] rounded-card bg-page-alt" />
        <div className="h-[280px] rounded-card bg-page-alt" />
      </div>
    </div>
  );
}
