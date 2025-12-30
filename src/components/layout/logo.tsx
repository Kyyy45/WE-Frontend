/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
}

export const Logo = ({
  className,
  imageClassName,
  textClassName,
}: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center",
          "p-1.5",
          "rounded-full",
          "border border-border/60",
          "bg-foreground dark:bg-primary/10 ",
          "shadow-sm dark:shadow-primary/5"
        )}
      >
        <img
          src="/logo.png"
          alt="Worldpedia Logo"
          className={cn("h-6 md:h-7 w-auto object-contain", imageClassName)}
        />
      </div>

      <div
        className={cn(
          "flex flex-col justify-center leading-[0.9]",
          textClassName
        )}
      >
        <span className="font-bold text-base md:text-lg tracking-tight text-foreground uppercase">
          Worldpedia
        </span>
        <span className="font-medium text-[8px] md:text-[9px] tracking-[0.25em] text-foreground uppercase opacity-90">
          Education
        </span>
      </div>
    </div>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center p-1.5 rounded-xl border border-border/60 bg-background/80 shadow-sm dark:shadow-primary/5",
        className
      )}
    >
      <img
        src="/logo.png"
        alt="Worldpedia Icon"
        className="size-6 md:size-7 object-contain"
      />
    </div>
  );
};
