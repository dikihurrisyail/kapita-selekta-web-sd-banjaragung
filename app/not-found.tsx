import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-page px-6 text-center">
      <span className="flex h-12 w-11 items-center justify-center rounded-btn bg-brand">
        <BookOpen className="size-[26px] text-white" aria-hidden />
      </span>
      <h1 className="text-[32px] font-bold leading-[1.2] text-brand-ink">
        Halaman tidak ditemukan
      </h1>
      <p className="max-w-[480px] text-base leading-[1.6] text-body">
        Tautan yang Anda buka mungkin sudah dipindahkan atau tidak tersedia.
        Silakan kembali ke beranda sekolah.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center rounded-btn border border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-brand-ink"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
