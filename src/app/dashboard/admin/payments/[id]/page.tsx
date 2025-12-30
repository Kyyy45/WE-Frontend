"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { api } from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";
import { Payment } from "@/types/payment";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  User,
  BookOpen,
  CreditCard,
  CheckCircle,
} from "lucide-react";

// Extend Type untuk handle populate dari backend
interface PaymentDetail extends Payment {
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
  };
}

export default function AdminPaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/payments/${id}`);
        setPayment(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!payment)
    return <div className="p-8 text-center">Data tidak ditemukan</div>;

  return (
    <div className="space-y-6 p-8 pb-20">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="pl-0 text-muted-foreground hover:pl-2 transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Detail Transaksi
        </h1>
        <Badge
          className={`text-sm px-4 py-1 uppercase tracking-wide ${
            payment.status === "paid"
              ? "bg-green-600 hover:bg-green-700"
              : payment.status === "pending"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-destructive"
          }`}
        >
          {payment.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KIRI: INFO PEMBAYARAN */}
        <Card className="h-full">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-primary" /> Info Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono font-medium text-base">
                  {payment.orderId}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Tanggal</p>
                <p className="font-medium">
                  {format(new Date(payment.createdAt), "dd MMM yyyy, HH:mm", {
                    locale: idLocale,
                  })}
                </p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-muted-foreground text-sm mb-1">Total Bayar</p>
              <p className="text-3xl font-bold text-primary">
                {formatRupiah(payment.amount)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
              <div>
                <p className="text-muted-foreground mb-1">Metode</p>
                <p className="capitalize font-medium">
                  {payment.method.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Channel</p>
                <p className="capitalize font-medium">
                  {payment.channel || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KANAN: INFO USER & PRODUK */}
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" /> Info Pembeli (Siswa)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {payment.user?.fullName || "User Terhapus"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {payment.user?.email || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-primary" /> Produk Yang Dibeli
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Nama Kursus</p>
              <p className="font-bold text-lg text-foreground leading-tight">
                {payment.course?.title || "Kursus Terhapus"}
              </p>
              {payment.status === "paid" && (
                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-2 rounded-lg w-fit">
                  <CheckCircle className="w-4 h-4" /> Akses Aktif
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
