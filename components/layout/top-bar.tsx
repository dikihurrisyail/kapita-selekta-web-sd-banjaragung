import type { ProfilSekolah } from "@/lib/data/types";

/**
 * Top bar "Informasi layanan" — 35px tinggi, bg #1E3A8A, teks 11px putih.
 * Desktop: kontak kiri, alamat kanan. Mobile: hanya kontak (sesuai frame 390).
 * Isi diambil dari profil sekolah; bagian yang kosong tidak ditampilkan.
 */
export function TopBar({ profil }: { profil?: ProfilSekolah }) {
  const alamat = profil?.alamat?.split(",").slice(0, 2).join(",").trim();
  return (
    <div className="w-full bg-brand text-white">
      <div className="container-page flex min-h-[35px] items-center justify-between gap-4 py-2.5 text-[11px] leading-[1.4]">
        <p className="whitespace-nowrap">
          {profil?.telepon ? `Telepon: ${profil.telepon}` : null}
          {profil?.telepon && profil.email ? (
            <span className="mx-2 hidden sm:inline">•</span>
          ) : null}
          {profil?.email ? <span className="hidden sm:inline">{profil.email}</span> : null}
        </p>
        {alamat ? <p className="hidden whitespace-nowrap md:block">{alamat}</p> : null}
      </div>
    </div>
  );
}
