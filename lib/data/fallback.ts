/**
 * Data fallback (mode demo).
 *
 * Dipakai HANYA bila Supabase belum dikonfigurasi atau query gagal, supaya
 * tampilan tetap utuh. Semua nilai di sini adalah PLACEHOLDER.
 *
 * Alur data sebenarnya ada di lib/data/queries.ts. Begitu
 * NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY diisi di
 * .env.local, file ini tidak lagi dipakai untuk konten.
 */
import { site } from "@/lib/constants/site";

export type Foto = { src: string | null; label: string };

export type Pengumuman = {
  slug: string;
  tanggal: string;
  kategori: string;
  judul: string;
  ringkasan: string;
  status?: "Terbit" | "Draf";
};

export type Berita = {
  slug: string;
  kategori: string;
  tanggal: string;
  judul: string;
  ringkasan: string;
  menitBaca: number;
  foto: Foto;
  status?: "Terbit" | "Draf";
};

export type Guru = {
  id: string;
  nama: string;
  jabatan: string;
  foto: Foto;
  publik: boolean;
  nip?: string;
};

export type Album = {
  id: string;
  slug: string;
  kategori: string;
  judul: string;
  tanggal: string;
  jumlahFoto: number;
  foto: Foto;
};

export type Fasilitas = { id: string; judul: string; deskripsi: string; foto: Foto };

const foto = (label: string): Foto => ({ src: null, label });

/* ---------------------------------------------------------------- Beranda */

export const heroFoto = foto("Foto dokumentasi ilustratif â€” suasana sekolah");
export const kepalaSekolahFoto = foto("Foto dokumentasi ilustratif â€” kepala sekolah");

export const infoLayananUtama = [
  "Informasi terbuka untuk semua",
  "Layanan sekolah â€¢ Seninâ€“Jumat",
  "Tahun ajaran 2026/2027",
];

export const profilRingkas = {
  eyebrow: "Mengenal sekolah",
  judul: "Pendidikan yang dekat dengan kehidupan.",
  paragraf1:
    "UPTD SD Negeri Banjar Agung adalah sekolah dasar yang menempatkan karakter, rasa ingin tahu, dan kebersamaan sebagai fondasi belajar. Kami membangun lingkungan yang aman agar setiap anak merasa diterima dan berani mencoba.",
  paragraf2:
    "Melalui kerja sama guru dan orang tua, pengalaman belajar tidak berhenti di ruang kelas. Nilai saling menghargai, mandiri, dan peduli tumbuh dalam keseharian.",
};

export const sambutanKepalaSekolah = {
  eyebrow: "Sambutan kepala sekolah",
  kutipan: "â€œSetiap anak membawa potensi yang layak kita rawat bersama.â€",
  isi: "Selamat datang di ruang informasi UPTD SD Negeri Banjar Agung. Melalui website ini, kami ingin menjaga komunikasi yang terbuka dengan keluarga dan masyarakat. Mari bergandengan tangan menciptakan pengalaman sekolah yang hangat, aman, dan bermakna.",
  nama: "Ratna Wulandari, S.Pd.",
  jabatan: "Kepala Sekolah â€¢ Nama dan foto ilustratif",
};

export const pengumuman: Pengumuman[] = [
  {
    slug: "jadwal-penilaian",
    tanggal: "2026-05-14",
    kategori: "Akademik",
    judul: "Jadwal penilaian akhir semester genap",
    ringkasan:
      "Penilaian dilaksanakan pada 2â€“6 Juni 2026. Simak jadwal dan persiapan yang perlu diperhatikan.",
    status: "Terbit",
  },
  {
    slug: "libur-juni",
    tanggal: "2026-05-13",
    kategori: "Kalender",
    judul: "Informasi libur dan kegiatan sekolah bulan Juni",
    ringkasan:
      "Panduan agenda sekolah selama bulan Juni untuk membantu orang tua merencanakan kegiatan keluarga.",
    status: "Terbit",
  },
  {
    slug: "pertemuan-orang-tua",
    tanggal: "2026-05-11",
    kategori: "Kegiatan",
    judul: "Pertemuan orang tua dan wali murid",
    ringkasan:
      "Undangan pertemuan pada Sabtu, 23 Mei 2026, pukul 08.00 di aula sekolah.",
    status: "Terbit",
  },
  {
    slug: "pendaftaran-ekstrakurikuler",
    tanggal: "2026-05-08",
    kategori: "Kegiatan",
    judul: "Pendaftaran ekstrakurikuler tahun ajaran baru",
    ringkasan:
      "Pilih kegiatan ekstrakurikuler sesuai minat anak. Pendaftaran dibuka hingga 30 Mei 2026.",
    status: "Terbit",
  },
  {
    slug: "pembagian-rapor",
    tanggal: "2026-05-06",
    kategori: "Akademik",
    judul: "Jadwal pembagian rapor semester genap",
    ringkasan:
      "Rapor dibagikan pada 13 Juni 2026. Mohon kehadiran orang tua atau wali murid.",
    status: "Terbit",
  },
  {
    slug: "kerja-bakti",
    tanggal: "2026-05-04",
    kategori: "Kegiatan",
    judul: "Kerja bakti bersama wali murid",
    ringkasan:
      "Kegiatan kerja bakti pada Sabtu, 9 Mei 2026, pukul 07.00 di lingkungan sekolah.",
    status: "Draf",
  },
];

