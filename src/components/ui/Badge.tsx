import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-raised text-muted",
  accent: "border-accent-border bg-accent-soft text-accent-hover",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  info: "border-info/30 bg-info/10 text-info",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: "easy" | "medium" | "hard" }) {
  const tone = difficulty === "easy" ? "success" : difficulty === "medium" ? "warning" : "danger";
  return (
    <Badge tone={tone as Tone}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {difficulty}
    </Badge>
  );
}
