import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
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
    default: "UPTD SD Negeri Banjar Agung — Tumbuh Bersama, Cerdas Berkarakter Jujur dalam Tindakan Mulia dalam Tujuan",
    template: "%s | UPTD SD Negeri Banjar Agung",
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
        {children}
      </body>
    </html>
  );
}