export const berita: Berita[] = [
  {
    slug: "pekan-literasi",
    kategori: "Kegiatan",
    tanggal: "2026-05-12",
    judul: "Pekan Literasi: menumbuhkan kecintaan pada buku",
    ringkasan:
      "Membaca bersama, bertukar cerita, dan merawat rasa ingin tahu melalui kegiatan literasi di sekolah.",
    menitBaca: 4,
    status: "Terbit",
    foto: foto("Foto dokumentasi ilustratif â€” pekan literasi"),
  },
  {
    slug: "kebun-sekolah",
    kategori: "Lingkungan",
    tanggal: "2026-05-08",
    judul: "Belajar merawat lingkungan dari kebun sekolah",
    ringkasan:
      "Kegiatan berkebun mengajak anak mengenal tanaman dan membangun kebiasaan peduli lingkungan.",
    menitBaca: 3,
    status: "Terbit",
    foto: foto("Foto dokumentasi ilustratif â€” kebun sekolah"),
  },
  {
    slug: "karya-seni",
    kategori: "Kegiatan",
    tanggal: "2026-05-04",
    judul: "Ruang ekspresi melalui karya seni bersama",
    ringkasan:
      "Warna, bentuk, dan kerja sama menjadi bagian dari pengalaman belajar yang menyenangkan.",
    menitBaca: 3,
    status: "Terbit",
    foto: foto("Foto dokumentasi ilustratif â€” karya seni"),
  },
  {
    slug: "jumat-sehat",
    kategori: "Kegiatan",
    tanggal: "2026-04-30",
    judul: "Jumat sehat, bergerak dan bermain bersama",
    ringkasan:
      "Senam pagi dan permainan tradisional menjadi agenda rutin untuk menjaga kebugaran anak.",
    menitBaca: 2,
    status: "Terbit",
    foto: foto("Foto dokumentasi ilustratif â€” jumat sehat"),
  },
  {
    slug: "kelas-alam",
    kategori: "Kegiatan",
    tanggal: "2026-04-26",
    judul: "Kelas alam: mengenal lingkungan sekitar sekolah",
    ringkasan:
      "Anak-anak belajar langsung dari lingkungan sekitar untuk memperkuat pemahaman materi.",
    menitBaca: 3,
    status: "Terbit",
    foto: foto("Foto dokumentasi ilustratif â€” kelas alam"),
  },
  {
    slug: "perpustakaan",
    kategori: "Akademik",
    tanggal: "2026-04-22",
    judul: "Membuka jendela dunia lewat perpustakaan sekolah",
    ringkasan:
      "Perpustakaan menjadi ruang favorit anak untuk membaca, berdiskusi, dan mencari ide baru.",
    menitBaca: 2,
    status: "Terbit",
    foto: foto("Foto dokumentasi ilustratif â€” perpustakaan"),
  },
];

export const lingkunganBelajar = {
  judul: "Ruang yang mendukung rasa ingin tahu",
  deskripsi:
    "Ruang kelas, perpustakaan, halaman, dan kebun menjadi bagian dari lingkungan belajar yang dirawat bersama.",
  tautan: "Jelajahi fasilitas â†’",
  href: "/profil",
  foto: foto("Foto dokumentasi ilustratif â€” ruang belajar"),
};

export const pendidikSekolah = {
  judul: "Guru yang mendampingi dengan hati",
  deskripsi:
    "Kenali para pendidik yang membantu anak bertumbuh melalui bimbingan, keteladanan, dan perhatian.",
  tautan: "Kenali para guru â†’",
  href: "/guru",
  foto: foto("Foto dokumentasi ilustratif â€” pendidik"),
};

