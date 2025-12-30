"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Course } from "@/types/course";
import { ApiResponse } from "@/types/api";
import { useAuthStore } from "@/stores/auth-store";
import { formatRupiah } from "@/lib/utils";
import { Header } from "@/components/landing-page/header";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Banknote,
  QrCode,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Ambil Client Key dari ENV Frontend (.env.local)
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

// Interface untuk Payment Response (Backend)
interface PaymentResponseData {
  snapToken: string;
  // field lain jika perlu
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const { accessToken, user } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // State Form Pembayaran (Match dengan Backend Validator)
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "qris">(
    "bank_transfer"
  );
  const [channel, setChannel] = useState<"mandiri" | "other">("mandiri");

  // 0. Load Midtrans Snap Script secara dinamis
  useEffect(() => {
    const scriptId = "midtrans-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    // Gunakan sandbox untuk dev
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";

    script.id = scriptId;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);
  }, []);

  // 1. Validasi Auth
  useEffect(() => {
    if (!accessToken) {
      toast.error("Sesi habis, silakan login kembali.");
      router.push("/login");
    }
  }, [accessToken, router]);

  // 2. Ambil Data Kursus
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<ApiResponse<Course>>(
          `/courses/${courseId}`
        );
        setCourse(data.data);
      } catch (error) {
        console.error("Gagal load course:", error);
        toast.error("Gagal memuat data kursus");
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && accessToken) fetchCourse();
  }, [courseId, accessToken, router]);

  // 3. Logic Checkout
  const handleProcess = async () => {
    if (!course || !user) return;

    try {
      setIsProcessing(true);

      // --- SKENARIO 1: KURSUS GRATIS ---
      if (course.isFree) {
        await api.post("/enrollments", { courseId });
        toast.success("Pendaftaran berhasil!");
        router.push("/dashboard/siswa?enrollment=success");
        return;
      }

      // --- SKENARIO 2: KURSUS BERBAYAR ---
      const payload = {
        courseId: courseId,
        paymentMethod: paymentMethod,
        channel: paymentMethod === "bank_transfer" ? channel : undefined,
      };

      const { data } = await api.post<ApiResponse<PaymentResponseData>>(
        "/payments/checkout",
        payload
      );

      const snapToken = data.data.snapToken;

      if (!snapToken) {
        throw new Error("Gagal mendapatkan token pembayaran");
      }

      // Buka Popup Midtrans
      if (window.snap) {
        window.snap.pay(snapToken, {
          // FIX ESLINT: Gunakan 'unknown' alih-alih 'any'
          onSuccess: function (result: unknown) {
            console.log("Success:", result);
            toast.success("Pembayaran berhasil!");
            router.push("/dashboard/siswa/transactions");
          },
          onPending: function (result: unknown) {
            console.log("Pending:", result);
            toast.info("Menunggu pembayaran...");
            router.push("/dashboard/siswa/transactions");
          },
          onError: function (result: unknown) {
            console.error("Error:", result);
            toast.error("Pembayaran gagal.");
          },
          onClose: function () {
            toast.warning("Pembayaran belum diselesaikan.");
          },
        });
      } else {
        toast.error("Sistem pembayaran belum siap. Silakan refresh halaman.");
      }
    } catch (error: unknown) {
      console.error("Process Error:", error);
      if (error instanceof AxiosError) {
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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <Container className="max-w-5xl">
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-2 transition-all text-muted-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Batal & Kembali
          </Button>

          <h1 className="text-3xl font-bold mb-8 text-foreground">
            {course.isFree ? "Konfirmasi Pendaftaran" : "Checkout Kelas"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 items-start">
            {/* KIRI: Metode Pembayaran */}
            <div className="space-y-6">
              {!course.isFree && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-primary" />
                      Metode Pembayaran
                    </CardTitle>
                    <CardDescription>
                      Pilih metode pembayaran yang tersedia.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(v) =>
                        setPaymentMethod(v as "bank_transfer" | "qris")
                      }
                      className="grid gap-4"
                    >
                      {/* 1. Transfer Bank */}
                      <div>
                        <RadioGroupItem
                          value="bank_transfer"
                          id="bt"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="bt"
                          className="flex items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                              <Banknote size={24} />
                            </div>
                            <span className="font-semibold text-base">
                              Transfer Bank (Virtual Account)
                            </span>
                          </div>
                        </Label>
                      </div>

                      {/* 2. QRIS */}
                      <div>
                        <RadioGroupItem
                          value="qris"
                          id="qr"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="qr"
                          className="flex items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
                              <QrCode size={24} />
                            </div>
                            <span className="font-semibold text-base">
                              QRIS (GoPay, OVO, Dana)
                            </span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Sub-Selection: Bank Channel */}
                    {paymentMethod === "bank_transfer" && (
                      <div className="pl-4 border-l-2 border-primary/20 ml-6 animate-in slide-in-from-top-2 fade-in duration-300">
                        <Label className="mb-3 block text-sm font-medium text-muted-foreground">
                          Pilih Bank Tujuan:
                        </Label>
                        <RadioGroup
                          value={channel}
                          onValueChange={(v) =>
                            setChannel(v as "mandiri" | "other")
                          }
                          className="grid grid-cols-2 gap-4"
                        >
                          <div
                            className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors ${
                              channel === "mandiri"
                                ? "border-primary bg-primary/10"
                                : "bg-background"
                            }`}
                          >
                            <RadioGroupItem value="mandiri" id="mandiri" />
                            <Label
                              htmlFor="mandiri"
                              className="cursor-pointer font-semibold"
                            >
                              Mandiri
                            </Label>
                          </div>
                          <div
                            className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors ${
                              channel === "other"
                                ? "border-primary bg-primary/10"
                                : "bg-background"
                            }`}
                          >
                            <RadioGroupItem value="other" id="other" />
                            <Label
                              htmlFor="other"
                              className="cursor-pointer font-semibold"
                            >
                              Lainnya (BNI/Permata)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Security Info */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-700 dark:bg-blue-900/10 dark:border-blue-800 dark:text-blue-300">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <p>
                  {course.isFree
                    ? "Pendaftaran kelas ini gratis dan tidak memerlukan kartu kredit."
                    : "Transaksi diamankan dengan enkripsi SSL. Kami menggunakan Midtrans sebagai payment gateway resmi."}
                </p>
              </div>
            </div>

            {/* KANAN: Ringkasan Order */}
            <div className="space-y-6">
              <Card className="border-2 border-primary/10 shadow-lg sticky top-28">
                <CardHeader className="pb-4 border-b">
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Item Info */}
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
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
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm line-clamp-2 mb-1 leading-tight text-foreground">
                        {course.title}
                      </h4>
                      <p className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded w-fit">
                        Level: {course.level.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Harga Kelas</span>
                      <span className="font-medium text-foreground">
                        {formatRupiah(course.price || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biaya Admin</span>
                      <span className="font-medium text-green-600">Gratis</span>
                    </div>
                    {/* Tampilkan Monthly Price jika ada */}
                    {course.monthlyPrice &&
                      course.monthlyPrice > 0 &&
                      !course.isFree && (
                        <div className="flex justify-between pt-2 border-t border-dashed mt-2">
                          <span className="text-muted-foreground text-xs">
                            Info SPP Bulanan
                          </span>
                          <span className="font-medium text-xs text-foreground">
                            {formatRupiah(course.monthlyPrice)}
                          </span>
                        </div>
                      )}
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">Total Bayar</span>
                    <span className="font-black text-2xl text-primary">
                      {course.isFree
                        ? "GRATIS"
                        : formatRupiah(course.price || 0)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    size="lg"
                    className="w-full font-bold h-12 text-base shadow-lg hover:shadow-primary/25 transition-all"
                    onClick={handleProcess}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : course.isFree ? (
                      "Daftar Sekarang"
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" /> Bayar Sekarang
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <p className="text-[10px] text-center text-muted-foreground px-4 leading-tight">
                Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan
                Worldpedia Education.
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
