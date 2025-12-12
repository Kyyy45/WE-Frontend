"use client";

import { useForm, FieldValues } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { FormField } from "@/types/form"; 

interface FormRendererProps {
  fields: FormField[];
  onSubmit: (data: FieldValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function FormRenderer({ fields, onSubmit, isSubmitting, submitLabel = "Kirim" }: FormRendererProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field) => {
        // Tampilkan Header Section
        // Gunakan pengecekan string biasa untuk menghindari 'any' dan memaksa tipe
        if (field.type === "header" as string) { 
            return (
                <div key={field.key} className="pt-6 pb-2">
                    <h3 className="text-xl font-bold text-foreground font-jakarta">{field.label}</h3>
                    <Separator className="mt-2" />
                </div>
            );
        }

        return (
        <div key={field.key} className="space-y-2">
          <Label className="text-base font-semibold text-foreground">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          
          {field.helpText && <p className="text-sm text-muted-foreground -mt-1 mb-1">{field.helpText}</p>}

          {/* RENDER LOGIC */}
          {field.type === "textarea" ? (
             <Textarea 
               {...register(field.key, { required: field.required })}
               placeholder={field.placeholder}
               className="resize-none min-h-[100px] bg-background text-foreground"
             />
          ) : field.type === "select" ? (
             <Select onValueChange={(val: string) => setValue(field.key, val)}>
               <SelectTrigger className="bg-background text-foreground">
                 <SelectValue placeholder="Pilih salah satu" />
               </SelectTrigger>
               <SelectContent>
                 {field.options?.map((opt) => (
                   <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
          ) : field.type === "radio" ? (
             <RadioGroup onValueChange={(val: string) => setValue(field.key, val)} className="flex flex-col gap-2">
                {field.options?.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`${field.key}-${opt.value}`} />
                    <Label htmlFor={`${field.key}-${opt.value}`} className="font-normal cursor-pointer text-foreground">
                      {opt.label}
                    </Label>
                  </div>
                ))}
             </RadioGroup>
          ) : (
             <Input 
               // Handle tipe date secara native browser
               type={field.type === "phone" ? "tel" : field.type} 
               {...register(field.key, { required: field.required })}
               placeholder={field.placeholder}
               className="bg-background text-foreground"
             />
          )}

          {errors[field.key] && (
            <p className="text-xs text-red-500 font-medium animate-pulse">
              Pertanyaan ini wajib diisi.
            </p>
          )}
        </div>
      )})}

      <Button type="submit" className="w-full font-bold shadow-lg mt-8" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}