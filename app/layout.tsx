import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import { PenjagaTautanAuth } from "@/components/auth/penjaga-tautan-auth";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SD Banjaragung — Bertumbuh bersama, berakar pada nilai.",
    template: "%s | SD Banjaragung",
  },
  description:
    "Ruang informasi dan kabar sekolah untuk orang tua, guru, dan masyarakat. Bersama mendampingi setiap langkah anak.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-page text-body">
        {/*
         * Penjaga tautan autentikasi dipasang di root layout supaya tetap
         * berjalan di halaman mana pun. Ini penting karena Supabase
         * mengarahkan tautan pemulihan kata sandi ke Site URL (biasanya "/"),
         * bukan ke halaman aplikasi — tokennya datang sebagai fragment URL.
         */}
        <Suspense fallback={null}>
          <PenjagaTautanAuth />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
