/**
 * Periksa kesiapan pengiriman email pemulihan kata sandi.
 *
 * Skrip ini TIDAK mengubah apa pun. Ia hanya melaporkan:
 *   1. apakah Supabase menerima permintaan kirim email (kuota / SMTP)
 *   2. pesan galat persis dari Supabase bila ditolak
 *
 * Pakai:
 *   node scripts/cek-smtp.mjs <email-tujuan>
 *
 * Catatan: setiap kali dijalankan, Supabase benar-benar mencoba mengirim satu
 * email. Jangan dijalankan berulang-ulang saat kuota bawaan (2/jam) sedang
 * dipakai — itu justru menghabiskan kuota.
 */

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KUNCI = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const email = process.argv[2];

function gagal(pesan) {
  console.error(`\n  ${pesan}\n`);
  process.exit(1);
}

async function main() {
  console.log("\n=== Pemeriksaan konfigurasi email pemulihan ===\n");

  if (!URL_SUPABASE || !KUNCI) {
    gagal(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum terbaca.\n" +
        "  Jalankan lewat npm agar .env.local ikut dimuat:\n" +
        "    npm run cek:smtp -- <email>",
    );
  }

  if (!email || !email.includes("@")) {
    gagal("Sebutkan email tujuan. Contoh:\n    npm run cek:smtp -- admin@sekolah.sch.id");
  }

  console.log(`  Supabase   : ${URL_SUPABASE}`);
  console.log(`  Tujuan uji : ${email}`);
  console.log("  Metode     : kode OTP (tanpa tautan/redirect)");

  /*
   * Tidak ada redirect_to: alur pemulihan memakai kode angka yang diketik di
   * halaman /admin/lupa-sandi, bukan tautan. Mengirim redirect_to justru
   * membuat email berisi tautan bila template belum diubah.
   */
  console.log("\n  Mengirim permintaan ke Supabase…");

  let respons;
  try {
    respons = await fetch(`${URL_SUPABASE}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: KUNCI,
        Authorization: `Bearer ${KUNCI}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  } catch (e) {
    gagal(`Tidak bisa menghubungi Supabase: ${e.message}`);
  }

  const teks = await respons.text();

  if (respons.ok) {
    console.log("\n  HASIL: permintaan diterima Supabase (HTTP " + respons.status + ").");
    console.log("  Artinya kuota & SMTP siap. Periksa kotak masuk dan folder spam.");
    console.log("  Bila email tetap tidak datang, periksa apakah domain pengirim");
    console.log("  sudah Verified di penyedia dan Sender email di Supabase cocok.\n");
    return;
  }

  let kode = "";
  let pesan = teks;
  try {
    const j = JSON.parse(teks);
    kode = j.error_code || j.code || "";
    pesan = j.msg || j.message || teks;
  } catch {
    /* biarkan teks mentah */
  }

  console.log(`\n  HASIL: ditolak (HTTP ${respons.status})`);
  console.log(`  Kode   : ${kode || "(tidak ada)"}`);
  console.log(`  Pesan  : ${pesan}`);

  console.log("\n  Arti dan tindakan:");

  if (respons.status === 429 || kode.includes("rate_limit")) {
    /*
     * Supabase memakai kode yang sama untuk dua hal berbeda:
     *   * "request this after N seconds" -> jeda per alamat email
     *   * "email rate limit exceeded"    -> kuota pengiriman habis
     * Keduanya perlu tindakan berbeda, jadi dibedakan dari isi pesannya.
     */
    const jeda = /after (\d+) seconds?/i.exec(pesan);

    if (jeda) {
      console.log(`  → Jeda per alamat email: tunggu ${jeda[1]} detik lalu ulangi.`);
      console.log("    Ini pengaman anti-spam, bukan tanda SMTP bermasalah.");
    } else {
      console.log("  → Kuota pengiriman habis. Pengirim bawaan Supabase hanya 2 email/jam.");
      console.log("    Tunggu ±1 jam, atau segera atur SMTP kustom (lihat README bagian 6).");
    }
  } else if (kode.includes("smtp") || kode.includes("mailer")) {
    console.log("  → SMTP bermasalah. Periksa host/port/username/password dan");
    console.log("    pastikan Sender email cocok dengan domain yang sudah diverifikasi.");
  } else if (kode.includes("email_address_invalid")) {
    console.log("  → Format email tidak valid.");
  } else {
    console.log("  → Periksa log Supabase: Authentication → Logs.");
  }

  console.log("");
}

main();
