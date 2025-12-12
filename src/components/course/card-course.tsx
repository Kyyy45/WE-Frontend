"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/magicui/card";
import { Lens } from "@/components/magicui/lens";
import { Course } from "@/types/course";

interface CardCourseProps {
  course: Course;
  isLoggedIn: boolean;
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

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

export function CardCourse({ course, isLoggedIn }: CardCourseProps) {
  const router = useRouter();

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/courses/${course.id}/enroll`);
    } else {
      // Arahkan ke halaman konfirmasi/enrollment form
      router.push(`/courses/${course.id}/enroll`);
    }
  };

  return (
    <Card className="relative max-w-md shadow-none font-jakarta">
      <CardHeader>
        <Lens
          zoomFactor={2}
          lensSize={150}
          isStatic={false}
          ariaLabel="Zoom Area"
        >
          {course.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              width={500}
              height={500}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-primary/5 text-primary/30">
              <BookOpen className="h-12 w-12" />
            </div>
          )}
        </Lens>

        {course.isFree && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <Badge className="bg-primary text-primary-foreground shadow-md backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-white/20">
              Gratis
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <CardTitle className="text-2xl">{course.title}</CardTitle>
        <CardDescription className="whitespace-pre-line">
          {course.description || "Tidak ada deskripsi singkat."}
        </CardDescription>
        <div className="mt-auto pt-3">
          <Separator className="mb-3 w-12 bg-primary/30 h-0.5 rounded-full" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Biaya Pendaftaran
              </span>
              <span className="text-lg font-extrabold text-primary">
                {course.isFree ? "Rp 0" : formatRupiah(course.price)}
              </span>
            </div>

            <Badge
              variant="outline"
              className="text-[10px] font-semibold px-2 py-0.5 border-primary/30 text-foreground bg-primary/5"
            >
              {formatLevel(course.level)}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="space-x-4">
        <Button onClick={handleRegisterClick}>Daftar Sekarang</Button>
        <Button variant="secondary" asChild>
          <Link href={`/courses/${course.id}`}>Detail</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
