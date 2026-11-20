import { Suspense } from "react";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { TopBar } from "@/components/layout/top-bar";
import { getProfil } from "@/lib/data/queries";

/**
 * Layout publik.
 *
 * PublicHeader memakai usePathname() untuk menandai menu aktif. Dengan Cache
 * Components, pembacaan URL seperti itu harus berada di dalam Suspense boundary,
 * jadi header dibungkus <Suspense> dan kerangka navigasi disediakan sebagai
 * fallback agar tidak ada pergeseran tata letak.
 *
 * Logo sekolah berasal dari database, sehingga header dan footer dibaca di
 * dalam <Suspense> masing-masing. getProfil() dibungkus cache(), jadi keduanya
 * (dan isi halaman) berbagi satu query per permintaan.
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar />
      <Suspense fallback={<HeaderKerangka />}>
        <HeaderDinamis />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={<FooterKerangka />}>
        <FooterDinamis />
      </Suspense>
    </div>
  );
}

async function HeaderDinamis() {
  const profil = await getProfil();
  return <PublicHeader logoUrl={profil.logoUrl} />;
}

async function FooterDinamis() {
  const profil = await getProfil();
  return <PublicFooter logoUrl={profil.logoUrl} />;
}

/** Kerangka header tanpa penanda menu aktif — tinggi sama (84px) agar stabil. */
function HeaderKerangka() {
  return <div className="h-[84px] w-full border-b border-line bg-white" aria-hidden />;
}

/** Kerangka footer — tinggi serupa footer asli agar tidak terjadi lompatan. */
function FooterKerangka() {
  return (
    <footer className="w-full bg-brand-ink" aria-hidden>
      <div className="container-page flex flex-col gap-8 pt-12 pb-7">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="h-28 w-full rounded-card bg-brand-deep lg:w-[440px]" />
          <div className="h-28 w-full rounded-card bg-brand-deep lg:w-[180px]" />
          <div className="h-28 w-full flex-1 rounded-card bg-brand-deep" />
        </div>
        <div className="h-14 rounded-card bg-brand-deep" />
      </div>
    </footer>
  );
}
