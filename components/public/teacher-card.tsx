import { Card } from "@/components/ui/card";
import { Foto } from "@/components/ui/foto";
import type { Guru } from "@/lib/data/types";

/**
 * Kartu guru (layer "Kartu guru", 288×465):
 * foto di atas (rasio 3:4), identitas padding 20.
 */
export function TeacherCard({ item }: { item: Guru }) {
  return (
    <Card as="article" className="flex w-full flex-col overflow-hidden">
      <Foto
        src={item.foto.src}
        label={`Foto ${item.nama}`}
        ratio="3 / 4"
        className="w-full rounded-none"
      />
      <div className="flex flex-col gap-1 p-5">
        <h3 className="text-base font-semibold leading-[1.35] text-brand-ink">
          {item.nama}
        </h3>
        <p className="text-sm leading-[1.5] text-muted">{item.jabatan}</p>
      </div>
    </Card>
  );
}
