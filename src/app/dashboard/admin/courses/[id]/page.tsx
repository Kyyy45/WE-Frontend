"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { Course } from "@/types/course";
import { CourseForm } from "@/components/dashboard/admin/courses/course-form";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        // GET /courses/:id
        const response = await api.get(`/courses/${courseId}`);
        const data = response.data.data || response.data; // Handle wrapper
        setCourse(data);
      } catch (err) {
        console.error("Gagal load kursus:", err);
        setError(
          "Gagal memuat data kursus. Pastikan ID benar atau koneksi aman."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Data tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Edit Kursus
        </h1>
        <p className="text-muted-foreground mt-1">
          Ubah informasi detail, materi, biaya, dan tutor kursus{" "}
          <strong>{course.title}</strong>
        </p>
      </div>

      <CourseForm initialData={course} />
    </div>
  );
}
