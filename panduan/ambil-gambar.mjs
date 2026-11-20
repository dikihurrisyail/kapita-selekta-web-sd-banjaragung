/**
 * Ambil screenshot halaman publik dan admin untuk disisipkan ke PDF panduan.
 *
 * Jalankan: node panduan/ambil-gambar.mjs
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const BASE = "http://localhost:3000";
const EMAIL = "hurrisyail06@gmail.com";
const SANDI = "iniakunemel";
const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, "gambar");

fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(file, url, { admin = false } = {}) {
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle2" });
  await tunggu(2000);
  if (admin) {
    if (page.url().includes("/admin/login")) {
      await page.type("#login-email", EMAIL);
      await page.type("#login-password", SANDI);
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }).catch(() => {}),
        page.click('button[type="submit"]'),
      ]);
      await tunggu(2500);
    }
  }
  await page.screenshot({
    path: path.join(OUT, `${file}.png`),
    fullPage: true,
  });
  console.log(`✓ ${file}.png`);
}

// Halaman publik
await shot("beranda", "/");
await shot("profil-publik", "/profil");
await shot("guru-publik", "/guru");
await shot("pengumuman-publik", "/pengumuman");
await shot("berita-publik", "/berita");
await shot("galeri-publik", "/galeri");
await shot("spmb-publik", "/spmb");
await shot("kontak-publik", "/kontak");

// Halaman admin
await shot("admin-login", "/admin/login");
await shot("admin-beranda", "/admin", { admin: true });
await shot("admin-profil", "/admin/profil", { admin: true });
await shot("admin-guru", "/admin/guru", { admin: true });
await shot("admin-pengumuman", "/admin/pengumuman", { admin: true });
await shot("admin-berita", "/admin/berita", { admin: true });
await shot("admin-spmb", "/admin/spmb", { admin: true });
await shot("admin-galeri", "/admin/galeri", { admin: true });

await browser.close();
console.log("Selesai. Gambar tersimpan di", OUT);
