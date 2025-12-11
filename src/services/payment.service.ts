import { fetcher } from "./api";
import {
  Payment,
  PaymentListParams,
  PaymentListResponse,
  CheckoutRequest,
} from "@/types/payment";

export const paymentService = {
  // ===== USER ACCESS =====

  /**
   * Checkout (Create Transaction)
   * Mendapatkan Snap Token / Redirect URL dari backend
   * POST /payments/checkout
   */
  checkout: async (data: CheckoutRequest) => {
    return fetcher<{ message: string; data: Payment }>("/payments/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Riwayat Pembayaran User Login
   * GET /payments/me
   */
  getMyPayments: async () => {
    return fetcher<{ success: boolean; data: Payment[] }>("/payments/me");
  },

  // ===== ADMIN ACCESS =====

  /**
   * [ADMIN] List Semua Transaksi
   * GET /payments
   */
  adminListPayments: async (params?: PaymentListParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.userId) query.append("userId", params.userId);
    if (params?.courseId) query.append("courseId", params.courseId);
    if (params?.status) query.append("status", params.status);

    return fetcher<PaymentListResponse>(`/payments?${query.toString()}`);
  },

  /**
   * [ADMIN] Detail Transaksi
   * GET /payments/:id
   */
  adminGetPaymentDetail: async (id: string) => {
    return fetcher<{ success: boolean; data: Payment }>(`/payments/${id}`);
  },
};