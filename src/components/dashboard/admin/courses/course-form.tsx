"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Course } from "@/types/course";
import { Form as FormType } from "@/types/form";

// IMPORT DARI LIB VALIDATIONS
import { courseSchema, CourseFormValues } from "@/lib/validations";

// --- UI COMPONENTS ---
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Icons
import { Loader2, Image as ImageIcon, Plus, Trash2, User } from "lucide-react";

interface CourseFormProps {
  initialData?: Course;
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableForms, setAvailableForms] = useState<FormType[]>([]);

  // State File Upload
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnailUrl || null
  );

  const [tutorFile, setTutorFile] = useState<File | null>(null);
  const [tutorPreview, setTutorPreview] = useState<string | null>(
    initialData?.tutor?.imageUrl || null
  );

  // 1. Setup Form
  const form = useForm<CourseFormValues>({
    // Gunakan Tipe yang diimport
    // Gunakan Schema yang diimport
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      level: (initialData?.level as any) || "umum",
      isFree: initialData?.isFree ?? false,
      price: initialData?.price ?? 0,
      monthlyPrice: initialData?.monthlyPrice ?? 0,
      targetAudience: initialData?.targetAudience || "",

      registrationForm:
        typeof initialData?.registrationForm === "object"
          ? initialData.registrationForm.id
          : (initialData?.registrationForm as string) || "none",

      // Transform array string ["A", "B"] => [{value: "A"}, {value: "B"}]
      benefits: initialData?.benefits?.map((b) => ({ value: b })) || [],
      syllabus: initialData?.syllabus?.map((s) => ({ value: s })) || [],

      tutorName: initialData?.tutor?.name || "",
      tutorTitle: initialData?.tutor?.title || "",
      tutorBio: initialData?.tutor?.biography || "",
    },
  });

  // Setup Dynamic Arrays
  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control: form.control,
    name: "benefits",
  });

  const {
    fields: syllabusFields,
    append: appendSyllabus,
    remove: removeSyllabus,
  } = useFieldArray({
    control: form.control,
    name: "syllabus",
  });

  const isFree = form.watch("isFree");

  // Reset harga jika gratis
  useEffect(() => {
    if (isFree) {
      form.setValue("price", 0);
      form.setValue("monthlyPrice", 0);
    }
  }, [isFree, form]);

  // Fetch Forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await api.get("/forms?limit=100");
        const rawData = res.data;
        if (rawData?.data?.items) setAvailableForms(rawData.data.items);
        else if (rawData?.data) setAvailableForms(rawData.data);
        else if (Array.isArray(rawData)) setAvailableForms(rawData);
      } catch (error) {
        console.error("Gagal load forms", error);
      }
    };
    fetchForms();
  }, []);

  // File Handlers
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleTutorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTutorFile(file);
      setTutorPreview(URL.createObjectURL(file));
    }
  };

  // Submit Logic
  const onSubmit = async (values: CourseFormValues) => {
    // Gunakan Tipe yang diimport
    try {
      setIsLoading(true);

      // Transform kembali ke format backend
      const payload = {
        title: values.title,
        description: values.description,
        level: values.level,
        isFree: values.isFree,
        price: values.price,
        monthlyPrice: values.monthlyPrice,
        targetAudience: values.targetAudience,
        registrationForm:
          values.registrationForm === "none"
            ? undefined
            : values.registrationForm,

        // Transform [{value: "A"}] => ["A"]
        benefits: values.benefits?.map((b) => b.value).filter(Boolean) || [],
        syllabus: values.syllabus?.map((s) => s.value).filter(Boolean) || [],

        tutor: {
          name: values.tutorName,
          title: values.tutorTitle,
          biography: values.tutorBio,
        },
      };

      let courseId = initialData?.id;

      // STEP 1: Simpan Data Teks
      if (initialData) {
        await api.patch(`/courses/${courseId}`, payload);
        toast.info("Data kursus diperbarui, memproses media...");
      } else {
        const res = await api.post("/courses", payload);
        const newCourse = res.data.data || res.data;
        courseId = newCourse.id || newCourse._id;
        toast.success("Draft kursus dibuat!");
      }

      // STEP 2: Upload Thumbnail (Jika ada)
      if (thumbnailFile && courseId) {
        const formData = new FormData();
        formData.append("thumbnail", thumbnailFile);
        await api.patch(`/courses/${courseId}/thumbnail`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // STEP 3: Upload Tutor Image (Jika ada)
      if (tutorFile && courseId) {
        const formData = new FormData();
        formData.append("tutorImage", tutorFile);
        await api.patch(`/courses/${courseId}/tutor-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Berhasil disimpan!");
      router.push("/dashboard/admin/courses");
      router.refresh();
    } catch (error) {
      console.error(error);
      let msg = "Terjadi kesalahan.";
      if (typeof error === "object" && error !== null && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        msg = (error as any).response?.data?.message || msg;
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === KOLOM KIRI (Info Utama) === */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. INFORMASI DASAR */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Kursus</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Matematika Dasar SD"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bk_tk">BK/TK</SelectItem>
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
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Peserta (Umur/Kelas)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Misal: 7-12 Tahun"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Lengkap</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan detail kursus..."
                          className="h-32"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 2. KURIKULUM & BENEFIT (Dynamic Lists) */}
            <Card>
              <CardHeader>
                <CardTitle>Materi & Benefit</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {/* Benefits */}
                <div className="space-y-3">
                  <FormLabel>Benefit (Keuntungan)</FormLabel>
                  <div className="space-y-2">
                    {benefitFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          {...form.register(`benefits.${index}.value`)}
                          placeholder="Contoh: Sertifikat"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeBenefit(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendBenefit({ value: "" })}
                    className="w-full border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Benefit
                  </Button>
                </div>

                {/* Syllabus */}
                <div className="space-y-3">
                  <FormLabel>Materi (Silabus)</FormLabel>
                  <div className="space-y-2">
                    {syllabusFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          {...form.register(`syllabus.${index}.value`)}
                          placeholder="Bab 1: Pendahuluan"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeSyllabus(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendSyllabus({ value: "" })}
                    className="w-full border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Materi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 3. DATA TUTOR */}
            <Card>
              <CardHeader>
                <CardTitle>Profil Pengajar (Tutor)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Upload Foto Tutor */}
                  <div className="shrink-0">
                    <Label className="mb-2 block text-sm font-medium">
                      Foto Tutor (Format 4:5)
                    </Label>
                    <div className="relative w-32 h-40 border-2 border-dashed rounded-xl overflow-hidden hover:bg-muted/50 cursor-pointer flex items-center justify-center bg-muted transition-colors">
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                        onChange={handleTutorImageChange}
                      />
                      {tutorPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tutorPreview}
                          alt="Tutor"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-2">
                      Klik / Drag Foto
                    </p>
                  </div>

                  {/* Text Input Tutor */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tutorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nama Tutor"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tutorTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gelar / Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contoh: S.Pd, M.Sc"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="tutorBio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio Singkat</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Pengalaman mengajar..."
                              className="h-20 resize-none"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* === KOLOM KANAN (Settings & Media) === */}
          <div className="space-y-6">
            {/* 4. PENGATURAN & HARGA */}
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Kursus Gratis?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                {!isFree && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Uang Pangkal (Rp)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SPP Bulanan (Rp)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>Opsional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <Separator />

                <FormField
                  control={form.control}
                  name="registrationForm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formulir Pendaftaran</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih form..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            - Tidak Ada Form -
                          </SelectItem>
                          {availableForms.map((f) => (
                            <SelectItem key={f.id} value={f.id as string}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 5. THUMBNAIL */}
            <Card>
              <CardContent className="pt-6">
                <Label className="mb-4 block">Thumbnail Kursus</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden aspect-video bg-muted">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleThumbnailChange}
                  />
                  {thumbnailPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-xs">Upload Image</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Menyimpan...
                  </>
                ) : initialData ? (
                  "Simpan Perubahan"
                ) : (
                  "Buat Kursus"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
