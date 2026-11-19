"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { wajibLogin } from "@/lib/supabase/auth";
import { slugify } from "@/lib/utils/format-date";
import type { HasilAksi } from "./auth";

/**
 * Server Actions untuk mengubah konten.
 *
 * Semua aksi:
 *   * memanggil wajibLogin() — proxy tidak cukup untuk Server Action
 *   * memakai RLS Supabase sebagai lapisan kedua
 *   * mengembalikan { ok, pesan } agar bisa ditampilkan di form
 */

const MODE_DEMO: HasilAksi = {
  ok: false,
  pesan:
    "Supabase belum dikonfigurasi, jadi perubahan tidak disimpan. Isi kredensial di .env.local untuk mengaktifkan penyimpanan.",
};

function teks(formData: FormData, kunci: string): string {
  return String(formData.get(kunci) ?? "").trim();
}

function angka(formData: FormData, kunci: string, bawaan: number): number {
  const nilai = Number(formData.get(kunci));
  return Number.isFinite(nilai) ? nilai : bawaan;
}

function boolean(formData: FormData, kunci: string): boolean {
  const nilai = formData.get(kunci);
  return nilai === "on" || nilai === "true" || nilai === "1";
}

function barisTeks(formData: FormData, kunci: string): string[] {
  return teks(formData, kunci)
    .split("\n")
    .map((baris) => baris.trim())
    .filter(Boolean);
}

/** Segarkan seluruh halaman publik yang menampilkan konten. */
function segarkanPublik(...rute: string[]) {
  revalidatePath("/");
  rute.forEach((r) => revalidatePath(r));
}

/* ------------------------------------------------------------------ Profil */

export async function simpanProfil(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();
  const { error } = await supabase
    .from("profil_sekolah")
    .update({
      nama: teks(formData, "nama"),
      tagline: teks(formData, "tagline"),
      npsn: teks(formData, "npsn") || null,
      status_sekolah: teks(formData, "status_sekolah") || null,
      akreditasi: teks(formData, "akreditasi") || null,
      kepala_sekolah: teks(formData, "kepala_sekolah") || null,
      alamat: teks(formData, "alamat") || null,
      telepon: teks(formData, "telepon") || null,
      email: teks(formData, "email") || null,
      jam_layanan: teks(formData, "jam_layanan") || null,
      tahun_ajaran: teks(formData, "tahun_ajaran") || null,
      sejarah: teks(formData, "sejarah") || null,
      visi: teks(formData, "visi") || null,
      misi: barisTeks(formData, "misi"),
      sambutan_kepala: teks(formData, "sambutan_kepala") || null,
    })
    .eq("id", 1);

  if (error) return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };

  segarkanPublik("/profil", "/kontak", "/ppdb");
  revalidatePath("/admin/profil");
  return { ok: true, pesan: "Profil sekolah berhasil disimpan." };
}

/* -------------------------------------------------------------------- Guru */

export async function simpanGuru(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const id = teks(formData, "id");
  const nama = teks(formData, "nama");
  const jabatan = teks(formData, "jabatan");

  if (!nama || !jabatan) {
    return { ok: false, pesan: "Nama dan jabatan wajib diisi." };
  }

  const supabase = await createClient();
  const data = {
    nama,
    jabatan,
    nip: teks(formData, "nip") || null,
    publik: boolean(formData, "publik"),
    urutan: angka(formData, "urutan", 0),
  };

  const { error } = id
    ? await supabase.from("guru").update(data).eq("id", id)
    : await supabase.from("guru").insert(data);

  if (error) return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };

  segarkanPublik("/guru");
  revalidatePath("/admin/guru");
  return { ok: true, pesan: id ? "Data guru diperbarui." : "Guru baru ditambahkan." };
}

export async function hapusGuru(id: string): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();
  const { error } = await supabase.from("guru").delete().eq("id", id);
  if (error) return { ok: false, pesan: `Gagal menghapus: ${error.message}` };

  segarkanPublik("/guru");
  revalidatePath("/admin/guru");
  return { ok: true, pesan: "Data guru dihapus." };
}

/* -------------------------------------------------------------- Pengumuman */

