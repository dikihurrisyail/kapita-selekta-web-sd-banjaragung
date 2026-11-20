import Link from "next/link";
import type { ProfilSekolah } from "@/lib/data/types";
import { site, tautanFooter } from "@/lib/constants/site";
import { SchoolIdentity } from "./school-identity";

/**
 * Footer sekolah — bg #0F172A, pt 48 pb 28, gap 32.
 * Kolom: identitas 440 · tautan cepat 180 · kontak (flex-1). Gap 32.
 * Catatan konten dipisah border-t #334155, pt 24.
 */
export function PublicFooter({ profil }: { profil: ProfilSekolah }) {
  const logoUrl = profil.logoUrl;
  return (
    <footer className="w-full bg-brand-ink">
      <div className="container-page flex flex-col gap-8 pt-12 pb-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex w-full flex-col gap-4.5 lg:w-[37%] lg:shrink-0">
            <SchoolIdentity variant="dark" logoUrl={logoUrl} />
            <p className="text-sm leading-[1.5] text-line-soft">
              Ruang informasi dan kabar sekolah untuk orang tua, guru, dan
              masyarakat. Bersama mendampingi setiap langkah anak.
            </p>
          </div>

          <nav aria-label="Tautan footer" className="flex w-full flex-col gap-3 lg:w-[15%] lg:min-w-[160px] lg:shrink-0">
            <h2 className="text-base font-semibold leading-[1.4] text-white">
              Jelajahi sekolah
            </h2>
            {tautanFooter.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm leading-[1.5] text-line-soft hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 flex-col gap-3">
            <h2 className="text-base font-semibold leading-[1.4] text-white">
              Hubungi sekolah
            </h2>
            {profil.alamat ? (
              <p className="text-sm leading-[1.5] text-line-soft">{profil.alamat}</p>
            ) : null}
            <div className="text-sm leading-[1.5] text-line-soft">
              {profil.email ? <p>{profil.email}</p> : null}
              {profil.telepon ? <p>Telepon: {profil.telepon}</p> : null}
            </div>
            <p className="text-xs leading-[1.4] text-line-soft">
              {profil.jamLayanan ?? site.jamLayanan}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line-dark pt-6 text-xs leading-[1.4] text-line-soft">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            <span>{site.hakCipta}</span>
            <span aria-hidden>|</span>
            <Link href="/admin/login" className="hover:text-white">
              Akses Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
