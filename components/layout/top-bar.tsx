import { site } from "@/lib/constants/site";

/**
 * Top bar "Informasi layanan" — 35px tinggi, bg #1E3A8A, teks 11px putih.
 * Desktop: kontak kiri, alamat kanan. Mobile: hanya kontak (sesuai frame 390).
 */
export function TopBar() {
  return (
    <div className="w-full bg-brand text-white">
      <div className="container-page flex items-center justify-between gap-4 py-2.5 text-[11px] leading-[1.4]">
        <p className="whitespace-nowrap">
          Telepon: {site.telepon}
          <span className="mx-2 hidden sm:inline">•</span>
          <span className="hidden sm:inline">{site.email}</span>
        </p>
        <p className="hidden whitespace-nowrap md:block">{site.alamatRingkas}</p>
      </div>
    </div>
  );
}
