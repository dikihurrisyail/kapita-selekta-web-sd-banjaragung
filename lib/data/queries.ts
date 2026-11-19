import "server-only";
import { createClient } from "@/lib/supabase/server";
import { catatErrorSupabase, isSupabaseConfigured } from "@/lib/supabase/config";
import * as fallback from "@/lib/data/fallback";
import type {
  Album,
  Berita,
  Fasilitas,
  Foto,
  Guru,
  Pengumuman,
  PpdbInfo,
  ProfilSekolah,
  StrukturItem,
} from "@/lib/data/types";

/**
 * Lapisan data tunggal untuk seluruh halaman.
 *
 * Setiap fungsi:
 *   1. Mengembalikan data dari Supabase bila sudah dikonfigurasi.
 *   2. Jatuh ke data fallback (lib/data/fallback.ts) bila belum dikonfigurasi
 *      atau query gagal — supaya halaman tidak pernah kosong/error.
 */

/** Bangun objek foto dari URL storage. */
function keFoto(url: string | null, label: string): Foto {
  return { src: url, label };
}

/**
 * True bila error terjadi karena prerender sudah selesai.
 *
 * Dengan cacheComponents, io()/cookies() melempar "Hanging Promise rejection"
 * saat prerender ditutup. Itu bukan kegagalan nyata — React hanya memberi tahu
 * bahwa bagian dinamis tidak ikut diprerender. Query cukup memakai data
 * cadangan tanpa perlu mencetak error ke log build.
 */
function errorPrerender(error: unknown): boolean {
  const pesan = error instanceof Error ? error.message : String(error);
  return (
    pesan.includes("prerender is complete") ||
    pesan.includes("HANGING_PROMISE_REJECTION") ||
    pesan.includes("During prerendering")
  );
}

/** Catat kegagalan, kecuali kegagalan yang wajar saat prerender. */
function catat(label: string, error: unknown): void {
  if (errorPrerender(error)) return;
  catatErrorSupabase(label, error);
}

/* ------------------------------------------------------------------ Profil */

export async function getProfil(): Promise<ProfilSekolah> {
  if (!isSupabaseConfigured()) return fallbackProfil();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profil_sekolah")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return fallbackProfil();

    return {
      nama: data.nama,
      tagline: data.tagline,
      npsn: data.npsn,
      statusSekolah: data.status_sekolah,
      akreditasi: data.akreditasi,
      kepalaSekolah: data.kepala_sekolah,
      alamat: data.alamat,
      telepon: data.telepon,
      email: data.email,
      jamLayanan: data.jam_layanan,
      tahunAjaran: data.tahun_ajaran,
      sejarah: data.sejarah,
      visi: data.visi,
      misi: data.misi ?? [],
      kutipanKepala: data.kutipan_kepala,
      sambutanKepala: data.sambutan_kepala,
      logoUrl: data.logo_url,
      heroUrl: data.hero_url,
      fotoKepalaUrl: data.foto_kepala_url,
      petaUrl: data.peta_url,
    };
  } catch (error) {
    catat("profil_sekolah", error);
    return fallbackProfil();
  }
}

function fallbackProfil(): ProfilSekolah {
  return {
    nama: fallback.profil.identitas.data[0].nilai,
    tagline: "Bertumbuh bersama, berakar pada nilai.",
    npsn: null,
    statusSekolah: "Negeri",
    akreditasi: null,
    kepalaSekolah: fallback.sambutanKepalaSekolah.nama,
    alamat: fallback.kontak.saluran[0].nilai,
    telepon: null,
    email: fallback.kontak.saluran[2].nilai,
    jamLayanan: fallback.kontak.jam.isi,
    tahunAjaran: "2026/2027",
    sejarah: fallback.profil.sejarah.paragraf.join("\n\n"),
    visi: fallback.profil.visi.isi,
    misi: [...fallback.profil.misi.butir],
    kutipanKepala: fallback.sambutanKepalaSekolah.kutipan,
    sambutanKepala: fallback.sambutanKepalaSekolah.isi,
    logoUrl: null,
    heroUrl: null,
    fotoKepalaUrl: null,
    petaUrl: null,
  };
}

/* -------------------------------------------------------------------- Guru */

