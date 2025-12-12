import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const fontJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Worldpedia Education",
  description: "Platform Bimbingan Belajar Terpadu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${fontJakarta.variable} ${fontInter.variable} antialiased bg-background text-foreground`}
      >
        {/* Bungkus seluruh aplikasi dengan Providers tunggal */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}