/* ---------------------------------------------------------------- Profil */

export const profil = {
  intro: {
    eyebrow: "Profil sekolah",
    judul: "Sekolah yang tumbuh bersama warganya.",
    deskripsi:
      "Mengenal sejarah, identitas, visi, dan fasilitas UPTD SD Negeri Banjar Agung sebagai ruang belajar yang aman dan bermakna.",
  },
  heroFoto: foto("Foto dokumentasi ilustratif â€” gedung sekolah"),
  sejarah: {
    eyebrow: "Sejarah sekolah",
    judul: "Perjalanan sekolah dari masa ke masa.",
    paragraf: [
      "UPTD SD Negeri Banjar Agung berdiri sebagai bagian dari upaya masyarakat setempat menyediakan pendidikan dasar yang dekat dan terjangkau. Sejak awal, sekolah tumbuh bersama dukungan warga, guru, dan orang tua.",
      "Seiring waktu, layanan sekolah terus dilengkapiâ€”mulai dari ruang kelas tambahan, perpustakaan, hingga area bermain yang aman bagi anak.",
    ],
  },
  identitas: {
    judul: "Identitas sekolah",
    data: [
      { label: "Nama sekolah", nilai: "UPTD SD Negeri Banjar Agung" },
      { label: "NPSN", nilai: "[NPSN resmi]" },
      { label: "Status", nilai: "Negeri" },
      { label: "Akreditasi", nilai: "[Akreditasi resmi]" },
      { label: "Kepala sekolah", nilai: "Ratna Wulandari, S.Pd." },
    ],
  },
  visi: {
    judul: "Visi sekolah",
    isi: "Menjadi sekolah dasar yang menumbuhkan karakter kuat, rasa ingin tahu tinggi, dan kepedulian terhadap sesama serta lingkungan.",
  },
  misi: {
    judul: "Misi sekolah",
    butir: [
      "Menyelenggarakan pembelajaran yang bermakna dan menyenangkan.",
      "Menumbuhkan karakter melalui keteladanan dan pembiasaan.",
      "Mengembangkan potensi setiap anak sesuai minat dan bakatnya.",
      "Membangun kerja sama yang erat dengan orang tua dan masyarakat.",
    ],
  },
  fasilitas: {
    eyebrow: "Fasilitas sekolah",
    judul: "Ruang yang dirawat bersama",
  },
  struktur: {
    eyebrow: "Struktur organisasi",
    judul: "Orang-orang di balik sekolah",
    kepala: { jabatan: "Kepala Sekolah", nama: "Ratna Wulandari, S.Pd." },
    tim: [
      { jabatan: "Koordinator Kurikulum", nama: "[Nama koordinator]" },
      { jabatan: "Tim Pendidik", nama: "[Nama tim pendidik]" },
      { jabatan: "Komite Sekolah", nama: "[Nama komite sekolah]" },
    ],
    catatan: "Struktur organisasi bersifat ilustratif dan dapat disesuaikan.",
  },
};

export const fasilitas: Fasilitas[] = [
  {
    id: "1",
    judul: "Ruang kelas",
    deskripsi: "Kelas yang tertata untuk belajar, berdiskusi, dan bekerja bersama.",
    foto: foto("Foto dokumentasi ilustratif â€” ruang kelas"),
  },
  {
    id: "2",
    judul: "Perpustakaan",
    deskripsi: "Koleksi buku dan ruang baca untuk menumbuhkan kecintaan pada bacaan.",
    foto: foto("Foto dokumentasi ilustratif â€” perpustakaan"),
  },
  {
    id: "3",
    judul: "Halaman dan kebun",
    deskripsi: "Area terbuka untuk bermain, olahraga, dan belajar dari alam sekitar.",
    foto: foto("Foto dokumentasi ilustratif â€” halaman sekolah"),
  },
];

/* ---------------------------------------------------------------- Guru */

export const guruIntro = {
  eyebrow: "Informasi guru",
  judul: "Pendidik yang mendampingi setiap anak.",
  deskripsi:
    "Kenali para guru dan tenaga kependidikan yang mengajar, membimbing, dan merawat proses belajar anak di sekolah.",
};

