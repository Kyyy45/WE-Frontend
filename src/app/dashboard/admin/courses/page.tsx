"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Course } from "@/types/course";
import { formatRupiah } from "@/lib/utils";

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
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Icons
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Loader2,
  BookOpen,
} from "lucide-react";

export default function CoursesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch Data
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/courses?t=${new Date().getTime()}`);
      const rawData = response.data;
      let finalData: Course[] = [];

      if (rawData?.data?.items && Array.isArray(rawData.data.items)) {
        finalData = rawData.data.items;
      } else if (rawData?.data && Array.isArray(rawData.data)) {
        finalData = rawData.data;
      } else if (Array.isArray(rawData)) {
        finalData = rawData;
      } else if (rawData?.courses && Array.isArray(rawData.courses)) {
        finalData = rawData.courses;
      }

      setCourses(finalData);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data kursus.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 2. Handle Delete
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/courses/${deleteId}`);
      toast.success("Kursus berhasil dihapus.");
      setCourses((prev) => prev.filter((c) => c.id !== deleteId));
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus kursus.");
    } finally {
      setDeleteId(null);
    }
  };

  const formatLevel = (level: string) => {
    const map: Record<string, string> = {
      bk_tk: "BK/TK",
      sd: "SD",
      smp: "SMP",
      sma: "SMA",
      umum: "Umum",
    };
    return map[level] || level.toUpperCase();
  };

  const filteredCourses = courses.filter((c) =>
    (c.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 p-8 pb-20">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manajemen Kursus
        </h1>
        <p className="text-muted-foreground mt-1">
          Kelola katalog kelas, materi, harga, dan profil tutor.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul kursus..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Link href="/dashboard/admin/courses/create">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Tambah Kursus
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-75">Kursus</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Harga</TableHead>
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
              ) : paginatedCourses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-8 h-8 opacity-20" />
                      <p>Tidak ada kursus ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCourses.map((course) => (
                  <TableRow key={course.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 bg-muted rounded overflow-hidden shrink-0 relative">
                          {course.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base text-primary font-bold line-clamp-1">
                            {course.title}
                          </span>
                          <div className="flex gap-2 text-xs">
                            <Badge
                              variant="secondary"
                              className="px-1 py-0 text-[10px] h-5"
                            >
                              {formatLevel(course.level)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {course.targetAudience || "-"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm font-medium">
                        {course.tutor?.name || "-"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {course.isFree ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Gratis
                        </Badge>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {formatRupiah(Number(course.price))}
                          </span>
                          {course.monthlyPrice && course.monthlyPrice > 0 && (
                            <span className="text-xs text-muted-foreground">
                              + {formatRupiah(Number(course.monthlyPrice))}/bln
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {course.createdAt
                        ? format(new Date(course.createdAt), "dd MMM yyyy", {
                            locale: idLocale,
                          })
                        : "-"}
                    </TableCell>
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
                              router.push(
                                `/dashboard/admin/courses/${course.id}`
                              )
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit Kursus
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(course.id)}
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

        {/* Pagination */}
        {!isLoading && filteredCourses.length > 0 && (
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

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kursus?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
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
