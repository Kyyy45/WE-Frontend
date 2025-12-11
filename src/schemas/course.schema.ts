import { z } from "zod";

const levelEnum = ['bk_paud', 'sd', 'smp', 'sma', 'umum'] as const;

// Schema Dasar
const baseCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(150, "Judul maksimal 150 karakter"),
  description: z
    .string()
    .max(2000, "Deskripsi maksimal 2000 karakter")
    .optional(),
  level: z.enum(levelEnum), 
  isFree: z.boolean().default(false),
  price: z.coerce
    .number()
    .min(0, "Harga minimal 0")
    .optional(),
});

/**
 * Validasi Create & Update Course
 * Menggunakan refine untuk logika: "Jika Gratis, harga tidak boleh > 0"
 */
export const courseSchema = baseCourseSchema.refine(
  (data) => {
    if (data.isFree && data.price && data.price > 0) {
      return false;
    }
    return true;
  },
  {
    message: "Course gratis tidak boleh memiliki harga > 0",
    path: ["price"], // Error akan muncul di field price
  }
);

// Untuk Update (Partial), kita buat semua field optional tapi tetap validasi logika price
export const updateCourseSchema = baseCourseSchema
  .partial()
  .refine(
    (data) => {
      // Validasi logika harga jika user mengupdate isFree atau price
      if (data.isFree === true && data.price && data.price > 0) {
        return false;
      }
      return true;
    },
    {
      message: "Course gratis tidak boleh memiliki harga > 0",
      path: ["price"],
    }
  );

export type CourseSchema = z.infer<typeof courseSchema>;
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;