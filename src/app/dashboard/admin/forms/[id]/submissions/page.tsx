"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // Hapus useRouter
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Eye, Trash, Calendar } from "lucide-react"; // Hapus FileJson

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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formService } from "@/services/form.service";
import { ApiError } from "@/services/api";
import { FormSubmission } from "@/types/form";

export default function FormSubmissionsPage() {
  const params = useParams();
  // const router = useRouter(); // HAPUS INI
  const queryClient = useQueryClient();
  const formId = params.id as string;

  const [page, setPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Fetch Form Detail (untuk Judul)
  const { data: formData } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formService.adminGetFormById(formId),
  });

  // 2. Fetch Submissions
  const { data: submissionData, isLoading } = useQuery({
    queryKey: ["submissions", formId, page],
    queryFn: () => formService.adminListSubmissions({ formId, page, limit: 10 }),
  });

  const submissions = submissionData?.data;

  // 3. Delete Submission
  const { mutate: deleteSubmission, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => formService.adminDeleteSubmission(id),
    onSuccess: () => {
      toast.success("Data jawaban berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      setDeletingId(null);
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal menghapus data");
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/forms"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold font-jakarta">Hasil Jawaban</h1>
           <p className="text-sm text-muted-foreground">
             Formulir: <span className="font-semibold text-foreground">{formData?.data?.name || "..."}</span>
           </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Tanggal Submit</TableHead>
              <TableHead>User ID (Jika Login)</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : !submissions?.items || submissions.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  Belum ada jawaban masuk.
                </TableCell>
              </TableRow>
            ) : (
              submissions.items.map((sub, i) => (
                <TableRow key={sub.id}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(sub.createdAt).toLocaleString("id-ID")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {sub.userId ? (
                        <Badge variant="outline" className="font-mono text-xs">{sub.userId}</Badge>
                    ) : (
                        <span className="text-muted-foreground italic text-sm">Guest / Anonim</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(sub)}>
                            <Eye className="h-4 w-4 mr-1" /> Detail
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeletingId(sub.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {submissions && submissions.totalPages > 1 && (
        <div className="flex justify-end gap-2">
           <Button variant="outline" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</Button>
           <Button variant="outline" onClick={() => setPage(p => p+1)} disabled={page >= submissions.totalPages}>Next</Button>
        </div>
      )}

      {/* DIALOG DETAIL JAWABAN */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-xl">
            <DialogHeader>
                <DialogTitle>Detail Jawaban</DialogTitle>
                <DialogDescription>
                    Dikirim pada: {selectedSubmission && new Date(selectedSubmission.createdAt).toLocaleString()}
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] mt-4">
                <div className="space-y-4 pr-4">
                    {selectedSubmission && Object.entries(selectedSubmission.data).map(([key, value]) => (
                        <div key={key} className="bg-muted/30 p-3 rounded-lg border">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                                {key.replace(/([A-Z])/g, " $1").trim()} {/* CamelCase to Spaced */}
                            </span>
                            <p className="text-sm font-medium whitespace-pre-wrap">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </p>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* DELETE ALERT */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data ini?</AlertDialogTitle>
            <AlertDialogDescription>Data jawaban ini akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
                onClick={() => deletingId && deleteSubmission(deletingId)}
                className="bg-red-600 hover:bg-red-700"
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}