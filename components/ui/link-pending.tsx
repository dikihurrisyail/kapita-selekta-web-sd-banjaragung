"use client";

import { useLinkStatus } from "next/link";
import { cn } from "@/lib/utils/cn";

/** Spinner kecil; taruh di dalam <Link>. Muncul saat navigasi menunggu server. */
export function LinkPending({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={cn(
        "size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent transition-opacity",
        pending ? "opacity-100 delay-100" : "opacity-0",
        className,
      )}
    />
  );
}
