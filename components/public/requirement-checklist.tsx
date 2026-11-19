import { SquareCheck } from "lucide-react";

/** Butir checklist persyaratan (layer "Berkas persyaratan"): ikon square-check 20px + teks. */
export function RequirementChecklist({ butir }: { butir: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {butir.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <SquareCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <span className="text-sm leading-[1.5] text-body">{item}</span>
        </li>
      ))}
    </ul>
  );
}
