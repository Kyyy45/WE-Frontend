import { z } from "zod";

// --- Regex Pattern (Sesuai Backend) ---
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",<.>/?\\|`~])(?!.*\s).{8,100}$/;
const fullNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’.\s-]+$/;
const usernameRegex = /^[A-Za-z0-9]+$/;

// --- Schemas ---

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username atau Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Minimal 3 karakter")
      .max(100, "Maksimal 100 karakter")
      .regex(fullNameRegex, "Nama hanya boleh huruf, spasi, titik, apostrof"),

    username: z
      .string()
      .min(4, "Minimal 4 karakter")
      .max(30, "Maksimal 30 karakter")
      .regex(usernameRegex, "Hanya huruf dan angka (tanpa spasi/simbol)"),

    email: z.string().email("Format email tidak valid"),

    password: z
      .string()
      .min(8, "Minimal 8 karakter")
      .regex(passwordRegex, "Wajib ada: Huruf Besar, Kecil, Angka, & Simbol"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, "Kode OTP harus 6 digit"),
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
    password: z
      .string()
      .min(8, "Minimal 8 karakter")
      .regex(passwordRegex, "Wajib ada: Huruf Besar, Kecil, Angka, & Simbol"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// --- Types Export ---
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
export type ResendVerificationValues = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
