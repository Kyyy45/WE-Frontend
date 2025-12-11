import { z } from "zod";

// Regex (Copy dari backend)
const usernameRegex = /^[A-Za-z0-9]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",<.>/?\\|`~])(?!.*\s).{8,100}$/;

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(4, "Username minimal 4 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(usernameRegex, "Username hanya boleh huruf dan angka tanpa spasi"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Password lama wajib diisi"),
  newPassword: z
    .string()
    .min(8, "Password baru minimal 8 karakter")
    .regex(passwordRegex, "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

// Schema untuk Admin Update User
export const adminUpdateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter")
    .optional()
    .or(z.literal('')), // handle empty string if needed
  username: z
    .string()
    .min(4, "Username minimal 4 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(usernameRegex, "Username hanya boleh huruf dan angka tanpa spasi")
    .optional()
    .or(z.literal('')),
  role: z.enum(['user', 'admin']).optional(),
  status: z.enum(['pending', 'active', 'suspended']).optional(),
});

// Inferensi Tipe
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type AdminUpdateUserSchema = z.infer<typeof adminUpdateUserSchema>;