export async function getGuru(opsi?: { hanyaPublik?: boolean }): Promise<Guru[]> {
  const hanyaPublik = opsi?.hanyaPublik ?? false;

  if (!isSupabaseConfigured()) return fallbackGuru(hanyaPublik);

  try {
    const supabase = await createClient();
    let query = supabase.from("guru").select("*").order("urutan", { ascending: true });
    if (hanyaPublik) query = query.eq("publik", true);

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      nama: row.nama,
      jabatan: row.jabatan,
      foto: keFoto(row.foto_url, `Foto ${row.nama}`),
      publik: row.publik,
      nip: row.nip ?? undefined,
    }));
  } catch (error) {
    catat("guru", error);
    return fallbackGuru(hanyaPublik);
  }
}

function fallbackGuru(hanyaPublik: boolean): Guru[] {
  return hanyaPublik ? fallback.guru.filter((g) => g.publik) : [...fallback.guru];
}

/* -------------------------------------------------------------- Pengumuman */

export async function getPengumuman(opsi?: {
  hanyaTerbit?: boolean;
  limit?: number;
}): Promise<Pengumuman[]> {
  const hanyaTerbit = opsi?.hanyaTerbit ?? true;

  if (!isSupabaseConfigured()) {
    let hasil = fallback.pengumuman;
    if (hanyaTerbit) hasil = hasil.filter((p) => p.status !== "Draf");
    return opsi?.limit ? hasil.slice(0, opsi.limit) : [...hasil];
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("pengumuman")
      .select("*")
      .order("tanggal", { ascending: false });
    if (hanyaTerbit) query = query.eq("status", "Terbit");
    if (opsi?.limit) query = query.limit(opsi.limit);

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row) => ({
      slug: row.slug,
      tanggal: row.tanggal,
      kategori: row.kategori,
      judul: row.judul,
      ringkasan: row.ringkasan,
      isi: row.isi,
      status: row.status,
    }));
  } catch (error) {
    catat("pengumuman", error);
    let hasil = fallback.pengumuman;
    if (hanyaTerbit) hasil = hasil.filter((p) => p.status !== "Draf");
    return opsi?.limit ? hasil.slice(0, opsi.limit) : [...hasil];
  }
}

/**
 * Ambil satu pengumuman menurut slug.
 * Default hanya "Terbit" supaya draf tidak terbuka di halaman publik.
 */
export async function getPengumumanBySlug(
  slug: string,
  opsi?: { hanyaTerbit?: boolean },
): Promise<Pengumuman | null> {
  const daftar = await getPengumuman({ hanyaTerbit: opsi?.hanyaTerbit ?? true });
  return daftar.find((p) => p.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ Berita */

export async function getBerita(opsi?: {
  hanyaTerbit?: boolean;
  limit?: number;
}): Promise<Berita[]> {
  const hanyaTerbit = opsi?.hanyaTerbit ?? true;

  if (!isSupabaseConfigured()) {
    let hasil = fallback.berita;
    if (hanyaTerbit) hasil = hasil.filter((b) => b.status !== "Draf");
    return opsi?.limit ? hasil.slice(0, opsi.limit) : [...hasil];
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("berita").select("*").order("tanggal", { ascending: false });
    if (hanyaTerbit) query = query.eq("status", "Terbit");
    if (opsi?.limit) query = query.limit(opsi.limit);

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row) => ({
      slug: row.slug,
      kategori: row.kategori,
      tanggal: row.tanggal,
      judul: row.judul,
      ringkasan: row.ringkasan,
      isi: row.isi,
      menitBaca: row.menit_baca,
      foto: keFoto(row.foto_url, `Foto dokumentasi — ${row.judul}`),
      penulis: row.penulis ?? undefined,
      status: row.status,
    }));
  } catch (error) {
    catat("berita", error);
    let hasil = fallback.berita;
    if (hanyaTerbit) hasil = hasil.filter((b) => b.status !== "Draf");
    return opsi?.limit ? hasil.slice(0, opsi.limit) : [...hasil];
  }
}

/**
 * Ambil satu berita menurut slug.
 *
 * Default hanya mengambil konten "Terbit" agar draf tidak bisa dibuka lewat
 * URL langsung di halaman publik. Panel admin memakai getBerita({ hanyaTerbit:
 * false }) untuk keperluan penyuntingan.
 */
