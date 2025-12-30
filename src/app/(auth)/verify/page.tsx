import { Suspense } from "react";
import { VerifyForm } from "@/components/auth/verify-email-form";
import { AuthImage } from "@/components/auth/auth-image";
import { Logo } from "@/components/layout/logo";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense
              fallback={
                <div className="flex justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              <VerifyForm />
            </Suspense>
          </div>
        </div>
      </div>
      <AuthImage />
    </div>
  );
}
