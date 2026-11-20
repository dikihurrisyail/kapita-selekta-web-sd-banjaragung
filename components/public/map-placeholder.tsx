import { MapPin } from "lucide-react";

/**
 * Denah lokasi ilustratif (layer "Denah lokasi ilustratif" di /kontak):
 * komposisi rounded-rectangle — blok lingkungan, taman, jalur jalan,
 * dan penanda sekolah di tengah.
 *
 * Bila sekolah punya tautan peta resmi, komponen ini menampilkan tautan
 * tersebut di bawah denah (lihat /kontak).
 */
/** Ambil koordinat dari tautan Google Maps panjang (…@lat,lng / ?q=lat,lng). */
export function petaEmbedUrl(url?: string | null) {
  const m = url?.match(/(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/);
  return m
    ? `https://maps.google.com/maps?q=${m[1]},${m[2]}&z=17&output=embed`
    : null;
}

export function MapPlaceholder({
  className,
  namaSekolah = "Sekolah",
  petaUrl,
}: {
  className?: string;
  namaSekolah?: string;
  petaUrl?: string | null;
}) {
  const embed = petaEmbedUrl(petaUrl);
  if (embed) {
    return (
      <iframe
        src={embed}
        title={`Peta lokasi ${namaSekolah}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`rounded-img border border-line-soft ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label="Denah lokasi ilustratif"
      className={`relative overflow-hidden rounded-img border border-line-soft bg-[#eef4ec] ${className ?? ""}`}
    >
      {/* Blok lingkungan */}
      <div className="absolute top-6 left-6 h-24 w-32 rounded-[6px] bg-[#dbe7d8]" />
      <div className="absolute top-6 right-10 h-16 w-28 rounded-[6px] bg-[#dbe7d8]" />
      <div className="absolute bottom-10 left-10 h-20 w-24 rounded-[6px] bg-[#dbe7d8]" />
      <div className="absolute right-8 bottom-8 h-24 w-32 rounded-[6px] bg-[#dbe7d8]" />

      {/* Taman lingkungan */}
      <div className="absolute top-1/2 left-1/2 h-20 w-28 -translate-x-1/2 -translate-y-[150%] rounded-[6px] bg-[#cfe3c9]" />
      <div className="absolute top-1/2 left-[18%] h-16 w-16 -translate-y-1/2 rounded-full bg-[#cfe3c9]" />

      {/* Jalur jalan */}
      <div className="absolute top-1/2 right-0 left-0 h-6 -translate-y-1/2 bg-[#e6e8ea]" />
      <div className="absolute top-0 bottom-0 left-1/2 w-6 -translate-x-1/2 bg-[#e6e8ea]" />

      {/* Penanda sekolah */}
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
        <span className="flex size-11 items-center justify-center rounded-pill bg-brand text-white">
          <MapPin className="size-5" aria-hidden />
        </span>
        <span className="rounded-btn bg-white px-2 py-1 text-[11px] font-semibold text-brand-ink">
          {namaSekolah}
        </span>
      </div>
    </div>
  );
}
