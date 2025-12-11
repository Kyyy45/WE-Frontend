import { PaginatedResult, PaginationParams } from "./api";

// Enum sesuai backend
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'qris';
export type PaymentChannel = 'mandiri' | 'other'; // 'other' biasanya untuk Permata di mode sandbox/simple

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId?: string | null;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  channel?: PaymentChannel | null;
  
  // Snap Info
  snapToken?: string | null;
  snapRedirectUrl?: string | null;
  
  // Data Populated (Optional)
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
  };

  createdAt: string;
  updatedAt: string;
}

// REQUEST PAYLOADS

export interface CheckoutRequest {
  courseId: string;
  paymentMethod: PaymentMethod;
  channel?: PaymentChannel;
}

// PARAMS & RESPONSE (Admin/User)

export interface PaymentListParams extends PaginationParams {
  userId?: string;
  courseId?: string;
  status?: PaymentStatus;
}

export type PaymentListResponse = PaginatedResult<Payment>;