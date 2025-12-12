"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// HAPUS import Avatar dkk yang tidak dipakai

import { courseService } from "@/services/course.service";
import { ApiError } from "@/services/api";
import { updateCourseSchema, UpdateCourseSchema } from "@/schemas/course.schema";
import { Course } from "@/types/course";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  // 1. Fetch Course Detail
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseById(courseId),
  });

  // FIX: Ambil data dari response.data
  const course = response?.data;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // FIX: Cek course (bukan response)
  if (isError || !course) {
    return (
      <div className="flex flex-col items-center gap-4 pt-10">
        <p className="text-red-500">Gagal memuat data kursus.</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/courses">Kembali</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-jakarta">Edit Kursus</h1>
          <p className="text-sm text-muted-foreground">{course.title}</p>
        </div>
      </div>

      {/* 2. Thumbnail Section */}
      <Card>
        <CardHeader>
          <CardTitle>Thumbnail Kursus</CardTitle>
          <CardDescription>Gambar sampul untuk kursus ini (Rasio 16:9 disarankan).</CardDescription>
        </CardHeader>
        <CardContent>
          <ThumbnailUpload course={course} />
        </CardContent>
      </Card>

      {/* 3. Edit Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>Ubah detail informasi kursus.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditCourseForm course={course} />
        </CardContent>
      </Card>
    </div>
  );
}

// --- SUB-COMPONENT: THUMBNAIL UPLOAD ---
function ThumbnailUpload({ course }: { course: Course }) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) { // Max 5MB
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreview(objectUrl);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      await courseService.uploadThumbnail(course.id, file);
      toast.success("Thumbnail berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["course", course.id] });
      queryClient.invalidateQueries({ queryKey: ["courses"] }); // Refresh list juga
      setFile(null);
      setPreview(null);
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Gagal upload thumbnail";
        toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Preview Area - Aspect Ratio 16:9 */}
      <div className="relative w-full aspect-video rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
        {preview || course.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={preview || course.thumbnailUrl!} 
            alt="Thumbnail" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p>Belum ada thumbnail</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {file ? (
          <>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Simpan Thumbnail
            </Button>
            <Button variant="ghost" onClick={handleCancel} disabled={isUploading}>
              Batal
            </Button>
          </>
        ) : (
          <Button variant="outline" className="relative cursor-pointer" disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            Ganti Thumbnail
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
          </Button>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: EDIT FORM ---
function EditCourseForm({ course }: { course: Course }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<UpdateCourseSchema>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      title: course.title,
      description: course.description || "",
      level: course.level,
      isFree: course.isFree,
      price: course.price,
    },
  });

  const isFree = useWatch({ control: form.control, name: "isFree" });

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: (data: UpdateCourseSchema) => courseService.updateCourse(course.id, data),
    onSuccess: () => {
      toast.success("Data kursus berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["course", course.id] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      router.push("/dashboard/admin/courses");
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const onSubmit = (data: UpdateCourseSchema) => {
    const payload = {
      ...data,
      price: data.isFree ? 0 : Number(data.price),
    };
    updateCourse(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Kursus</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea className="resize-none min-h-[100px]" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tingkat Pendidikan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Pilih tingkat" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bk_paud">PAUD / TK</SelectItem>
                    <SelectItem value="sd">SD</SelectItem>
                    <SelectItem value="smp">SMP</SelectItem>
                    <SelectItem value="sma">SMA</SelectItem>
                    <SelectItem value="umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Kursus Gratis?</FormLabel>
                  <FormDescription>Aktifkan jika gratis.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) form.setValue("price", 0);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {!isFree && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga (Rp)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="ghost" type="button" asChild>
            <Link href="/dashboard/admin/courses">Batal</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Form>
  );
}