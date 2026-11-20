/**
 * Membuat PDF panduan dari berkas HTML.
 *
 * Memakai Chrome (lewat puppeteer-core) supaya hasilnya sama dengan tampilan
 * di browser: font, warna, dan pemenggalan halaman.
 *
 * Pakai:
 *   node panduan/buat-pdf.mjs
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SUMBER = path.join(DIR, "panduan-penggunaan.html");
const HASIL = path.join(DIR, "Panduan-Penggunaan-Website-SD-Banjaragung.pdf");

const KANDIDAT_CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const fs = await import("node:fs");
const chrome = KANDIDAT_CHROME.find((p) => fs.existsSync(p));

if (!chrome) {
  console.error("Chrome/Edge tidak ditemukan. Pasang salah satunya lalu ulangi.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.goto(pathToFileURL(SUMBER).href, { waitUntil: "load" });

await page.pdf({
  path: HASIL,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate: `
    <div style="width:100%;padding:0 16mm;font-family:Arial,sans-serif;font-size:8pt;color:#94a3b8;display:flex;justify-content:space-between;">
      <span>Panduan Penggunaan Website SD Banjaragung</span>
      <span class="pageNumber"></span>
    </div>`,
  margin: { top: "18mm", right: "16mm", bottom: "20mm", left: "16mm" },
});

// Hitung jumlah halaman untuk laporan.
const jumlah = await page.evaluate(() => 0);
await browser.close();

const stat = fs.statSync(HASIL);
console.log(`PDF dibuat: ${HASIL}`);
console.log(`Ukuran    : ${(stat.size / 1024).toFixed(0)} KB`);
