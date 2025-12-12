"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash, ArrowLeft, Save, Settings2, FileText } from "lucide-react";

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
  // FormDescription, // HAPUS INI
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { formService } from "@/services/form.service";
import { UpdateFormRequest, FormFieldType } from "@/types/form";
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

type EditFormSchema = {
  name: string;
  description?: string;
  status: "active" | "inactive";
  visibility: "public" | "authenticated";
  fields: FormBuilderField[];
};

// Helper
const stringToOptions = (str: string): FieldOption[] => {
  if (!str) return [];
  return str.split(",").map((s) => {
    const trimmed = s.trim();
    return { label: trimmed, value: trimmed };
  });
};

const optionsToString = (options?: { label: string; value: string }[]) => {
  if (!options) return "";
  return options.map(o => o.label).join(", ");
};

export default function EditFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const formId = params.id as string;

  const { data: response, isLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formService.adminGetFormById(formId),
  });
  
  const existingForm = response?.data;

  const form = useForm<EditFormSchema>({
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      visibility: "authenticated",
      fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ // HAPUS 'replace'
    control: form.control,
    name: "fields",
  });

  const watchedFields = useWatch({ control: form.control, name: "fields" });

  useEffect(() => {
    if (existingForm) {
      form.reset({
        name: existingForm.name,
        description: existingForm.description,
        status: existingForm.status,
        visibility: existingForm.visibility,
        fields: existingForm.fields.map(f => ({
          key: f.key,
          label: f.label,
          type: f.type,
          required: f.required,
          placeholder: f.placeholder,
          helpText: f.helpText,
          options: f.options,
          _optionsString: optionsToString(f.options),
        }))
      });
    }
  }, [existingForm, form]);

  const { mutate: updateForm, isPending } = useMutation({
    mutationFn: (data: EditFormSchema) => {
      const cleanFields = data.fields.map((field) => {
        let finalOptions = field.options || [];
        if (["select", "radio", "checkbox"].includes(field.type) && field._optionsString) {
          finalOptions = stringToOptions(field._optionsString);
        }

        return {
          key: field.key,
          label: field.label,
          type: field.type as FormFieldType,
          required: field.required,
          placeholder: field.placeholder,
          helpText: field.helpText,
          options: finalOptions.length > 0 ? finalOptions : undefined,
        };
      });

      const payload: UpdateFormRequest = {
        name: data.name,
        description: data.description,
        status: data.status,
        visibility: data.visibility,
        fields: cleanFields,
      };
      
      return formService.adminUpdateForm(formId, payload);
    },
    onSuccess: () => {
      toast.success("Formulir berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["form", formId] });
      queryClient.invalidateQueries({ queryKey: ["admin-forms"] });
      router.push("/dashboard/admin/forms");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal mengupdate form.");
    },
  });

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!existingForm) return <div className="p-10 text-center">Form tidak ditemukan</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/admin/forms"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
            <h1 className="text-2xl font-bold font-jakarta">Edit Formulir</h1>
            <p className="text-sm text-muted-foreground">Ubah struktur dan pengaturan formulir.</p>
            </div>
        </div>
        
        <Button variant="secondary" asChild>
            <Link href={`/dashboard/admin/forms/${formId}/submissions`}>
                <FileText className="mr-2 h-4 w-4" /> Lihat Jawaban
            </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => updateForm(data))} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Pengaturan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Nama wajib diisi" }}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Formulir</FormLabel>
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
                                <FormControl><Textarea className="h-24" {...field} /></FormControl>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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

            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4" /> Pertanyaan
                    </h2>
                    <Button 
                        type="button" 
                        size="sm"
                        onClick={() => append({ key: `field_${Date.now()}`, label: "Baru", type: "text", required: false, _optionsString: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => {
                      const currentType = watchedFields?.[index]?.type || "text";
                      const isOptionable = ["select", "radio", "checkbox"].includes(currentType);

                      return (
                      <Card key={field.id} className="relative group border-l-4 border-l-blue-500/20 hover:border-l-blue-500 transition-colors">
                          <CardContent className="pt-6 grid gap-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.label`}
                                      rules={{ required: true }}
                                      render={({ field }) => (
                                      <FormItem>
                                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Label</FormLabel>
                                          <FormControl><Input {...field} /></FormControl>
                                      </FormItem>
                                      )}
                                  />
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.key`}
                                      rules={{ required: true }}
                                      render={({ field }) => (
                                      <FormItem>
                                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Key (Database)</FormLabel>
                                          <FormControl><Input className="font-mono bg-muted/50" {...field} /></FormControl>
                                      </FormItem>
                                      )}
                                  />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.type`}
                                      render={({ field }) => (
                                      <FormItem>
                                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Tipe</FormLabel>
                                          <Select onValueChange={field.onChange} value={field.value}>
                                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                              <SelectContent>
                                                  <SelectItem value="text">Short Text</SelectItem>
                                                  <SelectItem value="textarea">Long Text</SelectItem>
                                                  <SelectItem value="number">Number</SelectItem>
                                                  <SelectItem value="email">Email</SelectItem>
                                                  <SelectItem value="phone">Phone</SelectItem>
                                                  <SelectItem value="date">Date</SelectItem>
                                                  <SelectItem value="select">Dropdown</SelectItem>
                                                  <SelectItem value="radio">Radio</SelectItem>
                                              </SelectContent>
                                          </Select>
                                      </FormItem>
                                      )}
                                  />
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.placeholder`}
                                      render={({ field }) => (
                                      <FormItem className="md:col-span-2">
                                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Placeholder</FormLabel>
                                          <FormControl><Input {...field} /></FormControl>
                                      </FormItem>
                                      )}
                                  />
                              </div>

                              {isOptionable && (
                                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                                      <FormField
                                          control={form.control}
                                          name={`fields.${index}._optionsString`}
                                          render={({ field }) => (
                                          <FormItem>
                                              <FormLabel className="text-xs font-bold uppercase text-yellow-700">Pilihan (Pisah Koma)</FormLabel>
                                              <FormControl><Input {...field} /></FormControl>
                                          </FormItem>
                                          )}
                                      />
                                  </div>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t mt-2">
                                  <FormField
                                      control={form.control}
                                      name={`fields.${index}.required`}
                                      render={({ field }) => (
                                      <FormItem className="flex items-center space-y-0 gap-2">
                                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                          <FormLabel className="cursor-pointer">Wajib Diisi</FormLabel>
                                      </FormItem>
                                      )}
                                  />
                                  <Button 
                                      type="button" variant="ghost" size="sm" 
                                      className="text-red-500 hover:bg-red-50"
                                      onClick={() => remove(index)}
                                  >
                                      <Trash className="h-4 w-4 mr-2" /> Hapus
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                      );
                    })}
                </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50">
             <Button type="submit" size="lg" className="shadow-xl rounded-full px-8" disabled={isPending}>
               {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
               Simpan Perubahan
             </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}