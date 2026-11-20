/**
 * Ambil screenshot halaman publik dan admin untuk disisipkan ke PDF panduan.
 *
 * Diambil sebatas tinggi layar (bukan seluruh halaman) supaya gambar muat
 * dalam satu halaman A4 dan tidak terpotong saat dicetak.
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
await page.setViewport({ width: 1440, height: 1000 });

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

/** Login sekali di awal agar halaman admin bisa dibuka. */
async function login() {
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle2" });
  await tunggu(1500);
  await page.type("#login-email", EMAIL);
  await page.type("#login-password", SANDI);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await tunggu(2500);
}

async function shot(file, url, { geserKe = null } = {}) {
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle2" });
  await tunggu(2000);
  if (geserKe) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ block: "center" });
    }, geserKe);
    await tunggu(800);
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await page.screenshot({ path: path.join(OUT, `${file}.png`) });
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
await shot("kontak-publik", "/kontak", { geserKe: "iframe" });

// Halaman masuk (sebelum login)
await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle2" });
await tunggu(1500);
await page.screenshot({ path: path.join(OUT, "admin-login.png") });
console.log("✓ admin-login.png");

await login();

// Halaman admin
await shot("admin-beranda", "/admin");
await shot("admin-profil", "/admin/profil", { geserKe: "#logo" });
await shot("admin-guru", "/admin/guru");
await shot("admin-pengumuman", "/admin/pengumuman");
await shot("admin-berita", "/admin/berita");
await shot("admin-fasilitas", "/admin/fasilitas");
await shot("admin-spmb", "/admin/spmb");
await shot("admin-galeri", "/admin/galeri");

// Halaman formulir
async function shotEdit(file, daftarUrl, pemilihGeser = null) {
  await page.goto(`${BASE}${daftarUrl}`, { waitUntil: "networkidle2" });
  await tunggu(1800);
  const href = await page.evaluate(() =>
    document.querySelector('a[aria-label^="Ubah "]')?.getAttribute("href"),
  );
  if (!href) return;
  await shot(file, href, { geserKe: pemilihGeser });
}

await shotEdit("admin-guru-edit", "/admin/guru", "#foto");
await shotEdit("admin-berita-edit", "/admin/berita", 'input[name="sampul"]');
await shot("admin-pengumuman-edit", "/admin/pengumuman/edit");

await browser.close();
console.log("Selesai. Gambar tersimpan di", OUT);
