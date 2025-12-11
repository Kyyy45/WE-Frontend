import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import { deleteCookie } from "@/lib/cookies";
import {
  LoginRequest,
  RegisterRequest,
  ActivationVerifyRequest,
  ActivationSendRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

/**
 * Hook untuk Login
 */
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {
      toast.success("Login berhasil!");
      // Invalidate query 'me' agar data user ter-refresh di seluruh aplikasi
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/dashboard"); // Redirect ke dashboard setelah login
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal login, periksa kembali data Anda.");
    },
  });
};

/**
 * Hook untuk Register
 */
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // Data berisi { userId, email } dari backend
      toast.success("Registrasi berhasil! Silakan cek email untuk kode aktivasi.");
      // Redirect ke halaman aktivasi dengan membawa email (opsional, via query param)
      router.push(`/activation?email=${encodeURIComponent(data.data?.email || "")}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal melakukan registrasi.");
    },
  });
};

/**
 * Hook untuk Verifikasi Aktivasi Akun
 */
export const useVerifyActivation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ActivationVerifyRequest) => authService.verifyActivation(data),
    onSuccess: () => {
      toast.success("Akun berhasil diaktifkan! Silakan login.");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Kode aktivasi salah atau kedaluwarsa.");
    },
  });
};

/**
 * Hook untuk Kirim Ulang Kode Aktivasi
 */
export const useResendActivation = () => {
  return useMutation({
    mutationFn: (data: ActivationSendRequest) => authService.sendActivationCode(data),
    onSuccess: () => {
      toast.success("Kode aktivasi baru telah dikirim ke email Anda.");
    },
    onError: (error: ApiError) => {
      // Backend mungkin mengembalikan success meskipun email tidak ada (security practice),
      // tapi jika error 500/400 muncul, kita tangkap di sini.
      toast.error(error.message || "Gagal mengirim ulang kode.");
    },
  });
};

/**
 * Hook untuk Logout
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // 1. Hapus Cookie Client-Side (PENTING!)
      deleteCookie("accessToken");

      // 2. Bersihkan Cache React Query
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.clear(); // Bersihkan semua cache untuk keamanan

      toast.success("Anda telah keluar.");
      
      // 3. Redirect ke Login
      router.replace("/login"); // Gunakan replace agar tidak bisa back
    },
    onError: (error: ApiError) => {
      console.error("Logout error", error);
      // Tetap paksa logout di sisi client meskipun server error
      deleteCookie("accessToken");
      queryClient.clear();
      router.replace("/login");
    },
  });
};

/**
 * Hook untuk Forgot Password (Request Link)
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success("Jika email terdaftar, instruksi reset password telah dikirim.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal memproses permintaan.");
    },
  });
};

/**
 * Hook untuk Reset Password (Submit Token & Password Baru)
 */
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success("Password berhasil diubah. Silakan login dengan password baru.");
      router.push("/login");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal mereset password. Token mungkin kedaluwarsa.");
    },
  });
};