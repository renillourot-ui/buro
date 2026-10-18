"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

/**
 * Progressive hint panel — reveals one hint at a time on demand, so learning
 * happens before full answers. Used by lessons and challenges alike.
 */
export function HintPanel({
  hints,
  title = "Hints",
  className,
  action,
}: {
  hints: string[];
  title?: string;
  className?: string;
  action?: ReactNode;
}) {
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= hints.length;
  const next = hints[revealed];

  return (
    <div className={cn("rounded-xl border border-accent-border bg-accent-soft/60", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-accent-border/60 px-3.5 py-2">
        <h3 className="text-[0.8125rem] font-semibold text-accent-hover">{title}</h3>
        {!done && next ? (
          <button
            type="button"
            onClick={() => setRevealed((r) => Math.min(r + 1, hints.length))}
            className="flex items-center gap-1 rounded-md border border-accent-border bg-bg/60 px-2 py-1 text-[0.6875rem] font-medium text-accent-hover transition-colors hover:bg-accent/20"
          >
            Show hint {revealed + 1}
            <ChevronDown className="h-3 w-3" aria-hidden />
          </button>
        ) : null}
      </div>
      <ol className="space-y-2 px-3.5 py-2.5">
        {hints.slice(0, revealed).map((hint, i) => (
          <li key={i} className="flex gap-2 text-[0.8125rem] leading-6 text-ink/90">
            <span className="font-mono text-xs text-accent">{i + 1}.</span>
            <span>{hint}</span>
          </li>
        ))}
        {!done && revealed === 0 ? (
          <li className="text-[0.8125rem] text-muted">No hints revealed yet — try the problem first.</li>
        ) : null}
        {action ? <li className="pt-1">{action}</li> : null}
      </ol>
    </div>
  );
}
