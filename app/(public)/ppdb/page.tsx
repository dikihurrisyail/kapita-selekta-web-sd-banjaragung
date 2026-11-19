import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/card";
import { Foto } from "@/components/ui/foto";
import { SectionHeading } from "@/components/ui/section-heading";
import { PpdbStep } from "@/components/public/ppdb-step";
import { RequirementChecklist } from "@/components/public/requirement-checklist";
import { PublicSection } from "@/components/public/public-section";
import { getPpdb } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Informasi PPDB" };

/**
 * Halaman PPDB.
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
        eyebrow="Penerimaan peserta didik baru"
        judul={`Informasi PPDB ${ppdb.tahunAjaran}`}
        deskripsi="Pelajari persyaratan, tahapan, dan cara memperoleh petunjuk pendaftaran sebelum mendaftar ke sekolah."
      />

      <PublicSection>
        <div className="flex flex-col gap-14">
          <Alert>
            Jadwal dan ketentuan pada halaman ini dapat berubah. Informasi resmi
            akan diumumkan melalui kanal sekolah.
          </Alert>

          {/* Pengantar PPDB — 560 / 608 */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
            <div className="flex w-full flex-col gap-5 lg:w-[560px] lg:shrink-0">
              <p className="text-xs font-bold leading-[1.4] tracking-wide text-accent-ink uppercase">
                Informasi penerimaan
              </p>
              <h2 className="text-[32px] font-bold leading-[1.25] text-brand-ink">
                Mari mengenal sekolah lebih dekat.
              </h2>
              <p className="text-base leading-[1.6] text-body">{ppdb.deskripsi}</p>
              <p className="text-sm leading-[1.5] text-body">
                Periode pendaftaran: {ppdb.periode}. Seluruh proses dilakukan
                tanpa biaya pendaftaran.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/kontak" variant="accent">
                  Hubungi panitia →
                </ButtonLink>
                {ppdb.tautanAktif && ppdb.tautanUrl ? (
                  <ButtonLink href={ppdb.tautanUrl} variant="outline">
                    Daftar daring
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <Foto
              src={null}
              label="Foto dokumentasi ilustratif — penerimaan peserta didik"
              className="h-[240px] w-full lg:h-[320px] lg:flex-1"
            />
          </div>

          {/* Persyaratan dan berkas — 588 / 588 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel judul="Siapa yang dapat mendaftar?">
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-[1.5] text-body">
                  Calon peserta didik yang telah memenuhi usia minimal masuk
                  sekolah dasar pada tahun ajaran berjalan.
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Berdomisili di wilayah layanan sekolah atau sekitarnya.",
                    "Memiliki dokumen kependudukan yang sah dan dapat diverifikasi.",
                    "Sehat jasmani dan rohani serta siap mengikuti kegiatan pembelajaran.",
                  ].map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm leading-[1.5] text-body">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-pill bg-accent"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="text-xs leading-[1.4] text-muted">
                  Ketentuan lengkap dapat berubah mengikuti kebijakan resmi sekolah
                  dan dinas pendidikan.
                </p>
              </div>
            </Panel>

            <Panel judul="Daftar berkas yang disiapkan">
              <div className="flex flex-col gap-4">
                <RequirementChecklist butir={ppdb.berkas} />
                {ppdb.catatan ? (
                  <p className="text-xs leading-[1.4] text-muted">{ppdb.catatan}</p>
                ) : null}
              </div>
            </Panel>
          </div>

          {/* Tahapan PPDB */}
          {ppdb.tahapan.length > 0 ? (
            <div className="flex flex-col gap-8">
              <SectionHeading eyebrow="Tahapan PPDB" judul="Langkah menuju sekolah" />
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
              Layanan panitia
            </h2>
            <p className="text-sm leading-[1.6] text-body">
              Panitia PPDB siap membantu menjelaskan persyaratan, alur pendaftaran,
              dan hal lain yang diperlukan calon peserta didik.
            </p>
            {ppdb.telepon ? (
              <p className="text-sm leading-[1.5] text-body">Telepon: {ppdb.telepon}</p>
            ) : null}
            {ppdb.email ? (
              <p className="text-sm leading-[1.5] text-body">Email: {ppdb.email}</p>
            ) : null}
            <p className="text-xs leading-[1.4] text-muted">
              Jadwal pada halaman ini merupakan contoh, bukan pengumuman penerimaan
              resmi.
            </p>
          </div>
        </div>
      </PublicSection>
    </>
  );
}

/** Kerangka pemuatan halaman PPDB. */
function PpdbKerangka() {
  return (
    <div className="container-page py-14" aria-busy="true">
      <span className="sr-only">Memuat informasi PPDB…</span>
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
