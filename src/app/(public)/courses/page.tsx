"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Lightbulb, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CardCourse } from "@/components/course/card-course";
import { courseService } from "@/services/course.service";
import { userService } from "@/services/user.service";
import { CourseLevel } from "@/types/course";

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<CourseLevel | "all">("all");

  const { data: userProfile } = useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getMe(),
    retry: false,
  });
  const isLoggedIn = !!userProfile;

  const { data: response, isLoading } = useQuery({
    queryKey: ["public-courses", page, search, level],
    queryFn: () =>
      courseService.getCourses({
        page,
        limit: 9,
        search,
        level: level === "all" ? undefined : level,
      }),
  });

  const courseList = response?.data;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 selection:text-primary-foreground">
      
      {/* SECTION HERO: KUNING GLOWING */}
      <section className="relative py-24 px-4 overflow-hidden bg-linear-to-b from-primary/5 via-background to-background">
        {/* Background Blobs (Efek Lampu) */}
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-60 animate-pulse" />
        
        <div className="container mx-auto max-w-5xl text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-bold text-sm mb-6 shadow-lg shadow-primary/20">
              <Lightbulb className="h-4 w-4 fill-primary-foreground" /> Nyalakan Potensimu
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              Belajar Seru, <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-500">Masa Depan Cerah</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Platform pembelajaran interaktif dengan materi berkualitas. Pilih kelasmu dan mulai petualangan baru hari ini.
            </p>
          </motion.div>

          {/* SEARCH & FILTER */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto p-2 bg-background/80 backdrop-blur-xl rounded-2xl border-2 border-primary/20 shadow-xl shadow-primary/5"
          >
            <div className="relative w-full grow group">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Cari topik pembelajaran..."
                className="pl-12 h-12 border-0 shadow-none bg-transparent focus-visible:ring-0 text-lg"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="h-8 w-0.5 bg-border hidden sm:block" />
            <Select
              value={level}
              onValueChange={(val) => { setLevel(val as CourseLevel | "all"); setPage(1); }}
            >
              <SelectTrigger className="w-full sm:w-[200px] h-12 border-0 shadow-none focus:ring-0 bg-transparent text-lg font-medium hover:bg-primary/5">
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
          </motion.div>
        </div>
      </section>

      {/* SECTION LISTING */}
      <section className="py-20 px-4 bg-muted/20 relative">
        <div className="container mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-primary fill-primary/20" />
              Katalog Kelas
            </h2>
            <Badge variant="outline" className="text-sm font-bold px-4 py-1.5 border-primary/30 text-primary bg-primary/5">
              Total: {courseList?.total || 0} Kelas
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-70">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
              <p className="text-lg font-bold text-primary">Sedang memuat katalog...</p>
            </div>
          ) : !courseList?.items || courseList.items.length === 0 ? (
            <div className="text-center py-32 bg-background rounded-3xl border-4 border-dashed border-primary/10">
              <BookOpen className="h-20 w-20 mx-auto text-muted-foreground/20 mb-6" />
              <h3 className="text-xl font-bold text-foreground">Yah, kelas tidak ditemukan!</h3>
              <p className="text-muted-foreground mt-2">Coba ganti kata kunci pencarianmu.</p>
              <Button onClick={() => { setSearch(""); setLevel("all"); }} className="mt-6 font-bold" variant="outline">
                Reset Filter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
              {courseList.items.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <CardCourse 
                    course={course} 
                    isLoggedIn={isLoggedIn} 
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {courseList && courseList.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-20">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="w-32 hover:border-primary hover:text-primary"
              >
                ← Sebelumnya
              </Button>
              <div className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg min-w-12 text-center shadow-lg shadow-primary/20">
                {page}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= courseList.totalPages || isLoading}
                className="w-32 hover:border-primary hover:text-primary"
              >
                Selanjutnya →
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}