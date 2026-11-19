/**
 * Skeleton pemuatan panel admin.
 *
 * Selain menjadi UX, file ini menyediakan Suspense boundary yang dibutuhkan
 * Cache Components agar halaman admin boleh membaca data runtime (cookies /
 * query Supabase) tanpa menghentikan prerender.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat data…</span>

      <div className="flex flex-col gap-2">
        <div className="h-3 w-24 rounded-pill bg-page-alt" />
        <div className="h-8 w-64 rounded-btn bg-page-alt" />
        <div className="h-4 w-full max-w-[420px] rounded-btn bg-page-alt" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-card border border-line bg-white p-6"
          >
            <div className="h-3 w-20 rounded-pill bg-page-alt" />
            <div className="h-9 w-16 rounded-btn bg-page-alt" />
            <div className="h-3 w-24 rounded-pill bg-page-alt" />
          </div>
        ))}
      </div>

      <div className="rounded-card border border-line bg-white p-6">
        <div className="flex flex-col gap-3">
          <div className="h-4 w-40 rounded-btn bg-page-alt" />
          <div className="h-3 w-full rounded-pill bg-page-alt" />
          <div className="h-3 w-5/6 rounded-pill bg-page-alt" />
          <div className="h-3 w-2/3 rounded-pill bg-page-alt" />
        </div>
      </div>
    </div>
  );
}
