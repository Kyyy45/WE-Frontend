import { z } from "zod";

// ==========================================
// 1. CONSTANTS & REGEX
// ==========================================

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",<.>/?\\|`~])(?!.*\s).{8,100}$/;
const usernameRegex = /^[A-Za-z0-9]+$/;
const fullNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’.\s-]+$/;

const passwordRules = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(
    passwordRegex,
    "Password harus mengandung huruf kecil, besar, angka, dan simbol"
  );

export const fieldTypes = [
  "text",
  "textarea",
  "number",
  "select",
  "radio",
  "checkbox",
  "date",
  "email",
  "phone",
  "header",
] as const;

// ==========================================
// 2. AUTH SCHEMAS
// ==========================================

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, "Username atau Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3)
      .max(100)
      .regex(fullNameRegex, "Nama hanya huruf dan tanda baca"),
    username: z
      .string()
      .min(4)
      .max(30)
      .regex(usernameRegex, "Username hanya huruf dan angka"),
    email: z.string().email("Format email tidak valid"),
    password: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Kode harus 6 digit"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// ==========================================
// 3. USER PROFILE SCHEMAS
// ==========================================

export const profileSchema = z.object({
  username: z
    .string()
    .min(4)
    .max(30)
    .regex(usernameRegex, "Username hanya huruf dan angka"),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// ==========================================
// 4. FORM BUILDER SCHEMAS (Editor UI)
// ==========================================

const optionSchema = z.object({
  label: z.string().optional(),
  value: z.string().optional(),
});

const fieldSchema = z.object({
  id: z.string(), // ID Frontend (DndKit)
  label: z.string().min(1, "Label pertanyaan wajib diisi"),
  key: z.string().min(1, "Key wajib ada"),
  type: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  options: z.array(optionSchema).optional(),
});

const sectionSchema = z.object({
  id: z.string(), // ID Frontend (DndKit)
  label: z.string().min(1, "Judul header wajib diisi"),
  key: z.string(),
  fields: z.array(fieldSchema),
});

export const formEditorSchema = z.object({
  name: z.string().min(3, "Nama form minimal 3 karakter"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  visibility: z.enum(["public", "authenticated"]),
  sections: z.array(sectionSchema),
});

// ==========================================
// 5. COURSE SCHEMAS
// ==========================================

export const courseSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  level: z.enum(["bk_tk", "sd", "smp", "sma", "umum"] as const),
  isFree: z.boolean(),
  
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  monthlyPrice: z.coerce.number().min(0, "Harga bulanan tidak boleh negatif").optional(),
  
  targetAudience: z.string().optional(),
  
  registrationForm: z.string().optional(),

  benefits: z.array(z.object({ value: z.string() })).optional(),
  syllabus: z.array(z.object({ value: z.string() })).optional(),

  tutorName: z.string().optional(),
  tutorTitle: z.string().optional(),
  tutorBio: z.string().optional(),
});

// ==========================================
// 6. TYPES EXPORT
// ==========================================

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
export type ResendVerificationValues = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export type FormEditorValues = z.infer<typeof formEditorSchema>;
export type FormSectionItem = z.infer<typeof sectionSchema>;

export type CourseFormValues = z.infer<typeof courseSchema>;