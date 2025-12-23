"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: ""
  })

  // Jika token tidak ada di URL, redirect atau beri peringatan
  React.useEffect(() => {
    if (!token) {
        toast.error("Token reset password tidak ditemukan atau tidak valid.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) return toast.error("Token invalid")
    if (formData.password !== formData.confirmPassword) {
        return toast.error("Password tidak cocok")
    }

    setIsLoading(true)
    try {
      // Endpoint Backend: src/modules/auth/auth.routes.ts -> /password/reset
      await api.post('/auth/password/reset', {
        token: token,
        password: formData.password
      })
      
      toast.success("Password berhasil diubah! Silakan login.")
      router.push('/login')
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal mereset password")
      } else {
        toast.error("Terjadi kesalahan sistem")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Set new password</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Please enter your new password below.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <div className="relative">
                <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    disabled={isLoading}
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
             <div className="relative">
                <Input 
                    id="confirmPassword" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    disabled={isLoading}
                />
            </div>
          </Field>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}