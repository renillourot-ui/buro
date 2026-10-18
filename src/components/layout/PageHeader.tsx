import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Shared page header for stand-alone feature pages (dashboard style). */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 pt-10 pb-8 sm:px-6", className)}>
      {eyebrow ? <p className="mb-2 text-xs font-semibold tracking-widest text-accent uppercase">{eyebrow}</p> : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-[0.9375rem] leading-7 text-muted">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
