/** Skeleton pemuatan halaman publik saat berpindah rute. */
export default function PublicLoading() {
  return (
    <div className="container-page flex flex-col gap-10 py-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat halaman…</span>
      <div className="flex flex-col gap-3">
        <div className="h-3 w-24 rounded-pill bg-page-alt" />
        <div className="h-10 w-full max-w-[560px] rounded-btn bg-page-alt" />
        <div className="h-4 w-full max-w-[480px] rounded-btn bg-page-alt" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-card border border-line bg-white p-6">
            <div className="h-40 w-full rounded-img bg-page-alt" />
            <div className="h-5 w-3/4 rounded-btn bg-page-alt" />
            <div className="h-4 w-full rounded-btn bg-page-alt" />
          </div>
        ))}
      </div>
    </div>
  );
}
