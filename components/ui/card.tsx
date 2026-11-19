import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Kartu dasar: radius 12, border 1px #E2E8F0, padding 24. */
export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-line bg-surface",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Panel admin dengan padding 24 dan judul panel. */
export function Panel({
  judul,
  aksi,
  children,
  className,
  bodyClassName,
}: {
  judul?: ReactNode;
  aksi?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {(judul || aksi) && (
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          {judul ? (
            <h2 className="text-xl font-bold leading-[1.4] text-brand-ink">{judul}</h2>
          ) : (
            <span />
          )}
          {aksi}
        </div>
      )}
      <div className={cn("px-6 py-6", bodyClassName)}>{children}</div>
    </Card>
  );
}
