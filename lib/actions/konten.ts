"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { wajibLogin } from "@/lib/supabase/auth";
import { slugify } from "@/lib/utils/format-date";
import { srcDariIframe } from "@/lib/utils/peta";
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

/* ------------------------------------------------------------- Unggah berkas */

/** Klien Supabase dari Server Action (sudah membawa sesi admin). */
type Klien = Awaited<ReturnType<typeof createClient>>;

/** Batas ukuran & tipe berkas logo (sesuai keterangan di panel admin). */
const BATAS_UKURAN_LOGO = 2 * 1024 * 1024;
const TIPE_LOGO = new Set(["image/png", "image/svg+xml"]);

type HasilUnggah = { ok: true; url: string } | { ok: false; pesan: string };

/**
 * Unggah satu berkas ke bucket `media` lalu kembalikan URL publiknya.
 *
 * Dipakai bersama oleh unggahan logo, foto guru, dan sampul berita. Validasi
 * tipe/ukuran dilakukan pemanggil SEBELUM fungsi ini dipanggil.
 */
async function unggahKeMedia(
  supabase: Klien,
  jalur: string,
  berkas: File,
): Promise<HasilUnggah> {
  const { error } = await supabase.storage
    .from("media")
    .upload(jalur, berkas, { contentType: berkas.type, upsert: false });

  if (error) return { ok: false, pesan: `Gagal mengunggah berkas: ${error.message}` };

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(jalur);

  return { ok: true, url: publicUrl };
}

/**
 * Hapus berkas di bucket `media` bila URL memang menunjuk ke bucket kita.
 * URL dari luar (mis. gambar contoh) diabaikan agar tidak menghapus berkas
 * milik pihak lain.
 */
async function hapusDariMedia(supabase: Klien, url: string | null | undefined) {
  const jalur = jalurStorage(url);
  if (jalur) await supabase.storage.from("media").remove([jalur]);
}

/* ------------------------------------------------------------------ Profil */