export const guru: Guru[] = [
  {
    id: "1",
    nama: "Ratna Wulandari, S.Pd.",
    jabatan: "Kepala Sekolah",
    foto: foto("Foto guru 1"),
    publik: true,
    nip: "[NIP]",
  },
  {
    id: "2",
    nama: "[Nama Guru 2]",
    jabatan: "Guru Kelas I",
    foto: foto("Foto guru 2"),
    publik: true,
    nip: "[NIP]",
  },
  {
    id: "3",
    nama: "[Nama Guru 3]",
    jabatan: "Guru Kelas II",
    foto: foto("Foto guru 3"),
    publik: true,
    nip: "[NIP]",
  },
  {
    id: "4",
    nama: "[Nama Guru 4]",
    jabatan: "Guru Kelas III",
    foto: foto("Foto guru 4"),
    publik: true,
    nip: "[NIP]",
  },
  {
    id: "5",
    nama: "[Nama Guru 5]",
    jabatan: "Guru Kelas IV",
    foto: foto("Foto guru 5"),
    publik: true,
    nip: "[NIP]",
  },
  {
    id: "6",
    nama: "[Nama Guru 6]",
    jabatan: "Guru Kelas V",
    foto: foto("Foto guru 6"),
    publik: true,
    nip: "[NIP]",
  },
  {
    id: "7",
    nama: "[Nama Guru 7]",
    jabatan: "Guru Kelas VI",
    foto: foto("Foto guru 7"),
    publik: false,
    nip: "[NIP]",
  },
  {
    id: "8",
    nama: "[Nama Guru 8]",
    jabatan: "Guru Pendidikan Agama",
    foto: foto("Foto guru 8"),
    publik: true,
    nip: "[NIP]",
  },
];

/* ---------------------------------------------------------------- Galeri */

export const galeriIntro = {
  eyebrow: "Galeri kegiatan",
  judul: "Dokumentasi kegiatan sekolah.",
  deskripsi:
    "Kumpulan momen kegiatan belajar, bermain, dan berkarya anak-anak bersama guru dan keluarga.",
};

export const kategoriGaleri = ["Semua", "Kegiatan", "Akademik", "Lingkungan"];

export const album: Album[] = [
  {
    id: "album-1",
    slug: "pekan-literasi",
    kategori: "Kegiatan",
    judul: "Pekan Literasi",
    tanggal: "2026-05-12",
    jumlahFoto: 24,
    foto: foto("Album pekan literasi"),
  },
  {
    id: "album-2",
    slug: "kebun-sekolah",
    kategori: "Lingkungan",
    judul: "Kebun sekolah",
    tanggal: "2026-05-08",
    jumlahFoto: 18,
    foto: foto("Album kebun sekolah"),
  },
  {
    id: "album-3",
    slug: "karya-seni",
    kategori: "Kegiatan",
    judul: "Karya seni bersama",
    tanggal: "2026-05-04",
    jumlahFoto: 32,
    foto: foto("Album karya seni"),
  },
  {
    id: "album-4",
    slug: "jumat-sehat",
    kategori: "Kegiatan",
    judul: "Jumat sehat",
    tanggal: "2026-04-30",
    jumlahFoto: 16,
    foto: foto("Album jumat sehat"),
  },
  {
    id: "album-5",
    slug: "kelas-alam",
    kategori: "Lingkungan",
    judul: "Kelas alam",
    tanggal: "2026-04-26",
    jumlahFoto: 21,
    foto: foto("Album kelas alam"),
  },
  {
    id: "album-6",
    slug: "perpustakaan",
    kategori: "Akademik",
    judul: "Ruang baca sekolah",
    tanggal: "2026-04-22",
    jumlahFoto: 12,
    foto: foto("Album ruang baca"),
  },
];

/* ---------------------------------------------------------------- SPMB */

export const ppdbIntro = {
  eyebrow: "Penerimaan murid baru",
  judul: "Informasi SPMB 2026/2027",
  deskripsi:
    "Pelajari persyaratan, tahapan, dan cara memperoleh petunjuk pendaftaran sebelum mendaftar ke sekolah.",
};

export const ppdbPengantar = {
  label: "Informasi penerimaan",
  judul: "Mari mengenal sekolah lebih dekat.",
  paragraf1:
    "Penerimaan murid baru tahun ajaran 2026/2027 dibuka untuk calon peserta didik yang memenuhi persyaratan. Seluruh proses dilakukan tanpa biaya pendaftaran.",
  paragraf2:
    "Jadwal pada halaman ini merupakan contoh. Informasi resmi akan diumumkan melalui kanal sekolah.",
  cta: "Hubungi panitia â†’",
  foto: foto("Foto dokumentasi ilustratif â€” penerimaan murid"),
};

