import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label ?? "Loading"} className="inline-flex">
      <Loader2 className={cn("h-4 w-4 animate-spin text-accent", className)} aria-hidden />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} aria-hidden />;
}

/** Stack of skeleton lines mimicking a markdown answer while AI is working. */
export function MarkdownSkeleton() {
  return (
    <div className="space-y-3 py-1" aria-hidden>
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-5/6" />
      <div className="h-[4.5rem] w-full">
        <LoadingSkeleton className="h-full w-full rounded-xl" />
      </div>
      <LoadingSkeleton className="h-4 w-2/3" />
    </div>
  );
}
