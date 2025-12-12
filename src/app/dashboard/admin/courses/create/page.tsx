"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";

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

import { courseService } from "@/services/course.service";
import { ApiError } from "@/services/api";
import { courseSchema, CourseSchema } from "@/schemas/course.schema";

export default function CreateCoursePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "umum",
      isFree: false,
      price: 0,
    },
  });

  const isFree = useWatch({ control: form.control, name: "isFree" });

  const { mutate: createCourse, isPending } = useMutation({
    mutationFn: (data: CourseSchema) => courseService.createCourse(data),
    onSuccess: () => {
      toast.success("Kursus berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      router.push("/dashboard/admin/courses");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal membuat kursus");
    },
  });

  const onSubmit = (data: CourseSchema) => {
    const payload = {
      ...data,
      price: data.isFree ? 0 : Number(data.price),
    };
    createCourse(payload);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold font-jakarta">Buat Kursus Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kursus</CardTitle>
          <CardDescription>
            Thumbnail dapat diunggah setelah kursus berhasil dibuat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Kursus <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Belajar Matematika Dasar" {...field} />
                    </FormControl>
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
                      <Textarea 
                        placeholder="Tuliskan materi pembelajaran (Gunakan Enter untuk baris baru)" 
                        className="resize-none min-h-[150px]" // Lebih tinggi
                        {...field} 
                        value={field.value || ""} 
                      />
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
                      <FormLabel>Tingkat Pendidikan <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tingkat" />
                          </SelectTrigger>
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
                        <FormDescription>Aktifkan jika tanpa biaya.</FormDescription>
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
                      <FormLabel>Harga (Rp) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="text" // Ubah ke text agar bisa handle kosong dengan baik
                          inputMode="numeric"
                          placeholder="0" 
                          {...field}
                          value={field.value === 0 ? "" : field.value} // Tampilkan string kosong jika 0 agar user mudah mengetik
                          onChange={(e) => {
                            const val = e.target.value;
                            // Hanya terima angka
                            if (/^\d*$/.test(val)) {
                                field.onChange(val === "" ? 0 : Number(val));
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan nominal harga (Contoh: 50000).
                      </FormDescription>
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
                  Simpan Kursus
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}