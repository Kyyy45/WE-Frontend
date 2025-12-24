import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing-page/header";
import { Container } from "@/components/layout/container";
import { IconError404, IconHome } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <Container>
          <div className="flex flex-col items-center text-center space-y-6 max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
              <IconError404
                size={120}
                className="relative text-primary stroke-[1.5]"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Halaman Tidak Ditemukan
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan,
              atau ID kursus yang Anda masukkan salah.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/">
                  <IconHome className="mr-2 w-4 h-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <Link href="/courses">Lihat Katalog Kursus</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
