import { Search } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const fieldBase =
  "w-full rounded-btn border border-line-soft bg-white px-3 py-[11px] text-sm leading-[1.5] text-body placeholder:text-muted focus:border-brand focus:outline-none";

/** Label isian 14px SemiBold + kontrol + petunjuk. */
export function Field({
  label,
  htmlFor,
  petunjuk,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  petunjuk?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold leading-[1.5] text-brand-ink"
      >
        {label}
      </label>
      {children}
      {petunjuk ? (
        <p className="text-xs leading-[1.4] text-muted">{petunjuk}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-[120px] resize-y", className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(fieldBase, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

/** Kolom pencarian dengan ikon search 20px. */
export function SearchField({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <div className={cn("relative flex-1", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input className={cn(fieldBase, "pl-10")} type="search" {...props} />
    </div>
  );
}

/** Kotak pilihan (checkbox) — 20px, radius 4. */
export function Checkbox({
  label,
  id,
  ...props
}: { label: ReactNode } & ComponentProps<"input">) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[4px] border border-line-soft accent-brand"
        {...props}
      />
      <label htmlFor={id} className="cursor-pointer text-sm leading-[1.5] text-body">
        {label}
      </label>
    </div>
  );
}

/** Sakelar (toggle) untuk status visibilitas. */
export function Switch({
  label,
  id,
  defaultChecked,
  ...props
}: { label: ReactNode } & ComponentProps<"input">) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer size-0 opacity-0"
          {...props}
        />
        <span
          aria-hidden
          className="relative h-6 w-11 cursor-pointer rounded-pill bg-line-soft transition-colors peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-pill after:bg-white after:transition-transform peer-checked:after:translate-x-5"
        />
      </span>
      <label htmlFor={id} className="cursor-pointer text-sm leading-[1.5] text-body">
        {label}
      </label>
    </div>
  );
}

/** Baris isian read-only bergaya "Nilai isian" pada desain admin. */
export function ValueBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-btn border border-line-soft bg-page px-3 py-3 text-sm leading-[1.5] text-body",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type IkonField = { label: string; nilai: string; petunjuk?: string };
