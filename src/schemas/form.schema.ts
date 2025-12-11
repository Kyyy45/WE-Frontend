import { z } from "zod";

const fieldTypes = [
  'text',
  'textarea',
  'number',
  'select',
  'radio',
  'checkbox',
  'date',
  'email',
  'phone',
] as const;

// Regex Key: Huruf depan wajib huruf, sisanya boleh huruf/angka/underscore
const keyRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;

// Schema untuk Opsi (Select/Radio)
const optionSchema = z.object({
  label: z.string().min(1, "Label opsi wajib diisi"),
  value: z.string().min(1, "Value opsi wajib diisi"),
});

// Schema untuk Satu Field
const formFieldSchema = z.object({
  key: z
    .string()
    .min(1, "Key field wajib diisi")
    .regex(keyRegex, "Key hanya boleh huruf, angka, underscore, dan diawali huruf"),
  label: z.string().min(1, "Label field wajib diisi"),
  type: z.enum(fieldTypes),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  options: z.array(optionSchema).optional(),
  order: z.number().optional(),
});

// Schema Create/Update Form (Admin)
export const formSchema = z.object({
  name: z
    .string()
    .min(3, "Nama form minimal 3 karakter")
    .max(150, "Nama form maksimal 150 karakter"),
  description: z
    .string()
    .max(2000, "Deskripsi maksimal 2000 karakter")
    .optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  visibility: z.enum(['public', 'authenticated']).default('public'),
  fields: z
    .array(formFieldSchema)
    .min(1, "Form harus memiliki minimal satu field"),
});

// Inferensi Tipe
export type FormFieldSchema = z.infer<typeof formFieldSchema>;
export type FormSchema = z.infer<typeof formSchema>;