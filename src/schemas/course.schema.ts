import { z } from "zod";

const levelEnum = ['bk_paud', 'sd', 'smp', 'sma', 'umum'] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(150, "Judul maksimal 150 karakter"),
  description: z
    .string()
    .max(2000, "Deskripsi maksimal 2000 karakter")
    .optional(),
  level: z.enum(levelEnum), 
  isFree: z.boolean(),
  price: z.number()
    .min(0, "Harga minimal 0")
    .optional(),
}).refine(
  (data) => {
    if (data.isFree && data.price && data.price > 0) {
      return false;
    }
    return true;
  },
  {
    message: "Course gratis harus memiliki harga 0",
    path: ["price"],
  }
);

// Schema untuk Update (Partial)
export const updateCourseSchema = courseSchema.partial().refine(
  (data) => {
    if (data.isFree === true && data.price && data.price > 0) {
      return false;
    }
    return true;
  },
  {
    message: "Course gratis harus memiliki harga 0",
    path: ["price"],
  }
);

export type CourseSchema = z.infer<typeof courseSchema>;
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;