export async function simpanProfil(
  _sebelumnya: HasilAksi | null,
  formData: FormData,
): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();

  /* Logo baru (opsional) — divalidasi di server, bukan di browser. */
  const logo = formData.get("logo");
  let logoBaru: string | null = null;
  if (logo instanceof File && logo.size > 0) {
    if (!TIPE_LOGO.has(logo.type)) {
      return { ok: false, pesan: "Format logo harus PNG atau SVG." };
    }
    if (logo.size > BATAS_UKURAN_LOGO) {
      return { ok: false, pesan: "Ukuran logo maksimal 2 MB." };
    }
    const jalur = `logo/sekolah-${Date.now()}-${namaBerkasAman(logo.name)}`;
    const hasil = await unggahKeMedia(supabase, jalur, logo);
    if (!hasil.ok) return { ok: false, pesan: hasil.pesan };
    logoBaru = hasil.url;
  }

  /* Tautan peta dipakai tombol "Buka di peta" di halaman Kontak. */
  let petaUrl = teks(formData, "peta_url");
  /* Kode sematan (HTML <iframe>) hanya diterima bila berasal dari embed resmi Google Maps. */
  if (/^<iframe/i.test(petaUrl)) {
    const src = srcDariIframe(petaUrl);
    if (!src) {
      if (logoBaru) await hapusDariMedia(supabase, logoBaru);
      return { ok: false, pesan: "Kode sematan harus dari Google Maps (Bagikan → Sematkan peta)." };
    }
    petaUrl = src;
  }
  if (petaUrl && !/^https?:\/\//i.test(petaUrl)) {
    if (logoBaru) await hapusDariMedia(supabase, logoBaru);
    return { ok: false, pesan: "Isi tautan Google Maps atau kode sematan petanya." };
  }
  /* Tautan pendek "Bagikan" diurai ke tautan panjang agar koordinatnya terbaca. */
  if (/^https:\/\/maps\.app\.goo\.gl\//i.test(petaUrl)) {
    try {
      const r = await fetch(petaUrl, { redirect: "manual" });
      const panjang = r.headers.get("location");
      if (panjang?.startsWith("https://www.google.com/maps")) petaUrl = panjang;
    } catch {
      /* tetap simpan tautan pendek; tombol "Buka di peta" tetap berfungsi */
    }
  }

  /* Simpan logo lama untuk membersihkan berkasnya setelah baris tersimpan. */
  const { data: lama } = await supabase
    .from("profil_sekolah")
    .select("logo_url")
    .eq("id", 1)
    .maybeSingle();

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
      peta_url: petaUrl || null,
      ...(logoBaru ? { logo_url: logoBaru } : {}),
    })
    .eq("id", 1);

  if (error) {
    /* Bila penyimpanan gagal, buang berkas yang barusan diunggah. */
    if (logoBaru) await hapusDariMedia(supabase, logoBaru);
    return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };
  }

  /* Logo lama dihapus hanya setelah logo baru benar-benar tersimpan. */
  if (logoBaru && lama?.logo_url) await hapusDariMedia(supabase, lama.logo_url);

  segarkanPublik("/profil", "/kontak", "/spmb");
  /* Logo tampil di header & footer semua halaman publik. */
  revalidatePath("/", "layout");
  revalidatePath("/admin/profil");
  return {
    ok: true,
    pesan: logoBaru
      ? "Profil dan logo sekolah berhasil disimpan."
      : "Profil sekolah berhasil disimpan.",
  };
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

  /* Foto baru (opsional) — divalidasi di server, bukan di browser. */
  const foto = formData.get("foto");
  let fotoBaru: string | null = null;
  if (foto instanceof File && foto.size > 0) {
    if (!TIPE_FOTO.has(foto.type)) {
      return { ok: false, pesan: "Format foto harus JPG, PNG, atau WebP." };
    }
    if (foto.size > BATAS_UKURAN_FOTO) {
      return { ok: false, pesan: "Ukuran foto maksimal 5 MB." };
    }
    const jalur = `guru/${Date.now()}-${namaBerkasAman(foto.name)}`;
    const hasil = await unggahKeMedia(supabase, jalur, foto);
    if (!hasil.ok) return { ok: false, pesan: hasil.pesan };
    fotoBaru = hasil.url;
  }

  /* Foto lama dibutuhkan untuk membersihkan berkas setelah data tersimpan. */
  let fotoLama: string | null = null;
  if (id) {
    const { data: lama } = await supabase
      .from("guru")
      .select("foto_url")
      .eq("id", id)
      .maybeSingle();
    fotoLama = lama?.foto_url ?? null;
  }

  const data = {
    nama,
    jabatan,
    nip: teks(formData, "nip") || null,
    publik: boolean(formData, "publik"),
    urutan: angka(formData, "urutan", 0),
    ...(fotoBaru ? { foto_url: fotoBaru } : {}),
  };

  const { error } = id
    ? await supabase.from("guru").update(data).eq("id", id)
    : await supabase.from("guru").insert(data);

  if (error) {
    /* Jangan tinggalkan berkas tanpa baris tabel. */
    if (fotoBaru) await hapusDariMedia(supabase, fotoBaru);
    return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };
  }

  if (fotoBaru && fotoLama) await hapusDariMedia(supabase, fotoLama);

  segarkanPublik("/guru");
  revalidatePath("/admin/guru");
  return {
    ok: true,
    pesan: id
      ? fotoBaru
        ? "Data dan foto guru diperbarui."
        : "Data guru diperbarui."
      : fotoBaru
        ? "Guru baru ditambahkan beserta fotonya."
        : "Guru baru ditambahkan.",
  };
}

