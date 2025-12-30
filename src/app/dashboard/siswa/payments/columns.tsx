"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

// Helper Badge yang sama seperti sebelumnya
const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    paid: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
    failed: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    expired: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
  };

  const labels: Record<string, string> = {
    pending: "Menunggu Bayar",
    paid: "Berhasil",
    failed: "Gagal",
    expired: "Kadaluarsa",
    cancelled: "Dibatalkan",
  };

  return (
    <Badge
      variant="outline"
      className={`${styles[status] || ""} border shadow-sm`}
    >
      {labels[status] || status}
    </Badge>
  );
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">
        {row.getValue("orderId")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <span className="text-muted-foreground">
          {date
            ? format(new Date(date), "dd MMM yyyy, HH:mm", { locale: idLocale })
            : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Metode Pembayaran",
    cell: ({ row }) => {
      const method = row.original.method;
      const channel = row.original.channel;
      return (
        <span className="capitalize">
          {method === "bank_transfer"
            ? `Transfer ${channel || "Bank"}`
            : "QRIS / E-Wallet"}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Nominal",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <span className="font-bold">{formatRupiah(amount)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return getStatusBadge(row.getValue("status"));
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const payment = row.original;

      const handlePay = () => {
        if (payment.snapRedirectUrl) {
          window.location.href = payment.snapRedirectUrl;
        } else {
          toast.error("Link pembayaran tidak ditemukan");
        }
      };

      return (
        <div className="text-right">
          {payment.status === "pending" && (
            <Button
              size="sm"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
              onClick={handlePay}
            >
              Bayar <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          )}
          {payment.status === "paid" && (
            <span className="text-xs text-muted-foreground italic">Lunas</span>
          )}
        </div>
      );
    },
  },
];
