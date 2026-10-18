"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { MouseEventHandler } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger-ghost" | "accent-soft";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-colors " +
  "disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-accent " +
  "focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-hover shadow-panel",
  secondary: "border border-border bg-raised text-ink hover:border-border-strong hover:bg-hover",
  ghost: "text-muted hover:bg-hover hover:text-ink",
  "danger-ghost": "text-danger hover:bg-danger/10",
  "accent-soft": "border border-accent-border bg-accent-soft text-accent-hover hover:bg-accent/20",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[0.8125rem]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/** Navigation-styled as a button. */
export function LinkButton({ href, variant = "primary", size = "md", className, children, icon, ariaLabel, onClick }: LinkButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {icon}
      {children}
    </Link>
  );
}
