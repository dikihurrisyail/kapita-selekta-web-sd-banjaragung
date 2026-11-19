"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { mintaResetSandi } from "@/lib/actions/auth";

/**
 * Form permintaan tautan pemulihan kata sandi.
 *
 * Pesan hasil selalu sama, baik email terdaftar maupun tidak. Ini disengaja:
 * kalau aplikasi membedakan keduanya, siapa pun bisa memakai halaman ini untuk
 * menebak email administrator mana yang valid.
 */
export function FormLupaSandi() {
  const [state, formAction, pending] = useActionState(mintaResetSandi, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.pesan ? (
        <Alert tone={state.ok ? "sukses" : "bahaya"}>{state.pesan}</Alert>
      ) : null}

      <Field
        label="Email administrator"
        htmlFor="email"
        petunjuk="Tautan pemulihan dikirim ke alamat ini bila terdaftar."
      >
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@sekolah.example"
        />
      </Field>

      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        <Send className="size-4" aria-hidden />
        {pending ? "Mengirim…" : "Kirim tautan pemulihan"}
      </Button>

      <Link
        href="/admin/login"
        className="text-sm leading-[1.5] text-muted hover:text-brand"
      >
        ← Kembali ke halaman masuk
      </Link>
    </form>
  );
}
