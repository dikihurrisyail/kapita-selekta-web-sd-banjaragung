/**
 * Skeleton pemuatan halaman autentikasi.
 *
 * Menyediakan Suspense boundary agar halaman login boleh membaca
 * searchParams (runtime) dengan Cache Components aktif.
 */
export default function AuthLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Memuat halaman…</span>
      <div className="flex w-full max-w-[580px] flex-col gap-5">
        <div className="size-8 rounded-btn bg-page-alt" />
        <div className="h-7 w-64 rounded-btn bg-page-alt" />
        <div className="h-4 w-full max-w-[420px] rounded-btn bg-page-alt" />
        <div className="mt-4 h-11 w-full rounded-btn bg-page-alt" />
        <div className="h-11 w-full rounded-btn bg-page-alt" />
        <div className="h-11 w-32 rounded-btn bg-page-alt" />
      </div>
    </div>
  );
}
