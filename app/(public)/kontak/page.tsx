import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/page-intro";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/card";
import { ContactChannel } from "@/components/public/contact-channel";
import { MapPlaceholder } from "@/components/public/map-placeholder";
import { petaEmbedUrl, petaTautan } from "@/lib/utils/peta";
import { PublicSection } from "@/components/public/public-section";
import { getProfil } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Kontak dan Lokasi" };

/**
 * Halaman kontak.
 *
 * Data sekolah dibaca di dalam <Suspense> karena query Supabase memakai
 * cookies()/fetch (data runtime). Tanpa boundary ini, build produksi gagal
 * saat kredensial Supabase sudah diisi.
 */
export default function KontakPage() {
  return (
    <Suspense fallback={<KontakKerangka />}>
      <IsiKontak />
    </Suspense>
  );
}

async function IsiKontak() {
  const profil = await getProfil();

  const saluran = [
    { ikon: "map-pin", label: "Alamat", nilai: profil.alamat ?? "—" },
    { ikon: "phone", label: "Telepon", nilai: profil.telepon ?? "[nomor resmi sekolah]" },
    { ikon: "mail", label: "Email", nilai: profil.email ?? "—" },
  ];

  return (
    <>
      <PageIntro
        eyebrow="Kontak dan lokasi"
        judul={`Hubungi ${profil.nama}`}
        deskripsi="Sampaikan pertanyaan, kebutuhan informasi, atau rencana kunjungan melalui kanal resmi sekolah."
      />

      <PublicSection>
        <div className="flex flex-col gap-8">
          <Alert>
            Apabila nomor telepon atau alamat belum lengkap, silakan hubungi
            sekolah untuk memastikan data terbaru.
          </Alert>

          <div className="grid gap-8 lg:grid-cols-[450px_1fr] lg:gap-8">
            {/* Saluran sekolah — 450px */}
            <div className="flex w-full flex-col gap-6 lg:w-[450px] lg:shrink-0">
              <Panel judul="Kontak resmi sekolah">
                <div className="flex flex-col gap-5">
                  {saluran.map((s) => (
                    <ContactChannel
                      key={s.label}
                      ikon={s.ikon}
                      label={s.label}
                      nilai={s.nilai}
                    />
                  ))}
                </div>
              </Panel>

              <Panel judul="Jam layanan administrasi">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold leading-[1.5] text-brand-ink">
                    {profil.jamLayanan ?? "—"}
                  </p>
                  <p className="text-xs leading-[1.4] text-muted">
                    Layanan tutup pada hari libur nasional dan hari besar keagamaan.
                  </p>
                </div>
              </Panel>
            </div>

            {/* Presentasi lokasi — 718px */}
            <div className="flex flex-col gap-5">
              <MapPlaceholder
                namaSekolah={profil.nama}
                petaUrl={profil.petaUrl}
                className="h-[300px] w-full lg:h-[420px]"
              />
              {petaEmbedUrl(profil.petaUrl) ? null : (
                <p className="text-xs leading-[1.4] text-muted">
                  Peta lokasi bersifat ilustratif. Gunakan tautan di bawah untuk navigasi.
                </p>
              )}
              {petaTautan(profil.petaUrl) ? (
                <div>
                  <ButtonLink href={petaTautan(profil.petaUrl)!} variant="outline">
                    Buka di peta →
                  </ButtonLink>
                </div>
              ) : null}
              <Panel judul="Sebelum berkunjung">
                <p className="text-sm leading-[1.6] text-body">
                  Mohon menghubungi sekolah terlebih dahulu untuk memastikan waktu
                  kunjungan dan kebutuhan layanan.
                </p>
              </Panel>
            </div>
          </div>
        </div>
      </PublicSection>
    </>
  );
}

/** Kerangka pemuatan — proporsi sama dengan halaman akhir. */
function KontakKerangka() {
  return (
    <div className="container-page py-14" aria-busy="true">
      <span className="sr-only">Memuat kontak…</span>
      <div className="flex flex-col gap-3">
        <div className="h-3 w-32 rounded-pill bg-page-alt" />
        <div className="h-9 w-full max-w-[460px] rounded-btn bg-page-alt" />
        <div className="h-4 w-full max-w-[620px] rounded-btn bg-page-alt" />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[450px_1fr]">
        <div className="h-[280px] rounded-card bg-page-alt" />
        <div className="h-[420px] rounded-img bg-page-alt" />
      </div>
    </div>
  );
}
