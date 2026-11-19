"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { simpanSandiBaru } from "@/lib/actions/auth";

/**
 * Form penetapan kata sandi baru setelah tautan pemulihan dibuka.
 *
 * Sesi pemulihan sudah diverifikasi di server sebelum halaman ini dirender,
 * jadi form ini hanya perlu mengirim kata sandi baru.
 */
export function FormSandiBaru({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(simpanSandiBaru, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.pesan ? <Alert tone="bahaya">{state.pesan}</Alert> : null}

      <p className="rounded-btn border border-line-soft bg-page px-4 py-3 text-sm leading-[1.5] text-body">
        Akun: <span className="font-semibold text-brand-ink">{email}</span>
      </p>

      <Field
        label="Kata sandi baru"
        htmlFor="sandi"
        petunjuk="Minimal 8 karakter."
      >
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

      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        <KeyRound className="size-4" aria-hidden />
        {pending ? "Menyimpan…" : "Simpan kata sandi baru"}
      </Button>
    </form>
  );
}