export async function simpanPengumuman(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const id = teks(formData, "id");
  const judul = teks(formData, "judul");
  if (!judul) return { ok: false, pesan: "Judul pengumuman wajib diisi." };

  const supabase = await createClient();
  const data = {
    judul,
    slug: teks(formData, "slug") || slugify(judul),
    ringkasan: teks(formData, "ringkasan"),
    isi: teks(formData, "isi"),
    kategori: teks(formData, "kategori") || "Umum",
    tanggal: teks(formData, "tanggal") || new Date().toISOString().slice(0, 10),
    status: (teks(formData, "status") || "Draf") as "Terbit" | "Draf",
  };

  const { error } = id
    ? await supabase.from("pengumuman").update(data).eq("id", id)
    : await supabase.from("pengumuman").insert(data);

  if (error) return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };

  segarkanPublik("/pengumuman", `/pengumuman/${data.slug}`);
  revalidatePath("/admin/pengumuman");
  return { ok: true, pesan: "Pengumuman disimpan." };
}

export async function hapusPengumuman(slug: string): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();
  const { error } = await supabase.from("pengumuman").delete().eq("slug", slug);
  if (error) return { ok: false, pesan: `Gagal menghapus: ${error.message}` };

  segarkanPublik("/pengumuman");
  revalidatePath("/admin/pengumuman");
  return { ok: true, pesan: "Pengumuman dihapus." };
}

/* ------------------------------------------------------------------ Berita */

export async function simpanBerita(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const slugLama = teks(formData, "slug_lama");
  const judul = teks(formData, "judul");
  if (!judul) return { ok: false, pesan: "Judul berita wajib diisi." };

  const supabase = await createClient();
  const data = {
    judul,
    slug: teks(formData, "slug") || slugify(judul),
    ringkasan: teks(formData, "ringkasan"),
    isi: teks(formData, "isi"),
    kategori: teks(formData, "kategori") || "Kegiatan",
    tanggal: teks(formData, "tanggal") || new Date().toISOString().slice(0, 10),
    menit_baca: angka(formData, "menit_baca", 3),
    penulis: teks(formData, "penulis") || "Administrator",
    status: (teks(formData, "status") || "Draf") as "Terbit" | "Draf",
  };

  const { error } = slugLama
    ? await supabase.from("berita").update(data).eq("slug", slugLama)
    : await supabase.from("berita").insert(data);

  if (error) return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };

  segarkanPublik("/berita", `/berita/${data.slug}`, `/berita/${slugLama}`);
  revalidatePath("/admin/berita");
  return { ok: true, pesan: slugLama ? "Berita diperbarui." : "Berita disimpan." };
}

export async function hapusBerita(slug: string): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();
  const { error } = await supabase.from("berita").delete().eq("slug", slug);
  if (error) return { ok: false, pesan: `Gagal menghapus: ${error.message}` };

  segarkanPublik("/berita");
  revalidatePath("/admin/berita");
  return { ok: true, pesan: "Berita dihapus." };
}

/* ------------------------------------------------------------------ Galeri */

/** Batas ukuran satu berkas foto (5 MB) — sama dengan keterangan di UI. */
const BATAS_UKURAN_FOTO = 5 * 1024 * 1024;

/** Tipe berkas yang diterima. */
const TIPE_FOTO = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Ubah nama berkas menjadi aman dipakai di URL storage. */
function namaBerkasAman(nama: string): string {
  const bersih = nama
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return bersih || "foto";
}

/** Kategori album yang tersedia di filter galeri publik. */
const KATEGORI_ALBUM = new Set(["Kegiatan", "Akademik", "Lingkungan"]);

/**
 * Ambil jalur berkas di bucket `media` dari URL publiknya.
 * Mengembalikan null bila URL bukan milik bucket kita.
 */
function jalurStorage(url: string | null | undefined): string | null {
  if (!url) return null;
  const penanda = "/storage/v1/object/public/media/";
  const idx = url.indexOf(penanda);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + penanda.length));
}

/**
 * Buat album baru.
 *
 * Slug dibuat dari judul, lalu dijamin unik: bila sudah dipakai, diberi
 * akhiran -2, -3, dan seterusnya. Tanpa ini insert gagal karena kolom slug
 * memakai constraint unique.
 */
