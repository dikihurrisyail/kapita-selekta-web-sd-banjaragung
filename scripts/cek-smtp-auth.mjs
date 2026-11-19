/**
 * Uji kredensial SMTP langsung dari komputer Anda.
 *
 * Skrip ini TIDAK mengubah apa pun di Supabase. Ia mencoba login ke server
 * SMTP memakai kredensial yang Anda berikan, supaya jelas apakah masalahnya
 * di kredensial (App Password salah, Sender tidak cocok) atau di Supabase.
 *
 * Pakai (PowerShell):
 *   $env:SMTP_HOST="smtp.gmail.com"
 *   $env:SMTP_PORT="587"
 *   $env:SMTP_USER="alamat@gmail.com"
 *   $env:SMTP_PASS="apppassword16char"
 *   $env:SMTP_FROM="alamat@gmail.com"
 *   node scripts/cek-smtp-auth.mjs
 *
 * Kata sandi hanya dibaca dari environment dan tidak pernah dicetak.
 */

import net from "node:net";
import tls from "node:tls";

const HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const PORT = Number(process.env.SMTP_PORT || 587);
const USER = process.env.SMTP_USER || "";
const PASS = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
const FROM = process.env.SMTP_FROM || USER;

const BATAS = 20000;

function gagal(pesan, saran) {
  console.error(`\n  ✗ ${pesan}\n`);
  if (saran) console.error(`  → ${saran}\n`);
  process.exit(1);
}

console.log("\n=== Uji kredensial SMTP ===\n");
console.log(`  Host    : ${HOST}`);
console.log(`  Port    : ${PORT}`);
console.log(`  Username: ${USER || "(kosong)"}`);
console.log(`  Sender  : ${FROM || "(kosong)"}`);
console.log(`  Sandi   : ${PASS ? `${PASS.length} karakter` : "(kosong)"}`);

if (!USER || !PASS) {
  gagal(
    "SMTP_USER / SMTP_PASS belum diisi.",
    "Isi dulu environment variable-nya (lihat komentar di atas).",
  );
}

if (USER !== FROM) {
  console.log(
    `\n  Catatan: Sender (${FROM}) berbeda dari Username (${USER}).\n` +
      "  Gmail menolak pengiriman bila keduanya tidak sama.",
  );
}

if (PASS.length !== 16) {
  console.log(
    `\n  Catatan: App Password Google selalu 16 karakter, milik Anda ${PASS.length}.\n` +
      "  Kalau ini sandi Gmail biasa, Gmail akan menolak AUTH.",
  );
}

/** Kumpulkan balasan SMTP sampai baris terakhir ("250 ..." bukan "250-..."). */
function buatPembaca(socket) {
  let buffer = "";
  const antrean = [];

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");
    let idx;
    while ((idx = buffer.indexOf("\r\n")) !== -1) {
      const baris = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      /* Baris lanjutan memakai tanda "-" pada kode status. */
      const lanjutan = baris.length > 3 && baris[3] === "-";
      antrean.push({ baris, lanjutan });
    }
  });

  return function baca() {
    return new Promise((resolve, reject) => {
      const mulai = Date.now();
      const cek = () => {
        /* Ambil balasan lengkap: berhenti saat ada baris tanpa "-". */
        const terakhir = antrean[antrean.length - 1];
        if (terakhir && !terakhir.lanjutan) {
          const isi = antrean.map((x) => x.baris).join("\n");
          antrean.length = 0;
          return resolve(isi);
        }
        if (Date.now() - mulai > BATAS) {
          return reject(new Error("Server SMTP tidak menjawab (timeout)."));
        }
        setTimeout(cek, 50);
      };
      cek();
    });
  };
}

function kirim(socket, teks) {
  socket.write(teks + "\r\n");
}

