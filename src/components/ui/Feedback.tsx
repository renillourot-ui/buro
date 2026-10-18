"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={"flex flex-col items-center justify-center px-6 py-10 text-center " + (className ?? "")}>
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-raised text-muted" aria-hidden>
        {icon}
      </div>
      <h3 className="text-[0.9375rem] font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

/** Honest error display — never fakes a happy path. */
export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  className,
  compact = false,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={
        "flex flex-col items-start gap-1.5 rounded-xl border border-danger/30 bg-danger/10 " +
        (compact ? "px-3 py-2" : "gap-2 p-3.5") +
        (className ? " " + className : "")
      }
    >
      <p className="text-sm font-medium text-danger">{title}</p>
      <p className="text-[0.8125rem] leading-5 text-muted">{message}</p>
      {onRetry ? (
        <Button variant="accent-soft" size="sm" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-border bg-raised px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">
      {children}
    </kbd>
  );
}
