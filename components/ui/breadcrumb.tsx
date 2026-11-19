import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type Crumb = { label: string; href?: string };

/** Breadcrumb 12px, pemisah chevron. */
export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs leading-[1.4]", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="text-muted hover:text-brand">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-brand-ink" : "text-muted"}>
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight className="size-3.5 text-line-soft" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