export async function hapusGuru(id: string): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();

  /* Simpan URL foto sebelum barisnya hilang agar berkasnya bisa ikut dibersihkan. */
  const { data: guru } = await supabase
    .from("guru")
    .select("foto_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("guru").delete().eq("id", id);
  if (error) return { ok: false, pesan: `Gagal menghapus: ${error.message}` };

  await hapusDariMedia(supabase, guru?.foto_url);

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

  /* Sampul baru (opsional) — divalidasi di server, bukan di browser. */
  const sampul = formData.get("sampul");
  let sampulBaru: string | null = null;
  if (sampul instanceof File && sampul.size > 0) {
    if (!TIPE_FOTO.has(sampul.type)) {
      return { ok: false, pesan: "Format sampul harus JPG, PNG, atau WebP." };
    }
    if (sampul.size > BATAS_UKURAN_FOTO) {
      return { ok: false, pesan: "Ukuran sampul maksimal 5 MB." };
    }
    const jalur = `berita/${Date.now()}-${namaBerkasAman(sampul.name)}`;
    const hasil = await unggahKeMedia(supabase, jalur, sampul);
    if (!hasil.ok) return { ok: false, pesan: hasil.pesan };
    sampulBaru = hasil.url;
  }

  /* Sampul lama dibutuhkan untuk membersihkan berkas setelah berita tersimpan. */
  let sampulLama: string | null = null;
  if (slugLama) {
    const { data: lama } = await supabase
      .from("berita")
      .select("foto_url")
      .eq("slug", slugLama)
      .maybeSingle();
    sampulLama = lama?.foto_url ?? null;
  }

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
    ...(sampulBaru ? { foto_url: sampulBaru } : {}),
  };

  const { error } = slugLama
    ? await supabase.from("berita").update(data).eq("slug", slugLama)
    : await supabase.from("berita").insert(data);

  if (error) {
    /* Jangan tinggalkan berkas tanpa baris tabel. */
    if (sampulBaru) await hapusDariMedia(supabase, sampulBaru);
    return { ok: false, pesan: `Gagal menyimpan: ${error.message}` };
  }

  if (sampulBaru && sampulLama) await hapusDariMedia(supabase, sampulLama);

  segarkanPublik("/berita", `/berita/${data.slug}`, `/berita/${slugLama}`);
  revalidatePath("/admin/berita");
  return {
    ok: true,
    pesan: slugLama
      ? sampulBaru
        ? "Berita dan sampul berhasil diperbarui."
        : "Berita diperbarui."
      : "Berita disimpan.",
  };
}

export async function hapusBerita(slug: string): Promise<HasilAksi> {
  await wajibLogin();
  if (!isSupabaseConfigured()) return MODE_DEMO;

  const supabase = await createClient();

  /* Simpan URL sampul sebelum barisnya hilang agar berkasnya ikut dibersihkan. */
  const { data: berita } = await supabase
    .from("berita")
    .select("foto_url")
    .eq("slug", slug)
    .maybeSingle();

  const { error } = await supabase.from("berita").delete().eq("slug", slug);
  if (error) return { ok: false, pesan: `Gagal menghapus: ${error.message}` };

  await hapusDariMedia(supabase, berita?.foto_url);

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

/* -------------------------------------------------------------------- SPMB */

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

  /*
   * Tahapan dikirim sebagai isian berulang (satu rangkap per baris). Nomor
   * tahap dibuat otomatis dari urutan baris supaya admin tidak perlu
   * mengisinya dan hasilnya selalu rapi di halaman publik.
   */
  const judulTahap = formData.getAll("tahapan_judul").map((v) => String(v).trim());
  const waktuTahap = formData.getAll("tahapan_waktu").map((v) => String(v).trim());
  const deskripsiTahap = formData
    .getAll("tahapan_deskripsi")
    .map((v) => String(v).trim());

  const tahapan = judulTahap
    .map((judul, i) => ({
      nomor: String(i + 1).padStart(2, "0"),
      judul,
      waktu: waktuTahap[i] ?? "",
      deskripsi: deskripsiTahap[i] ?? "",
      urutan: i + 1,
    }))
    .filter((t) => t.judul !== "");

  /* Ganti seluruh tahapan: hapus yang lama, lalu sisipkan susunan baru. */
  const { error: hapusError } = await supabase
    .from("ppdb_tahapan")
    .delete()
    .neq("urutan", -1);

  if (hapusError) {
    return {
      ok: false,
      pesan: `Informasi tersimpan, tetapi tahapan lama gagal dibersihkan: ${hapusError.message}`,
    };
  }

  if (tahapan.length > 0) {
    const { error: sisipError } = await supabase.from("ppdb_tahapan").insert(tahapan);
    if (sisipError) {
      return {
        ok: false,
        pesan: `Informasi tersimpan, tetapi tahapan gagal disimpan: ${sisipError.message}. Susun ulang tahapan lalu simpan lagi.`,
      };
    }
  }

  segarkanPublik("/spmb", "/pengumuman");
  revalidatePath("/admin/spmb");
  return { ok: true, pesan: "Informasi dan tahapan SPMB disimpan." };
}
