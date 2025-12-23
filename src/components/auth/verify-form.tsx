"use client" // Wajib ada

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation" // Tambahan
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner" // Tambahan
import { api } from "@/lib/axios" // Tambahan
import { AxiosError } from "axios" // Tambahan
import { Loader2 } from "lucide-react" // Tambahan

export function VerifyForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const [isLoading, setIsLoading] = React.useState(false)
  const [otpValue, setOtpValue] = React.useState("") 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otpValue.length < 6) {
      toast.error("Masukkan 6 digit kode OTP")
      return
    }

    setIsLoading(true)
    try {
      // Backend: /auth/activation/verify
      await api.post('/auth/activation/verify', {
        email: emailFromUrl,
        code: otpValue
      })
      
      toast.success("Aktivasi berhasil! Silakan login.")
      router.push('/login')
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Kode salah atau kadaluarsa")
        } else {
            toast.error("Gagal verifikasi")
        }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Resend
  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!emailFromUrl) return toast.error("Email tidak ditemukan")
    
    try {
        await api.post('/auth/activation/send', { email: emailFromUrl })
        toast.success("Kode baru telah dikirim ke email")
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Gagal mengirim ulang kode")
        } else {
            toast.error("Gagal mengirim ulang kode")
        }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Enter verification code</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a 6-digit code to your email <span className="font-medium text-foreground">{emailFromUrl}</span>.
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            {/* Tambahkan value & onChange agar terkoneksi dengan state */}
            <InputOTP 
                maxLength={6} 
                id="otp" 
                required 
                value={otpValue}
                onChange={(val) => setOtpValue(val)}
                disabled={isLoading}
            >
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify"}
          </Button>
          
          <FieldDescription className="text-center">
            Didn&apos;t receive the code? <a href="#" onClick={handleResend} className="underline hover:text-foreground">Resend</a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}