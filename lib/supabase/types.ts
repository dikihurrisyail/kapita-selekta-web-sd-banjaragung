/**
 * Tipe database Supabase (ditulis manual mengikuti supabase/migrations).
 * Bila skema berubah, jalankan ulang:
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Status publikasi konten. */
export type StatusKonten = "Terbit" | "Draf";

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          nama: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          nama?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          nama?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profil_sekolah: {
        Row: {
          id: number;
          nama: string;
          tagline: string;
          npsn: string | null;
          status_sekolah: string | null;
          akreditasi: string | null;
          kepala_sekolah: string | null;
          alamat: string | null;
          telepon: string | null;
          email: string | null;
          jam_layanan: string | null;
          tahun_ajaran: string | null;
          sejarah: string | null;
          visi: string | null;
          misi: string[];
          kutipan_kepala: string | null;
          sambutan_kepala: string | null;
          logo_url: string | null;
          hero_url: string | null;
          foto_kepala_url: string | null;
          peta_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          nama: string;
          tagline?: string;
          npsn?: string | null;
          status_sekolah?: string | null;
          akreditasi?: string | null;
          kepala_sekolah?: string | null;
          alamat?: string | null;
          telepon?: string | null;
          email?: string | null;
          jam_layanan?: string | null;
          tahun_ajaran?: string | null;
          sejarah?: string | null;
          visi?: string | null;
          misi?: string[];
          kutipan_kepala?: string | null;
          sambutan_kepala?: string | null;
          logo_url?: string | null;
          hero_url?: string | null;
          foto_kepala_url?: string | null;
          peta_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          nama?: string;
          tagline?: string;
          npsn?: string | null;
          status_sekolah?: string | null;
          akreditasi?: string | null;
          kepala_sekolah?: string | null;
          alamat?: string | null;
          telepon?: string | null;
          email?: string | null;
          jam_layanan?: string | null;
          tahun_ajaran?: string | null;
          sejarah?: string | null;
          visi?: string | null;
          misi?: string[];
          kutipan_kepala?: string | null;
          sambutan_kepala?: string | null;
          logo_url?: string | null;
          hero_url?: string | null;
          foto_kepala_url?: string | null;
          peta_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      guru: {
        Row: {
          id: string;
          nama: string;
          jabatan: string;
          nip: string | null;
          foto_url: string | null;
          publik: boolean;
          urutan: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          jabatan: string;
          nip?: string | null;
          foto_url?: string | null;
          publik?: boolean;
          urutan?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          jabatan?: string;
          nip?: string | null;
          foto_url?: string | null;
          publik?: boolean;
          urutan?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pengumuman: {
        Row: {
          id: string;
          slug: string;
          judul: string;
          ringkasan: string;
          isi: string;
          kategori: string;
          tanggal: string;
          status: StatusKonten;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          judul: string;
          ringkasan?: string;
          isi?: string;
          kategori?: string;
          tanggal?: string;
          status?: StatusKonten;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          judul?: string;
          ringkasan?: string;
          isi?: string;
          kategori?: string;
          tanggal?: string;
          status?: StatusKonten;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      berita: {
        Row: {
          id: string;
          slug: string;
          judul: string;
          ringkasan: string;
          isi: string;
          kategori: string;
          tanggal: string;
          menit_baca: number;
          foto_url: string | null;
          penulis: string | null;
          status: StatusKonten;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          judul: string;
          ringkasan?: string;
          isi?: string;
          kategori?: string;
          tanggal?: string;
          menit_baca?: number;
          foto_url?: string | null;
          penulis?: string | null;
          status?: StatusKonten;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          judul?: string;
          ringkasan?: string;
          isi?: string;
          kategori?: string;
          tanggal?: string;
          menit_baca?: number;
          foto_url?: string | null;
          penulis?: string | null;
          status?: StatusKonten;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      album: {
        Row: {
          id: string;
          slug: string;
          judul: string;
          kategori: string;
          tanggal: string;
          sampul_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          judul: string;
          kategori?: string;
          tanggal?: string;
          sampul_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          judul?: string;
          kategori?: string;
          tanggal?: string;
          sampul_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      foto_galeri: {
        Row: {
          id: string;
          album_id: string;
          keterangan: string;
          foto_url: string;
          urutan: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          album_id: string;
          keterangan?: string;
          foto_url: string;
          urutan?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string;
          keterangan?: string;
          foto_url?: string;
          urutan?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "foto_galeri_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "album";
            referencedColumns: ["id"];
          },
        ];
      };
      fasilitas: {
        Row: {
          id: string;
          judul: string;
          deskripsi: string;
          foto_url: string | null;
          urutan: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          judul: string;
          deskripsi?: string;
          foto_url?: string | null;
          urutan?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          judul?: string;
          deskripsi?: string;
          foto_url?: string | null;
          urutan?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      struktur_organisasi: {
        Row: {
          id: string;
          jabatan: string;
          nama: string;
          urutan: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          jabatan: string;
          nama: string;
          urutan?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          jabatan?: string;
          nama?: string;
          urutan?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      ppdb_info: {
        Row: {
          id: number;
          tahun_ajaran: string;
          periode: string;
          judul: string;
          deskripsi: string;
          berkas: string[];
          catatan: string | null;
          telepon: string | null;
          email: string | null;
          tautan_url: string | null;
          tautan_aktif: boolean;
          eyebrow: string;
          intro_deskripsi: string;
          pengantar_eyebrow: string;
          pengantar_judul: string;
          periode_catatan: string;
          foto_url: string | null;
          syarat_judul: string;
          syarat_deskripsi: string;
          syarat_butir: string[];
          syarat_catatan: string;
          berkas_judul: string;
          tahapan_eyebrow: string;
          tahapan_judul: string;
          layanan_judul: string;
          layanan_deskripsi: string;
          tombol_kontak_label: string;
          tombol_kontak_url: string;
          tombol_daftar_label: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          tahun_ajaran: string;
          periode: string;
          judul: string;
          deskripsi?: string;
          berkas?: string[];
          catatan?: string | null;
          telepon?: string | null;
          email?: string | null;
          tautan_url?: string | null;
          tautan_aktif?: boolean;
          eyebrow?: string;
          intro_deskripsi?: string;
          pengantar_eyebrow?: string;
          pengantar_judul?: string;
          periode_catatan?: string;
          foto_url?: string | null;
          syarat_judul?: string;
          syarat_deskripsi?: string;
          syarat_butir?: string[];
          syarat_catatan?: string;
          berkas_judul?: string;
          tahapan_eyebrow?: string;
          tahapan_judul?: string;
          layanan_judul?: string;
          layanan_deskripsi?: string;
          tombol_kontak_label?: string;
          tombol_kontak_url?: string;
          tombol_daftar_label?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          tahun_ajaran?: string;
          periode?: string;
          judul?: string;
          deskripsi?: string;
          berkas?: string[];
          catatan?: string | null;
          telepon?: string | null;
          email?: string | null;
          tautan_url?: string | null;
          tautan_aktif?: boolean;
          eyebrow?: string;
          intro_deskripsi?: string;
          pengantar_eyebrow?: string;
          pengantar_judul?: string;
          periode_catatan?: string;
          foto_url?: string | null;
          syarat_judul?: string;
          syarat_deskripsi?: string;
          syarat_butir?: string[];
          syarat_catatan?: string;
          berkas_judul?: string;
          tahapan_eyebrow?: string;
          tahapan_judul?: string;
          layanan_judul?: string;
          layanan_deskripsi?: string;
          tombol_kontak_label?: string;
          tombol_kontak_url?: string;
          tombol_daftar_label?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ppdb_tahapan: {
        Row: {
          id: string;
          nomor: string;
          judul: string;
          waktu: string;
          deskripsi: string;
          urutan: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nomor: string;
          judul: string;
          waktu?: string;
          deskripsi?: string;
          urutan?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          nomor?: string;
          judul?: string;
          waktu?: string;
          deskripsi?: string;
          urutan?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      status_konten: StatusKonten;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

/* Helper agar pemakaian di komponen lebih ringkas. */
export type TabelProfil = Database["public"]["Tables"]["profil_sekolah"]["Row"];
export type TabelGuru = Database["public"]["Tables"]["guru"]["Row"];
export type TabelPengumuman = Database["public"]["Tables"]["pengumuman"]["Row"];
export type TabelBerita = Database["public"]["Tables"]["berita"]["Row"];
export type TabelAlbum = Database["public"]["Tables"]["album"]["Row"];
export type TabelFotoGaleri = Database["public"]["Tables"]["foto_galeri"]["Row"];
export type TabelFasilitas = Database["public"]["Tables"]["fasilitas"]["Row"];
export type TabelStruktur = Database["public"]["Tables"]["struktur_organisasi"]["Row"];
export type TabelPpdbInfo = Database["public"]["Tables"]["ppdb_info"]["Row"];
export type TabelPpdbTahapan = Database["public"]["Tables"]["ppdb_tahapan"]["Row"];
