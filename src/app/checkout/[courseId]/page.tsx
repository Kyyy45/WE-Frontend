"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Course } from "@/types/course";
import { formatRupiah } from "@/lib/utils";
import { Header } from "@/components/landing-page/header";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldCheck, CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Ambil Data Kursus
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data.data);
      } catch (error) {
        console.error("Gagal load course:", error);
        toast.error("Gagal memuat data kursus");
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId, router]);

  // 2. Logic Gabungan (Enroll Gratis vs Payment Midtrans)
  const handleProcess = async () => {
    if (!course) return;

    try {
      setIsProcessing(true);

      // --- SKENARIO 1: KURSUS GRATIS ---
      if (course.isFree) {
        // Panggil Endpoint Enrollment langsung
        // Backend: POST /enrollments (Auth Guard)
        await api.post("/enrollments", { courseId });

        toast.success("Pendaftaran berhasil!");
        // Redirect langsung ke dashboard (sukses)
        router.push("/dashboard?payment=success");
        return;
      }

      // --- SKENARIO 2: KURSUS BERBAYAR ---
      // Panggil Endpoint Payment
      // Backend: POST /payments/checkout
      const { data } = await api.post("/payments/checkout", {
        courseId: courseId,
      });

      const snapToken = data.data.snapToken;

      if (!snapToken) {
        throw new Error("Token pembayaran tidak ditemukan");
      }

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            toast.success("Pembayaran Berhasil!");
            router.push("/dashboard?payment=success");
          },
          onPending: function (result) {
            toast.info("Menunggu pembayaran...");
            router.push("/dashboard?payment=pending");
          },
          onError: function (result) {
            toast.error("Pembayaran Gagal");
          },
          onClose: function () {
            toast.warning("Anda menutup popup pembayaran");
          },
        });
      } else {
        toast.error("Sistem pembayaran belum siap. Refresh halaman.");
      }
    } catch (error: unknown) {
      console.error("Process Error:", error);
      if (error instanceof AxiosError) {
        // Handle error spesifik backend (misal: "User already enrolled")
        toast.error(
          error.response?.data?.message || "Terjadi kesalahan proses"
        );
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-24 bg-muted/20">
        <Container className="max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>

          <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
            {course.isFree ? "Konfirmasi Pendaftaran" : "Checkout Kelas"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
            {/* KIRI: Detail Item */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Rincian Pesanan
                </h3>

                <div className="flex gap-5 items-start">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg leading-tight">
                      {course.title}
                    </h4>
                    <div className="text-sm text-muted-foreground bg-muted inline-block px-2 py-1 rounded">
                      Level: {course.level.toUpperCase().replace("_", " ")}
                    </div>
                    <p className="text-sm font-medium text-primary">
                      {course.isFree
                        ? "Akses Gratis Selamanya"
                        : "Akses Premium Lengkap"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-700">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <p>
                  {course.isFree
                    ? "Pendaftaran kelas ini tidak dipungut biaya apapun."
                    : "Transaksi ini dilindungi enkripsi SSL. Kami menggunakan gateway pembayaran resmi terpercaya."}
                </p>
              </div>
            </div>

            {/* KANAN: Ringkasan Harga */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg sticky top-28">
                <h3 className="font-bold text-lg mb-6">Ringkasan</h3>

                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga Kelas</span>
                    <span className="font-medium">
                      {course.isFree ? "Rp 0" : formatRupiah(course.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span className="font-medium">Rp 0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      {course.isFree ? "GRATIS" : formatRupiah(course.price)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full font-bold h-12 shadow-primary/20 shadow-lg"
                  onClick={handleProcess}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : course.isFree ? (
                    "Ambil Kelas Sekarang"
                  ) : (
                    "Bayar Sekarang"
                  )}
                </Button>

                <p className="text-[10px] text-center text-muted-foreground mt-4 leading-tight">
                  Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan layanan
                  Worldpedia Education.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