async function jalankan() {
  /* 1. Hubungkan. Port 465 memakai TLS langsung, 587 memakai STARTTLS. */
  const langsungTls = PORT === 465;

  const socket = await new Promise((resolve, reject) => {
    const s = langsungTls
      ? tls.connect({ host: HOST, port: PORT, servername: HOST })
      : net.connect({ host: HOST, port: PORT });
    const timer = setTimeout(() => {
      s.destroy();
      reject(new Error(`Tidak bisa terhubung ke ${HOST}:${PORT} (timeout).`));
    }, BATAS);
    s.once(langsungTls ? "secureConnect" : "connect", () => {
      clearTimeout(timer);
      resolve(s);
    });
    s.once("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
  });

  console.log(`\n  ✓ Terhubung ke ${HOST}:${PORT}`);

  let aktif = socket;
  let baca = buatPembaca(socket);

  let balas = await baca();
  console.log(`  ← ${balas.split("\n")[0]}`);

  if (!balas.startsWith("220")) gagal("Server menolak koneksi.", balas);

  kirim(aktif, `EHLO sdbanjaragung.local`);
  balas = await baca();
  console.log(`  ← ${balas.split("\n")[0]}`);

  /* 2. Naikkan ke TLS bila belum. */
  if (!langsungTls) {
    const dukungStartTls = /STARTTLS/i.test(balas);
    if (!dukungStartTls) {
      gagal("Server tidak menawarkan STARTTLS pada port ini.", "Coba port 465.");
    }
    kirim(aktif, "STARTTLS");
    const jawab = await baca();
    if (!jawab.startsWith("220")) gagal("STARTTLS ditolak.", jawab);

    aktif = await new Promise((resolve, reject) => {
      const t = tls.connect({ socket, servername: HOST }, () => resolve(t));
      t.once("error", reject);
    });
    baca = buatPembaca(aktif);
    console.log("  ✓ TLS aktif");

    kirim(aktif, "EHLO sdbanjaragung.local");
    balas = await baca();
  }

  /* 3. AUTH LOGIN. */
  kirim(aktif, "AUTH LOGIN");
  const mintaUser = await baca();
  if (!mintaUser.startsWith("334")) {
    gagal("Server tidak menerima AUTH LOGIN.", mintaUser);
  }

  kirim(aktif, Buffer.from(USER).toString("base64"));
  const mintaSandi = await baca();
  if (!mintaSandi.startsWith("334")) {
    gagal("Username ditolak.", mintaSandi);
  }

  kirim(aktif, Buffer.from(PASS).toString("base64"));
  const hasil = await baca();

  if (!hasil.startsWith("235")) {
    console.log(`\n  ← ${hasil.split("\n")[0]}`);
    gagal(
      "Login SMTP DITOLAK.",
      "Penyebab paling umum: (1) memakai sandi Gmail biasa, bukan App Password;\n" +
        "    (2) App Password salah ketik atau masih ada spasi;\n" +
        "    (3) verifikasi 2 langkah belum aktif sehingga App Password tidak sah;\n" +
        "    (4) App Password sudah dihapus/dicabut di akun Google.",
    );
  }

  console.log("  ✓ Login SMTP BERHASIL");

  /* 4. Cek apakah Gmail menerima alamat pengirim. */
  kirim(aktif, `MAIL FROM:<${FROM}>`);
  const from = await baca();
  console.log(`  ← ${from.split("\n")[0]}`);
  if (!from.startsWith("250")) {
    gagal(
      "Gmail menolak alamat pengirim.",
      "Pastikan Sender email di Supabase SAMA PERSIS dengan alamat Gmail yang login.",
    );
  }

  kirim(aktif, "QUIT");
  aktif.destroy();

  console.log(
    "\n  Kesimpulan: kredensial SMTP valid.\n" +
      "  Bila Supabase masih menolak, periksa bahwa nilai yang diisi di\n" +
      "  Authentication > Emails > SMTP Settings benar-benar sama dengan di atas\n" +
      "  (terutama Sender email), lalu simpan ulang.\n",
  );
}

jalankan().catch((e) => {
  gagal(`Uji gagal: ${e.message}`, "Periksa koneksi internet dan host/port.");
});
