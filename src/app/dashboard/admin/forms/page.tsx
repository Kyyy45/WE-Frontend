"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  ExternalLink, 
  Copy,
  Loader2,
  FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { formService } from "@/services/form.service";
import { ApiError } from "@/services/api";


export default function AdminFormsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Fetch Data Forms
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-forms", page, search],
    queryFn: () => formService.adminListForms({ page, limit: 10, search }),
  });

  const formList = response?.data;

  // 2. Delete Mutation
  const { mutate: deleteForm, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => formService.adminDeleteForm(id),
    onSuccess: () => {
      toast.success("Formulir berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["admin-forms"] });
      setDeletingId(null);
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal menghapus form");
      setDeletingId(null);
    },
  });

  // Helper: Copy Link Public
  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link formulir disalin!");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-jakarta">Manajemen Formulir</h1>
          <p className="text-sm text-muted-foreground">Buat dan kelola formulir pendaftaran.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/forms/create">
            <Plus className="mr-2 h-4 w-4" /> Buat Formulir
          </Link>
        </Button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex items-center gap-2 bg-background p-1 rounded-lg w-full sm:w-80 border">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Cari formulir..." 
          className="border-0 shadow-none focus-visible:ring-0"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* TABLE DATA */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nama Formulir</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Akses</TableHead>
              <TableHead>Tgl Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !formList?.items || formList.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8 opacity-50" />
                    <p>Belum ada formulir yang dibuat.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              formList.items.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">{form.name}</span>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded w-fit text-muted-foreground">
                            /forms/{form.slug}
                        </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                      {form.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground capitalize">
                        {form.visibility}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(form.createdAt).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => copyLink(form.slug)}>
                           <Copy className="mr-2 h-4 w-4" /> Salin Link
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/forms/${form.slug}`} target="_blank">
                             <ExternalLink className="mr-2 h-4 w-4" /> Lihat Live
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            {/* Note: Halaman Edit belum dibuat, tapi linknya akan kesini */}
                           <Link href={`/dashboard/admin/forms/${form.id}`}>
                             <Pencil className="mr-2 h-4 w-4" /> Edit
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => setDeletingId(form.id)}
                            className="text-red-600 focus:text-red-600"
                        >
                           <Trash className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {formList && formList.totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
            >
                Previous
            </Button>
            <div className="flex items-center text-sm font-medium">
                Halaman {page} dari {formList.totalPages}
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => p + 1)}
                disabled={page >= formList.totalPages || isLoading}
            >
                Next
            </Button>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Formulir?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data jawaban (submissions) yang terkait dengan formulir ini juga akan terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deletingId) deleteForm(deletingId);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}