"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { HasilAksi } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

type Aksi = (sebelumnya: HasilAksi | null, formData: FormData) => Promise<HasilAksi>;

/**
 * Form admin yang terhubung ke Server Action.
 *
 * Menampilkan:
 *   * umpan balik hasil simpan (sukses / gagal)
 *   * bar aksi sticky di bawah (petunjuk + Batal + Simpan)
 *
 * `children` diisi field-field form.
 */
export function FormAksi({
  action,
  children,
  teksSimpan = "Simpan perubahan",
  teksBatal = "Batal",
  petunjuk = "Perubahan belum disimpan.",
  className,
  id,
}: {
  action: Aksi;
  children: React.ReactNode;
  teksSimpan?: string;
  teksBatal?: string;
  petunjuk?: string;
  className?: string;
  id?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)} id={id}>
      {children}

      {state?.pesan ? (
        <Alert tone={state.ok ? "sukses" : "bahaya"}>{state.pesan}</Alert>
      ) : null}

      <div className="sticky bottom-[76px] flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-white px-6 py-4 lg:bottom-0">
        <p className="text-sm leading-[1.5] text-muted">
          {pending ? "Menyimpan…" : petunjuk}
        </p>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => router.back()}
          >
            {teksBatal}
          </Button>
          <Button type="submit" variant="accent" disabled={pending}>
            {pending ? "Menyimpan…" : teksSimpan}
          </Button>
        </div>
      </div>
    </form>
  );
}

/**
 * Form ringkas tanpa bar sticky — dipakai untuk form pencarian
 * dan form di dalam kartu kecil.
 */
export function FormRingkas({
  action,
  children,
  className,
}: {
  action: Aksi;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={cn("flex flex-col gap-4", className)}>
      {children}
      {state?.pesan ? (
        <Alert tone={state.ok ? "sukses" : "bahaya"}>{state.pesan}</Alert>
      ) : null}
      <div>
        <Button type="submit" variant="accent" size="sm" disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}

/** Tombol hapus dengan konfirmasi, memanggil Server Action. */
export function TombolHapus({
  action,
  id,
  label,
  children,
  className,
}: {
  action: (id: string) => Promise<HasilAksi>;
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [, formAction, pending] = useActionState(
    async (_prev: HasilAksi | null, formData: FormData) => {
      const target = String(formData.get("id") ?? "");
      return action(target);
    },
    null,
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(`Hapus ${label}? Tindakan ini tidak dapat dibatalkan.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Hapus ${label}`}
        disabled={pending}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-btn border border-line-soft text-danger hover:bg-danger-bg disabled:opacity-50",
          className,
        )}
      >
        {children}
      </button>
    </form>
  );
}
