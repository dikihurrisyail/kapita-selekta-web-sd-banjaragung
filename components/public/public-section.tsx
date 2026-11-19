import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Section publik dengan padding vertikal 56px dan gap antar-section 56px. */
export function PublicSection({
  children,
  className,
  alt,
}: {
  children: ReactNode;
  className?: string;
  alt?: boolean;
}) {
  return (
    <section className={cn(alt ? "bg-white" : "bg-page", className)}>
      <div className="container-page py-14">{children}</div>
    </section>
  );
}