export const ppdbSiapa = {
  judul: "Siapa yang dapat mendaftar?",
  paragraf: [
    "Calon peserta didik yang telah memenuhi usia minimal masuk sekolah dasar pada tahun ajaran berjalan.",
    "Berdomisili di wilayah layanan sekolah atau sekitarnya.",
    "Memiliki dokumen kependudukan yang sah dan dapat diverifikasi.",
    "Sehat jasmani dan rohani serta siap mengikuti kegiatan pembelajaran.",
  ],
  catatan:
    "Ketentuan lengkap dapat berubah mengikuti kebijakan resmi sekolah dan dinas pendidikan.",
};

export const ppdbBerkas = {
  judul: "Daftar berkas yang disiapkan",
  butir: [
    "Fotokopi akta kelahiran",
    "Fotokopi kartu keluarga",
    "Fotokopi kartu identitas orang tua atau wali",
    "Pas foto terbaru ukuran 3Ã—4 sebanyak dua lembar",
  ],
  catatan:
    "Berkas dibawa saat verifikasi di sekolah. Simpan dokumen asli untuk pemeriksaan.",
};

export const ppdbTahapan = {
  eyebrow: "Tahapan SPMB",
  judul: "Empat langkah menuju sekolah",
  tahap: [
    {
      no: "01",
      judul: "Pendaftaran",
      waktu: "1â€“12 Juni 2026",
      deskripsi:
        "Mengisi formulir pendaftaran dan menyerahkan berkas persyaratan kepada panitia di sekolah.",
    },
    {
      no: "02",
      judul: "Verifikasi berkas",
      waktu: "13â€“18 Juni 2026",
      deskripsi: "Panitia memeriksa kelengkapan dan keabsahan dokumen yang diserahkan.",
    },
    {
      no: "03",
      judul: "Pengumuman hasil",
      waktu: "24 Juni 2026",
      deskripsi:
        "Hasil seleksi diumumkan melalui papan pengumuman sekolah dan kanal resmi lainnya.",
    },
    {
      no: "04",
      judul: "Daftar ulang",
      waktu: "25 Juniâ€“2 Juli 2026",
      deskripsi:
        "Peserta didik yang diterima melakukan daftar ulang sesuai jadwal yang ditetapkan.",
    },
  ],
};

export const ppdbPetunjuk = {
  judul: "Cara memperoleh petunjuk pendaftaran",
  paragraf1:
    "Untuk konsultasi dan petunjuk pendaftaran, silakan menghubungi panitia SPMB atau berkunjung langsung ke sekolah pada hari dan jam layanan.",
  butir: [
    "Datang ke sekretariat panitia di sekolah pada hari kerja.",
    "Hubungi nomor layanan sekolah pada jam kerja.",
    "Sampaikan pertanyaan melalui email resmi sekolah.",
  ],
  cta: "Hubungi panitia â†’",
};

export const ppdbLayanan = {
  judul: "Layanan panitia",
  isi: "Panitia SPMB siap membantu menjelaskan persyaratan, alur pendaftaran, dan hal lain yang diperlukan calon peserta didik.",
  detail: "Seninâ€“Jumat â€¢ 08.00â€“14.00 WIB di sekretariat panitia SPMB.",
  catatan: "Jadwal pada desain ini merupakan contoh, bukan pengumuman penerimaan resmi.",
};

/* ---------------------------------------------------------------- Kontak */

export const kontakIntro = {
  eyebrow: "Kontak dan lokasi",
  judul: "Hubungi UPTD SD Negeri Banjar Agung",
  deskripsi:
    "Sampaikan pertanyaan, kebutuhan informasi, atau rencana kunjungan melalui kanal resmi sekolah.",
};

export const kontak = {
  judul: "Kontak resmi sekolah",
  saluran: [
    { ikon: "map-pin", label: "Alamat", nilai: site.alamat },
    { ikon: "phone", label: "Telepon", nilai: site.telepon },
    { ikon: "mail", label: "Email", nilai: site.email },
  ],
  jam: {
    judul: "Jam layanan administrasi",
    isi: "Seninâ€“Jumat â€¢ 07.30â€“14.00 WIB",
    catatan: "Layanan tutup pada hari libur nasional dan hari besar keagamaan.",
  },
  peta: {
    label: "Denah lokasi ilustratif",
    keterangan: "Peta lokasi bersifat ilustratif. Gunakan tautan di bawah untuk navigasi.",
    cta: "Buka di peta â†’",
  },
  sebelum: {
    judul: "Sebelum berkunjung",
    isi: "Mohon menghubungi sekolah terlebih dahulu untuk memastikan waktu kunjungan dan kebutuhan layanan.",
  },
};

