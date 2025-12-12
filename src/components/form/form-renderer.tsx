"use client";

import { useForm, FieldValues } from "react-hook-form"; // Tambah FieldValues
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Import tipe definisi field
import { FormField } from "@/types/form"; 

interface FormRendererProps {
  fields: FormField[];
  onSubmit: (data: FieldValues) => void; // Ganti any jadi FieldValues
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function FormRenderer({ fields, onSubmit, isSubmitting, submitLabel = "Kirim" }: FormRendererProps) {
  // Hapus 'watch' yang tidak terpakai
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label className="text-base font-semibold">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          
          {field.helpText && <p className="text-sm text-muted-foreground -mt-1 mb-1">{field.helpText}</p>}

          {/* LOGIKA RENDER SESUAI TIPE */}
          {field.type === "textarea" ? (
             <Textarea 
               {...register(field.key, { required: field.required })}
               placeholder={field.placeholder}
               className="resize-none min-h-[100px]"
             />
          ) : field.type === "select" ? (
             // Tambahkan tipe (val: string)
             <Select onValueChange={(val: string) => setValue(field.key, val)}>
               <SelectTrigger>
                 <SelectValue placeholder="Pilih salah satu" />
               </SelectTrigger>
               <SelectContent>
                 {field.options?.map((opt) => (
                   <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
          ) : field.type === "radio" ? (
             // Tambahkan tipe (val: string)
             <RadioGroup onValueChange={(val: string) => setValue(field.key, val)} className="flex flex-col gap-2">
                {field.options?.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`${field.key}-${opt.value}`} />
                    <Label htmlFor={`${field.key}-${opt.value}`} className="font-normal cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
             </RadioGroup>
          ) : (
             <Input 
               type={field.type === "phone" ? "tel" : field.type} 
               {...register(field.key, { required: field.required })}
               placeholder={field.placeholder}
             />
          )}

          {errors[field.key] && (
            <p className="text-xs text-red-500 font-medium animate-pulse">
              Pertanyaan ini wajib diisi.
            </p>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full font-bold shadow-lg" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}