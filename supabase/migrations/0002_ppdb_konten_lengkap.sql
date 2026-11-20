-- ---------------------------------------------------------------------------
-- 0002 — Semua teks halaman SPMB dapat diubah dari panel admin.
--
-- Sebelumnya judul bagian, pengantar, persyaratan, dan label tombol di halaman
-- /spmb ditulis langsung di kode. Migrasi ini memindahkannya ke kolom tabel
-- ppdb_info agar admin dapat menyunting seluruh isi halaman.
--
-- Kolom baru memakai nilai bawaan yang sama dengan teks lama, sehingga tampilan
-- halaman tidak berubah sampai admin menyuntingnya.
-- ---------------------------------------------------------------------------

alter table public.ppdb_info
  add column if not exists eyebrow text not null default 'Penerimaan murid baru',
  add column if not exists intro_deskripsi text not null default 'Pelajari persyaratan, tahapan, dan cara memperoleh petunjuk pendaftaran sebelum mendaftar ke sekolah.',
  add column if not exists pengantar_eyebrow text not null default 'Informasi penerimaan',
  add column if not exists pengantar_judul text not null default 'Mari mengenal sekolah lebih dekat.',
  add column if not exists periode_catatan text not null default 'Seluruh proses dilakukan tanpa biaya pendaftaran.',
  add column if not exists foto_url text,
  add column if not exists syarat_judul text not null default 'Siapa yang dapat mendaftar?',
  add column if not exists syarat_deskripsi text not null default 'Calon peserta didik yang telah memenuhi usia minimal masuk sekolah dasar pada tahun ajaran berjalan.',
  add column if not exists syarat_butir text[] not null default array[
    'Berdomisili di wilayah layanan sekolah atau sekitarnya.',
    'Memiliki dokumen kependudukan yang sah dan dapat diverifikasi.',
    'Sehat jasmani dan rohani serta siap mengikuti kegiatan pembelajaran.'
  ],
  add column if not exists syarat_catatan text not null default 'Ketentuan lengkap dapat berubah mengikuti kebijakan resmi sekolah dan dinas pendidikan.',
  add column if not exists berkas_judul text not null default 'Daftar berkas yang disiapkan',
  add column if not exists tahapan_eyebrow text not null default 'Tahapan SPMB',
  add column if not exists tahapan_judul text not null default 'Langkah menuju sekolah',
  add column if not exists layanan_judul text not null default 'Layanan panitia',
  add column if not exists layanan_deskripsi text not null default 'Panitia SPMB siap membantu menjelaskan persyaratan, alur pendaftaran, dan hal lain yang diperlukan calon peserta didik.',
  add column if not exists tombol_kontak_label text not null default 'Hubungi panitia',
  add column if not exists tombol_kontak_url text not null default '/kontak',
  add column if not exists tombol_daftar_label text not null default 'Daftar daring';
