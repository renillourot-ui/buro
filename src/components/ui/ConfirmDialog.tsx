"use client";

import { X } from "lucide-react";
import { Button } from "./Button";
import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Accessible confirmation dialog: focus management, Escape, backdrop click. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="presentation"
    >
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" className="panel w-full max-w-sm p-5 shadow-pop">
        <div className="flex items-start justify-between gap-3">
          <h2 id="confirm-title" className="text-base font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="sm" aria-label="Close dialog" onClick={onCancel} icon={<X className="h-4 w-4" />} />
        </div>
        <p id="confirm-desc" className="mt-1 text-sm text-muted">
          {description}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "danger-ghost" : "primary"} size="sm" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