/* ---------------------------------------------------------------- Admin */

export const dashboard = {
  judul: "Dashboard",
  subjudul: "Ringkasan pengelolaan konten dan aktivitas terbaru.",
  sapaan: {
    judul: "Selamat datang kembali, Administrator",
    isi: "Kelola konten website sekolah dari satu tempat. Pastikan informasi yang tayang sudah sesuai data resmi sekolah.",
    catatan: "Terakhir masuk: 14 Mei 2026 â€¢ 08.12 WIB",
  },
  metrik: [
    { label: "Pengumuman", jumlah: "6", catatan: "5 terbit â€¢ 1 draf" },
    { label: "Berita", jumlah: "6", catatan: "6 terbit" },
    { label: "Guru", jumlah: "8", catatan: "7 tayang publik" },
    { label: "Foto galeri", jumlah: "123", catatan: "6 album" },
  ],
  aktivitas: [
    {
      judul: "Pengumuman â€œJadwal penilaian akhir semester genapâ€ diterbitkan",
      waktu: "14 Mei 2026 â€¢ 08.10 WIB",
      status: "Terbit",
    },
    {
      judul: "Berita â€œPekan Literasiâ€ diperbarui",
      waktu: "12 Mei 2026 â€¢ 15.42 WIB",
      status: "Terbit",
    },
    {
      judul: "Enam foto ditambahkan ke album â€œKebun sekolahâ€",
      waktu: "10 Mei 2026 â€¢ 10.05 WIB",
      status: "Galeri",
    },
    {
      judul: "Pengumuman â€œKerja bakti bersama wali muridâ€ disimpan sebagai draf",
      waktu: "9 Mei 2026 â€¢ 16.20 WIB",
      status: "Draf",
    },
  ],
  pintasan: [
    { label: "Tulis berita baru", href: "/admin/berita/edit" },
    { label: "Buat pengumuman", href: "/admin/pengumuman" },
    { label: "Unggah foto galeri", href: "/admin/galeri" },
    { label: "Perbarui info SPMB", href: "/admin/spmb" },
  ],
  umpanBalik:
    "Semua perubahan tersimpan otomatis sebagai draf sampai Anda menekan Terbitkan.",
  sebelumPublikasi: {
    judul: "Sebelum memublikasikan",
    isi: "Periksa kembali nama, tanggal, dan tautan. Pastikan konten tidak memuat data pribadi siswa. Publikasikan hanya informasi yang sudah disetujui sekolah.",
  },
  catatan: "Contoh data dashboard â€” angka akan mengikuti data Supabase.",
};

export const adminProfil = {
  judul: "Pengelolaan Profil",
  subjudul: "Perbarui identitas, sejarah, visi misi, fasilitas, dan kontak sekolah.",
  tab: ["Identitas", "Sejarah", "Visi & Misi", "Fasilitas", "Kontak"],
  umpanBalik: "Perubahan terakhir disimpan pada 14 Mei 2026 â€¢ 08.12 WIB.",
  identitas: {
    judul: "Identitas sekolah",
    field: [
      { label: "Nama sekolah", nilai: "UPTD SD Negeri Banjar Agung" },
      { label: "NPSN", nilai: "[NPSN resmi]" },
    ],
  },
  status: {
    judul: "Status sekolah",
    field: [
      { label: "Status", nilai: "Negeri" },
      { label: "Akreditasi", nilai: "[Akreditasi resmi]" },
    ],
  },
  unggah: {
    judul: "Logo sekolah",
    petunjuk: "PNG atau SVG, maksimal 2 MB",
    cta: "Pilih berkas",
  },
  sejarah: {
    judul: "Sejarah sekolah",
    label: "Sejarah",
    nilai:
      "UPTD SD Negeri Banjar Agung berdiri sebagai bagian dari upaya masyarakat setempat menyediakan pendidikan dasar yang dekat dan terjangkau.",
    petunjuk: "Gunakan bahasa yang ringkas dan mudah dipahami.",
  },
  visiMisi: {
    judul: "Visi & misi",
    field: [
      { label: "Visi", nilai: profil.visi.isi },
      { label: "Misi", nilai: profil.misi.butir.join("\n") },
    ],
  },
  fasilitas: {
    judul: "Fasilitas sekolah",
    label: "Daftar fasilitas",
    nilai: "Ruang kelas, Perpustakaan, Halaman dan kebun",
    cta: "Tambah fasilitas",
  },
  kontak: {
    judul: "Alamat & layanan kontak",
    label: "Alamat",
    nilai: site.alamat,
    kontakResmi: [
      { label: "Telepon", nilai: site.telepon },
      { label: "Email", nilai: site.email },
    ],
    lokasiJam: [
      { label: "Jam layanan", nilai: site.jamLayanan },
      { label: "Tautan peta", nilai: "[tautan peta resmi]" },
    ],
  },
  simpan: { petunjuk: "Perubahan belum disimpan.", simpan: "Simpan perubahan", batal: "Batal" },
};

