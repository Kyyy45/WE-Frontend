import { z } from "zod";

const paymentMethodEnum = ['bank_transfer', 'qris'] as const;
const channelEnum = ['mandiri', 'other'] as const;

export const checkoutSchema = z.object({
  courseId: z
    .string()
    .min(1, "Course ID wajib diisi"),
  // PERBAIKAN: Hapus errorMap, biarkan default message Zod
  paymentMethod: z.enum(paymentMethodEnum),
  // PERBAIKAN: Hapus errorMap
  channel: z
    .enum(channelEnum)
    .optional(),
}).refine((data) => {
  // Jika metode bank_transfer, channel wajib dipilih
  if (data.paymentMethod === 'bank_transfer' && !data.channel) {
    return false;
  }
  return true;
}, {
  message: "Pilih bank tujuan untuk transfer",
  path: ["channel"],
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;