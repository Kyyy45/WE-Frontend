"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { api } from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";
import { Payment } from "@/types/payment";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, LayoutList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(""); // Search belum dihandle backend secara deep, tapi disiapkan UI-nya

  const fetchPayments = async (page: number) => {
    try {
      setLoading(true);
      // GET /payments (Admin List) dengan pagination
      const { data } = await api.get("/payments", {
        params: { page, limit: 10 },
      });

      // Backend return format: { success: true, data: { items: [], totalPages: ... } }
      const responseData = data.data || {};
      const items = Array.isArray(responseData.items) ? responseData.items : [];

      setPayments(items);
      setTotalPages(responseData.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600 hover:bg-green-700">Lunas</Badge>;
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Menunggu
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Gagal</Badge>;
      case "expired":
        return <Badge variant="outline">Kadaluarsa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Laporan Transaksi
        </h1>
        <p className="text-muted-foreground mt-1">
          Pantau semua pembayaran masuk dari siswa.
        </p>
      </div>

      {/* Filter / Search Bar Sederhana */}
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari Order ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // Implementasi search real ke backend bisa ditambahkan nanti
          />
        </div>
        <Button variant="outline" onClick={() => fetchPayments(1)}>
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <LayoutList className="w-8 h-8 opacity-20" />
                      <p>Belum ada data transaksi.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {payment.orderId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {payment.createdAt
                        ? format(
                            new Date(payment.createdAt),
                            "dd/MM/yyyy HH:mm",
                            { locale: idLocale }
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatRupiah(payment.amount)}
                    </TableCell>
                    <TableCell className="capitalize text-sm">
                      {payment.method.replace("_", " ")}
                      <span className="text-muted-foreground ml-1 text-xs">
                        ({payment.channel || "-"})
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/admin/payments/${payment.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {!loading && payments.length > 0 && (
          <div className="py-4 border-t flex justify-end px-4">
            <Pagination className="w-auto mx-0 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && fetchPayments(currentPage - 1)
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-4">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages && fetchPayments(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}
