import { Suspense } from "react";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { TopBar } from "@/components/layout/top-bar";

/**
 * Layout publik.
 *
 * PublicHeader memakai usePathname() untuk menandai menu aktif. Dengan Cache
 * Components, pembacaan URL seperti itu harus berada di dalam Suspense boundary,
 * jadi header dibungkus <Suspense> dan kerangka navigasi disediakan sebagai
 * fallback agar tidak ada pergeseran tata letak.
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col">
      <TopBar />
      <Suspense fallback={<HeaderKerangka />}>
        <PublicHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

/** Kerangka header tanpa penanda menu aktif — tinggi sama (84px) agar stabil. */
function HeaderKerangka() {
  return <div className="h-[84px] w-full border-b border-line bg-white" aria-hidden />;
}
