-- ===========================================================================
-- SD Banjaragung — Skema awal
-- ===========================================================================
-- Cara pakai:
--   1. Buka Supabase Dashboard > SQL Editor > New query
--   2. Tempel seluruh isi file ini, lalu Run
--
-- Isi file:
--   * Helper is_admin() + tabel admin_users
--   * 10 tabel konten sesuai desain Figma
--   * RLS: publik hanya bisa membaca konten "Terbit", admin bisa semuanya
--   * Storage bucket + policy untuk foto
--   * Seed data contoh (aman dihapus setelah data asli masuk)
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 0. Ekstensi
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Tabel admin & helper
-- ---------------------------------------------------------------------------
-- Siapa saja yang boleh mengelola konten. Baris di sini diisi manual oleh
-- pemilik proyek setelah membuat user di Authentication > Users.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nama text not null default 'Administrator',
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Daftar user yang berhak mengelola konten lewat panel /admin.';

-- Fungsi bantu untuk policy. security definer agar bisa membaca admin_users
-- tanpa terkena RLS tabel itu sendiri.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'True bila user yang sedang login terdaftar sebagai admin sekolah.';

-- ---------------------------------------------------------------------------
-- 2. Enum status konten
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_konten') then
    create type public.status_konten as enum ('Terbit', 'Draf');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Tabel konten
-- ---------------------------------------------------------------------------

-- Profil sekolah: satu baris saja (id = 1).
create table if not exists public.profil_sekolah (
  id integer primary key default 1 check (id = 1),
  nama text not null,
  tagline text not null default '',
  npsn text,
  status_sekolah text,
  akreditasi text,
  kepala_sekolah text,
  alamat text,
  telepon text,
  email text,
  jam_layanan text,
  tahun_ajaran text,
  sejarah text,
  visi text,
  misi text[] not null default '{}',
  kutipan_kepala text,
  sambutan_kepala text,
  logo_url text,
  hero_url text,
  foto_kepala_url text,
  peta_url text,
  updated_at timestamptz not null default now()
);

comment on table public.profil_sekolah is
  'Identitas tunggal sekolah. Dibatasi satu baris (id = 1).';

