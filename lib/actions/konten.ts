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
