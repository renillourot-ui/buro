"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

/** Accessible native select styled for the dark theme. */
export function Select({ value, options, onChange, label, className, disabled, size = "md" }: SelectProps) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        aria-label={label}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-lg border border-border bg-raised font-medium text-ink transition-colors",
          "hover:border-border-strong disabled:opacity-50",
          "pl-3 pr-8 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-0",
          size === "sm" ? "h-8 text-[0.8125rem]" : "h-9 text-sm",
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" aria-hidden />
    </label>
  );
}

interface SegmentedControlProps {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentedControl({ value, options, onChange, className, size = "sm" }: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Selection"
      className={cn("inline-flex rounded-lg border border-border bg-raised p-0.5", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-[6px] px-2.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-0",
              size === "sm" ? "h-7 text-[0.75rem]" : "h-9 text-sm",
              active ? "bg-accent/15 text-accent-hover" : "text-muted hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-ink", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-border-strong bg-raised transition-colors checked:border-accent checked:bg-accent before:absolute focus-visible:outline-2 focus-visible:outline-accent"
        style={{
          backgroundImage: checked ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2307080b' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")" : undefined,
          backgroundSize: "70%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {label}
    </label>
  );
}
