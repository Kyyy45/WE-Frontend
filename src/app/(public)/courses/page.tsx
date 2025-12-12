"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, BookOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { courseService } from "@/services/course.service";
import { CourseLevel } from "@/types/course";

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

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<CourseLevel | "all">("all");

  // Fetch Data Public
  const { data: response, isLoading } = useQuery({
    queryKey: ["public-courses", page, search, level],
    queryFn: () =>
      courseService.getCourses({
        page,
        limit: 9, // Tampilkan 9 item per halaman (Grid 3x3)
        search,
        level: level === "all" ? undefined : level,
      }),
  });

  const courseList = response?.data;

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-jakarta mb-2">Katalog Kursus</h1>
          <p className="text-muted-foreground">
            Temukan materi pembelajaran terbaik untuk masa depanmu.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari topik..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={level}
            onValueChange={(val) => {
              setLevel(val as CourseLevel | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Semua Tingkat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tingkat</SelectItem>
              <SelectItem value="bk_paud">PAUD / TK</SelectItem>
              <SelectItem value="sd">SD</SelectItem>
              <SelectItem value="smp">SMP</SelectItem>
              <SelectItem value="sma">SMA</SelectItem>
              <SelectItem value="umum">Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !courseList?.items || courseList.items.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold">Tidak ada kursus ditemukan</h3>
          <p className="text-muted-foreground">
            Coba ubah kata kunci pencarian atau filter level.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseList.items.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                {course.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={course.isFree ? "default" : "secondary"} className={course.isFree ? "bg-green-500 hover:bg-green-600" : ""}>
                    {course.isFree ? "Gratis" : "Premium"}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <CardHeader className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                        {formatLevel(course.level)}
                    </Badge>
                </div>
                <Link href={`/courses/${course.id}`} className="hover:underline">
                    <h3 className="font-bold text-lg line-clamp-2 min-h-14">
                    {course.title}
                    </h3>
                </Link>
              </CardHeader>

              <CardContent className="p-4 pt-0 grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description || "Tidak ada deskripsi singkat."}
                </p>
              </CardContent>

              <CardFooter className="p-4 border-t flex items-center justify-between">
                <div className="text-lg font-bold text-primary">
                  {course.isFree ? "Rp 0" : formatRupiah(course.price)}
                </div>
                <Button asChild size="sm">
                  <Link href={`/courses/${course.id}`}>Lihat Detail</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {courseList && courseList.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm font-medium">
            Hal {page} dari {courseList.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= courseList.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}