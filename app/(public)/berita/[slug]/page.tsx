import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Foto } from "@/components/ui/foto";
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsCard } from "@/components/public/news-card";
import { getBerita, getBeritaBySlug } from "@/lib/data/queries";
import { formatTanggal } from "@/lib/utils/format-date";

type Params = { slug: string };
type Props = { params: Promise<Params> };

/*
 * Halaman detail menunggu `params` sebelum merender, supaya slug yang tidak ada
 * benar-benar mengembalikan status HTTP 404 (bukan 200 berisi tampilan
 * not-found). Rute ini sengaja blocking.
 */
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBeritaBySlug(slug);
  return { title: item ? item.judul : "Berita" };
}

export default async function DetailBeritaPage({ params }: Props) {
  const { slug } = await params;
  const item = await getBeritaBySlug(slug);
  if (!item) notFound();

  const semua = await getBerita({ hanyaTerbit: true });
  const terkait = semua.filter((b) => b.slug !== slug).slice(0, 3);
  const paragraf = (item.isi ?? item.ringkasan).split("\n").filter(Boolean);

  return (
    <section className="bg-page">
      <div className="container-page py-14">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Berita", href: "/berita" },
            { label: item.judul },
          ]}
          className="mb-6"
        />

        <header className="flex max-w-[850px] flex-col gap-4">
          <Badge className="w-fit">{item.kategori}</Badge>
          <h1 className="text-[32px] font-bold leading-[1.15] text-brand-ink sm:text-[40px]">
            {item.judul}
          </h1>
          <p className="text-base leading-[1.6] text-body">{item.ringkasan}</p>
          <p className="text-xs leading-[1.4] text-muted">
            {formatTanggal(item.tanggal)} • {item.menitBaca} menit baca
          </p>
        </header>

        <Foto
          src={item.foto.src}
          label={item.foto.label}
          className="mt-8 h-[260px] w-full lg:h-[540px]"
        />
        <p className="mt-3 text-xs leading-[1.4] text-muted">
          {item.foto.label} — dokumentasi kegiatan sekolah.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[800px_1fr] lg:gap-16">
          <article className="flex flex-col gap-6">
            {paragraf.map((p, i) => (
              <p key={i} className="text-base leading-[1.7] text-body">
                {p}
              </p>
            ))}

            <div>
              <ButtonLink href="/berita" variant="outline">
                ← Kembali ke daftar berita
              </ButtonLink>
            </div>
          </article>

          <aside className="flex flex-col gap-4">
            <Panel judul="Catatan artikel">
              <div className="flex flex-col gap-2 text-sm leading-[1.5] text-body">
                <p>Kategori: {item.kategori}</p>
                <p>Tanggal: {formatTanggal(item.tanggal)}</p>
                <p>Penulis: {item.penulis ?? "Administrator"}</p>
              </div>
            </Panel>
            <Link
              href="/galeri"
              className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
            >
              Lihat galeri kegiatan →
            </Link>
          </aside>
        </div>

        {terkait.length > 0 ? (
          <div className="mt-16 flex flex-col gap-6">
            <SectionHeading judul="Berita terkait" tautan="Semua berita →" href="/berita" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {terkait.map((b) => (
                <NewsCard key={b.slug} item={b} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
