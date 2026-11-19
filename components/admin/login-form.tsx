"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Foto } from "@/components/ui/foto";
import { SchoolIdentity } from "@/components/layout/school-identity";
import { loginAdmin } from "@/lib/actions/auth";

/**
 * Login admin — frame 1440×1024 terbagi dua:
 * panel identitas 660px + formulir 780px (konten 580px, padding 100).
 *
 * Form terhubung ke Server Action loginAdmin (Supabase Auth).
 */
export function LoginForm({ lanjut }: { lanjut: string }) {
  const [state, formAction, pending] = useActionState(loginAdmin, null);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Panel identitas layanan admin (660px) */}
      <section className="flex w-full flex-col gap-8 bg-brand px-8 py-10 lg:w-[660px] lg:shrink-0 lg:px-16 lg:py-16">
        <SchoolIdentity variant="dark" />
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-[32px] font-semibold leading-[1.15] text-white lg:text-[40px]">
            Satu tempat untuk mengelola informasi sekolah.
          </h1>
          <p className="max-w-[532px] text-base leading-[1.6] text-white">
            Perbarui profil, guru, pengumuman, berita, galeri, dan informasi PPDB
            tanpa menyentuh kode.
          </p>
        </div>
        <Foto
          src={null}
          label="Foto dokumentasi ilustratif — gedung sekolah"
          className="h-[240px] w-full max-w-[532px] lg:h-[340px]"
        />
        <p className="text-xs leading-[1.4] text-line-soft">
          Akses terbatas untuk administrator sekolah.
        </p>
      </section>

      {/* Formulir masuk admin (780px) */}
      <section className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="flex w-full max-w-[580px] flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="flex size-8 items-center justify-center rounded-btn bg-page-alt text-brand">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <h2 className="text-2xl font-bold leading-[1.3] text-brand-ink lg:text-[28px]">
              Masuk ke panel admin
            </h2>
            <p className="text-sm leading-[1.5] text-body">
              Gunakan akun administrator sekolah untuk mengelola konten website.
            </p>
          </div>

          {state?.pesan ? <Alert tone="bahaya">{state.pesan}</Alert> : null}

          <form action={formAction} className="flex flex-col gap-5">
            <input type="hidden" name="lanjut" value={lanjut} />

            <Field label="Email" htmlFor="login-email">
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@sekolah.example"
              />
            </Field>

            <Field
              label="Kata sandi"
              htmlFor="login-password"
              petunjuk="Gunakan minimal 8 karakter."
            >
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
              />
            </Field>

            <Button type="submit" variant="accent" className="w-full" disabled={pending}>
              {pending ? "Memeriksa…" : "Masuk"}
            </Button>
          </form>

          <Link
            href="/admin/login"
            className="text-sm font-semibold leading-[1.5] text-brand hover:underline"
          >
            Lupa kata sandi?
          </Link>

          <Link href="/" className="text-sm leading-[1.5] text-muted hover:text-brand">
            ← Kembali ke website
          </Link>
        </div>
      </section>
    </div>
  );
}
