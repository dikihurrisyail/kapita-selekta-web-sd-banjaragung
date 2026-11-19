import type { Metadata } from "next";
import { PenangkapPemulihan } from "@/components/admin/penangkap-pemulihan";

export const metadata: Metadata = { title: "Kata Sandi Baru" };

/**
 * Halaman penetapan kata sandi baru.
 *
 * Sesi pemulihan datang lewat fragment URL (#access_token=...), yang hanya
 * terbaca di browser. Karena itu seluruh halaman ini berupa komponen client
 * yang menukar token menjadi cookie sesi, lalu menampilkan form.
 *
 * Verifikasi sesi yang sesungguhnya tetap dilakukan di server, di dalam
 * Server Action simpanSandiBaru — bukan di sini.
 */
export default function SandiBaruPage() {
  return <PenangkapPemulihan />;
}
