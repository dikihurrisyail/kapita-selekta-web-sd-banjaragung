import type { LucideIcon } from "lucide-react";
import { MapPin, Phone, Mail } from "lucide-react";

const ikon: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
};

/** Saluran kontak: ikon 20px + label 12px + nilai 14px. */
export function ContactChannel({
  ikon: namaIkon,
  label,
  nilai,
}: {
  ikon: string;
  label: string;
  nilai: string;
}) {
  const Icon = ikon[namaIkon] ?? MapPin;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-btn bg-page-alt text-brand">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs leading-[1.4] text-muted">{label}</p>
        <p className="text-sm leading-[1.5] text-body">{nilai}</p>
      </div>
    </div>
  );
}
