const EMBED_RESMI = "https://www.google.com/maps/embed?pb=";

/** Ambil `src` dari HTML <iframe> Google Maps; null bila bukan embed resmi. */
export function srcDariIframe(html: string) {
  const src = html.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1];
  return src?.startsWith(EMBED_RESMI) ? src.replaceAll("&amp;", "&") : null;
}

/** Sumber iframe: embed resmi bila ada, selain itu dari koordinat tautan. */
export function petaEmbedUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith(EMBED_RESMI)) return url;
  const m =
    url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ??
    url.match(/(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/);
  return m
    ? `https://maps.google.com/maps?q=${m[1]},${m[2]}&z=17&output=embed`
    : null;
}

/** Tautan untuk tombol "Buka di peta"; embed resmi diturunkan jadi tautan biasa. */
export function petaTautan(url?: string | null) {
  if (!url?.startsWith(EMBED_RESMI)) return url ?? null;
  const lng = url.match(/!2d(-?\d+\.\d+)/)?.[1];
  const lat = url.match(/!3d(-?\d+\.\d+)/)?.[1];
  return lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;
}
