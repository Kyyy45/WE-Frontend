"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Payment } from "@/types/payment";
import { ApiResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Loader2, CreditCard, Filter } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  // State Filter (Default: Tampilkan Semua)
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Endpoint: GET /payments/me
        const { data } = await api.get<ApiResponse<Payment[]>>("/payments/me");
        setPayments(data.data || []);
      } catch (error) {
        console.error("Gagal memuat transaksi:", error);
        toast.error("Gagal memuat riwayat transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    if (statusFilter === "all") return true;
    return payment.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Filter Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riwayat Transaksi</h1>
          <p className="text-muted-foreground">
            Pantau status pembayaran dan tagihan Anda.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-45 bg-background">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu Bayar</SelectItem>
              <SelectItem value="paid">Berhasil (Lunas)</SelectItem>
              <SelectItem value="failed">Gagal</SelectItem>
              <SelectItem value="expired">Kadaluarsa</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Daftar Tagihan
            <span className="ml-auto text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {filteredPayments.length} Data
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           <DataTable columns={columns} data={filteredPayments} />
        </CardContent>
      </Card>
    </div>
  );
}