export async function simpanAlbum(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const judul = teks(formData, "judul");
  const kategori = teks(formData, "kategori") || "Kegiatan";
  const tanggal = teks(formData, "tanggal");

  if (!judul) return { ok: false, pesan: "Judul album wajib diisi." };
  if (!KATEGORI_ALBUM.has(kategori)) {
    return { ok: false, pesan: "Kategori album tidak dikenali." };
  }

  const supabase = await createClient();

  const dasar = slugify(judul);
  if (!dasar) return { ok: false, pesan: "Judul album tidak bisa dijadikan slug." };

  /* Cari slug yang belum terpakai. */
  let slug = dasar;
  for (let n = 2; n <= 50; n++) {
    const { data: ada } = await supabase
      .from("album")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!ada) break;
    slug = `${dasar}-${n}`;
  }

  const { error } = await supabase.from("album").insert({
    slug,
    judul,
    kategori,
    ...(tanggal ? { tanggal } : {}),
  });

  if (error) return { ok: false, pesan: `Gagal membuat album: ${error.message}` };

  segarkanPublik("/galeri");
  revalidatePath("/admin/galeri");
  return { ok: true, pesan: `Album "${judul}" berhasil dibuat.` };
}

/**
 * Hapus album beserta seluruh fotonya.
 *
 * Baris foto_galeri ikut terhapus lewat `on delete cascade`, tetapi berkas
 * di Storage TIDAK — cascade hanya berlaku di database. Jadi berkasnya
 * dikumpulkan lebih dulu lalu dihapus manual, supaya tidak ada file yatim
 * yang tetap bisa diakses lewat URL publik.
 */
export async function hapusAlbum(id: string): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();

  const { data: album } = await supabase
    .from("album")
    .select("judul, sampul_url")
    .eq("id", id)
    .maybeSingle();

  /* Kumpulkan semua berkas milik album ini sebelum barisnya dihapus. */
  const { data: foto } = await supabase
    .from("foto_galeri")
    .select("foto_url")
    .eq("album_id", id);

  const jalur = [
    ...(foto ?? []).map((f) => jalurStorage(f.foto_url)),
    jalurStorage(album?.sampul_url),
  ].filter((j): j is string => Boolean(j));

  const { error } = await supabase.from("album").delete().eq("id", id);
  if (error) return { ok: false, pesan: `Gagal menghapus album: ${error.message}` };

  /* Berkas dihapus setelah baris pasti terhapus. */
  if (jalur.length > 0) {
    await supabase.storage.from("media").remove([...new Set(jalur)]);
  }

  segarkanPublik("/galeri");
  revalidatePath("/admin/galeri");
  return { ok: true, pesan: `Album "${album?.judul ?? "tersebut"}" dihapus.` };
}

/**
 * Unggah foto ke bucket `media` lalu catat di tabel foto_galeri.
 *
 * Alur:
 *   1. wajibLogin() — Server Action tidak selalu lewat proxy.
 *   2. Validasi tipe & ukuran di server (jangan percaya validasi browser).
 *   3. Upload ke Storage (policy RLS membatasi ke admin).
 *   4. Simpan baris foto_galeri. Bila gagal, berkas dihapus lagi agar
 *      tidak ada file yatim di storage.
 */
export async function unggahFoto(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const albumId = teks(formData, "album_id");
  const keterangan = teks(formData, "keterangan");
  const berkas = formData.get("berkas");

  if (!albumId) return { ok: false, pesan: "Pilih album tujuan terlebih dahulu." };
  if (!(berkas instanceof File) || berkas.size === 0) {
    return { ok: false, pesan: "Pilih berkas foto yang akan diunggah." };
  }
  if (!TIPE_FOTO.has(berkas.type)) {
    return { ok: false, pesan: "Format harus JPG, PNG, atau WebP." };
  }
  if (berkas.size > BATAS_UKURAN_FOTO) {
    return { ok: false, pesan: "Ukuran foto maksimal 5 MB." };
  }

  const supabase = await createClient();

  /* Pastikan album tujuan benar-benar ada sebelum menyimpan berkas. */
  const { data: album, error: albumError } = await supabase
    .from("album")
    .select("id, judul")
    .eq("id", albumId)
    .maybeSingle();

  if (albumError) return { ok: false, pesan: `Gagal membaca album: ${albumError.message}` };
  if (!album) return { ok: false, pesan: "Album tujuan tidak ditemukan." };

  /* Nama unik agar dua unggahan dengan nama sama tidak saling menimpa. */
  const jalur = `galeri/${albumId}/${Date.now()}-${namaBerkasAman(berkas.name)}`;

  const { error: unggahError } = await supabase.storage
    .from("media")
    .upload(jalur, berkas, { contentType: berkas.type, upsert: false });

  if (unggahError) return { ok: false, pesan: `Gagal mengunggah: ${unggahError.message}` };

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(jalur);

  /* Urutan berikutnya di album ini. */
  const { count } = await supabase
    .from("foto_galeri")
    .select("id", { count: "exact", head: true })
    .eq("album_id", albumId);

  const { error: simpanError } = await supabase.from("foto_galeri").insert({
    album_id: albumId,
    keterangan,
    foto_url: publicUrl,
    urutan: count ?? 0,
  });

  if (simpanError) {
    /* Bersihkan berkas agar storage tidak menyimpan file tanpa baris tabel. */
    await supabase.storage.from("media").remove([jalur]);
    return { ok: false, pesan: `Gagal menyimpan data foto: ${simpanError.message}` };
  }

  /* Sampul album diisi foto pertama bila belum ada. */
  const { data: albumPenuh } = await supabase
    .from("album")
    .select("sampul_url")
    .eq("id", albumId)
    .maybeSingle();

  if (albumPenuh && !albumPenuh.sampul_url) {
    await supabase.from("album").update({ sampul_url: publicUrl }).eq("id", albumId);
  }

  segarkanPublik("/galeri");
  revalidatePath("/admin/galeri");
  return { ok: true, pesan: `Foto berhasil diunggah ke album "${album.judul}".` };
}

