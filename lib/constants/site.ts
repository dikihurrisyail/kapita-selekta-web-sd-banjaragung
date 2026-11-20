/**
 * Identitas & data statis situs.
 * CATATAN: seluruh nilai di file ini adalah PLACEHOLDER.
 * Ganti dengan data resmi UPTD SD Negeri Banjar Agung sebelum publikasi.
 */
export const site = {
  nama: "UPTD SD Negeri Banjar Agung",
  tagline: "Tumbuh Bersama, Cerdas Berkarakter Jujur dalam Tindakan Mulia dalam Tujuan",
  singkatan: "SD",
  telepon: "[nomor resmi sekolah]",
  email: "halo@sdnbanjaragung.example",
  alamat:
    "Jl. Pendidikan No. 01, Kel. Teladan, Kec. Harapan, Kota Contoh, 00000 (alamat contoh)",
  alamatRingkas: "Jl. Pendidikan No. 01 • Alamat contoh",
  jamLayanan: "Senin–Jumat • 07.30–14.00 WIB",
  tahunAjaran: "2026/2027",
  catatanKonten: "",
  hakCipta: "© 2026 UPTD SD Negeri Banjar Agung",
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

export const ctaPpdb = { label: "SPMB Info", href: "/spmb" } as const;

/** Menu sidebar admin — 7 item + keluar. */
export const menuAdmin = [
  { label: "Dashboard", href: "/admin", icon: "layout-dashboard" },
  { label: "Profil Sekolah", href: "/admin/profil", icon: "school" },
  { label: "Fasilitas Sekolah", href: "/admin/fasilitas", icon: "building" },
  { label: "Data Guru", href: "/admin/guru", icon: "users" },
  { label: "Pengumuman", href: "/admin/pengumuman", icon: "megaphone" },
  { label: "Berita", href: "/admin/berita", icon: "newspaper" },
  { label: "Galeri", href: "/admin/galeri", icon: "images" },
  { label: "Informasi SPMB", href: "/admin/spmb", icon: "clipboard-list" },
] as const;

/** Tautan footer — 4 item. */
export const tautanFooter = [
  { label: "Profil Sekolah", href: "/profil" },
  { label: "Informasi Guru", href: "/guru" },
  { label: "Pengumuman", href: "/pengumuman" },
  { label: "Informasi SPMB", href: "/spmb" },
] as const;
