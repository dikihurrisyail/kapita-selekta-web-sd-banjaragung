import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "accent" | "light" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

const variantClass: Record<Variant, string> = {
  /* Tombol accent: bg #D97706, teks #0F172A (sesuai desain). */
  accent:
    "bg-accent border border-accent text-brand-ink hover:bg-[#c26b05] hover:border-[#c26b05]",
  /* Tombol light: putih dengan teks brand. */
  light: "bg-white border border-white text-brand hover:bg-page-alt",
  outline:
    "bg-transparent border border-line-soft text-body hover:bg-page-alt",
  ghost:
    "bg-transparent border border-transparent text-brand hover:bg-page-alt",
  danger: "bg-white border border-line text-danger hover:bg-danger-bg",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-9 px-3 py-2 text-[13px]",
  md: "min-h-11 px-4 py-2.5 text-sm",
  icon: "size-11 p-0",
};

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn font-semibold leading-[1.5] transition-colors disabled:cursor-not-allowed disabled:opacity-60";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "accent",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "accent",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

/** Tautan teks bergaya "Baca Selengkapnya →" (14px SemiBold, brand). */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "cursor-pointer text-sm font-semibold leading-[1.5] text-brand hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
