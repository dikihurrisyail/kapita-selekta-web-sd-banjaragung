# Template Email Kode Pemulihan

Alur "Lupa kata sandi" memakai **kode angka**, bukan tautan. Supaya Supabase
mengirim angkanya (bukan tautan), template email harus diubah **satu kali** di
dashboard.

## Langkah

1. Buka **Supabase Dashboard → Authentication → Emails**
2. Pilih template **Reset Password**
3. Ganti **Subject** dan **Body** dengan teks di bawah
4. Klik **Save**
5. Uji lewat halaman `/admin/lupa-sandi`

## Subject

```
Kode pemulihan kata sandi UPTD SD Negeri Banjar Agung
```

## Body (HTML)

```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #0f172a;">
  <h2 style="margin: 0 0 12px; font-size: 20px; color: #1e3a8a;">
    Pemulihan kata sandi
  </h2>

  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6;">
    Seseorang meminta pengaturan ulang kata sandi untuk akun administrator
    UPTD SD Negeri Banjar Agung yang memakai alamat email ini.
  </p>

  <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.6;">
    Masukkan kode berikut di halaman pemulihan:
  </p>

  <p style="margin: 0 0 20px; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1e3a8a;">
    {{ .Token }}
  </p>

  <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #475569;">
    Kode ini berlaku 10 menit dan hanya bisa dipakai sekali.
  </p>

  <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
    Bila Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini —
    kata sandi Anda tidak akan berubah.
  </p>
</div>
```

## Penting

- **`{{ .Token }}`** adalah kodenya. Jangan pakai `{{ .ConfirmationURL }}` —
  itu mengirim tautan, dan alur ini tidak memakainya.
- **Jumlah digit mengikuti setelan OTP Length.** Proyek ini memakai **8 digit**
  (bawaan Supabase). Halaman pemulihan menerima 6–10 digit, jadi bila setelan
  diubah menjadi 6, tidak ada yang perlu diperbaiki di aplikasi.
- Jangan mengubah setelan ini bersamaan dengan uji coba; kalau diubah, kode
  lama langsung tidak berlaku.

## Bila template tidak diubah

Aplikasi tetap berjalan, tetapi email berisi **tautan**, bukan angka. Pengguna
tidak menemukan kode untuk dimasukkan, sehingga alur tidak bisa diselesaikan.

## Catatan teknis

Supabase menyimpan kode sebagai `sha224(email + kode)` di `auth.users`. Bila
permintaan `/auth/v1/recover` membawa `code_challenge` (PKCE), token disimpan
sebagai `pkce_<hash>` dan verifikasi kode selalu gagal. Karena itu permintaan
pemulihan dikirim lewat klien non-PKCE (`lib/supabase/otp.ts`).
