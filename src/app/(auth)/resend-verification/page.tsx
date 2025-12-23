import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { AuthImage } from "@/components/auth/auth-image";
import { Logo } from "@/components/layout/logo";
import Link from "next/link";

export default function ResendPage() {
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
            <ResendVerificationForm />
          </div>
        </div>
      </div>
      <AuthImage />
    </div>
  );
}