/** Hapus satu foto dari album beserta berkasnya di storage. */
export async function hapusFoto(id: string): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();

  const { data: foto } = await supabase
    .from("foto_galeri")
    .select("foto_url, album_id")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("foto_galeri").delete().eq("id", id);
  if (error) return { ok: false, pesan: `Gagal menghapus: ${error.message}` };

  /* Hapus berkas fisik bila URL menunjuk ke bucket kita sendiri. */
  const jalurFoto = jalurStorage(foto?.foto_url);
  if (jalurFoto) {
    await supabase.storage.from("media").remove([jalurFoto]);
  }

  /*
   * Bila yang dihapus adalah foto sampul, ganti sampul dengan foto tersisa
   * (atau kosongkan) supaya galeri publik tidak menampilkan gambar rusak.
   */
  if (foto?.album_id) {
    const { data: album } = await supabase
      .from("album")
      .select("id, sampul_url")
      .eq("id", foto.album_id)
      .maybeSingle();

    if (album && album.sampul_url && album.sampul_url === foto.foto_url) {
      const { data: sisa } = await supabase
        .from("foto_galeri")
        .select("foto_url")
        .eq("album_id", foto.album_id)
        .order("urutan", { ascending: true })
        .limit(1)
        .maybeSingle();

      await supabase
        .from("album")
        .update({ sampul_url: sisa?.foto_url ?? null })
        .eq("id", foto.album_id);
    }
  }

  segarkanPublik("/galeri");
  revalidatePath("/admin/galeri");
  return { ok: true, pesan: "Foto dihapus." };
}

export async function simpanKeteranganFoto(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const id = teks(formData, "id");
  if (!id) return { ok: false, pesan: "Foto tidak dikenali." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("foto_galeri")
    .update({ keterangan: teks(formData, "keterangan") })
    .eq("id", id);

  if (error) return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };

  segarkanPublik("/galeri");
  revalidatePath("/admin/galeri");
  return { ok: true, pesan: "Keterangan foto disimpan." };
}

/* -------------------------------------------------------------------- PPDB */

export async function simpanPpdb(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();

  const { error: infoError } = await supabase
    .from("ppdb_info")
    .update({
      tahun_ajaran: teks(formData, "tahun_ajaran"),
      periode: teks(formData, "periode"),
      judul: teks(formData, "judul"),
      deskripsi: teks(formData, "deskripsi"),
      berkas: barisTeks(formData, "berkas"),
      catatan: teks(formData, "catatan") || null,
      telepon: teks(formData, "telepon") || null,
      email: teks(formData, "email") || null,
      tautan_url: teks(formData, "tautan_url") || null,
      tautan_aktif: boolean(formData, "tautan_aktif"),
    })
    .eq("id", 1);

  if (infoError) return { ok: false, pesan: `Gagal menyimpan: ${infoError.message}` };

  segarkanPublik("/ppdb");
  revalidatePath("/admin/ppdb");
  return { ok: true, pesan: "Informasi PPDB disimpan." };
}
