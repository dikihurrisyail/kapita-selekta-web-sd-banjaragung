/**
 * Teks bawaan halaman SPMB.
 *
 * Dipakai sebagai nilai cadangan bila kolom baru belum ada di database
 * (migrasi 0002 belum dijalankan) dan sebagai isi mode demo. Nilainya sama
 * dengan teks yang sebelumnya ditulis langsung di halaman publik.
 */
export const SPMB_DEFAULT = {
  eyebrow: "Penerimaan murid baru",
  introDeskripsi:
    "Pelajari persyaratan, tahapan, dan cara memperoleh petunjuk pendaftaran sebelum mendaftar ke sekolah.",
  pengantarEyebrow: "Informasi penerimaan",
  pengantarJudul: "Mari mengenal sekolah lebih dekat.",
  periodeCatatan: "Seluruh proses dilakukan tanpa biaya pendaftaran.",
  syaratJudul: "Siapa yang dapat mendaftar?",
  syaratDeskripsi:
    "Calon peserta didik yang telah memenuhi usia minimal masuk sekolah dasar pada tahun ajaran berjalan.",
  syaratButir: [
    "Berdomisili di wilayah layanan sekolah atau sekitarnya.",
    "Memiliki dokumen kependudukan yang sah dan dapat diverifikasi.",
    "Sehat jasmani dan rohani serta siap mengikuti kegiatan pembelajaran.",
  ],
  syaratCatatan:
    "Ketentuan lengkap dapat berubah mengikuti kebijakan resmi sekolah dan dinas pendidikan.",
  berkasJudul: "Daftar berkas yang disiapkan",
  tahapanEyebrow: "Tahapan SPMB",
  tahapanJudul: "Langkah menuju sekolah",
  layananJudul: "Layanan panitia",
  layananDeskripsi:
    "Panitia SPMB siap membantu menjelaskan persyaratan, alur pendaftaran, dan hal lain yang diperlukan calon peserta didik.",
  tombolKontakLabel: "Hubungi panitia",
  tombolKontakUrl: "/kontak",
  tombolDaftarLabel: "Daftar daring",
};
