import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/public/announcement-card";
import { getPengumuman, getPengumumanBySlug, getPpdb } from "@/lib/data/queries";
import { formatTanggal } from "@/lib/utils/format-date";

type Params = { slug: string };
type Props = { params: Promise<Params> };

/*
 * Halaman detail menunggu `params` sebelum merender, supaya slug yang tidak ada
 * benar-benar mengembalikan status HTTP 404. Rute ini sengaja blocking.
 */
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPengumumanBySlug(slug);
  return { title: item ? item.judul : "Pengumuman" };
}

export default async function DetailPengumumanPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPengumumanBySlug(slug);
  if (!item) notFound();

  const [semua, ppdb] = await Promise.all([
    getPengumuman({ hanyaTerbit: true }),
    getPpdb(),
  ]);

  const lainnya = semua.filter((p) => p.slug !== slug).slice(0, 2);
  const paragraf = (item.isi ?? item.ringkasan).split("\n").filter(Boolean);

  return (
    <section className="bg-page">
      <div className="container-page py-14">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Pengumuman", href: "/pengumuman" },
            { label: item.judul },
          ]}
          className="mb-6"
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,26%)]">
          <article className="mx-auto flex max-w-[80ch] flex-col gap-6">
            <Badge className="w-fit">{item.kategori}</Badge>
            <h1 className="text-[32px] font-bold leading-[1.2] text-brand-ink sm:text-[40px]">
              {item.judul}
            </h1>
            <p className="text-sm leading-[1.5] text-muted">
              Diterbitkan {formatTanggal(item.tanggal)}
            </p>

            <Alert>
              Pengumuman ini merupakan konten resmi sekolah. Apabila ada pertanyaan,
              silakan menghubungi sekolah pada hari dan jam layanan.
            </Alert>

            <div className="flex flex-col gap-4 text-base leading-[1.7] text-body">
              {paragraf.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {ppdb.tahapan.length > 0 ? (
              <Panel judul="Ringkasan pelaksanaan">
                <dl className="flex flex-col gap-3">
                  {ppdb.tahapan.map((t) => (
                    <div
                      key={t.nomor}
                      className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-sm leading-[1.5] text-body">{t.judul}</dt>
                      <dd className="text-right text-sm font-semibold leading-[1.5] text-brand-ink">
                        {t.waktu}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Panel>
            ) : null}

            <div>
              <ButtonLink href="/pengumuman" variant="outline">
                ← Kembali ke daftar pengumuman
              </ButtonLink>
            </div>
          </article>

          <aside className="flex flex-col gap-4">
            <h2 className="text-xl font-bold leading-[1.4] text-brand-ink">
              Pengumuman lainnya
            </h2>
            {lainnya.map((p) => (
              <AnnouncementCard key={p.slug} item={p} />
            ))}
            <Link
              href="/pengumuman"
              className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
            >
              Lihat semua pengumuman →
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
