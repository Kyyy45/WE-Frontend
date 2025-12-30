"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Form, FormSubmission } from "@/types/form";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Icons
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Eye,
  FileText,
  Calendar,
  User,
} from "lucide-react";

export default function FormSubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [formDetail, setFormDetail] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Actions
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch Form Detail & Submissions
  // Fix: Bungkus dengan useCallback agar dependency useEffect stabil
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Parallel Fetch: Info Form & List Submission
      const [formRes, subRes] = await Promise.all([
        api.get(`/forms/${formId}`),
        api.get(`/forms/submissions/list`, {
          params: { formId, page: currentPage, limit: itemsPerPage },
        }),
      ]);

      setFormDetail(formRes.data.data || formRes.data);

      const subData = subRes.data.data || subRes.data;
      setSubmissions(subData.items || []);
      setTotalPages(subData.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pendaftar.");
    } finally {
      setIsLoading(false);
    }
  }, [formId, currentPage, itemsPerPage]);

  // Fix: Masukkan fetchData ke dependency array
  useEffect(() => {
    if (formId) fetchData();
  }, [formId, fetchData]);

  // 2. Handle Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/forms/submissions/${deleteId}`);
      toast.success("Data berhasil dihapus");
      // Refresh list tanpa loading screen penuh
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus data");
    } finally {
      setDeleteId(null);
    }
  };

  // Helper untuk menampilkan ringkasan data di tabel
  // Fix: Ganti 'any' dengan 'unknown' untuk type safety
  const renderSummary = (data: Record<string, unknown>) => {
    // Ambil 2 field pertama yang ada isinya sebagai preview
    const keys = Object.keys(data).slice(0, 2);
    return keys.map((key) => (
      <div
        key={key}
        // Fix: max-w-[200px] -> max-w-50
        className="text-xs text-muted-foreground truncate max-w-50"
      >
        <span className="font-semibold text-foreground/80 capitalize">
          {key.replace(/_/g, " ")}:
        </span>{" "}
        {String(data[key])}
      </div>
    ));
  };

  if (isLoading && !formDetail) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className="w-fit pl-0 hover:pl-2 transition-all text-muted-foreground"
          onClick={() => router.push("/dashboard/admin/forms")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke List Form
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Data Pendaftar
            </h1>
            <p className="text-muted-foreground mt-1">
              Formulir:{" "}
              <span className="font-semibold text-foreground">
                {formDetail?.name}
              </span>
            </p>
          </div>
          <Badge variant="outline" className="h-fit py-1 px-3">
            Total: {submissions.length} Data (Halaman ini)
          </Badge>
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {/* Fix: w-[50px] -> w-12.5 */}
                <TableHead className="w-12.5">No</TableHead>
                {/* Fix: w-[200px] -> w-50 */}
                <TableHead className="w-50">Tanggal Submit</TableHead>
                <TableHead>Ringkasan Data</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 opacity-20" />
                      <p>Belum ada yang mengisi formulir ini.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub, index) => (
                  <TableRow key={sub.id} className="group">
                    <TableCell className="font-medium text-muted-foreground">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(new Date(sub.createdAt), "dd MMM yyyy", {
                            locale: idLocale,
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(sub.createdAt), "HH:mm")} WIB
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {renderSummary(sub.data)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedSubmission(sub)}
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(sub.id)}
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* PAGINATION */}
        {submissions.length > 0 && (
          <div className="py-4 border-t flex justify-end px-4">
            <Pagination className="w-auto mx-0 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer rounded-md border"
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer rounded-md border"
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      {/* DETAIL DIALOG */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detail Jawaban</DialogTitle>
            <DialogDescription>
              Data lengkap yang dikirimkan user.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            {selectedSubmission && (
              <div className="space-y-6 py-4">
                {/* Meta Info */}
                <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {format(
                        new Date(selectedSubmission.createdAt),
                        "dd MMMM yyyy, HH:mm",
                        { locale: idLocale }
                      )}
                    </span>
                  </div>
                  {selectedSubmission.userId && (
                    <div className="flex items-center gap-2 text-sm border-l pl-4 ml-auto">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        User ID:{" "}
                        <span className="font-mono text-xs">
                          {selectedSubmission.userId}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Data Fields */}
                <div className="grid gap-4">
                  {Object.entries(selectedSubmission.data).map(
                    ([key, value]) => {
                      // Cari label asli dari form definition jika ada (optional enhancement)
                      const fieldLabel =
                        formDetail?.fields.find((f) => f.key === key)?.label ||
                        key;

                      return (
                        <div
                          key={key}
                          className="border-b pb-3 last:border-0 last:pb-0"
                        >
                          <p className="text-sm font-medium text-muted-foreground mb-1 capitalize">
                            {fieldLabel}
                          </p>
                          <p className="text-base font-semibold text-foreground whitespace-pre-wrap">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : String(value || "-")}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button onClick={() => setSelectedSubmission(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE ALERT */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Data jawaban ini akan dihapus permanen dan tidak dapat
              dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
