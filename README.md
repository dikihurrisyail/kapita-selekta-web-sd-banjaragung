# SD Banjaragung — Website Sekolah

Website resmi SD Banjaragung: halaman publik (profil, guru, pengumuman, berita,
galeri, PPDB, kontak) dan panel admin untuk mengelola seluruh kontennya.

Dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**,
dan **Supabase** (database, autentikasi, penyimpanan berkas).

---

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka <http://localhost:3000>.

### Mode demo (tanpa Supabase)

Selama `.env.local` belum diisi, aplikasi tetap berjalan penuh memakai data
contoh dari `lib/data/fallback.ts`:

- semua halaman publik tampil normal,
- panel `/admin` bisa dijelajahi,
- perubahan **tidak** tersimpan dan login dinonaktifkan.

Ini memudahkan review tampilan sebelum database disiapkan.

---

## Mengaktifkan Supabase

### 1. Buat proyek Supabase

Buat proyek di <https://supabase.com/dashboard>, lalu ambil kredensial di
**Project Settings → API**:

- `Project URL`
- `anon public` key

### 2. Isi environment

Salin `.env.example` menjadi `.env.local`, lalu isi nilainya:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Opsional, hanya untuk tugas administratif di server.
SUPABASE_SERVICE_ROLE_KEY=
```

> `.env.local` sudah diabaikan `.gitignore` — jangan pernah di-commit.

### 3. Jalankan migrasi

Buka **SQL Editor** di dashboard Supabase, tempel seluruh isi
`supabase/migrations/0001_skema_awal.sql`, lalu **Run**.

File ini membuat:

| Bagian | Isi |
| --- | --- |
| Tabel | `admin_users`, `profil_sekolah`, `guru`, `pengumuman`, `berita`, `album`, `foto_galeri`, `fasilitas`, `struktur_organisasi`, `ppdb_info`, `ppdb_tahapan` |
| Keamanan | RLS: publik hanya membaca konten `Terbit`; admin (`is_admin()`) boleh menulis |
| Storage | Bucket publik `media` + policy baca/unggah/ubah/hapus |
| Contoh data | Seed placeholder untuk semua tabel (aman dihapus setelah data asli masuk) |

### 4. Buat akun admin

1. **Authentication → Users → Add user** — isi email dan kata sandi admin sekolah.
2. Salin **UUID** user tersebut.
3. Jalankan di SQL Editor:

```sql
insert into public.admin_users (user_id, nama)
values ('<uuid-user>', 'Administrator');
```

Langkah 3 wajib. Akun Supabase Auth yang tidak terdaftar di `admin_users`
**tidak bisa** masuk panel admin — ini mencegah akun pendaftaran mandiri
mengakses konten draf.

### 5. Masuk ke panel

Buka `/admin`, lalu masuk dengan email dan kata sandi yang dibuat pada langkah 4.

### 6. Atur SMTP (agar "Lupa kata sandi" berfungsi)

Tanpa SMTP, Supabase memakai pengirim bawaan yang hanya mengizinkan **2 email
per jam** dan hanya bisa mengirim ke alamat anggota project. Akibatnya email
pemulihan kata sandi untuk admin sekolah tidak akan pernah sampai.

#### Gmail SMTP

1. **Aktifkan verifikasi 2 langkah** di akun Google yang akan dipakai
   (myaccount.google.com → Security → 2-Step Verification). App Password tidak
   bisa dibuat tanpa ini.
2. Buka **myaccount.google.com/apppasswords** → buat App Password baru
   (nama bebas, mis. `Supabase SD Banjaragung`). Google menampilkan
   **16 karakter**; salin tanpa spasi. Sandi Gmail biasa **tidak akan bekerja**.
3. Di Supabase: **Authentication → Emails → SMTP Settings**, aktifkan
   *Enable Custom SMTP*, lalu isi:

   | Kolom | Nilai |
   |---|---|
   | Host | `smtp.gmail.com` |
   | Port | `587` (STARTTLS) — atau `465` bila 587 diblokir jaringan |
   | Username | alamat Gmail lengkap, mis. `sdbajaragung@gmail.com` |
   | Password | App Password 16 karakter (tanpa spasi) |
   | Sender email | **harus sama** dengan alamat Gmail di atas |
   | Sender name | `SD Banjaragung` |

4. Di **Authentication → URL Configuration → Redirect URLs**, tambahkan:

   ```
   http://localhost:3000/admin/sandi-baru
   https://<domain-sekolah>/admin/sandi-baru
   ```

5. Isi `NEXT_PUBLIC_SITE_URL` di `.env.local` dengan alamat situs produksi agar
   tautan pemulihan menunjuk ke domain yang benar:

   ```
   NEXT_PUBLIC_SITE_URL=https://<domain-sekolah>
   ```

6. Periksa hasilnya: `npm run cek:smtp -- alamat-tujuan@gmail.com`

Batasan Gmail yang perlu diketahui:

- Kuota kirim Gmail ±500 email/hari, dan Supabase juga punya batas sendiri
  (atur di **Authentication → Rate Limits**).
- Gmail menulis ulang alamat pengirim menjadi alamat Gmail tersebut.
- Untuk produksi jangka panjang, penyedia khusus email (Resend/Brevo) lebih
  andal karena punya record SPF/DKIM sendiri sehingga tidak mudah masuk spam.

#### Penyedia lain

Pola pengisiannya sama, hanya host/username berbeda:

| Penyedia | Host | Username |
|---|---|---|
| Gmail | `smtp.gmail.com` | alamat Gmail + App Password |
| Resend | `smtp.resend.com` | `resend` |
| Brevo | `smtp-relay.brevo.com` | email akun Brevo |
| SendGrid | `smtp.sendgrid.net` | `apikey` |

---

## Struktur penting

```
app/
  (public)/          halaman publik + detail berita/pengumuman
  (admin)/admin/     panel admin (dilindungi proxy)
  (auth)/admin/login halaman masuk
