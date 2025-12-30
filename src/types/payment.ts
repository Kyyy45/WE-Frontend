export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled";

// Harus match dengan backend validator
export type PaymentMethod = "bank_transfer" | "qris";
export type PaymentChannel = "mandiri" | "other";

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId?: string | null;

  orderId: string;
  amount: number; // Backend me-return 'amount' (mapping dari grossAmount)
  currency: string;

  status: PaymentStatus;
  method: PaymentMethod;
  channel?: PaymentChannel;

  snapToken?: string | null;
  snapRedirectUrl?: string | null;

  createdAt: string;
  updatedAt: string;
}