export const adminGuru = {
  judul: "Data Guru",
  subjudul: "Kelola data pendidik dan tenaga kependidikan yang tayang di website.",
  cari: "Cari nama atau jabatan guru",
  tombol: ["Tambah guru", "Filter"],
  umpanBalik: "Data guru tersinkron dengan halaman publik /guru.",
  kolom: ["Guru", "Jabatan", "Status", "Aksi"],
};

export const adminGuruEdit = {
  judul: "Tambah atau Edit Guru",
  subjudul: "Lengkapi data pendidik lalu simpan untuk menampilkan di halaman publik.",
  kembali: "â† Kembali ke data guru",
  form: {
    judul: "Informasi pendidik",
    field: [
      { label: "Nama lengkap", nilai: "[Nama Guru 2]", petunjuk: "Tampil di halaman publik /guru." },
      { label: "Jabatan", nilai: "Guru Kelas I" },
      { label: "NIP", nilai: "[NIP]" },
      { label: "Urutan tampil", nilai: "2", petunjuk: "Angka kecil tampil lebih dahulu." },
    ],
    visibilitas: "Tampilkan di halaman publik",
    umpanBalik: "Perubahan pada data guru akan langsung memengaruhi halaman publik.",
  },
  foto: {
    judul: "Foto guru",
    petunjuk: "Rasio 3:4, minimal 600 Ã— 800 px.",
    aksi: ["Unggah foto", "Hapus"],
  },
  pratinjau: {
    judul: "Pratinjau identitas",
    nama: "[Nama Guru 2]",
    jabatan: "Guru Kelas I",
  },
  simpan: { petunjuk: "Perubahan belum disimpan.", simpan: "Simpan guru", batal: "Batal" },
};

export const adminPengumuman = {
  judul: "Pengumuman",
  subjudul: "Kelola pengumuman yang tayang di papan informasi sekolah.",
  cari: "Cari judul pengumuman",
  tombol: ["Buat pengumuman", "Filter"],
  umpanBalik: "Pengumuman berstatus draf tidak akan tampil di website publik.",
  kolom: ["Pengumuman", "Tanggal tayang", "Status", "Aksi"],
};

export const adminBerita = {
  judul: "Berita",
  subjudul: "Kelola berita dan kegiatan sekolah yang tayang di website.",
  cari: "Cari judul berita",
  tombol: ["Tulis berita", "Filter"],
  filter: ["Semua", "Terbit", "Draf"],
  kolom: ["Berita", "Tanggal", "Status", "Aksi"],
};

export const adminBeritaEdit = {
  judul: "Tambah atau Edit Berita",
  subjudul: "Tulis berita sekolah lengkap dengan sampul dan ringkasan.",
  kembali: "â† Kembali ke daftar berita",
  status: "Draf",
  editor: {
    judul: "Informasi artikel",
    field: [
      { label: "Judul berita", nilai: "Pekan Literasi: menumbuhkan kecintaan pada buku" },
      { label: "Slug", nilai: "pekan-literasi" },
    ],
    sampul: { label: "Sampul berita", cta: "Ubah sampul", petunjuk: "Rasio 16:9, maksimal 5 MB." },
    kategori: { label: "Kategori", nilai: "Kegiatan" },
    isi: {
      judul: "Isi berita",
      alat: ["B", "I", "U", "H2", "â€¢", "ðŸ”—"],
      konten:
        "Membaca bersama, bertukar cerita, dan merawat rasa ingin tahu melalui kegiatan literasi di sekolah.\n\nSelama sepekan, anak-anak mengikuti kegiatan membaca bersama, bertukar cerita, dan menuliskan ulang kisah favorit mereka.",
      petunjuk: "Gunakan paragraf pendek agar mudah dibaca di ponsel.",
    },
  },
  pengaturan: {
    judul: "Publikasi",
    field: [
      { label: "Status", nilai: "Draf" },
      { label: "Tanggal tayang", nilai: "12 Mei 2026" },
      { label: "Penulis", nilai: "Administrator" },
    ],
    tombol: ["Simpan draf", "Pratinjau"],
  },
  ringkasan: {
    judul: "Ringkasan berita",
    label: "Ringkasan",
    nilai:
      "Membaca bersama, bertukar cerita, dan merawat rasa ingin tahu melalui kegiatan literasi di sekolah.",
  },
  umpanBalik: "Draf tersimpan. Terbitkan bila konten sudah siap tayang.",
  terbitkan: "Terbitkan berita",
};

