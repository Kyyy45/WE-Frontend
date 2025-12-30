"use client";

import Image from "next/image";
import Link from "next/link";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { IconArrowRight, IconChartBar, IconUsers } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

// Helper untuk label level
const getLevelLabel = (level: string) => {
  const map: Record<string, string> = {
    bk_tk: "BK & TK",
    sd: "SD",
    smp: "SMP",
    sma: "SMA",
    umum: "Umum",
  };
  return map[level] || level;
};

// Helper warna pastel
const getLevelColor = (level: string) => {
  switch (level) {
    case "bk_tk":
      return "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200";
    case "sd":
      return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
    case "smp":
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
    case "sma":
      return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
    case "umum":
      return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group relative flex flex-col rounded-[2.5rem] border border-border bg-card p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 h-full">
      {/* Image Area */}
      <div className="relative aspect-video w-full overflow-hidden rounded-[1.8rem] bg-muted shadow-inner">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground text-xs font-medium">
            No Preview
          </div>
        )}

        {/* Badge Level di Pojok Gambar */}
        <div className="absolute top-4 right-4">
          <Badge
            className={`uppercase text-[10px] font-bold shadow-sm ${getLevelColor(
              course.level
            )}`}
          >
            {getLevelLabel(course.level)}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 px-3 py-6">
        {/* Meta Info: Level & Target Audience */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <IconChartBar size={14} className="text-primary" />
            <span>{getLevelLabel(course.level)}</span>
          </div>
          {/* Target Audience (Umur) - BARU */}
          {course.targetAudience && (
            <>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <IconUsers size={14} className="text-primary" />
                <span
                  className="line-clamp-1 max-w-25"
                  title={course.targetAudience}
                >
                  {course.targetAudience}
                </span>
              </div>
            </>
          )}
        </div>

        <h3
          className="mb-6 text-xl md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2"
          title={course.title}
        >
          {course.title}
        </h3>

        {/* Footer Card */}
        <div className="mt-auto flex items-end justify-between pt-6 border-t border-border/50">
          <div>
            <span className="block text-[10px] font-bold uppercase text-muted-foreground opacity-60">
              Investasi
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black text-foreground">
                {course.isFree ? "GRATIS" : formatRupiah(course.price)}
              </span>
              {/* Tampilkan SPP kecil jika ada */}
              {!course.isFree &&
                course.monthlyPrice &&
                course.monthlyPrice > 0 && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    + Biaya SPP {formatRupiah(course.monthlyPrice)}/bln
                  </span>
                )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-primary/20 hover:bg-primary hover:text-primary-foreground group transition-all px-6 h-10"
            asChild
          >
            <Link href={`/courses/${course.id}`}>
              Detail
              <IconArrowRight
                size={16}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Button>
        </div>
      </div>

      {/* Animasi Border Beam */}
      <BorderBeam
        duration={10}
        size={350}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        colorFrom="var(--primary)"
        colorTo="var(--accent)"
      />
    </div>
  );
}
