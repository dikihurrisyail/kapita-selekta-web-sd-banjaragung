import type { LucideIcon } from "lucide-react";
import { Info, CircleCheck, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type AlertTone = "info" | "sukses" | "bahaya";

const tone: Record<AlertTone, { wrap: string; icon: LucideIcon; iconClass: string }> = {
  info: {
    wrap: "border-line bg-page-alt text-brand",
    icon: Info,
    iconClass: "text-brand",
  },
  sukses: {
    wrap: "border-success-line bg-success-bg text-success",
    icon: CircleCheck,
    iconClass: "text-success",
  },
  bahaya: {
    wrap: "border-[#fecaca] bg-danger-bg text-danger",
    icon: CircleAlert,
    iconClass: "text-danger",
  },
};

/**
 * Banner umpan balik — ikon 20px + teks 12–14px.
 * Sesuai layer "Pesan umpan balik" di Figma.
 */
export function Alert({
  children,
  tone: t = "info",
  className,
}: {
  children: ReactNode;
  tone?: AlertTone;
  className?: string;
}) {
  const { wrap, icon: Icon, iconClass } = tone[t];
  return (
    <div
      role={t === "bahaya" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-card border px-4 py-3.5 text-[13px] leading-[1.5]",
        wrap,
        className,
      )}
    >
      <Icon className={cn("mt-px size-5 shrink-0", iconClass)} aria-hidden />
      <p className="min-w-0">{children}</p>
    </div>
  );
}