export const adminGaleri = {
  judul: "Galeri",
  subjudul: "Unggah dokumentasi kegiatan dan atur keterangan setiap foto.",
  unggah: {
    judul: "Unggah dokumentasi",
    petunjuk: "Tarik berkas ke sini atau pilih dari perangkat",
    catatan: "JPG atau PNG, maksimal 5 MB per foto.",
    cta: "Pilih berkas",
  },
  album: {
    judul: "Album tujuan",
    field: [
      { label: "Album", nilai: "Pekan Literasi" },
      { label: "Kategori", nilai: "Kegiatan" },
    ],
    petunjuk: "Pilih album yang sudah ada atau buat album baru.",
  },
  cari: "Cari keterangan foto",
  tombol: ["Filter"],
  simpan: { petunjuk: "Keterangan foto belum disimpan.", cta: "Simpan keterangan" },
  umpanBalik: "Keterangan foto membantu penelusuran dan aksesibilitas.",
};

export const adminPpdb = {
  judul: "Informasi SPMB",
  subjudul: "Perbarui periode, persyaratan, tahapan, dan kontak panitia SPMB.",
  umpanBalik: "Perubahan akan tampil di halaman publik /spmb.",
  umum: {
    judul: "Informasi umum & persyaratan",
    periode: [
      { label: "Tahun ajaran", nilai: "2026/2027" },
      { label: "Periode pendaftaran", nilai: "1â€“12 Juni 2026" },
    ],
    field: [
      {
        label: "Judul SPMB",
        nilai: "Penerimaan Murid Baru 2026/2027",
        petunjuk: "Tampil sebagai judul di halaman publik.",
      },
      { label: "Deskripsi", nilai: ppdbPengantar.paragraf1 },
    ],
  },
  berkas: {
    judul: "Berkas yang diperlukan",
    label: "Daftar berkas",
    nilai: ppdbBerkas.butir.join("\n"),
    cta: "Tambah berkas",
  },
  jadwal: {
    judul: "Jadwal & tahapan",
    tahap: ppdbTahapan.tahap.map((t) => ({
      nama: t.judul,
      waktu: t.waktu,
      deskripsi: t.deskripsi,
    })),
    cta: "Tambah tahap",
  },
  kontak: {
    judul: "Kontak panitia & tautan opsional",
    saluran: [
      { label: "Telepon panitia", nilai: site.telepon },
      { label: "Email panitia", nilai: site.email },
    ],
    catatan: { label: "Catatan panitia", nilai: ppdbLayanan.detail },
    tautan: {
      label: "Aktifkan tautan pendaftaran daring",
      petunjuk: "Centang bila pendaftaran dilakukan melalui tautan eksternal.",
    },
    url: { label: "Tautan pendaftaran", nilai: "[tautan pendaftaran]", petunjuk: "Contoh: https://..." },
  },
  simpan: { petunjuk: "Perubahan belum disimpan.", simpan: "Simpan informasi SPMB", batal: "Batal" },
};

export const adminLogin = {
  judul: "Masuk ke panel admin",
  subjudul: "Gunakan akun administrator sekolah untuk mengelola konten website.",
  galeri: {
    judul: "Satu tempat untuk mengelola informasi sekolah.",
    isi: "Perbarui profil, guru, pengumuman, berita, galeri, dan informasi SPMB tanpa menyentuh kode.",
    foto: foto("Foto dokumentasi ilustratif â€” gedung sekolah"),
    catatan: "Akses terbatas untuk administrator sekolah.",
  },
  error: "Email atau kata sandi belum sesuai. Silakan periksa kembali.",
  field: [
    { label: "Email", nilai: "admin@sekolah.example", petunjuk: "" },
    {
      label: "Kata sandi",
      nilai: "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢",
      petunjuk: "Gunakan minimal 8 karakter.",
    },
  ],
  masuk: "Masuk",
  lupa: "Lupa kata sandi?",
  kembali: "â† Kembali ke website",
};
