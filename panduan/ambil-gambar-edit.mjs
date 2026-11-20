import { createRequire } from "node:module";
const require = createRequire("D:/Kuliah/Tugas/KSI/web-sd-banjaragung/package.json");
const puppeteer = require("puppeteer-core");

const B = "http://localhost:3000";
const t = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// login
await page.goto(`${B}/admin/login`, { waitUntil: "networkidle2" });
await t(2000);
await page.screenshot({ path: "panduan/gambar/admin-login.png", fullPage: true });
console.log("admin-login.png");

await page.type("#login-email", "hurrisyail06@gmail.com");
await page.type("#login-password", "iniakunemel");
await Promise.all([
  page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }).catch(() => {}),
  page.click('button[type="submit"]'),
]);
await t(2500);

// edit guru pertama
await page.goto(`${B}/admin/guru`, { waitUntil: "networkidle2" });
await t(2000);
const href = await page.evaluate(() =>
  document.querySelector('a[aria-label^="Ubah "]')?.getAttribute("href"),
);
if (href) {
  await page.goto(`${B}${href}`, { waitUntil: "networkidle2" });
  await t(2000);
  await page.screenshot({ path: "panduan/gambar/admin-guru-edit.png", fullPage: true });
  console.log("admin-guru-edit.png");
}

// edit berita pertama
await page.goto(`${B}/admin/berita`, { waitUntil: "networkidle2" });
await t(2000);
const href2 = await page.evaluate(() =>
  document.querySelector('a[aria-label^="Ubah "]')?.getAttribute("href"),
);
if (href2) {
  await page.goto(`${B}${href2}`, { waitUntil: "networkidle2" });
  await t(2000);
  await page.screenshot({ path: "panduan/gambar/admin-berita-edit.png", fullPage: true });
  console.log("admin-berita-edit.png");
}

// halaman pengumuman baru
await page.goto(`${B}/admin/pengumuman/edit`, { waitUntil: "networkidle2" });
await t(2000);
await page.screenshot({ path: "panduan/gambar/admin-pengumuman-edit.png", fullPage: true });
console.log("admin-pengumuman-edit.png");

await browser.close();
