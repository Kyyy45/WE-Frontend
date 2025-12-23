import { VerifyForm } from "@/components/auth/verify-form";
import { AuthImage } from "@/components/auth/auth-image";
import { Logo } from "@/components/layout/logo";
import Link from "next/link";

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
            <VerifyForm />
          </div>
        </div>
      </div>
      <AuthImage />
    </div>
  );
}
