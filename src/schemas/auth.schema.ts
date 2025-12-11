import { z } from "zod";

// Regex dari backend (auth.validators.ts)
const fullNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’.\s-]+$/;
const usernameRegex = /^[A-Za-z0-9]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",<.>/?\\|`~])(?!.*\s).{8,100}$/;

export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(3, "Username atau email terlalu pendek")
    .max(100, "Username atau email terlalu panjang"),
  password: z
    .string()
    .min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter")
    .regex(fullNameRegex, "Nama lengkap hanya boleh huruf, spasi, titik, koma, dan tanda hubung"),
  username: z
    .string()
    .min(4, "Username minimal 4 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(usernameRegex, "Username hanya boleh huruf dan angka tanpa spasi"),
  email: z
    .string()
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(passwordRegex, "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

export const activationSchema = z.object({
  code: z
    .string()
    .min(4, "Kode minimal 4 karakter")
    .max(10, "Kode maksimal 10 karakter"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token wajib diisi"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(passwordRegex, "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

// Tipe inferensi untuk dipakai di React Hook Form
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ActivationSchema = z.infer<typeof activationSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;