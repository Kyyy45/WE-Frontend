"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash, ArrowLeft, Save, Settings2 } from "lucide-react";

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
  FormDescription,
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

// Tipe untuk field di dalam Form Builder UI (ada properti _optionsString)
type FormBuilderField = {
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  // Properti UI: String opsi dipisah koma untuk input manual
  _optionsString?: string;
};

// Schema untuk React Hook Form (UI State)
type CreateFormSchema = {
  name: string;
  description?: string;
  status: "active" | "inactive";
  visibility: "public" | "authenticated";
  fields: FormBuilderField[];
};

// Helper: Convert string "Pria, Wanita" -> [{label: 'Pria', value: 'Pria'}, ...]
const stringToOptions = (str: string): FieldOption[] => {
  if (!str) return [];
  return str.split(",").map((s) => {
    const trimmed = s.trim();
    return { label: trimmed, value: trimmed };
  });
};

// Helper: Auto-Generate Key dari Label
const generateKey = (label: string) => {
  return label
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s(.)/g, (match) => match.toUpperCase().trim())
    .replace(/\s/g, "");
};

export default function CreateFormPage() {
  const router = useRouter();
  
  // 1. Setup Form dengan Schema UI
  const form = useForm<CreateFormSchema>({
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      visibility: "authenticated",
      fields: [
        { key: "fullName", label: "Nama Lengkap", type: "text", required: true, _optionsString: "" },
        { key: "email", label: "Alamat Email", type: "email", required: true, _optionsString: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  // 2. Watch fields untuk reactivity (misal: show/hide input options)
  const watchedFields = useWatch({
    control: form.control,
    name: "fields",
  });

  // 3. Mutation
  const { mutate: createForm, isPending } = useMutation({
    mutationFn: (data: CreateFormSchema) => {
      // Transform data UI ke format Backend (CreateFormRequest)
      const cleanFields = data.fields.map((field) => {
        // Ambil options dari _optionsString jika tipe select/radio
        let finalOptions = field.options || [];
        
        if (["select", "radio", "checkbox"].includes(field.type) && field._optionsString) {
          finalOptions = stringToOptions(field._optionsString);
        }

        return {
          key: field.key,
          label: field.label,
          // FIX: Cast ke FormFieldType agar tidak any
          type: field.type as FormFieldType, 
          required: field.required,
          placeholder: field.placeholder,
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
      router.push("/dashboard/admin/forms");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal membuat form. Periksa input Anda.");
    },
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/forms"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
           <h1 className="text-2xl font-bold font-jakarta">Form Builder</h1>
           <p className="text-sm text-muted-foreground">Desain formulir pendaftaran dinamis</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => createForm(data))} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* KOLOM KIRI: Form Settings */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Pengaturan Utama</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Nama form wajib diisi" }}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Formulir <span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input placeholder="Formulir Pendaftaran" {...field} /></FormControl>
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
                                <FormControl><Textarea placeholder="Instruksi pengisian..." className="h-24" {...field} /></FormControl>
                            </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4 pt-2">
                             <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
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
                                    <FormLabel>Akses</FormLabel>
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

            {/* KOLOM KANAN: Field Builder */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4" /> Struktur Pertanyaan
                    </h2>
                    <Button 
                        type="button" 
                        size="sm"
                        onClick={() => append({ key: `field_${Date.now()}`, label: "Pertanyaan Baru", type: "text", required: false, _optionsString: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Field
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => {
                      // Cek tipe input saat ini dari watchedFields
                      const currentType = watchedFields?.[index]?.type || "text";
                      const isOptionable = ["select", "radio", "checkbox"].includes(currentType);

                      return (
                      <Card key={field.id} className="relative group border-l-4 border-l-primary/20 hover:border-l-primary transition-colors">
                          <CardContent className="pt-6 grid gap-6">
                          
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* LABEL & KEY */}
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.label`}
                                      rules={{ required: true }}
                                      render={({ field }) => (
                                      <FormItem>
                                          <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Label Pertanyaan</FormLabel>
                                          <FormControl>
                                              <Input 
                                                  placeholder="Contoh: No WhatsApp" 
                                                  {...field} 
                                                  onChange={(e) => {
                                                      field.onChange(e);
                                                      // Auto-generate key jika key masih default/kosong
                                                      const currentKey = form.getValues(`fields.${index}.key`);
                                                      if (!currentKey || currentKey.startsWith("field_")) {
                                                          form.setValue(`fields.${index}.key`, generateKey(e.target.value));
                                                      }
                                                  }}
                                              />
                                          </FormControl>
                                      </FormItem>
                                      )}
                                  />
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.key`}
                                      rules={{ required: true, pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/ }}
                                      render={({ field }) => (
                                      <FormItem>
                                          <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Database Key (Unik)</FormLabel>
                                          <FormControl><Input className="font-mono text-sm bg-muted/50" {...field} /></FormControl>
                                          <FormMessage className="text-xs" />
                                      </FormItem>
                                      )}
                                  />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* TYPE SELECTOR */}
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.type`}
                                      render={({ field }) => (
                                      <FormItem className="md:col-span-1">
                                          <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Tipe Input</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                              <SelectContent>
                                                  <SelectItem value="text">Short Text</SelectItem>
                                                  <SelectItem value="textarea">Long Text</SelectItem>
                                                  <SelectItem value="number">Number</SelectItem>
                                                  <SelectItem value="email">Email</SelectItem>
                                                  <SelectItem value="phone">Phone</SelectItem>
                                                  <SelectItem value="date">Date</SelectItem>
                                                  <SelectItem value="select">Dropdown (Select)</SelectItem>
                                                  <SelectItem value="radio">Radio Button</SelectItem>
                                                  {/* <SelectItem value="checkbox">Checkbox</SelectItem> */} 
                                              </SelectContent>
                                          </Select>
                                      </FormItem>
                                      )}
                                  />

                                  {/* PLACEHOLDER */}
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.placeholder`}
                                      render={({ field }) => (
                                      <FormItem className="md:col-span-2">
                                          <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Placeholder (Opsional)</FormLabel>
                                          <FormControl><Input placeholder="Contoh: 0812xxx" {...field} /></FormControl>
                                      </FormItem>
                                      )}
                                  />
                              </div>

                              {/* SPECIAL INPUT: OPTIONS (Hanya muncul jika tipe select/radio) */}
                              {isOptionable && (
                                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                                      <FormField
                                          control={form.control}
                                          // Gunakan _optionsString yang menempel pada field
                                          name={`fields.${index}._optionsString`}
                                          render={({ field }) => (
                                          <FormItem>
                                              <FormLabel className="text-xs font-bold uppercase text-yellow-700">Pilihan Opsi</FormLabel>
                                              <FormControl>
                                                  <Input placeholder="Pisahkan dengan koma. Contoh: SD, SMP, SMA" {...field} />
                                              </FormControl>
                                              <FormDescription className="text-xs text-yellow-600">
                                                  Masukkan pilihan yang tersedia untuk user.
                                              </FormDescription>
                                          </FormItem>
                                          )}
                                      />
                                  </div>
                              )}

                              {/* TOGGLE REQUIRED & DELETE */}
                              <div className="flex items-center justify-between pt-2 border-t mt-2">
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.required`}
                                      render={({ field }) => (
                                      <FormItem className="flex items-center space-y-0 gap-2">
                                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                          <FormLabel className="font-medium cursor-pointer">Wajib Diisi</FormLabel>
                                      </FormItem>
                                      )}
                                  />

                                  <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => remove(index)}
                                  >
                                      <Trash className="h-4 w-4 mr-2" /> Hapus Pertanyaan
                                  </Button>
                              </div>

                          </CardContent>
                      </Card>
                      );
                    })}

                    {fields.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                            <p className="text-muted-foreground">Belum ada pertanyaan.</p>
                            <Button variant="link" onClick={() => append({ key: "nama", label: "Nama", type: "text", required: true, _optionsString: "" })}>
                                Tambah Field Pertama
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