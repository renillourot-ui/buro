"use client";

import { GraduationCap, Bug, Trophy } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { TutorMode } from "@/types";

const MODES: Array<{ value: TutorMode; label: string; description: string; icon: typeof GraduationCap }> = [
  { value: "learn", label: "Learn", description: "Concepts, examples and practice.", icon: GraduationCap },
  { value: "debug", label: "Debug", description: "Root-cause errors together.", icon: Bug },
  { value: "challenge", label: "Challenge", description: "Progressive-hint problems.", icon: Trophy },
];

export function ModeSelector({
  value,
  onChange,
}: {
  value: TutorMode;
  onChange: (mode: TutorMode) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Tutoring mode" className="grid gap-1.5">
      {MODES.map(({ value: mode, label, description, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(mode)}
            className={cn(
              "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-0",
              active
                ? "border-accent-border bg-accent-soft"
                : "border-border bg-raised hover:border-border-strong hover:bg-hover",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border",
                active ? "border-accent-border bg-accent/20 text-accent-hover" : "border-border bg-surface text-muted",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0">
              <span className={cn("block text-[0.8125rem] font-semibold", active ? "text-accent-hover" : "text-ink")}>
                {label}
              </span>
              <span className="block text-[0.6875rem] leading-4 text-muted">{description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
