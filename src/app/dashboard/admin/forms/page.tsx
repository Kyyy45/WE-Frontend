"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Form, FormField } from "@/types/form";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  Search,
  Loader2,
  FileText,
  Copy,
} from "lucide-react";

// --- TYPES LOCAL UNTUK PREVIEW ---
interface PreviewSection {
  id: string;
  label: string;
  fields: FormField[];
}

export default function FormsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [forms, setForms] = useState<Form[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Action States
  const [previewData, setPreviewData] = useState<Form | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch Data
  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/forms?limit=100");

      const rawData = response.data;
      let finalData: Form[] = [];

      if (rawData?.data?.items && Array.isArray(rawData.data.items)) {
        finalData = rawData.data.items;
      } else if (rawData?.data && Array.isArray(rawData.data)) {
        finalData = rawData.data;
      } else if (Array.isArray(rawData)) {
        finalData = rawData;
      }

      setForms(finalData);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data form.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // 2. Handle Delete
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/forms/${deleteId}`);
      toast.success("Form berhasil dihapus.");
      setForms((prev) =>
        Array.isArray(prev) ? prev.filter((f) => f.id !== deleteId) : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus form.");
    } finally {
      setDeleteId(null);
    }
  };

  // 3. Filter & Pagination Logic
  const safeForms = Array.isArray(forms) ? forms : [];
  const filteredForms = safeForms.filter((form) =>
    (form.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const paginatedForms = filteredForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- RENDER ---
  return (
    <div className="space-y-6 p-8 pb-20">
      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manajemen Form
        </h1>
        <p className="text-muted-foreground mt-1">
          Buat, edit, dan kelola formulir pendaftaran.
        </p>
      </div>

      {/* HEADER ACTION (Search Kiri, Button Kanan) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar (Kiri) */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama form..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Create Button (Kanan) */}
        <Link href="/dashboard/admin/forms/create">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Buat Form Baru
          </Button>
        </Link>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-62.5">Nama Form</TableHead>
                <TableHead>Slug (URL)</TableHead>
                <TableHead>Akses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" /> Memuat
                      data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedForms.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 opacity-20" />
                      <p>Tidak ada form ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedForms.map((form) => (
                  <TableRow key={form.id} className="group">
                    {/* KOLOM 1: NAMA */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-base text-primary font-bold">
                          {form.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-62.5">
                          {form.description || "Tidak ada deskripsi"}
                        </span>
                      </div>
                    </TableCell>

                    {/* KOLOM 2: SLUG (BARU) */}
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] w-fit bg-muted/50"
                        >
                          /form/{form.slug || form.id}
                        </Badge>
                        <button
                          className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `${window.location.origin}/form/${
                              form.slug || form.id
                            }`;
                            navigator.clipboard.writeText(url);
                            toast.success("Link berhasil disalin!");
                          }}
                        >
                          <Copy className="w-3 h-3" /> Salin Link
                        </button>
                      </div>
                    </TableCell>

                    {/* KOLOM 3: AKSES */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          form.visibility === "public"
                            ? "border-blue-500 text-blue-500"
                            : "border-orange-500 text-orange-500"
                        }
                      >
                        {form.visibility === "public"
                          ? "Publik"
                          : "Login Wajib"}
                      </Badge>
                    </TableCell>

                    {/* KOLOM 4: STATUS */}
                    <TableCell>
                      <Badge
                        className={
                          form.status === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-muted-foreground"
                        }
                      >
                        {form.status === "active" ? "Aktif" : "Non-Aktif"}
                      </Badge>
                    </TableCell>

                    {/* KOLOM 5: TANGGAL */}
                    <TableCell className="text-muted-foreground text-sm">
                      {form.createdAt
                        ? format(new Date(form.createdAt), "dd MMM yyyy", {
                            locale: idLocale,
                          })
                        : "-"}
                    </TableCell>

                    {/* KOLOM 6: AKSI */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/admin/forms/${form.id}`)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit Builder
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/admin/forms/${form.id}/submissions`
                              )
                            }
                          >
                            <FileText className="mr-2 h-4 w-4" /> Data Pendaftar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setPreviewData(form)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Preview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(form.id as string)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* PAGINATION FIXED - POJOK KANAN & KOTAK */}
        {!isLoading && filteredForms.length > 0 && (
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer rounded-md border"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                )}

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

      {/* --- PREVIEW MODAL --- */}
      <Dialog
        open={!!previewData}
        onOpenChange={(open) => !open && setPreviewData(null)}
      >
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 overflow-hidden sm:max-w-4xl">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">Preview Form</DialogTitle>
            <DialogDescription>
              Tampilan form yang akan dilihat user.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 bg-background">
            <div className="p-6">
              {previewData && (
                <div className="max-w-2xl mx-auto space-y-8 bg-card text-card-foreground p-8 shadow-sm border rounded-lg">
                  <div className="text-center border-b pb-6">
                    <h1 className="text-3xl font-bold text-primary">
                      {previewData.name}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      {previewData.description}
                    </p>
                  </div>
                  {/* Render Preview */}
                  <div className="space-y-8">
                    {reconstructSections(previewData.fields || []).map(
                      (section, idx) => (
                        <div key={idx} className="space-y-4">
                          <div className="pb-2 border-b-2 border-primary/20">
                            <h3 className="text-xl font-bold text-primary">
                              {section.label}
                            </h3>
                          </div>
                          <div className="grid gap-6">
                            {section.fields?.map(
                              (field: FormField, fIdx: number) => (
                                <div key={fIdx} className="space-y-2">
                                  <Label>
                                    {field.label}{" "}
                                    {field.required && (
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    )}
                                  </Label>
                                  <PreviewFieldRenderer field={field} />
                                  {field.helpText && (
                                    <p className="text-[0.8rem] text-muted-foreground">
                                      {field.helpText}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t">
            <Button onClick={() => setPreviewData(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE ALERT --- */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Form?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data terkait form ini
              akan hilang permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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

// --- HELPER FUNCTIONS FOR PREVIEW ---

const reconstructSections = (flatFields: FormField[]): PreviewSection[] => {
  if (!flatFields || !Array.isArray(flatFields) || flatFields.length === 0)
    return [];

  const sections: PreviewSection[] = [];
  let currentSection: PreviewSection = {
    id: "main",
    label: "Informasi Utama",
    fields: [],
  };

  flatFields.forEach((field) => {
    if (field.type === "header") {
      if (currentSection.fields.length > 0 || currentSection.id !== "main") {
        sections.push(currentSection);
      }
      currentSection = {
        id: field.key,
        label: field.label,
        fields: [],
      };
    } else {
      currentSection.fields.push(field);
    }
  });

  sections.push(currentSection);

  if (
    sections.length > 1 &&
    sections[0].id === "main" &&
    sections[0].fields.length === 0
  ) {
    sections.shift();
  }

  return sections;
};

function PreviewFieldRenderer({ field }: { field: FormField }) {
  if (["text", "email", "number", "phone"].includes(field.type)) {
    return (
      <Input
        placeholder={field.placeholder || ""}
        readOnly
        className="cursor-default focus-visible:ring-0"
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <Textarea
        placeholder={field.placeholder || ""}
        readOnly
        className="cursor-default focus-visible:ring-0 resize-none h-24"
      />
    );
  }
  if (field.type === "date") {
    return (
      <Input
        type="date"
        readOnly
        className="w-full cursor-default focus-visible:ring-0"
      />
    );
  }
  if (field.type === "select") {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Pilih..." />
        </SelectTrigger>
        <SelectContent />
      </Select>
    );
  }
  if (field.type === "radio" || field.type === "checkbox") {
    return (
      <div className="space-y-2 pl-1">
        {field.options?.map((opt, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div
              className={`h-4 w-4 border border-primary/50 ${
                field.type === "radio" ? "rounded-full" : "rounded"
              }`}
            />
            {opt.label}
          </div>
        ))}
      </div>
    );
  }
  return <Input disabled placeholder="Unsupported field" />;
}