export async function getBeritaBySlug(
  slug: string,
  opsi?: { hanyaTerbit?: boolean },
): Promise<Berita | null> {
  const daftar = await getBerita({ hanyaTerbit: opsi?.hanyaTerbit ?? true });
  return daftar.find((b) => b.slug === slug) ?? null;
}

/* ------------------------------------------------------------------ Album */

export async function getAlbum(): Promise<Album[]> {
  if (!isSupabaseConfigured()) return fallbackAlbum();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("album")
      .select("*, foto_galeri(count)")
      .order("tanggal", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => {
      const jumlah = Array.isArray(row.foto_galeri)
        ? (row.foto_galeri[0] as { count: number } | undefined)?.count ?? 0
        : 0;
      return {
        id: row.id,
        slug: row.slug,
        kategori: row.kategori,
        judul: row.judul,
        tanggal: row.tanggal,
        jumlahFoto: jumlah,
        foto: keFoto(row.sampul_url, `Album ${row.judul}`),
      };
    });
  } catch (error) {
    catat("album", error);
    return fallbackAlbum();
  }
}

function fallbackAlbum(): Album[] {
  return fallback.album.map((a) => ({ ...a }));
}

/** Satu foto di dalam album, dipakai panel admin. */
export type FotoAlbum = {
  id: string;
  keterangan: string;
  url: string;
  urutan: number;
};

/**
 * Daftar foto milik satu album (untuk panel admin).
 * Hanya dipakai di area admin, jadi tidak ada fallback data contoh.
 */
export async function getFotoAlbum(albumId: string): Promise<FotoAlbum[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("foto_galeri")
      .select("id, keterangan, foto_url, urutan")
      .eq("album_id", albumId)
      .order("urutan", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      keterangan: row.keterangan,
      url: row.foto_url,
      urutan: row.urutan,
    }));
  } catch (error) {
    catat("foto_galeri", error);
    return [];
  }
}

/** Semua foto dari semua album, dikelompokkan per album_id. */
export async function getSemuaFoto(): Promise<Record<string, FotoAlbum[]>> {
  if (!isSupabaseConfigured()) return {};

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("foto_galeri")
      .select("id, album_id, keterangan, foto_url, urutan")
      .order("urutan", { ascending: true });

    if (error) throw error;

    const hasil: Record<string, FotoAlbum[]> = {};
    for (const row of data ?? []) {
      (hasil[row.album_id] ??= []).push({
        id: row.id,
        keterangan: row.keterangan,
        url: row.foto_url,
        urutan: row.urutan,
      });
    }
    return hasil;
  } catch (error) {
    catat("foto_galeri", error);
    return {};
  }
}

/* -------------------------------------------------------------- Fasilitas */

export async function getFasilitas(): Promise<Fasilitas[]> {
  if (!isSupabaseConfigured()) return fallback.fasilitas.map((f) => ({ ...f }));

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fasilitas")
      .select("*")
      .order("urutan", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      judul: row.judul,
      deskripsi: row.deskripsi,
      foto: keFoto(row.foto_url, `Foto dokumentasi — ${row.judul}`),
    }));
  } catch (error) {
    catat("fasilitas", error);
    return fallback.fasilitas.map((f) => ({ ...f }));
  }
}

/* ------------------------------------------------------ Struktur organisasi */

export async function getStruktur(): Promise<StrukturItem[]> {
  if (!isSupabaseConfigured()) return fallbackStruktur();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("struktur_organisasi")
      .select("*")
      .order("urutan", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => ({ jabatan: row.jabatan, nama: row.nama }));
  } catch (error) {
    catat("struktur_organisasi", error);
    return fallbackStruktur();
  }
}

function fallbackStruktur(): StrukturItem[] {
  const { kepala, tim } = fallback.profil.struktur;
  return [
    { jabatan: kepala.jabatan, nama: kepala.nama },
    ...tim.map((t) => ({ jabatan: t.jabatan, nama: t.nama })),
  ];
}

/* -------------------------------------------------------------------- PPDB */

