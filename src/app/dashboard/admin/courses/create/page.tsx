"use client";

import { CourseForm } from "@/components/dashboard/admin/courses/course-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateCoursePage() {
  return (
    <div className="space-y-6 p-8 pb-20">
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className="w-fit pl-0 hover:pl-2 transition-all"
          asChild
        >
          <Link href="/dashboard/admin/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Buat Kursus Baru
          </h1>
          <p className="text-muted-foreground mt-1">
            Isi informasi dasar, materi, harga, dan profil tutor.
          </p>
        </div>
      </div>

      {/* Panggil Komponen Form Baru */}
      <CourseForm />
    </div>
  );
}
