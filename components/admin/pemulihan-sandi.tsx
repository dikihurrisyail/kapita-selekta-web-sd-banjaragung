"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { PanelAuth } from "@/components/admin/panel-auth";
import {
  kirimKodeReset,
  simpanSandiBaru,
  verifikasiKodeReset,
} from "@/lib/actions/auth";

type Tahap = "minta" | "kode" | "sandi";

/**
 * Pemulihan kata sandi dalam satu halaman, tiga tahap.
 *
 *   1. Masukkan email        -> kode dikirim ke email
 *   2. Masukkan kode         -> verifikasi
 *   3. Masukkan sandi baru   -> selesai
 *
 * Tidak ada tautan yang perlu diklik, jadi tidak ada masalah redirect URL,
 * tautan kedaluwarsa, atau membuka email di perangkat berbeda.
 *
 * Panjang kode TIDAK dipatok 6. Jumlah digit mengikuti setelan "OTP Length"
 * proyek Supabase, dan proyek ini mengirim 8 digit. Memaksa 6 digit membuat
 * kode yang benar pun tidak pernah bisa dimasukkan.
 */
export function PemulihanSandi() {
  const [stateMinta, aksiMinta, pendingMinta] = useActionState(kirimKodeReset, null);
  const [stateKode, aksiKode, pendingKode] = useActionState(verifikasiKodeReset, null);
  const [stateSandi, aksiSandi, pendingSandi] = useActionState(simpanSandiBaru, null);

  /*
   * Email diingat di sisi klien supaya tombol "Kirim kode baru" bisa memakai
   * alamat yang sama tanpa meminta pengguna mengetiknya ulang.
   */
  const [email, setEmail] = useState("");

  /*
   * Tahap ditentukan oleh hasil Server Action, bukan state lokal: Server Action
   * tetap mengembalikan hasil walau halaman sempat dirender ulang, sehingga
   * pengguna tidak terlempar kembali ke langkah pertama.
   */
  let tahap: Tahap = "minta";
  if (stateKode?.ok || stateSandi) tahap = "sandi";
  else if (stateMinta?.ok) tahap = "kode";

  if (tahap === "kode") {
    return (
      <PanelAuth
        ikon={<Mail className="size-5" aria-hidden />}
        judul="Masukkan kode"
        deskripsi="Kami mengirim kode verifikasi ke email administrator Anda. Masukkan kode itu di bawah ini."
      >
        <div className="flex flex-col gap-5">
          {stateMinta?.pesan ? <Alert tone="sukses">{stateMinta.pesan}</Alert> : null}

          <form action={aksiKode} className="flex flex-col gap-5">
            <Field
              label="Kode verifikasi"
              htmlFor="kode"
              petunjuk="Masukkan seluruh angka dari email. Berlaku 10 menit."
            >
              <Input
                id="kode"
                name="kode"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={10}
                required
                placeholder="12345678"
                className="text-center text-lg font-semibold tracking-[0.4em]"
              />
            </Field>

            {stateKode?.pesan && !stateKode.ok ? (
              <Alert tone="bahaya">{stateKode.pesan}</Alert>
            ) : null}

            <Button type="submit" variant="accent" className="w-full" disabled={pendingKode}>
              <ShieldCheck className="size-4" aria-hidden />
              {pendingKode ? "Memeriksa…" : "Verifikasi kode"}
            </Button>
          </form>

          <form action={aksiMinta}>
            <input type="hidden" name="email" value={email} />
            <button
              type="submit"
              className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
              disabled={pendingMinta}
            >
              {pendingMinta ? "Mengirim…" : "Kirim kode baru"}
            </button>
          </form>

          <Link
            href="/admin/login"
            className="text-sm leading-[1.5] text-muted hover:text-brand"
          >
            ← Kembali ke halaman masuk
          </Link>
        </div>
      </PanelAuth>
    );
  }

  if (tahap === "sandi") {
    return (
      <PanelAuth
        ikon={<KeyRound className="size-5" aria-hidden />}
        judul="Buat kata sandi baru"
        deskripsi="Kode terverifikasi. Masukkan kata sandi baru untuk akun administrator Anda."
      >
        <form action={aksiSandi} className="flex flex-col gap-5">
          {stateSandi?.pesan && !stateSandi.ok ? (
            <Alert tone="bahaya">{stateSandi.pesan}</Alert>
          ) : null}

          <Field label="Kata sandi baru" htmlFor="sandi" petunjuk="Minimal 8 karakter.">
            <Input
              id="sandi"
              name="sandi"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </Field>

          <Field label="Ulangi kata sandi baru" htmlFor="ulangi">
            <Input
              id="ulangi"
              name="ulangi"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </Field>

          <Button type="submit" variant="accent" className="w-full" disabled={pendingSandi}>
            <KeyRound className="size-4" aria-hidden />
            {pendingSandi ? "Menyimpan…" : "Simpan kata sandi baru"}
          </Button>
        </form>
      </PanelAuth>
    );
  }

  return (
    <PanelAuth
      ikon={<KeyRound className="size-5" aria-hidden />}
      judul="Lupa kata sandi?"
      deskripsi="Masukkan email administrator sekolah. Kami akan mengirim kode verifikasi untuk membuat kata sandi baru."
    >
      <form action={aksiMinta} className="flex flex-col gap-5">
        {stateMinta?.pesan && !stateMinta.ok ? (
          <Alert tone="bahaya">{stateMinta.pesan}</Alert>
        ) : null}

        <Field
          label="Email administrator"
          htmlFor="email"
          petunjuk="Kode dikirim ke alamat ini bila terdaftar."
        >
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@sekolah.example"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Button type="submit" variant="accent" className="w-full" disabled={pendingMinta}>
          <Mail className="size-4" aria-hidden />
          {pendingMinta ? "Mengirim…" : "Kirim kode verifikasi"}
        </Button>

        <Link
          href="/admin/login"
          className="text-sm leading-[1.5] text-muted hover:text-brand"
        >
          ← Kembali ke halaman masuk
        </Link>
      </form>
    </PanelAuth>
  );
}