export async function getPpdb(): Promise<PpdbInfo> {
  if (!isSupabaseConfigured()) return fallbackPpdb();

  try {
    const supabase = await createClient();
    const [infoRes, tahapRes] = await Promise.all([
      supabase.from("ppdb_info").select("*").eq("id", 1).maybeSingle(),
      supabase.from("ppdb_tahapan").select("*").order("urutan", { ascending: true }),
    ]);

    if (infoRes.error) throw infoRes.error;
    if (tahapRes.error) throw tahapRes.error;
    if (!infoRes.data) return fallbackPpdb();

    return {
      tahunAjaran: infoRes.data.tahun_ajaran,
      periode: infoRes.data.periode,
      judul: infoRes.data.judul,
      deskripsi: infoRes.data.deskripsi,
      berkas: infoRes.data.berkas ?? [],
      catatan: infoRes.data.catatan,
      telepon: infoRes.data.telepon,
      email: infoRes.data.email,
      tautanUrl: infoRes.data.tautan_url,
      tautanAktif: infoRes.data.tautan_aktif,
      tahapan: (tahapRes.data ?? []).map((t) => ({
        nomor: t.nomor,
        judul: t.judul,
        waktu: t.waktu,
        deskripsi: t.deskripsi,
      })),
    };
  } catch (error) {
    catat("ppdb", error);
    return fallbackPpdb();
  }
}

function fallbackPpdb(): PpdbInfo {
  return {
    tahunAjaran: fallback.ppdbIntro.judul.replace("Informasi PPDB ", ""),
    periode: fallback.ppdbTahapan.tahap[0]?.waktu ?? "",
    judul: fallback.ppdbIntro.judul,
    deskripsi: fallback.ppdbPengantar.paragraf1,
    berkas: [...fallback.ppdbBerkas.butir],
    catatan: fallback.ppdbBerkas.catatan,
    telepon: null,
    email: fallback.kontak.saluran[2].nilai,
    tautanUrl: null,
    tautanAktif: false,
    tahapan: fallback.ppdbTahapan.tahap.map((t) => ({
      nomor: t.no,
      judul: t.judul,
      waktu: t.waktu,
      deskripsi: t.deskripsi,
    })),
  };
}

/* ------------------------------------------------------------------ Ringkas */

/** Angka untuk kartu ringkasan dashboard admin. */
export async function getRingkasanDashboard() {
  if (!isSupabaseConfigured()) {
    const p = fallback.pengumuman;
    return {
      pengumuman: p.length,
      pengumumanTerbit: p.filter((x) => x.status === "Terbit").length,
      pengumumanDraf: p.filter((x) => x.status === "Draf").length,
      berita: fallback.berita.length,
      beritaTerbit: fallback.berita.filter((x) => x.status === "Terbit").length,
      guru: fallback.guru.length,
      guruPublik: fallback.guru.filter((g) => g.publik).length,
      foto: fallback.album.reduce((total, a) => total + a.jumlahFoto, 0),
      album: fallback.album.length,
    };
  }

  try {
    const supabase = await createClient();
    const [pengumuman, berita, guru, foto, album] = await Promise.all([
      supabase.from("pengumuman").select("status"),
      supabase.from("berita").select("status"),
      supabase.from("guru").select("publik"),
      supabase.from("foto_galeri").select("id", { count: "exact", head: true }),
      supabase.from("album").select("id", { count: "exact", head: true }),
    ]);

    const p = pengumuman.data ?? [];
    const b = berita.data ?? [];
    const g = guru.data ?? [];

    return {
      pengumuman: p.length,
      pengumumanTerbit: p.filter((x) => x.status === "Terbit").length,
      pengumumanDraf: p.filter((x) => x.status === "Draf").length,
      berita: b.length,
      beritaTerbit: b.filter((x) => x.status === "Terbit").length,
      guru: g.length,
      guruPublik: g.filter((x) => x.publik).length,
      foto: foto.count ?? 0,
      album: album.count ?? 0,
    };
  } catch (error) {
    catat("ringkasan dashboard", error);
    return {
      pengumuman: 0,
      pengumumanTerbit: 0,
      pengumumanDraf: 0,
      berita: 0,
      beritaTerbit: 0,
      guru: 0,
      guruPublik: 0,
      foto: 0,
      album: 0,
    };
  }
}
