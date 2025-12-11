import { z } from "zod";

// Enum values sesuai backend
const statusEnum = ['pending', 'active', 'cancelled', 'expired', 'completed'] as const;

// 1. Schema untuk User Enroll (Hanya butuh courseId)
export const userEnrollSchema = z.object({
  courseId: z
    .string()
    .min(1, "Course ID wajib diisi"),
});

// 2. Schema untuk Admin Create Manual Enrollment
export const adminCreateEnrollmentSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID wajib diisi"),
  courseId: z
    .string()
    .min(1, "Course ID wajib diisi"),
  status: z
    .enum(statusEnum)
    .optional(), // Default backend biasanya 'active'
});

// 3. Schema untuk Admin Update Status
export const adminUpdateEnrollmentStatusSchema = z.object({
  status: z.enum(statusEnum),
});

// Inferensi Tipe
export type UserEnrollSchema = z.infer<typeof userEnrollSchema>;
export type AdminCreateEnrollmentSchema = z.infer<typeof adminCreateEnrollmentSchema>;
export type AdminUpdateEnrollmentStatusSchema = z.infer<typeof adminUpdateEnrollmentStatusSchema>;