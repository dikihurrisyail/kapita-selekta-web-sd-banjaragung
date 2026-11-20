"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Garis progres di atas layar untuk setiap klik tautan internal.
 * Aktif dari klik sampai alamat (path atau query) berganti.
 */
export function ProgresNavigasi() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const kunci = `${pathname}?${query}`;

  const [prevKunci, setPrevKunci] = useState(kunci);
  const [menunggu, setMenunggu] = useState(false);

  if (kunci !== prevKunci) {
    setPrevKunci(kunci);
    setMenunggu(false);
  }

  useEffect(() => {
    function saatKlik(e: MouseEvent) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      setMenunggu(true);
    }
    // capture: <Link> memanggil preventDefault di fase bubble.
    document.addEventListener("click", saatKlik, true);
    return () => document.removeEventListener("click", saatKlik, true);
  }, []);

  useEffect(() => {
    if (!menunggu) return;
    const t = setTimeout(() => setMenunggu(false), 15000);
    return () => clearTimeout(t);
  }, [menunggu]);

  if (!menunggu) return null;

  return (
    <div
      role="progressbar"
      aria-label="Memuat halaman"
      className="progres-navigasi pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] bg-accent"
    />
  );
}
