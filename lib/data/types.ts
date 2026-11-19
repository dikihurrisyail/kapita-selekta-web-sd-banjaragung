/**
 * Tipe tampilan (view model) yang dipakai komponen.
 *
 * Sengaja dipisah dari tipe tabel Supabase (lib/supabase/types.ts) agar
 * komponen tidak bergantung pada bentuk kolom database. Pemetaan dari baris
 * database ke tipe ini dilakukan di lib/data/queries.ts.
 */

export type Foto = { src: string | null; label: string };

export type Pengumuman = {
  slug: string;
  tanggal: string;
  kategori: string;
  judul: string;
  ringkasan: string;
  isi?: string;
  status?: "Terbit" | "Draf";
};

export type Berita = {
  slug: string;
  kategori: string;
  tanggal: string;
  judul: string;
  ringkasan: string;
  isi?: string;
  menitBaca: number;
  foto: Foto;
  penulis?: string;
  status?: "Terbit" | "Draf";
};

export type Guru = {
  id: string;
  nama: string;
  jabatan: string;
  foto: Foto;
  publik: boolean;
  nip?: string;
};

export type Album = {
  slug: string;
  kategori: string;
  judul: string;
  tanggal: string;
  jumlahFoto: number;
  foto: Foto;
};

export type Fasilitas = { judul: string; deskripsi: string; foto: Foto };

export type ProfilSekolah = {
  nama: string;
  tagline: string;
  npsn: string | null;
  statusSekolah: string | null;
  akreditasi: string | null;
  kepalaSekolah: string | null;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  jamLayanan: string | null;
  tahunAjaran: string | null;
  sejarah: string | null;
  visi: string | null;
  misi: string[];
  kutipanKepala: string | null;
  sambutanKepala: string | null;
  logoUrl: string | null;
  heroUrl: string | null;
  fotoKepalaUrl: string | null;
  petaUrl: string | null;
};

export type TahapanPpdb = {
  nomor: string;
  judul: string;
  waktu: string;
  deskripsi: string;
};

export type PpdbInfo = {
  tahunAjaran: string;
  periode: string;
  judul: string;
  deskripsi: string;
  berkas: string[];
  catatan: string | null;
  telepon: string | null;
  email: string | null;
  tautanUrl: string | null;
  tautanAktif: boolean;
  tahapan: TahapanPpdb[];
};

export type StrukturItem = { jabatan: string; nama: string };
