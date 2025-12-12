"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash, ArrowLeft, Save, Settings2, Type } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { formService } from "@/services/form.service";
import { CreateFormRequest, FormFieldType } from "@/types/form";
import { ApiError } from "@/services/api";

// --- TYPES ---

type FieldOption = {
  label: string;
  value: string;
};

type FormBuilderField = {
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  _optionsString?: string;
};

type CreateFormSchema = {
  name: string;
  description?: string;
  status: "active" | "inactive";
  visibility: "public" | "authenticated";
  fields: FormBuilderField[];
};

const stringToOptions = (str: string): FieldOption[] => {
  if (!str) return [];
  return str.split(",").map((s) => {
    const trimmed = s.trim();
    return { label: trimmed, value: trimmed };
  });
};

const generateKey = (label: string) => {
  return label
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s(.)/g, (match) => match.toUpperCase().trim())
    .replace(/\s/g, "");
};

// Key untuk LocalStorage
const STORAGE_KEY = "we-form-builder-draft";

export default function CreateFormPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const form = useForm<CreateFormSchema>({
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      visibility: "authenticated",
      fields: [
        // Default awal
        { key: "header_student", label: "Identitas Siswa", type: "header", required: false, _optionsString: "" },
        { key: "fullName", label: "Nama Lengkap", type: "text", required: true, _optionsString: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const watchedValues = useWatch({ control: form.control });

  // 1. Handle Hydration & Load Draft (Hanya sekali saat mount)
  useEffect(() => {
    setIsLoaded(true);
    
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Reset form dengan data draft
        form.reset(parsed);
        toast.info("Draft formulir dipulihkan.");
      } catch (e) {
        console.error("Gagal load draft", e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array agar jalan sekali saja

  // 2. Save Draft (Setiap ada perubahan pada watchedValues)
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedValues));
      }, 1000); // Debounce 1 detik
      return () => clearTimeout(timer);
    }
  }, [watchedValues, isLoaded]);

  const { mutate: createForm, isPending } = useMutation({
    mutationFn: (data: CreateFormSchema) => {
      const cleanFields = data.fields.map((field) => {
        let finalOptions = field.options || [];
        if (["select", "radio", "checkbox"].includes(field.type) && field._optionsString) {
          finalOptions = stringToOptions(field._optionsString);
        }

        // Pastikan placeholder null jika header atau tipe tertentu
        let finalPlaceholder = field.placeholder;
        if (["header", "date", "radio", "checkbox"].includes(field.type)) {
            finalPlaceholder = undefined;
        }

        return {
          key: field.key,
          label: field.label,
          // Casting ke FormFieldType, tapi izinkan string 'header' sementara
          // Backend harus diupdate untuk menerima 'header' di validatornya
          type: field.type as FormFieldType, 
          required: field.type === 'header' ? false : field.required, 
          placeholder: finalPlaceholder,
          helpText: field.helpText,
          options: finalOptions.length > 0 ? finalOptions : undefined,
        };
      });

      const payload: CreateFormRequest = {
        name: data.name,
        description: data.description,
        status: data.status,
        visibility: data.visibility,
        fields: cleanFields,
      };
      
      return formService.adminCreateForm(payload);
    },
    onSuccess: () => {
      toast.success("Formulir berhasil dibuat!");
      localStorage.removeItem(STORAGE_KEY);
      router.push("/dashboard/admin/forms");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal membuat form.");
    },
  });

  if (!isLoaded) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/forms"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold font-jakarta text-foreground">Form Builder</h1>
           <p className="text-sm text-muted-foreground">Desain formulir pendaftaran dinamis</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => createForm(data))} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* KIRI: PENGATURAN */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-border bg-card sticky top-6">
                    <CardHeader>
                        <CardTitle className="text-lg text-foreground">Pengaturan Utama</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Nama form wajib diisi" }}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">Nama Formulir <span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input placeholder="Formulir Pendaftaran" {...field} value={field.value ?? ""} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">Deskripsi</FormLabel>
                                <FormControl><Textarea placeholder="Instruksi..." className="h-24" {...field} value={field.value ?? ""} /></FormControl>
                            </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4 pt-2">
                             <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Non-Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Akses</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">Publik</SelectItem>
                                            <SelectItem value="authenticated">User Login</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* KANAN: BUILDER AREA */}
            <div className="lg:col-span-2 space-y-4">
                {/* TOOLBAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/30 p-4 rounded-lg border border-border gap-4 sticky top-6 z-10 backdrop-blur-md">
                    <h2 className="font-semibold flex items-center gap-2 text-foreground">
                        <Settings2 className="h-4 w-4" /> Struktur Form
                    </h2>
                    <div className="flex gap-2">
                        <Button 
                            type="button" variant="secondary" size="sm"
                            onClick={() => append({ key: `section_${Date.now()}`, label: "Judul Bagian Baru", type: "header", required: false, _optionsString: "" })}
                        >
                            <Type className="mr-2 h-4 w-4" /> Tambah Header
                        </Button>
                        <Button 
                            type="button" size="sm"
                            onClick={() => append({ key: `field_${Date.now()}`, label: "Pertanyaan Baru", type: "text", required: false, _optionsString: "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Field
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => {
                      const currentType = watchedValues.fields?.[index]?.type || "text";
                      const isOptionable = ["select", "radio", "checkbox"].includes(currentType);
                      const isHeader = currentType === "header";
                      const showPlaceholder = !["header", "date", "radio", "checkbox", "select"].includes(currentType);

                      return (
                      <Card 
                        key={field.id} 
                        className={`relative group border transition-all duration-200 
                            ${isHeader 
                                ? "border-primary bg-primary/5 shadow-md mt-8" 
                                : "border-border hover:border-primary/50 ml-0 sm:ml-4" // Indentasi field biasa
                            }`}
                      >
                          <CardContent className="pt-6 grid gap-6">
                          
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                  {/* LABEL (Full width jika header) */}
                                  <div className={isHeader ? "md:col-span-12" : "md:col-span-6"}>
                                      <FormField
                                          control={form.control}
                                          name={`fields.${index}.label`}
                                          rules={{ required: true }}
                                          render={({ field }) => (
                                          <FormItem>
                                              <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                                {isHeader ? "Judul Bagian (Header)" : "Label Pertanyaan"}
                                              </FormLabel>
                                              <FormControl>
                                                  <Input 
                                                      placeholder={isHeader ? "Contoh: Data Orang Tua" : "Pertanyaan..."} 
                                                      className={isHeader ? "font-bold text-lg h-12" : ""}
                                                      {...field} 
                                                      value={field.value ?? ""} 
                                                      onChange={(e) => {
                                                          field.onChange(e);
                                                          // Auto-generate key hanya untuk field biasa
                                                          if (!isHeader) {
                                                              const currentKey = form.getValues(`fields.${index}.key`);
                                                              if (!currentKey || currentKey.startsWith("field_")) {
                                                                  form.setValue(`fields.${index}.key`, generateKey(e.target.value));
                                                              }
                                                          }
                                                      }}
                                                  />
                                              </FormControl>
                                          </FormItem>
                                          )}
                                      />
                                  </div>
                                  
                                  {/* KEY & TYPE (Hanya untuk field biasa) */}
                                  {!isHeader && (
                                    <>
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`fields.${index}.key`}
                                                rules={{ required: true, pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/ }}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Database Key</FormLabel>
                                                    <FormControl><Input className="font-mono text-xs bg-muted/50" {...field} value={field.value ?? ""} /></FormControl>
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`fields.${index}.type`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Tipe Input</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="header" className="font-bold border-b">-- Header --</SelectItem>
                                                            <SelectItem value="text">Teks Singkat</SelectItem>
                                                            <SelectItem value="textarea">Teks Panjang</SelectItem>
                                                            <SelectItem value="number">Angka</SelectItem>
                                                            <SelectItem value="email">Email</SelectItem>
                                                            <SelectItem value="phone">No Telepon</SelectItem>
                                                            <SelectItem value="date">Tanggal</SelectItem>
                                                            <SelectItem value="select">Dropdown</SelectItem>
                                                            <SelectItem value="radio">Radio Button</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                  )}
                              </div>

                              {/* CONFIG LANJUTAN (Hanya untuk field biasa) */}
                              {!isHeader && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {showPlaceholder && (
                                    <FormField
                                        control={form.control}
                                        name={`fields.${index}.placeholder`}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Placeholder</FormLabel>
                                            <FormControl><Input placeholder="Contoh: Masukkan nama..." {...field} value={field.value ?? ""} /></FormControl>
                                        </FormItem>
                                        )}
                                    />
                                    )}

                                    {isOptionable && (
                                    <div className={showPlaceholder ? "" : "md:col-span-2"}>
                                        <FormField
                                            control={form.control}
                                            name={`fields.${index}._optionsString`}
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase text-yellow-600 dark:text-yellow-500">Opsi (Pisahkan Koma)</FormLabel>
                                                <FormControl>
                                                    <Input className="border-yellow-200 focus-visible:ring-yellow-500" placeholder="Pria, Wanita" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    )}
                                </div>
                              )}

                              {/* FOOTER: REQUIRED SWITCH & DELETE */}
                              <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                                  {!isHeader ? (
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.required`}
                                      render={({ field }) => (
                                      <FormItem className="flex items-center space-y-0 gap-2">
                                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                          <FormLabel className="font-medium cursor-pointer text-foreground">Wajib Diisi</FormLabel>
                                      </FormItem>
                                      )}
                                  />
                                  ) : (
                                    <div className="text-xs text-muted-foreground italic">Header bagian form</div>
                                  )}

                                  <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto"
                                      onClick={() => remove(index)}
                                  >
                                      <Trash className="h-4 w-4 mr-2" /> Hapus
                                  </Button>
                              </div>

                          </CardContent>
                      </Card>
                      );
                    })}

                    {fields.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/10">
                            <p className="text-muted-foreground">Belum ada pertanyaan.</p>
                            <Button variant="link" onClick={() => append({ key: "header_1", label: "Identitas Diri", type: "header", required: false, _optionsString: "" })}>
                                Mulai Buat Form
                            </Button>
                        </div>
                    )}
                </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 md:right-10 z-50">
             <Button type="submit" size="lg" className="shadow-xl rounded-full px-8" disabled={isPending}>
               {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
               Simpan Formulir
             </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}