import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "default" | "light";

interface LogoProps {
  className?: string;
  /** Override default responsive height */
  imageClassName?: string;
  /** `light` — white wordmark for dark backgrounds (footer, dark sections) */
  variant?: LogoVariant;
  /** Link target. Pass `false` when Logo is wrapped by another link. Default: "/" */
  href?: string | false;
}

const logoImageClassName = (imageClassName?: string) =>
  cn(
    "w-auto object-contain",
    "h-16 sm:h-[4.5rem]",
    "lg:h-24 xl:h-28",
    imageClassName
  );

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden",
        "h-10 w-11 sm:h-11 sm:w-12",
        className
      )}
      aria-hidden
    >
      <Image
        src="/logo.png"
        alt=""
        width={280}
        height={112}
        className="h-full w-[9.5rem] max-w-none object-cover object-left"
      />
    </span>
  );
}

function LogoWordmarkLight({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 sm:gap-3",
        className
      )}
    >
      <LogoMark />
      <span className="text-[1.35rem] font-bold leading-none tracking-tight sm:text-2xl">
        <span className="text-white">Shubh</span>
        <span className="text-gradient-brand">Digi</span>
      </span>
    </span>
  );
}

/**
 * Native image: 220×88 (2.5:1), transparent background.
 * Use `variant="light"` on dark surfaces so the wordmark stays visible.
 */
export function Logo({
  className,
  imageClassName,
  variant = "default",
  href = "/",
}: LogoProps) {
  const image =
    variant === "light" ? (
      <LogoWordmarkLight className={className} />
    ) : (
      <Image
        src="/logo.png"
        alt="ShubhDigi"
        width={280}
        height={112}
        className={logoImageClassName(imageClassName)}
        priority
      />
    );

  if (href === false) {
    return (
      <span className={cn("inline-flex shrink-0 items-center", className)}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity hover:opacity-85",
        variant === "default" && className
      )}
      aria-label="ShubhDigi home"
    >
      {image}
    </Link>
  );
}