components/
  ui/                komponen dasar (tombol, input, kartu, foto, dll.)
  public/            komponen halaman publik
  admin/             komponen panel admin (form + aksi)
lib/
  data/queries.ts    satu-satunya pintu baca data (Supabase → fallback)
  data/fallback.ts   data contoh untuk mode demo
  data/types.ts      tipe tampilan (view model)
  actions/           Server Action: auth + simpan konten
  supabase/          klien, tipe database, util sesi
supabase/migrations/ skema SQL, RLS, storage, seed
proxy.ts             proteksi /admin/* (konvensi Next 16)
```

### Alur data

`lib/data/queries.ts` adalah satu-satunya pintu baca data. Setiap fungsi
mengembalikan data Supabase bila sudah dikonfigurasi, dan otomatis jatuh ke
`lib/data/fallback.ts` bila belum dikonfigurasi atau query gagal — sehingga
halaman tidak pernah kosong atau error karena masalah koneksi.

### Menyimpan konten

Semua tombol simpan terhubung ke Server Action di `lib/actions/konten.ts`.
Setiap aksi memanggil `wajibLogin()`, memakai RLS sebagai lapisan kedua, lalu
menyegarkan halaman publik terkait.

---

## Catatan teknis

- **Next 16** memakai `proxy.ts` (bukan `middleware.ts`) untuk proteksi rute.
- `cacheComponents: true` aktif, sehingga `export const dynamic` tidak
  diperbolehkan. Data runtime (`searchParams`, `params`, `cookies`) dibaca di
  dalam `<Suspense>`; halaman detail memakai `export const instant = false`
  agar slug yang tidak ada tetap mengembalikan status **404** yang benar.
- Unggah berkas: bucket `media` dan policy-nya sudah siap, tetapi tombol unggah
  di panel masih dinonaktifkan sampai kredensial Supabase diisi dan diuji.
- **Ketahanan saat Supabase tidak dapat dijangkau.** Semua klien Supabase memakai
  `db: { retry: false, timeout: 8000 }` (lihat `OPSI_DB_SUPABASE` di
  `lib/supabase/config.ts`). Secara default supabase-js mencoba ulang permintaan
  yang gagal selama ±7 detik, sehingga satu halaman bisa menggantung 7 detik
  sebelum jatuh ke data cadangan. Dengan `retry: false`, kegagalan terdeteksi
  seketika: halaman tetap tampil lengkap dari `lib/data/fallback.ts` dalam
  hitungan milidetik, dan log hanya menulis satu baris per tabel yang gagal.

---

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Jalankan server pengembangan |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build |
| `npx tsc --noEmit` | Periksa tipe |
| `npx eslint .` | Periksa lint |

---

## Data yang masih placeholder

Semua teks, nama guru, tanggal, dan foto saat ini adalah **contoh**. Ganti
dengan data resmi sekolah melalui panel `/admin` atau dengan mengubah seed di
`supabase/migrations/0001_skema_awal.sql` sebelum migrasi dijalankan.
