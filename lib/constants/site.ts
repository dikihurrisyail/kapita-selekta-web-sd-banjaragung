/**
 * Identitas & data statis situs.
 * CATATAN: seluruh nilai di file ini adalah PLACEHOLDER.
 * Ganti dengan data resmi SD Banjaragung sebelum publikasi.
 */
export const site = {
  nama: "SD Banjaragung",
  tagline: "Bertumbuh bersama, berakar pada nilai.",
  singkatan: "SD",
  telepon: "[nomor resmi sekolah]",
  email: "halo@sdbanjaragung.example",
  alamat:
    "Jl. Pendidikan No. 01, Kel. Teladan, Kec. Harapan, Kota Contoh, 00000 (alamat contoh)",
  alamatRingkas: "Jl. Pendidikan No. 01 • Alamat contoh",
  jamLayanan: "Senin–Jumat • 07.30–14.00 WIB",
  tahunAjaran: "2026/2027",
  catatanKonten:
    "Contoh konten — sesuaikan dengan data resmi sekolah. Nama, foto, jadwal, dan informasi bersifat ilustratif.",
  hakCipta: "© 2026 SD Banjaragung • Contoh situs informasi sekolah",
} as const;

/** Menu publik — 7 tautan + 1 CTA (sesuai desain header). */
export const menuPublik = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Guru", href: "/guru" },
  { label: "Pengumuman", href: "/pengumuman" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
] as const;

export const ctaPpdb = { label: "PPDB Info", href: "/ppdb" } as const;

/** Menu sidebar admin — 7 item + keluar. */
export const menuAdmin = [
  { label: "Dashboard", href: "/admin", icon: "layout-dashboard" },
  { label: "Profil Sekolah", href: "/admin/profil", icon: "school" },
  { label: "Data Guru", href: "/admin/guru", icon: "users" },
  { label: "Pengumuman", href: "/admin/pengumuman", icon: "megaphone" },
  { label: "Berita", href: "/admin/berita", icon: "newspaper" },
  { label: "Galeri", href: "/admin/galeri", icon: "images" },
  { label: "Informasi PPDB", href: "/admin/ppdb", icon: "clipboard-list" },
] as const;

/** Tautan footer — 4 item. */
export const tautanFooter = [
  { label: "Profil Sekolah", href: "/profil" },
  { label: "Informasi Guru", href: "/guru" },
  { label: "Pengumuman", href: "/pengumuman" },
  { label: "Informasi PPDB", href: "/ppdb" },
] as const;
