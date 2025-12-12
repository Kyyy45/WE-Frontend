"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/course";
import { ApiError } from "@/services/api";
import { toast } from "sonner";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, MoreHorizontal, Search, Trash, Edit, Plus, ImageOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper format Rupiah
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Helper format Level
const formatLevel = (level: string) => {
  const map: Record<string, string> = {
    bk_paud: "PAUD / TK",
    sd: "SD",
    smp: "SMP",
    sma: "SMA",
    umum: "Umum",
  };
  return map[level] || level;
};

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // 1. Fetch Courses
  const { data: response, isLoading } = useQuery({
    queryKey: ["courses", page, search],
    queryFn: () => courseService.getCourses({ page, limit: 10, search }),
  });
  
  const courseList = response?.data;

  // 2. Mutation Delete
  const { mutate: deleteCourse, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      toast.success("Kursus berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setDeletingCourse(null);
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal menghapus kursus");
      setDeletingCourse(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-jakarta">Manajemen Kursus</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kursus..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/admin/courses/create">
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Link>
          </Button>
        </div>
      </div>

      {/* Table Data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Cover</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : !courseList?.items || courseList.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Tidak ada data kursus.
                </TableCell>
              </TableRow>
            ) : (
              courseList.items.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Avatar className="h-10 w-16 rounded-md">
                      <AvatarImage src={course.thumbnailUrl || ""} className="object-cover" />
                      <AvatarFallback className="rounded-md">
                        <ImageOff className="h-4 w-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{course.title}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {course.slug}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatLevel(course.level)}</Badge>
                  </TableCell>
                  <TableCell>
                    {course.isFree ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Gratis</Badge>
                    ) : (
                      <span className="font-medium">{formatRupiah(course.price)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/admin/courses/${course.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingCourse(course)} 
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

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => setPage((p) => Math.max(1, p - 1))} 
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setPage((p) => p + 1)} 
          disabled={!courseList || page >= courseList.totalPages || isLoading}
        >
          Next
        </Button>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingCourse} onOpenChange={(open) => !open && setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kursus?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus kursus <strong>{deletingCourse?.title}</strong>? 
              <br />
              Tindakan ini permanen dan akan menghapus semua data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deletingCourse) deleteCourse(deletingCourse.id);
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