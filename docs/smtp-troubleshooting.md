# Diagnosis: email pemulihan kata sandi tidak terkirim

Dokumen ini membantu menemukan penyebab ketika halaman **Lupa kata sandi**
menampilkan kegagalan, atau email tidak pernah sampai ke kotak masuk.

## 1. Jalankan pemeriksa

```bash
npm run cek:smtp -- alamat-tujuan@gmail.com
```

Baca bagian **"Arti dan tindakan"** pada hasilnya:

| Hasil | Arti | Tindakan |
|---|---|---|
| HTTP 200 | Supabase menerima permintaan | Email seharusnya terkirim. Cek folder spam. |
| 429 `email rate limit exceeded` | Kuota kirim habis | Tunggu ±1 jam, atau SMTP kustom belum aktif |
| 429 `request this after N seconds` | Jeda anti-spam per alamat | Tunggu N detik, lalu ulangi |
| 500 `Error sending recovery email` | **SMTP menolak pengiriman** | Lanjut ke langkah 2 |

## 2. Bila hasilnya HTTP 500

Ini berarti SMTP sudah aktif (Supabase mencoba mengirim) tetapi server SMTP
menolak. Supabase menyertakan `error_id` pada respons — catat nilainya, lalu
buka:

> **Supabase Dashboard → Logs → Auth Logs** → cari `error_id` tersebut

Log itu memuat pesan asli dari server SMTP, misalnya:

| Pesan di log | Penyebab | Perbaikan |
|---|---|---|
| `535-5.7.8 Username and Password not accepted` | Memakai sandi Gmail biasa, atau App Password salah | Buat App Password baru (16 karakter) |
| `530-5.7.0 Authentication Required` | Username/password kosong atau salah tempat | Isi ulang kolom SMTP |
| `550-5.7.1 From address not owned` | Sender email ≠ alamat Gmail yang login | Samakan Sender email dengan Username |
| `Connection timed out` / `ECONNREFUSED` | Port salah atau diblokir | Coba port 465 (SSL) |
| `421 Try again later` | Gmail membatasi sementara | Tunggu, atau pakai penyedia lain |

## 3. Uji kredensial SMTP langsung dari komputer

Untuk memastikan masalahnya di kredensial, bukan di Supabase:

```powershell
$env:SMTP_HOST="smtp.gmail.com"
$env:SMTP_PORT="587"
$env:SMTP_USER="alamat@gmail.com"
$env:SMTP_PASS="apppassword16char"
$env:SMTP_FROM="alamat@gmail.com"
node scripts/cek-smtp-auth.mjs
```

Skrip ini hanya **mencoba login** — tidak mengirim email dan tidak mengubah
apa pun di Supabase. Hasilnya:

- **✓ Login SMTP BERHASIL** → kredensial benar, masalahnya di pengisian
  Supabase (kemungkinan Sender email tidak sama)
- **✗ Login SMTP DITOLAK** → App Password bermasalah; buat ulang di
  <https://myaccount.google.com/apppasswords>

## 4. Daftar periksa Gmail

- [ ] Verifikasi 2 langkah aktif di akun Google
- [ ] Memakai **App Password 16 karakter**, bukan sandi Gmail
- [ ] App Password disalin tanpa spasi
- [ ] Host `smtp.gmail.com`, port `587`
- [ ] Username = alamat Gmail lengkap
- [ ] **Sender email sama persis** dengan Username
- [ ] Sudah klik **Save** di halaman SMTP Settings
- [ ] Template **Reset Password** memakai `{{ .Token }}` (bukan
      `{{ .ConfirmationURL }}`) — lihat `docs/template-email-kode.md`

## 5. Catatan penting

Kuota pengirim bawaan Supabase hanya **2 email per jam**. Setelah mengatur
SMTP kustom, batas itu tidak berlaku lagi — tetapi Supabase masih punya batas
sendiri di **Authentication → Rate Limits**, dan Gmail membatasi ±500 email/hari.

Satu hal yang sering menjebak: bila pengujian dilakukan berkali-kali dengan
alamat yang sama, Supabase memberi jeda 47 detik. Jeda itu **bukan** tanda
SMTP bermasalah.