create table if not exists public.guru (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,
  nip text,
  foto_url text,
  publik boolean not null default true,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guru_urutan_idx on public.guru (urutan, nama);

create table if not exists public.pengumuman (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  judul text not null,
  ringkasan text not null default '',
  isi text not null default '',
  kategori text not null default 'Umum',
  tanggal date not null default current_date,
  status public.status_konten not null default 'Draf',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pengumuman_tanggal_idx
  on public.pengumuman (status, tanggal desc);

create table if not exists public.berita (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  judul text not null,
  ringkasan text not null default '',
  isi text not null default '',
  kategori text not null default 'Kegiatan',
  tanggal date not null default current_date,
  menit_baca integer not null default 3,
  foto_url text,
  penulis text default 'Administrator',
  status public.status_konten not null default 'Draf',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists berita_tanggal_idx
  on public.berita (status, tanggal desc);

create table if not exists public.album (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  judul text not null,
  kategori text not null default 'Kegiatan',
  tanggal date not null default current_date,
  sampul_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.foto_galeri (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.album (id) on delete cascade,
  keterangan text not null default '',
  foto_url text not null,
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists foto_galeri_album_idx
  on public.foto_galeri (album_id, urutan);

create table if not exists public.fasilitas (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text not null default '',
  foto_url text,
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.struktur_organisasi (
  id uuid primary key default gen_random_uuid(),
  jabatan text not null,
  nama text not null,
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ppdb_info (
  id integer primary key default 1 check (id = 1),
  tahun_ajaran text not null,
  periode text not null default '',
  judul text not null,
  deskripsi text not null default '',
  berkas text[] not null default '{}',
  catatan text,
  telepon text,
  email text,
  tautan_url text,
  tautan_aktif boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.ppdb_tahapan (
  id uuid primary key default gen_random_uuid(),
  nomor text not null,
  judul text not null,
  waktu text not null default '',
  deskripsi text not null default '',
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. Trigger updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profil_sekolah', 'guru', 'pengumuman', 'berita', 'ppdb_info'
  ]
  loop
    execute format(
      'drop trigger if exists %I_set_updated_at on public.%I',
      t, t
    );
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------
-- Prinsip:
--   * anon & authenticated  -> hanya SELECT, dan hanya konten berstatus 'Terbit'
--   * admin (is_admin())    -> semua operasi
-- ---------------------------------------------------------------------------

alter table public.admin_users        enable row level security;
alter table public.profil_sekolah     enable row level security;
alter table public.guru               enable row level security;
alter table public.pengumuman         enable row level security;
alter table public.berita             enable row level security;
alter table public.album              enable row level security;
alter table public.foto_galeri        enable row level security;
alter table public.fasilitas          enable row level security;
alter table public.struktur_organisasi enable row level security;
alter table public.ppdb_info          enable row level security;
alter table public.ppdb_tahapan       enable row level security;

-- admin_users: user hanya boleh melihat barisnya sendiri.
drop policy if exists admin_users_baca_sendiri on public.admin_users;
create policy admin_users_baca_sendiri on public.admin_users
  for select to authenticated
  using (user_id = auth.uid());

-- Tabel tanpa kolom status: publik boleh baca, admin boleh tulis.
do $$
declare
  t text;
begin
  foreach t in array array[
    'profil_sekolah', 'guru', 'album', 'foto_galeri', 'fasilitas',
    'struktur_organisasi', 'ppdb_info', 'ppdb_tahapan'
  ]
  loop
    execute format('drop policy if exists %I_baca_publik on public.%I', t, t);
    execute format(
      'create policy %I_baca_publik on public.%I for select to anon, authenticated using (true)',
      t, t
    );

    execute format('drop policy if exists %I_tulis_admin on public.%I', t, t);
    execute format(
      'create policy %I_tulis_admin on public.%I for all to authenticated
       using (public.is_admin()) with check (public.is_admin())',
      t, t
    );
  end loop;
end $$;

-- Tabel dengan kolom status: publik hanya melihat 'Terbit'.
do $$
declare
  t text;
begin
  foreach t in array array['pengumuman', 'berita']
  loop
    execute format('drop policy if exists %I_baca_terbit on public.%I', t, t);
    execute format(
      $f$create policy %I_baca_terbit on public.%I for select to anon, authenticated
         using (status = 'Terbit' or public.is_admin())$f$,
      t, t
    );

    execute format('drop policy if exists %I_tulis_admin on public.%I', t, t);
    execute format(
      'create policy %I_tulis_admin on public.%I for all to authenticated
       using (public.is_admin()) with check (public.is_admin())',
      t, t
    );
  end loop;
end $$;

-- Guru: yang publik=false hanya boleh dilihat admin.
drop policy if exists guru_baca_publik on public.guru;
create policy guru_baca_publik on public.guru
  for select to anon, authenticated
  using (publik = true or public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Storage bucket untuk foto
-- ---------------------------------------------------------------------------
-- Satu bucket publik "media" dengan subfolder per jenis konten.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_baca_publik on storage.objects;
create policy media_baca_publik on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists media_tulis_admin on storage.objects;
create policy media_tulis_admin on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_ubah_admin on storage.objects;
create policy media_ubah_admin on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists media_hapus_admin on storage.objects;
create policy media_hapus_admin on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. Seed data contoh
-- ---------------------------------------------------------------------------
-- Semua teks di bawah ini PLACEHOLDER. Ganti dengan data resmi sekolah.

insert into public.profil_sekolah (
  id, nama, tagline, npsn, status_sekolah, akreditasi, kepala_sekolah,
  alamat, telepon, email, jam_layanan, tahun_ajaran, sejarah, visi, misi,
  kutipan_kepala, sambutan_kepala
)
values (
  1,
  'SD Banjaragung',
  'Bertumbuh bersama, berakar pada nilai.',
  null,
  'Negeri',
  null,
  'Ratna Wulandari, S.Pd.',
  'Jl. Pendidikan No. 01, Kel. Teladan, Kec. Harapan, Kota Contoh, 00000',
  null,
  'halo@sdbanjaragung.example',
  'Senin–Jumat • 07.30–14.00 WIB',
  '2026/2027',
  'SD Banjaragung berdiri sebagai bagian dari upaya masyarakat setempat menyediakan pendidikan dasar yang dekat dan terjangkau. Sejak awal, sekolah tumbuh bersama dukungan warga, guru, dan orang tua.',
  'Menjadi sekolah dasar yang menumbuhkan karakter kuat, rasa ingin tahu tinggi, dan kepedulian terhadap sesama serta lingkungan.',
  array[
    'Menyelenggarakan pembelajaran yang bermakna dan menyenangkan.',
    'Menumbuhkan karakter melalui keteladanan dan pembiasaan.',
    'Mengembangkan potensi setiap anak sesuai minat dan bakatnya.',
    'Membangun kerja sama yang erat dengan orang tua dan masyarakat.'
  ],
  '“Setiap anak membawa potensi yang layak kita rawat bersama.”',
  'Selamat datang di ruang informasi SD Banjaragung. Melalui website ini, kami ingin menjaga komunikasi yang terbuka dengan keluarga dan masyarakat.'
)
on conflict (id) do nothing;

insert into public.guru (nama, jabatan, publik, urutan)
select * from (values
  ('Ratna Wulandari, S.Pd.', 'Kepala Sekolah', true, 1),
  ('[Nama Guru 2]', 'Guru Kelas I', true, 2),
  ('[Nama Guru 3]', 'Guru Kelas II', true, 3),
  ('[Nama Guru 4]', 'Guru Kelas III', true, 4),
  ('[Nama Guru 5]', 'Guru Kelas IV', true, 5),
  ('[Nama Guru 6]', 'Guru Kelas V', true, 6),
  ('[Nama Guru 7]', 'Guru Kelas VI', false, 7),
  ('[Nama Guru 8]', 'Guru Pendidikan Agama', true, 8)
) as v(nama, jabatan, publik, urutan)
where not exists (select 1 from public.guru);

insert into public.pengumuman (slug, judul, ringkasan, isi, kategori, tanggal, status)
select * from (values
  ('jadwal-penilaian', 'Jadwal penilaian akhir semester genap',
   'Penilaian dilaksanakan pada 2–6 Juni 2026. Simak jadwal dan persiapan yang perlu diperhatikan.',
   'Penilaian akhir semester genap dilaksanakan pada 2–6 Juni 2026. Mohon memperhatikan jadwal dan ketentuan yang tercantum.',
   'Akademik', '2026-05-14'::date, 'Terbit'::public.status_konten),
  ('libur-juni', 'Informasi libur dan kegiatan sekolah bulan Juni',
   'Panduan agenda sekolah selama bulan Juni untuk membantu orang tua merencanakan kegiatan keluarga.',
   'Berikut agenda sekolah selama bulan Juni. Informasi resmi akan diumumkan melalui kanal sekolah.',
   'Kalender', '2026-05-13'::date, 'Terbit'::public.status_konten),
  ('pertemuan-orang-tua', 'Pertemuan orang tua dan wali murid',
   'Undangan pertemuan pada Sabtu, 23 Mei 2026, pukul 08.00 di aula sekolah.',
   'Kami mengundang orang tua dan wali murid untuk hadir pada pertemuan di aula sekolah.',
   'Kegiatan', '2026-05-11'::date, 'Terbit'::public.status_konten),
  ('pendaftaran-ekstrakurikuler', 'Pendaftaran ekstrakurikuler tahun ajaran baru',
   'Pilih kegiatan ekstrakurikuler sesuai minat anak. Pendaftaran dibuka hingga 30 Mei 2026.',
   'Pendaftaran ekstrakurikuler dibuka hingga 30 Mei 2026. Silakan memilih kegiatan sesuai minat anak.',
   'Kegiatan', '2026-05-08'::date, 'Terbit'::public.status_konten),
  ('pembagian-rapor', 'Jadwal pembagian rapor semester genap',
   'Rapor dibagikan pada 13 Juni 2026. Mohon kehadiran orang tua atau wali murid.',
   'Rapor semester genap dibagikan pada 13 Juni 2026. Mohon kehadiran orang tua atau wali murid.',
   'Akademik', '2026-05-06'::date, 'Terbit'::public.status_konten),
  ('kerja-bakti', 'Kerja bakti bersama wali murid',
   'Kegiatan kerja bakti pada Sabtu, 9 Mei 2026, pukul 07.00 di lingkungan sekolah.',
   'Kegiatan kerja bakti bersama wali murid dilaksanakan pada Sabtu, 9 Mei 2026, pukul 07.00.',
   'Kegiatan', '2026-05-04'::date, 'Draf'::public.status_konten)
) as v(slug, judul, ringkasan, isi, kategori, tanggal, status)
where not exists (select 1 from public.pengumuman);

insert into public.berita (slug, judul, ringkasan, isi, kategori, tanggal, menit_baca, status)
select * from (values
  ('pekan-literasi', 'Pekan Literasi: menumbuhkan kecintaan pada buku',
   'Membaca bersama, bertukar cerita, dan merawat rasa ingin tahu melalui kegiatan literasi di sekolah.',
   'Membaca bersama, bertukar cerita, dan merawat rasa ingin tahu melalui kegiatan literasi di sekolah. Selama sepekan, anak-anak mengikuti kegiatan membaca bersama, bertukar cerita, dan menuliskan ulang kisah favorit mereka.',
   'Kegiatan', '2026-05-12'::date, 4, 'Terbit'::public.status_konten),
  ('kebun-sekolah', 'Belajar merawat lingkungan dari kebun sekolah',
   'Kegiatan berkebun mengajak anak mengenal tanaman dan membangun kebiasaan peduli lingkungan.',
   'Kegiatan berkebun mengajak anak mengenal tanaman dan membangun kebiasaan peduli lingkungan.',
   'Lingkungan', '2026-05-08'::date, 3, 'Terbit'::public.status_konten),
  ('karya-seni', 'Ruang ekspresi melalui karya seni bersama',
   'Warna, bentuk, dan kerja sama menjadi bagian dari pengalaman belajar yang menyenangkan.',
   'Warna, bentuk, dan kerja sama menjadi bagian dari pengalaman belajar yang menyenangkan.',
   'Kegiatan', '2026-05-04'::date, 3, 'Terbit'::public.status_konten),
  ('jumat-sehat', 'Jumat sehat, bergerak dan bermain bersama',
   'Senam pagi dan permainan tradisional menjadi agenda rutin untuk menjaga kebugaran anak.',
   'Senam pagi dan permainan tradisional menjadi agenda rutin untuk menjaga kebugaran anak.',
   'Kegiatan', '2026-04-30'::date, 2, 'Terbit'::public.status_konten),
  ('kelas-alam', 'Kelas alam: mengenal lingkungan sekitar sekolah',
   'Anak-anak belajar langsung dari lingkungan sekitar untuk memperkuat pemahaman materi.',
   'Anak-anak belajar langsung dari lingkungan sekitar untuk memperkuat pemahaman materi.',
   'Kegiatan', '2026-04-26'::date, 3, 'Terbit'::public.status_konten),
  ('perpustakaan', 'Membuka jendela dunia lewat perpustakaan sekolah',
   'Perpustakaan menjadi ruang favorit anak untuk membaca, berdiskusi, dan mencari ide baru.',
   'Perpustakaan menjadi ruang favorit anak untuk membaca, berdiskusi, dan mencari ide baru.',
   'Akademik', '2026-04-22'::date, 2, 'Terbit'::public.status_konten)
) as v(slug, judul, ringkasan, isi, kategori, tanggal, menit_baca, status)
where not exists (select 1 from public.berita);

insert into public.album (slug, judul, kategori, tanggal)
select * from (values
  ('pekan-literasi', 'Pekan Literasi', 'Kegiatan', '2026-05-12'::date),
  ('kebun-sekolah', 'Kebun sekolah', 'Lingkungan', '2026-05-08'::date),
  ('karya-seni', 'Karya seni bersama', 'Kegiatan', '2026-05-04'::date),
  ('jumat-sehat', 'Jumat sehat', 'Kegiatan', '2026-04-30'::date),
  ('kelas-alam', 'Kelas alam', 'Lingkungan', '2026-04-26'::date),
  ('perpustakaan', 'Ruang baca sekolah', 'Akademik', '2026-04-22'::date)
) as v(slug, judul, kategori, tanggal)
where not exists (select 1 from public.album);

insert into public.fasilitas (judul, deskripsi, urutan)
select * from (values
  ('Ruang kelas', 'Kelas yang tertata untuk belajar, berdiskusi, dan bekerja bersama.', 1),
  ('Perpustakaan', 'Koleksi buku dan ruang baca untuk menumbuhkan kecintaan pada bacaan.', 2),
  ('Halaman dan kebun', 'Area terbuka untuk bermain, olahraga, dan belajar dari alam sekitar.', 3)
) as v(judul, deskripsi, urutan)
where not exists (select 1 from public.fasilitas);

insert into public.struktur_organisasi (jabatan, nama, urutan)
select * from (values
  ('Kepala Sekolah', 'Ratna Wulandari, S.Pd.', 1),
  ('Koordinator Kurikulum', '[Nama koordinator]', 2),
  ('Tim Pendidik', '[Nama tim pendidik]', 3),
  ('Komite Sekolah', '[Nama komite sekolah]', 4)
) as v(jabatan, nama, urutan)
where not exists (select 1 from public.struktur_organisasi);

insert into public.ppdb_info (id, tahun_ajaran, periode, judul, deskripsi, berkas, catatan)
values (
  1,
  '2026/2027',
  '1–12 Juni 2026',
  'Penerimaan Peserta Didik Baru 2026/2027',
  'Penerimaan peserta didik baru tahun ajaran 2026/2027 dibuka untuk calon peserta didik yang memenuhi persyaratan. Seluruh proses dilakukan tanpa biaya pendaftaran.',
  array[
    'Fotokopi akta kelahiran',
    'Fotokopi kartu keluarga',
    'Fotokopi kartu identitas orang tua atau wali',
    'Pas foto terbaru ukuran 3×4 sebanyak dua lembar'
  ],
  'Berkas dibawa saat verifikasi di sekolah. Simpan dokumen asli untuk pemeriksaan.'
)
on conflict (id) do nothing;

insert into public.ppdb_tahapan (nomor, judul, waktu, deskripsi, urutan)
select * from (values
  ('01', 'Pendaftaran', '1–12 Juni 2026',
   'Mengisi formulir pendaftaran dan menyerahkan berkas persyaratan kepada panitia di sekolah.', 1),
  ('02', 'Verifikasi berkas', '13–18 Juni 2026',
   'Panitia memeriksa kelengkapan dan keabsahan dokumen yang diserahkan.', 2),
  ('03', 'Pengumuman hasil', '24 Juni 2026',
   'Hasil seleksi diumumkan melalui papan pengumuman sekolah dan kanal resmi lainnya.', 3),
  ('04', 'Daftar ulang', '25 Juni–2 Juli 2026',
   'Peserta didik yang diterima melakukan daftar ulang sesuai jadwal yang ditetapkan.', 4)
) as v(nomor, judul, waktu, deskripsi, urutan)
where not exists (select 1 from public.ppdb_tahapan);

-- ===========================================================================
-- Selesai. Langkah berikutnya:
--   1. Authentication > Users > Add user  (email + password admin sekolah)
--   2. Salin UUID user tersebut, lalu jalankan:
--        insert into public.admin_users (user_id, nama)
--        values ('<uuid-user>', 'Administrator');
-- ===========================================================================
