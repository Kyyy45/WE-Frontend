/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

const AUTH_IMAGE_PATH = "/facility/about.png";

interface AuthImageProps {
  alt?: string;
  className?: string;
}

export function AuthImage({ alt = "Auth Image", className }: AuthImageProps) {
  return (
    <div className={cn("bg-muted relative hidden lg:block", className)}>
      <img
        src={AUTH_IMAGE_PATH}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  );
}
